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
]
