from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/loans/", include("loans.urls")),
    path("api/", include("simulation.urls")),
    path("api/", include("analytics.urls")),
]
