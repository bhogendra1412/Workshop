from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Project(models.Model):
    STATUS_CHOICES = (
        ('PLANNING', 'Planning'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLANNING')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

# python manage.py makemigrations
# python manage.py migrate
