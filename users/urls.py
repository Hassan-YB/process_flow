from django.urls import path
from .views import (
    SignupView, OTPVerificationView, LoginView, ProfileViewSet,
    ChangePasswordView
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('verify-otp/', OTPVerificationView.as_view(), name='verify_otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('password/change/', ChangePasswordView.as_view(), name='change_password'),
    path('profile/', ProfileViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
    }), name='user_profile'),
]
