from django.shortcuts import render
from django.urls import reverse
from django.shortcuts import redirect
from . import methods


def home(request):

    Map = methods.CustomMap()
    Map.crop_output()
    print("cropped")
    return render(request, 'main/home.html')



def about(request):
    pass