"""
All endpoints in data_endpoints
"""

# from django.shortcuts import render
import json
from django.http import HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt

def validate_headers(request):
    '''
    Deactivate temporarily for ease of development

    Check if request has the necessary headers
        1. "Authorization": "Bearer <access_token>"
    '''
    authorization = request.META.get('Authorization')
    if authorization is None:
        # return HttpResponse('Unauthorized', status = 401)
        pass

def check_param_not_integer(value):
    return not value.isdigit()

def get_assessments_endpoint(request):
    '''
    GET /api/data/assessments/
    Valid parameter combinations:
        - ?assignid, get a specific assignment
        - ?courseid, get all assessments from courseid
        - ?courseid&?names, get only names of assessments from courseid
    '''
    validate_headers(request)

    if request.GET.get('assignid') and len(request.GET) == 1:
        if check_param_not_integer(request.GET.get('assignid')):
            return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
        else:
            # SELECT * FROM 'Assignment' WHERE 'Assignment'.assignment_id == request.GET.get('assignid')
            # Example result 
            result = {
                "assignment_id": 1,
                "course_id": 1,
                "assignment_name": "Project 1",
                "assignment_type": "submission",
                "assignment_weightage": 15,
                "start_date": "2000:01:01 00:00:00",
                "end_date": "2000:01:01 00:00:00"
            }
            # set result variable as whatever SQL statement returns
            return JsonResponse(result)
    
    if not request.GET.get('assignid') and request.GET.get('courseid'):
        if check_param_not_integer(request.GET.get('courseid')):
            return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
        else:
            # SELECT * FROM 'Assignment' WHERE 'Assignment'.course_id == int(request.GET.get('courseid'))
            # Example result
            result = {
                "assessments": [
                    {
                        "assignment_id": 1,
                        "course_id": 2001,
                        "assignment_name": "Project 1",
                        "assignment_type": "submission",
                        "assignment_weightage": 15,
                        "start_date": "2000:01:01 00:00:00",
                        "end_date": "2000:01:01 00:00:00"
                    },
                    {
                        "assignment_id": 2,
                        "course_id": 2001,
                        "assignment_name": "Project 2",
                        "assignment_type": "submission",
                        "assignment_weightage": 15,
                        "start_date": "2000:01:01 00:00:00",
                        "end_date": "2000:01:01 00:00:00"
                    },
                    {
                        "assignment_id": 3,
                        "course_id": 2001,
                        "assignment_name": "Mid Semester Test",
                        "assignment_type": "submission",
                        "assignment_weightage": 20,
                        "start_date": "2000:01:01 00:00:00",
                        "end_date": "2000:01:01 00:00:00"
                    }
                ]
            } 
            if not request.GET.get('names') and len(request.GET) == 1:
                return JsonResponse(result)
            elif len(request.GET) == 2 and request.GET.get('names') and request.GET.get('names').lower() == 'true':
                namesonly = {
                    "assessments": []
                }
                for assessment in result["assessments"]:
                    namesonly["assessments"].append(assessment["assignment_name"])
                return JsonResponse(namesonly)
    
    return HttpResponseBadRequest('Invalid request, check input again.')

def get_cases_endpoint(request):
    '''
    GET /api/data/cases/
    Valid parameter combinations:
        - ?userid, get all cases created by user
        - ?caseid, get case details
        - ?caseid&?threads, get all threads belonging to case
    '''
    validate_headers(request)
    
    if request.GET.get('userid') and len(request.GET) == 1:
        if check_param_not_integer(request.GET.get('userid')):
            return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
        else: 
            # SELECT * FROM 'Case' WHERE 'Case'.user_id == int(request.GET.get('userid'))
            result = {
                "cases": [
                    {
                        "case_id": 1,
                        "user_id": 1
                    },
                    {
                        "case_id": 2,
                        "user_id": 1
                    }
                ]
            }
            return JsonResponse(result)

    if not request.GET.get('userid') and request.GET.get('caseid'):
        if check_param_not_integer(request.GET.get('caseid')):
            return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
        else:
            if len(request.GET) == 1:
                # SELECT * FROM 'Case' WHERE 'Case'.case_id == int(request.GET.get('caseid'))
                result = {
                    "case": {
                        "case_id": 1,
                        "user_id": 1
                    }
                }
                return JsonResponse(result)
            if len(request.GET) == 2 and request.GET.get('threads').lower() == 'true':
                # SELECT * FROM 'Thread' WHERE 'Thread'.case_id == int(request.GET.get('threads'))
                result = {
                    "threads": [
                        {
                            "thread_id": 2,
                            "case_id": 1,
                            "course_id": 2,
                            "date_updated": "2000:01:01 00:00:00",
                            "request_type": "extension",
                            "complex_case": 0,
                            "current_status": "REJECTED",
                            "assignment_id": 3
                        },
                        {
                            "thread_id": 1,
                            "case_id": 1,
                            "course_id": 1,
                            "date_updated": "2000:01:01 00:00:00",
                            "request_type": "quizcode",
                            "complex_case": 0,
                            "current_status": "REJECTED",
                            "assignment_id": 1
                        }
                    ]
                }
                return JsonResponse(result)

    return HttpResponseBadRequest('Invalid request, check input again.')

