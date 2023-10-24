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
    
def get_requests_from_thread(request, thread_id):
    if(thread_id == 11):
        return JsonResponse({
            'requests': json.dumps([req311, req312])
        })
    elif(thread_id == 12):
        return JsonResponse({
            'requests': json.dumps([req321])
        })
    elif(thread_id == 13):
        return JsonResponse({
            'requests': json.dumps([req322,req323,req324])
        })

def get_user_details(request, user_id):
    if(user_id == 1):
        return JsonResponse(usr1)
    elif(user_id == 2):
        return JsonResponse(usr2)
    elif(user_id == 3):
        return JsonResponse(usr3)
    elif(user_id == 4):
        return JsonResponse(usr4)
    
def get_user_aaps(request, user_id):
    return JsonResponse({
        'aaps': json.dumps([aap1,aap2,aap3,aap4])
    })
