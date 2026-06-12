from django.urls import path
from .views import TrustScoreView

urlpatterns = [
    path("members/<str:nik>/trust-score/", TrustScoreView.as_view(), name="trust-score"),
]
