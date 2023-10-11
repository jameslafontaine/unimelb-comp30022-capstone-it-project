"""
Tests for student view
"""

# from django.test import TestCase

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
