import requests as rq

# Retrieve Courses of a specific User using their token (Does not require userID)
def fetch_all_courses(headers, params):
    all_courses = []
    base_url = 'https://canvas.instructure.com/api/v1/courses?enrollment_state=active'
    response = rq.get(base_url, headers=headers, params=params)
        
    if response.status_code == 200 and response.text:
        data = response.json()
            
        for course in data:
            if 'id' in course and 'name' in course:
                all_courses.append((course['id'], course['name']))
            
            if 'next' in response.links:
                base_url = response.links['next']['url']

    else:
        print(f"Error course {response.status_code}: {response.text}")

    return all_courses

if __name__ == "__main__":

    headers = {
        "Authorization": "Bearer 7~I922O0TAC0vKRh89bhZp36BzuzhLIpFnQ7bQlA8j2ZokvGVI1kplOD7m1cpII3Oo"
    }

# My own canvas token 14227~g6rgxGuwlxxgjmMXiJMFZuit1veba6GebZsNpyzzV0ND9YJc06xyUctR9GlIe82x
    params = {
        "per_page": 100,
    }

    all_courses = fetch_all_courses(headers, params)
    for course_id, name in all_courses:
        print(f"Course ID: {course_id}, Name: {name}")
