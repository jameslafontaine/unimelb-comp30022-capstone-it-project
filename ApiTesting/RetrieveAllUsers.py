import requests as rq

def fetch_all_users(course_id, headers, params):
    all_users = []
    base_url = f'https://canvas.instructure.com/api/v1/courses/{course_id}/users'
    response = rq.get(base_url, headers=headers, params=params)

    if response.status_code == 200 and response.text:
        data = response.json()
        for user in data:
            user_id = user.get('id', '')
            user_name = user.get('name', '')
            user_email = user.get('email', '')  # Note: email might not always be available

            all_users.append((user_id, user_name, user_email))
    else:
        print(f"Error {response.status_code}: {response.text}")

    return all_users

if __name__ == "__main__":
    headers = {
        "Authorization": "Bearer 7~I922O0TAC0vKRh89bhZp36BzuzhLIpFnQ7bQlA8j2ZokvGVI1kplOD7m1cpII3Oo"
    }

    params = {
        "per_page": 100
    }

    course_id = 7677734
    all_users = fetch_all_users(course_id, headers, params)

    for user_id, user_name, user_email in all_users:
        print(f"ID: {user_id}, Name: {user_name}, Email: {user_email}")
