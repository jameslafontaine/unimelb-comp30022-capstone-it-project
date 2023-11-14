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
    except mysql.connector.Error:
        return False

def mock_database():
    connection = mysql.connector.connect(
        host="db",
        port="3306",
        user="root",
        password="admin"
    )

    cursor = connection.cursor()

    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    cursor.execute("TRUNCATE TABLE `db`.`Course`")
    cursor.execute("TRUNCATE TABLE `db`.`Enrollment`")
    cursor.execute("TRUNCATE TABLE `db`.`User`")
    cursor.execute("TRUNCATE TABLE `db`.`Assignment`")
    cursor.execute("TRUNCATE TABLE `db`.`CoursePreferences`")
    cursor.execute("TRUNCATE TABLE `db`.`Thread`")
    cursor.execute("TRUNCATE TABLE `db`.`Case`")
    cursor.execute("TRUNCATE TABLE `db`.`Request`")
    cursor.execute("TRUNCATE TABLE `db`.`File`")
    cursor.execute("ALTER TABLE `db`.`Course` MODIFY `course_id` int NOT NULL AUTO_INCREMENT")
    cursor.execute("ALTER TABLE `db`.`Enrollment` MODIFY `enrollment_id` int NOT NULL AUTO_INCREMENT")
    cursor.execute("ALTER TABLE `db`.`User` MODIFY `user_id` int NOT NULL AUTO_INCREMENT")
    cursor.execute("ALTER TABLE `db`.`Assignment` MODIFY `assignment_id` int NOT NULL AUTO_INCREMENT")
    cursor.execute("ALTER TABLE `db`.`CoursePreferences` MODIFY `coursepreference_id` int NOT NULL AUTO_INCREMENT")
    cursor.execute("ALTER TABLE `db`.`Thread` MODIFY `thread_id` int NOT NULL AUTO_INCREMENT")
    cursor.execute("ALTER TABLE `db`.`Case` MODIFY `case_id` int NOT NULL AUTO_INCREMENT")
    cursor.execute("ALTER TABLE `db`.`Request` MODIFY `request_id` int NOT NULL AUTO_INCREMENT")
    cursor.execute("ALTER TABLE `db`.`File` MODIFY `file_id` int NOT NULL AUTO_INCREMENT")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")

    # User - Student
    cursor.execute("INSERT INTO `db`.`User` (name, first_name, last_name, email, email_preference, darkmode_preference) VALUES (%s, %s, %s, %s, %s, %s)", ("Jun Youn", "Jun", "Youn", "testemail@email.com", 0, 1))
    # User - Tutor
    cursor.execute("INSERT INTO `db`.`User` (name, first_name, last_name, email, email_preference, darkmode_preference) VALUES (%s, %s, %s, %s, %s, %s)", ("Callum Sharman", "Callum", "Sharman", "testemail@email.com", 0, 0))
    # User - Subject Coordinator
    cursor.execute("INSERT INTO `db`.`User` (name, first_name, last_name, email, email_preference, darkmode_preference) VALUES (%s, %s, %s, %s, %s, %s)", ("Ryan Goh", "Ryan", "Goh", "testemail@email.com", 0, 0))

    # IT Project
    cursor.execute("INSERT INTO `db`.`Course` (course_name, course_code) VALUES (%s, %s)", ("IT Project", "COMP30022_2023_SM2"))
    cursor.execute("INSERT INTO `db`.`CoursePreferences` (course_id, global_extension_length, general_tutor, extension_tutor, quiz_tutor, remark_tutor, other_tutor, general_scoord, extension_scoord, quiz_scoord, remark_scoord, other_scoord, general_reject, extension_approve, extension_reject, quiz_approve, quiz_reject, remark_approve, remark_reject) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (1, 3, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, "General reject", "Extension approve", "Extension reject", "", "", "", ""))
    cursor.execute("INSERT INTO `db`.`Assignment` (course_id, assignment_name, assignment_type, assignment_weightage, start_date, due_date) VALUES (%s,%s,%s,%s,%s,%s)", (1, "Progress Assessment 1", "submission", 15, "2023-08-14 09:00:00", "2023-09-03 23:59:59"))
    cursor.execute("INSERT INTO `db`.`AssignmentExtensionLength` (coursepreference_id, assignment_id, extension_length) VALUES (%s, %s, %s)", (1, 1, 3))
    cursor.execute("INSERT INTO `db`.`Assignment` (course_id, assignment_name, assignment_type, assignment_weightage, start_date, due_date) VALUES (%s,%s,%s,%s,%s,%s)", (1, "Progress Assessment 2", "submission", 15, "2023-08-14 09:00:00", "2023-09-30 23:59:59"))
    cursor.execute("INSERT INTO `db`.`AssignmentExtensionLength` (coursepreference_id, assignment_id, extension_length) VALUES (%s, %s, %s)", (1, 2, 3))
    cursor.execute("INSERT INTO `db`.`Assignment` (course_id, assignment_name, assignment_type, assignment_weightage, start_date, due_date) VALUES (%s,%s,%s,%s,%s,%s)", (1, "Progress Assessment 3", "submission", 15, "2023-08-14 09:00:00", "2023-10-24 23:59:59"))
    cursor.execute("INSERT INTO `db`.`AssignmentExtensionLength` (coursepreference_id, assignment_id, extension_length) VALUES (%s, %s, %s)", (1, 3, 3))
    cursor.execute("INSERT INTO `db`.`Enrollment` (course_id, user_id, enrollment_role) VALUES (%s, %s, %s)", (1, 1, "STUDENT"))
    cursor.execute("INSERT INTO `db`.`Enrollment` (course_id, user_id, enrollment_role) VALUES (%s, %s, %s)", (1, 2, "TUTOR"))
    cursor.execute("INSERT INTO `db`.`Enrollment` (course_id, user_id, enrollment_role) VALUES (%s, %s, %s)", (1, 3, "SCOORD"))

    # Models of Computation
    cursor.execute("INSERT INTO `db`.`Course` (course_name, course_code) VALUES (%s, %s)", ("Models of Computation", "COMP30026_2023_SM2"))
    cursor.execute("INSERT INTO `db`.`CoursePreferences` (course_id, global_extension_length, general_tutor, extension_tutor, quiz_tutor, remark_tutor, other_tutor, general_scoord, extension_scoord, quiz_scoord, remark_scoord, other_scoord, general_reject, extension_approve, extension_reject, quiz_approve, quiz_reject, remark_approve, remark_reject) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, "General reject", "Extension approve", "Extension reject", "Quiz approve", "Quiz reject", "", ""))
    cursor.execute("INSERT INTO `db`.`Assignment` (course_id, assignment_name, assignment_type, assignment_weightage, start_date, due_date) VALUES (%s,%s,%s,%s,%s,%s)", (2, "Week 1 Quiz", "submission", 1, "2023-07-24 09:00:00", "2023-08-01 23:59:59"))
    cursor.execute("INSERT INTO `db`.`AssignmentExtensionLength` (coursepreference_id, assignment_id, extension_length) VALUES (%s, %s, %s)", (2, 4, 3))
    cursor.execute("INSERT INTO `db`.`Assignment` (course_id, assignment_name, assignment_type, assignment_weightage, start_date, due_date) VALUES (%s,%s,%s,%s,%s,%s)", (2, "Assignment 1", "submission", 1, "2023-08-10 09:00:00", "2023-08-24 23:59:59"))
    cursor.execute("INSERT INTO `db`.`AssignmentExtensionLength` (coursepreference_id, assignment_id, extension_length) VALUES (%s, %s, %s)", (2, 5, 3))
    cursor.execute("INSERT INTO `db`.`Enrollment` (course_id, user_id, enrollment_role) VALUES (%s, %s, %s)", (2, 1, "STUDENT"))
    cursor.execute("INSERT INTO `db`.`Enrollment` (course_id, user_id, enrollment_role) VALUES (%s, %s, %s)", (2, 2, "SCOORD"))
    cursor.execute("INSERT INTO `db`.`Enrollment` (course_id, user_id, enrollment_role) VALUES (%s, %s, %s)", (2, 3, "TUTOR"))


    # Modern Applied Statistics
    cursor.execute("INSERT INTO `db`.`Course` (course_name, course_code) VALUES (%s, %s)", ("Modern Applied Statistics", "MAST30025_2023_SM2"))
    cursor.execute("INSERT INTO `db`.`Assignment` (course_id, assignment_name, assignment_type, assignment_weightage, start_date, due_date) VALUES (%s,%s,%s,%s,%s,%s)", (3, "Assignment 1", "submission", 14, "2023-08-02 09:00:00", "2023-08-14 23:59:59"))
    cursor.execute("INSERT INTO `db`.`Assignment` (course_id, assignment_name, assignment_type, assignment_weightage, start_date, due_date) VALUES (%s,%s,%s,%s,%s,%s)", (3, "Assignment 2", "submission", 7, "2023-08-26 09:00:00", "2023-09-15 23:59:59"))
    cursor.execute("INSERT INTO `db`.`Assignment` (course_id, assignment_name, assignment_type, assignment_weightage, start_date, due_date) VALUES (%s,%s,%s,%s,%s,%s)", (3, "Assignment 3", "submission", 12, "2023-09-30 09:00:00", "2023-10-05 23:59:59"))
    cursor.execute("INSERT INTO `db`.`Assignment` (course_id, assignment_name, assignment_type, assignment_weightage, start_date, due_date) VALUES (%s,%s,%s,%s,%s,%s)", (3, "Assignment 4", "submission", 17, "2023-10-15 09:00:00", "2023-10-30 23:59:59"))
    cursor.execute("INSERT INTO `db`.`Enrollment` (course_id, user_id, enrollment_role) VALUES (%s, %s, %s)", (3, 1, "STUDENT"))

    connection.commit()


    print("Database has been populated with test data")


if __name__ == "__main__":
    input_host = sys.argv[1]
    input_port = sys.argv[2]
    input_user = sys.argv[3]
    input_password = sys.argv[4]

    while not is_db_ready(input_host, input_port, input_user, input_password):
        time.sleep(1)

    # THIS
    mock_database()

    # Start the Django server
    os.system("python manage.py runserver 0.0.0.0:8000")
