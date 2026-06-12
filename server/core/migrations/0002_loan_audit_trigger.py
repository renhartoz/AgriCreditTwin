from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            -- Immutable audit trail table
            CREATE TABLE IF NOT EXISTS loan_audit_history (
                id BIGSERIAL PRIMARY KEY,
                loan_id UUID NOT NULL,
                tenant_id UUID NOT NULL,
                officer_id INTEGER,
                field_name VARCHAR(100) NOT NULL,
                old_value TEXT,
                new_value TEXT,
                changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_audit_loan_id ON loan_audit_history (loan_id);
            CREATE INDEX IF NOT EXISTS idx_audit_tenant_id ON loan_audit_history (tenant_id);
            CREATE INDEX IF NOT EXISTS idx_audit_changed_at ON loan_audit_history (changed_at);

            -- Trigger function: captures every changed column on UPDATE
            CREATE OR REPLACE FUNCTION fn_loan_audit_trigger()
            RETURNS TRIGGER AS $$
            DECLARE
                col TEXT;
                old_val TEXT;
                new_val TEXT;
            BEGIN
                FOREACH col IN ARRAY ARRAY[
                    'amount', 'tenor_months', 'status', 'declared_yield_tons',
                    'commodity', 'planting_month', 'harvest_month',
                    'monthly_living_cost', 'monthly_farming_cost',
                    'simulation_result', 'avs_flag', 'months_in_arrears',
                    'disbursed_at'
                ]
                LOOP
                    EXECUTE format('SELECT ($1).%I::TEXT', col) INTO old_val USING OLD;
                    EXECUTE format('SELECT ($1).%I::TEXT', col) INTO new_val USING NEW;

                    IF old_val IS DISTINCT FROM new_val THEN
                        INSERT INTO loan_audit_history
                            (loan_id, tenant_id, officer_id, field_name, old_value, new_value)
                        VALUES
                            (NEW.id, NEW.tenant_id, NEW.officer_id, col, old_val, new_val);
                    END IF;
                END LOOP;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            -- Attach trigger
            DROP TRIGGER IF EXISTS trg_loan_audit ON loans;
            CREATE TRIGGER trg_loan_audit
                AFTER UPDATE ON loans
                FOR EACH ROW
                EXECUTE FUNCTION fn_loan_audit_trigger();

            -- Revoke destructive privileges (run as superuser / owner)
            REVOKE DELETE, TRUNCATE ON loan_audit_history FROM PUBLIC;
            """,
            reverse_sql="""
            DROP TRIGGER IF EXISTS trg_loan_audit ON loans;
            DROP FUNCTION IF EXISTS fn_loan_audit_trigger();
            DROP TABLE IF EXISTS loan_audit_history;
            """,
        ),
    ]
