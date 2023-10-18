"""
Django endpoints defined for isntructor view
"""

from django.urls import path
from .views import home_view
from .views import instructor_web_header_view
from .views import not_found_view
from .views import review_req_view
from .views import view_reqs_view
from .views import view_resolved_view
from .views import view_profile_view
from .views import subj_settings_view
from .views import get_courses
from .views import get_request_status
from .views import get_request
from .views import get_old_versions
from .views import get_subject_settings
from .views import get_aap
from .views import get_request_history
from .views import get_user_id
from .views import instructor_add_aap
from .views import make_complex
from .views import request_response
from .views import change_settings
from .views import set_user_id
from .views import * # i know i know i know. Ill change it later blah blah

urlpatterns = [
    path('', home_view, name='home'),
    path('iWebHeader/', instructor_web_header_view, name='iWeb_header'),

    path('not-found-404/', not_found_view, name='not_found_view'),

    path('review-req/<int:thread_id>/', review_req_view, name='review-req'),
    path('view-reqs/<int:id>', view_reqs_view, name='view-reqs'),
    path('view-resolved/<int:input_id>/', view_resolved_view, name='view-resolved'),
    path('subject-settings/<int:input_id>/', subj_settings_view, name='subject-settings'),
    path('view-profile/<int:input_id>/', view_profile_view, name='view-profile'),

    # GET REQUESTS
    path('courses/<int:user_id>', get_courses, name='get_courses'),
    path('request-status/<int:request_id>', get_request_status, name='get_request_status'),
    path('request/<int:request_id>', get_request, name='get_request'),
    path('old-versions/<int:request_id>', get_old_versions, name='get_old_versions'),
    path('get-subject-settings/<int:subject_id>', get_subject_settings,
         name='get_subject_settings'),
    path('AAP/<int:aap_id>', get_aap, name='get_AAP'),
    path('request-history/<int:student_id>', get_request_history, name='get_request_history'),


    path('get-user-id/', get_user_id, name='get_id'),
    path('threads/<int:course_id>', get_threads, name='get_threads'),
    path('get-threads-pending/<int:course_id>', get_threads_pending, name='get_threads_pending'),
    path('get-threads-resolved/<int:course_id>', get_threads_resolved, name='get_threads_resolved'),
    path('get-student-details/<int:thread_id>', get_student_details, name='get_student_details'),
    path('get-pref-from-thread/<int:thread_id>', get_pref_from_thread, name='get_pref_from_thread'),

    # POST REQUESTS
    path('AAP/', instructor_add_aap, name='add_AAP'),

    # PUT REQUESTS
    path('set-complex/<int:thread_id>', make_complex, name='make_complex'),
    path('request-response/<int:request_id>', request_response, name='request_response'),
    path('settings/', change_settings, name='change_settings'),
    path('set-user-id/<int:input_id>', set_user_id, name='set_user_id'),
]