def get_courses_endpoint(request):
    '''
    GET /api/data/courses/
    Valid parameter combinations:
        - ?userid
        - ?courseid
        - ?courseid&preferences
    '''
    validate_headers(request)

    if len(request.GET) not in [1, 2]:
        return HttpResponseBadRequest('Invalid number of parameters.')

    if len(request.GET) == 1 and request.GET.get('userid'):
        if check_param_not_integer(request.GET.get('userid')):
            return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
        else:
            # Do some fancy join magic here i forgot probably involves enrollmenttable as well
            result = {
                "courses": [
                    {
                        "course_id": 1,
                        "course_name": "IT Project",
                        "course_code": "COMP30022"
                    },
                    {
                        "course_id": 2,
                        "course_name": "Modern Applied Statistics",
                        "course_code": "MAST30025"
                    }
                ]
            }
            return JsonResponse(result)

    if not request.GET.get('userid') and request.GET.get('courseid'):
        if check_param_not_integer(request.GET.get('courseid')):
            return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
        else:
            if len(request.GET) == 1:
                # SELECT * FROM COURSE WHERE 'Course'.course_Id == int(request.GET.get('courseid'))
                result  = {
                        "course": {
                            "course_id": 1,
                            "course_name": "IT Project",
                            "course_code": "COMP30022"
                        }
                }
                return JsonResponse(result)
            if len(request.GET) == 2 and request.GET.get('preferences') and request.GET.get('preferences').lower() == 'true':
                # SELECT * FROM CoursePreferences WHERE 'CoursePreferences'.course_id == int(request.GET.get('courseid'))
                result = {
                    "coursepreferences": {
                        "coursepreference_id": 1,
                        "course_id": 1,
                        "global_extension_length": 3,
                        "general_tutor": 0,
                        "extension_tutor": 1,
                        "quiz_tutor": 1,
                        "remark_tutor": 1,
                        "other_tutor": 0,
                        "general_scoord": 1,
                        "extension_scoord": 1,
                        "quiz_scoord": 1,
                        "remark_scoord": 0,
                        "other_scoord": 0,
                        "general_reject": "",
                        "extension_approve": "",
                        "extension_reject": "",
                        "quiz_approve": "",
                        "quiz_reject": "lmao",
                        "remark_approve": "",
                        "remark_reject": ""
                    }
                }
                return JsonResponse(result)
    
    return HttpResponseBadRequest('Invalid request, check input again.')

