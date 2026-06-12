from django.db import models


class Commodity(models.Model):
    name = models.CharField(max_length=50, primary_key=True)
    regional_avg_yield_tons_ha = models.DecimalField(max_digits=6, decimal_places=2)
    avg_price_per_kg = models.IntegerField(help_text="IDR per kg")

    class Meta:
        db_table = "commodities"

    def __str__(self):
        return self.name
