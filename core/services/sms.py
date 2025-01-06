from twilio.rest import Client
from django.conf import settings


class SMSService:
    """A general service for sending SMS using Twilio."""

    SITE_NAME = "processFlow"

    # Message templates for different SMS types
    SIGNUP_OTP_TEMPLATE = "Welcome to {site_name}! Your signup OTP code is {otp_code}. It will expire in 5 minutes."
    FORGOT_PASSWORD_OTP_TEMPLATE = "You requested a password reset on {site_name}. Your OTP code is {otp_code}. It will expire in 5 minutes."

    def __init__(self):
        self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        self.sender = settings.TWILIO_PHONE_NUMBER

    def send_sms(self, phone_number, message_body):
        """
        Sends an SMS to the specified phone number.
        :param phone_number: The recipient's phone number.
        :param message_body: The body of the SMS message.
        :return: Message SID if successful, None otherwise.
        """
        try:
            message = self.client.messages.create(
                body=message_body,
                from_=self.sender,
                to=phone_number
            )
            return True, message.sid
        except Exception as e:
            return False, e
