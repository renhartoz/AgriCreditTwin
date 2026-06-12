import uuid
from django.db import models
from django.conf import settings
from tenants.models import Tenant


class Member(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="members")
    nik = models.CharField(max_length=16, db_index=True)
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    land_area_ha = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    commodity = models.CharField(max_length=50, default="rice")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "members"
        unique_together = ("tenant", "nik")

    def __str__(self):
        return f"{self.name} ({self.nik})"


class Loan(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("restructured", "Restructured"),
        ("rejected", "Rejected"),
        ("disbursed", "Disbursed"),
        ("closed", "Closed"),
        ("defaulted", "Defaulted"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="loans")
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="loans")
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    tenor_months = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    declared_yield_tons = models.DecimalField(max_digits=8, decimal_places=2)
    commodity = models.CharField(max_length=50, default="rice")
    planting_month = models.IntegerField(help_text="1-12, month when planting starts")
    harvest_month = models.IntegerField(help_text="1-12, expected harvest month")
    monthly_living_cost = models.DecimalField(max_digits=12, decimal_places=2, default=2_000_000)
    monthly_farming_cost = models.DecimalField(max_digits=12, decimal_places=2, default=500_000)
    simulation_result = models.JSONField(null=True, blank=True)
    avs_flag = models.BooleanField(default=False, help_text="Agricultural Verification Score red flag")
    officer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="processed_loans",
    )
    months_in_arrears = models.IntegerField(default=0)
    disbursed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "loans"

    def __str__(self):
        return f"Loan {self.id} - {self.member.nik} ({self.status})"


class Transaction(models.Model):
    TYPE_CHOICES = [
        ("savings_deposit", "Savings Deposit"),
        ("savings_withdrawal", "Savings Withdrawal"),
        ("loan_disbursement", "Loan Disbursement"),
        ("loan_repayment", "Loan Repayment"),
        ("rice_sale", "Rice Sale"),
        ("rice_purchase", "Rice Purchase"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="transactions")
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="transactions")
    loan = models.ForeignKey(Loan, on_delete=models.SET_NULL, null=True, blank=True, related_name="transactions")
    transaction_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "transactions"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.transaction_type}: {self.amount}"


class LoanAuditHistory(models.Model):
    id = models.BigAutoField(primary_key=True)
    loan_id = models.UUIDField(db_index=True)
    tenant_id = models.UUIDField()
    officer_id = models.IntegerField(null=True)
    field_name = models.CharField(max_length=100)
    old_value = models.TextField(null=True)
    new_value = models.TextField(null=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "loan_audit_history"
        managed = False

    def __str__(self):
        return f"Audit {self.loan_id} - {self.field_name} @ {self.changed_at}"
