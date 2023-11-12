"""
All endpoints in data_endpoints
"""

# from django.shortcuts import render
import base64
import json
from datetime import datetime, time, timedelta
import mysql.connector
from django.http import HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create a connection
# Replace these values with your MySQL server details

DATABASE_NAME = 'db'

connection = mysql.connector.connect(
    host="db",
    port="3306",
    user="root",
    password="admin"
)

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
    '''
    Abstracts away value.isdigit() to make cleaner code
    '''
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
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        if not check_param_not_integer(request.GET.get('assignid')):
            cursor = connection.cursor(dictionary=True)
            cursor.execute(f"USE {DATABASE_NAME}")

            # Execute a query to fetch the assignment data
            query = "SELECT * FROM Assignment WHERE assignment_id = %s"
            cursor.execute(query, (request.GET.get('assignid'),))

            # Fetch the result
            assignment_data = cursor.fetchone()

            if assignment_data:
                # Check if due_date is None (null) and handle it
                if assignment_data["due_date"] is None:
                    due_date_str = "N/A"  # Or any other value you prefer
                if not assignment_data["due_date"] is None:
                    due_date_str = assignment_data["due_date"].strftime("%Y:%m:%d %H:%M:%S")

                # Format the data into the desired JSON format
                json_data = {
                    "assignment_id": assignment_data["assignment_id"],
                    "course_id": assignment_data["course_id"],
                    "assignment_name": assignment_data["assignment_name"],
                    "assignment_type": assignment_data["assignment_type"],
                    "assignment_weightage": assignment_data["assignment_weightage"],
                    "start_date": assignment_data["start_date"].strftime("%Y:%m:%d %H:%M:%S"),
                    "end_date": due_date_str  # Use the formatted due_date or "N/A"
                }

                return JsonResponse(json_data)

            if not assignment_data:
                return JsonResponse({'message': 'Invalid request.'}, status = 400)

    if not request.GET.get('assignid') and request.GET.get('courseid'):
        if check_param_not_integer(request.GET.get('courseid')):
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        if not check_param_not_integer(request.GET.get('courseid')):
            cursor = connection.cursor(dictionary=True)
            cursor.execute(f"USE {DATABASE_NAME}")

            # Execute a query to fetch assignments for the given course_id
            query = "SELECT * FROM Assignment WHERE course_id = %s"
            cursor.execute(query, (request.GET.get('courseid'),))
            assignments = []

            for assignment_data in cursor:
                # Check if start_date or end_date is None and provide a default value
                if assignment_data["start_date"] is None:
                    start_date_str = "N/A"  # Or any other value you prefer
                if not assignment_data["start_date"] is None:
                    start_date_str = assignment_data["start_date"].strftime("%Y:%m:%d %H:%M:%S")

                if assignment_data["due_date"] is None:
                    end_date_str = "N/A"  # Or any other value you prefer
                if not assignment_data["due_date"] is None:
                    end_date_str = assignment_data["due_date"].strftime("%Y:%m:%d %H:%M:%S")

                assignment = {
                    "assignment_id": assignment_data["assignment_id"],
                    "course_id": assignment_data["course_id"],
                    "assignment_name": assignment_data["assignment_name"],
                    "assignment_type": assignment_data["assignment_type"],
                    "assignment_weightage": assignment_data["assignment_weightage"],
                    "start_date": start_date_str,
                    "end_date": end_date_str
                }

                assignments.append(assignment)
                result = {"assessments": assignments}

            if len(request.GET) == 1 and not request.GET.get('names'):
                return JsonResponse(result)

            if len(request.GET) == 2 and request.GET.get('names') \
                and request.GET.get('names').lower() == 'true':
                namesonly = {
                    "assessments": []
                }
                for assessment in result["assessments"]:
                    namesonly["assessments"].append(assessment["assignment_name"])
                return JsonResponse(namesonly)

    return JsonResponse({'message': 'Invalid request.'}, status = 500)

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
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        if not check_param_not_integer(request.GET.get('userid')):
            # SELECT * FROM 'Case' WHERE 'Case'.user_id == int(request.GET.get('userid'))
            cursor = connection.cursor()
            cursor.execute(f"USE {DATABASE_NAME}")
            # Execute a query to fetch case_id values for the given user_id
            query = "SELECT case_id FROM `Case` WHERE user_id = %s"
            cursor.execute(query, (request.GET.get('userid'),))

            case_ids = [row[0] for row in cursor]

            cases = [{"case_id": case_id, "user_id": request.GET.get('userid')} \
                      for case_id in case_ids]

            json_data = {"cases": cases}
            return JsonResponse(json_data)
    if not request.GET.get('userid') and request.GET.get('caseid'):
        if check_param_not_integer(request.GET.get('caseid')):
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        if not check_param_not_integer(request.GET.get('caseid')):
            if len(request.GET) == 1:
                cursor = connection.cursor(dictionary=True)
                cursor.execute(f"USE {DATABASE_NAME}")
                # Execute a query to fetch case data for the given case_id
                query = "SELECT * FROM `Case` WHERE case_id = %s"
                cursor.execute(query, (request.GET.get('caseid'),))

                case_data = cursor.fetchone()

                if case_data:
                    json_data = {
                        "case": {
                            "case_id": case_data["case_id"],
                            "user_id": case_data["user_id"]
                        }
                    }
                    return JsonResponse(json_data)

                if not case_data:
                    return JsonResponse({'message': 'Invalid request.'}, status = 400)

            if len(request.GET) == 2 and request.GET.get('threads').lower() == 'true':
                cursor = connection.cursor()
                cursor.execute(f"USE {DATABASE_NAME}")
                # Execute a query to fetch threads for the given case_id
                query = "SELECT * FROM Thread WHERE case_id = %s"
                cursor.execute(query, (request.GET.get('caseid'),))

                threads = []

                for thread_data in cursor:
                    # Check if date_updated or assignment_id is None and provide default values
                    if thread_data[3] is None:  # Using integer index for date_updated
                        date_updated_str = "N/A"  # Or any other value you prefer
                    if not thread_data[3] is None:
                        print(thread_data)
                        datetime_with_time = datetime.combine(thread_data[7], time(0, 0, 0))
                        # Format the datetime
                        formatted_datetime = datetime_with_time.strftime("%Y:%m:%d %H:%M:%S")

                    if thread_data[6] is None:  # Using integer index for assignment_id
                        assignment_id = "N/A"  # Or any other value you prefer
                    if not thread_data[6] is None:
                        assignment_id = thread_data[6]

                    thread = {
                        "thread_id": thread_data[0],  # Using integer indices
                        "case_id": thread_data[1],
                        "course_id": thread_data[2],
                        "date_updated": formatted_datetime,
                        "request_type": thread_data[3],
                        "complex_case": thread_data[4],
                        "current_status": thread_data[5],
                        "assignment_id": assignment_id
                    }

                    threads.append(thread)

                json_data = {"threads": threads}
                return JsonResponse(json_data)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)

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
        return JsonResponse({'message': 'Invalid request.'}, status = 400)

    if len(request.GET) == 1 and request.GET.get('userid'):
        if check_param_not_integer(request.GET.get('userid')):
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        if not check_param_not_integer(request.GET.get('userid')):
            cursor = connection.cursor(dictionary=True)
            cursor.execute(f"USE {DATABASE_NAME}")

            # Execute a query to fetch the courses for the given user_id
            query = "SELECT c.course_id, c.course_name, c.course_code FROM Course c " \
                    "INNER JOIN Enrollment e ON c.course_id = e.course_id " \
                    "WHERE e.user_id = %s"
            cursor.execute(query, (request.GET.get('userid'),))

            courses = []

            for course_data in cursor:
                course = {
                    "course_id": course_data["course_id"],
                    "course_name": course_data["course_name"],
                    "course_code": course_data["course_code"]
                }

                courses.append(course)

            json_data = {"courses": courses}
            return JsonResponse(json_data)

    if not request.GET.get('userid') and request.GET.get('courseid'):
        if check_param_not_integer(request.GET.get('courseid')):
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        if not check_param_not_integer(request.GET.get('courseid')):
            if len(request.GET) == 1:
                # SELECT * FROM COURSE WHERE 'Course'.course_Id == int(request.GET.get('courseid'))
                cursor = connection.cursor(dictionary=True)
                cursor.execute(f"USE {DATABASE_NAME}")

                # Execute a query to fetch course information for the given course_id
                query = "SELECT course_id, course_name, course_code FROM Course WHERE course_id=%s"
                cursor.execute(query, (request.GET.get('courseid'),))

                course_data = cursor.fetchone()

                if course_data:
                    course_info = {
                        "course": {
                            "course_id": course_data["course_id"],
                            "course_name": course_data["course_name"],
                            "course_code": course_data["course_code"]
                        }
                    }
                    return JsonResponse(course_info)

                if not course_data:
                    return JsonResponse({'message': 'Invalid request.'}, status = 400)

            if len(request.GET) == 2 and request.GET.get('preferences') and \
                request.GET.get('preferences').lower() == 'true':
                cursor = connection.cursor(dictionary=True)
                cursor.execute(f"USE {DATABASE_NAME}")
                # Execute a query to fetch course preferences for the given course_id
                query = "SELECT * FROM CoursePreferences WHERE course_id = %s"
                cursor.execute(query, (request.GET.get('courseid'),))

                course_preferences_data = cursor.fetchone()

                if course_preferences_data:
                    course_preferences = {
                        "coursepreferences": {
                            "coursepreference_id": course_preferences_data["coursepreference_id"],
                            "course_id": course_preferences_data["course_id"],
                            "global_extension_length": 
                                course_preferences_data["global_extension_length"],
                            "general_tutor": course_preferences_data["general_tutor"],
                            "extension_tutor": course_preferences_data["extension_tutor"],
                            "quiz_tutor": course_preferences_data["quiz_tutor"],
                            "remark_tutor": course_preferences_data["remark_tutor"],
                            "other_tutor": course_preferences_data["other_tutor"],
                            "general_scoord": course_preferences_data["general_scoord"],
                            "extension_scoord": course_preferences_data["extension_scoord"],
                            "quiz_scoord": course_preferences_data["quiz_scoord"],
                            "remark_scoord": course_preferences_data["remark_scoord"],
                            "other_scoord": course_preferences_data["other_scoord"],
                            "general_reject": course_preferences_data["general_reject"],
                            "extension_approve": course_preferences_data["extension_approve"],
                            "extension_reject": course_preferences_data["extension_reject"],
                            "quiz_approve": course_preferences_data["quiz_approve"],
                            "quiz_reject": course_preferences_data["quiz_reject"],
                            "remark_approve": course_preferences_data["remark_approve"],
                            "remark_reject": course_preferences_data["remark_reject"]
                        }
                    }
                    return JsonResponse(course_preferences)

                if not course_preferences_data:
                    return JsonResponse({'message': 'Invalid request.'}, status = 400)

    return JsonResponse({'message': 'Invalid request.'}, status = 500)

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
            return JsonResponse({'message': 'Invalid request.'}, status = 400)

        if request.GET.get('userid'):
            if check_param_not_integer(request.GET.get('userid')):
                return JsonResponse({'message': 'Invalid request.'}, status = 400)
            if not check_param_not_integer(request.GET.get('userid')):
                # Return request history of a user
                # Consult Callum on this, unsure if we actually need more data on this
                cursor = connection.cursor(dictionary=True)
                cursor.execute(f"USE {DATABASE_NAME}")

                # Execute a query to fetch requests information for the given student_id
                query = "SELECT r.request_id, r.thread_id, r.date_created, " \
                        "r.request_content, r.instructor_notes FROM Request r " \
                        "INNER JOIN Thread t ON r.thread_id = t.thread_id " \
                        "INNER JOIN `Case` c ON t.case_id = c.case_id " \
                        "WHERE c.user_id = %s"
                cursor.execute(query, (request.GET.get('userid'),))

                requests = []

                for request_data in cursor:
                    request = {
                        "request_id": request_data["request_id"],
                        "thread_id": request_data["thread_id"],
                        "date_created": request_data["date_created"].strftime("%Y:%m:%d %H:%M:%S"),
                        "request_content": request_data["request_content"],
                        "instructor_notes": request_data["instructor_notes"]
                    }

                    requests.append(request)

                json_data = {"requests": requests}
                return JsonResponse(json_data)

        if request.GET.get('requestid'):
            if check_param_not_integer(request.GET.get('requestid')):
                return JsonResponse({'message': 'Invalid request.'}, status = 400)
            if not check_param_not_integer(request.GET.get('requestid')):
                cursor = connection.cursor(dictionary=True)
                cursor.execute(f"USE {DATABASE_NAME}")

                # Query the Request table to retrieve the information for the specified request_id
                query = "SELECT * FROM Request WHERE request_id = %s"
                cursor.execute(query, (request.GET.get('requestid'),))

                # Fetch the result
                request_data = cursor.fetchone()

                if request_data:
                    # Convert the date to the desired format
                    formatted_date = request_data['date_created'].strftime("%Y:%m:%d %H:%M:%S")

                    # Create the result dictionary
                    result = {
                        "request": {
                            "request_id": request_data['request_id'],
                            "thread_id": request_data['thread_id'],
                            "date_created": formatted_date,
                            "request_content": request_data['request_content'],
                            "instructor_notes": request_data['instructor_notes']
                        }
                    }
                    return JsonResponse(result)

                if not request_data:
                    return JsonResponse({'message': 'Invalid request.'}, status = 400)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)

