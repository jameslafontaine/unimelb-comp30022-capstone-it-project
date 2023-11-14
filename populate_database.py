import json
import mysql.connector
import requests as rq
from datetime import datetime
from wait_for_db import is_db_ready


# Connect to the MySQL database
connection = mysql.connector.connect(
    host="db",
    port="3306",
    user="root",
    password="admin"
)

def convert_to_mysql_datetime(input_string):
    try:
        # Parse the input string into a datetime object
        input_datetime = datetime.strptime(input_string, "%Y-%m-%dT%H:%M:%SZ")

        # Convert the datetime object into MySQL datetime format
        mysql_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

        return mysql_datetime
    except ValueError:
        return None

def retrieve_assignments(course_id, headers):
    all_assignments = []
    response = rq.get(f"https://canvas.instructure.com/api/v1/courses/{course_id}/assignments", headers=headers)
    if response.status_code == 200:
        data = response.json()
        for assignment in data:
            all_assignments.append((assignment.get('id', ''),  
                                   assignment.get('course_id', ''),
                                   assignment.get('name', ''),
                                   assignment.get('submission_types', ''),
                                   assignment.get('points_possible', ''),
                                   assignment.get('created_at', ''), 
                                   assignment.get('due_at', '')))
    return all_assignments

def get_user_details(user_id, headers):
    response = rq.get(f"https://canvas.instructure.com/api/v1/users/{user_id}/profile", headers=headers)
    try: 
        response.status_code == 200
        return response.json()
    except:
        print(f"Error fetching user details {response.status_code}: {response.text}")
        return None

