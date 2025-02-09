from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now

from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(creator=self.request.user)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(creator=self.request.user)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class ProjectDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Optimize queries by prefetching related fields to avoid N+1 queries
        projects = Project.objects.filter(creator=user).prefetch_related('tasks')

        # Efficient count calculations
        total_projects = projects.count()
        completed_projects = projects.filter(status=Project.StatusChoices.COMPLETED).count()
        in_progress_projects = projects.filter(status=Project.StatusChoices.IN_PROGRESS).count()

        # Efficient task aggregation using annotation
        tasks = Task.objects.filter(project__creator=user).select_related('project')

        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status=Task.StatusChoices.COMPLETED).count()
        pending_tasks = tasks.filter(status=Task.StatusChoices.PENDING).count()
        overdue_tasks = tasks.filter(
            status=Task.StatusChoices.PENDING, 
            project__end_date__lt=now().date()
        ).count()

        # Serialize project and task data efficiently
        all_projects_data = ProjectSerializer(projects[:3], many=True).data
        all_tasks_data = TaskSerializer(tasks[:3], many=True).data

        dashboard_data = {
            'total_projects': total_projects,
            'completed_projects': completed_projects,
            'in_progress_projects': in_progress_projects,
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'overdue_tasks': overdue_tasks,
            'all_projects': all_projects_data,
            'all_tasks': all_tasks_data,
        }

        return Response(dashboard_data)