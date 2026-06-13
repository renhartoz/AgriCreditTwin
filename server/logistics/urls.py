from django.urls import path
from .views import CommodityListView, CommodityLogView

urlpatterns = [
    path("commodities/", CommodityListView.as_view(), name="commodity-list"),
    path("logs/", CommodityLogView.as_view(), name="commodity-logs"),
]
