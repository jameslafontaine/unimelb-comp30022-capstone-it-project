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
from .views import subj_settings_view
from .views import view_profile_view

urlpatterns = [
    path('', home_view, name='home'),
    path('iWebHeader/', instructor_web_header_view, name='iWeb_header'),
    path('not-found-404/', not_found_view, name='not_found_view'),
    path('review-req/<int:thread_id>/', review_req_view, name='review-req'),
    path('view-reqs/<int:input_id>', view_reqs_view, name='view-reqs'),
    path('view-resolved/<int:thread_id>/', view_resolved_view, name='view-resolved'),
    path('subject-settings/<int:input_id>/', subj_settings_view, name='subject-settings'),
    path('view-profile/<int:user_id>/', view_profile_view, name='view-profile'),
]