def get_requests_endpoint(request):
    '''
    GET /api/data/requests/
    Valid parameter combinations:
        - ?userid
        - ?requestid
    '''
    validate_headers(request)

    if len(request.GET) == 1:
        if not request.GET.get('userid') and not request.GET.get('requestid'):
            return HttpResponseBadRequest('Invalid request, check input again.')

        if request.GET.get('userid'):
            if check_param_not_integer(request.GET.get('userid')):
                return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
            else:
                # Return request history of a user. 
                # Consult Callum on this, unsure if we actually need more data on this
                result = {
                    "requests": [
                        {
                            "request_id": 2,
                            "thread_id": 2,
                            "date_created": "2000:01:01 00:00:00",
                            "request_content": "the dog ate my homework.",
                            "instructor_notes": "oh no"
                        },
                        {
                            "request_id": 1,
                            "thread_id": 1,
                            "date_created": "2000:01:01 00:00:00",
                            "request_content": "i am crying for help.",
                            "instructor_notes": "stop crying"
                        }
                    ]
                } 
                return JsonResponse(result)

        if request.GET.get('requestid'):
            if check_param_not_integer(request.GET.get('requestid')):
                return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
            else:
                # SELECT * FROM 'Requets' WHERE 'Request'.request_id == int(request.GET.get('requestid'))
                result = {
                    "request": {
                        "request_id": 1,
                        "thread_id": 1,
                        "date_created": "2000:01:01 00:00:00",
                        "request_content": "i am crying for help.",
                        "instructor_notes": "stop crying"
                    }
                }
                return JsonResponse(result)

    return HttpResponseBadRequest('Invalid request, check input again.')

def get_threads_user_endpoint(request):
    '''
    GET /api/data/thread/
    Valid parameter combinations:
        - ?threadid
        - ?userid&status
    '''
    validate_headers(request)

    if len(request.GET) not in [1, 2]:
        return HttpResponseBadRequest('Invalid request, check input again.')

    if len(request.GET) == 1 and request.GET.get('threadid'):
        if check_param_not_integer(request.GET.get('threadid')):
            return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
        else:
            # Return the user database table of the user who created thread_id
            result = {
                'user_id': 2,
                'name': 'James La Fontaine',
                'first_name': 'James',
                'last_name': 'La Fontaine',
                'email': 'bingbong@student.unimelb.edu.au',
                'email_preference': 1,
                'darkmode_preference': 1,
            }
            return JsonResponse({"student": result})
    
    if len(request.GET) in [1, 2] and request.GET.get('userid') and request.GET.get('status'):
        if check_param_not_integer(request.GET.get('userid')):
            return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
        if not request.GET.get('status').lower() in ["approved", "pending", "rejected"]:
            return HttpResponseBadRequest("Invalid request, status isn't set correctly.")
        else:
            # Some join of 'Thread' and 'Case' on case_id
            # result["thread"]["current_status"] == request.GET.get('checkstatus')
            result = {
                "threads": [
                    {
                        "thread_id": 2,
                        "case_id": 1,
                        "course_id": 2,
                        "date_updated": "2000:01:01 00:00:00",
                        "request_type": "extension",
                        "complex_case": 0,
                        "current_status": "REJECTED",
                        "assignment_id": 3
                    },
                    {
                        "thread_id": 1,
                        "case_id": 1,
                        "course_id": 1,
                        "date_updated": "2000:01:01 00:00:00",
                        "request_type": "quizcode",
                        "complex_case": 0,
                        "current_status": "REJECTED",
                        "assignment_id": 1
                    }
                ]
            }
            return JsonResponse(result)
     
    return HttpResponseBadRequest('Invalid request, check input again.')

