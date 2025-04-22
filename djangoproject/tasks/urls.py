from django.urls import path
from .views import TaskView, index

urlpatterns=[
    path('',index,name='index'),
    path('tasks/',TaskView.as_view(),name='task-list'),
]