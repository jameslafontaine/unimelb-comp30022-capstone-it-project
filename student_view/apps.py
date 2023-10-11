"""
Apps for student view
"""

from django.apps import AppConfig

class StudentViewConfig(AppConfig):
    ''' Student view configurations '''
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'student_view'