def get_threads_endpoint(request, thread_id):
    '''
    GET /api/data/thread/{thread_id}/
    Valid parameter combinations:
        - No parameters
        - ?checkstatus
    '''
    validate_headers(request)
    print(thread_id) # DELETE THIS COMMENT LATER !!!
    
    if len(request.GET) not in range(0, 3):
        return HttpResponseBadRequest('Invalid request, check input again.')
    
    if len(request.GET) in [0, 1] and not request.GET or request.GET.get('checkstatus'):
        if request.GET.get('checkstatus') and not request.GET.get('checkstatus').lower() == 'true':
            return HttpResponseBadRequest("Invalid request, parameter must be an integer.")
        else:
            # Compare it to the function input thread_id
            # SELECT * FROM 'Thread' WHERE 'Thread'.thread_id == thread_id
            # SELECT * FROM 'Request' WHERE 'Request'.thread_id == thread_id
            # SELECT * FROM 'CoursePreference' WHERE (some JOIN magic)
            result = {
                "threadinfo": {
                    "thread": {
                        "thread_id": 1,
                        "case_id": 1,
                        "course_id": 1,
                        "date_updated": "2000:01:01 00:00:00",
                        "request_type": "quizcode",
                        "complex_case": 0,
                        "current_status": "REJECTED",
                        "assignment_id": 1
                    },
                    "requests": [
                        {
                            "request_id": 2,
                            "thread_id": 1,
                            "date_created": "2000:01:01 00:00:00",
                            "request_content": "please do not reject this please please",
                            "instructor_notes": "this is peak clownery"
                        },
                        {
                            "request_id": 1,
                            "thread_id": 1,
                            "date_created": "2000:01:01 00:00:00",
                            "request_content": "i am sick, dont have med certificate"
                        }
                    ],
                    "coursepreferences": {
                        "coursepreference_id": 1,
                        "course_id": 1,
                        "global_extension_length": 3,
                        "general_tutor": 0,
                        "extension_tutor": 1,
                        "quiz_tutor": 1,
                        "remark_tutor": 1,
                        "other_tutor": 0,
                        "general_scoord": 1,
                        "extension_scoord": 1,
                        "quiz_scoord": 1,
                        "remark_scoord": 0,
                        "other_scoord": 0,
                        "general_reject": "",
                        "extension_approve": "",
                        "extension_reject": "",
                        "quiz_approve": "",
                        "quiz_reject": "lmao",
                        "remark_approve": "",
                        "remark_reject": ""
                    }
                }
            }
            if not request.GET:
                return JsonResponse(result)
            else:
                return JsonResponse({"status": result["threadinfo"]["thread"]["current_status"]})
    
    return HttpResponseBadRequest('Invalid request, check input again.')

def get_user_endpoint(request, user_id):
    '''
    GET /api/data/user/{user_id}/
    Valid parameter combinations:
        - ?aaps
        - ?courseid
    '''
    validate_headers(request)
    
    if len(request.GET) not in [0, 1]:
        return HttpResponseBadRequest('Invalid request, check input again.')
    else:
        if not request.GET:
            print(user_id) # delete comment when SQL is implemented
            # SELECT * FROM 'User' where 'User'.user_id == user_id (function input)
            result = {
                "user_id": 1,
                "name": "Callum Sharman",
                "first_name": "Callum",
                "last_name": "Sharman",
                "email": "12345@gmail.com",
                "email_preference": 0,
                "darkmode_preference": 0
            }
            return JsonResponse(result)
        if len(request.GET) == 1:
            if request.GET.get('aaps'):
                if request.GET.get('aaps').lower() != 'true':
                    return HttpResponseBadRequest('Invalid request, check input again.')
                else:
                    # SELECT * FROM 'File' WHERE 'File'.user_id == user_id (FUNCTION INPUT) 
                    #                        AND 'File'.request_id == NULL
                    # Just return the files idk hwo this will work yet ? :D
                    result = {
                        "aaps": [
                            {
                                'file_id': 1,
                                'file_name': 'medical condition',
                                'file_type': 'pdf',
                                'user_id': 1,
                                'request_id': 'nullll',
                            },
                            {
                                'file_id': 2,
                                'file_name': 'another medical condition',
                                'file_type': 'pdf',
                                'user_id': 1,
                                'request_id': 'nullll',
                            },
                            {
                                'file_id': 3,
                                'file_name': 'chronic dumbass syndrome',
                                'file_type': 'pdf',
                                'user_id': 1,
                                'request_id': 'nullll',
                            },
                            {
                                'file_id': 4,
                                'file_name': 'another aap',
                                'file_type': 'pdf',
                                'user_id': 1,
                                'request_id': 'nullll',
                            }
                        ]
                    }
                    return JsonResponse(result)
            if request.GET.get('courseid'):
                if check_param_not_integer(request.GET.get('courseid')):
                    return HttpResponseBadRequest('Invalid request, check input again.')
                else:
                    # Some join magic between course, enrollment and user
                    # SELECT * FROM 'Course'
                    result = {
                        "courses": [
                            {
                                "course_id": 1,
                                "course_name": "IT Project",
                                "course_code": "COMP30022"
                            },
                            {
                                "course_id": 2,
                                "course_name": "Modern Applied Statistics",
                                "course_code": "MAST30025"
                            }
                        ]
                    }
                    return JsonResponse(result)

    return HttpResponseBadRequest('Invalid request, check input again.')

