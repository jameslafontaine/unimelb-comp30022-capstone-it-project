import mysql.connector

# Replace these values with your MySQL server details
host = "localhost"
user = "root"
password = "-" #INSERT password here
database = "db"

# Create a connection
connection = mysql.connector.connect(
    host=host,
    user=user,
    password=password,
    database=database
)

cursor = connection.cursor()

table_name = "users"
data_to_upload = [
    ("2","Johny", "Doep", "johnydoep@example.com")
    # Add more data rows as needed
]

insert_query = f"INSERT INTO {table_name} VALUES (%s, %s, %s, %s)"

cursor.executemany(insert_query, data_to_upload)

# Commit the changes to the database
connection.commit()

cursor.close()
connection.close()