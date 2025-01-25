from django.urls import path
from .views import ProjectViewSet, TaskViewSet, ProjectDashboardView

project_list = ProjectViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
project_detail = ProjectViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

task_list = TaskViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
task_detail = TaskViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    path('projects/', project_list, name='project-list'),
    path('projects/dashboard/', ProjectDashboardView.as_view(), name='project-dashboard'),
    path('projects/<int:pk>/', project_detail, name='project-detail'),
    path('tasks/', task_list, name='task-list'),
    path('tasks/<int:pk>/', task_detail, name='task-detail'),
]
