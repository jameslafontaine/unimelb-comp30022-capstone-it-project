import requests as rq
import csv
import mysql.connector

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


def fetch_all_courses(headers, params):
    all_courses = []
    base_url = 'https://canvas.instructure.com/api/v1/courses?enrollment_state=active'
    while base_url:
        response = rq.get(base_url, headers=headers, params=params)
        
        if response.status_code == 200 and response.text:
            data = response.json()
            
            for course in data:
                if 'id' in course and 'name' in course:
                    all_courses.append((course['id'], course['name']))
            
            if 'next' in response.links:
                base_url = response.links['next']['url']
            else:
                base_url_courses = None

        else:
            print(f"Error course {response_courses.status_code}: {response_courses.text}")

    return all_courses

if __name__ == "__main__":
    base_url_courses = 'https://canvas.lms.unimelb.edu.au/api/v1/courses?enrollment_state=active'

    headers = {
        "Authorization": "Bearer 7~I922O0TAC0vKRh89bhZp36BzuzhLIpFnQ7bQlA8j2ZokvGVI1kplOD7m1cpII3Oo"
    }

# My own canvas token 14227~g6rgxGuwlxxgjmMXiJMFZuit1veba6GebZsNpyzzV0ND9YJc06xyUctR9GlIe82x
    params = {
        "per_page": 100,
        "id": 1250945
    }

    all_courses = fetch_courses(base_url_courses, headers, params)

    #sql stuff
    cursor = connection.cursor()

    table_name = "`mydb`.`course (subject)`"
    data_to_upload = all_courses

    insert_query = f"INSERT INTO {table_name} VALUES (%s, %s)"

    cursor.executemany(insert_query, data_to_upload)

    # Commit the changes to the database
    connection.commit()

    cursor.close()
    connection.close()