/** 
 * Generates an interactive table of all active and resolved requests for the currently selected course
 */
function generateRequestTable(data, type) {
	const tableContainer = document.getElementById('tableContainer' + type);
	const table = document.createElement('table');
	
	// Create table header row
	const headerRow = table.insertRow();
	
	for (const key in data[0]) {
		if (data[0].hasOwnProperty(key)) {
			const th = document.createElement('th');
			th.innerText = key;
			headerRow.appendChild(th);
		}
	}
	
	// Add an empty header for the button column
	const emptyHeader = document.createElement('th');
	emptyHeader.textContent = '';
	headerRow.appendChild(emptyHeader);
	
	// Create table data rows
	data.forEach(item => {
		const row = table.insertRow();
		for (const key in item) {
			if (item.hasOwnProperty(key)) {
				const cell = row.insertCell();
				cell.className = 'tableEntry'; // Apply the CSS class to the cell
				 // Check if the key is 'reserved'
				 if (key === 'reserved') {
                    // Check if 'reserved' is true, and display a yellow star for such requests
                    if (item[key] === true) {
                        const yellowStar = '<span style="font-size: 300%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>';
                        cell.innerHTML = yellowStar;
                    } else {
                        // Display a hollow star for non-reserved requests
                        const hollowStar = '<span style="font-size: 300%; ">☆</span>';
                        cell.innerHTML = hollowStar;
                    }
                } else {
                    // For other keys, just display the value as is
                    cell.innerHTML = item[key];
                }
			}
		}

		const reviewCell = row.insertCell();
		reviewCell.className = 'tableEntry';
		const requestButton = document.createElement('button');
		requestButton.className = 'standardButton';
		// Add the "Review" button to the last cell if this is the awaiting action table
		if (type === 'Awaiting') {
			requestButton.innerText = 'Review';
			requestButton.onclick = function () {
				window.location.href = 'iReviewRequest.html'; 
			};
		// Otherwise add the "View details" button to the last cell of a row if this is the resolved table
		} else if (type === 'Resolved') {
			requestButton.innerText = 'View details';
			requestButton.onclick = function () {
				window.location.href = 'iViewResolved.html'; 
			};
		}
		reviewCell.appendChild(requestButton);
	});
	
	// Append the table to the container
	tableContainer.appendChild(table);
};



/** 
 * Fills in the appropriate information required for the current version of a request on the review request and view resolved pages
 */
function fillCurrentRequestInformation(requestData, versionNumber) {
    if (requestData.reserved == true) {
        document.getElementById("requestNum").innerHTML = 'Request #' + requestData.requestId + '    <span style="font-size: 150%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>'
    } else {
        document.getElementById("requestNum").innerHTML = 'Request #' + requestData.requestId + '    <span style="font-size: 150%; ">☆</span>'
    }
    
    
    document.getElementById("versionNum").innerHTML = 'Version #' + versionNumber
    document.getElementById("dates").innerHTML = 'Created ' + requestData.creationDate
    if (requestData.resolveDate != '') {
        document.getElementById("dates").innerHTML = document.getElementById("dates").innerHTML + ', Resolved ' + requestData.resolveDate
    }
    document.getElementById("course").innerHTML = requestData.course
    document.getElementById("assessment").innerHTML = requestData.assessment
    document.getElementById("requestType").innerHTML = requestData.requestType
    document.getElementById("requestTitle").innerHTML = requestData.requestTitle
    document.getElementById("message").innerHTML = requestData.message
    document.getElementById("status").innerHTML = requestData.status
    // Place instructor notes (only exist for resolved requests)
    if (document.getElementById("notes") !== null) {
        document.getElementById("notes").innerHTML = requestData.instructorNotes;
    }
};



/** 
 * Generates a supporting documentation table, number denotes which supporting documentation table this is on the page
 */
