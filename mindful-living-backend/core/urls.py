from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'life-blocks', views.LifeBlockViewSet, basename='life-block')
router.register(r'tasks', views.TaskViewSet, basename='task')
router.register(r'finances', views.FinanceViewSet, basename='finance')
router.register(r'schedules', views.ScheduleViewSet, basename='schedule')
router.register(r'analytics', views.AnalyticsViewSet, basename='analytics')
router.register(r'chats', views.ChatViewSet, basename='chat')
router.register(r'custom-life-blocks', views.CustomLifeBlockViewSet, basename='custom-life-block')

urlpatterns = [
    path('', include(router.urls)),
] 