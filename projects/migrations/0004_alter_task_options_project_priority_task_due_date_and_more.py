# Generated by Django 4.2.18 on 2025-02-01 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_remove_taskattachment_uploaded_at_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='task',
            options={'ordering': ['-created_at']},
        ),
        migrations.AddField(
            model_name='project',
            name='priority',
            field=models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='low', max_length=50),
        ),
        migrations.AddField(
            model_name='task',
            name='due_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='task',
            name='priority',
            field=models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='low', max_length=50),
        ),
    ]
