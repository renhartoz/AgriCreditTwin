from django.urls import path
from .views import TrustScoreView, CashflowProjectionView

urlpatterns = [
    path("members/<str:nik>/trust-score/", TrustScoreView.as_view(), name="trust-score"),
    path("project-cashflow/", CashflowProjectionView.as_view(), name="cashflow-projection"),
]
