"""
Django views for login page.

Generated by 'django-admin startApp login' using Django 4.2.4.
"""

from django.shortcuts import render

def login_view(request):
    '''Login view'''
    return render(request, 'loginPage.html', {})