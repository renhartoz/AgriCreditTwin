from django.contrib import admin
from .models import UserProfile, OperatorLog, Invitation


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "tenant", "role")
    list_filter = ("role", "tenant")


@admin.register(OperatorLog)
class OperatorLogAdmin(admin.ModelAdmin):
    list_display = ("user", "tenant", "action", "ip_address", "logged_at")
    list_filter = ("action", "tenant")
    ordering = ("-logged_at",)


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ("email", "tenant", "invited_by", "status", "created_at")
    list_filter = ("status", "tenant")
