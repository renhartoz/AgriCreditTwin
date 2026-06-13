from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .jwt import CustomTokenObtainPairView
from .views import (
    RegisterTenantView,
    InviteOperatorView,
    OperatorListView,
    RegisterView,
    VerifyEmailView,
)

urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view(), name="auth-login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("register-tenant/", RegisterTenantView.as_view(), name="register-tenant"),
    path("invite-operator/", InviteOperatorView.as_view(), name="invite-operator"),
    path("operators/", OperatorListView.as_view(), name="operator-list"),
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("verify-email/", VerifyEmailView.as_view(), name="auth-verify-email"),
]
