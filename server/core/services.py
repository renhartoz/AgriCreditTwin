import math
import numpy as np
from decimal import Decimal
from django.db import transaction
from django.db.models import Max, Sum
from django.contrib.auth.models import User
from .models import Tenant, Member, Loan, UserProfile
from .tenant import tenant_context, provision_tenant_schema, sanitize_schema_name


REGIONAL_YIELD_AVERAGES = {
    "rice": 6.0,
    "chili": 8.0,
    "corn": 5.5,
    "soybean": 2.0,
}

STATIC_COMMODITY_PRICES = {
    "rice": 5_500,
    "chili": 25_000,
    "corn": 4_000,
    "soybean": 9_000,
}

MONTE_CARLO_ITERATIONS = 1_000


def validate_avs(commodity, declared_yield_tons, land_area_ha):
    avg = REGIONAL_YIELD_AVERAGES.get(commodity.lower())
    if avg is None:
        return {"passed": True, "message": f"No regional benchmark for '{commodity}', skipping AVS."}

    land = float(land_area_ha)
    if land <= 0:
        return {"passed": False, "flag": "Red Risk Flag", "reason": "Land area must be > 0."}

    expected_max = avg * land * 1.5
    declared = float(declared_yield_tons)

    if declared > expected_max:
        return {
            "passed": False,
            "flag": "Red Risk Flag",
            "reason": (
                f"Declared yield {declared} tons exceeds 1.5x regional average "
                f"({avg} tons/ha × {land} ha × 1.5 = {expected_max} tons). "
                f"Anomaly detected — submission blocked pending officer review."
            ),
            "regional_avg_tons_ha": avg,
            "threshold_tons": expected_max,
            "declared_tons": declared,
        }

    return {"passed": True, "message": "AVS check passed."}


def run_monte_carlo_simulation(
    land_area_ha,
    commodity,
    planting_month,
    harvest_month,
    tenor_months,
    loan_amount,
    monthly_living_cost,
    monthly_farming_cost,
):
    land = float(land_area_ha)
    amount = float(loan_amount)
    living = float(monthly_living_cost)
    farming = float(monthly_farming_cost)

    avg_yield = REGIONAL_YIELD_AVERAGES.get(commodity.lower(), 6.0)
    price_per_kg = STATIC_COMMODITY_PRICES.get(commodity.lower(), 5_500)

    mu_yield = np.log(avg_yield * land) - 0.5 * 0.04
    sigma_yield = 0.2
    mu_price = np.log(price_per_kg) - 0.5 * 0.01
    sigma_price = 0.1

    monthly_installment = amount / tenor_months
    deficit_count = 0
    all_min_cf = []

    for _ in range(MONTE_CARLO_ITERATIONS):
        sim_yield = np.random.lognormal(mu_yield, sigma_yield)
        sim_price = np.random.lognormal(mu_price, sigma_price)
        harvest_revenue = sim_yield * sim_price * 1_000

        cf = 0.0
        min_cf = float("inf")

        for m in range(1, tenor_months + 1):
            current_month = ((planting_month - 1 + m) % 12) + 1
            revenue = harvest_revenue if current_month == harvest_month else 0.0
            farm_cost = farming if current_month == planting_month else farming * 0.2
            cf = cf + revenue - living - farm_cost - monthly_installment
            min_cf = min(min_cf, cf)

        all_min_cf.append(min_cf)
        if min_cf < 0:
            deficit_count += 1

    deficit_probability = deficit_count / MONTE_CARLO_ITERATIONS
    avg_min_cf = float(np.mean(all_min_cf))
    p5_cf = float(np.percentile(all_min_cf, 5))

    if deficit_probability > 0.5:
        status = "Deficit"
        recommendation = "Post-Harvest Balloon Payment"
        rationale = (
            f"Projected cash flow negative in {deficit_count}/{MONTE_CARLO_ITERATIONS} "
            f"scenarios (P(deficit)={deficit_probability:.1%}). "
            f"Income event concentrated at harvest month {harvest_month}."
        )
        alternative = "Tranche Disbursement aligned to planting calendar"
        loan_status = "restructured"
    elif deficit_probability > 0.2:
        status = "Marginal"
        recommendation = "Reduced Monthly Installment with Grace Period"
        rationale = (
            f"Moderate risk: deficit in {deficit_count}/{MONTE_CARLO_ITERATIONS} scenarios "
            f"(P(deficit)={deficit_probability:.1%}). Consider grace period during non-harvest months."
        )
        alternative = "Post-Harvest Balloon Payment"
        loan_status = "restructured"
    else:
        status = "Surplus"
        recommendation = "Standard Monthly Installment"
        rationale = (
            f"Positive outlook: deficit in only {deficit_count}/{MONTE_CARLO_ITERATIONS} scenarios "
            f"(P(deficit)={deficit_probability:.1%}). Cash flow supports standard repayment."
        )
        alternative = None
        loan_status = "approved"

    return {
        "simulation_result": {
            "status": status,
            "recommendation": recommendation,
            "rationale": rationale,
            "alternative": alternative,
            "metrics": {
                "deficit_probability": round(deficit_probability, 4),
                "avg_minimum_cashflow": round(avg_min_cf),
                "p5_minimum_cashflow": round(p5_cf),
                "iterations": MONTE_CARLO_ITERATIONS,
            },
        },
        "loan_status": loan_status,
    }


@transaction.atomic
def compute_trust_score(nik, requesting_tenant_id):
    tenants = Tenant.objects.filter(is_active=True).exclude(id=requesting_tenant_id)
    worst_arrears = 0

    for t in tenants:
        with tenant_context(t):
            result = Loan.objects.filter(
                member__nik=nik,
                status__in=["disbursed", "defaulted"],
            ).aggregate(max_arrears=Max("months_in_arrears"))

            arrears = result["max_arrears"] or 0
            if arrears > worst_arrears:
                worst_arrears = arrears

    score = max(0, 100 - (worst_arrears * 10))
    return {
        "nik": nik,
        "trust_score": score,
        "months_in_arrears": worst_arrears,
        "tenants_checked": tenants.count(),
    }


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


@transaction.atomic
def register_tenant(coop_name, nomor_induk_koperasi, sk_badan_hukum, username, email, password):
    schema_name = sanitize_schema_name(coop_name)

    if Tenant.objects.filter(name=coop_name).exists():
        raise ValueError("Cooperative name already registered.")
    if Tenant.objects.filter(schema_name=schema_name).exists():
        suffix = 1
        while Tenant.objects.filter(schema_name=f"{schema_name}_{suffix}").exists():
            suffix += 1
        schema_name = f"{schema_name}_{suffix}"

    tenant = Tenant.objects.create(
        name=coop_name,
        schema_name=schema_name,
        nomor_induk_koperasi=nomor_induk_koperasi,
        sk_badan_hukum=sk_badan_hukum,
        is_verified=False
    )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    UserProfile.objects.create(
        user=user,
        tenant=tenant,
        role="admin"
    )

    provision_tenant_schema(tenant)

    return tenant, user


@transaction.atomic
def invite_operator(tenant, name, email):
    default_password = "Koperasi123!"
    username = email.split('@')[0]
    if User.objects.filter(username=username).exists():
        suffix = 1
        while User.objects.filter(username=f"{username}{suffix}").exists():
            suffix += 1
        username = f"{username}{suffix}"

    user = User.objects.create_user(
        username=username,
        email=email,
        password=default_password,
        first_name=name
    )

    UserProfile.objects.create(
        user=user,
        tenant=tenant,
        role="operator"
    )

    return user, default_password

