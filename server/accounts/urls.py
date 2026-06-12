from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .jwt import CustomTokenObtainPairView
from .views import register_tenant_view, invite_operator_view

urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view(), name="auth-login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("register-tenant/", register_tenant_view, name="register-tenant"),
    path("invite-operator/", invite_operator_view, name="invite-operator"),
]
