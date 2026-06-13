from django.utils.deprecation import MiddlewareMixin
from .tenant import set_tenant_schema, reset_schema


def _decode_jwt_payload(token):
    import json
    import base64
    try:
        payload_b64 = token.split('.')[1]
        padding = 4 - len(payload_b64) % 4
        if padding != 4:
            payload_b64 += '=' * padding
        return json.loads(base64.urlsafe_b64decode(payload_b64))
    except (IndexError, ValueError):
        return None


class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.tenant = None
        request.user_role = None

        if hasattr(request, "user") and request.user.is_authenticated:
            self._resolve_from_profile(request)
            return None

        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer "):
            payload = _decode_jwt_payload(auth_header[7:])
            if payload and payload.get("tenant_id"):
                from tenants.models import Tenant
                try:
                    tenant = Tenant.objects.get(id=payload["tenant_id"])
                    request.tenant = tenant
                    request.user_role = payload.get("role")
                    set_tenant_schema(tenant.schema_name)
                except Tenant.DoesNotExist:
                    pass

        return None

    def _resolve_from_profile(self, request):
        profile = getattr(request.user, "profile", None)
        if profile and profile.tenant:
            request.tenant = profile.tenant
            request.user_role = profile.role
            set_tenant_schema(profile.tenant.schema_name)

    def process_response(self, request, response):
        reset_schema()
        return response


class PIISanitizationMiddleware(MiddlewareMixin):
    PII_FIELDS = {"name", "nik", "address", "phone", "member_name", "member_nik"}

    def process_response(self, request, response):
        role = getattr(request, "user_role", None)
        if role != "investor":
            return response

        if not hasattr(response, "data"):
            return response

        response.data = self._sanitize(response.data)
        response.content = response.render().content
        return response

    def _sanitize(self, data):
        if isinstance(data, list):
            return [self._sanitize(item) for item in data]
        if isinstance(data, dict):
            return {
                k: "***REDACTED***" if k in self.PII_FIELDS else self._sanitize(v)
                for k, v in data.items()
            }
        return data