def get_threads_user_endpoint(request):
    '''
    GET /api/data/thread/
    Valid parameter combinations:
        - ?threadid
        - ?courseid
        - ?userid&status
    '''
    validate_headers(request)

    if len(request.GET) not in [1, 2]:
        return JsonResponse({'message': 'Invalid request.'}, status = 400)

    if len(request.GET) == 1:
        if request.GET.get('threadid'):
            if check_param_not_integer(request.GET.get('threadid')):
                return JsonResponse({'message': 'Invalid request.'}, status = 400)
            if not check_param_not_integer(request.GET.get('threadid')):
                # Some join of 'Thread' and 'Case' on case_id
                cursor = connection.cursor(dictionary=True)
                cursor.execute(f"USE {DATABASE_NAME}")
                query = """
                SELECT `Case`.user_id
                FROM `Case`
                INNER JOIN Thread ON Thread.case_id = `Case`.case_id
                WHERE Thread.thread_id = %s
                """
                cursor.execute(query, (request.GET.get('threadid'),))
                user_id = cursor.fetchone()
                response = {
                    "created_by": user_id
                }
                return JsonResponse(response)
        if request.GET.get('courseid'):
            if check_param_not_integer(request.GET.get('courseid')):
                return JsonResponse({'message': 'Invalid request.'}, status = 400)
            if not check_param_not_integer(request.GET.get('courseid')):
                # TODO: Return all threads belonging to a Course ID
                result = {
                    "threads": [
                        {
                            'thread_id': 11,
                            'case_id': 11,
                            'course_id': 31,
                            'date_updated': "11-09-2023",
                            'request_type':'Extension', 
                            'complex_case':1,
                            'current_status':'PENDING',
                            'assignment_id': 1,
                        },
                        {
                            'thread_id': 12,
                            'case_id': 12,
                            'course_id': 31,
                            'date_updated': "01-19-2023",
                            'request_type':'Query',
                            'complex_case':0,
                            'current_status':'PENDING',
                            'assignment_id':2,
                        },
                        {
                            'thread_id': 13,
                            'case_id': 12,
                            'course_id': 31,
                            'date_updated': "01-19-2023",
                            'request_type':'Other',
                            'complex_case':1,
                            'current_status':'REJECTED',
                            'assignment_id':3,
                        }
                    ]
                }
                return JsonResponse(result)

    if len(request.GET) in [1, 2] and request.GET.get('userid') and request.GET.get('status'):
        if check_param_not_integer(request.GET.get('userid')) or \
            not request.GET.get('status').lower() in ["approved", "pending", "rejected"]:
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        if not check_param_not_integer(request.GET.get('userid')) and \
            request.GET.get('status').lower() in ["approved", "pending", "rejected"]:
            # Some join of 'Thread' and 'Case' on case_id
            # result["thread"]["current_status"] == request.GET.get('checkstatus')
            threads = []
            cursor = connection.cursor(dictionary=True)
            cursor.execute(f"USE {DATABASE_NAME}")
            # SQL query to retrieve threads based on user_id and status
            query = "SELECT T.thread_id, T.case_id, T.course_id," \
            " T.date_updated, T.request_type, T.complex_case, " \
            "T.current_status, T.assignment_id FROM Thread AS T " \
                    "JOIN `Case` AS C ON T.case_id = C.case_id " \
                    "WHERE C.user_id = %s AND T.current_status = %s"

            # Execute the query with user_id and status as parameters
            cursor.execute(query, (request.GET.get('userid'), request.GET.get('status')))

            # Fetch all the results
            results = cursor.fetchall()
            for row in results:
            # Format the date_updated field to "2000:01:01 00:00:00"
                row['date_updated'] = row['date_updated'].strftime("%Y:%m:%d %H:%M:%S")
                threads.append(row)

            for row in results:
                threads.append(row)
            json_result = {"threads": threads}
            return JsonResponse(json_result)

    return JsonResponse({'message': 'Invalid request.'}, status = 500)

