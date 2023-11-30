# Generated by Django 4.0.3 on 2023-11-30 02:22

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
        migrations.AddField(
            model_name='submission',
            name='space_complexity',
            field=models.CharField(blank=True, choices=[('o1', 'o1'), ('nsqrt', 'nsqrt'), ('logn', 'logn'), ('n', 'n'), ('nlogn', 'nlogn'), ('n2', 'n2'), ('n3', 'n3'), ('2n', '2n'), ('nfactorial', 'nfactorial')], max_length=20),
        ),
        migrations.AddField(
            model_name='submission',
            name='time_complexity',
            field=models.CharField(blank=True, choices=[('o1', 'o1'), ('nsqrt', 'nsqrt'), ('logn', 'logn'), ('n', 'n'), ('nlogn', 'nlogn'), ('n2', 'n2'), ('n3', 'n3'), ('2n', '2n'), ('nfactorial', 'nfactorial')], max_length=20),
        ),
        migrations.AlterField(
            model_name='problem',
            name='difficulty',
            field=models.CharField(blank=True, choices=[('easy', 'easy'), ('medium', 'medium'), ('hard', 'hard')], default='', max_length=6),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='problem',
            name='space_complexity_requirement',
            field=models.CharField(blank=True, choices=[('o1', 'o1'), ('nsqrt', 'nsqrt'), ('logn', 'logn'), ('n', 'n'), ('nlogn', 'nlogn'), ('n2', 'n2'), ('n3', 'n3'), ('2n', '2n'), ('nfactorial', 'nfactorial')], default='', max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='problem',
            name='time_complexity_requirement',
            field=models.CharField(blank=True, choices=[('o1', 'o1'), ('nsqrt', 'nsqrt'), ('logn', 'logn'), ('n', 'n'), ('nlogn', 'nlogn'), ('n2', 'n2'), ('n3', 'n3'), ('2n', '2n'), ('nfactorial', 'nfactorial')], default='', max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='submission',
            name='proficiency_level',
            field=models.CharField(choices=[('no_understanding', 'no understanding'), ('conceptual_understanding', 'conceptual understanding'), ('no_pass', 'no pass'), ('guided_pass', 'guided pass'), ('unsteady_pass', 'unsteady pass'), ('smooth_pass', 'smooth pass'), ('smooth_optimal_pass', 'smooth optimal pass')], max_length=100),
        ),
    ]
