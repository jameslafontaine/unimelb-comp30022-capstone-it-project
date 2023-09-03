import requests as rq
import csv

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