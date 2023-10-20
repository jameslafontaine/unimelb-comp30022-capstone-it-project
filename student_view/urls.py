"""
URLs for student view
"""

from django.urls import path
from .views import home_view
from .views import submit_req_view
from .views import cases_view
from .views import aaps_view
from .views import view_req_view
from .views import get_active_cases
from .views import get_case
from .views import get_requests_from_case
from .views import get_request
from .views import get_old_versions
from .views import student_new_request
from .views import student_web_header_view
from .views import get_user_id
from .views import set_user_id

urlpatterns = [
    path('', home_view, name='home'),
    path('sWebHeader/', student_web_header_view, name='sWeb_header'),

    path('submit-req/', submit_req_view, name='subimt-req'),
    path('cases/', cases_view, name='cases'),
    path('AAPs/', aaps_view, name='AAPs'),

    path('view-req/<int:input_id>/', view_req_view, name='view-req'),

    # GET REQUESTS
    path('case/<int:case_id>/', get_case, name='get_case'),
    path('active-cases/<int:user_id>/', get_active_cases, name='get_active_cases'),
    path('requests-from-case/<int:case_id>/', get_requests_from_case,
         name='get_requests_from_case'),
    path('request/<int:request_id>/', get_request, name='get_request'),
    path('old-versions/<int:request_id>/', get_old_versions, name='get_old_versions'),

    path('get-user-id/', get_user_id, name='get_id'),

    # POST REQUESTS
    path('new-request/', student_new_request, name='new_request'),

    # PUT REQUESTS
    path('set-user-id/<int:input_id>', set_user_id, name='set_user_id'),
]
