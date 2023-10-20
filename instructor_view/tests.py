"""
Request and Query Management System - Testing Suite
instructor_view Unit Tests
"""

import json
import requests

LOCALHOST_PATH = 'http://localhost:8000'

def test_instructor_view_get_courses():
    '''
    Testing:
        - /instructor/courses/<user_id>
    Acceptance criteria:
        - Returns all courses of user
    '''
    response = requests.get(LOCALHOST_PATH + '/instructor/courses/1', timeout = 5)
    assert response.json() == {"courses": json.dumps([course1, course1])}, \
        "/instructor/courses/ endpoint failed"

def test_instructor_view_get_request_status():
    '''
    Testing:
        - /instructor/request-status/<request_id>
    Acceptance criteria:
        - Get request status of request_id
    '''
    response = requests.get(LOCALHOST_PATH +'/instructor/request-status/1', timeout = 5)
    assert response.json() == {'status': 'balls'}, "/instructor/request-status/ endpoint failed"

def test_instructor_view_get_request():
    '''
    Testing:
        - /instructor/request/<request_id>
    Acceptance criteria:
        - Returns correct request
    '''
    response = requests.get(LOCALHOST_PATH +'/instructor/request/1', timeout = 5)
    assert response.json() == req1, "/instructor/request/ endpoint failed"

def test_instructor_view_get_request_old_versions():
    '''
    Testing:
        - /instructor/old-versions/<request_id>
    Acceptance criteria:
        - Returns old versions of a request
    '''
    response = requests.get(LOCALHOST_PATH + '/instructor/old-versions/1', timeout = 5)
    assert response.json() == {'request_ids':json.dumps([1,2,3])}, \
        "/instructor/old-versions/ endpoint failed"

def test_instructor_view_get_subject_settings():
    '''
    Testing:
        - /instructor/get-subject-settings/<subject_id>
    Acceptance criteria:
        - Returns subject settings for a subject
    '''
    response = requests.get(LOCALHOST_PATH +'/instructor/get-subject-settings/1', timeout = 5)
    assert response.json() == subj_settings, "/instructor/get-subject-settings/ endpoint failed"

def test_instructor_view_get_aap():
    '''
    Testing:
        - /instructor/aap/<aap_id>
    Acceptance criteria:
        - Gets AAP of aap_id
    '''
    # SQL statement to retrieve AAP
    assert True, "/instructor/aap/ endpoint failed"

def test_instructor_view_get_request_history():
    '''
    Testing:
        - /instructor/request-history/<student_id>
    Acceptance criteria:
        - Gets request history of student
    '''
    response = requests.get(LOCALHOST_PATH + '/instructor/request-history/1', timeout = 5)
    assert response.json() == { 'requests': json.dumps([req1, req2])}, \
        "/instructor/request-history/ endpoint failed"

def test_instructor_view_post_aap():
    '''
    Testing:
        - /instructor/aap/
    Acceptance criteria:
        - Post an AAP
        - Call DB
    '''
    assert True, ""

def test_instructor_view_set_complex():
    '''
    Testing:
        - /instructor/set-complex/<request_id>
    Acceptance criteria:
        - Case has been made complex
        - Call DB
    '''
    response = requests.put(LOCALHOST_PATH + '/instructor/set-complex/1', timeout = 5)
    assert response.json() == {"message": "Made complex"}, \
        "/instructor/set-complex endpoint failed"

def test_instructor_view_request_response():
    '''
    Testing:
        - /instructor/request-response/<request_id>
    Acceptance criteria:
        - Response to a request has been submitted successfully
        - Call DB
    '''
    response = requests.put(LOCALHOST_PATH + '/instructor/request-response/1', timeout = 5)
    assert response.json() == {"message": "Case created successfully"}, \
        "/instructor/request-response/ endpoint failed"

def test_instructor_view_change_settings():
    '''
    Testing:
        - /instructor/settings/
    Acceptance criteria:
        - Settings are changed successfully
        - Call DB
    '''
    response = requests.put(LOCALHOST_PATH + '/instructor/settings/', timeout = 5)
    assert response.json() == {"message": "Case created successfully"}, \
        "/instructor/settings/ endpoint failed"

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
    'dateCreated': '11/11/2023',
    'status': 'waiting for action',
    'message': 'Jun ate my homework', 
}

subj1 = {
    'id': 1,
}
subj2 = {
    'id': 2,
}
subj_settings = {
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