def get_threads_endpoint(request, thread_id):
    '''
    GET /api/data/thread/{thread_id}/
    Valid parameter combinations:
        - No parameters
        - ?checkstatus
    '''
    validate_headers(request)

    if len(request.GET) not in [0, 1]:
        return JsonResponse({'message': 'Invalid request.'}, status = 400)

    if len(request.GET) in [0, 1]:
        # Compare it to the function input thread_id
        # SELECT * FROM 'Thread' WHERE 'Thread'.thread_id == thread_id
        # SELECT * FROM 'Request' WHERE 'Request'.thread_id == thread_id
        cursor = connection.cursor(dictionary=True)
        cursor.execute(f"USE {DATABASE_NAME}")

        # Query the Thread table
        thread_query = f"SELECT * FROM Thread WHERE thread_id = {thread_id}"
        cursor.execute(thread_query)
        thread_info = cursor.fetchone()

        if thread_info:
            # Query the Request table
            request_query = f"SELECT * FROM Request WHERE thread_id = {thread_id}"
            cursor.execute(request_query)
            requests = cursor.fetchall()

            # Query the CoursePreferences table
            coursepreference_query = "SELECT * FROM CoursePreferences WHERE course_id = %s"
            cursor.execute(coursepreference_query, (thread_info['course_id'],))
            coursepreferences = cursor.fetchone()

            # Format the datetime fields
            if thread_info['date_updated']:
                thread_info['date_updated'] = \
                    thread_info['date_updated'].strftime('%Y:%m:%d %H:%M:%S')
            for request_db in requests:
                if request_db['date_created']:
                    request_db['date_created'] = \
                        request_db['date_created'].strftime('%Y:%m:%d %H:%M:%S')

            # Create the JSON structure
            result = {
                "threadinfo": {
                    "thread": thread_info,
                    "requests": requests,
                    "coursepreferences": coursepreferences
                }
            }
            if not request.GET:
                return JsonResponse(result)
            if request.GET.get('checkstatus'):
                if not request.GET.get('checkstatus').lower() == 'true':
                    return JsonResponse({'message': 'Invalid request.'}, status = 400)
                if request.GET.get('checkstatus').lower() == 'true':
                    return JsonResponse({
                        "status": result["threadinfo"]["thread"]["current_status"]
                    })

        if not thread_info:
            return JsonResponse({'message': 'Invalid request.'}, status = 400)

