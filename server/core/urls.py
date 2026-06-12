from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .jwt import CustomTokenObtainPairView
from .views import (
    register_tenant_view,
    invite_operator_view,
    loan_apply,
    portfolio,
    trust_score,
    audit_loans,
)

urlpatterns = [
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="auth-login"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("auth/register-tenant/", register_tenant_view, name="register-tenant"),
    path("auth/invite-operator/", invite_operator_view, name="invite-operator"),

    path("loans/apply/", loan_apply, name="loan-apply"),
    path("portfolio/", portfolio, name="portfolio"),
    path("members/<str:nik>/trust-score/", trust_score, name="trust-score"),
    path("audit/loans/", audit_loans, name="audit-loans"),
]

