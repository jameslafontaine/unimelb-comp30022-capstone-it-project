"""
Request and Query Management System - Testing suite
student_view Unit Tests
"""

import json
import time
import requests

LOCALHOST_PATH = 'http://localhost:8000'

def test_student_view_get_cases():
    '''
    Testing:
        - /student/case/<case_id>
    Acceptance criteria:
        - Returns case information
    '''
    response = requests.get(LOCALHOST_PATH + '/student/case/12', timeout = 5)
    assert response.json() == student_case_1_2, "/student/case/ endpoint failed"

def test_student_view_get_active_cases():
    '''
    Testing:
        - /student/active-cases/<user_id>
    Acceptance criteria:
        - Returns a user's active cases
    '''
    requests.put(LOCALHOST_PATH + '/student/set-user-id/1', timeout = 5)
    time.sleep(1)
    response = requests.get(LOCALHOST_PATH + '/student/active-cases/1', timeout = 5)
    assert response.json() == \
            {
                'cases': 
                    {
                        'case12': student_case_1_2,
                    }
            }, "/student/active-cases/ endpoint failed"

def test_student_view_get_requests_from_case():
    '''
    Testing:
        - /student/requests-from-case/<case_id>
    Acceptance criteria:
        - Returns all requests in a case
    '''
    response = requests.get(LOCALHOST_PATH + '/student/requests-from-case/1', timeout = 5)
    assert response.json() == \
    {
        'requestIds': json.dumps([1,2])
    }, "/student/requests-from-case/ endpoint failed"

def test_student_view_get_requests():
    '''
    Testing:
        - /student/request/<request_id>
    Acceptance criteria:
        - Returns a request's details
    '''
    response = requests.get(LOCALHOST_PATH + '/student/request/1', timeout = 5)
    assert response.json() == student_request_1, "/student/request/ endpoint failed"

def test_student_view_post_new_request():
    '''
    Testing:
        - /student/new-request/
    Acceptance criteria:
        - A request is confirmed created
    '''
    # POST a new request
    # requests.post('http://localhost:8000/student/new-request/', timeout = 5)
    # Confirm creation by
    ## Calling the database OR
    ## /student/request/<new_request_id> returns this id
    assert True, ""

# fake data to play with before DB connected
student_user_1 = {
    'user_id': 1,
    'first_name': 'Jun',
    'last_name': 'Youn',
    'email': 'blahblah@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}
student_user_2 = {
    'user_id': 2,
    'first_name': 'James',
    'last_name': 'La Fontaine',
    'email': 'bingbong@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}

# fake user 1's cases
student_case_1_2 = {
    'case_id' : 12,
    'user_id' : 1,
    'date_created': "11-09-2023 03:50:09",
    'date_updated': "10-10-2023 16:01:59",
}

student_request_1 = {
    'id': 1,
    'course': 'COMP30022',
    'dateCreated': '22/11/2000',
    'status': 'waiting for action',
    'message': 'Callum ate my homework',
}

student_request_2 = {
    'id': 2,
    'course': 'COMP30026',
    'dateCreated': '1/1/2023',
    'status': 'waiting for action',
    'message': 'The cat ate my homework', 
}
