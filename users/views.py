from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q

from notifications.models import Notification, NotificationChoices
from notifications.utils import MessageManager
from core.pagination import CountPagination

from .models import FCMDevice, User
from .serializers import (
    SignupSerializer, OTPVerificationSerializer, LoginSerializer, ChangePasswordSerializer,
    ProfileSerializer, ForgotPasswordSerializer, ResendOTPSerializer, UserSearchSerializer
)

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Save the user first

            # Register device
            token = request.data.get('fcm_token')
            name = request.data.get('device_name', '')
            platform = request.data.get('device_platform', '')
            FCMDevice.register_or_update_device(user=user, token=token, name=name, platform=platform)

            serializer.save()
            return Response(
                {"message": "User created successfully. Please check your email for OTP verification."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OTPVerificationView(APIView):
    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Account verified successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.user

            # Register device
            token = request.data.get('fcm_token')
            name = request.data.get('device_name', '')
            platform = request.data.get('device_platform', '')
            FCMDevice.register_or_update_device(user=user, token=token, name=name, platform=platform)

            # 1- Login Notification
            title, message, description = MessageManager.get_message('login')
            Notification.create_and_send_notification(user=user, message=message, title=title, description=description, type=NotificationChoices.ACCOUNT)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()

            # 2- Password Changed Notification
            title, message, description = MessageManager.get_message('password_changed')
            Notification.create_and_send_notification(user=user, message=message, title=title, description=description, type=NotificationChoices.ACCOUNT)
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProfileViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request):
        """Fetch the current user's profile."""
        user = request.user
        serializer = ProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request):
        """Update the current user's profile."""
        user = request.user
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    def post(self, request):
        """
        Handle Forgot Password (Send OTP and Reset PasswLogoutVieword).
        """
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            if 'otp_code' in request.data and 'new_password' in request.data:
                # Reset Password
                serializer.reset_password(request.data['new_password'])
                return Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)
            else:
                # Send OTP
                serializer.send_otp()
                return Response({"message": "OTP sent successfully for password reset."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOTPView(APIView):
    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        if serializer.is_valid():
            response = serializer.save()
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token
            return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserSearchView(ListAPIView):
    serializer_class = UserSearchSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CountPagination

    def post(self, request, *args, **kwargs):
        search_query = request.data.get('search', '').strip()

        if not search_query:
            return Response({"error": "Search query is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Perform case-insensitive search across multiple fields
        users = User.objects.filter(
            Q(email__icontains=search_query) |
            Q(full_name__icontains=search_query) |
            Q(phone_number__icontains=search_query)
        ).exclude(id=request.user.id).order_by('-date_joined')

        # Paginate the queryset
        page = self.paginate_queryset(users)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)