"""
Django views shared between all apps.
"""

import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .tests import *

def get_thread(request, thread_id):
    if(thread_id == 11):
        return JsonResponse(thread11)
    elif(thread_id == 12):
        return JsonResponse(thread12)
    elif(thread_id == 13):
        return JsonResponse(thread13)

def get_course(request, course_id):
    if(course_id == 31):
        return JsonResponse(course31)
    elif(course_id == 32):
        return JsonResponse(course32)
    elif(course_id == 41):
        return JsonResponse(course41)
    elif(course_id == 42):
        return JsonResponse(course42)

def get_assignment(request, assign_id):
    if(assign_id == 1):
        return JsonResponse(assign1)
    elif(assign_id == 2):
        return JsonResponse(assign2)
    elif(assign_id == 3):
        return JsonResponse(assign3)
    elif(assign_id == 4):
        return JsonResponse(assign4)
    elif(assign_id == 5):
        return JsonResponse(assign5)