function generateSuppDocTable(data, number) {
	const tableContainer = document.getElementById(`suppDocContainer${number}`);
	const table = document.createElement('table');
	
	// Create table header row
	const headerRow = table.insertRow();
	
	for (const key in data[0]) {
		if (data[0].hasOwnProperty(key)) {
			const th = document.createElement('th');
			th.innerText = key;
			headerRow.appendChild(th);
		}
	}
	
	// Add an empty header for the button column
	const emptyHeader = document.createElement('th');
	emptyHeader.textContent = '';
	headerRow.appendChild(emptyHeader);
	
	// Create table data rows
	data.forEach(item => {
		const row = table.insertRow();
		for (const key in item) {
			if (item.hasOwnProperty(key)) {
				const cell = row.insertCell();
				cell.className = 'tableEntry'; // Apply the CSS class to the cell
                cell.innerHTML = item[key];
			}
		}

		const downloadCell = row.insertCell();
		downloadCell.className = 'tableEntry';
		const downloadButton = document.createElement('button');
		downloadButton.className = 'standardButton';
		// Add the "Download" button to the last cell for each document
		downloadButton.innerText = 'Download';
		downloadButton.onclick = function () {
			// Need to add functionality to download the file somehow
        }
		downloadCell.appendChild(downloadButton);
	});
	
	// Append the table to the container
	tableContainer.appendChild(table);
};

/** 
 * Generates a collapsible box which contains information pertaining to a previous version of a request
 */

function generateVersionBox(version, number) {
    const container = document.getElementById("requestHistoryContainer");

    const expandableBox = document.createElement("div");
    expandableBox.className = "expandableBox";
    expandableBox.setAttribute('data-bs-toggle', 'collapse')
    expandableBox.setAttribute('data-bs-target', `#expandableBoxSection${number}`)

    const expandableBoxContents = document.createElement("div");
    expandableBoxContents.className = "expandableBoxContents";
    expandableBoxContents.innerHTML = `Version #${number} (${version.date})`;
    expandableBoxContents.setAttribute('data-bs-toggle', 'collapse')
    expandableBoxContents.setAttribute('data-bs-target', `#expandableBoxSection${number}`)

    const expandButton = document.createElement("span");
    expandButton.className = "expandButton";
    expandButton.setAttribute('data-bs-toggle', 'collapse')
    expandButton.setAttribute('data-bs-target', `#expandableBoxSection${number}`)

    expandableBoxContents.appendChild(expandButton);
    expandableBox.appendChild(expandableBoxContents);

    const expandableBoxSection = document.createElement("div");
    expandableBoxSection.className = "expandableBoxSection";
    expandableBoxSection.id = `expandableBoxSection${number}`;
    expandableBoxSection.style.height = "auto";
    expandableBoxSection.setAttribute('class', 'collapse show')
    
    const messageSpan = document.createElement("span");
    messageSpan.className = "text";
    messageSpan.textContent = "Message";
    
    const messageTextarea = document.createElement("textarea");
    messageTextarea.className = "textBox";
    messageTextarea.setAttribute("readonly", true);
    messageTextarea.style = "resize:none"
    messageTextarea.textContent = version.message;
    
    const suppDocSpan = document.createElement("p");
    suppDocSpan.className = "text";
    suppDocSpan.textContent = "Supporting Documents";


    const suppDocContainer = document.createElement("div");
    suppDocContainer.id = `suppDocContainer${number}`;
    
    expandableBoxSection.appendChild(messageSpan);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(messageTextarea);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(suppDocSpan);
    expandableBoxSection.appendChild(suppDocContainer);

    container.appendChild(expandableBox);
    container.appendChild(expandableBoxSection);
    container.appendChild(document.createElement("br"));
    
    generateSuppDocTable(version.documents, number);
    //container.appendChild(document.createElement("br"));
    //container.appendChild(document.createElement("br"));
    //container.appendChild(document.createElement("br"));
}

/** 
 * Deals with the visual elements associated with complex requsts and provides functionality to 
 * the mark as complex button
 */

function handleComplexRequestFunctionality(requestData) {
    // If a case has already been reserved then we hide the mark as complex button
    if (requestData.reserved == true) {
        hideButton("reserveButton");
    } else {
        // Otherwise modify the reserved status when mark as complex is clicked and hide the button
        // Also update the star to yellow in the request number at the top of the page

        // Get a reference to the reserveButton
        const reserveButton = document.getElementById('reserveButton');
        
        // Perform the aforementioned steps on button click
        reserveButton.addEventListener('click', function() {
            requestData.reserved = true;
            document.getElementById("requestNum").innerHTML = 'Request #' + requestData.requestId + '    <span style="font-size: 150%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>'
            console.log(`Reserved status changed: ${requestData.reserved}`); // Prints to console when inspecting page
            hideButton("reserveButton");
        });
    }
}