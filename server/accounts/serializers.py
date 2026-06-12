from rest_framework import serializers


class TenantRegistrationSerializer(serializers.Serializer):
    coop_name = serializers.CharField(max_length=255)
    nomor_induk_koperasi = serializers.CharField(max_length=16)
    sk_badan_hukum = serializers.CharField(max_length=50)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)


class StaffInvitationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
