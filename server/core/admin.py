from django.contrib import admin
from .models import Tenant, UserProfile, Member, Commodity, Loan, Transaction


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ("name", "schema_name", "nomor_induk_koperasi", "is_verified", "is_active", "created_at")
    list_filter = ("is_verified", "is_active")
    search_fields = ("name", "schema_name", "nomor_induk_koperasi", "sk_badan_hukum")
    readonly_fields = ("created_at",)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "tenant", "role")
    list_filter = ("role", "tenant")


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("name", "nik", "tenant", "commodity", "land_area_ha")
    list_filter = ("tenant", "commodity")
    search_fields = ("name", "nik")


@admin.register(Commodity)
class CommodityAdmin(admin.ModelAdmin):
    list_display = ("name", "regional_avg_yield_tons_ha", "avg_price_per_kg")


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ("id", "member", "tenant", "amount", "status", "avs_flag", "created_at")
    list_filter = ("status", "avs_flag", "tenant")
    search_fields = ("member__nik", "member__name")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "member", "transaction_type", "amount", "created_at")
    list_filter = ("transaction_type", "tenant")
