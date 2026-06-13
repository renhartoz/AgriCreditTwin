import random
from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from accounts.models import Invitation, OperatorLog, UserProfile
from loans.models import Loan, Member
from logistics.models import Commodity, CommodityLog
from tenants.models import Tenant
from tenants.tenant import provision_tenant_schema, sanitize_schema_name


OPERATORS = [
    {"first_name": "Budi",    "last_name": "Santoso",   "username": "budi.santoso",   "email": "budi.santoso@kop-binus.co.id"},
    {"first_name": "Sari",    "last_name": "Dewi",      "username": "sari.dewi",      "email": "sari.dewi@kop-binus.co.id"},
    {"first_name": "Ahmad",   "last_name": "Fauzi",     "username": "ahmad.fauzi",    "email": "ahmad.fauzi@kop-binus.co.id"},
    {"first_name": "Rina",    "last_name": "Kusuma",    "username": "rina.kusuma",    "email": "rina.kusuma@kop-binus.co.id"},
    {"first_name": "Dimas",   "last_name": "Prasetyo",  "username": "dimas.prasetyo", "email": "dimas.prasetyo@kop-binus.co.id"},
]

INVITATIONS = [
    "hendra.wijaya@gmail.com",
    "nurul.hidayah@yahoo.co.id",
    "teguh.setiawan@outlook.com",
]

COMMODITIES = [
    {"name": "Gabah",       "regional_avg_yield_tons_ha": 5.50, "avg_price_per_kg": 5_500},
    {"name": "Jagung",      "regional_avg_yield_tons_ha": 6.20, "avg_price_per_kg": 4_000},
    {"name": "Pupuk Urea",  "regional_avg_yield_tons_ha": 0.00, "avg_price_per_kg": 3_200},
    {"name": "Bibit Padi",  "regional_avg_yield_tons_ha": 0.00, "avg_price_per_kg": 12_000},
    {"name": "Traktor Sewa","regional_avg_yield_tons_ha": 0.00, "avg_price_per_kg": 150_000},
]

MEMBERS = [
    {"nik": "3201010101010001", "name": "Pak Suryadi",    "land_area_ha": 1.50, "commodity": "Gabah",  "address": "Desa Cikaret, Bogor", "phone": "081234567890"},
    {"nik": "3201010101010002", "name": "Bu Lastri",      "land_area_ha": 0.75, "commodity": "Jagung", "address": "Desa Ciawi, Bogor",   "phone": "082345678901"},
    {"nik": "3201010101010003", "name": "Pak Wahyu",      "land_area_ha": 2.00, "commodity": "Gabah",  "address": "Desa Leuwiliang",     "phone": "083456789012"},
    {"nik": "3201010101010004", "name": "Bu Fitri",       "land_area_ha": 1.25, "commodity": "Jagung", "address": "Desa Nanggung",       "phone": "084567890123"},
    {"nik": "3201010101010005", "name": "Pak Hendra",     "land_area_ha": 3.00, "commodity": "Gabah",  "address": "Desa Pamijahan",      "phone": "085678901234"},
    {"nik": "3201010101010006", "name": "Bu Sri Lestari", "land_area_ha": 0.50, "commodity": "Jagung", "address": "Desa Ciampea",        "phone": "086789012345"},
]

ACTION_POOL = [
    ("LOGIN",             "User logged into the system"),
    ("DATA_ENTRY",        "Submitted new member loan application data"),
    ("DATA_ENTRY",        "Updated member agricultural land records"),
    ("APPROVAL_REVIEW",   "Reviewed pending loan approval for member"),
    ("APPROVAL_REVIEW",   "Flagged AVS anomaly for senior review"),
    ("REPORT_GENERATION", "Generated monthly portfolio summary report"),
    ("REPORT_GENERATION", "Exported audit trail for Kondisi E compliance"),
    ("MEMBER_UPDATE",     "Updated member NIK and address information"),
    ("LOAN_SUBMIT",       "Submitted loan to Monte Carlo simulation engine"),
    ("LOGOUT",            "User session terminated"),
]

