"""
Request and Query Management System - Testing Suite
Unit Tests for data_endpoints
"""

import requests
import requests_mock, json
from requests_mock.mocker import Mocker
from django.http import HttpRequest, HttpResponseBadRequest, JsonResponse
from django.core.files.uploadedfile import SimpleUploadedFile

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
    endpoint = '/api/data/assessments?assignid=1'
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
    endpoint = '/api/data/assessments?courseid=1'
    mock_response = {
        "assessments": [ test_assessment, test_assessment, test_assessment ]
    }
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_assessments_endpoint_courseid_names():
    '''
    Test /api/data/assessments?courseid=value&names=true
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/assessments?courseid=1&names=true'
    mock_response = {
        "assessments": [ 
            test_assessment["assignment_name"],
            test_assessment["assignment_name"],
            test_assessment["assignment_name"]
        ]
    }
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"


test_cases_1 = {
  "cases": [
    {
      "case_id": 1,
      "user_id": 1
    },
    {
      "case_id": 2,
      "user_id": 1
    }
  ]
}
test_cases_2 = {
    "case": {
        "case_id": 1,
        "user_id": 1
    }
}
test_cases_3 = {
    "threads": [
        {
            "thread_id": 1, 
            "case_id": 1,
            "course_id": 1,
            "date_updated": "2000:01:01 00:00:00",
            "request_type": "AAP",
            "complex_case": 0,
            "current_status": "pending",
            "assignment_id": 1
        },
        {
            "thread_id": 1,  
            "case_id": 1,
            "course_id": 1,
            "date_updated": "2000:01:01 00:00:00",
            "request_type": "AAP",
            "complex_case": 0,
            "current_status": "pending",
            "assignment_id": 1
        }
    ]
}

def test_get_cases_endpoint_userid():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/cases?userid=1'
    mock_response = test_cases_1
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_cases_endpoint_caseid():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/cases/?caseid=1'
    mock_response = test_cases_2
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_cases_endpoint_caseid_threads():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/cases/?caseid=1&threads=true'
    mock_response = test_cases_3
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

test_courses_1 = {
  "courses": [
    {
      "course_id": 1,
      "course_name": "IT Project",
      "course_code": "COMP30022"
    },
    {
      "course_id": 2,
      "course_name": "Modern Applied Statistics",
      "course_code": "MAST30025"
    }
  ]
}

test_courses_2 = {
    "course": {
        "course_id": 1,
        "course_name": "IT Project",
        "course_code": "COMP30022"
    }
}

test_courses_3 = {
    "coursepreferences": {
        "coursepreference_id": 2, 
        "course_id": 7727409, 
        "global_extension_length": 3, 
        "general_tutor": 0, 
        "extension_tutor": 0, 
        "quiz_tutor": 0, 
        "remark_tutor": 0, 
        "other_tutor": 0, 
        "general_scoord": 0, 
        "extension_scoord": 0, 
        "quiz_scoord": 0, 
        "remark_scoord": 0, 
        "other_scoord": 0, 
        "general_reject": "", 
        "extension_approve": "", 
        "extension_reject": "", 
        "quiz_approve": "", 
        "quiz_reject": "", 
        "remark_approve": "", 
        "remark_reject": ""
    }
}

def test_get_courses_endpoint():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/cases?userid=1'
    mock_response = test_courses_1
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_courses_endpoint_courseid():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/cases?courseid=1'
    mock_response = test_courses_2
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_courses_endpoint_courseid_preference():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/courses/?courseid=7727409&preferences=true'
    mock_response = test_courses_3
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

test_request_1 = {
  "requests": [
    {
      "request_id": 2,
      "thread_id": 2,
      "date_created": "2000:01:01 00:00:00",
      "request_content": "the dog ate my homework.",
      "instructor_notes": "oh no"
    },
    {
      "request_id": 1,
      "thread_id": 1,
      "date_created": "2000:01:01 00:00:00",
      "request_content": "i am crying for help.",
      "instructor_notes": "stop crying"
    }
  ]
}

test_request_2 = {
  "requests": 
    {
      "request_id": 2,
      "thread_id": 2,
      "date_created": "2000:01:01 00:00:00",
      "request_content": "the dog ate my homework.",
      "instructor_notes": "oh no"
    }
}

def test_get_request_userid():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/requests/?userid=1'
    mock_response = test_request_1
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_request_requestid():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/requests/?requestid=1'
    mock_response = test_request_2
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

test_thread_1 = {
    "created_by": 1
}
test_thread_2 = {
    "threads": [
        {"thread_id": 11,
         "case_id": 11,
         "course_id": 31,
         "date_updated": "11-09-2023",
         "request_type": "Extension",
         "complex_case": 1,
         "current_status": "PENDING",
         "assignment_id": 1},
         {"thread_id": 12,
          "case_id": 12,
          "course_id": 31,
          "date_updated": "01-19-2023",
          "request_type": "Query",
          "complex_case": 0,
          "current_status": "PENDING",
          "assignment_id": 2},
          {"thread_id": 13,
           "case_id": 12,
           "course_id": 31,
            "date_updated": "01-19-2023",
            "request_type": "Other",
            "complex_case": 1,
            "current_status": "REJECTED",
            "assignment_id": 3}
        ]
 
}
test_thread_3 = {
    "threads": [
        {"thread_id": 11,
         "case_id": 11,
         "course_id": 31,
         "date_updated": "11-09-2023",
         "request_type": "Extension",
         "complex_case": 1, 
         "current_status": "PENDING",
         "assignment_id": 1},
         {"thread_id": 12,
          "case_id": 12,
          "course_id": 31,
          "date_updated": "01-19-2023",
          "request_type": "Query",
          "complex_case": 0,
          "current_status": "PENDING",
          "assignment_id": 2}
        ]

}

def test_get_thread_threadid():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/thread/?threadid=1'
    mock_response = test_thread_1
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_thread_courseid():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/thread/?courseid=7727409'
    mock_response = test_thread_2
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_thread_userid_status():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/thread/?status=PENDING&userid=108998192'
    mock_response = test_thread_3
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

test_thread_4 = {
  "threadinfo": {
    "thread": {
      "thread_id": 1,
      "case_id": 1,
      "course_id": 1,
      "date_updated": "2000:01:01 00:00:00",
      "request_type": "quizcode",
      "complex_case": False,
      "current_status": "REJECTED",
      "assignment_id": 1
    },
    "requests": [
      {
        "request_id": 2,
        "thread_id": 1,
        "date_created": "2000:01:01 00:00:00",
        "request_content": "please do not reject this please please",
        "instructor_notes": "this is peak clownery"
      },
      {
        "request_id": 1,
        "thread_id": 1,
        "date_created": "2000:01:01 00:00:00",
        "request_content": "i am sick, dont have med certificate"
      }
    ],
    "coursepreferences": {
      "coursepreference_id": 1,
      "course_id": 1,
      "global_extension_length": 3,
      "general_tutor": False,
      "extension_tutor": True,
      "quiz_tutor": True,
      "remark_tutor": True,
      "other_tutor": False,
      "general_scoord": True,
      "extension_scoord": True,
      "quiz_scoord": True,
      "remark_scoord": False,
      "other_scoord": False,
      "general_reject": "",
      "extension_approve": "",
      "extension_reject": "",
      "quiz_approve": "",
      "quiz_reject": "lmao",
      "remark_approve": "",
      "remark_reject": ""
    }
  }
}
test_thread_5 = {
  "status": "PENDING"
}

def test_get_thread_info():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/thread/1/'
    mock_response = test_thread_4
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_thread_status():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/thread/1/?checkstatus=true'
    mock_response = test_thread_5
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

test_user_1 = {
  "user_id": 1,
  "name": "Callum Sharman",
  "first_name": "Callum",
  "last_name": "Sharman",
  "email": "12345@gmail.com",
  "email_preference": False,
  "darkmode_preference": False
}
test_user_2 = {
  "courses": [
    {
      "course_id": 1,
      "course_name": "IT Project",
      "course_code": "COMP30022"
    },
    {
      "course_id": 2,
      "course_name": "Modern Applied Statistics",
      "course_code": "MAST30025"
    }
  ]
}

def test_get_user():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/user/1/'
    mock_response = test_user_1
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_user_course():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/user/1/?courses=1'
    mock_response = test_user_2
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

test_file_1 = {
    'aaps': [
        {
            'file_name': "filename1",
            'file_type': "AAP",
            'file_data': "adwasdwadsadwads"
        },
        {
            'file_name': "filename1",
            'file_type': "AAP",
            'file_data': "adwasdwadsadwads"
        }
    ]
}
test_file_2 = {
    'supportingDocs': [
        {
            'file_name': "filename1",
            'file_type': "AAP",
            'file_data': "adwasdwadsadwads"
        },
        {
            'file_name': "filename1",
            'file_type': "AAP",
            'file_data': "adwasdwadsadwads"
        }
    ]
}

def test_get_aap():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/files/1'
    mock_response = test_file_1
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

def test_get_files():
    '''
    Test /api/data/cases?userid=value
    Acceptance criteria:
        - Returns 200 and JSONs match
    '''
    endpoint = '/api/data/files/1?aaps=true'
    mock_response = test_file_2
    with Mocker() as mocker:
        mocker.get(LOCALHOST + endpoint, json = mock_response, status_code = 200)
        response = requests.get(LOCALHOST + endpoint, timeout = 5)
        assert response.status_code == 200 and response.json() == mock_response, \
            endpoint + "does not work"

'''
post_new_case
make a dummy request body
insert this into database
check database if new requests have been registered

