import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tenants', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('operator', 'Operator'), ('admin', 'Admin'), ('investor', 'Investor'), ('auditor', 'Auditor')], default='operator', max_length=20)),
                ('nik', models.CharField(blank=True, default='', max_length=16)),
                ('tenant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users', to='tenants.tenant')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'user_profiles',
            },
        ),
    ]
