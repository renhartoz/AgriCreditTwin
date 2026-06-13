import uuid
from django.db import models


class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    schema_name = models.CharField(max_length=63, unique=True)
    is_active = models.BooleanField(default=True)

    nomor_induk_koperasi = models.CharField(
        max_length=16, unique=True,
        help_text="NIK Koperasi dari Kemenkop UKM",
    )
    sk_badan_hukum = models.CharField(
        max_length=50,
        help_text="Nomor SK Kemenkumham",
    )
    nib = models.CharField(max_length=13, blank=True, default="")
    verification_document = models.FileField(
        upload_to="coop_certificates/", blank=True, null=True,
        max_length=500,
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Set to True by SuperAdmin after document review",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tenants"

    def __str__(self):
        return self.name
