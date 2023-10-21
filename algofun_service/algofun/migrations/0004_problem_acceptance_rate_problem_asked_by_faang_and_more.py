# Generated by Django 4.0.3 on 2023-10-20 19:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('algofun', '0003_problem_similar_problems_alter_problem_difficulty_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='acceptance_rate',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='problem',
            name='asked_by_faang',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='problem',
            name='frequency',
            field=models.FloatField(blank=True, null=True),
        ),
    ]