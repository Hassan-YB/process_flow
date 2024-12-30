from django.urls import path
from .views import (
    SignupView, OTPVerificationView, LoginView, ProfileViewSet,
    ChangePasswordView, ForgotPasswordView, ResendOTPView, LogoutView
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('otp/verify/', OTPVerificationView.as_view(), name='verify_otp'),
    path('otp/resend/', ResendOTPView.as_view(), name='resend_otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('password/change/', ChangePasswordView.as_view(), name='change_password'),
    path('password/forgot/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
    }), name='user_profile'),
]
