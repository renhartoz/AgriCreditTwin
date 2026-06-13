from django.utils.dateparse import parse_date
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from accounts.permissions import IsOperatorOrAdmin
from .models import Commodity, CommodityLog
from .serializers import CommoditySerializer, CommodityLogCreateSerializer, CommodityLogSerializer


class CommodityListView(APIView):
    permission_classes = [IsOperatorOrAdmin]

    @extend_schema(
        summary="List Commodities",
        description="Returns all registered commodities with regional yield benchmarks.",
        responses={200: CommoditySerializer(many=True)},
        tags=["Logistics"],
    )
    def get(self, request):
        commodities = Commodity.objects.all().order_by("name")
        serializer = CommoditySerializer(commodities, many=True)
        return Response(serializer.data)


class CommodityLogView(APIView):
    permission_classes = [IsOperatorOrAdmin]

    @extend_schema(
        summary="List Commodity Logs",
        description="Returns recent inventory IN/OUT movements for this tenant.",
        responses={200: CommodityLogSerializer(many=True)},
        tags=["Logistics"],
    )
    def get(self, request):
        tenant = request.tenant
        if not tenant:
            return Response({"error": "Tenant context required."}, status=status.HTTP_403_FORBIDDEN)
        logs = CommodityLog.objects.filter(tenant=tenant).select_related("commodity").order_by("-logged_at")[:50]
        serializer = CommodityLogSerializer(logs, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Record Commodity Movement",
        description="Record a warehouse IN or OUT mutation for a commodity.",
        request=CommodityLogCreateSerializer,
        responses={201: CommodityLogSerializer},
        tags=["Logistics"],
    )
    def post(self, request):
        tenant = request.tenant
        if not tenant:
            return Response({"error": "Tenant context required."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CommodityLogCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        commodity, _ = Commodity.objects.get_or_create(
            name=data["commodity_name"],
            defaults={"regional_avg_yield_tons_ha": 0, "avg_price_per_kg": data.get("price_per_kg", 0)},
        )

        log = CommodityLog.objects.create(
            tenant=tenant,
            commodity=commodity,
            movement_type=data["movement_type"],
            quantity_kg=data["quantity_kg"],
            price_per_kg=data.get("price_per_kg", 0),
            description=data.get("description", ""),
            logged_at=data["logged_at"],
        )

        return Response(CommodityLogSerializer(log).data, status=status.HTTP_201_CREATED)
