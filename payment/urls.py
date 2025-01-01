from django.urls import path
from .views import WebhookView, SubscriptionView, PriceListView

app_name = 'payment'

urlpatterns = [
    path('webhook/', WebhookView.as_view(), name='webhook'),
    path('prices/', PriceListView.as_view(), name='price_list'),
    path('subscriptions/', SubscriptionView.as_view({'post': 'create', 'put': 'update'}), name='subscription_create_or_update'),
    path('subscriptions/<int:subscription_id>/', SubscriptionView.as_view({'delete': 'cancel'}), name='subscription_detail'),
    path('subscriptions/<int:subscription_id>/success/', SubscriptionView.as_view({'post': 'success'}), name='subscription_success'),
]
