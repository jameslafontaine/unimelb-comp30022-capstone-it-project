import requests as rq

# Function to fetch all active courses from Canvas based on the Bearer token
# If token is admin level authorization, it will fetch more courses
def fetch_all_courses(headers, params):
    all_courses = []
    base_url = 'https://canvas.instructure.com/api/v1/courses?enrollment_state=active'
    
    # Loop until there are no more courses to fetch
    while base_url:
        response = rq.get(base_url, headers=headers, params=params)
        
        if response.status_code == 200 and response.text:
            data = response.json()
            
            # Loop through each course in the response
            for course in data:
                # Check if the course has both 'id' and 'name' fields
                if 'id' in course and 'name' in course:
                    # Append course ID and name to the all_courses list
                    all_courses.append((course['id'], course['name']))
            
            # Check if there are more courses to fetch due to pagination
            if 'next' in response.links:
                base_url = response.links['next']['url']
            else:
                base_url = None

    return all_courses

# Function to get all enrolled users with their roles for a specific course
def get_enrolled_users_with_roles(course_id, headers):
    base_url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/enrollments?per_page=10000000"
    all_enrollments = []
    fetched_urls = set()

    print(f"Fetching from URL: {base_url}")
    if base_url in fetched_urls:
        print("URL already fetched. Breaking loop.")
    response = rq.get(base_url, headers=headers)
        
    if response.status_code == 200:
        data = response.json()
        if not data:
            base_url = None

        # Loop through each enrollment in the response
        for enrollment in data:
            enrollmentName = enrollment['role']
            if (enrollmentName == "StudentEnrollment"):
                enrollmentName = "Student"
            if (enrollmentName == "TeacherEnrollment"):
                enrollmentName = "Subject Coordinator"
            if (enrollmentName == "TAEnrollment"):
                enrollmentName = "Tutor"
            all_enrollments.append((enrollment['user_id'], enrollmentName))

        # Add the fetched URL to the set
        fetched_urls.add(base_url)

    else:
        print(f"Error fetching roles {response.status_code}: {response.text}")
    return all_enrollments

# Main
if __name__ == "__main__":
    headers = {
        "Authorization": "Bearer 7~I922O0TAC0vKRh89bhZp36BzuzhLIpFnQ7bQlA8j2ZokvGVI1kplOD7m1cpII3Oo"
    }

    params = {
        "per_page": 100
    }

    # Fetch all active courses
    all_courses = fetch_all_courses(headers, params)

    # Loop through each course
    for course_id, course_name in all_courses:
        # Fetch enrolled users with roles for the current course
        all_users = get_enrolled_users_with_roles(course_id, headers)

        # Loop through each user and print their details
        for user_id, role in all_users:
            print(f"Course ID: {course_id}, Course Name: {course_name}, User ID: {user_id}, Role: {role}")
