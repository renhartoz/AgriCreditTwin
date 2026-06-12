import numpy as np
from django.db import transaction
from django.db.models import Max
from tenants.models import Tenant
from tenants.tenant import tenant_context
from loans.models import Loan


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
