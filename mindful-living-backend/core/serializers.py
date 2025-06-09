from rest_framework import serializers
from .models import (
    User, LifeBlock, Task, Finance, Schedule,
    Analytics, Chat, CustomLifeBlock
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'profile_picture', 'bio',
                 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class LifeBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = LifeBlock
        fields = ('id', 'name', 'description', 'user', 'color', 'icon',
                 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'user', 'life_block',
                 'priority', 'status', 'due_date', 'completed_at',
                 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class FinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finance
        fields = ('id', 'user', 'amount', 'transaction_type', 'category',
                 'description', 'date', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ('id', 'title', 'description', 'user', 'life_block',
                 'start_time', 'end_time', 'location', 'is_all_day',
                 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = ('id', 'user', 'life_block', 'metric_name', 'metric_value',
                 'date', 'created_at')
        read_only_fields = ('created_at',)

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ('id', 'user', 'message', 'is_ai_response', 'created_at')
        read_only_fields = ('created_at',)

class CustomLifeBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomLifeBlock
        fields = ('id', 'name', 'description', 'user', 'parent_block',
                 'color', 'icon', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at') 