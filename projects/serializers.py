from rest_framework import serializers
from django.utils import timezone
from django.db.models import Q
from .models import Project, Task, ProjectAttachment, TaskAttachment, TaskCompletionRequest

class ProjectAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAttachment
        fields = ['id', 'file']

class TaskAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAttachment
        fields = ['id', 'file']


class TaskSerializer(serializers.ModelSerializer):
    attachments = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    del_attachments = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    uploads = TaskAttachmentSerializer(many=True, read_only=True, source='attachments')

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['creator']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # If updating an existing instance, make project field read-only and not required.
        if self.instance is not None:
            self.fields['project'].read_only = True
            self.fields['project'].required = False

    def create(self, validated_data):
        attachments = validated_data.pop('attachments', [])
        task = Task.objects.create(**validated_data)

        for file in attachments:
            TaskAttachment.objects.create(task=task, file=file)

        return task

    def update(self, instance, validated_data):
        attachments = validated_data.pop('attachments', [])
        del_attachments = validated_data.pop('del_attachments', [])
        
        validated_data.pop('project', None)

        # Delete specific attachments
        TaskAttachment.objects.filter(id__in=del_attachments, task=instance).delete()

        instance = super().update(instance, validated_data)

        # Add new attachments
        for file in attachments:
            TaskAttachment.objects.create(task=instance, file=file)

        return instance

class ProjectSerializer(serializers.ModelSerializer):
    attachments = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    del_attachments = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    uploads = ProjectAttachmentSerializer(many=True, read_only=True, source='attachments')
    tasks = TaskSerializer(many=True, read_only=True)

    # Additional computed fields for task counts
    pending_tasks_count = serializers.SerializerMethodField()
    in_progress_tasks_count = serializers.SerializerMethodField()
    completed_tasks_count = serializers.SerializerMethodField()
    overdue_tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['creator']

    def _get_task_counts(self, obj):
        if not hasattr(obj, '_task_counts'):
            # If tasks are prefetched, use them to avoid extra queries.
            if hasattr(obj, '_prefetched_objects_cache') and 'tasks' in obj._prefetched_objects_cache:
                tasks = obj._prefetched_objects_cache['tasks']
                counts = {'pending': 0, 'in_progress': 0, 'completed': 0}
                for task in tasks:
                    if task.status in counts:
                        counts[task.status] += 1
            else:
                # Otherwise, perform an aggregate query for efficiency.
                from django.db.models import Count, Q
                counts = obj.tasks.aggregate(
                    pending=Count('id', filter=Q(status=Task.StatusChoices.PENDING)),
                    in_progress=Count('id', filter=Q(status=Task.StatusChoices.IN_PROGRESS)),
                    completed=Count('id', filter=Q(status=Task.StatusChoices.COMPLETED))
                )
            obj._task_counts = counts
        return obj._task_counts

    def get_pending_tasks_count(self, obj):
        counts = self._get_task_counts(obj)
        return counts.get('pending', 0)

    def get_in_progress_tasks_count(self, obj):
        counts = self._get_task_counts(obj)
        return counts.get('in_progress', 0)

    def get_completed_tasks_count(self, obj):
        counts = self._get_task_counts(obj)
        return counts.get('completed', 0)

    def get_overdue_tasks_count(self, obj):
        today = timezone.now().date()
        # If tasks are prefetched, iterate to avoid extra queries
        if hasattr(obj, '_prefetched_objects_cache') and 'tasks' in obj._prefetched_objects_cache:
            overdue_count = 0
            for task in obj._prefetched_objects_cache['tasks']:
                if task.due_date and task.due_date < today:
                    # Consider task completed if its status is COMPLETED
                    if task.status == Task.StatusChoices.COMPLETED:
                        continue
                    # Check for an approved task completion request
                    if hasattr(task, '_prefetched_objects_cache') and 'completion_requests' in task._prefetched_objects_cache:
                        approved = any(
                            cr.status == TaskCompletionRequest.StatusChoices.APPROVED 
                            for cr in task._prefetched_objects_cache['completion_requests']
                        )
                    else:
                        approved = task.completion_requests.filter(
                            status=TaskCompletionRequest.StatusChoices.APPROVED
                        ).exists()
                    if not approved:
                        overdue_count += 1
            return overdue_count
        else:
            # Perform an optimized query with join and distinct
            return obj.tasks.filter(
                due_date__lt=today
            ).exclude(
                Q(status=Task.StatusChoices.COMPLETED) | Q(completion_requests__status=TaskCompletionRequest.StatusChoices.APPROVED)
            ).distinct().count()

    def create(self, validated_data):
        attachments = validated_data.pop('attachments', [])
        project = Project.objects.create(**validated_data)

        for file in attachments:
            ProjectAttachment.objects.create(project=project, file=file)

        return project

    def update(self, instance, validated_data):
        attachments = validated_data.pop('attachments', [])
        del_attachments = validated_data.pop('del_attachments', [])

        # Delete specific attachments
        ProjectAttachment.objects.filter(id__in=del_attachments, project=instance).delete()

        instance = super().update(instance, validated_data)

        # Add new attachments
        for file in attachments:
            ProjectAttachment.objects.create(project=instance, file=file)

        return instance
