import math
from decimal import Decimal
from django.db.models import Sum
from loans.models import Loan, Member, Transaction, LoanAuditHistory


def compute_investor_readiness(tenant):
    loans = Loan.objects.filter(tenant=tenant)
    total = loans.count()

    if total == 0:
        return {
            "tenant_id": str(tenant.id),
            "tenant_name": tenant.name,
            "total_loans": 0,
            "total_disbursed": Decimal("0.00"),
            "npl_rate": 0.0,
            "data_completeness": 1.0,
            "investor_readiness_score": 5,
            "loan_status_breakdown": {},
            "active_members": 0,
            "total_defaulted_amount": Decimal("0.00"),
            "total_savings": Decimal("0.00"),
            "high_risk_loans": [],
            "recent_logs": [],
        }

    defaulted = loans.filter(status="defaulted").count()
    npl_rate = defaulted / total

    complete = loans.exclude(simulation_result__isnull=True).count()
    data_completeness = complete / total if total > 0 else 0.0

    raw_score = 5 * (1 - npl_rate) * data_completeness
    irs = max(1, min(5, math.floor(raw_score))) if raw_score > 0 else 1

    status_breakdown = {}
    for status_val, _ in Loan.STATUS_CHOICES:
        count = loans.filter(status=status_val).count()
        if count > 0:
            status_breakdown[status_val] = count

    disbursed_total = (
        loans.filter(status__in=["disbursed", "closed", "defaulted"])
        .aggregate(total=Sum("amount"))["total"]
        or Decimal("0.00")
    )

    active_members = Member.objects.filter(tenant=tenant).count()

    total_defaulted_amount = (
        loans.filter(status="defaulted")
        .aggregate(total=Sum("amount"))["total"]
        or Decimal("0.00")
    )

    total_savings = (
        Transaction.objects.filter(tenant=tenant, transaction_type="savings_deposit")
        .aggregate(total=Sum("amount"))["total"]
        or Decimal("0.00")
    )

    high_risk_qs = loans.filter(
        status__in=["defaulted", "approved", "restructured"]
    ).select_related("member").order_by("-months_in_arrears", "-amount")[:10]

    high_risk_loans = []
    for loan in high_risk_qs:
        pd = 0.0
        if loan.simulation_result and isinstance(loan.simulation_result, dict):
            pd = loan.simulation_result.get("pd", 0.0) or 0.0
        elif loan.months_in_arrears > 0:
            pd = min(0.95, loan.months_in_arrears * 0.15)
        high_risk_loans.append({
            "id": str(loan.id)[:8].upper(),
            "member_name": loan.member.name,
            "pd": round(float(pd) * 100, 1),
            "status": loan.status,
            "deficit_month": _estimate_deficit_month(loan),
            "months_in_arrears": loan.months_in_arrears,
        })

    recent_logs = []
    try:
        audit_entries = LoanAuditHistory.objects.filter(
            tenant_id=tenant.id
        ).order_by("-changed_at")[:10]
        for entry in audit_entries:
            recent_logs.append({
                "time": entry.changed_at.strftime("%H:%M %d/%m/%Y"),
                "text": f"Field '{entry.field_name}' updated for loan {str(entry.loan_id)[:8].upper()}",
            })
    except Exception:
        pass

    if not recent_logs:
        recent_transactions = Transaction.objects.filter(
            tenant=tenant
        ).select_related("member").order_by("-created_at")[:10]
        for tx in recent_transactions:
            desc = tx.description or f"{tx.get_transaction_type_display()} - {tx.member.name}"
            recent_logs.append({
                "time": tx.created_at.strftime("%H:%M %d/%m/%Y"),
                "text": desc,
            })

    return {
        "tenant_id": str(tenant.id),
        "tenant_name": tenant.name,
        "total_loans": total,
        "total_disbursed": disbursed_total,
        "npl_rate": round(npl_rate, 4),
        "data_completeness": round(data_completeness, 4),
        "investor_readiness_score": irs,
        "loan_status_breakdown": status_breakdown,
        "active_members": active_members,
        "total_defaulted_amount": total_defaulted_amount,
        "total_savings": total_savings,
        "high_risk_loans": high_risk_loans,
        "recent_logs": recent_logs,
    }


def _estimate_deficit_month(loan):
    if loan.harvest_month and 1 <= loan.harvest_month <= 12:
        months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                  "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
        return months[loan.harvest_month - 1]
    if loan.months_in_arrears >= 3:
        return "Defisit Segera"
    return "Belum diketahui"
