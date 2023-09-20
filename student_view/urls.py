from django.urls import path
from .views import *

urlpatterns = [
    path('', home_view, name='home'),
    path('submit_req/', submit_req_view, name='subimt_req'),
    path('cases/', cases_view, name='cases'),
    path('AAPs/', aaps_view, name='AAPs'),
]