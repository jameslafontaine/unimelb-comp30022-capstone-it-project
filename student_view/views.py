"""
Django views for student_view project.

Generated by 'django-admin startApp student_view' using Django 4.2.4.
"""

import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from canvas_app.tests import *

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

def view_req_view(request, thread_id):
    '''View requests view'''
    # check the id exists

    return render(request, 'viewRequest.html', {'thread_id': thread_id})
    #return JsonResponse({'error': 'Record not found'}, status=404)

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
            'cases': json.dumps([case11, case12])
        })
    return student_not_found_view(request)

def get_requests_from_case(request, case_id):
    '''GET requests from case'''
    if case_id == 11:
        return JsonResponse({
            'requests': json.dumps([req311, req312])
        })
    if case_id == 12:
        return JsonResponse({
            'requests': json.dumps([req321, req322])
        })
    if case_id == 21:
        return JsonResponse({
            'requests': json.dumps([req311, req312])
        })
    if case_id == 22:
        return JsonResponse({
            'requests': json.dumps([req321, req322])
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

def get_threads(request, case_id):
    if(case_id == 11):
        return JsonResponse({
            'threads': json.dumps([thread11])
        })
    elif(case_id == 12):
        return JsonResponse({
            'threads': json.dumps([thread12, thread13])
        })
    
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
            'requests': json.dumps([req322])
        })

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
