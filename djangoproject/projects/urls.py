from django.urls import path
from .views import ProjectListCreateView, ProjectDetailView, CustomAuthToken, index, RegisterView

urlpatterns = [
    path('', index, name='index'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
] 