def get_user_endpoint(request, user_id):
    '''
    GET /api/data/user/{user_id}/
    Valid parameter combinations:
        - ?courseid
    '''
    validate_headers(request)
    if not len(request.GET) in [0, 1]:
        return JsonResponse({'message': 'Invalid request.'}, status=400)

    if len(request.GET) in [0, 1]:
        if not request.GET:
            cursor = connection.cursor(dictionary=True)
            # Query the User table
            cursor.execute(f"USE {DATABASE_NAME}")
            user_query = f"SELECT * FROM User WHERE user_id = {user_id}"
            cursor.execute(user_query)
            user_data = cursor.fetchone()

            if user_data:
                # Query the Enrollment table to get enrollment role
                enrollment_query = f"SELECT enrollment_role FROM Enrollment WHERE user_id = {user_id}"
                cursor.execute(enrollment_query)
                enrollment_data = cursor.fetchone()

                # Create the JSON structure
                result = {
                    "user_id": user_data['user_id'],
                    "name": user_data['name'],
                    "first_name": user_data['first_name'],
                    "last_name": user_data['last_name'],
                    "email": user_data['email'],
                    "email_preference": user_data['email_preference'],
                    "darkmode_preference": user_data['darkmode_preference'],
                    "enrollment_role": enrollment_data['enrollment_role'] if enrollment_data else None
                }
                return JsonResponse(result)

            if not user_data:
                return JsonResponse({'message': 'Invalid request.'}, status=400)

        if len(request.GET) == 1 and request.GET.get('courseid'):
            if check_param_not_integer(request.GET.get('courseid')):
                return JsonResponse({'message': 'Invalid request.'}, status=400)
            if not check_param_not_integer(request.GET.get('courseid')):
                # Some join magic between course, enrollment, and user
                cursor = connection.cursor(dictionary=True)

                # Query the Enrollment table to get enrolled courses for the user
                courses_query = f"SELECT Course.course_id, course_name, course_code" \
                                f"FROM Course INNER JOIN Enrollment ON Course.course_id " \
                                f"= Enrollment.course_id WHERE user_id = {user_id}"
                cursor.execute(courses_query)
                courses_data = cursor.fetchall()

                # Create a list of course dictionaries
                course_list = []
                for course in courses_data:
                    course_info = {
                        "course_id": course['course_id'],
                        "course_name": course['course_name'],
                        "course_code": course['course_code']
                    }
                    course_list.append(course_info)

                # Create the JSON structure
                result = {"courses": course_list}
                return JsonResponse(result)

    return JsonResponse({'message': 'Invalid request.'}, status=500)


