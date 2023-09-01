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
    base_url_courses = 'https://canvas.lms.unimelb.edu.au/api/v1/courses?enrollment_state=active'

    headers = {
        "Authorization": "Bearer 14227~g6rgxGuwlxxgjmMXiJMFZuit1veba6GebZsNpyzzV0ND9YJc06xyUctR9GlIe82x"
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

    

