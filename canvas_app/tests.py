"""
Tests for use until backend connected
"""

case11 = {
    'case_id' : 11,
    'user_id' : 1,
}
case12 = {
    'case_id' : 12,
    'user_id' : 1,
}
case21 = {
    'case_id' : 21,
    'user_id' : 2,
}
case22 = {
    'case_id' : 22,
    'user_id' : 2,
}

thread11 = {
    'thread_id': 11,
    'case_id': 11,
    'course_id': 31,
    'date_updated': "11-09-2023",
    'request_type':'Extension', 
    'complex_case':1,
    'current_status':'PENDING',
    'assignment_id': 1,
}
thread12 = {
    'thread_id': 12,
    'case_id': 12,
    'course_id': 31,
    'date_updated': "01-19-2023",
    'request_type':'Query',
    'complex_case':0,
    'current_status':'PENDING',
    'assignment_id':2,
}
thread13 = {
    'thread_id': 13,
    'case_id': 12,
    'course_id': 41,
    'date_updated': "01-19-2023",
    'request_type':'Other',
    'complex_case':1,
    'current_status':'REJECTED',
    'assignment_id':3,
}

course31 = {
    'course_id': '31',
    'course_name': 'IT Project',
    'course_code': 'COMP30022',
}
course32 = {
    'course_id': '32',
    'course_name': 'Computer Systems',
    'course_code': 'COMP30023',
}
course41 = {
    'course_id': '41',
    'course_name': 'Graphics and Interaction',
    'course_code': 'COMP30019',
}
course42 = {
    'course_id': '42',
    'course_name': 'Models of Computation',
    'course_code': 'COMP30026',
}