def get_files_endpoint(request, user_id):
    '''
    GET /api/data/files/{user_id}/
    Valid parameter combinations:
        - ?aaps
        - ?requestid
    '''
    if len(request.GET) == 1:
        if request.GET.get('aaps').lower() == 'true':
            # Get all files that are AAPs from database
            with connection.cursor() as cursor:
                cursor.execute(f"USE {DATABASE_NAME}")
                cursor.execute("SELECT file_name, file_type, file FROM File WHERE user_id = %s AND file_type IN ('aap', 'AAP')", [user_id])
                rows = cursor.fetchall()
            files_list = []
            for row in rows:
                file_data = base64.b64encode(row[2]).decode()
                files_list.append({
                    'file_name': row[0],
                    'file_type': row[1],
                    'file_data': file_data 
                })
            return JsonResponse({'aaps': files_list})
        if request.GET.get('requestid'):
            if not isinstance(request.GET.get('requestid'), int):
                return HttpResponseBadRequest('Invalid request, check input again. requestID error')
            # Get all files under request ID
            with connection.cursor() as cursor:
                cursor.execute(f"USE {DATABASE_NAME}")
                cursor.execute("SELECT file_name, file_type, file FROM File WHERE user_id = %s", [user_id])
                rows = cursor.fetchall()
            files_list = []
            for row in rows:
                file_data = base64.b64encode(row[2]).decode()
                files_list.append({
                    'file_name': row[0],
                    'file_type': row[1],
                    'file_data': file_data 
                })
            return JsonResponse({'supportingDocs': files_list})
    if not len(request.GET) == 1:
        return JsonResponse({'message': 'Invalid request.'}, status = 400)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)

