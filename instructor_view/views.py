"""
Django views for instructor_view project.

Generated by 'django-admin startApp instructor_view' using Django 4.2.4.
"""

from django.shortcuts import render
import json
from django.http import JsonResponse

def not_found_view(request):
    return render(request, 'notFound404.html', {})

def home_view(request):
    return render(request, 'iHome.html', {})

def review_req_view(request, id):
    # check the id exists

    if(id == req1['id']):
        req = json.dumps(req1)
        return render(request, 'reviewRequest.html', {'req':req})
    elif(id == req2['id']):
        req = json.dumps(req2)
        return render(request, 'reviewRequest.html', {'req':req})
    else:
        return JsonResponse({'error': 'Record not found'}, status=404)

def view_reqs_view(request):
    return render(request, 'viewRequests.html', {})

def subj_settings_view(request, id):
    # check the id exists

    if(id == subj1['id']):
        req = json.dumps(subj1)
        return render(request, 'subjectSettings.html', {'req':req})
    elif(id == subj2['id']):
        req = json.dumps(subj2)
        return render(request, 'subjectSettings.html', {'req':req})
    else:
        return JsonResponse({'error': 'Record not found'}, status=404)

def view_profile_view(request, id):
    # check the id exists
    if(id == usr1['id']): 
        usr = json.dumps(usr1)
        return render(request, 'viewProfile.html', {'usr':usr})
    elif(id == usr2['id']):
        usr = json.dumps(usr2)
        return render(request, 'viewProfile.html', {'usr':usr})
    
    return JsonResponse({'error': 'Record not found'}, status=404)


# GET REQUESTS
# test/example purposes only, obviously not useable, must be filled in by backend
'''
def get_(request, _id):
    if(_id == 1):
        return JsonResponse()
    else: # id not found
        return not_found_view(request)
'''
def get_courses(request, user_id):
    if(user_id == 1):
        return JsonResponse({
            'courses': json.dumps([course1, course1])
        })
    else: # id not found
        return not_found_view(request)

def get_request_status(request, request_id):
    if(request_id == 1):
        return JsonResponse({'status': 'balls'})
    else: # id not found
        return not_found_view(request)

def get_request(request, request_id):
    if(request_id == 1):
        return JsonResponse(req1)
    else: # id not found
        return not_found_view(request)

def get_old_versions(request, request_id):
    if(request_id == 1):
        return JsonResponse({'request_ids':json.dumps([1,2,3])})
    else: # id not found
        return not_found_view(request)

def get_student(request, student_id):
    if(student_id == 1):
        return JsonResponse(usr1)
    else: # id not found
        return not_found_view(request)

def get_subject_settings(request, subject_id):
    if(subject_id == 1):
        return JsonResponse(subjSettings)
    else: # id not found
        return not_found_view(request)

def get_AAP(request, aap_id):
    if(aap_id == 1):
        return JsonResponse({'this is an aap': 'aap go beep boop'})
    else: # id not found
        return not_found_view(request)

def get_request_history(request, student_id):
    if(student_id == 1):
        return JsonResponse({
            'requests':json.dumps([req1, req2])
        })
    else: # id not found
        return not_found_view(request)
    
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

usr1 = {
    'id': 1,
    'firstName': 'John',
    'lastName': 'Smith',
    'email': 'jsmith@student.unimelb.edu.au',
}
usr2 = {
    'id': 2,
    'firstName': 'Jane',
    'lastName': 'Doe',
    'email': 'jdoe@student.unimelb.edu.au',
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
subjSettings = {
    'this is so boring': 'beep boop',
}
course1 = {
    'course_id': 1,
    'subject_name': 'sugma',
}