"""
Request and Query Management System - Testing Suite
Unit Tests for data_endpoints
"""

import requests
from requests_mock.mocker import Mocker


LOCALHOST = 'http://localhost:8000'

test_assessment = {
    "assignment_id": 1,
    "course_id": 1,
    "assignment_name": "Project 1",
    "assignment_type": "submission",
    "assignment_weightage": 15,
    "start_date": "2000:01:01 00:00:00",
    "end_date": "2000:01:01 00:00:00"
}

def test_get_assessments_endpoint_assignid():
    '''
    Test /api/data/assessments?assigid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/assessments?assignid=' + 1

    mock_response = test_assessment

    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_assessments_endpoint_courseid():
    '''
    Test /api/data/assessments?courseid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/assessments?courseid=' + 1

    mock_response = {
        "assessments": [ test_assessment, test_assessment, test_assessment ]
    }
          
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

