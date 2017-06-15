# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-06-15 07:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20170615_0158'),
    ]

    operations = [
        migrations.AddField(
            model_name='node',
            name='clustering_coefficient_t',
            field=models.FloatField(db_index=True, default=0),
        ),
        migrations.AddField(
            model_name='node',
            name='clustering_coefficient_t_count',
            field=models.FloatField(db_index=True, default=0),
        ),
    ]
