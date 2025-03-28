from django.db import models
from core.models import BaseDateTimeModel
from users.models import User

class Priority(models.TextChoices):
    low = 'low', 'Low'
    medium = 'medium', 'Medium'
    high = 'high', 'High'

class Project(BaseDateTimeModel):
    class StatusChoices(models.TextChoices):
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'

    title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    priority = models.CharField(max_length=50, choices=Priority.choices, default=Priority.low)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.IN_PROGRESS)
    is_open = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class ProjectAttachment(BaseDateTimeModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='project_attachments/')

    def __str__(self):
        return f"Attachment for {self.project.title}"

class ProjectAssignee(BaseDateTimeModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='assignees')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField()
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_registered = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.email} assigned to {self.project.title}" 

class Task(BaseDateTimeModel):
    class StatusChoices(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    priority = models.CharField(max_length=50, choices=Priority.choices, default=Priority.low)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    completion_requested = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class TaskAssignee(BaseDateTimeModel):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignees')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField()
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_registered = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.email} assigned to {self.task.title}" 

class TaskAttachment(BaseDateTimeModel):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='task_attachments/')

    def __str__(self):
        return f"Attachment for {self.task.title} by {self.task.creator.email}" 


class TaskCompletionRequest(BaseDateTimeModel):
    class StatusChoices(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='completion_requests')
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    rejection_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Completion request for {self.task.title}" 

class TaskCompletionAttachment(BaseDateTimeModel):
    task_completion_request = models.ForeignKey(TaskCompletionRequest, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='task_completion_attachments/')

    def __str__(self):
        return f"Completion Attachment for {self.task_completion_request.task.title}"

class Category(BaseDateTimeModel):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='subcategories', null=True, blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_categories')

    def __str__(self):
        return self.name
