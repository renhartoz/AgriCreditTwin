from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.db import IntegrityError
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from tenants.models import Tenant
from .serializers import (
    TenantRegistrationSerializer,
    StaffInvitationSerializer,
    SelfRegistrationSerializer,
    VerifyEmailSerializer,
)
from .permissions import IsAdmin
from .services import register_tenant, invite_operator, register_user


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
        description="Creates an operator user with a secure random password in the current tenant schema. Sends credentials to the operator's email via Zoho SMTP.",
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
            user, password = invite_operator(
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
                "message": "Operator invited successfully. Credentials sent via email.",
                "username": user.username,
                "email": user.email,
                "name": user.first_name,
                "role": "operator",
                "default_password": password,
            },
            status=status.HTTP_201_CREATED,
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = SelfRegistrationSerializer

    @extend_schema(
        summary="Self-Register (Admin / Investor / Auditor)",
        description=(
            "Creates a new user account with is_active=False and dispatches an activation "
            "email containing a secure one-time link. The user must click the link or submit "
            "the token via /verify-email/ to activate the account."
        ),
        request=SelfRegistrationSerializer,
        responses={
            201: OpenApiResponse(description="Registration successful. Activation email sent."),
            400: OpenApiResponse(description="Validation error or duplicate email/username."),
        },
        tags=["Auth"],
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        tenant = None
        if data.get("tenant_id"):
            try:
                tenant = Tenant.objects.get(id=data["tenant_id"])
            except Tenant.DoesNotExist:
                return Response(
                    {"error": "Invalid tenant ID."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        try:
            user = register_user(
                username=data["username"],
                email=data["email"],
                password=data["password"],
                role=data["role"],
                tenant=tenant,
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            return Response(
                {"error": "A user with this email or username already exists."},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            {
                "message": "Registration successful. Please check your email to activate your account.",
                "username": user.username,
                "email": user.email,
                "role": data["role"],
                "is_active": user.is_active,
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    serializer_class = VerifyEmailSerializer

    @extend_schema(
        summary="Verify Email / Activate Account",
        description=(
            "Accepts a uidb64 and token from the activation email link. "
            "Validates the token and sets is_active=True if valid."
        ),
        request=VerifyEmailSerializer,
        responses={
            200: OpenApiResponse(description="Account activated successfully."),
            400: OpenApiResponse(description="Invalid or expired token."),
        },
        tags=["Auth"],
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        uidb64 = serializer.validated_data["uidb64"]
        token = serializer.validated_data["token"]

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "Invalid activation link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.is_active:
            return Response(
                {"message": "Account is already active."},
                status=status.HTTP_200_OK,
            )

        user.is_active = True
        user.save()

        return Response(
            {"message": "Account activated successfully. You may now log in."},
            status=status.HTTP_200_OK,
        )


class OperatorListView(APIView):
    permission_classes = [IsAdmin]

    @extend_schema(
        summary="List Tenant Team Members",
        description="Returns all users (operators and admins) registered under the current tenant.",
        tags=["Auth"],
    )
    def get(self, request):
        tenant = request.tenant
        if not tenant:
            return Response({"error": "Tenant context required."}, status=status.HTTP_403_FORBIDDEN)

        from .models import UserProfile
        profiles = UserProfile.objects.filter(tenant=tenant).select_related("user").order_by("role", "user__date_joined")
        result = []
        for profile in profiles:
            result.append({
                "id": profile.user.id,
                "name": profile.user.get_full_name() or profile.user.username,
                "email": profile.user.email,
                "username": profile.user.username,
                "role": profile.role,
                "is_active": profile.user.is_active,
                "joined_at": profile.user.date_joined.strftime("%Y-%m-%d"),
            })
        return Response(result)

