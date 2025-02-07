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
    phone_number = models.CharField(max_length=15, unique=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    role = models.CharField(max_length=10, choices=RoleChoices.choices, default=RoleChoices.FREE)

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

class OTP(BaseDateTimeModel):

    class VerificationType(models.TextChoices):
        signup = 'signup', 'Signup'
        forgot_password = 'forgot_password', 'Forgot Password'

    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='otp')
    code = models.CharField(max_length=6)
    verification_type = models.CharField(max_length=100, choices=VerificationType.choices, default=VerificationType.signup)
    is_verified = models.BooleanField(default=False)

    def is_valid(self):
        return (now() - self.updated_at).seconds < 300  # 5 minutes validity

class FCMDevice(BaseDateTimeModel):
    """
    Model representing a device to which notifications can be sent.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="fcm_devices")
    name = models.CharField(max_length=255)
    platform = models.CharField(max_length=255, null=True, blank=True)
    token = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    @classmethod
    def register_or_update_device(cls, user, token, name=None, platform=None):
        if not token:
            return None, False

        fcm_device, created = cls.objects.update_or_create(
            user=user,
            token=token,
            defaults={
                'name': name or "Unnamed Device",
                'platform': platform or "Unknown"
            }
        )

        return fcm_device, created