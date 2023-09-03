import requests as rq

def retrieveAssignments(course_id, headers):
    base_url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/assignments"
    all_assignments = []

    response = rq.get(base_url, headers=headers)
        
    if response.status_code == 200:
        data = response.json()
        
        for assignment in data:
            assignment_id = assignment.get('id', '')
            assignment_name = assignment.get('name', '')
            due_date = assignment.get('due_at', '')
            start_date = assignment.get('created_at', '')
            assignment_type = assignment.get('submission_types', '')
            assignment_weightage = assignment.get('points_possible', '')

            all_assignments.append((assignment_id, assignment_name, assignment_type, assignment_weightage, due_date, start_date))

    return all_assignments