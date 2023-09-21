from django.urls import path
from .views import *

urlpatterns = [
    path('', home_view, name='home'),
    path('review-req/<int:id>/', review_req_view, name='review-req'),
    path('view-reqs/', view_reqs_view, name='view-reqs'),
    path('subject-settings/<int:id>/', subj_settings_view, name='subject-settings'),
    path('view-profile/<int:id>/', view_profile_view, name='view-profile'),
]