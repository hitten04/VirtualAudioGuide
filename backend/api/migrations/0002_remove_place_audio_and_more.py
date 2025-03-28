# Generated by Django 4.2.20 on 2025-03-18 10:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='place',
            name='audio',
        ),
        migrations.RemoveField(
            model_name='place',
            name='historical_significance',
        ),
        migrations.AddField(
            model_name='place',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='place',
            name='location',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='place',
            name='name',
            field=models.CharField(max_length=200),
        ),
        migrations.CreateModel(
            name='AudioGuide',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(choices=[('en', 'English'), ('hi', 'Hindi'), ('gu', 'Gujarati')], max_length=2)),
                ('audio_file', models.FileField(upload_to='audio_guides/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('place', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='audio_guides', to='api.place')),
            ],
            options={
                'unique_together': {('place', 'language')},
            },
        ),
    ]
