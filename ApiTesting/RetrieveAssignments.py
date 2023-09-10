import requests as rq

# Retrieves assignments 
def retrieveAssignments(course_id, headers, params):
    base_url = f"https://canvas.instructure.com/api/v1/courses/{course_id}/assignments"
    all_assignments = []

    response = rq.get(base_url, headers=headers, params=params)
        
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

if __name__ == "__main__":
    headers = {
        "Authorization": "Bearer 7~I922O0TAC0vKRh89bhZp36BzuzhLIpFnQ7bQlA8j2ZokvGVI1kplOD7m1cpII3Oo"
    }

    params = {"per_page": 100}
    course_id = 7677732
    all_assignments = retrieveAssignments(course_id, headers, params)
    
    # Printing the assignments
    for assignment in all_assignments:
        print(f"assignment_ID: {assignment[0]}, Name: {assignment[1]}, Type: {assignment[2]}, Points: {assignment[3]}, Due At: {assignment[4]}, Created At: {assignment[5]}")