LOAN_SCENARIOS = [
    {
        "member_nik": "3201010101010001",
        "amount": 10_000_000,
        "tenor_months": 6,
        "declared_yield_tons": 7.5,
        "commodity": "Gabah",
        "planting_month": 10,
        "harvest_month": 3,
        "status": "approved",
        "simulation_result": {
            "status": "Surplus",
            "recommendation": "Standard Monthly Installment",
            "rationale": "P(deficit)=12%. Cash flow supports standard repayment.",
            "alternative": None,
            "metrics": {"deficit_probability": 0.12, "avg_minimum_cashflow": 2_300_000, "p5_minimum_cashflow": 450_000, "iterations": 1000},
        },
    },
    {
        "member_nik": "3201010101010003",
        "amount": 25_000_000,
        "tenor_months": 12,
        "declared_yield_tons": 9.0,
        "commodity": "Gabah",
        "planting_month": 3,
        "harvest_month": 9,
        "status": "restructured",
        "simulation_result": {
            "status": "Marginal",
            "recommendation": "Reduced Monthly Installment with Grace Period",
            "rationale": "P(deficit)=34%. Moderate risk during off-harvest months.",
            "alternative": "Post-Harvest Balloon Payment",
            "metrics": {"deficit_probability": 0.34, "avg_minimum_cashflow": -850_000, "p5_minimum_cashflow": -3_200_000, "iterations": 1000},
        },
    },
    {
        "member_nik": "3201010101010005",
        "amount": 50_000_000,
        "tenor_months": 18,
        "declared_yield_tons": 40.0,
        "commodity": "Gabah",
        "planting_month": 1,
        "harvest_month": 6,
        "status": "rejected",
        "avs_flag": True,
        "simulation_result": None,
    },
    {
        "member_nik": "3201010101010002",
        "amount": 8_000_000,
        "tenor_months": 6,
        "declared_yield_tons": 4.2,
        "commodity": "Jagung",
        "planting_month": 4,
        "harvest_month": 8,
        "status": "disbursed",
        "simulation_result": {
            "status": "Surplus",
            "recommendation": "Standard Monthly Installment",
            "rationale": "P(deficit)=8%. Strong cash flow throughout tenor.",
            "alternative": None,
            "metrics": {"deficit_probability": 0.08, "avg_minimum_cashflow": 1_900_000, "p5_minimum_cashflow": 300_000, "iterations": 1000},
        },
    },
]

LOGISTICS_MOVEMENTS = [
    ("Gabah",       "IN",  35_000,  5_400, "Panen raya anggota batch Oktober"),
    ("Gabah",       "OUT", 12_000,  5_600, "Penjualan ke Bulog"),
    ("Gabah",       "IN",  18_500,  5_350, "Panen anggota susulan"),
    ("Gabah",       "OUT",  8_000,  5_700, "Distribusi ke pasar lokal"),
    ("Jagung",      "IN",  22_000,  3_900, "Panen jagung anggota"),
    ("Jagung",      "OUT",  9_500,  4_100, "Jual ke pengepul"),
    ("Pupuk Urea",  "IN",  10_000,  3_150, "Restock pupuk musim tanam"),
    ("Pupuk Urea",  "OUT",  6_500,  3_200, "Distribusi pupuk ke anggota"),
    ("Bibit Padi",  "IN",   3_000, 11_800, "Pembelian bibit varietas unggul"),
    ("Bibit Padi",  "OUT",  2_000, 12_000, "Penyaluran bibit ke anggota aktif"),
    ("Traktor Sewa","IN",       0, 150_000,"Pendaftaran unit traktor baru (1 unit)"),
    ("Traktor Sewa","OUT",      0, 150_000,"Sewa traktor ke anggota musim tanam"),
]


