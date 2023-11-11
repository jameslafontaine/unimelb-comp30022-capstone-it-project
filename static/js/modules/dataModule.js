/**
 * Loads JSON data from given url
 * @param {string} url - Endpoint that returns JSON
 * @returns {Promise<any>} 
 */
export function loadData(url, reqHeaders) {
    return fetch(url, {
        method: 'GET',
        headers: reqHeaders
    }).then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw error;
		});
}

