import requests as rq
import mysql.connector
from datetime import datetime

# Replace these values with your MySQL server details
host = "localhost"
user = "root"
password = "-" #INSERT password here
database = "mydb"

# Create a connection
connection = mysql.connector.connect(
    host=host,
    user=user,
    password=password,
    database=database
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
    
def retrieveAssignments(course_id, headers):
    base_url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/assignments"
    all_assignments = []

    response = rq.get(base_url, headers=headers)
        
    if response.status_code == 200:
        data = response.json()
        
        for assignment in data:
            assignment_id = assignment.get('id', '')
            assignment_name = assignment.get('name', '')
            due_date = assignment.get('due_at', '')
            start_date = assignment.get('created_at', '')
            assignment_type = assignment.get('submission_types', '')
            assignment_weightage = assignment.get('points_possible', '')

            all_assignments.append((assignment_id, assignment_name, assignment_type, assignment_weightage, due_date, start_date))

    return all_assignments

def get_user_details(user_id, headers):
    base_url = f"https://canvas.instructure.com/api/v1/users/{user_id}"
    response = rq.get(base_url, headers=headers)
    
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

    print(f"Fetching from URL: {base_url}")
    if base_url in fetched_urls:
        print("URL already fetched. Breaking loop.")
    response = rq.get(base_url, headers=headers)
        
    if response.status_code == 200:
        data = response.json()
        if not data:
            base_url = None

        # Loop through each enrollment in the response
        for enrollment in data:
            enrollmentName = enrollment['role']
            if (enrollmentName == "StudentEnrollment"):
                enrollmentName = "Student"
            if (enrollmentName == "TeacherEnrollment"):
                enrollmentName = "Subject Coordinator"
            if (enrollmentName == "TAEnrollment"):
                enrollmentName = "Tutor"
            all_enrollments.append((enrollment['user_id'], enrollmentName, enrollment['user']['name']))
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
                    all_courses.append((course['id'], course['name']))
            
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
        "per_page": 100,
        "id": 1250945
    }

    all_courses = fetch_courses(base_url_courses, headers, params)

    #populate courses table
    cursor = connection.cursor()
    table_name = "`mydb`.`course (subject)`"
    data_to_upload = all_courses
    insert_query = f"INSERT INTO {table_name} VALUES (%s, %s)"
    cursor.execute(f"SET FOREIGN_KEY_CHECKS = 0")
    cursor.execute(f"TRUNCATE TABLE {table_name}")
    cursor.execute(f"TRUNCATE TABLE `mydb`.`course (subject)_has_users`")
    cursor.execute(f"TRUNCATE TABLE `mydb`.`users`")
    cursor.execute(f"TRUNCATE TABLE `mydb`.`assignments`")
    cursor.execute(f"SET FOREIGN_KEY_CHECKS = 1")

    #upload all courses
    cursor.executemany(insert_query, data_to_upload)
    
    #loop through each course to get users
    for course_id, course_name in all_courses:
        # Fetch enrolled users with roles for the current course
        all_users = get_enrolled_users_with_roles(course_id, headers)

        #add assignments to course
        all_assignments = retrieveAssignments(course_id,headers)
        for assignmentsID, name, type, weightage, start_date, end_date in all_assignments:
            if start_date is not None:
                start_date = convert_to_mysql_datetime(start_date)
            if end_date is not None:
                end_date = convert_to_mysql_datetime(end_date)
            type = ''.join([str(item) for item in type])
            query = f"INSERT INTO `mydb`.`assignments` VALUES (%s, %s, %s, %s, %s, %s)"
            tuple1 = (type, weightage, end_date, start_date, assignmentsID, course_id)
            cursor.execute(query, tuple1)   
        
        
        # Loop through each user and print their details
        for user_id, role, name in all_users:
            #print(f"Course ID: {course_id}, Course Name: {course_name}, User ID: {user_id}, Role: {role}, Name: {name}")
            #insert into users table
            query = f"INSERT IGNORE INTO `mydb`.`users` VALUES (%s, %s, %s, %s, %s, %s)"

            # To retrieve user details using the user_id
            user_details = get_user_details(user_id, headers)
            print(user_details)
            if user_details:
                first_name = user_details.get('first_name', '')
                last_name = user_details.get('last_name', '')
                email = user_details.get('email', '')
            tuple1 = (user_id, name, first_name, last_name, email, role)
            cursor.execute(query, tuple1)   

            #insert into junction table
            query = f"INSERT INTO `mydb`.`course (subject)_has_users` VALUES (%s, %s)"
            tuple1 = (course_id, user_id)
            cursor.execute(query, tuple1)   


    # execute your query
    cursor.execute(f"SELECT * FROM `mydb`.`users`")
    
    # fetch all the matching rows 
    result = cursor.fetchall()
    
    # loop through the rows
    for row in result:
        print(row)
    # Commit the changes to the database
    connection.commit()

    cursor.close()
    connection.close()

    

