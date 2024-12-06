from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
from core.models import BaseDateTimeModel

class User(AbstractUser):
    class RoleChoices(models.TextChoices):
        PREMIUM = 'premium', 'Premium'
        ELEVATED = 'elevated', 'Elevated'
        FREE = 'free', 'Free'

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    company = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    role = models.CharField(max_length=10, choices=RoleChoices.choices, default=RoleChoices.FREE)

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

class OTP(BaseDateTimeModel):
    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='otp')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return (now() - self.created_at).seconds < 300  # 5 minutes validity