@csrf_exempt
def post_new_case(request):
    '''
    POST /api/data/cases/new/
    Request body takes this format:
    {   
        "user_id":1,
        "requests": [
            {
                "course_id": 7677734,
                "request_type": "AAP",
                "assignment_id": 40897567,
                "request_content": "bla bla"
            },
            {
                "course_id": 7677734,
                "request_type": "QUERY",
                "assignment_id": 40268278,
                "request_content": "bla bla"
            }
        ]
    }
    '''
    if request.method == 'POST':
        data = json.loads(request.body)
        integer_fields = ['course_id', 'assignment_id']
        string_fields = ['request_type', 'request_content']
        all_fields = integer_fields + string_fields
        if 'user_id' not in data:
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        if 'requests' not in data or not isinstance(data['requests'], list):
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        for item in data['requests']:
            if not set(item.keys()) == set(all_fields):
                return JsonResponse({'message': 'Invalid request.'}, status = 400)
            if set(item.keys()) == set(all_fields):
                for field in integer_fields:
                    if not isinstance(item[field], int):
                        return JsonResponse({'message': 'Invalid request.'}, status = 400)
                for field in string_fields:
                    if not isinstance(item[field], str):
                        return JsonResponse({'message': 'Invalid request.'}, status = 400)
        # Create a new case

        try:
            with connection.cursor() as cursor:
                cursor.execute(f"USE {DATABASE_NAME}")
                user_ID = data.get("user_id",)
                cursor.execute(
                    "INSERT INTO `db`.`Case` (`user_id`) VALUES (%s)",
                    (user_ID,)
                )
                case_id = cursor.lastrowid

                # Iterate through the requests in the JSON
                for request_data in data.get("requests", []):
                    # Fill in default values for missing keys
                    request_data.setdefault("instructor_notes", "-")
                    request_data.setdefault("complex_case", 0)
                    request_data.setdefault("current_status", "pending")

                    # Create a new thread
                    cursor.execute(
                        "INSERT INTO `db`.`Thread` (`case_id`, `course_id`, `request_type`, `complex_case`, `current_status`, `assignment_id`, `date_updated`) VALUES (%s, %s, %s, %s, %s, %s, NOW())",
                        (case_id, request_data['course_id'], request_data['request_type'], request_data['complex_case'], request_data['current_status'], request_data['assignment_id'])
                    )
                    thread_id = cursor.lastrowid

                    # Get the current date and time in Python
                    current_date_time = datetime.now()

                    # Create a new request
                    cursor.execute(
                        "INSERT INTO `db`.`Request` (`thread_id`, `request_content`, `instructor_notes`, `date_created`) VALUES (%s, %s, %s, %s)",
                        (thread_id, request_data['request_content'], request_data['instructor_notes'], current_date_time.strftime('%Y-%m-%d %H:%M:%S'))
                    )

            # Commit the changes to the database
            connection.commit()

        finally:
            connection.close()
        return JsonResponse({
            "message": "Case created successfully"
        }, status = 201)
    if not request.method == 'POST':
        return JsonResponse({'message': 'Invalid request.'}, status = 400)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)

