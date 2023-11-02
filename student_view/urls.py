"""
URLs for student view
"""

from django.urls import path
from .views import home_view
from .views import student_web_header_view
from .views import submit_req_view
from .views import cases_view
from .views import aaps_view
from .views import view_req_view
from .views import edit_req_view

urlpatterns = [
    path('', home_view, name='home'),
    path('sWebHeader/', student_web_header_view, name='sWeb_header'),
    path('submit-req/', submit_req_view, name='subimt-req'),
    path('cases/', cases_view, name='cases'),
    path('AAPs/', aaps_view, name='AAPs'),
    path('view-req/<int:thread_id>', view_req_view, name='view-req'),
    path('edit-req/<int:thread_id>', edit_req_view, name='edit-req'),
]
