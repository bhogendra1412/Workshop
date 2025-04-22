
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import render
from .models import Task
import json

def index(request):
    return render(request, 'index.html')

@method_decorator(csrf_exempt, name='dispatch')
class TaskView(View):
    def get(self, request):
        tasks = Task.objects.all()
        task_list = [{'id': task.id, 'description': task.description, 'created_at': task.created_at} for task in tasks]
        return JsonResponse({'tasks': task_list}, status=200)

    def post(self, request):
        try:
            data = json.loads(request.body)
            description = data.get('description')
            if not description:
                return JsonResponse({'error': 'Description is required'}, status=400)
            task = Task.objects.create(description=description)
            return JsonResponse({'id': task.id, 'description': task.description, 'created_at': task.created_at}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
