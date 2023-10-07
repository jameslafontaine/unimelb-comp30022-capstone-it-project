"""
Python script that checks for if db has been initialised, then runs the Django application
"""

import os
import sys
import time
import mysql.connector

def is_db_ready(host, port, user, password):
    """Pings the db and checks if db is ready"""
    try:
        connection = mysql.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password
        )
        return connection.is_connected()
    except:
        return False

if __name__ == "__main__":
    input_host = sys.argv[1]
    input_port = sys.argv[2]
    input_user = sys.argv[3]
    input_password = sys.argv[4]

    while not is_db_ready(input_host, input_port, input_user, input_password):
        time.sleep(1)

    print("Database is ready")

    # Start the Django server
    os.system("python manage.py runserver 0.0.0.0:8000")
