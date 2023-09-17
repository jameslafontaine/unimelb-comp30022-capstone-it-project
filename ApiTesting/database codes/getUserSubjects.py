import requests as rq
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

def getUserSubjects(userID):
    cursor = connection.cursor()
    
    query = f"SELECT * FROM `course (subject)` INNER JOIN `course (subject)_has_users` ON `course (subject)`.`idCourse(subject)` = `course (subject)_has_users`.`Course (subject)_idCourse (subject)` INNER JOIN users ON `course (subject)_has_users`.`users_idusers` = users.idusers WHERE users.idusers = %s;"
    cursor.execute(query, [userID])  

    # fetch all the matching rows 
    result = cursor.fetchall()
    
    # loop through the rows
    #for row in result:
    #    print(row)
    # Commit the changes to the database
    connection.commit()
    cursor.close()
    connection.close()
    return result

if __name__ == "__main__":
    result = getUserSubjects(108998192)
    print(result)