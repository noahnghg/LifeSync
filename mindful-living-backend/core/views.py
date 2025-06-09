from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters import rest_framework as filters
from .models import (
    User, LifeBlock, Task, Finance, Schedule,
    Analytics, Chat, CustomLifeBlock
)
from .serializers import (
    UserSerializer, LifeBlockSerializer, TaskSerializer,
    FinanceSerializer, ScheduleSerializer, AnalyticsSerializer,
    ChatSerializer, CustomLifeBlockSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

class LifeBlockViewSet(viewsets.ModelViewSet):
    serializer_class = LifeBlockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LifeBlock.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['status', 'priority', 'life_block']

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.status = 'done'
        task.save()
        return Response({'status': 'task completed'})

class FinanceViewSet(viewsets.ModelViewSet):
    serializer_class = FinanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['transaction_type', 'category', 'date']

    def get_queryset(self):
        return Finance.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        queryset = self.get_queryset()
        total_income = queryset.filter(transaction_type='income').aggregate(
            total=models.Sum('amount'))['total'] or 0
        total_expenses = queryset.filter(transaction_type='expense').aggregate(
            total=models.Sum('amount'))['total'] or 0
        return Response({
            'total_income': total_income,
            'total_expenses': total_expenses,
            'balance': total_income - total_expenses
        })

class ScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['life_block', 'start_time', 'end_time']

    def get_queryset(self):
        return Schedule.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AnalyticsViewSet(viewsets.ModelViewSet):
    serializer_class = AnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['life_block', 'metric_name', 'date']

    def get_queryset(self):
        return Analytics.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CustomLifeBlockViewSet(viewsets.ModelViewSet):
    serializer_class = CustomLifeBlockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CustomLifeBlock.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 