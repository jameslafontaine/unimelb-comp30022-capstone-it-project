"""
Tests for use until backend connected
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
usr2 = {
    'user_id': 2,
    'name': 'James La Fontaine',
    'first_name': 'James',
    'last_name': 'La Fontaine',
    'email': 'bingbong@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}
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
    'request_type':'dumb', 
    'complex_case':1,
    'current_status':'pending',
    'assignment_id': 1,
}
thread12 = {
    'thread_id': 12,
    'case_id': 12,
    'course_id': 32,
    'date_updated': "01-19-2023",
    'request_type':'dumb',
    'complex_case':0,
    'current_status':'pending',
    'assignment_id':2,
}
thread13 = {
    'thread_id': 13,
    'case_id': 12,
    'course_id': 41,
    'date_updated': "01-19-2023",
    'request_type':'dumb',
    'complex_case':1,
    'current_status':'pending',
    'assignment_id':3,
}

req311 = {
    'request_id': 311,
    'thread_id': 11,
    'date_created': "11-09-2023",
    'request_content': 'The dog ate my homework. L',
    'instructor_notes': 'This was a bad excuse lol',
}
req312 = {
    'request_id': 312,
    'thread_id': 11,
    'date_created': "17-12-2023",
    'request_content': 'The cat ate my homework. L',
    'instructor_notes': ';lksadf;lksdaf;lksdfa;lkdsfa;lkdsfa;lksdaf',
}
req321 = {
    'request_id': 321,
    'thread_id': 12,
    'date_created': "01-19-2023",
    'request_content': 'Im very sick *sad face*',
    'instructor_notes': 'bingbongbingbong',
}
req322 = {
    'request_id': 322,
    'thread_id': 13,
    'date_created': "01-19-2023",
    'request_content': 'Please just give me an extension, im begging',
    'instructor_notes': 'AHHHHHHHHHHHHH',
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

assign1 = {
    'assignment_id': 1,
    'course_id': 31,
    'assignment_name': 'Progress Assessment 3',
    'assignment_type': 'not sure what this should be?',
    'assignment_weightage': 30,
    'start_date': "01-01-2023",
    'due_date': "02-01-2023",
}
assign2 = {
    'assignment_id': 2,
    'course_id': 32,
    'assignment_name': 'Assignment 3',
    'assignment_type': 'not sure what this should be?',
    'assignment_weightage': 25,
    'start_date': "05-12-2023",
    'due_date': "12-12-2023",
}
assign3 = {
    'assignment_id': 3,
    'course_id': 41,
    'assignment_name': 'Milestone 3',
    'assignment_type': 'not sure what this should be?',
    'assignment_weightage': 12,
    'start_date': "15-06-2023",
    'due_date': "07-08-2023", 
}
assign4 = {
    'assignment_id': 4,
    'course_id': 42,
    'assignment_name': 'Assignment 2',
    'assignment_type': 'not sure what this should be?',
    'assignment_weightage': 110,
    'start_date': "02-02-2023",
    'due_date': "03-03-2023",
}
assign5 = {
    'assignment_id': 5,
    'course_id': 42,
    'assignment_name': 'Worksheet 4',
    'assignment_type': 'not sure what this should be?',
    'assignment_weightage': 6,
    'start_date': "54-43-2023",
    'due_date': "56-56-2023",
}