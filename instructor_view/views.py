"""
Django views for instructor_view project.

Generated by 'django-admin startApp instructor_view' using Django 4.2.4.
"""

from django.shortcuts import render
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

USER_ID = -1 # set to -1 default to detect issues

# fake data to play with before DB connected
usr3 = {
    'user_id': 3,
    'name' : 'Ryan Goh',
    'first_name': 'Ryan',
    'last_name': 'Goh',
    'email': 'insertEmailHereLol@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}
usr4 = {
    'user_id': 4,
    'name' : 'Yan Zong Goh',
    'first_name': 'Yan Zong',
    'last_name': 'Goh',
    'email': 'thisIsAnEmail@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}

case12 = {
    'Date_Updated': 28112001,
    'Date_Created': 11092001,
    'caseID' : 12,
    'users_user_id' : 1,
}
case13 = {
    'Date_Updated': 10102023,
    'Date_Created': 11092023,
    'caseID' : 13,
    'users_user_id' : 1,
}

# fake user 3s courses
course31 = {
    'course_id': 'COMP30022',
    'subject_name': 'IT Project',
}
course32 = {
    'course_id': 'COMP30023',
    'subject_name': 'Computer Systems',
}

#fake user 4s courses
course41 = {
    'course_id': 'COMP30019',
    'subject_name': 'Graphics and Interaction',
}
course42 = {
    'course_id': 'COMP30026',
    'subject_name': 'Models of Computation',
}

# how are we getting the reserved and unresolved cases??

req1 = {
    'id': 1,
    'course': 'COMP30022',
    'dateCreated': '28/11/2001',
    'status': 'waiting for action',
    'message': 'The dog ate my homework',
}
req2 = {
    'id': 2,
    'course': 'COMP30026',
    'dateCreated': '1/1/2023',
    'status': 'waiting for action',
    'message': 'The cat ate my homework', 
}

subj1 = {
    'id': 1,
}
subj2 = {
    'id': 2,
}
subjSettings = {
    'globalExtentionLength': 1,
    'generalTutor': 1,
    'extensionTutor': 1,
    'quizTutor': 1,
    'remarkTutor': 1,
    'otherTutor': 1,    
    'generalScoord': 1,
    'extensionScoord': 1,
    'quizScoord': 1,
    'remarkScoord': 1,
    'otherScoord': 1,
    'generalReject': 'Message',
    'extensionApprove': 'Message',
    'extensionReject': 'Message',
    'quizApprove': 'Message',
    'quizReject': 'Message',
    'remarkApprove': 'Message',
    'remarkReject': 'Message',
}
course1 = {
    'course_id': 1,
    'subject_name': 'sugma',
}

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
    elif USER_ID == 4:
        usr = json.dumps(usr4)
    # whoops maybe id doesnt exist
    return render(request, 'iWebHeader.html', {'usr':usr})

def review_req_view(request, input_id):
    ''' check the id exists '''
    if input_id == req1['id']:
        req = json.dumps(req1)
        return render(request, 'reviewRequest.html', {'req':req})
    if input_id == req2['id']:
        req = json.dumps(req2)
        return render(request, 'reviewRequest.html', {'req':req})
    return JsonResponse({'error': 'Record not found'}, status=404)

def view_reqs_view(request):
    '''View requests'''
    return render(request, 'viewRequests.html', {})

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
    if user_id == 1:
        return JsonResponse({
            'courses': json.dumps([course1, course1])
        })
    # id not found
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
        return JsonResponse(subjSettings)
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

def get_id(request):
    '''Get the ID of a request ?'''
    print(request) # To make Pylint happy
    return JsonResponse({'id': USER_ID})

# POST REQUESTS
@csrf_exempt
def add_aap(request):
    '''POST an aap'''
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            """
            e.g. aap = json.loads(request.body.decode('utf-8'))
            """
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON data")
        return JsonResponse({"message": "Case created successfully"})

# PUT REQUESTS
@csrf_exempt
def make_complex(request, request_id):
    '''Make a request complex'''
    # check the id exists and all that jazz
    if request.method == 'PUT':
        # if complex, set to non-complex
        # else make complex
        print("") # Pylint happy
    return JsonResponse({"message": "Case created successfully"})

@csrf_exempt
def set_user_id(request, id):
    '''Set a user id'''
    if request.method == 'PUT':
        global USER_ID
        USER_ID = id
        return JsonResponse({"message": "id successfully set"})

@csrf_exempt
def request_response(request, request_id):
    '''Set response request'''
    # check the id exists and all that jazz
    if request.method == 'PUT':
        # read the header to see what the response is and set it
        print(request_id) # make pylint happy
    return JsonResponse({"message": "Case created successfully"})

@csrf_exempt
def change_settings(request):
    '''Change settings'''
    # check the id exists and all that jazz
    if request.method == 'PUT':
        # read the header to see what settings have been changed
        print("") # make pylint happy
    return JsonResponse({"message": "Case created successfully"})
