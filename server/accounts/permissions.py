from rest_framework.permissions import BasePermission


class IsOperator(BasePermission):
    def has_permission(self, request, view):
        return _has_role(request, "operator")


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return _has_role(request, "admin")


class IsInvestor(BasePermission):
    def has_permission(self, request, view):
        return _has_role(request, "investor")


class IsAuditor(BasePermission):
    def has_permission(self, request, view):
        return _has_role(request, "auditor")


class IsOperatorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return _has_role(request, "operator") or _has_role(request, "admin")


class IsAdminOrInvestor(BasePermission):
    def has_permission(self, request, view):
        return _has_role(request, "admin") or _has_role(request, "investor")


def _has_role(request, role):
    if not request.user or not request.user.is_authenticated:
        return False
    profile = getattr(request.user, "profile", None)
    if not profile:
        return False
    return profile.role == role
