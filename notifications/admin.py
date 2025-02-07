from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'title', 'message', 'is_read', 'is_muted')
    list_filter = ('type', 'is_read', 'is_muted')
    search_fields = ('user__username', 'title', 'message')
    readonly_fields = ('created_at', 'updated_at')
