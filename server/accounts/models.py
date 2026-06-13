from django.db import models
from django.conf import settings
from tenants.models import Tenant


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ("operator", "Operator"),
        ("admin", "Admin"),
        ("investor", "Investor"),
        ("auditor", "Auditor"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="users",
        null=True,
        blank=True,
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="operator")
    nik = models.CharField(max_length=16, blank=True, default="")

    class Meta:
        db_table = "user_profiles"

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class OperatorLog(models.Model):
    ACTION_CHOICES = [
        ("LOGIN", "Login"),
        ("LOGOUT", "Logout"),
        ("DATA_ENTRY", "Data Entry"),
        ("APPROVAL_REVIEW", "Approval Review"),
        ("REPORT_GENERATION", "Report Generation"),
        ("MEMBER_UPDATE", "Member Update"),
        ("LOAN_SUBMIT", "Loan Submit"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="activity_logs",
    )
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="operator_logs",
    )
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    description = models.CharField(max_length=255, blank=True, default="")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    logged_at = models.DateTimeField()

    class Meta:
        db_table = "operator_logs"
        ordering = ["-logged_at"]

    def __str__(self):
        return f"{self.user.username} → {self.action} @ {self.logged_at:%Y-%m-%d %H:%M}"


class Invitation(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("expired", "Expired"),
    ]

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="invitations",
    )
    email = models.EmailField()
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="sent_invitations",
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "invitations"
        unique_together = ("tenant", "email")

    def __str__(self):
        return f"Invitation → {self.email} ({self.status})"
