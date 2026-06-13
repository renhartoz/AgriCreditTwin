from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from accounts.permissions import IsOperatorOrAdmin, IsAuditor
from .models import Member, Loan, LoanAuditHistory
from .serializers import (
    LoanApplicationSerializer,
    LoanAuditSerializer,
    LoanApplyResponseSerializer,
    LoanRejectedResponseSerializer,
    ErrorResponseSerializer,
    MemberSerializer,
)
from .services import validate_avs
from simulation.services import run_monte_carlo_simulation


class LoanApplyView(APIView):
    permission_classes = [IsOperatorOrAdmin]
    serializer_class = LoanApplicationSerializer

    @extend_schema(
        summary="Submit Loan Application",
        description=(
            "Validates the declared yield against regional benchmarks (AVS) using the submitted "
            "land_area_ha, then runs a 1,000-iteration Monte Carlo cash flow simulation to "
            "determine loan approval or restructuring. The estimated_grain_price overrides "
            "the static commodity price in the simulation engine."
        ),
        request=LoanApplicationSerializer,
        responses={
            201: OpenApiResponse(
                response=LoanApplyResponseSerializer,
                description="Loan approved or restructured with simulation results.",
            ),
            422: OpenApiResponse(
                response=LoanRejectedResponseSerializer,
                description="AVS red flag — yield anomaly detected, loan rejected.",
            ),
            403: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="Missing tenant context.",
            ),
            404: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="Member not found in this cooperative.",
            ),
        },
        tags=["Loans"],
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
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

        land_area = data["land_area_ha"]

        avs_result = validate_avs(
            commodity=data["commodity"],
            declared_yield_tons=data["declared_yield_tons"],
            land_area_ha=land_area,
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
            land_area_ha=land_area,
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


class AuditLoansView(APIView):
    permission_classes = [IsAuditor]
    serializer_class = LoanAuditSerializer

    @extend_schema(
        summary="Query Loan Audit Trail",
        description="Returns immutable audit log entries filtered by loan, officer, or date range. Supports Condition E (immutable audit trail) of the case study.",
        parameters=[
            OpenApiParameter(
                name="loan_id",
                type=OpenApiTypes.UUID,
                location=OpenApiParameter.QUERY,
                description="Filter by specific loan ID.",
                required=False,
            ),
            OpenApiParameter(
                name="officer_id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="Filter by the officer who made the change.",
                required=False,
            ),
            OpenApiParameter(
                name="start_date",
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                description="Filter changes on or after this date (YYYY-MM-DD).",
                required=False,
            ),
            OpenApiParameter(
                name="end_date",
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                description="Filter changes on or before this date (YYYY-MM-DD).",
                required=False,
            ),
        ],
        responses={200: LoanAuditSerializer(many=True)},
        tags=["Audit"],
    )
    def get(self, request):
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

        start_date = request.query_params.get("start_date")
        if start_date:
            qs = qs.filter(changed_at__date__gte=start_date)

        end_date = request.query_params.get("end_date")
        if end_date:
            qs = qs.filter(changed_at__date__lte=end_date)

        serializer = self.serializer_class(qs[:200], many=True)
        return Response(serializer.data)


class MemberListView(APIView):
    permission_classes = [IsOperatorOrAdmin]

    def get(self, request):
        tenant = request.tenant
        if not tenant:
            return Response(
                {"error": "Tenant context required."},
                status=status.HTTP_403_FORBIDDEN,
            )
        members = Member.objects.filter(tenant=tenant).order_by("name")
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data)
