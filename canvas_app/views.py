"""
Django views shared between all apps.
"""

import json
from .tests import *

def get_user_aaps(request, user_id):
    return JsonResponse({
        'aaps': json.dumps([aap1,aap2,aap3,aap4])
    })

def get_course_data(request, course_code):
    print(course_code)
    if(course_code == 'COMP30022'):
        return JsonResponse(course31)
    elif(course_code == 'COMP30023'):
        return JsonResponse(course32)
    elif(course_code == 'COMP30019'):
        return JsonResponse(course41)
    elif(course_code == 'COMP30026'):
        return JsonResponse(course42)
    
