from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.db import IntegrityError
from .serializers import TenantRegistrationSerializer, StaffInvitationSerializer
from .permissions import IsAdmin
from .services import register_tenant, invite_operator


class RegisterTenantView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = TenantRegistrationSerializer

    @extend_schema(
        summary="Register New Cooperative (Tenant)",
        description=(
            "Provisions an isolated PostgreSQL schema, creates the first admin user, "
            "and uploads the verification document (PDF). Sets is_verified=False pending SuperAdmin review. "
            "This endpoint consumes multipart/form-data for the file upload."
        ),
        request={
            "multipart/form-data": TenantRegistrationSerializer,
        },
        responses={
            201: OpenApiResponse(description="Tenant registered successfully."),
            400: OpenApiResponse(description="Cooperative name already registered."),
            409: OpenApiResponse(description="Duplicate NIK or email."),
        },
        tags=["Auth"],
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            tenant, user = register_tenant(
                coop_name=data["coop_name"],
                nomor_induk_koperasi=data["nomor_induk_koperasi"],
                sk_badan_hukum=data["sk_badan_hukum"],
                nib=data.get("nib", ""),
                verification_document=data["verification_document"],
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


class InviteOperatorView(APIView):
    permission_classes = [IsAdmin]
    serializer_class = StaffInvitationSerializer

    @extend_schema(
        summary="Invite Cooperative Operator",
        description="Creates an operator user with a default password (Koperasi123!) in the current tenant schema. Returns credentials for demo purposes.",
        request=StaffInvitationSerializer,
        responses={
            201: OpenApiResponse(description="Operator invited with default credentials."),
            403: OpenApiResponse(description="Tenant context required."),
            409: OpenApiResponse(description="Duplicate email."),
        },
        tags=["Auth"],
    )
    def post(self, request):
        tenant = request.tenant
        if not tenant:
            return Response(
                {"error": "Tenant context required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.serializer_class(data=request.data)
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