class Command(BaseCommand):
    help = "Seed realistic demo data for the Agri-Credit Twin hackathon demo."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("\n═══════════════════════════════════════"))
        self.stdout.write(self.style.MIGRATE_HEADING("  Agri-Credit Twin — Demo Data Seeder"))
        self.stdout.write(self.style.MIGRATE_HEADING("═══════════════════════════════════════\n"))

        tenant = self._seed_tenant()
        admin_user = self._seed_admin(tenant)
        operators = self._seed_operators(tenant)
        self._seed_operator_logs(tenant, operators)
        self._seed_invitations(tenant, admin_user)
        self._seed_commodities()
        self._seed_commodity_logs(tenant)
        self._seed_members(tenant)
        self._seed_loans(tenant, admin_user)

        self.stdout.write(self.style.SUCCESS("\n✅  All demo data seeded successfully.\n"))

    # ─── 1. Tenant ───────────────────────────────────────────────────────────

    def _seed_tenant(self):
        tenant, created = Tenant.objects.update_or_create(
            name="Koperasi BINUS",
            defaults={
                "schema_name": "koperasi_binus",
                "nomor_induk_koperasi": "6471123456789012",
                "sk_badan_hukum": "AHU-0012345.AH.01.26.2021",
                "nib": "8120001234567",
                "is_active": True,
                "is_verified": True,
            },
        )
        label = "Created" if created else "Exists "
        self.stdout.write(self.style.SUCCESS(f"[Tenant] {label} → {tenant.name}"))

        if created:
            try:
                provision_tenant_schema(tenant)
                self.stdout.write(self.style.SUCCESS("[Tenant] PostgreSQL schema provisioned."))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"[Tenant] Schema provision skipped: {e}"))

        return tenant

    # ─── 2. Admin ─────────────────────────────────────────────────────────────

    def _seed_admin(self, tenant):
        user, created = User.objects.get_or_create(
            username="admin.kopbinus",
            defaults={
                "email": "admin@kop-binus.co.id",
                "first_name": "Admin",
                "last_name": "Koperasi",
                "is_staff": False,
            },
        )
        if created:
            user.set_password("DemoPass123!")
            user.save()

        UserProfile.objects.update_or_create(
            user=user,
            defaults={"tenant": tenant, "role": "admin"},
        )
        label = "Created" if created else "Exists "
        self.stdout.write(self.style.SUCCESS(f"[Admin]  {label} → {user.username}"))
        return user

    # ─── 3. Operators ─────────────────────────────────────────────────────────

    def _seed_operators(self, tenant):
        operators = []
        for data in OPERATORS:
            user, created = User.objects.get_or_create(
                username=data["username"],
                defaults={
                    "email": data["email"],
                    "first_name": data["first_name"],
                    "last_name": data["last_name"],
                },
            )
            if created:
                user.set_password("DemoPass123!")
                user.save()

            UserProfile.objects.update_or_create(
                user=user,
                defaults={"tenant": tenant, "role": "operator"},
            )
            operators.append(user)
            label = "Created" if created else "Exists "
            self.stdout.write(self.style.SUCCESS(f"[Ops]    {label} → {user.get_full_name()} ({user.email})"))

        return operators

    # ─── 4. Operator Logs ─────────────────────────────────────────────────────

    def _seed_operator_logs(self, tenant, operators):
        now = timezone.now()
        count = 0
        OperatorLog.objects.filter(tenant=tenant).delete()

        for user in operators:
            for i in range(random.randint(5, 8)):
                action, description = random.choice(ACTION_POOL)
                OperatorLog.objects.create(
                    user=user,
                    tenant=tenant,
                    action=action,
                    description=description,
                    ip_address=f"192.168.{random.randint(1, 3)}.{random.randint(10, 99)}",
                    logged_at=now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23)),
                )
                count += 1

        self.stdout.write(self.style.SUCCESS(f"[Logs]   Created {count} operator activity logs."))

    # ─── 5. Invitations ───────────────────────────────────────────────────────

    def _seed_invitations(self, tenant, invited_by):
        for email in INVITATIONS:
            inv, created = Invitation.objects.update_or_create(
                tenant=tenant,
                email=email,
                defaults={"invited_by": invited_by, "status": "pending"},
            )
            label = "Created" if created else "Exists "
            self.stdout.write(self.style.SUCCESS(f"[Invite] {label} → {email}"))

    # ─── 6. Commodities ───────────────────────────────────────────────────────

    def _seed_commodities(self):
        for data in COMMODITIES:
            obj, created = Commodity.objects.update_or_create(
                name=data["name"],
                defaults={
                    "regional_avg_yield_tons_ha": data["regional_avg_yield_tons_ha"],
                    "avg_price_per_kg": data["avg_price_per_kg"],
                },
            )
            label = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"[Comod]  {label} → {obj.name} @ Rp{obj.avg_price_per_kg:,}/kg"))

    # ─── 7. Commodity Logs ────────────────────────────────────────────────────

    def _seed_commodity_logs(self, tenant):
        now = timezone.now()
        CommodityLog.objects.filter(tenant=tenant).delete()
        count = 0

        for i, (commodity_name, movement, qty, price, desc) in enumerate(LOGISTICS_MOVEMENTS):
            try:
                commodity = Commodity.objects.get(name=commodity_name)
            except Commodity.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"[CLog]   Commodity '{commodity_name}' not found, skipping."))
                continue

            CommodityLog.objects.create(
                tenant=tenant,
                commodity=commodity,
                movement_type=movement,
                quantity_kg=qty,
                price_per_kg=price,
                description=desc,
                logged_at=now - timedelta(days=i * 5 + random.randint(0, 4)),
            )
            count += 1

        self.stdout.write(self.style.SUCCESS(f"[CLog]   Created {count} commodity movement logs."))

    # ─── 8. Members ───────────────────────────────────────────────────────────

    def _seed_members(self, tenant):
        for data in MEMBERS:
            member, created = Member.objects.update_or_create(
                tenant=tenant,
                nik=data["nik"],
                defaults={
                    "name": data["name"],
                    "land_area_ha": data["land_area_ha"],
                    "commodity": data["commodity"],
                    "address": data["address"],
                    "phone": data["phone"],
                },
            )
            label = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"[Member] {label} → {member.name} ({member.nik})"))

    # ─── 9. Loans ─────────────────────────────────────────────────────────────

    def _seed_loans(self, tenant, officer):
        now = timezone.now()
        for scenario in LOAN_SCENARIOS:
            try:
                member = Member.objects.get(tenant=tenant, nik=scenario["member_nik"])
            except Member.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"[Loan]   Member {scenario['member_nik']} not found, skipping."))
                continue

            loan, created = Loan.objects.update_or_create(
                tenant=tenant,
                member=member,
                commodity=scenario["commodity"],
                defaults={
                    "amount": scenario["amount"],
                    "tenor_months": scenario["tenor_months"],
                    "declared_yield_tons": scenario["declared_yield_tons"],
                    "planting_month": scenario["planting_month"],
                    "harvest_month": scenario["harvest_month"],
                    "status": scenario["status"],
                    "avs_flag": scenario.get("avs_flag", False),
                    "simulation_result": scenario.get("simulation_result"),
                    "officer": officer,
                    "monthly_living_cost": 2_000_000,
                    "monthly_farming_cost": 500_000,
                    "disbursed_at": (now - timedelta(days=15)) if scenario["status"] == "disbursed" else None,
                },
            )
            label = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(
                f"[Loan]   {label} → {member.name} | Rp{scenario['amount']:,.0f} | {scenario['status'].upper()}"
            ))
