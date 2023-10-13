/** 
 * Author: Callum Sharman
 * Date Last Modified: October 12, 2023
 * Description: Encapsulates everything surrounding data reading, writing and processing
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
 * STUDENT: Loads in requests from thread id from the DB, returns an array full of case JSONs
 */
function sloadRequestsData(threadId){
    return loadData('/student/requests-from-thread/' + threadId)
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
 * STUDENT: Generates a list of "previous versions" of a request
 */
function sGetPreviousVersions(threadId){
    return sloadRequestsData(threadId)
        .then(requests => {
            // cuts off the first request (current request)
            return requests.splice(1);
        })
}

/**
 * INSTRUCTOR: Gets a list of all requests "awaiting action"
 */
function iloadThreadsPending(courseId){
    return loadData('/instructor/get-threads-pending/' + courseId)
        .then(data => {
            return JSON.parse(data.threads);
        })
}

/**
 * INSTRUCTOR: Gets a list of all "resolved" requests
 */
function iloadThreadsResolved(courseId){
    return loadData('/instructor/get-threads-resolved/' + courseId)
        .then(data => {
            return JSON.parse(data.threads);
        })
}