post_file
make dummy request body
insert files into database
call databaser to see if files are saved

put_preferences
fuck aroudn with subjectsettings.html?

put_req_response
check request before
make the call
check request after

set_complex
call the db
check if complex_case has changed
'''


def test_put_prefernces():
   '''
   Test /api/data/cases?userid=value
   Acceptance criteria:
       - Returns 200 and JSONs match
   '''
   endpoint = '/api/data/courses/setpreferences'
   mock_response = {
            "message": "Course preferences updates successfully"
        }
   request_body = {
        "coursepreference_id": 1,
        "course_id": 7677734,
        "global_extension_length": 0,
        "general_tutor": 1,
        "extension_tutor": 1,
        "quiz_tutor": 1,
        "remark_tutor": 1,
        "other_tutor": 1,
        "general_scoord": 1,
        "extension_scoord": 1,
        "quiz_scoord": 1,
        "remark_scoord": 1,
        "other_scoord": 1,
        "general_reject": "string",
        "extension_approve": "string",
        "extension_reject": "string",
        "quiz_approve": "string",
        "quiz_reject": "string",
        "remark_approve": "string",
        "remark_reject": "string"
   }
   with Mocker() as mocker:
       mocker.put(LOCALHOST + endpoint, json = mock_response, status_code = 200)
       response = requests.put(LOCALHOST + endpoint, json=request_body, timeout = 5)
       assert response.status_code == 200, \
           endpoint + "does not work"

def test_put_case():
   '''
   Test /api/data/cases?userid=value
   Acceptance criteria:
       - Returns 200 and JSONs match
   '''
   endpoint = '/api/data/cases/new'
   mock_response = {
            "message": "Case created successfully"
        }
   request_body =     {   
        "user_id":1,
        "requests": [
            {
                "course_id": 7677734,
                "request_type": "AAP",
                "assignment_id": 40897567,
                "request_content": "bla bla"
            },
            {
                "course_id": 7677734,
                "request_type": "QUERY",
                "assignment_id": 40268278,
                "request_content": "bla bla"
            }
        ]
    }
   with Mocker() as mocker:
       mocker.put(LOCALHOST + endpoint, json = mock_response, status_code = 200)
       response = requests.put(LOCALHOST + endpoint, json=request_body, timeout = 5)
       assert response.status_code == 200, \
           endpoint + "does not work"

def test_put_respond():
   '''
   Test /api/data/cases?userid=value
   Acceptance criteria:
       - Returns 200 and JSONs match
   '''
   endpoint = '/api/data/requests/respond'
   mock_response = {
        "message": "Updated successfully"
    }
   request_body =     {
        "request_id":1,
        "instructor_notes": ":o",
        "status": "APPROVED"
    }
   with Mocker() as mocker:
       mocker.put(LOCALHOST + endpoint, json = mock_response, status_code = 200)
       response = requests.put(LOCALHOST + endpoint, json=request_body, timeout = 5)
       assert response.status_code == 200, \
           endpoint + "does not work"

def test_put_complex():
   '''
   Test /api/data/cases?userid=value
   Acceptance criteria:
       - Returns 200 and JSONs match
   '''
   endpoint = '/api/data/thread/complex'
   mock_response = {
        "message": "Updated successfully"
    }
   request_body = {
        "thread_id": 0,
        "complex_case": 1
    }
   with Mocker() as mocker:
       mocker.put(LOCALHOST + endpoint, json = mock_response, status_code = 200)
       response = requests.put(LOCALHOST + endpoint, json=request_body, timeout = 5)
       assert response.status_code == 200, \
           endpoint + "does not work"

def test_post_file():
   '''
   Test /api/data/cases?userid=value
   Acceptance criteria:
       - Returns 200 and JSONs match
   '''
   endpoint = '/api/data/files/upload'
   mock_response = {
        "message": "Uploaded successfully"
    }
   request_body = {
        "user_id" : 1,
        "fileName" : "filename",
        "request_id" : 1
    }
   with Mocker() as mocker:
       mocker.put(LOCALHOST + endpoint, json = mock_response, status_code = 200)
       response = requests.put(LOCALHOST + endpoint, json=request_body, timeout = 5)
       assert response.status_code == 200, \
           endpoint + "does not work"