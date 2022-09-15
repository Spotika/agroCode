from django.shortcuts import render
from django.urls import reverse
from django.shortcuts import redirect



def home(request):
    return render(request, 'main/home.html')



def about(request):
    pass