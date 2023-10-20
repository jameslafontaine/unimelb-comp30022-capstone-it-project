"""
Request and Query Management System - Testing Suite
instructor_view Unit Tests
"""

import requests

def test_instructor_view_get_courses():
    '''
    Testing:
        - /instructor/courses/<user_id>
    Acceptance criteria:
        - Returns all courses of user
    '''
    response = requests.get('http://localhost:8000/instructor/courses/1', timeout = 5)
    assert response.json() == {"courses": [course1, course1]}

def test_instructor_view_get_request_status():
    '''
    Testing:
        - /instructor/request-status/<request_id>
    Acceptance criteria:
        -
    '''
    assert True, ""

def test_instructor_view_get_request():
    '''
    Testing:
        - /instructor/request/<request_id>
    Acceptance criteria:
        -
    '''
    assert True, ""

def test_instructor_view_get_request_old_versions():
    '''
    Testing:
        - /instructor/old-versions/<request_id>
    Acceptance criteria:
        -
    '''
    assert True, ""

def test_instructor_view_get_subject_settings():
    '''
    Testing:
        - /instructor/get-subject-settings/<subject_id>
    Acceptance criteria:
        -
    '''
    assert True, ""

def test_instructor_view_get_aap():
    '''
    Testing:
        - /instructor/aap/<aap_id>
    Acceptance criteria:
        -
    '''
    assert True, ""

def test_instructor_view_get_request_history():
    '''
    Testing:
        - /instructor/request-history/<student_id>
    Acceptance criteria:
        -
    '''
    assert True, ""

def test_instructor_view_post_aap():
    '''
    Testing:
        - /instructor/aap/
    Acceptance criteria:
        -
    '''
    assert True, ""

def test_instructor_view_set_complex():
    '''
    Testing:
        - /instructor/set-complex/<request_id>
    Acceptance criteria:
        -
    '''
    assert True, ""

def test_instructor_view_request_response():
    '''
    Testing:
        - /instructor/request-response/<request_id>
    Acceptance criteria:
        -
    '''
    assert True, ""

def test_instructor_view_change_settings():
    '''
    Testing:
        - /instructor/settings/
    Acceptance criteria:
        -
    '''
    assert True, ""

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
