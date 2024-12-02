from django.db.models.signals import post_delete
from django.dispatch import receiver
import os
from .models import User

@receiver(post_delete, sender=User)
def delete_user_photo(sender, instance, using, **kwargs):
    if instance.photo:
        instance.photo.delete(save=False)