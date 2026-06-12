from django.contrib import admin
from .models import Member, Loan, Transaction


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("name", "nik", "tenant", "commodity", "land_area_ha")
    list_filter = ("tenant", "commodity")
    search_fields = ("name", "nik")


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ("id", "member", "tenant", "amount", "status", "avs_flag", "created_at")
    list_filter = ("status", "avs_flag", "tenant")
    search_fields = ("member__nik", "member__name")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "member", "transaction_type", "amount", "created_at")
    list_filter = ("transaction_type", "tenant")
