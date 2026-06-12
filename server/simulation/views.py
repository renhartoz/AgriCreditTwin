from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from accounts.permissions import IsOperatorOrAdmin
from .services import compute_trust_score


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
