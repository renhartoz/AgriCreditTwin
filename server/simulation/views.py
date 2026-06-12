from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.permissions import IsOperatorOrAdmin
from .services import compute_trust_score


class TrustScoreView(APIView):
    permission_classes = [IsOperatorOrAdmin]

    def get(self, request, nik):
        tenant = request.tenant
        if not tenant:
            return Response(
                {"error": "Tenant context required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        result = compute_trust_score(nik, requesting_tenant_id=tenant.id)
        return Response(result)
