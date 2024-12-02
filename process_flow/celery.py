from __future__ import absolute_import, unicode_literals
import os
from celery import Celery


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "eload_be.settings")

ecommerce_celery_app = Celery("eload_be")
ecommerce_celery_app.config_from_object(
    "django.conf:settings", namespace="CELERY"
)
ecommerce_celery_app.autodiscover_tasks()