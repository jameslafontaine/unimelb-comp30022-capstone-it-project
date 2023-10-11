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
from .views import get_id
from .views import add_aap
from .views import make_complex
from .views import request_response
from .views import change_settings
from .views import set_user_id

urlpatterns = [
    path('', home_view, name='home'),
    path('iWebHeader/', instructor_web_header_view, name='iWeb_header'),

    path('not-found-404/', not_found_view, name='not_found_view'),

    path('review-req/<int:id>/', review_req_view, name='review-req'),
    path('view-reqs/', view_reqs_view, name='view-reqs'),
    path('view-resolved/<int:id>/', view_resolved_view, name='view-resolved'),
    path('subject-settings/<int:id>/', subj_settings_view, name='subject-settings'),
    path('view-profile/<int:id>/', view_profile_view, name='view-profile'),

    # GET REQUESTS
    path('courses/<int:user_id>', get_courses, name='get_courses'),
    path('request-status/<int:request_id>', get_request_status, name='get_request_status'),
    path('request/<int:request_id>', get_request, name='get_request'),
    path('old-versions/<int:request_id>', get_old_versions, name='get_old_versions'),
    path('get-subject-settings/<int:subject_id>', get_subject_settings, 
         name='get_subject_settings'),
    path('AAP/<int:aap_id>', get_aap, name='get_AAP'),
    path('request-history/<int:student_id>', get_request_history, name='get_request_history'),

    path('get-user-id/', get_id, name='get_id'),

    # POST REQUESTS
    path('AAP/', add_aap, name='add_AAP'),

    # PUT REQUESTS
    path('set-complex/<int:request_id>', make_complex, name='make_complex'),
    path('request-response/<int:request_id>', request_response, name='request_response'),
    path('settings/', change_settings, name='change_settings'),
    path('set-user-id/<int:id>', set_user_id, name='set_user_id'),
]
