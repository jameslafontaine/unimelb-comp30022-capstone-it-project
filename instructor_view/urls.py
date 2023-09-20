from django.urls import path
from .views import *

urlpatterns = [
    path('', home_view, name='home'),
    path('review_req/', review_req_view, name='review_req'),
    path('view_reqs/', view_reqs_view, name='view_reqs'),
]