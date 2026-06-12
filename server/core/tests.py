import os
from django.test import TestCase
from django.contrib.auth.models import User
from django.db import connection
from rest_framework.test import APITestCase
from rest_framework import status
from core.models import Tenant, UserProfile
from core.services import sanitize_schema_name

class TenantAuthFlowTestCase(APITestCase):
    def test_tenant_registration_and_operator_invitation(self):
        # 1. Test Tenant Registration
        reg_url = "/api/auth/register-tenant/"
        payload = {
            "coop_name": "Melati Jaya",
            "nomor_induk_koperasi": "1234567890123456",
            "sk_badan_hukum": "SK-999/BH/XX/2026",
            "username": "melatiadmin",
            "email": "admin@melati.com",
            "password": "Password123!"
        }
        
        response = self.client.post(reg_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tenant_id", response.data)
        tenant_id = response.data["tenant_id"]
        
        # Verify Tenant exists in DB and is not verified yet
        tenant = Tenant.objects.get(id=tenant_id)
        self.assertEqual(tenant.name, "Melati Jaya")
        self.assertFalse(tenant.is_verified)
        self.assertEqual(tenant.schema_name, "melati_jaya")
        
        # Verify schema table existence in PostgreSQL
        with connection.cursor() as cursor:
            # Check if schema exists
            cursor.execute(
                "SELECT schema_name FROM information_schema.schemata WHERE schema_name = %s",
                [tenant.schema_name]
            )
            self.assertIsNotNone(cursor.fetchone())
            
            # Check if tables exist in the schema
            for table in ["members", "loans", "transactions"]:
                cursor.execute(
                    "SELECT table_name FROM information_schema.tables WHERE table_schema = %s AND table_name = %s",
                    [tenant.schema_name, table]
                )
                self.assertIsNotNone(cursor.fetchone())

        # Verify admin user profile
        user = User.objects.get(username="melatiadmin")
        self.assertEqual(user.email, "admin@melati.com")
        self.assertEqual(user.profile.role, "admin")
        self.assertEqual(user.profile.tenant, tenant)

        # 2. Test Custom JWT Token login
        login_url = "/api/auth/login/"
        login_payload = {
            "username": "melatiadmin",
            "password": "Password123!"
        }
        login_response = self.client.post(login_url, login_payload, format="json")
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data)
        access_token = login_response.data["access"]
        
        # 3. Test Staff Operator Invitation
        # Try without credentials (should be unauthorized)
        invite_url = "/api/auth/invite-operator/"
        invite_payload = {
            "name": "Budi Santoso",
            "email": "budi@melati.com"
        }
        response = self.client.post(invite_url, invite_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # With Admin Credentials
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        response = self.client.post(invite_url, invite_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("default_password", response.data)
        self.assertEqual(response.data["default_password"], "Koperasi123!")
        
        # Verify invited user and role
        operator_user = User.objects.get(email="budi@melati.com")
        self.assertEqual(operator_user.profile.role, "operator")
        self.assertEqual(operator_user.profile.tenant, tenant)
        
        # Test Operator Login works
        self.client.credentials() # Reset credentials
        op_login_payload = {
            "username": operator_user.username,
            "password": "Koperasi123!"
        }
        op_login_response = self.client.post(login_url, op_login_payload, format="json")
        self.assertEqual(op_login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", op_login_response.data)
