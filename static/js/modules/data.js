/** 
 * Author: Callum Sharman, Jun Youn
 * Date Last Modified: October 26, 2023
 * Description: Encapsulates everything surrounding data reading, writing and processing
 * In a perfect world URLs are only ever used here
 */

/**
 * GET call to 'url', returns a JSON on success 
 * (if array make sure to JSON.parse() the data needed from the string outside).
 */
function loadData(url){

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
			console.error('Error:', error);
		});
}

/**
 * PUT call to 'url' with the given json. Returns the response data
 */
function putData(url, json){

    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
        })
        .then(response => {
            if (response.ok) {
                // Parse the response JSON if successful
                return response.json();
            }
            throw new Error('Network response was not ok');
        })
        .then(data => {
            // Process the response data
            return data;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

/**
 * POST call to 'url' with the given json. Returns the response data
 */
function postData(url, json){

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
        })
        .then(response => {
            if (response.ok) {
                // Parse the response JSON if successful
                return response.json();
            }
            throw new Error('Network response was not ok');
        })
        .then(data => {
            // Process the response data
            return data;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


/**
 * GET call to 'url', returns text on success 
 * Used for situations where HTML is being retrieved
 */
function loadTextData(url){

    return fetch(url)
        .then(response => response.text())
        .then(data => {
            return data;
        })
        .catch(error => {
			console.error('Error:', error);
		});
}

/**
 * INSTRUCTOR: Loads in requests, given a course from the DB, returns an array full of request JSONs
 */
function iloadThreadData(courseId){
    return loadData('/instructor/requests/' + courseId)
        .then(data =>{
            return JSON.parse(data.requests)
        })
}

/**
 * STUDENT: Loads in active cases from the DB, returns an array full of case JSONs
 */
function sloadActiveCasesData(){
    return loadData('/student/active-cases')
        .then(data => {
            return JSON.parse(data.cases);
        })
}

/**
 * STUDENT: Loads in threads from case id from the DB, returns an array full of case JSONs
 */
function sloadThreadsData(caseId){
    return loadData('/student/get-threads/' + caseId)
        .then(data => {
            return JSON.parse(data.threads);
        })

}

/**
 * GENERIC: Loads in requests from thread id from the DB, returns an array full of case JSONs
 */
function loadRequestsData(threadId){
    return loadData('/requests-from-thread/' + threadId)
        .then(data => {
            return JSON.parse(data.requests);
        })

}

/**
 * GENERIC: Loads in a thread from thread id from the DB, returns JSON
 */
function loadThread(threadId){
    return loadData('/get-thread/' + threadId)
        .then(data => {
            return data;
        })
}

/**
 * GENERIC: Loads in a course from course id from the DB, returns JSON
 */
function loadCourse(courseId){
    return loadData('/get-course/' + courseId)
        .then(data => {
            return data;
        })
}

/**
 * GENERIC: Loads in an assignment from assignment id from the DB, returns JSON
 */
function loadAssignment(assignId){
    return loadData('/get-assignment/' + assignId)
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
    return loadData('/instructor/get-threads-pending/' + courseId)
        .then(data => {
            return JSON.parse(data.threads);
        })
}

/**
 * INSTRUCTOR: Gets a list of all "resolved" requests from a courseId
 */
function iloadThreadsResolved(courseId){
    return loadData('/instructor/get-threads-resolved/' + courseId)
        .then(data => {
            return JSON.parse(data.threads);
        })
}

/**
 * INSTRUCTOR: Gets a list of all requests "awaiting action" from a userId
 */
function iloadThreadsPendingFromUser(userId){
    return loadData('/instructor/get-threads-pending-from-user/' + userId)
        .then(data => {
            return JSON.parse(data.threads);
        })
}

/**
 * INSTRUCTOR: Gets a list of all "resolved" requests from a userId
 */
function iloadThreadsResolvedFromUser(userId){
    return loadData('/instructor/get-threads-resolved-from-user/' + userId)
        .then(data => {
            return JSON.parse(data.threads);
        })
}

/**
 * INSTRUCTOR: Gets student details from a threadId
 */
function iloadStudentDetails(threadId){
    return loadData('/instructor/get-student-details/' + threadId)
        .then(data => {
            return JSON.parse(data.student);
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
    return loadData('/instructor/get-pref-from-thread/' + threadId)
        .then(data => {
            return data;
        })
}

/**
 * INSTRUCTOR: Sets a thread to complex if non-complex, sets it to non if complex. Returns true on success, false otherwise
 */
function setComplex(threadId){
    return putData(('/instructor/set-complex/' + threadId), {})
        .then(responseData => {
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
    return putData(('/instructor/request-response/' + threadId), response)
        .then(responseData => {
            return true;
        })
        .catch(error => {
            console.error('There was a problem responding to the request:', error);
            return false;
        });
}

/**
 * STUDENT: Returns all of the users cases
 */
function getAllCases(){
    return loadData('/student/get-all-cases/')
        .then(data => {
            return JSON.parse(data.cases);
        })
}

/**
 * GENERIC: Returns user details from a user id
 */
function loadUserDetails(userId){
    return loadData('/get-user-details/' + userId)
        .then(data => {
            return data;
        })
}

/**
 * GENERIC: Returns a given users aaps
 */
function loadUserAAPs(userId){
    return loadData('/get-user-aaps/' + userId)
        .then(data => {
            return JSON.parse(data.aaps);
        })
}

/**
 * GENERIC: this will need to be changed upon canvas integration
 * Returns the logged in users id
 */
function getUserId(type){
    if(type == 'instructor'){
        return loadData('/instructor/get-user-id/')
        .then(data => {
            return data.id;
        })
    }
    else if(type == 'student'){
        return loadData('/student/get-user-id/')
        .then(data => {
            return data.id;
        })
    }
    else{
        return "nerd, you done fucked up";
    }
}

/**
 * STUDENT: returns active courses enrolled in
 */
function getActiveCourses(){
    return loadData('/student/get-active-courses/')
        .then(data => {
            return JSON.parse(data.courses);
        })
}
/**
 * GENERIC: GET all assessments for a course
 */
function getCourseAssessments(courseId) {
    return loadData('/get-course-assessments/' + courseId)
        .then(data => {
            return JSON.parse(data.assessments)
        });
}

/**
 * GENERIC: GET course data from a course code
 */
function getCourseData(courseCode){
    return loadData('/get-course-data/' + courseCode)
        .then(data => {
            return data;
        })
}

/**
 * GENERIC: get assignments from a courseId
 */
function getAssignments(courseId){
    return loadData('/get-assignments/' + courseId)
        .then(data => {
            return JSON.parse(data.assignments);
        })
}

/**
 * STUDENT: POSTs a new case to the database
 */
function postNewCase(dataToSend){
    return postData(('/student/post-new-case/'), dataToSend)
        .then(responseData => {
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
