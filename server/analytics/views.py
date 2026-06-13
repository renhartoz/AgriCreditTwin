from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from accounts.permissions import IsAdminOrInvestor
from .serializers import PortfolioSerializer
from .services import compute_investor_readiness


class PortfolioView(APIView):
    permission_classes = [IsAdminOrInvestor]
    serializer_class = PortfolioSerializer

    @extend_schema(
        summary="Investor Readiness Portfolio",
        description="Computes the cooperative's Investor Readiness Score (1-5) based on NPL rate, data completeness, and disbursement volume.",
        responses={200: PortfolioSerializer},
        tags=["Analytics"],
    )
    def get(self, request):
        tenant = request.tenant
        if not tenant:
            return Response(
                {"error": "Tenant context required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        portfolio_data = compute_investor_readiness(tenant)
        serializer = self.serializer_class(portfolio_data)
        return Response(serializer.data)
