from rest_framework import serializers
from .models import Project, Task, ProjectAttachment, TaskAttachment

class ProjectAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAttachment
        fields = ['id', 'file']

class TaskAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAttachment
        fields = ['id', 'file']

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

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['creator']

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

    def create(self, validated_data):
        attachments = validated_data.pop('attachments', [])
        task = Task.objects.create(**validated_data)

        for file in attachments:
            TaskAttachment.objects.create(task=task, file=file)

        return task

    def update(self, instance, validated_data):
        attachments = validated_data.pop('attachments', [])
        del_attachments = validated_data.pop('del_attachments', [])

        # Delete specific attachments
        TaskAttachment.objects.filter(id__in=del_attachments, task=instance).delete()

        instance = super().update(instance, validated_data)

        # Add new attachments
        for file in attachments:
            TaskAttachment.objects.create(task=instance, file=file)

        return instance
