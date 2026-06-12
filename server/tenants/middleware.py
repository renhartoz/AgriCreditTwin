from django.utils.deprecation import MiddlewareMixin
from .tenant import set_tenant_schema, reset_schema


class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if not hasattr(request, "user") or not request.user.is_authenticated:
            request.tenant = None
            return None

        profile = getattr(request.user, "profile", None)
        if not profile:
            request.tenant = None
            return None

        request.tenant = profile.tenant
        request.user_role = profile.role
        set_tenant_schema(profile.tenant.schema_name)
        return None

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
