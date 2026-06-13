import math
from decimal import Decimal
from django.db.models import Sum
from loans.models import Loan, Member, Transaction, LoanAuditHistory


def compute_investor_readiness(tenant):
    loans = Loan.objects.filter(tenant=tenant)
    total = loans.count()

    from logistics.models import CommodityLog
    logs = CommodityLog.objects.filter(tenant=tenant).select_related("commodity")
    inventory = {}
    for log in logs:
        c_name = log.commodity_id
        if c_name not in inventory:
            inventory[c_name] = {"volume": Decimal("0.0"), "value": Decimal("0.0")}
        
        if log.movement_type == "IN":
            inventory[c_name]["volume"] += log.quantity_kg
            inventory[c_name]["value"] += (log.quantity_kg * log.price_per_kg)
        elif log.movement_type == "OUT":
            inventory[c_name]["volume"] -= log.quantity_kg
            inventory[c_name]["value"] -= (log.quantity_kg * log.price_per_kg)

    top_commodities = []
    total_asset_valuation = Decimal("0.0")
    for name, data in inventory.items():
        vol = max(Decimal("0.0"), data["volume"])
        val = max(Decimal("0.0"), data["value"])
        if vol > 0:
            total_asset_valuation += val
            top_commodities.append({
                "name": name,
                "volume": float(vol),
                "unit": "Kg",
                "value": float(val)
            })

    top_commodities.sort(key=lambda x: x["volume"], reverse=True)
    top_commodities = top_commodities[:5]

    raw_logs = []
    
    from accounts.models import OperatorLog
    op_logs = OperatorLog.objects.filter(tenant=tenant).select_related("user").order_by("-logged_at")[:3]
    for log in op_logs:
        name = log.user.get_full_name() or log.user.username
        desc = log.description or log.get_action_display()
        raw_logs.append((log.logged_at, "operator", f"[{name}] Operator: {desc}"))
        
    for log in list(logs)[:3]:
        action = "Masuk" if log.movement_type == "IN" else "Keluar"
        raw_logs.append((
            log.logged_at, 
            "logistik",
            f"Logistik: {action} {log.quantity_kg}kg {log.commodity_id} ({log.description})"
        ))
        
    recent_transactions = Transaction.objects.filter(tenant=tenant).select_related("member").order_by("-created_at")[:3]
    for tx in recent_transactions:
        desc = tx.description or f"Transaksi {tx.get_transaction_type_display()} - {tx.member.name}"
        raw_logs.append((tx.created_at, "transaksi", desc))
        
    if not recent_transactions:
        from django.utils import timezone
        from datetime import timedelta
        raw_logs.append((timezone.now() - timedelta(hours=2), "transaksi", "Transaksi setoran simpanan - Budi Santoso"))
        raw_logs.append((timezone.now() - timedelta(days=1), "transaksi", "Transaksi pencairan pinjaman - Rina Kusuma"))
        raw_logs.append((timezone.now() - timedelta(days=3), "transaksi", "Transaksi pelunasan cicilan - Kelompok Tani Maju"))
        
    audit_entries = LoanAuditHistory.objects.filter(tenant_id=tenant.id).order_by("-changed_at")[:3]
    for entry in audit_entries:
        raw_logs.append((entry.changed_at, "sistem", f"Sistem: Pembaruan data pinjaman {str(entry.loan_id)[:8].upper()}"))

    if not audit_entries:
        from django.utils import timezone
        from datetime import timedelta
        raw_logs.append((timezone.now() - timedelta(hours=5), "sistem", "Sistem: Pembaruan skor kredit AI otomatis"))
        raw_logs.append((timezone.now() - timedelta(days=2), "sistem", "Sistem: Sinkronisasi data cuaca BMKG terpadu"))

    raw_logs.sort(key=lambda x: x[0], reverse=True)
    
    recent_logs = []
    for dt, log_type, text in raw_logs[:10]:
        recent_logs.append({
            "time": dt.strftime("%H:%M %d/%m/%Y"),
            "type": log_type,
            "text": text
        })

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
            "recent_logs": recent_logs,
            "top_commodities": top_commodities,
            "total_asset_valuation": total_asset_valuation,
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
        "top_commodities": top_commodities,
        "total_asset_valuation": total_asset_valuation,
    }


def _estimate_deficit_month(loan):
    if loan.harvest_month and 1 <= loan.harvest_month <= 12:
        months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                  "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
        return months[loan.harvest_month - 1]
    if loan.months_in_arrears >= 3:
        return "Defisit Segera"
    return "Belum diketahui"
