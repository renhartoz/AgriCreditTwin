import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tenant',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, unique=True)),
                ('schema_name', models.CharField(max_length=63, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('nomor_induk_koperasi', models.CharField(help_text='NIK Koperasi dari Kemenkop UKM', max_length=16, unique=True)),
                ('sk_badan_hukum', models.CharField(help_text='Nomor SK Kemenkumham', max_length=50)),
                ('nib', models.CharField(blank=True, default='', max_length=13)),
                ('verification_document', models.FileField(blank=True, null=True, upload_to='coop_certificates/')),
                ('is_verified', models.BooleanField(default=False, help_text='Set to True by SuperAdmin after document review')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'tenants',
            },
        ),
    ]
