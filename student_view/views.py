"""
Django views for student_view project.

Generated by 'django-admin startApp student_view' using Django 4.2.4.
"""

from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
import json
from django.views.decorators.csrf import csrf_exempt

usrId = -1 # set to -1 default to detect issues

def not_found_view(request):
    return render(request, 'notFound404.html', {})

def home_view(request):
    return render(request, 'sHome.html', {})

def sWeb_header_view(request):
    # take the id and edit header with initial data
    if(usrId == 1):
        usr = json.dumps(usr1)
        return render(request, 'sWebHeader.html', {'usr':usr})
    if(usrId == 2):
        usr = json.dumps(usr2)
        return render(request, 'sWebHeader.html', {'usr':usr})
    # whoops maybe id doesnt exist

def submit_req_view(request):
    return render(request, 'submitRequest.html', {})

def cases_view(request):
    return render(request, 'viewCases.html', {})

def aaps_view(request):
    return render(request, 'viewAAPs.html', {})

def view_req_view(request, id):
    # check the id exists

    if(id == req1['id']):
        req = json.dumps(req1)
        return render(request, 'viewRequest.html', {'req':req})
    elif(id == req2['id']):
        req = json.dumps(req2)
        return render(request, 'viewRequest.html', {'req':req})
    else:
        return JsonResponse({'error': 'Record not found'}, status=404)
    
# GET REQUESTS
# test/example purposes only, obviously not useable, must be filled in by backend
def get_case(request, case_id):
    if(case_id == 12):
        return JsonResponse(case12)
    if(case_id == 13):
        return JsonResponse(case13)
    else: # id not found
        return not_found_view(request)
    
def get_active_cases(request, user_id):
    if(user_id == 1): # id found
        return JsonResponse({
            'cases': {
                'case12': case12,
                'case13': case13,
            }
        })
    else: # id not found
        return not_found_view(request)

def get_requests_from_case(request, case_id):
    if(case_id == 1):
        return JsonResponse({
            'requestIds': json.dumps([1,2])
        })
    else: # id not found
        return not_found_view(request)

def get_request(request, request_id):
    if(request_id == 1):
        return JsonResponse(req1)
    else: # id not found
        return not_found_view(request)

def get_old_versions(request, request_id):
    if(request_id == 1):
        return JsonResponse({
            'oldVersionIds' : json.dumps([1,2])})
    else: # id not found
        return not_found_view(request)
    
def get_user_id(request):
    return JsonResponse({'id': usrId})

# POST REQUESTS
@csrf_exempt
def new_request(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            """
            e.g. req3 = json.loads(request.body.decode('utf-8'))
            """
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON data")
        return JsonResponse({"message": "Case created successfully"})
    
# PUT REQUESTS
@csrf_exempt
def set_user_id(request, id):
    if request.method == 'PUT':
        global usrId
        usrId = id
        return JsonResponse({"message": "id successfully set"})
    

# fake data to play with before DB connected
usr1 = {
    'id': 1,
    'firstName': 'Jun',
    'lastName': 'Youn',
    'email': 'blahblah@student.unimelb.edu.au',
    'emailNotifications': 1,
    'darkMode': 1,
}
usr2 = {
    'id': 2,
    'firstName': 'James',
    'lastName': 'La Fontaine',
    'email': 'bingbong@student.unimelb.edu.au',
    'emailNotifications': 1,
    'darkMode': 1,
}


# fake user 1's cases
case11 = {
    'case_id' : 11,
    'user_id' : 1,
    'date_created': "11-09-2001 14:12:01",
    'date_updated': "28-11-2001 12:30:15",
}
case12 = {
    'case_id' : 12,
    'user_id' : 1,
    'date_created': "11-09-2023 03:50:09",
    'date_updated': "10-10-2023 16:01:59",
}
# fake user 2's cases
case21 ={
    'case_id' : 21,
    'user_id' : 2,
    'date_created': "11-09-2001 14:12:01",
    'date_updated': "28-11-2001 12:30:15",
}
case22 = {
    'case_id' : 22,
    'user_id' : 2,
    'date_created': "11-09-2023 03:50:09",
    'date_updated': "10-10-2023 16:01:59",
}
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