"""
URLs for student view
"""

from django.urls import path
from .views import get_assessments_endpoint
from .views import get_cases_endpoint
from .views import get_courses_endpoint
from .views import get_requests_endpoint
from .views import get_threads_user_endpoint
from .views import get_threads_endpoint
from .views import get_user_endpoint
from .views import get_files_endpoint
from .views import post_new_case
from .views import post_file
from .views import put_preferences
from .views import put_req_response
from .views import set_complex
from .views import put_user_preferences
from .views import get_assessment_preferences
from .views import put_assessment_preferences
from .views import delete_file

urlpatterns = [
    # GET requests
    path('assessments/', get_assessments_endpoint, name = 'get_assessments'),
    path('cases/', get_cases_endpoint, name = 'get_cases'),
    path('courses/', get_courses_endpoint, name = 'get_courses'),
    path('requests/', get_requests_endpoint, name = 'get_requests'),
    path('thread/', get_threads_user_endpoint, name = 'get_threads_user'),
    path('thread/<int:thread_id>/', get_threads_endpoint, name='get_threads'),
    path('user/<int:user_id>/', get_user_endpoint, name = 'get_user'),
    path('files/<int:user_id>/', get_files_endpoint, name = 'get_files'),
    path('preferences/<int:assignment_id>/', get_assessment_preferences, \
         name = 'get_assessment_extension_length'),

    # POST requests
    path('cases/new/', post_new_case, name = 'post_new_case'),
    path('files/upload/', post_file, name = 'post_new_aap'),

    # PUT requests
    path('courses/setpreferences/', put_preferences, name = 'put_preferences'),
    path('requests/respond/', put_req_response, name = 'put_req_response'),
    path('thread/complex/', set_complex, name = 'set_complex'),
    path('user/', put_user_preferences, name = 'put_user_preferences'),
    path('assessments/setpreferences/', put_assessment_preferences, \
         name = 'put_assessment_extension_length'),

    # DELETE request
    path('files/remove/', delete_file, name = 'delete_file'),
]
