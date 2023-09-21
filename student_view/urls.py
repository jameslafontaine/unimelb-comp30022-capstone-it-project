from django.urls import path
from .views import *

urlpatterns = [
    path('', home_view, name='home'),
    path('submit-req/', submit_req_view, name='subimt-req'),
    path('cases/', cases_view, name='cases'),
    path('AAPs/', aaps_view, name='AAPs'),

    path('view-req/<int:id>/', view_req_view, name='view-req'),
]