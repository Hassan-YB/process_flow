from django.db import models
from users.models import User, FCMDevice
from core.choices import NotificationChoices
from core.models import BaseDateTimeModel
from firebase_admin import messaging

class Notification(BaseDateTimeModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=NotificationChoices.choices)
    title = models.CharField(max_length=255, null=True, blank=True)
    message = models.CharField(max_length=1000)
    description = models.TextField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    is_muted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.get_type_display()} Notification for {self.user.username}"
    
    @classmethod
    def create_and_send_notification(cls, user, message, title, type, description, device_token=None):

        notification = cls.objects.create(user=user, message=message, type=type, description=description, title=title)
        if device_token is None:
            # If device_token is not provided, fetch it from FCMDevice model
            devices = FCMDevice.objects.filter(user=user)
            if devices.exists():
                device_token = devices.last().token

            cls.send_notification(device_token, title, message)
            return notification
        
        return None

    @staticmethod
    def send_notification(device_token, title, body):
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body,
                ),
                token=device_token,
            )
            response = messaging.send(message)
            print(response)
            return response
        except Exception as e:
            print(e)