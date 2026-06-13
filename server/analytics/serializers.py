from rest_framework import serializers


class HighRiskLoanSerializer(serializers.Serializer):
    id = serializers.CharField()
    member_name = serializers.CharField()
    pd = serializers.FloatField()
    status = serializers.CharField()
    deficit_month = serializers.CharField()
    months_in_arrears = serializers.IntegerField()


class RecentLogSerializer(serializers.Serializer):
    time = serializers.CharField()
    text = serializers.CharField()


class PortfolioSerializer(serializers.Serializer):
    tenant_id = serializers.UUIDField()
    tenant_name = serializers.CharField()
    total_loans = serializers.IntegerField()
    total_disbursed = serializers.DecimalField(max_digits=18, decimal_places=2)
    npl_rate = serializers.FloatField()
    data_completeness = serializers.FloatField()
    investor_readiness_score = serializers.IntegerField()
    loan_status_breakdown = serializers.DictField()
    active_members = serializers.IntegerField()
    total_defaulted_amount = serializers.DecimalField(max_digits=18, decimal_places=2)
    total_savings = serializers.DecimalField(max_digits=18, decimal_places=2)
    high_risk_loans = HighRiskLoanSerializer(many=True)
    recent_logs = RecentLogSerializer(many=True)
