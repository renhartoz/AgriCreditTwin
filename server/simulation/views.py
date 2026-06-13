from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from accounts.permissions import IsOperatorOrAdmin
from .services import compute_trust_score, run_cashflow_projection


class TrustScoreView(APIView):
    permission_classes = [IsOperatorOrAdmin]

    @extend_schema(
        summary="Cross-Tenant Trust Score",
        description="Queries all active tenant schemas (excluding the requester's) to find the worst arrears for a given NIK. Returns a 0-100 trust score.",
        responses={200: {"type": "object", "properties": {
            "nik": {"type": "string"},
            "trust_score": {"type": "integer", "minimum": 0, "maximum": 100},
            "months_in_arrears": {"type": "integer"},
            "tenants_checked": {"type": "integer"},
        }}},
        tags=["Simulation"],
    )
    def get(self, request, nik):
        tenant = request.tenant
        if not tenant:
            return Response(
                {"error": "Tenant context required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        result = compute_trust_score(nik, requesting_tenant_id=tenant.id)
        return Response(result)


class CashflowProjectionView(APIView):
    permission_classes = [IsOperatorOrAdmin]

    @extend_schema(
        summary="Monte Carlo Cashflow Projection",
        description="Runs 1,000 Monte Carlo iterations to project monthly cash flow percentiles (P10/P50/P90), probability of default, and risk recommendation.",
        tags=["Simulation"],
    )
    def post(self, request):
        required = ["tenor", "amount", "declared_yield", "living_cost",
                    "farming_cost", "commodity", "planting_month", "harvest_month"]
        missing = [f for f in required if f not in request.data]
        if missing:
            return Response(
                {"error": f"Missing fields: {', '.join(missing)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = run_cashflow_projection(
            tenor=request.data["tenor"],
            amount=request.data["amount"],
            declared_yield=request.data["declared_yield"],
            living_cost=request.data["living_cost"],
            farming_cost=request.data["farming_cost"],
            commodity=request.data["commodity"],
            planting_month=request.data["planting_month"],
            harvest_month=request.data["harvest_month"],
        )
        return Response(result)
