from django.db import transaction
from django.contrib.auth.models import User
from tenants.models import Tenant
from tenants.tenant import sanitize_schema_name, provision_tenant_schema
from .models import UserProfile


@transaction.atomic
def register_tenant(coop_name, nomor_induk_koperasi, sk_badan_hukum, username, email, password):
    schema_name = sanitize_schema_name(coop_name)

    if Tenant.objects.filter(name=coop_name).exists():
        raise ValueError("Cooperative name already registered.")
    if Tenant.objects.filter(schema_name=schema_name).exists():
        suffix = 1
        while Tenant.objects.filter(schema_name=f"{schema_name}_{suffix}").exists():
            suffix += 1
        schema_name = f"{schema_name}_{suffix}"

    tenant = Tenant.objects.create(
        name=coop_name,
        schema_name=schema_name,
        nomor_induk_koperasi=nomor_induk_koperasi,
        sk_badan_hukum=sk_badan_hukum,
        is_verified=False,
    )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )

    UserProfile.objects.create(
        user=user,
        tenant=tenant,
        role="admin",
    )

    provision_tenant_schema(tenant)

    return tenant, user


@transaction.atomic
def invite_operator(tenant, name, email):
    default_password = "Koperasi123!"
    username = email.split("@")[0]
    if User.objects.filter(username=username).exists():
        suffix = 1
        while User.objects.filter(username=f"{username}{suffix}").exists():
            suffix += 1
        username = f"{username}{suffix}"

    user = User.objects.create_user(
        username=username,
        email=email,
        password=default_password,
        first_name=name,
    )

    UserProfile.objects.create(
        user=user,
        tenant=tenant,
        role="operator",
    )

    return user, default_password
