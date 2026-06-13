from django.contrib import admin
from .models import Commodity, CommodityLog


@admin.register(Commodity)
class CommodityAdmin(admin.ModelAdmin):
    list_display = ("name", "regional_avg_yield_tons_ha", "avg_price_per_kg")


@admin.register(CommodityLog)
class CommodityLogAdmin(admin.ModelAdmin):
    list_display = ("commodity", "tenant", "movement_type", "quantity_kg", "price_per_kg", "logged_at")
    list_filter = ("movement_type", "commodity", "tenant")
    ordering = ("-logged_at",)