@csrf_exempt
def post_file(request):
    '''
    POST /api/data/files/upload/
    Check API for request body
    '''
    # Some request body validation code idk
    if request.method == 'POST':
        data = json.loads(request.body)
        data_keys = list(data.keys())
        all_fields = ["user_id","request_id","fileName"]
        if not (all_fields == data_keys):
            return HttpResponseBadRequest("Request body does not have correct fields")
        # Create a cursor to interact with the database
        cursor = connection.cursor()
        cursor.execute(f"USE {DATABASE_NAME}")
        # Extract data from the JSON
        user_id = data["user_id"]
        fileName = data["fileName"]
        request_id= data["request_id"]
        file_type = 'AAP'
        
        file_data = request.FILES[fileName].read()
        cursor = connection.cursor()
        cursor.execute(f"USE {DATABASE_NAME}")
        insert_query = "INSERT INTO db.File (file, file_name, user_id, request_id, file_type) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(insert_query, (file_data, fileName, user_id, request_id, file_type))
        connection.commit()
        return JsonResponse({"message": "Uploaded successfully"}, status = 201)
    if not request.method == 'POST':
        return JsonResponse({'message': 'Invalid request.'}, status = 400)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)

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
        data_keys = list(data.keys())
        if not all_fields == data_keys:
            return HttpResponseBadRequest("Request body does not have correct fields")
        for field in integer_fields:
            if not isinstance(data[field], int):
                return HttpResponseBadRequest("Request body does not have correct fields")
        for field in string_fields:
            if not isinstance(data[field], str):
                return HttpResponseBadRequest("Request body does not have correct fields")
        # Update course preferences table
        
        # Create a cursor to interact with the database
        cursor = connection.cursor()
        
        cursor.execute(f"USE {DATABASE_NAME}")
        # Extract data from the JSON
        coursepreference_id = data["coursepreference_id"]
        course_id = data["course_id"]
        global_extension_length = data["global_extension_length"]
        general_tutor = data["general_tutor"]
        extension_tutor = data["extension_tutor"]
        quiz_tutor = data["quiz_tutor"]
        remark_tutor = data["remark_tutor"]
        other_tutor = data["other_tutor"]
        general_scoord = data["general_scoord"]
        extension_scoord = data["extension_scoord"]
        quiz_scoord = data["quiz_scoord"]
        remark_scoord = data["remark_scoord"]
        other_scoord = data["other_scoord"]
        general_reject = data["general_reject"]
        extension_approve = data["extension_approve"]
        extension_reject = data["extension_reject"]
        quiz_approve = data["quiz_approve"]
        quiz_reject = data["quiz_reject"]
        remark_approve = data["remark_approve"]
        remark_reject = data["remark_reject"]

        # Update the 'CoursePreferences' table in the database
        cursor.execute("""
            UPDATE CoursePreferences
            SET
                global_extension_length = %s,
                general_tutor = %s,
                extension_tutor = %s,
                quiz_tutor = %s,
                remark_tutor = %s,
                other_tutor = %s,
                general_scoord = %s,
                extension_scoord = %s,
                quiz_scoord = %s,
                remark_scoord = %s,
                other_scoord = %s,
                general_reject = %s,
                extension_approve = %s,
                extension_reject = %s,
                quiz_approve = %s,
                quiz_reject = %s,
                remark_approve = %s,
                remark_reject = %s
            WHERE
                coursepreference_id = %s AND course_id = %s
        """, (
            global_extension_length, general_tutor, extension_tutor, quiz_tutor, remark_tutor, other_tutor,
            general_scoord, extension_scoord, quiz_scoord, remark_scoord, other_scoord,
            general_reject, extension_approve, extension_reject, quiz_approve, quiz_reject,
            remark_approve, remark_reject, coursepreference_id, course_id
        ))

        # Commit the changes
        connection.commit()
        print("CoursePreferences table updated successfully")
        return JsonResponse({
            "message": "Course preferences updates successfully"
        }, status = 201)
    if not request.method == 'PUT':
        return JsonResponse({'message': 'Invalid request.'}, status = 400)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)

