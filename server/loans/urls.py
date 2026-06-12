from django.urls import path
from .views import LoanApplyView, AuditLoansView

urlpatterns = [
    path("apply/", LoanApplyView.as_view(), name="loan-apply"),
    path("audit/", AuditLoansView.as_view(), name="audit-loans"),
]
