"""
Request and Query Management System - Testing Suite
Component tests
"""

import requests

def test_login_endpoint():
    '''
    Login endpoint is working
    Acceptance criteria:
        - Returns 200
    '''
    response = requests.get('http://localhost:8000/', timeout = 5)
    assert response.status_code == 200, "login page returns 404"

def test_login_as_instructor():
    '''
    Test login as instructor
    Acceptance criteria:
        - Generate OAuth Authorization token
        - Instructor view returns 200
    '''
    # Generate OAuth token and try instructor home page
    assert True, "OAuth has not been implemented yet"


def test_instructor_view_nonvariable_endpoints():
    '''
    In Instructor View, testing for:
        - All endpoints without variables in them
          <int: var>
        - Any endpoint not depending on header data
    Acceptance criteria:
        - Returns 200
    '''
    # Implement OAuth when Canvas is integrated
    instructor_view_nonvariable_endpoints = ['']
    for endpoint in instructor_view_nonvariable_endpoints:
        response = requests.get('http://localhost:8000/instructor/' + endpoint, timeout = 5)
        assert response.status_code == 200, \
            "/instructor/" + endpoint + " has error"

def test_login_as_student():
    '''
    Test login as student
    Acceptance criteria:
        - Generate OAuth Authorization token
        - Student view returns 200
    '''
    # Generate OAuth token and try student home page
    assert True, "OAuth has not been implemented yet"

def test_student_view_nonvariable_endpoints():
    '''
    In Student View, testing for:
        - All endpoints without variables in them
          <int: var>
        - Any endpoint not depending on header data
    Acceptance criteria:
        - Returns 200
    '''
    # Implement OAuth when Canvas is integrated
    student_view_nonvariable_endpoints = ['']
    for endpoint in student_view_nonvariable_endpoints:
        response = requests.get('http://localhost:8000/student/' + endpoint, timeout = 5)
        assert response.status_code == 200, \
            "/student/" + endpoint + " has error"
