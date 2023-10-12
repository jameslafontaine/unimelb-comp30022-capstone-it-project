"""
Tests for student view
"""
# from django.test import TestCase

usr1 = {
    'user_id': 1,
    'first_name': 'Jun',
    'last_name': 'Youn',
    'email': 'blahblah@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}
# user 1's cases
case11 = {
    'caseID' : 11,
    'users_user_id' : 1,
    'Date_created': "11-09-2023 03:50:09",
    'Date_updated': "10-10-2023 16:01:59",
}
# case11 and 21's requests
req311 = {
    'request_ID': 311,
    'proposed_due_date': "11-09-2023 03:50:09",
    'documentation_ID': 876234587967986,
    'content': 'Jun ate my homework :(',
    'application_status': 'Pending',
    'threadID': 4356,
}
req312 = {
    'request_ID': 312,
    'proposed_due_date': "17-12-2023 02:55:19",
    'documentation_ID': 67456745674567,
    'content': 'Jun stole my homework from my bag and burned it',
    'application_status': 'Approved',
    'threadID': 5678, 
}

case12 = {
    'caseID' : 12,
    'users_user_id' : 1,
    'Date_created': "01-12-2023 03:50:09",
    'Date_updated': "12 -11-2023 16:01:59",
}
# case12 and 22 requests
req321 = {
    'request_ID': 321,
    'proposed_due_date': "01-19-2023 03:50:09",
    'documentation_ID': 8794325092384,
    'content': 'Im very sick *sad face*',
    'application_status': 'Pending',
    'threadID': 9009,
}
req322 = {
    'request_ID': 322,
    'proposed_due_date': "01-19-2023 03:50:09",
    'documentation_ID': 8790798709,
    'content': 'Please just give me an extension, im begging',
    'application_status': 'Rejected',
    'threadID': 8109,
}

usr2 = {
    'user_id': 2,
    'first_name': 'James',
    'last_name': 'La Fontaine',
    'email': 'bingbong@student.unimelb.edu.au',
    'email_preference': 1,
    'darkmode_preference': 1,
}
# user 2's cases
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