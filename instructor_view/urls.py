"""
Django endpoints defined for isntructor view
"""

from django.urls import path
from .views import * # i know i know i know. Ill change it later blah blah

urlpatterns = [
    path('', home_view, name='home'),
    path('iWebHeader/', instructor_web_header_view, name='iWeb_header'),
    path('not-found-404/', not_found_view, name='not_found_view'),
    path('review-req/<int:thread_id>/', review_req_view, name='review-req'),
    path('view-reqs/<int:id>', view_reqs_view, name='view-reqs'),
    path('view-resolved/<int:thread_id>/', view_resolved_view, name='view-resolved'),
    path('subject-settings/<int:input_id>/', subj_settings_view, name='subject-settings'),
    path('view-profile/<int:user_id>/', view_profile_view, name='view-profile'),

    # GET REQUESTS
    path('get-user-id/', get_user_id, name='get_id'),
    path('get-threads-pending/<int:course_id>', get_threads_pending, name='get_threads_pending'),
    path('get-threads-resolved/<int:course_id>', get_threads_resolved, name='get_threads_resolved'),
    path('get-student-details/<int:thread_id>', get_student_details, name='get_student_details'),

    # POST REQUESTS
    path('AAP/', instructor_add_aap, name='add_AAP'),

    # PUT REQUESTS
    path('request-response/<int:thread_id>', request_response, name='request_response'),
    path('settings/', change_settings, name='change_settings'),
    path('set-user-id/<int:input_id>', set_user_id, name='set_user_id'),
]
