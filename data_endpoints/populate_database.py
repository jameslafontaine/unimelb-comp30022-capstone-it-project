import json
import mysql.connector
from datetime import datetime

# Function to create threads and requests
def createThreads(request, user_ID):
    # Parse the JSON data
    data = json.loads(request)

    # Connect to the MySQL database
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="queenastrid1", # INSERT PASSWORD HERE
        database="db"
    )

    try:
        with connection.cursor() as cursor:
            # Iterate through the requests in the JSON
            for request_data in data.get("requests", []):
                cursor.execute(
                    "INSERT INTO `db`.`Case` (`user_id`) VALUES (%s)",
                    (user_ID,)
                )
                case_id = cursor.lastrowid
                # Create a new thread
                cursor.execute(
                    "INSERT INTO `db`.`Thread` (`case_id`, `course_id`, `request_type`, `complex_case`, `current_status`, `assignment_id`, `date_updated`) VALUES (%s, %s, %s, %s, %s, %s, NOW())",
                    (request_data['case_id'], request_data['course_id'], request_data['request_type'], request_data['complex_case'], request_data['current_status'], request_data['assignment_id'])
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

# Call the function with the updated JSON data and user ID
jsondata = '''
{
    "requests" : [{
        "request_content": "leave",
        "instructor_notes": "notes",
        "request_type": "e",
        "complex_case": 1,
        "current_status": "pending",
        "course_id": 7677734,
        "assignment_id": 40897567,
        "case_id": 1
    }, {
        "request_content": "sick",
        "instructor_notes": "notes",
        "request_type": "e",
        "complex_case": 1,
        "current_status": "pending",
        "course_id": 7677734,
        "assignment_id": 40268278,
        "case_id": 2
    }]
}
'''

user_ID = 109194991
createThreads(jsondata, user_ID)
