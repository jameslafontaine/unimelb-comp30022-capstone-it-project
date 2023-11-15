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
DATABASE_NAME = "db"

def validate_headers(request):
    '''
    Deactivate temporarily for ease of development

    Check if request has the necessary headers
        1. "Authorization": "Bearer <access_token>"
    '''
    #authorization = request.META.get('Authorization')

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
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )
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
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )
    validate_headers(request)
    if request.GET.get('userid') and len(request.GET) == 1:
        if check_param_not_integer(request.GET.get('userid')):
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        if not check_param_not_integer(request.GET.get('userid')):
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM `db`.`Case` WHERE `Case`.user_id = %s", (request.GET.get('userid'),))
            returnCases = []
            for row in cursor:
                returnCases.append({
                    "case_id": row['case_id'],
                    "user_id": row["user_id"]
                })
            cursor.close()
            return JsonResponse({
                "cases": returnCases
            })

    if len(request.GET) == 1 and request.GET.get('caseid'):
        if check_param_not_integer(request.GET.get('caseid')):
            return JsonResponse({'message': 'Invalid request.'}, status = 400)
        if not check_param_not_integer(request.GET.get('caseid')):
            if len(request.GET) == 1:
                cursor = connection.cursor(dictionary=True)
                # Execute a query to fetch case data for the given case_id
                cursor.execute("SELECT * FROM `db`.`Case` WHERE `Case`.case_id = %s", (request.GET.get('caseid'),))
                case_data = cursor.fetchone()
                if case_data:
                    return JsonResponse({
                        "case": {
                            "case_id": case_data["case_id"],
                            "user_id": case_data["user_id"]
                        }
                    })

                if not case_data:
                    return JsonResponse({'message': 'Invalid request.'}, status = 400)

    if len(request.GET) == 2 and request.GET.get('caseid') and request.GET.get('threads').lower() == 'true':
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM `db`.`Thread` WHERE `Thread`.case_id = %s", (request.GET.get('caseid'),))
        threads = []
        for row in cursor:
            threads.append({
                "thread_id": row['thread_id'],
                "case_id": row['case_id'],
                "course_id": row['course_id'],
                "date_updated": row['date_updated'],
                "request_type": row['request_type'],
                "complex_case": row['complex_case'],
                "current_status": row['current_status'],
                "assignment_id": row['assignment_id'] 
            })
        cursor.close()
        return JsonResponse({
            "threads": threads
        })

    return JsonResponse({'message': 'Invalid request.'}, status = 500)

# TODO:
def get_courses_endpoint(request):
    '''
    GET /api/data/courses/
    Valid parameter combinations:
        - ?userid/get_
        - ?courseid
        - ?courseid&preferences
    '''
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )
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
            query = "SELECT c.course_id, c.course_name, c.course_code FROM Course c INNER JOIN Enrollment e ON c.course_id = e.course_id WHERE e.user_id = %s"
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
            if len(request.GET) == 2 and request.GET.get('preferences') \
                and request.GET.get('preferences').lower() == 'true':
                cursor = connection.cursor(dictionary=True)
                cursor.execute("SELECT * FROM `db`.`CoursePreferences` WHERE `CoursePreferences`.course_id = %s", (request.GET.get('courseid'),))
                row = cursor.fetchone()
                result = {
                    "coursepreferences": {
                        "coursepreference_id": row['coursepreference_id'],
                        "course_id": request.GET.get('course_id'),
                        "global_extension_length": row['global_extension_length'],
                        "general_tutor": row['general_tutor'],
                        "extension_tutor": row['extension_tutor'],
                        "quiz_tutor": row['quiz_tutor'],
                        "remark_tutor": row['remark_tutor'],
                        "other_tutor": row['other_tutor'],
                        "general_scoord": row['general_scoord'],
                        "extension_scoord": row['general_scoord'],
                        "quiz_scoord": row['general_scoord'],
                        "remark_scoord": row['remark_scoord'],
                        "other_scoord": row['other_scoord'],
                        "general_reject": row['general_reject'],
                        "extension_approve": row['extension_approve'],
                        "extension_reject": row['extension_reject'],
                        "quiz_approve": row['quiz_approve'],
                        "quiz_reject": row['quiz_reject'],
                        "remark_approve": row['remark_approve'],
                        "remark_reject": row['remark_reject']
                    }
                }
                cursor.close()
                return JsonResponse(result)

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
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )

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
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )
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
                cursor = connection.cursor(dictionary=True)
                cursor.execute("SELECT * FROM `db`.`Thread` WHERE `Thread`.`course_id` = %s", (request.GET.get('courseid'),))
                rows = cursor.fetchall()
                resultList = []
                if rows:
                    for row in rows:
                        resultList.append({
                            'thread_id': row['thread_id'],
                            'case_id': row['case_id'],
                            'course_id': row['course_id'],
                            'date_updated': row['date_updated'],
                            'request_type': row['request_type'], 
                            'complex_case': row['complex_case'],
                            'current_status': row['current_status'],
                            'assignment_id': row['assignment_id'],
                        })
                cursor.close()
                return JsonResponse({
                    'threads': resultList
                })

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
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )
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

