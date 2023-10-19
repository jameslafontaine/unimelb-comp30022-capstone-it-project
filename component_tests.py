"""
Request and Query Management System - Testing Suite
Component tests
"""

import requests

def test_instructor_view_nonvariable_endpoints():
    '''
    In Instructor View, testing for:
        - All endpoints without variables in them
          <int: var>
        - Any endpoint not depending on header data
    Acceptance criteria:
        - Returns 200
    '''
    instructor_view_nonvariable_endpoints = ['']
    for endpoint in instructor_view_nonvariable_endpoints:
        response = requests.get('http://localhost:8000/instructor/' + endpoint, timeout = 5)
        assert response.status_code == 200, \
            "/instructor/" + endpoint + " has error"

def test_student_view_nonvariable_endpoints():
    '''
    In Student View, testing for:
        - All endpoints without variables in them
          <int: var>
        - Any endpoint not depending on header data
    Acceptance criteria:
        - Returns 200
    '''
    student_view_nonvariable_endpoints = ['']
    for endpoint in student_view_nonvariable_endpoints:
        response = requests.get('http://localhost:8000/student/' + endpoint, timeout = 5)
        assert response.status_code == 200, \
            "/student/" + endpoint + " has error"
