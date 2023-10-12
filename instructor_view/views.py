"""
Django views for instructor_view project.

Generated by 'django-admin startApp instructor_view' using Django 4.2.4.
"""

import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

# as this will be deleted when fully attached, i wont bother doing the imports the long way
from canvas_app.tests import *

USER_ID = -1 # set to -1 default to detect issues

def not_found_view(request):
    '''View not found'''
    return render(request, 'notFound404.html', {})

def home_view(request):
    '''Home view'''
    return render(request, 'iHome.html', {})

def instructor_web_header_view(request):
    ''' take the id and edit header with initial data '''
    if USER_ID == 3:
        usr = json.dumps(usr3)
        return render(request, 'iWebHeader.html', {'usr': usr})
    if USER_ID == 4:
        usr = json.dumps(usr4)
        return render(request, 'iWebHeader.html', {'usr': usr})
    # whoops maybe id doesnt exist
    return HttpResponseBadRequest("Invalid Request Type")

def review_req_view(request, input_id):
    ''' check the id exists '''
    if input_id == req1['id']:
        req = json.dumps(req1)
        return render(request, 'reviewRequest.html', {'req':req})
    if input_id == req2['id']:
        req = json.dumps(req2)
        return render(request, 'reviewRequest.html', {'req':req})
    return JsonResponse({'error': 'Record not found'}, status=404)

def view_reqs_view(request, id):
    courseId = id
    if(courseId == 31):
        return render(request, 'viewRequests.html', {'course': json.dumps(course31)})
    if(courseId == 32):
        return render(request, 'viewRequests.html', {'course': json.dumps(course32)})
    if(courseId == 41):
        return render(request, 'viewRequests.html', {'course': json.dumps(course41)})
    if(courseId == 42):
        return render(request, 'viewRequests.html', {'course': json.dumps(course42)})

def view_resolved_view(request, input_id):
    '''View resolved requests'''
    print(input_id) # To make pylint happy
    return render(request, 'viewResolved.html', {})

def subj_settings_view(request, input_id):
    '''View for subject preferences'''
    # Check the ID exists
    if input_id == subj1['id']:
        req = json.dumps(subj1)
        return render(request, 'subjectSettings.html', {'req':req})
    if input_id == subj2['id']:
        req = json.dumps(subj2)
        return render(request, 'subjectSettings.html', {'req':req})
    return JsonResponse({'error': 'Record not found'}, status=404)

def view_profile_view(request, input_id):
    '''View for student profile'''
    # check the id exists
    if input_id == usr3['id']:
        usr = json.dumps(usr3)
        return render(request, 'viewProfile.html', {'usr':usr})
    if input_id == usr4['id']:
        usr = json.dumps(usr4)
        return render(request, 'viewProfile.html', {'usr':usr})
    return JsonResponse({'error': 'Record not found'}, status=404)


# GET REQUESTS
# test/example purposes only, obviously not useable, must be filled in by backend
def get_courses(request, user_id):
    '''GET request for courses'''
    if(user_id == 3):
        return JsonResponse({
            'courses': json.dumps([course31, course32])
        })
    elif(user_id == 4):
        return JsonResponse({
            'courses': json.dumps([course41, course42])
        })
    return not_found_view(request)

def get_request_status(request, request_id):
    '''GET request for request status'''
    if request_id == 1:
        return JsonResponse({'status': 'balls'})
    # id not found
    return not_found_view(request)

def get_request(request, request_id):
    '''GET a request'''
    if request_id == 1:
        return JsonResponse(req1)
    # id not found
    return not_found_view(request)

def get_old_versions(request, request_id):
    '''GET old requests of request'''
    if request_id == 1:
        return JsonResponse({'request_ids':json.dumps([1,2,3])})
    # id not found
    return not_found_view(request)

def get_student(request, student_id):
    '''GET a student by id'''
    if student_id == 3:
        return JsonResponse(usr3)
    # id not found
    return not_found_view(request)

def get_subject_settings(request, subject_id):
    '''GET all settings for a subject'''
    if subject_id == 1:
        return JsonResponse(subj_settings)
    # id not found
    return not_found_view(request)

def get_aap(request, aap_id):
    '''GET AAPs of request?'''
    if aap_id == 1:
        return JsonResponse({'this is an aap': 'aap go beep boop'})
    # id not found
    return not_found_view(request)

def get_request_history(request, student_id):
    '''GET the history of requests'''
    if student_id == 1:
        return JsonResponse({
            'requests':json.dumps([req1, req2])
        })
    # id not found
    return not_found_view(request)

def get_user_id(request):
    '''Get the ID of the user'''
    print(request) # pylint
    return JsonResponse({'id': USER_ID})

def get_threads(request, course_id):
    '''Get the threads belonging to a course'''
    print(request) # pylint
    if((course_id == 31)):
        return JsonResponse({
            'threads': json.dumps([thread11])
        })
    elif((course_id == 32)):
        return JsonResponse({
            'threads': json.dumps([thread12])
        })
    elif((course_id == 41)):
        return JsonResponse({
            'threads': json.dumps([thread13])
        })

# POST REQUESTS
@csrf_exempt
def instructor_add_aap(request):
    '''POST an aap as an Instructor'''
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            # e.g. aap = json.loads(request.body.decode('utf-8'))
            print(USER_ID) # happy Pylint
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON data")
        return JsonResponse({"message": "Case created successfully"})
    return HttpResponseBadRequest("Invalid Request Type")

# PUT REQUESTS
@csrf_exempt
def make_complex(request, request_id):
    '''Make a request complex'''
    # check the id exists and all that jazz
    if request.method == 'PUT':
        # if complex, set to non-complex
        # else make complex
        print(request_id) # Pylint happy
    return JsonResponse({"message": "Case created successfully"})

@csrf_exempt
def set_user_id(request, input_id):
    '''Set a user id'''
    if request.method == 'PUT':
        global USER_ID
        USER_ID = input_id
        print(input_id) # Make pylint happy
        return JsonResponse({"message": "id successfully set"})
    return HttpResponseBadRequest("Invalid Request Type")

@csrf_exempt
def request_response(request, request_id):
    '''Set response request'''
    # check the id exists and all that jazz
    if request.method == 'PUT':
        # read the header to see what the response is and set it
        print(request_id) # make pylint happy
        return JsonResponse({"message": "Case created successfully"})
    return HttpResponseBadRequest("Invalid Request Type")

@csrf_exempt
def change_settings(request):
    '''Change settings'''
    # check the id exists and all that jazz
    if request.method == 'PUT':
        # read the header to see what settings have been changed
        print("") # make pylint happy
        return JsonResponse({"message": "Case created successfully"})
    return HttpResponseBadRequest("Invalid Request Type")