def get_user_enrollment(request):
    '''
    GET /api/data/user/enrollment/
    Request body:
    {
        'course_id': int
        'user_id': int
    }
    Returns enrollment_role
    '''
    if len(request.GET) == 2:
        connection = mysql.connector.connect(
            host="db",
            port="3306",
            user="root",
            password="admin"
        )
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM `db`.`Enrollment` WHERE `Enrollment`.course_id = %s AND `Enrollment`.user_id = %s", (request.GET.get('courseid'), request.GET.get('userid')))
        row = cursor.fetchone()
        if row:
            result = {
                "enrollment_role": row['enrollment_role']
            }
            cursor.close()
            return JsonResponse(result)
        return JsonResponse({'message': 'Invalid request.'}, status=400)

    return JsonResponse({'message': 'Invalid request.'}, status=500)

def get_user_endpoint(request, user_id):
    '''
    GET /api/data/user/{user_id}/
    Valid parameter combinations:
        - ?courseid
    '''
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )
    validate_headers(request)

    if len(request.GET) == 0:
        cursor = connection.cursor(dictionary=True)
        # Query the User table
        cursor.execute("SELECT * FROM `db`.`User` WHERE `User`.user_id = %s", (user_id,))
        user_data = cursor.fetchone()

        if user_data:
            # Create the JSON structure
            result = {
                "user_id": user_data['user_id'],
                "name": user_data['name'],
                "first_name": user_data['first_name'],
                "last_name": user_data['last_name'],
                "email": user_data['email'],
                "email_preference": user_data['email_preference'],
                "darkmode_preference": user_data['darkmode_preference'],
            }
            return JsonResponse(result)

        if not user_data:
            return JsonResponse({'message': "Data wasn't able to be pulled, try again."}, status=400)

    if len(request.GET) == 1 and request.GET.get('courseid'):
        if check_param_not_integer(request.GET.get('courseid')):
            return JsonResponse({'message': 'Invalid request.'}, status=400)
        if not check_param_not_integer(request.GET.get('courseid')):
            # Some join magic between course, enrollment, and user
            cursor = connection.cursor(dictionary=True)

            # Query the Enrollment table to get enrolled courses for the user
            cursor.execute("SELECT (course_id, course_name, course_code) FROM `db`.`Course INNER JOIN `db`.`Enrollment` ON `db`.`Course`.course_id = `db`.`Enrollment`.course_id WHERE `db`.`Enrollment`.user_id = %s", (user_id, ))
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
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )
    if len(request.GET) == 1:
        if request.GET.get('aaps') and request.GET.get('aaps').lower() == 'true':
            # Get all files that are AAPs from database
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM `db`.`File` WHERE `File`.user_id = %s AND `File`.request_id IS NULL", (user_id,))
            rows = cursor.fetchall()
            files_list = []
            if rows:
                for row in rows:
                    file_data = base64.b64encode(row['file']).decode()
                    files_list.append({
                        'file_name': row['file_name'],
                        'file_type': row['file_type'],
                        'file_data': file_data 
                    })
            return JsonResponse({'aaps': files_list})
        if request.GET.get('requestid'):
            # Get all files that are AAPs from database
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM `db`.`File` WHERE `File`.user_id = %s AND request_id = %s", (user_id, request.GET.get('requestid')))
            rows = cursor.fetchall()
            files_list = []
            if rows:
                for row in rows:
                    file_data = base64.b64encode(row['file']).decode()
                    files_list.append({
                        'file_name': row['file_name'],
                        'file_type': row['file_type'],
                        'file_data': file_data 
                    })
            return JsonResponse({'supportingDocs': files_list})
    if not len(request.GET) == 1:
        return JsonResponse({'message': 'Invalid request.'}, status = 400)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)

