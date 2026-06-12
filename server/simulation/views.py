from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from accounts.permissions import IsOperatorOrAdmin
from .services import compute_trust_score


@api_view(["GET"])
@permission_classes([IsOperatorOrAdmin])
def trust_score(request, nik):
    tenant = request.tenant
    if not tenant:
        return Response(
            {"error": "Tenant context required."},
            status=status.HTTP_403_FORBIDDEN,
        )

    result = compute_trust_score(nik, requesting_tenant_id=tenant.id)
    return Response(result)
