from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        profile = getattr(user, "profile", None)
        if profile:
            token["tenant_id"] = str(profile.tenant_id)
            token["tenant_name"] = profile.tenant.name
            token["role"] = profile.role
        else:
            token["tenant_id"] = None
            token["tenant_name"] = None
            token["role"] = None

        token["username"] = user.username
        token["email"] = user.email
        token["name"] = user.first_name or user.username
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
