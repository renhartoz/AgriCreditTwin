from rest_framework import serializers
from .models import Member, Loan, Transaction, LoanAuditHistory, Tenant


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = [
            "id", "name", "schema_name", "is_active",
            "nomor_induk_koperasi", "sk_badan_hukum", "nib",
            "verification_document", "is_verified", "created_at",
        ]
        read_only_fields = ["is_verified"]


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            "id", "tenant_id", "nik", "name", "address", "phone",
            "land_area_ha", "commodity", "created_at",
        ]


class LoanApplicationSerializer(serializers.Serializer):
    member_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    tenor_months = serializers.IntegerField(min_value=1, max_value=60)
    declared_yield_tons = serializers.DecimalField(max_digits=8, decimal_places=2)
    commodity = serializers.CharField(max_length=50, default="rice")
    planting_month = serializers.IntegerField(min_value=1, max_value=12)
    harvest_month = serializers.IntegerField(min_value=1, max_value=12)
    monthly_living_cost = serializers.DecimalField(
        max_digits=12, decimal_places=2, default=2_000_000,
    )
    monthly_farming_cost = serializers.DecimalField(
        max_digits=12, decimal_places=2, default=500_000,
    )


class LoanSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.name", read_only=True)
    member_nik = serializers.CharField(source="member.nik", read_only=True)

    class Meta:
        model = Loan
        fields = [
            "id", "tenant_id", "member_id", "member_name", "member_nik",
            "amount", "tenor_months", "status", "declared_yield_tons",
            "commodity", "planting_month", "harvest_month",
            "monthly_living_cost", "monthly_farming_cost",
            "simulation_result", "avs_flag",
            "months_in_arrears", "disbursed_at",
            "created_at", "updated_at",
        ]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id", "tenant_id", "member_id", "loan_id",
            "transaction_type", "amount", "description", "created_at",
        ]


class LoanAuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanAuditHistory
        fields = [
            "id", "loan_id", "tenant_id", "officer_id",
            "field_name", "old_value", "new_value", "changed_at",
        ]


class PortfolioSerializer(serializers.Serializer):
    tenant_id = serializers.UUIDField()
    tenant_name = serializers.CharField()
    total_loans = serializers.IntegerField()
    total_disbursed = serializers.DecimalField(max_digits=18, decimal_places=2)
    npl_rate = serializers.FloatField()
    data_completeness = serializers.FloatField()
    investor_readiness_score = serializers.IntegerField()
    loan_status_breakdown = serializers.DictField()
