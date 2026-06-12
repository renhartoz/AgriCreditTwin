from rest_framework import serializers


class PortfolioSerializer(serializers.Serializer):
    tenant_id = serializers.UUIDField()
    tenant_name = serializers.CharField()
    total_loans = serializers.IntegerField()
    total_disbursed = serializers.DecimalField(max_digits=18, decimal_places=2)
    npl_rate = serializers.FloatField()
    data_completeness = serializers.FloatField()
    investor_readiness_score = serializers.IntegerField()
    loan_status_breakdown = serializers.DictField()
