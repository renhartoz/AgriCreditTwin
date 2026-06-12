from django.urls import path
from .views import loan_apply, audit_loans

urlpatterns = [
    path("apply/", loan_apply, name="loan-apply"),
    path("audit/", audit_loans, name="audit-loans"),
]
