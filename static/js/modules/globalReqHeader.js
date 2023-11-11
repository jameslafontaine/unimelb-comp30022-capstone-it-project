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

function setupDownloadButton(buttonId, fileUrl, fileName) {
    document.getElementById(buttonId).addEventListener('click', function() {
        fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = fileName;
            link.click();
        })
        .catch(error => console.error('Error:', error));
    });
}
    
function setupUploadButton(buttonId, fileInputId, fileContainerId, uploadUrl) {
    document.getElementById(buttonId).addEventListener('click', function() {
        document.getElementById(fileInputId).click();
    });
    
    document.getElementById(fileInputId).addEventListener('change', function(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const fileInfo = document.createElement('div');
            fileInfo.innerHTML = `
            <p>Filename: ${file.name}</p>
            <p>Filesize: ${file.size} bytes</p>
            <p>Datetime Uploaded: ${new Date().toISOString()}</p>
            <button class="removeBtn">Remove</button>
            `;
            document.getElementById(fileContainerId).appendChild(fileInfo);
            
            fileInfo.querySelector('.removeBtn').addEventListener('click', function() {
                fetch(uploadUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filename: file.name }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fileInfo.remove();
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
    });
}