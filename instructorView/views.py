from django.shortcuts import render
from django.http import JsonResponse

def home_view(request):
    return render(request, 'home.html', {})

def view_req_view(request):
    return render(request, 'viewRequests.html', {})

def get_data(request):
    data = {"ID": 1234, "firstName": "Callum"} # get actual data
    
    return JsonResponse(data)