import math
from decimal import Decimal
from django.db.models import Sum
from loans.models import Loan


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

    return {
        "tenant_id": str(tenant.id),
        "tenant_name": tenant.name,
        "total_loans": total,
        "total_disbursed": disbursed_total,
        "npl_rate": round(npl_rate, 4),
        "data_completeness": round(data_completeness, 4),
        "investor_readiness_score": irs,
        "loan_status_breakdown": status_breakdown,
    }
