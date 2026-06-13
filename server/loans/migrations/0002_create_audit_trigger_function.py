from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('loans', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                CREATE TABLE IF NOT EXISTS public.loan_audit_history (
                    id BIGSERIAL PRIMARY KEY,
                    loan_id UUID NOT NULL,
                    tenant_id UUID NOT NULL,
                    officer_id INTEGER,
                    field_name VARCHAR(100) NOT NULL,
                    old_value TEXT,
                    new_value TEXT,
                    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                CREATE INDEX IF NOT EXISTS idx_audit_loan_id ON public.loan_audit_history (loan_id);
                CREATE INDEX IF NOT EXISTS idx_audit_tenant_id ON public.loan_audit_history (tenant_id);
            """,
            reverse_sql="DROP TABLE IF EXISTS public.loan_audit_history;",
        ),
        migrations.RunSQL(
            sql="""
                CREATE OR REPLACE FUNCTION public.fn_loan_audit_trigger()
                RETURNS TRIGGER AS $$
                DECLARE
                    col TEXT;
                    old_val TEXT;
                    new_val TEXT;
                BEGIN
                    FOR col IN
                        SELECT unnest(ARRAY[
                            'status', 'amount', 'tenor_months', 'declared_yield_tons',
                            'commodity', 'planting_month', 'harvest_month',
                            'monthly_living_cost', 'monthly_farming_cost',
                            'months_in_arrears', 'avs_flag'
                        ])
                    LOOP
                        EXECUTE format('SELECT ($1).%I::TEXT', col) INTO old_val USING OLD;
                        EXECUTE format('SELECT ($1).%I::TEXT', col) INTO new_val USING NEW;

                        IF old_val IS DISTINCT FROM new_val THEN
                            INSERT INTO public.loan_audit_history
                                (loan_id, tenant_id, officer_id, field_name, old_value, new_value, changed_at)
                            VALUES
                                (NEW.id, NEW.tenant_id, NEW.officer_id, col, old_val, new_val, NOW());
                        END IF;
                    END LOOP;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            """,
            reverse_sql="DROP FUNCTION IF EXISTS public.fn_loan_audit_trigger();",
        ),
    ]
