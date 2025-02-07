
from django.urls import path
from .views import (
    NotificationViewSet
)

urlpatterns = [
    path('', NotificationViewSet.as_view({'get': 'list'}), name='notifications'),
    path('<int:pk>/', NotificationViewSet.as_view({'get': 'retrieve'}), name='notification-detail'),
    path('update/', NotificationViewSet.as_view({'patch': 'partial_update'}), name='partial-update'),
    path('mark_all_as_read/', NotificationViewSet.as_view({'post': 'mark_all_as_read'}), name='mark-all-as-read'),
]
