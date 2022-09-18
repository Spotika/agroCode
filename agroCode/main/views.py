from django.shortcuts import render
from django.urls import reverse
from django.shortcuts import redirect
from . import methods


def home(request):


    if request.method == 'POST':
        print(request.POST.getlist('points[]'))

    # Map = methods.CustomMap()
    # Map.crop_output()
    return render(request, 'main/home.html')



def about(request):
    pass