from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    """Custom user model extending Django's AbstractUser"""
    email = models.EmailField(_('email address'), unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class LifeBlock(models.Model):
    """Base model for life blocks"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='life_blocks')
    color = models.CharField(max_length=7, default='#000000')
    icon = models.CharField(max_length=50, default='default')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

class Task(models.Model):
    """Task model for task management"""
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    life_block = models.ForeignKey(LifeBlock, on_delete=models.CASCADE, related_name='tasks')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-due_date', 'priority']

class Finance(models.Model):
    """Financial transaction model"""
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('transfer', 'Transfer'),
    ]

    CATEGORIES = [
        ('salary', 'Salary'),
        ('food', 'Food'),
        ('transportation', 'Transportation'),
        ('housing', 'Housing'),
        ('entertainment', 'Entertainment'),
        ('utilities', 'Utilities'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='finances')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    description = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

class Schedule(models.Model):
    """Schedule/Calendar event model"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schedules')
    life_block = models.ForeignKey(LifeBlock, on_delete=models.CASCADE, related_name='schedules')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    is_all_day = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_time']

class Analytics(models.Model):
    """Analytics data model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analytics')
    life_block = models.ForeignKey(LifeBlock, on_delete=models.CASCADE, related_name='analytics')
    metric_name = models.CharField(max_length=100)
    metric_value = models.FloatField()
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = 'Analytics'

class Chat(models.Model):
    """Chat message model"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats')
    message = models.TextField()
    is_ai_response = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

class CustomLifeBlock(models.Model):
    """Custom life block model for user-defined life blocks"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='custom_life_blocks')
    parent_block = models.ForeignKey(LifeBlock, on_delete=models.CASCADE, related_name='custom_blocks')
    color = models.CharField(max_length=7, default='#000000')
    icon = models.CharField(max_length=50, default='default')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at'] 