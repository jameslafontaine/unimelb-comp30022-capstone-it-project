"""
Django views for student_view project.

Generated by 'django-admin startApp student_view' using Django 4.2.4.
"""

from django.shortcuts import render

def home_view(request):
    return render(request, 'sHome.html', {})

def submit_req_view(request):
    return render(request, 'submitRequest.html', {})

def cases_view(request):
    return render(request, 'viewCases.html', {})

def aaps_view(request):
    return render(request, 'viewAAPs.html', {})