@csrf_exempt
def post_new_case(request):
    '''
    Handle POST request to create a new case.

    Parameters:
    - request: Django HttpRequest object.

    Returns:
    - JsonResponse: JSON response indicating the success of the request or an error message.
    '''
    if request.method == 'POST':
        connection = mysql.connector.connect(
            host="db",
            port="3306",
            user="root",
            password="admin"
        )
        data = json.loads(request.body)
        cursor = connection.cursor()
        user_id = data.get("user_id")
        cursor.execute("INSERT INTO `db`.`Case` (user_id) VALUES (%s)", (user_id,))
        case_id = cursor.lastrowid
        for request_data in data.get("requests"):
            cursor.execute("INSERT INTO `db`.`Thread` (case_id, course_id, date_updated, request_type, complex_case, current_status, assignment_id) VALUES (%s, %s, %s, %s, %s, %s, %s)", (case_id, request_data['course_id'], request_data['date_created'], request_data['request_type'], 0, "PENDING", request_data['assignment_id']))
            thread_id = cursor.lastrowid
            cursor.execute("INSERT INTO `db`.`Request` (thread_id, date_created, request_content, instructor_notes) VALUES (%s, %s, %s, %s)", (thread_id, request_data['date_created'], request_data['request_content'], ""))
        connection.commit()
        cursor.close()
        return JsonResponse({"message": "Case created successfully"}, status=201)
    return JsonResponse({'message': 'Invalid request.'}, status=400)

@csrf_exempt
def post_file(request):
    '''
    POST /api/data/files/upload/
    Check API for request body
    '''
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )
    # Some request body validation code idk
    if request.method == 'POST':
        # Create a cursor to interact with the database
        cursor = connection.cursor()
        cursor.execute(f"USE {DATABASE_NAME}")
        # Extract data from the JSON
        user_id = request.POST.get('user_id')
        file_type = 'AAP'
        file_data = request.FILES['file'].read()
        file_name = request.FILES['file'].name
        cursor = connection.cursor()
        cursor.execute(f"USE {DATABASE_NAME}")
        insert_query = (
            "INSERT INTO db.File "
            "(file, file_name, user_id, request_id, file_type) "
            "VALUES (%s, %s, %s, %s, %s)"
        )
        cursor.execute(insert_query, (file_data, file_name, user_id, None, file_type))
        connection.commit()
        return JsonResponse({"message": "Uploaded successfully"}, status = 201)
    if not request.method == 'POST':
        return JsonResponse({'message': 'Invalid request.'}, status = 400)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)

@csrf_exempt
def put_preferences(request):
    """
    Handle PUT request to update course preferences.

    Parameters:
    - request: Django HttpRequest object.

    Returns:
    - JsonResponse: JSON response indicating the success of the request.
    """
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )
    if request.method != 'PUT':
        return JsonResponse({'message': 'Invalid request.'}, status=400)

    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON in the request body.")

        cursor = connection.cursor()
        cursor.execute(f"USE {DATABASE_NAME}")

        cursor.execute("""
            UPDATE CoursePreferences
            SET
                global_extension_length = CASE 
                    WHEN %s != -1 THEN %s
                    ELSE global_extension_length
                END,
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
        """, (data['global_extension_length'], data['general_tutor'], data['extension_tutor'],
              data['quiz_tutor'], data['remark_tutor'], data['other_tutor'], data['general_scoord'],
              data['extension_scoord'], data['quiz_scoord'], data['remark_scoord'], data['other_scoord'],
              data['general_reject'], data['extension_approve'], data['extension_reject'],
              data['quiz_approve'], data['quiz_reject'], data['remark_approve'], data['remark_reject'],
              data['coursepreference_id'], data['course_id']))

        # Commit the changes
        connection.commit()
        cursor.close()
        return JsonResponse({"message": "Course preferences updated successfully"}, status=201)