@csrf_exempt
def post_new_case(request):
    '''
    POST /api/data/cases/new/
    Request body takes this format:
    {
        "thread_id": 1
        "requests": [
                {
                    "request_id": 0,
                    "thread_id": 0,
                    "date_created": "string",
                    "request_content": "string",
                    "instructor_notes": "string"
                }
            ]
    }
    '''
    if request.method == 'POST':
        data = json.loads(request.body)
        integer_fields = ['request_id', 'thread_id']
        string_fields = ['date_created', 'request_content', 'instructor_notes']
        all_fields = integer_fields + string_fields
        if 'requests' not in data or not isinstance(data['requests'], list):
            return HttpResponseBadRequest("Request body does not have correct fields")
        for item in data['requests']:
            if not set(item.keys()) == set(all_fields):
                return HttpResponseBadRequest("Request body does not have correct fields")
            else:
                for field in integer_fields:
                    if not isinstance(item[field], int):
                        return HttpResponseBadRequest("Request body does not have correct fields")
                for field in string_fields:
                    if not isinstance(item[field], str):
                        return HttpResponseBadRequest("Request body does not have correct fields")
        # Create a new case
        # For each request in request["requests"]
        # Create a new thread
        # Attach request
        return JsonResponse({
            "message": "Case created successfully"
        }, status = 201)
    else:
        return HttpResponseBadRequest('Invalid request. Check input or request type')

@csrf_exempt
def post_aap(request, user_id):
    '''
    POST /api/data/user/{user_id}/aap/
    '''
    pass

@csrf_exempt
def put_preferences(request):
    '''
    PUT /api/data/courses/setpreferences/
    Request body takes this format:
    {
        "coursepreference_id": 0,
        "course_id": 0,
        "global_extension_length": 0,
        "general_tutor": 1,
        "extension_tutor": 1,
        "quiz_tutor": 1,
        "remark_tutor": 1,
        "other_tutor": 1,
        "general_scoord": 1,
        "extension_scoord": 1,
        "quiz_scoord": 1,
        "remark_scoord": 1,
        "other_scoord": 1,
        "general_reject": "string",
        "extension_approve": "string",
        "extension_reject": "string",
        "quiz_approve": "string",
        "quiz_reject": "string",
        "remark_approve": "string",
        "remark_reject": "string"
    }
    '''
    if request.method == 'PUT':
        data = json.loads(request.body)
        integer_fields = ["coursepreference_id", "course_id", "global_extension_length",
                          "general_tutor", "extension_tutor", "quiz_tutor", "remark_tutor",
                          "other_tutor", "general_scoord", "extension_scoord", "quiz_scoord",
                          "remark_scoord", "other_scoord"]
        string_fields = ["general_reject", "extension_approve", "extension_reject",
                         "quiz_approve", "quiz_reject", "remark_approve", "remark_reject"]
        all_fields = integer_fields + string_fields
        if not all_fields == data.keys():
            return HttpResponseBadRequest("Request body does not have correct fields")
        for field in integer_fields:
            if not isinstance(data[field], int):
                return HttpResponseBadRequest("Request body does not have correct fields")
        for field in string_fields:
            if not isinstance(data[field], str):
                return HttpResponseBadRequest("Request body does not have correct fields")
        # Update course preferences table
        return JsonResponse({
            "message": "Course preferences updates successfully"
        }, status = 201)
    else:
        return HttpResponseBadRequest('Invalid request. Check input or request type')

@csrf_exempt
def put_req_response(request):
    '''
    PUT /api/data/requests/respond/
    For query/other:
    {
        "instructor_notes": "no!",
        "status": "REJECTED"
    }
    For extension/quizcode/remark:
    {
        "instructor_notes": ":o",
        "status": "APPROVED",
        "extended_by": 4
    }
    '''
    if request.method == 'PUT':
        pass
    else:
        return HttpResponseBadRequest('Invalid request. Check input or request type')

@csrf_exempt
def set_complex(request):
    '''
    PUT /api/data/thread/complex
    Request body should take form:
    {
        "thread_id": 0,
        "complex_case": 1
    }
    '''
    if request.method == 'PUT':
        pass
    else:
        return HttpResponseBadRequest('Invalid request. Check input or request type')
