import requests as rq
import csv

def fetch_all_courses(base_url_courses, headers, params):
    all_courses = []

    while base_url_courses:
        response_courses = rq.get(base_url_courses, headers=headers, params=params)
        
        if response_courses.status_code == 200 and response_courses.text:
            data_courses = response_courses.json()
            
            for course in data_courses:
                if 'id' in course and 'name' in course:
                    all_courses.append((course['id'], course['name']))
            
            if 'next' in response_courses.links:
                base_url_courses = response_courses.links['next']['url']
            else:
                
                base_url_courses = None

        else:
            print(f"Error course {response_courses.status_code}: {response_courses.text}")
            # break

    return all_courses

def fetch_assignments_for_course(course_id, headers, params):
    base_url_assignments = f'https://canvas.instructure.com/api/v1/courses/{course_id}/assignments'
    all_assignments = []
    while base_url_assignments:
        response_assignments = rq.get(base_url_assignments, headers=headers, params=params)
        
        if response_assignments.status_code == 200 and response_assignments.text:
            data_assignments = response_assignments.json()
            
            for assignment in data_assignments:
                if 'id' in assignment and 'name' in assignment:
                    all_assignments.append((assignment['id'], assignment['name'], assignment.get('due_at', None)))
            
            if 'next' in response_assignments.links:
                base_url_assignments = response_assignments.links['next']['url']
            else:
                base_url_assignments = None
        else:
            print(f"Error assignment {response_assignments.status_code}: {response_assignments.text}")
            # break
        
        
    return all_assignments

def get_enrolled_users_with_roles(course_id, headers):
    base_url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/enrollments?per_page=10000000"
    all_enrollments = []
    fetched_urls = set()
    # while base_url:
    print(f"Fetching from URL: {base_url}")
    if base_url in fetched_urls:
        print("URL already fetched. Breaking loop.")
        # break
    response = rq.get(base_url, headers=headers)
        
    if response.status_code == 200:
        data = response.json()
        if not data:
            base_url = None
            # break

        for enrollment in data:
            all_enrollments.append((enrollment['id'], enrollment['role']))

        # Add the fetched URL to the set
        fetched_urls.add(base_url) 

        # Goes through pagination pages
        # if 'next' in response.links:
        #     base_url = response.links['next']['url']
        #     print(f"Next URL: {base_url}")
        # else:
        #     base_url = None
        #     print("No next URL. Terminating loop.")

    else:
        print(f"Error fetching roles {response.status_code}: {response.text}")
        # break
    return all_enrollments

if __name__ == "__main__":
    base_url_courses = 'https://canvas.instructure.com/api/v1/courses?enrollment_state=active'

    # Change Bearer to ur own canvas token
    headers = {
        "Authorization": "Bearer 7~D6SPVJZl0mgsxnz1oxcNNgVghEc9I8x8gO0cLRNMbMfi8Ht2cOrypwmgsuorqyWR"
    }

    # Change ID to ur own student ID
    params = {
        "per_page": 100,
        "id": 1250945
    }

    all_courses = fetch_all_courses(base_url_courses, headers, params)

    # Create or overwrite the CSV file
    with open('canvas_data.csv', 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)
        
        # Write headers to the CSV
        csv_writer.writerow(['Course ID', 'Course Name', 'Assignment ID', 'Assignment Name', 'Due Date', 'User ID', 'Role'])

        for course_id, course_name in all_courses:
            all_assignments = fetch_assignments_for_course(course_id, headers, params)
            all_users = get_enrolled_users_with_roles(course_id, headers)

            for assignment_id, assignment_name, due_date in all_assignments:
                for user_id, role in all_users:
                    # Writing data row by row
                    csv_writer.writerow([course_id, course_name, assignment_id, assignment_name, due_date, user_id, role])


