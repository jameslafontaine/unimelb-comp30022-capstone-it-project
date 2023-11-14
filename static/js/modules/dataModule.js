/** 
 * Author(s): Jun Youn, James La Fontaine, Callum Sharman
 * Date Last Modified: November 12, 2023
 * Description: Helper functions for retrieving and sending data to the database
 */

import { CONTENT_TYPE } from "./constantsModule.js";
import { getGlobalAppHeadersValue } from "./helperFunctionModule.js";

/**
 * Loads JSON data from given url
 * @param {string} url - Endpoint that returns JSON
 * @returns {Promise<any>} 
 */
export function loadData(url, reqHeaders) {
    return fetch(url, {
        method: 'GET',
    }).then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw error;
		});
}

/**
 * Sends form data to the given URL endpoint
 * @param {string} url - Endpoint that receives formdata
 * @returns {Promise<any>} 
 */
export function putData(url, json){
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
            throw error;
        });
}

export function postData(url, json){
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
            throw error;
        });
}