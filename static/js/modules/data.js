/** 
 * Author: Callum Sharman, Jun Youn
 * Date Last Modified: October 26, 2023
 * Description: Encapsulates everything surrounding data reading, writing and processing
 * In a perfect world URLs are only ever used here
 */

/**
 * INSTRUCTOR: Loads in requests, given a course from the DB, returns an array full of request JSONs
 */
function iloadThreadData(courseId){
    return loadData('/instructor/requests/' + courseId, {})
        .then(data =>{
            return JSON.parse(data.requests)
        })
}


/**
 * STUDENT: Loads in active cases from the DB, returns an array full of case JSONs
 */
function sloadActiveCasesData(){
    return loadData('/api/data/cases/?userid=' + getGlobalAppHeadersValue('user_id'), {})
        .then(data => {
            return data.cases;
        })
}

/**
 * STUDENT: Loads in threads from case id from the DB, returns an array full of case JSONs
 */
function sloadThreadsData(caseId){
    return loadData('/api/data/cases/?caseid=' + caseId + '&threads=true', {})
        .then(data => {
            return data.threads;
        })

}

/**
 * GENERIC: Loads in requests from thread id from the DB, returns an array full of case JSONs
 */
function loadRequestsData(threadId){
    return loadData('/api/data/thread/' + threadId, {})
        .then(data => {
            return data.threadinfo.requests;
        })

}

/**
 * GENERIC: Loads in a thread from thread id from the DB, returns JSON
 */
function loadThread(threadId){
    return loadData('/api/data/thread/' + threadId, {})
        .then(data => {
            return data.threadinfo.thread;
        })
}

/**
 * GENERIC: Loads in a course from course id from the DB, returns JSON
 */
function loadCourse(courseId){
    return loadData('/api/data/courses/?courseid=' + courseId, {})
        .then(data => {
            return data.course;
        })
}

/**
 * GENERIC: Loads in an assignment from assignment id from the DB, returns JSON
 */
function loadAssignment(assignId){
    return loadData('/api/data/assessments/?assignid=' + assignId, {})
        .then(data => {
            return data;
        })
}

/**
 * GENERIC: Generates a list of "previous versions" of a request
 */
function getPreviousVersions(threadId){
    return loadRequestsData(threadId)
        .then(requests => {
            // cuts off the first request (current request)
            return requests.splice(1);
        })
}

/**
 * INSTRUCTOR: Gets a list of all requests "awaiting action" from a courseId
 */
function iloadThreadsPending(courseId){
    return loadData('/api/data/thread/?courseid=' + courseId, {})
        .then(data => {
            return data.threads.filter(thread => (thread.course_id == courseId) && (thread.current_status == "PENDING") );
        })
}

/**
 * INSTRUCTOR: Gets a list of all "resolved" requests from a courseId
 */
function iloadThreadsResolved(courseId){
    return loadData('/api/data/thread/?courseid=' + courseId, {})
        .then(data => {
            return data.threads.filter(thread => (thread.course_id == courseId) && ((thread.current_status == "APPROVED") || (thread.current_status == "REJECTED")));
        })
}

/**
 * INSTRUCTOR: Gets a list of all requests "awaiting action" from a userId
 */
function iloadThreadsPendingFromUser(userId){
    return loadData('/api/data/thread/?userid=' + userId + '&status=pending', {})
        .then(data => {
            return data.threads;
        })
}

/**
 * INSTRUCTOR: Gets a list of all "resolved" requests from a userId
 */
function iloadThreadsResolvedFromUser(userId){
    return loadData('/api/data/thread/?userid=' + userId + '&status=resolved', {})
        .then(data => {
            return data.threads;
        })
}

/**
 * INSTRUCTOR: Gets student details from a threadId
 */
function iloadStudentDetails(threadId){
    return loadData('/api/data/thread/?threadid=' + threadId, {})
        .then(data => {
            return data.student;
        })
}

/**
 * INSTRUCTOR: Redirect to student profile
 */
function redirectToProfile(threadId){
    iloadStudentDetails(threadId)
        .then(student => {
            window.location.href = '/instructor/view-profile/' + student.user_id; 
        })
}

/**
 * INSTRUCTOR: Redirect to home
 */
function redirectHome(){
    window.location.href = '/instructor/';
}

/**
 * INSTRUCTOR: Redirects to a view reqs page for a course
 */
function redirectToViewReqs(courseId){
    window.location.href = '/instructor/view-reqs/' + courseId;
}

/**
 * INSTRUCTOR: Get course preferences from threadId
 */
function iloadCoursePreferenceFromThread(threadId){
    return loadData('/api/data/thread/' + threadId, {})
        .then(data => {
            return data.threadinfo.coursepreferences;
        })
}

/**
 * INSTRUCTOR: Sets a thread to complex if non-complex, sets it to non if complex. Returns true on success, false otherwise
 */
function setComplex(threadId){
    return putData(('/api/data/thread/complex'), {
        "thread_id": threadId
    })
        .then(() => {
            return true;
        })
        .catch(error => {
            console.error('There was a problem setting the complex status:', error);
            return false;
        });
}

/** 
 * GENERIC: Returns the latest request from the given thread id
 */
function getLatestRequest(thread_id) {
    return loadRequestsData(thread_id)
        .then(requests => {
            return requests[0];
        })
}

/**
 * INSTRUCTOR: Respond to a request, in the request specify response, notes, etc.
 */
function respond(threadId, response){
    return putData('/api/data/requests/respond/', {
        "thread_id": threadId,
        "response": response
    })
        .then(responseData => {
            return true;
        })
        .catch(error => {
            console.error('There was a problem responding to the request:', error);
            return false;
        });
}

/**
 * GENERIC: Returns user details from a user id
 */
function loadUserDetails(userId){
    return loadData('/api/data/user/' + userId, {})
        .then(data => {
            return data;
        })
}

/**
 * GENERIC: Returns a given users aaps
 */
function loadUserAAPs(userId){
    return loadData('/api/data/files/' + userId + '?aaps=true', {})
        .then(data => {
            return data.aaps;
        })
}

/**
 * GENERIC: GET all assessments for a course
 */
function getCourseAssessments(courseId) {
    return loadData('/api/data/assessments/?courseid=' + courseId + '&names=true', {})
        .then(data => {
            return data.assessments;
        });
}

/**
 * GENERIC: GET course data from a course code
 */
function getCourseData() {
    return loadData('/api/data/courses/?userid=' + getGlobalAppHeadersValue('user_id'), {})
        .then(data => {
            return data.courses;
        })
}

/**
 * GENERIC: get assignments from a courseId
 */
function getAssignments(courseId){
    return loadData('/api/data/assessments/?courseid=' + courseId, {})
        .then(data => {
            return data.assessments;
        })
}

/**
 * STUDENT: POSTs a new case to the database
 */
function postNewCase(dataToSend){
    return postData(('/api/data/requests/respond/'), dataToSend)
        .then(() => {
            return true;
        })
        .catch(error => {
            console.error('There was a problem responding to the request:', error);
            return false;
        });
}

/**
 * STUDENT: Redirects to the edit request page from a threadId
 */
function redirectToEditReq(threadId){
    window.location.href = '/student/edit-req/' + threadId;
}
