from django.db import models
from tenants.models import Tenant


class Commodity(models.Model):
    name = models.CharField(max_length=50, primary_key=True)
    regional_avg_yield_tons_ha = models.DecimalField(max_digits=6, decimal_places=2)
    avg_price_per_kg = models.IntegerField(help_text="IDR per kg")

    class Meta:
        db_table = "commodities"

    def __str__(self):
        return self.name


class CommodityLog(models.Model):
    MOVEMENT_CHOICES = [
        ("IN", "Masuk / Restock"),
        ("OUT", "Keluar / Distribusi"),
    ]

    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, related_name="commodity_logs",
    )
    commodity = models.ForeignKey(
        Commodity, on_delete=models.CASCADE, related_name="logs",
    )
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_CHOICES)
    quantity_kg = models.DecimalField(max_digits=12, decimal_places=2)
    price_per_kg = models.IntegerField(help_text="IDR per kg at time of transaction")
    description = models.CharField(max_length=255, blank=True, default="")
    logged_at = models.DateTimeField()

    class Meta:
        db_table = "commodity_logs"
        ordering = ["-logged_at"]

    def __str__(self):
        return f"{self.movement_type} {self.commodity_id} {self.quantity_kg}kg @ {self.logged_at:%Y-%m-%d}"