@csrf_exempt
def put_req_response(request):
    '''
    PUT /api/data/requests/respond/
    For query/other:
    {
        "request_id":1
        "instructor_notes": ":o",
        "status": "APPROVED"
    }
    For extension/quizcode/remark:
    {
        "request_id":1
        "assignment_id":1
        "instructor_notes": ":o",
        "status": "APPROVED",
        "extended_by": 4
    }
    '''
    if request.method == 'PUT':
        data = json.loads(request.body)
        all_fields = ["request_id", "instructor_notes", "status"]
        extension_fields = ["request_id", "assignment_id", "instructor_notes", "status", "extended_by"]
        data_keys = list(data.keys())
        
        print(data_keys)
        if not ((all_fields == data_keys) or (extension_fields == data_keys)):
            return HttpResponseBadRequest("Request body does not have correct fields")
        
        # Update course preferences table

        # Create a cursor to interact with the database
        cursor = connection.cursor()
        cursor.execute(f"USE {DATABASE_NAME}")
        # Extract data from the JSON
        instructor_notes = data["instructor_notes"]
        status = data["status"]
        request_id = data["request_id"]
        
        # Check if "assignment_id" is in data
        if "assignment_id" in data:
            assignment_id = data["assignment_id"]
            extended_by = data["extended_by"]

            # Update the 'Assignment' table due_date
            cursor.execute("""
                SELECT start_date, due_date FROM db.Assignment
                WHERE assignment_id = %s
            """, (assignment_id,))
            
            assignment_data = cursor.fetchone()
            due_date = assignment_data[1]

            if due_date is not None:
                # If due_date is not null, add extended_by days to it
                new_due_date = due_date + timedelta(days=extended_by)
                cursor.execute("""
                    UPDATE db.Assignment
                    SET due_date = %s
                    WHERE assignment_id = %s
                """, (new_due_date, assignment_id))
            else:
                # If due_date is null, return an error
                return JsonResponse({"message": "Due date is null. Cannot extend assignment."}, status=400)

        # Update the 'CoursePreferences' table in the database
        cursor.execute("""
            UPDATE db.Thread AS t
            JOIN db.Request AS r ON t.thread_id = r.thread_id
            SET t.current_status = %s,
                r.instructor_notes = %s
            WHERE r.request_id = %s
        """, (
            status, instructor_notes, request_id
        ))

        # Commit the changes
        connection.commit()
        return JsonResponse({"message": "Updated successfully"}, status=201)

    if not request.method == 'PUT':
        return JsonResponse({'message': 'Invalid request.'}, status=400)

    return JsonResponse({'message': 'Invalid request.'}, status=500)

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
        try:
            # Create a cursor to interact with the database
            cursor = connection.cursor()
            cursor.execute(f"USE {DATABASE_NAME}")
            data = json.loads(request.body)
            
            # Check the current value of 'complex_case' for the given 'request_id'
            
            cursor.execute(f"SELECT complex_case FROM Thread WHERE thread_id = {data['thread_id']}")
            current_complex_case = cursor.fetchall()[0][0]
            print(current_complex_case)
            # Toggle the 'complex_case' value (0 to 1 or 1 to 0)
            new_complex_case = 1 if current_complex_case == 0 else 0

            # Update the 'complex_case' value in the database
            cursor.execute(f"UPDATE Thread SET complex_case = {new_complex_case} WHERE thread_id = {data['thread_id']}")

            # Commit the changes
            connection.commit()

            print(f"Complex_case for thread_id {data['thread_id']} updated to {new_complex_case}")
            return JsonResponse({
                "message": "Updated successfully"
            }, status = 201)
        except mysql.connector.Error as error: 
            print(error)
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
    if not request.method == 'PUT':
        return JsonResponse({'message': 'Invalid request.'}, status = 400)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)
