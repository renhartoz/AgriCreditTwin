import uuid
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Tenant",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255, unique=True)),
                ("schema_name", models.CharField(max_length=63, unique=True)),
                ("is_active", models.BooleanField(default=True)),
                ("nomor_induk_koperasi", models.CharField(max_length=16, unique=True, help_text="NIK Koperasi dari Kemenkop UKM")),
                ("sk_badan_hukum", models.CharField(max_length=50, help_text="Nomor SK Kemenkumham")),
                ("nib", models.CharField(blank=True, default="", max_length=13)),
                ("verification_document", models.FileField(blank=True, null=True, upload_to="coop_certificates/")),
                ("is_verified", models.BooleanField(default=False, help_text="Set to True by SuperAdmin after document review")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"db_table": "tenants"},
        ),
        migrations.CreateModel(
            name="Commodity",
            fields=[
                ("name", models.CharField(max_length=50, primary_key=True, serialize=False)),
                ("regional_avg_yield_tons_ha", models.DecimalField(decimal_places=2, max_digits=6)),
                ("avg_price_per_kg", models.IntegerField(help_text="IDR per kg")),
            ],
            options={"db_table": "commodities"},
        ),
        migrations.CreateModel(
            name="Member",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("nik", models.CharField(db_index=True, max_length=16)),
                ("name", models.CharField(max_length=255)),
                ("address", models.TextField(blank=True, default="")),
                ("phone", models.CharField(blank=True, default="", max_length=20)),
                ("land_area_ha", models.DecimalField(decimal_places=2, default=0, max_digits=8)),
                ("commodity", models.CharField(default="rice", max_length=50)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("tenant", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="members", to="core.tenant")),
            ],
            options={
                "db_table": "members",
                "unique_together": {("tenant", "nik")},
            },
        ),
        migrations.CreateModel(
            name="Loan",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=15)),
                ("tenor_months", models.IntegerField()),
                ("status", models.CharField(choices=[("pending", "Pending"), ("approved", "Approved"), ("restructured", "Restructured"), ("rejected", "Rejected"), ("disbursed", "Disbursed"), ("closed", "Closed"), ("defaulted", "Defaulted")], default="pending", max_length=20)),
                ("declared_yield_tons", models.DecimalField(decimal_places=2, max_digits=8)),
                ("commodity", models.CharField(default="rice", max_length=50)),
                ("planting_month", models.IntegerField(help_text="1-12, month when planting starts")),
                ("harvest_month", models.IntegerField(help_text="1-12, expected harvest month")),
                ("monthly_living_cost", models.DecimalField(decimal_places=2, default=2000000, max_digits=12)),
                ("monthly_farming_cost", models.DecimalField(decimal_places=2, default=500000, max_digits=12)),
                ("simulation_result", models.JSONField(blank=True, null=True)),
                ("avs_flag", models.BooleanField(default=False, help_text="Agricultural Verification Score red flag")),
                ("months_in_arrears", models.IntegerField(default=0)),
                ("disbursed_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("member", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="loans", to="core.member")),
                ("officer", models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="processed_loans", to=settings.AUTH_USER_MODEL)),
                ("tenant", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="loans", to="core.tenant")),
            ],
            options={"db_table": "loans"},
        ),
        migrations.CreateModel(
            name="Transaction",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("transaction_type", models.CharField(choices=[("savings_deposit", "Savings Deposit"), ("savings_withdrawal", "Savings Withdrawal"), ("loan_disbursement", "Loan Disbursement"), ("loan_repayment", "Loan Repayment"), ("rice_sale", "Rice Sale"), ("rice_purchase", "Rice Purchase")], max_length=30)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=15)),
                ("description", models.TextField(blank=True, default="")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("loan", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="transactions", to="core.loan")),
                ("member", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="transactions", to="core.member")),
                ("tenant", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="transactions", to="core.tenant")),
            ],
            options={
                "db_table": "transactions",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("role", models.CharField(choices=[("operator", "Operator"), ("admin", "Admin"), ("investor", "Investor"), ("auditor", "Auditor")], default="operator", max_length=20)),
                ("nik", models.CharField(blank=True, default="", max_length=16)),
                ("tenant", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="users", to="core.tenant")),
                ("user", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="profile", to=settings.AUTH_USER_MODEL)),
            ],
            options={"db_table": "user_profiles"},
        ),
    ]
