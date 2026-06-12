from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from accounts.permissions import IsAdminOrInvestor
from .serializers import PortfolioSerializer
from .services import compute_investor_readiness


@api_view(["GET"])
@permission_classes([IsAdminOrInvestor])
def portfolio(request):
    tenant = request.tenant
    if not tenant:
        return Response(
            {"error": "Tenant context required."},
            status=status.HTTP_403_FORBIDDEN,
        )

    portfolio_data = compute_investor_readiness(tenant)
    serializer = PortfolioSerializer(portfolio_data)
    return Response(serializer.data)
