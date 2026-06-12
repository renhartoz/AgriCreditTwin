from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import IntegrityError
from .models import Member, Loan, LoanAuditHistory
from .serializers import (
    LoanApplicationSerializer,
    LoanSerializer,
    LoanAuditSerializer,
    PortfolioSerializer,
    TenantRegistrationSerializer,
    StaffInvitationSerializer,
)
from .permissions import IsOperatorOrAdmin, IsAdminOrInvestor, IsAuditor, IsAdmin
from .services import (
    validate_avs,
    run_monte_carlo_simulation,
    compute_investor_readiness,
    compute_trust_score,
    register_tenant,
    invite_operator,
)


@api_view(["POST"])
@permission_classes([IsOperatorOrAdmin])
def loan_apply(request):
    serializer = LoanApplicationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    tenant = request.tenant

    if not tenant:
        return Response(
            {"error": "Tenant context required."},
            status=status.HTTP_403_FORBIDDEN,
        )

    try:
        member = Member.objects.get(id=data["member_id"], tenant=tenant)
    except Member.DoesNotExist:
        return Response(
            {"error": "Member not found in this cooperative."},
            status=status.HTTP_404_NOT_FOUND,
        )

    avs_result = validate_avs(
        commodity=data["commodity"],
        declared_yield_tons=data["declared_yield_tons"],
        land_area_ha=member.land_area_ha,
    )

    if not avs_result["passed"]:
        loan = Loan.objects.create(
            tenant=tenant,
            member=member,
            amount=data["amount"],
            tenor_months=data["tenor_months"],
            declared_yield_tons=data["declared_yield_tons"],
            commodity=data["commodity"],
            planting_month=data["planting_month"],
            harvest_month=data["harvest_month"],
            monthly_living_cost=data["monthly_living_cost"],
            monthly_farming_cost=data["monthly_farming_cost"],
            officer=request.user,
            status="rejected",
            avs_flag=True,
        )
        return Response(
            {
                "loan_id": str(loan.id),
                "avs": avs_result,
                "message": "Loan submission blocked by Agricultural Verification Score.",
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    sim = run_monte_carlo_simulation(
        land_area_ha=member.land_area_ha,
        commodity=data["commodity"],
        planting_month=data["planting_month"],
        harvest_month=data["harvest_month"],
        tenor_months=data["tenor_months"],
        loan_amount=data["amount"],
        monthly_living_cost=data["monthly_living_cost"],
        monthly_farming_cost=data["monthly_farming_cost"],
    )

    loan = Loan.objects.create(
        tenant=tenant,
        member=member,
        amount=data["amount"],
        tenor_months=data["tenor_months"],
        declared_yield_tons=data["declared_yield_tons"],
        commodity=data["commodity"],
        planting_month=data["planting_month"],
        harvest_month=data["harvest_month"],
        monthly_living_cost=data["monthly_living_cost"],
        monthly_farming_cost=data["monthly_farming_cost"],
        officer=request.user,
        status=sim["loan_status"],
        simulation_result=sim["simulation_result"],
    )

    return Response(
        {
            "loan_id": str(loan.id),
            "status": sim["loan_status"],
            "avs": avs_result,
            "simulation": sim["simulation_result"],
        },
        status=status.HTTP_201_CREATED,
    )


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


@api_view(["GET"])
@permission_classes([IsAuditor])
def audit_loans(request):
    tenant = request.tenant
    if not tenant:
        return Response(
            {"error": "Tenant context required."},
            status=status.HTTP_403_FORBIDDEN,
        )

    qs = LoanAuditHistory.objects.filter(tenant_id=tenant.id).order_by("-changed_at")

    loan_id = request.query_params.get("loan_id")
    if loan_id:
        qs = qs.filter(loan_id=loan_id)

    officer_id = request.query_params.get("officer_id")
    if officer_id:
        qs = qs.filter(officer_id=officer_id)

    date_from = request.query_params.get("date_from")
    if date_from:
        qs = qs.filter(changed_at__gte=date_from)

    date_to = request.query_params.get("date_to")
    if date_to:
        qs = qs.filter(changed_at__lte=date_to)

    serializer = LoanAuditSerializer(qs[:200], many=True)
    return Response(serializer.data)


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

