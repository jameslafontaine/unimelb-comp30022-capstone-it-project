"""
URL configuration for canvasApp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from login.views import login_view
from .views import * 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', login_view, name='login'),
    path('instructor/', include('instructor_view.urls')),
    path('student/', include('student_view.urls')),
    path('api/data/', include('data_endpoints.urls')),

    # GET REQUESTS (shared between all apps)
    path('get-user-aaps/<int:user_id>', get_user_aaps, name='get_user_aaps'),
    path('get-course-data/<str:course_code>', get_course_data, name='get_course_data'),
]
