"""
Request and Query Management System - Testing Suite
instructor_view Unit Tests
"""

import requests
from instructor_view.tests import course1

#
# Instructor View tests
#

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
    assert response.json() == {"courses": [course1, course1]}

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
