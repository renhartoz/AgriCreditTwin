import re
from contextlib import contextmanager
from django.db import connection


def sanitize_schema_name(name):
    name = name.lower()
    name = re.sub(r'[^a-z0-9_]', '_', name)
    if not re.match(r'^[a-z_]', name):
        name = '_' + name
    return name[:63]


def set_tenant_schema(schema_name):
    with connection.cursor() as cursor:
        cursor.execute("SET search_path TO %s, public", [schema_name])


def reset_schema():
    with connection.cursor() as cursor:
        cursor.execute("SET search_path TO public")


@contextmanager
def tenant_context(tenant):
    set_tenant_schema(tenant.schema_name)
    try:
        yield tenant
    finally:
        reset_schema()


def provision_tenant_schema(tenant):
    schema = tenant.schema_name
    with connection.cursor() as cursor:
        cursor.execute(f"CREATE SCHEMA IF NOT EXISTS {schema};")

        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS {schema}.members (
                id UUID PRIMARY KEY,
                nik VARCHAR(16) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address TEXT NOT NULL DEFAULT '',
                phone VARCHAR(20) NOT NULL DEFAULT '',
                land_area_ha NUMERIC(8,2) NOT NULL DEFAULT 0,
                commodity VARCHAR(50) NOT NULL DEFAULT 'rice',
                created_at TIMESTAMPTZ NOT NULL,
                tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE
            );
        """)
        cursor.execute(f"""
            CREATE UNIQUE INDEX IF NOT EXISTS idx_{schema}_members_tenant_nik
            ON {schema}.members (tenant_id, nik);
        """)

        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS {schema}.loans (
                id UUID PRIMARY KEY,
                amount NUMERIC(15,2) NOT NULL,
                tenor_months INTEGER NOT NULL,
                status VARCHAR(20) NOT NULL,
                declared_yield_tons NUMERIC(8,2) NOT NULL,
                commodity VARCHAR(50) NOT NULL,
                planting_month INTEGER NOT NULL,
                harvest_month INTEGER NOT NULL,
                monthly_living_cost NUMERIC(12,2) NOT NULL,
                monthly_farming_cost NUMERIC(12,2) NOT NULL,
                simulation_result JSONB,
                avs_flag BOOLEAN NOT NULL DEFAULT FALSE,
                months_in_arrears INTEGER NOT NULL DEFAULT 0,
                disbursed_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ NOT NULL,
                updated_at TIMESTAMPTZ NOT NULL,
                member_id UUID NOT NULL REFERENCES {schema}.members(id) ON DELETE CASCADE,
                officer_id INTEGER REFERENCES public.auth_user(id) ON DELETE SET NULL,
                tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE
            );
        """)

        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS {schema}.transactions (
                id UUID PRIMARY KEY,
                transaction_type VARCHAR(30) NOT NULL,
                amount NUMERIC(15,2) NOT NULL,
                description TEXT NOT NULL DEFAULT '',
                created_at TIMESTAMPTZ NOT NULL,
                loan_id UUID REFERENCES {schema}.loans(id) ON DELETE SET NULL,
                member_id UUID NOT NULL REFERENCES {schema}.members(id) ON DELETE CASCADE,
                tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE
            );
        """)

        cursor.execute(f"DROP TRIGGER IF EXISTS trg_loan_audit ON {schema}.loans;")
        cursor.execute(f"""
            CREATE TRIGGER trg_loan_audit
                AFTER UPDATE ON {schema}.loans
                FOR EACH ROW
                EXECUTE FUNCTION public.fn_loan_audit_trigger();
        """)
