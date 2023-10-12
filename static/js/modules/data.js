/** 
 * Author: Callum Sharman
 * Date Last Modified: October 12, 2023
 * Description: Encapsulates everything surrounding data reading, writing and processing
 */

/**
 * GET call to API to 'url', returns a JSON on success 
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
 * GET call to API to 'url', returns text on success 
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
 * PUT call to API to 'url', sends the data in 'request' 
 */
function putData(url, request){

}

/**
 * POST call to API to 'url', sends the data in 'request' 
 */
function postData(url, request){

}

/**
 * INSTRUCTOR: Loads in requests, given a course from the DB, returns an array full of request JSONs
 */
function iloadRequestData(courseId){
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
 * STUDENT: Loads in requests from case id from the DB, returns an array full of case JSONs
 */
function sloadCaseRequestsData(caseId){
    return loadData('/student/requests-from-case/' + caseId)
        .then(data => {
            return JSON.parse(data.requests);
        })

}