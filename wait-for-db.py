import os
import sys
import time
import mysql.connector

def is_db_ready(host, port, user, password):
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
    host = sys.argv[1]
    port = sys.argv[2]
    user = sys.argv[3]
    password = sys.argv[4]

    while not is_db_ready(host, port, user, password):
        time.sleep(1)

    print("Database is ready")

    # Start the Django server
    os.system("python manage.py runserver 0.0.0.0:8000")