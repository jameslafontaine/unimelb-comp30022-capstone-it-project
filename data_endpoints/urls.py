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

urlpatterns = [
    
    # GET requests
    path('assessments/', get_assessments_endpoint, name = 'get_assessments'),
    path('cases/', get_cases_endpoint, name = 'get_cases'),
    path('courses/', get_courses_endpoint, name = 'get_courses'),
    path('requests/', get_requests_endpoint, name = 'get_requests'),
    path('thread/', get_threads_user_endpoint, name = 'get_threads_user'),
    path('thread/<int:thread_id>/', get_threads_endpoint, name='get_threads'),
    path('user/<int:user_id>/', get_user_endpoint, name = 'get_user'),

]
