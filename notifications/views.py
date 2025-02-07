from rest_framework import viewsets
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(user=user)
        type = self.request.query_params.get('type')
        is_read = self.request.query_params.get('is_read')
        is_muted = self.request.query_params.get('is_muted')

        if type and type != "":
            queryset = queryset.filter(type=type.lower())
        if is_read and is_read != "":
            is_read = True if is_read.lower() == "true" else False
            queryset = queryset.filter(is_read=is_read)
        if is_muted and is_muted != "":
            is_muted = True if is_muted.lower() == "true" else False
            queryset = queryset.filter(is_muted=is_muted)

        return queryset

    @action(detail=True, methods=['patch'])
    def partial_update(self, request, *args, **kwargs):
        notification_ids = request.data.get('notification_ids', [])
        is_read = request.data.get('is_read', None)
        is_muted = request.data.get('is_muted', None)

        if is_read is not None or is_muted is not None:
            notifications = Notification.objects.filter(id__in=notification_ids)
            if is_read is not None:
                notifications.update(is_read=is_read)
            if is_muted is not None:
                notifications.update(is_muted=is_muted)

            return Response({'message': 'Notifications status updated'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No updates provided'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request, *args, **kwargs):
        user = request.user
        notifications = Notification.objects.filter(user=user, is_read=False)
        notifications.update(is_read=True)
        return Response({'message': 'All notifications marked as read'}, status=status.HTTP_200_OK)