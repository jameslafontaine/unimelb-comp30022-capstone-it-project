"""
URLs for student view
"""

from django.urls import path
from .views import home_view
from .views import submit_req_view
from .views import * # idc this is faster

urlpatterns = [
    path('', home_view, name='home'),
    path('sWebHeader/', student_web_header_view, name='sWeb_header'),
    path('submit-req/', submit_req_view, name='subimt-req'),
    path('cases/', cases_view, name='cases'),
    path('AAPs/', aaps_view, name='AAPs'),
    path('view-req/<int:thread_id>', view_req_view, name='view-req'),
    path('edit-req/<int:thread_id>', edit_req_view, name='edit-req'),

    # GET REQUESTS
    path('get-user-id/', get_user_id, name='get_id'),
    path('active-cases/', get_active_cases, name='get_active_cases'),
    path('active-cases/<int:user_id>/', get_active_cases, name='get_active_cases'),
    path('get-all-cases/', get_all_cases, name='get_all_cases'),
    path('get-active-courses/', get_active_courses, name='get_active_courses'),

    # PUT REQUESTS
    path('set-user-id/<int:input_id>', set_user_id, name='set_user_id'),
]
