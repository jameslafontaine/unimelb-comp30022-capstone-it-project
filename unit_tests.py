"""
Request and Query Management System - Testing Suite
Unit Tests
"""

import json
import time
import requests
from django.http import JsonResponse
from instructor_view.tests import course1
from student_view.tests import student_case_1_2

'''

Student View tests

'''

def test_student_view_get_cases():
    '''
    Testing:
        - /student/case/<case_id>
    Acceptance criteria:
        - Returns case information
    '''
    response = requests.get('http://localhost:8000/student/case/12', timeout = 5)
    assert response == JsonResponse(student_case_1_2), "/student/case/ endpoint failed"

def test_student_view_get_active_cases():
    '''
    Testing:
        - /student/active-cases/<user_id>
    Acceptance criteria:
        - Returns a user's active cases
    '''
    requests.put('http://localhost:8000/student/set-user-id/1', timeout = 5)
    time.sleep(1)
    assert requests.get('http://localhost:8000/student/active-cases/1') == JsonResponse(
            {
                'cases': {
                    'case12': student_case_1_2,
            }
        }), "/student/active-cases/ endpoint failed"

def test_student_view_get_requests_from_case():
    '''
    Testing:
        - /student/requests-from-case/<case_id>
    Acceptance criteria:
        - Returns all requests in a case
    '''
    assert True, ""

def test_student_view_get_requests():
    '''
    Testing:
        - /student/request/<request_id>
    Acceptance criteria:
        - Returns all requests in a case
    '''
    assert True, ""

def test_student_view_get_old_versions_of_request():
    '''
    Testing:
        - /student/old-versions/<request_id>
    Acceptance criteria:
        - Returns all old versions of a request
    '''
    assert True, ""

def test_student_view_post_new_request():
    '''
    Testing:
        - /student/new-request/
    Acceptance criteria:
        - A request is confirmed created
    '''
    assert True, ""

'''

Instructor View tests

'''

def test_instructor_view_get_courses():
    '''
    GET courses
    Testing:
        - /instructor/courses/<id>
    Acceptance criteria:
        - Matches expected output
    '''
    response = requests.get('http://localhost:8000/instructor/courses/1', timeout = 5)
    assert response.status_code == 200, "/instructor/courses/<id> doesn't work"
    assert response == JsonResponse({"courses": json.dump([course1, course1])})

def test_instructor_view_put_user_id():
    '''
    PUT user id and get it
    Testing:
        - /instructor/set-user-id/<id> endpoint
        - This set properly by calling /instructor/get-user-id/
    Acceptance criteria:
        - Matches expected output
    '''
    requests.put('http://localhost:8000/instructor/set-user-id/3', timeout = 5)
    time.sleep(1)
    assert requests.get('http://localhost:8000/instructor/get-user-id/', timeout = 5) \
        == JsonResponse({'id': 3}), "Didn't work"
