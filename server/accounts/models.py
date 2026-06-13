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
