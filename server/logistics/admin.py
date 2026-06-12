from django.contrib import admin
from .models import Commodity


@admin.register(Commodity)
class CommodityAdmin(admin.ModelAdmin):
    list_display = ("name", "regional_avg_yield_tons_ha", "avg_price_per_kg")
