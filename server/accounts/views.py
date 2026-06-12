from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import IntegrityError
from .serializers import TenantRegistrationSerializer, StaffInvitationSerializer
from .permissions import IsAdmin
from .services import register_tenant, invite_operator


@api_view(["POST"])
@permission_classes([AllowAny])
def register_tenant_view(request):
    serializer = TenantRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    try:
        tenant, user = register_tenant(
            coop_name=data["coop_name"],
            nomor_induk_koperasi=data["nomor_induk_koperasi"],
            sk_badan_hukum=data["sk_badan_hukum"],
            username=data["username"],
            email=data["email"],
            password=data["password"],
        )
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except IntegrityError:
        return Response(
            {"error": "Cooperative NIK or admin email already exists."},
            status=status.HTTP_409_CONFLICT,
        )

    return Response(
        {
            "message": "Tenant registered successfully.",
            "tenant_id": str(tenant.id),
            "tenant_name": tenant.name,
            "schema_name": tenant.schema_name,
            "username": user.username,
            "role": "admin",
            "is_verified": tenant.is_verified,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([IsAdmin])
def invite_operator_view(request):
    tenant = request.tenant
    if not tenant:
        return Response(
            {"error": "Tenant context required."},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = StaffInvitationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    try:
        user, default_password = invite_operator(
            tenant=tenant,
            name=data["name"],
            email=data["email"],
        )
    except IntegrityError:
        return Response(
            {"error": "A user with this email already exists."},
            status=status.HTTP_409_CONFLICT,
        )

    return Response(
        {
            "message": "Operator invited successfully.",
            "username": user.username,
            "email": user.email,
            "name": user.first_name,
            "role": "operator",
            "default_password": default_password,
        },
        status=status.HTTP_201_CREATED,
    )
