"""
Django views for student_view project.

Generated by 'django-admin startApp student_view' using Django 4.2.4.
"""

import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .tests import *

USER_ID = -1

def student_not_found_view(request):
    '''Not found view'''
    return render(request, 'notFound404.html', {})

def home_view(request):
    '''Home view'''
    return render(request, 'sHome.html', {})

def student_web_header_view(request):
    '''Student web header view'''
    # take the id and edit header with initial data
    if USER_ID == 1:
        usr = json.dumps(usr1)
        return render(request, 'sWebHeader.html', {'usr':usr})
    if USER_ID == 2:
        usr = json.dumps(usr2)
        return render(request, 'sWebHeader.html', {'usr':usr})
    # whoops maybe id doesnt exist
    return HttpResponseBadRequest("Not a POST request, invalid")

def submit_req_view(request):
    '''Submit request view'''
    return render(request, 'submitRequest.html', {})

def cases_view(request):
    '''Cases view'''
    return render(request, 'viewCases.html', {})

def aaps_view(request):
    '''AAPs view'''
    return render(request, 'viewAAPs.html', {})

def view_req_view(request, input_id):
    '''View requests view'''
    # check the id exists

    if input_id == student_request_1['id']:
        req = json.dumps(student_request_1)
        return render(request, 'viewRequest.html', {'req':req})
    if input_id == student_request_2['id']:
        req = json.dumps(student_request_2)
        return render(request, 'viewRequest.html', {'req':req})
    return JsonResponse({'error': 'Record not found'}, status=404)

# GET REQUESTS
# test/example purposes only, obviously not useable, must be filled in by backend
def get_case(request, case_id):
    '''GET a case'''
    if case_id == 12:
        return JsonResponse(student_case_1_2)
    return student_not_found_view(request)

def get_active_cases(request):
    '''GET active cases'''

    if USER_ID == 1:
        return JsonResponse({
            'cases': json.dumps([case11, case12])
        })
    elif USER_ID == 2:
        return JsonResponse({
            'cases': json.dumps([case21, case22])
        })
    return student_not_found_view(request)

def get_requests_from_case(request, case_id):
    '''GET requests from case'''
    if case_id == 1:
        return JsonResponse({
            'requestIds': json.dumps([1,2])
        })
    return student_not_found_view(request)

def get_request(request, request_id):
    '''GET a request'''
    if request_id == 1:
        return JsonResponse(student_request_1)
    return student_not_found_view(request)

def get_old_versions(request, request_id):
    '''GET old versions'''
    if request_id == 1:
        return JsonResponse({
            'oldVersionIds' : json.dumps([1,2])})
    return student_not_found_view(request)

def get_user_id(request):
    '''Get user ID'''
    print(request + "Yay!") # Make PyLint happy
    return JsonResponse({'id': USER_ID})

# POST REQUESTS
@csrf_exempt
def student_new_request(request):
    '''POST new request'''
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            # e.g. req3 = json.loads(request.body.decode('utf-8'))
            print("") # make pylint happy
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON data")
        return JsonResponse({"message": "Case created successfully"})
    return HttpResponseBadRequest("Not a POST request, invalid")

# PUT REQUESTS
@csrf_exempt
def set_user_id(request, input_id):
    '''Set user ID'''
    if request.method == 'PUT':
        global USER_ID
        USER_ID = input_id
        print(input_id) # make pylint happy
        return JsonResponse({"message": "id successfully set"})
    return HttpResponseBadRequest("Not a POST request, invalid")
