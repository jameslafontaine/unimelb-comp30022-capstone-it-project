"""
Tests for student view
"""
# from django.test import TestCase

usr1 = {
    'user_id': 1,
    'name': 'Jun Youn',
    'first_name': 'Jun',
    'last_name': 'Youn',
    'email': 'blahblah@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}
# user 1's cases
case11 = {
    'case_id' : 11,
    'user_id' : 1,
}
# case11's threads
thread11 = {
    'thread_id': 11,
    'case_id': 11,
    'course_id': 6457898764532,
    'date_updated': "11-09-2023",
    'request_type':'dumb', 
    'complex_case':1,
    'current_status':'pending',
    'assignment_id':4768596707876,
}

# thread11's requests
req311 = {
    'request_id': 311,
    'thread_id': 456,
    'date_created': "11-09-2023",
    'request_content': 'The dog ate my homework. L',
    'instructor_notes': 'This was a bad excuse lol',
}
req312 = {
    'request_id': 312,
    'thread_id': 457,
    'date_created': "17-12-2023",
    'request_content': 'The cat ate my homework. L',
    'instructor_notes': ';lksadf;lksdaf;lksdfa;lkdsfa;lkdsfa;lksdaf',
}

case12 = {
    'case_id' : 12,
    'user_id' : 1,
}
# case12's threads
thread12 = {
    'thread_id': 12,
    'case_id': 12,
    'course_id': 6457898764532,
    'date_updated': "01-19-2023",
    'request_type':'dumb',
    'complex_case':0,
    'current_status':'pending',
    'assignment_id':4768596707876,
}
thread13 = {
    'thread_id': 13,
    'case_id': 12,
    'course_id': 6457898764532,
    'date_updated': "01-19-2023",
    'request_type':'dumb',
    'complex_case':1,
    'current_status':'pending',
    'assignment_id':4768596707876,
}
# thread12's requests
req321 = {
    'request_id': 321,
    'thread_id': 458,
    'date_created': "01-19-2023",
    'request_content': 'Im very sick *sad face*',
    'instructor_notes': 'bingbongbingbong',
}
# thread13's requests
req322 = {
    'request_id': 322,
    'thread_id': 459,
    'date_created': "01-19-2023",
    'request_content': 'Please just give me an extension, im begging',
    'instructor_notes': 'AHHHHHHHHHHHHH',
}



usr2 = {
    'user_id': 2,
    'name': 'James La Fontaine',
    'first_name': 'James',
    'last_name': 'La Fontaine',
    'email': 'bingbong@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}
# user 2's cases
case21 = {
    'case_id' : 21,
    'user_id' : 2,
}
case22 = {
    'case_id' : 22,
    'user_id' : 2,
}