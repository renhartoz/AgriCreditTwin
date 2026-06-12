from rest_framework import serializers
from .models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = [
            "id", "name", "schema_name", "is_active",
            "nomor_induk_koperasi", "sk_badan_hukum", "nib",
            "verification_document", "is_verified", "created_at",
        ]
        read_only_fields = ["is_verified"]
