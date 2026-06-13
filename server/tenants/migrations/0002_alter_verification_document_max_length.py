from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tenants', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tenant',
            name='verification_document',
            field=models.FileField(
                blank=True,
                max_length=500,
                null=True,
                upload_to='coop_certificates/',
            ),
        ),
    ]
