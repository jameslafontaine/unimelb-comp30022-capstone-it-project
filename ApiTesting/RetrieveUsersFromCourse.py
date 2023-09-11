import requests as rq

# Fetch users enrolled in a specific course from Canvas
def fetch_all_users(course_id, headers, params):
    all_users = []
    base_url = f'https://canvas.instructure.com/api/v1/courses/{course_id}/users'
    response = rq.get(base_url, headers=headers, params=params)

    # Check if the response is successful and contains data
    if response.status_code == 200 and response.text:
        data = response.json()
        for user in data:
            # Extract user details using the 'get' method to handle missing fields
            user_id = user.get('id', '')
            name = user.get('name')
            user_email = user.get('email', '')

            # Append the user details to the all_users list
            all_users.append((user_id, name, user_email))
    else:
        # Print an error message if the response is not successful
        print(f"Error {response.status_code}: {response.text}")

    return all_users

# Main 
if __name__ == "__main__":
    headers = {
        "Authorization": "Bearer 7~I922O0TAC0vKRh89bhZp36BzuzhLIpFnQ7bQlA8j2ZokvGVI1kplOD7m1cpII3Oo"
    }

    params = {
        "per_page": 100
    }

    # Specific course ID for which we want to fetch users
    course_id = 7677734
    # Fetch all users enrolled in the specified course
    all_users = fetch_all_users(course_id, headers, params)

    # Loop through each user and print their details
    for user_id, name, user_email in all_users:
        print(f"ID: {user_id}, Name: {name}, Email: {user_email}")
