import logging
import secrets
import string

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.contrib.auth.models import User
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from tenants.models import Tenant
from tenants.tenant import sanitize_schema_name, provision_tenant_schema
from .models import UserProfile
from .cloudinary_service import upload_file, CloudinaryServiceError

logger = logging.getLogger("accounts")


def generate_password(length=10):
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def send_operator_invitation(email, username, password):
    login_url = f"{settings.FRONTEND_URL}/auth/login"
    html_body = f"""\
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#16a34a;">Agri-Credit Twin</h2>
        <p>Welcome aboard! Your operator account has been created.</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;">
            <tr><td style="padding:6px 0;color:#555;">Username</td><td><strong>{username}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#555;">Email</td><td><strong>{email}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#555;">One-Time Password</td><td><strong>{password}</strong></td></tr>
        </table>
        <a href="{login_url}" style="display:inline-block;background:#16a34a;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;">Log In</a>
        <p style="margin-top:24px;font-size:13px;color:#888;">Please change your password after first login.</p>
    </div>
    """

    msg = EmailMultiAlternatives(
        subject="Your Agri-Credit Twin Operator Account",
        body=f"Username: {username}\nEmail: {email}\nPassword: {password}\nLogin: {login_url}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send()


def send_activation_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    activation_link = f"{settings.FRONTEND_URL}/auth/activate/{uid}/{token}/"

    html_body = f"""\
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#16a34a;">Activate Your Account</h2>
        <p>Welcome to Agri-Credit Twin! Please verify your email to activate your <strong>{user.get_profile_role()}</strong> account.</p>
        <p style="color:#555;">Username: <strong>{user.username}</strong></p>
        <a href="{activation_link}" style="display:inline-block;background:#16a34a;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;">Activate Account</a>
        <p style="margin-top:24px;font-size:13px;color:#888;">This link expires after one use. If you did not register, ignore this email.</p>
    </div>
    """

    msg = EmailMultiAlternatives(
        subject="Activate Your Agri-Credit Twin Account",
        body=f"Activate your account: {activation_link}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send()


def send_cooperative_registration_email(coop_name, admin_email, admin_username):
    html_body = f"""\
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#16a34a;">Agri-Credit Twin</h2>
        <h3 style="color:#333;">Pendaftaran Koperasi Berhasil</h3>
        <p>Terima kasih telah mendaftarkan <strong>{coop_name}</strong> di Agri-Credit Twin.</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;">
            <tr><td style="padding:6px 0;color:#555;">Nama Koperasi</td><td><strong>{coop_name}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#555;">Username Admin</td><td><strong>{admin_username}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#555;">Email Admin</td><td><strong>{admin_email}</strong></td></tr>
        </table>
        <div style="padding:12px 16px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin:16px 0;">
            <p style="margin:0;font-size:14px;color:#92400e;">
                <strong>Status: Menunggu Verifikasi</strong><br>
                Akun koperasi Anda sedang dalam proses verifikasi oleh SuperAdmin. Kami akan mengirimkan email konfirmasi setelah verifikasi selesai dalam 1×24 jam.
            </p>
        </div>
        <p style="font-size:13px;color:#888;">Jika Anda tidak merasa mendaftarkan koperasi ini, abaikan email ini.</p>
    </div>
    """

    msg = EmailMultiAlternatives(
        subject=f"Pendaftaran {coop_name} - Menunggu Verifikasi | Agri-Credit Twin",
        body=f"Pendaftaran {coop_name} berhasil. Status: Menunggu Verifikasi oleh SuperAdmin.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[admin_email],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send()


def get_profile_role(self):
    profile = getattr(self, "profile", None)
    return profile.role if profile else "user"


User.get_profile_role = get_profile_role


@transaction.atomic
def register_user(username, email, password, role, tenant=None):
    if User.objects.filter(email=email).exists():
        raise ValueError("A user with this email already exists.")
    if User.objects.filter(username=username).exists():
        raise ValueError("A user with this username already exists.")

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        is_active=False,
    )

    UserProfile.objects.create(
        user=user,
        tenant=tenant,
        role=role,
    )

    try:
        send_activation_email(user)
    except Exception:
        logger.exception("Failed to send activation email to %s", email)

    return user


@transaction.atomic
def register_tenant(coop_name, nomor_induk_koperasi, sk_badan_hukum, username, email, password, nib="", verification_document=None):
    schema_name = sanitize_schema_name(coop_name)

    if Tenant.objects.filter(name=coop_name).exists():
        raise ValueError("Cooperative name already registered.")
    if Tenant.objects.filter(schema_name=schema_name).exists():
        suffix = 1
        while Tenant.objects.filter(schema_name=f"{schema_name}_{suffix}").exists():
            suffix += 1
        schema_name = f"{schema_name}_{suffix}"

    doc_path = ""
    if verification_document:
        try:
            full_url = upload_file(
                verification_document,
                folder="coop_certificates",
                resource_type="raw",
            )
            parts = full_url.split("/upload/")
            if len(parts) == 2:
                path_after_version = parts[1]
                segments = path_after_version.split("/")
                if segments and segments[0].startswith("v") and segments[0][1:].isdigit():
                    doc_path = "/".join(segments[1:])
                else:
                    doc_path = path_after_version
            else:
                doc_path = full_url
        except CloudinaryServiceError:
            logger.exception("Failed to upload verification document to Cloudinary")
            raise ValueError("Failed to upload verification document. Please try again.")

    from django.conf import settings
    tenant = Tenant.objects.create(
        name=coop_name,
        schema_name=schema_name,
        nomor_induk_koperasi=nomor_induk_koperasi,
        sk_badan_hukum=sk_badan_hukum,
        nib=nib,
        verification_document=doc_path,
        is_verified=settings.DEBUG,
    )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    UserProfile.objects.create(
        user=user,
        tenant=tenant,
        role="admin",
    )

    provision_tenant_schema(tenant)

    try:
        send_cooperative_registration_email(coop_name, email, username)
    except Exception:
        logger.exception("Failed to send registration email to %s", email)

    return tenant, user


@transaction.atomic
def invite_operator(tenant, name, email):
    password = generate_password()
    username = email.split("@")[0]
    if User.objects.filter(username=username).exists():
        suffix = 1
        while User.objects.filter(username=f"{username}{suffix}").exists():
            suffix += 1
        username = f"{username}{suffix}"

    user = User.objects.create_user(
        username=username,
        email=email,
        first_name=name,
    )
    user.set_password(password)
    user.save()

    UserProfile.objects.create(
        user=user,
        tenant=tenant,
        role="operator",
    )

    try:
        send_operator_invitation(email, username, password)
    except Exception:
        logger.exception("Failed to send operator invitation to %s", email)

    return user, password
