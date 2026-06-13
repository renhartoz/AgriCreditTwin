from rest_framework import serializers
from .models import Commodity, CommodityLog


class CommoditySerializer(serializers.ModelSerializer):
    class Meta:
        model = Commodity
        fields = ["name", "regional_avg_yield_tons_ha", "avg_price_per_kg"]


class CommodityLogCreateSerializer(serializers.Serializer):
    commodity_name = serializers.CharField(max_length=50)
    movement_type = serializers.ChoiceField(choices=["IN", "OUT"])
    quantity_kg = serializers.DecimalField(max_digits=12, decimal_places=2)
    price_per_kg = serializers.IntegerField(min_value=0, required=False, default=0)
    description = serializers.CharField(max_length=255, required=False, default="")
    logged_at = serializers.DateField()


class CommodityLogSerializer(serializers.ModelSerializer):
    commodity_name = serializers.CharField(source="commodity.name", read_only=True)

    class Meta:
        model = CommodityLog
        fields = [
            "id", "commodity_name", "movement_type",
            "quantity_kg", "price_per_kg", "description", "logged_at",
        ]
