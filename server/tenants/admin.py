from django.contrib import admin
from .models import Tenant


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ("name", "schema_name", "nomor_induk_koperasi", "is_verified", "is_active", "created_at")
    list_filter = ("is_verified", "is_active")
    search_fields = ("name", "schema_name", "nomor_induk_koperasi", "sk_badan_hukum")
    readonly_fields = ("created_at",)