def get_enrolled_users_with_roles(course_id, headers):
    base_url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/enrollments?per_page=10000000"
    all_enrollments = []
    fetched_urls = set()

    response = rq.get(base_url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if not data:
            base_url = None

        # Loop through each enrollment in the response
        for enrollment in data:
            if enrollment['role'] == "StudentEnrollmet":
                enrollmentname = "STUDENT"
            elif enrollment['role'] == "TeacherEnrollment":
                enrollmentname = " SCOORD"
            elif enrollment['role'] == "TAEnrollment":
                enrollmentname = "TUTOR"
            else:
                enrollmentname = "STUDENT"
            all_enrollments.append((enrollment['id'], enrollment['user_id'], enrollmentname, enrollment['user']['name']))
        # Add the fetched URL to the set
        fetched_urls.add(base_url)

    else:
        print(f"Error fetching roles {response.status_code}: {response.text}")
    return all_enrollments

def fetch_courses(base_url_courses, headers, params):
    all_courses = []

    while base_url_courses:
        response_courses = rq.get(base_url_courses, headers=headers, params=params)

        if response_courses.status_code == 200 and response_courses.text:
            data_courses = response_courses.json()
            
            for course in data_courses:
                if 'id' in course and 'name' in course:
                    all_courses.append((course['id'], course['name'], course['course_code']))
            
            if 'next' in response_courses.links:
                base_url_courses = response_courses.links['next']['url']
            else:
                base_url_courses = None

        else:
            print(f"Error course {response_courses.status_code}: {response_courses.text}")

    return all_courses

if __name__ == "__main__":
    base_url_courses = 'https://canvas.instructure.com/api/v1/courses?enrollment_state=active'

    headers = {
        "Authorization": "Bearer 7~I922O0TAC0vKRh89bhZp36BzuzhLIpFnQ7bQlA8j2ZokvGVI1kplOD7m1cpII3Oo"
    }

    # My own canvas token 14227~g6rgxGuwlxxgjmMXiJMFZuit1veba6GebZsNpyzzV0ND9YJc06xyUctR9GlIe82x
    params = {
        "per_page": 100
    }

    all_courses = fetch_courses(base_url_courses, headers, params)

    #populate courses table
    cursor = connection.cursor()

    table_name = "`db`.`Course`"
    data_to_upload = all_courses
    insert_query = f"INSERT INTO {table_name} VALUES (%s, %s, %s)"

    cursor.execute(f"SET FOREIGN_KEY_CHECKS = 0")
    cursor.execute(f"TRUNCATE TABLE `db`.`Course`")
    cursor.execute(f"TRUNCATE TABLE `db`.`Enrollment`")
    cursor.execute(f"TRUNCATE TABLE `db`.`User`")
    cursor.execute(f"TRUNCATE TABLE `db`.`Assignment`")
    cursor.execute(f"TRUNCATE TABLE `db`.`CoursePreferences`")
    cursor.execute(f"TRUNCATE TABLE `db`.`Thread`")
    cursor.execute(f"TRUNCATE TABLE `db`.`Case`")
    cursor.execute(f"TRUNCATE TABLE `db`.`Request`")
    cursor.execute(f"TRUNCATE TABLE `db`.`File`")
    cursor.execute(f"TRUNCATE TABLE `db`.`AssignmentExtensionLength`")
    cursor.execute(f"SET FOREIGN_KEY_CHECKS = 1")

    # Upload all courses
    cursor.executemany(insert_query, data_to_upload)

    # Prepare the SQL query for inserting into the request table
    insert_request_query = "INSERT INTO `db`.`request` (request_ID, proposed_due_date, documentation_ID, content, threadID) VALUES (%s, %s, %s, %s, %s)"

    # Prepare the data to insert
    request_id = None  # This will be auto-incremented by MySQL
    proposed_due_date = "2023-09-24"  # Example date
    documentation_id = "Some binary data"  # Example data (this should be in BLOB format for actual data)
    content = "Some reason" 
    thread_id = 1  # Example threadID

    # Check if threadID exists
    cursor.execute("SELECT COUNT(*) FROM `db`.`Thread` WHERE `thread_id` = %s", (thread_id,))
    count = cursor.fetchone()[0]
    if count == 0:
        print(f"ThreadID {thread_id} does not exist in the thread table.")
    else:
        cursor.execute(insert_request_query, (request_id, proposed_due_date, documentation_id, content, thread_id))


    # Loop through each course to get users
    for course_id, course_name, course_code in all_courses:

        # Populate settings page
        cursor.execute(f"INSERT INTO `db`.`CoursePreferences` \
                         (global_extension_length, general_tutor, extension_tutor, quiz_tutor, remark_tutor, other_tutor, general_scoord, extension_scoord, quiz_scoord, remark_scoord, other_scoord, general_reject, extension_approve, extension_reject, quiz_approve, quiz_reject, remark_approve, remark_reject, course_id) \
                         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                         (3,0,0,0,0,0,0,0,0,0,0,"","","","","","","",course_id))  

        # Add assignments to course
        all_assignments = retrieve_assignments(course_id,headers)
        for assignment_id, course_id, assignment_name, assignment_type, assignment_weightage, start_date, due_date in all_assignments:
            if start_date is not None:
                start_date = convert_to_mysql_datetime(start_date)
            if due_date is not None:
                due_date = convert_to_mysql_datetime(due_date)
            cursor.execute(f"INSERT INTO `db`.`Assignment` VALUES (%s, %s, %s, %s, %s, %s, %s)", 
                          (assignment_id, course_id, assignment_name, 
                           ''.join([str(item) for item in assignment_type]), 
                           assignment_weightage, start_date, due_date))   

        # Fetch enrolled users with roles for the current course
        # Loop through each user and print their details
        all_users = get_enrolled_users_with_roles(course_id, headers)
        for enrollment_id, user_id, role, name in all_users:

            # Insert into User table
            user_details = get_user_details(user_id, headers)

            if user_details:
                first_name = user_details.get('first_name', '')
                last_name = user_details.get('last_name', '')
                email = user_details.get('primary_email', '')
            cursor.execute(f"INSERT IGNORE INTO `db`.`User` VALUES (%s, %s, %s, %s, %s, %s, %s)",
                           (user_id, name, first_name, last_name, email, 1, 0))   

            # Insert into Enrollment table
            cursor.execute(f"INSERT INTO `db`.`Enrollment` VALUES (%s, %s, %s, %s)", 
                           (enrollment_id, course_id, user_id, role))   

    # Now, fetch the global_extension_length from CoursePreferences
    cursor.execute("SELECT course_id, global_extension_length, coursepreference_id FROM `db`.`CoursePreferences`")
    course_preferences = cursor.fetchall()

    for course_id, global_extension_length, coursepreference_id in course_preferences:
        # Insert the global_extension_length into AssignmentExtensionLength for each assignment
        cursor.execute("SELECT assignment_id FROM `db`.`Assignment` WHERE course_id = %s", (course_id,))
        assignment_ids = cursor.fetchall()
        for assignment_id in assignment_ids:
            assignment_id = assignment_id[0]  # Extract the assignment_id from the tuple
            # Insert the data into AssignmentExtensionLength
            cursor.execute("INSERT INTO `db`.`AssignmentExtensionLength` (coursepreference_id, assignment_id, extension_length) VALUES (%s, %s, %s)",
                           (coursepreference_id, assignment_id, global_extension_length))


    # execute your query
    cursor.execute(f"SELECT * FROM `db`.`User`")


    # fetch all the matching rows 
    result = cursor.fetchall()

    # Commit the changes to the database
    connection.commit()
    cursor.close()
    connection.close()

