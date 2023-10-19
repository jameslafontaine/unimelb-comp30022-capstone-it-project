"""
Request and Query Management System - Testing Suite
Unit Tests
"""

import requests
from instructor_view.tests import course1


#
# Instructor View tests
#

def test_instructor_view_get_courses():
    '''
    GET courses
    Testing:
        - /instructor/courses/<id>
    Acceptance criteria:
        - Matches expected output
    '''
    response = requests.get('http://localhost:8000/instructor/courses/1', timeout = 5)
    assert response.status_code == 200, "/instructor/courses/<id> doesn't work"
    assert response.json() == {"courses": json.dumps([course1, course1])}