@csrf_exempt
def put_req_response(request):
    '''
    PUT /api/data/requests/respond/
    For query/other:
    {
        "request_id":1,
        "instructor_notes": ":o",
        "status": "APPROVED"
    }
    For extension/quizcode/remark:
    {
        "request_id":1,
        "assignment_id":1,
        "instructor_notes": ":o",
        "status": "APPROVED",
        "extended_by": 4
    }
    '''
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )
    if request.method == 'PUT':
        data = json.loads(request.body)
        all_fields = ["request_id", "instructor_notes", "status"]
        extension_fields = [
            "request_id", 
            "assignment_id", 
            "instructor_notes", 
            "status", 
            "extended_by"
        ]
        data_keys = list(data.keys())
        if data_keys in (all_fields, extension_fields):
            return HttpResponseBadRequest("Request body does not have correct fields")

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
                return JsonResponse(
                    {"message": "Due date is null. Cannot extend assignment."},
                    status=400
                )

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
    }
    '''
    if request.method == 'PUT':
        connection = mysql.connector.connect(
            host="db",
            port="3306",
            user="root",
            password="admin"
        )
        cursor = connection.cursor()
        data = json.loads(request.body)
        cursor.execute("UPDATE `db`.`Thread` SET `Thread`.complex_case = CASE WHEN complex_case = 0 THEN 1 WHEN complex_case = 1 THEN 0 ELSE complex_case END WHERE `Thread`.thread_id = %s", (data.get('thread_id'),))
        connection.commit()
        cursor.close()
        return JsonResponse({
            "message": "Updated successfully"
        }, status = 201)
    if not request.method == 'PUT':
        return JsonResponse({'message': 'Invalid request.'}, status = 400)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)

@csrf_exempt
def put_user_preferences(request):
    '''
    PUT /api/data/user/
    Request body is
    {
        "user_id": 0,
        "email_preference": 0,
        "darkmode_preference": 1
    }
    '''
    if request.method == 'PUT':
        connection = mysql.connector.connect(
            host="db",
            port="3306",
            user="root",
            password="admin"
        )
        cursor = connection.cursor()
        data = json.loads(request.body)
        cursor.execute("UPDATE `db`.`User` SET email_preference = %s, darkmode_preference = %s WHERE `User`.user_id = %s", (data.get('email_preference'), data.get('darkmode_preference'), data.get('user_id')) )
        connection.commit()
        cursor.close()
        return JsonResponse({'message': 'Has been set successfully'}, status = 201)
    if not request.method == 'PUT':
        return JsonResponse({'message': 'Invalid request.'}, status = 400)
    return JsonResponse({'message': 'Invalid request.'}, status = 500)

def get_assessment_preferences(request, assignment_id):
    '''
    GET /api/data/preferences/{assignment_id}
    No parameters
    '''

    if not request.GET:
        connection = mysql.connector.connect(
            host="db",
            port="3306",
            user="root",
            password="admin"
        )
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM `db`.`AssignmentExtensionLength` WHERE `AssignmentExtensionLength`.assignment_id = %s", (assignment_id,))
        row = cursor.fetchone()
        if row:
            result = {
                "extension_length": row['extension_length']
            }
            cursor.close()
            return JsonResponse(result)
        return JsonResponse({'message': 'Invalid request.'}, status = 400)

    if request.GET:
        return JsonResponse({'message': 'Invalid request.'}, status = 400)

    return JsonResponse({'message': 'Invalid request.'}, status = 500)

@csrf_exempt
def put_assessment_preferences(request):
    '''
    PUT /api/data/assessments/setpreferences
    Request body
    {
        "coursepreference_id": 0,
        "assignment_id": 0,
        "extension_length": 0
    }
    '''

    if request.method == 'PUT':
        connection = mysql.connector.connect(
            host="db",
            port="3306",
            user="root",
            password="admin"
        )
        cursor = connection.cursor(dictionary=True)
        data = json.loads(request.body)
        cursor.execute("UPDATE `db`.`AssignmentExtensionLength` SET extension_length = %s WHERE `AssignmentExtensionLength`.coursepreference_id = %s, `AssignmentExtensionLength`.assignment_id = %s", (data.get('extension_length'), data.get('coursepreference_id'), data.get('assignment_id')))
        connection.commit()
        cursor.close()
        return JsonResponse({'message': 'Has been set successfully'}, status = 201)

    if not request.method == 'PUT':
        return JsonResponse({'message': 'Invalid request.'}, status = 500)

    return JsonResponse({'message': 'Invalid request.'}, status = 500)

@csrf_exempt
def delete_file(request):
    '''
    DELETE a file
    '''
    if request.method == 'DELETE':
        data = json.loads(request.body)
        connection = mysql.connector.connect(
            host="db",
            port="3306",
            user="root",
            password="admin"
        )
        cursor = connection.cursor()
        cursor.execute("DELETE FROM `db`.`File` WHERE `File`.file_name = %s", (data.get('filename'),))
        connection.commit()
        cursor.close()
        return JsonResponse({'message': 'Has been set successfully'}, status = 201)

    return JsonResponse({'message': 'Invalid request.'}, status = 500)
