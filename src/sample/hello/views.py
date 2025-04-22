from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from django.views import View
from .models import User
import json

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class UserView(View):
    def get(self, request):
        users = User.objects.all()
        user_list = [{'id': user.id, 'name': user.name, 'created_at': user.created_at} for user in users]
        return JsonResponse({'users': user_list}, status=200)

    def post(self, request):
        try:
            data = json.loads(request.body)
            name = data.get('name')
            if not name:
                return JsonResponse({'error': 'Name is required'}, status=400)
            
            # Create new user
            user = User.objects.create(name=name)
            return JsonResponse({'id': user.id, 'name': user.name, 'created_at': user.created_at}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)