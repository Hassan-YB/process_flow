from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.mail import send_mail

from .models import User
from .models import OTP

import random
import os

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

    def create(self, validated_data):
        # Extract email and generate username
        email = validated_data['email']
        username = email.split('@')[0]  # Use the part before '@' as username

        # Create user instance
        user = User.objects.create_user(
            email=email,
            username=username,
            full_name=validated_data['full_name'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            role=User.RoleChoices.FREE,
            is_active=False
        )

        # Generate OTP
        otp_code = f"{random.randint(100000, 999999)}"
        OTP.objects.create(user=user, code=otp_code)

        # Send OTP via email
        send_mail(
            'Your OTP Code',
            f'Your OTP code is {otp_code}',
            os.environ.get('DEFAULT_FROM_EMAIL', 'no-reply@example.com'),
            [user.email],
            fail_silently=False,
        )

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
        user = User.objects.get(email=email)
        user.is_active = True  # Activate the user account
        user.save()
        OTP.objects.filter(user=user).delete()  # Delete the used OTP
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
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
