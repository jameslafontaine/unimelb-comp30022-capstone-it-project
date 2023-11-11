/**
 * Author: Jun Youn
 * Description: Global helper functions
 */

/**
 * Constants helper
 */
const CONTENT_TYPE = 'Content-Type';

/**
 * Modify globally stored header values
 */

function getGlobalAppHeadersValue(header) {
    let tempHeaders = new Headers(JSON.parse(sessionStorage.getItem('globalAppHeaders')));
    return tempHeaders.get(header);
}

function setGlobalAppHeaders(header, value) {
    let tempHeaders = new Headers(JSON.parse(sessionStorage.getItem('globalAppHeaders')));
    tempHeaders.set(header, value);
    sessionStorage.setItem('globalAppHeaders', JSON.stringify(Object.fromEntries(tempHeaders.entries())));
    console.log(getGlobalAppHeadersValue(header));
}

/**
 *
 * Helper functions for data endpoints
 * 
 */

/**
 * Loads JSON data from given url
 * @param {string} url - Endpoint that returns JSON
 * @returns {Promise<any>} 
 */
function loadData(url, reqHeaders) {
    return fetch(url, {
        method: 'GET',
        headers: reqHeaders
    }).then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
			console.error('Calling ' + url + ' returned an error ', error);
            throw error;
		});
}

/**
 * 
 * @param {string} url 
 * @param {integer} json 
 * @returns 
 */
function putData(url, json){
    return fetch(url, {
        method: 'PUT',
        headers: {
            CONTENT_TYPE: getGlobalAppHeadersValue(CONTENT_TYPE)
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
            CONTENT_TYPE: getGlobalAppHeadersValue(CONTENT_TYPE)
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

