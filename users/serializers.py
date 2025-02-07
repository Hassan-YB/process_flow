from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from core.services.sms import SMSService
from django.db import transaction

from .models import User
from .models import OTP

import random

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone_number', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_password(self, value):
        # Validate the password using Django's password validators
        validate_password(value)
        return value

    @transaction.atomic  # Ensures all DB operations succeed or none do
    def create(self, validated_data):
        email = validated_data['email']
        username = email.split('@')[0]  # username is part before '@'

        # 1. Generate the OTP
        otp_code = "123456" #f"{random.randint(100000, 999999)}"
        # phone_number = validated_data['phone_number']
        # message_body = SMSService.SIGNUP_OTP_TEMPLATE.format(
        #     site_name=SMSService.SITE_NAME,
        #     otp_code=otp_code
        # )

        # sms_service = SMSService()
        # is_success, msg = sms_service.send_sms(phone_number, message_body)
        # if not is_success:
        #     # Abort user creation if OTP fails to send
        #     raise serializers.ValidationError({"phone_number": [msg]})

        # 3. If sending SMS succeeds, create the User
        user = User.objects.create_user(
            email=email,
            username=username,
            full_name=validated_data['full_name'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            role=User.RoleChoices.FREE,
            is_active=False
        )

        # 4. Store the OTP in the database
        OTP.objects.create(user=user, code=otp_code)

        return user


class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
            otp = OTP.objects.get(user=user, code=data['otp_code'])

            if not otp.is_valid():
                raise serializers.ValidationError("OTP is invalid or expired.")

        except (User.DoesNotExist, OTP.DoesNotExist):
            raise serializers.ValidationError("Invalid email or OTP code.")

        return data

    def save(self):
        email = self.validated_data['email']
        otp_code = self.validated_data['otp_code']
        user = User.objects.get(email=email)
        user.is_active = True  # Activate the user account
        user.save()
        OTP.objects.filter(user=user, code=otp_code).update(is_verified=True)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("Account is not active. Please verify your OTP.")
        self.user = user  # Set the user object here
        return data

    def get_user_data(self):
        return {
            'id': self.user.id,
            'email': self.user.email,
            'full_name': self.user.full_name,
            'phone_number': self.user.phone_number,
            'company': self.user.company,
            'role': self.user.role,
        }

    def get_tokens(self):
        refresh = RefreshToken.for_user(self.user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def to_representation(self, instance):
        tokens = self.get_tokens()
        user_data = self.get_user_data()
        return {
            'tokens': tokens,
            'user': user_data,
        }

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value)  # Validate against Django's password policies
        return value
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'company', 'role', 'photo']
        read_only_fields = ['id', 'email', 'role', 'company']  # Prevent modification of these fields

class ForgotPasswordSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    otp_code = serializers.CharField(max_length=6, required=False)  # Optional for sending OTP
    new_password = serializers.CharField(write_only=True, required=False)  # Optional for OTP request

    def validate(self, data):
        phone_number = data.get('phone_number')
        otp_code = data.get('otp_code')
        new_password = data.get('new_password')

        try:
            self.user = User.objects.get(phone_number=phone_number)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user associated with this phone number.")

        if otp_code and new_password:
            # Validate OTP and new password
            try:
                otp = OTP.objects.get(user=self.user, code=otp_code, verification_type=OTP.VerificationType.forgot_password)
                if not otp.is_valid():
                    raise serializers.ValidationError("OTP is invalid or expired.")
                if otp.is_verified:
                    raise serializers.ValidationError("OTP has already been used.")
                self.otp = otp
            except OTP.DoesNotExist:
                raise serializers.ValidationError("Invalid OTP code.")
        return data

    def send_otp(self):
        otp_code = "123456"  #f"{random.randint(100000, 999999)}"
        OTP.objects.update_or_create(
            user=self.user,
            defaults={
                "code": otp_code,
                "verification_type": OTP.VerificationType.forgot_password,
                "is_verified": False,
            }
        )

        # Send OTP via SMS
        # sms_service = SMSService()
        # message_body = SMSService.FORGOT_PASSWORD_OTP_TEMPLATE.format(
        #     site_name=SMSService.SITE_NAME, otp_code=otp_code
        # )
        # is_success, msg = sms_service.send_sms(self.user.phone_number, message_body)
        # if not is_success:
        #     raise serializers.ValidationError(msg)

    def reset_password(self, new_password):
        # Update the user's password
        self.user.set_password(new_password)
        self.user.save()

        # Mark OTP as verified
        self.otp.is_verified = True
        self.otp.save()


class ResendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    verification_type = serializers.ChoiceField(choices=OTP.VerificationType.choices)

    def validate(self, data):
        try:
            self.user = User.objects.get(phone_number=data['phone_number'])
        except User.DoesNotExist:
            raise serializers.ValidationError("No user associated with this phone number.")
        return data

    def save(self):
        otp_code = "123456"  #f"{random.randint(100000, 999999)}"
        OTP.objects.update_or_create(
            user=self.user,
            defaults={
                "code": otp_code,
                "verification_type": self.validated_data['verification_type'],
                "is_verified": False,
            }
        )

        # Send OTP via SMS
        # sms_service = SMSService()
        # if self.validated_data['verification_type'] == OTP.VerificationType.signup:
        #     template = SMSService.SIGNUP_OTP_TEMPLATE
        # elif self.validated_data['verification_type'] == OTP.VerificationType.forgot_password:
        #     template = SMSService.FORGOT_PASSWORD_OTP_TEMPLATE

        # message_body = template.format(site_name=SMSService.SITE_NAME, otp_code=otp_code)
        # is_success, msg = sms_service.send_sms(self.user.phone_number, message_body)
        # if not is_success:
        #     raise serializers.ValidationError(msg)
        return {"message": "OTP resent successfully."}

class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number', 'company', 'role']