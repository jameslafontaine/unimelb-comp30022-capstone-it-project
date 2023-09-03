import requests as rq

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
                base_url = None

    return all_courses

def get_enrolled_users_with_roles(course_id, headers):
    base_url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/enrollments?per_page=10000000"
    all_enrollments = []
    fetched_urls = set()

    print(f"Fetching from URL: {base_url}")
    if base_url in fetched_urls:
        print("URL already fetched. Breaking loop.")
        # break
    response = rq.get(base_url, headers=headers)
        
    if response.status_code == 200:
        data = response.json()
        if not data:
            base_url = None

        for enrollment in data:
            all_enrollments.append((enrollment['id'], enrollment['role']))

        fetched_urls.add(base_url)

    else:
        print(f"Error fetching roles {response.status_code}: {response.text}")
    return all_enrollments

if __name__ == "__main__":
    headers = {
        "Authorization": "Bearer 7~OcYkQYb52NI19cPauyXWRa0FAfO66YCg3iGBu9yEFudIiGcCnNT1IPfkXhNm7MmC"
    }

    params = {"per_page": 100}
    all_courses = fetch_all_courses(headers, params)

    for course_id, course_name in all_courses:
        # Fetch enrolled users with roles
        all_users = get_enrolled_users_with_roles(course_id, headers)

        for user_id, role in all_users:
            # Printing data
            print(f"Course ID: {course_id}, Course Name: {course_name}, User ID: {user_id}, Role: {role}")
