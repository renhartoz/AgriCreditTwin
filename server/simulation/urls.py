from django.urls import path
from .views import trust_score

urlpatterns = [
    path("members/<str:nik>/trust-score/", trust_score, name="trust-score"),
]
