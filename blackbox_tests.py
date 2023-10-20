"""
Request and Query Management System - Testing suite
Blackbox tests
"""

import requests

def test_docker_compose_up():
    '''
    Testing:
        - MySQL instance is running
        - Django instance is running
    Acceptance criteria:
        - Django is able to be pinged.
          This implies both instances started successfully
    '''
    response = requests.get('http://localhost:8000', timeout = 5, verify = False)
    assert response.status_code == 200, "BB test #1 failed"
