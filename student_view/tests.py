"""
Tests for student view
"""

# from django.test import TestCase

# fake data to play with before DB connected
usr1 = {
    'user_id': 1,
    'first_name': 'Jun',
    'last_name': 'Youn',
    'email': 'blahblah@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}
usr2 = {
    'user_id': 2,
    'first_name': 'James',
    'last_name': 'La Fontaine',
    'email': 'bingbong@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}

# fake user 1's cases
case11 = {
    'caseID' : 11,
    'users_user_id' : 1,
    'Date_created': "11-09-2023 03:50:09",
    'Date_updated': "10-10-2023 16:01:59",
}
case12 = {
    'caseID' : 12,
    'users_user_id' : 1,
    'Date_created': "01-12-2023 03:50:09",
    'Date_updated': "12 -11-2023 16:01:59",
}

# fake user 2's cases
case21 = {
    'caseID' : 21,
    'users_user_id' : 2,
    'Date_created': "01-19-2023 03:50:09",
    'Date_updated': "13-20-2023 16:01:59",
}
case22 = {
    'caseID' : 22,
    'users_user_id' : 2,
    'Date_created': "30-02-2023 03:50:09",
    'Date_updated': "05-10-2023 16:01:59",
}