/** 
 * Author: James La Fontaine, Callum Sharman
 * Date Last Modified: October 14, 2023
 * Description: Handles all functionality surrounding requests
 */

/** 
 * Generates an interactive table of all active and resolved requests for the currently selected course
 */
function generateRequestTable(threads, type) {
	const tableContainer = document.getElementById('tableContainer' + type);
	const table = document.createElement('table');
	
	// Create table header row
	const headerRow = table.insertRow();

    getLatestRequest(threads[0].thread_id)
        .then(request => {
            for (const key in request) {
                if (request.hasOwnProperty(key)) {
                    const th = document.createElement('th');
                    th.innerText = key;
                    headerRow.appendChild(th);
                }
            }

            // Add an empty header for the button column
            const emptyHeader = document.createElement('th');
            emptyHeader.textContent = '';
            headerRow.appendChild(emptyHeader);
        })
	
    // Create table data rows
	threads.forEach(thread => {
        getLatestRequest(thread.thread_id)
            .then(request => {
                const row = table.insertRow();
                for (const key in request) {
                    if (request.hasOwnProperty(key)) {
                        const cell = row.insertCell();
                        cell.className = 'tableEntry'; // Apply the CSS class to the cell
                        // Check if the key is 'reserved'
                        if (key === 'reserved') {
                            // Check if 'reserved' is true, and display a yellow star for such requests
                            if (request[key] === true) {
                                const yellowStar = '<span style="font-size: 300%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>';
                                cell.innerHTML = yellowStar;
                            } else {
                                // Display a hollow star for non-reserved requests
                                const hollowStar = '<span style="font-size: 300%; ">☆</span>';
                                cell.innerHTML = hollowStar;
                            }
                        } else {
                            // For other keys, just display the value as is
                            cell.innerHTML = request[key];
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
                        window.location.href = '/instructor/review-req/' + request.thread_id; // id needs to be fetched and put in here 
                    };
                // Otherwise add the "View details" button to the last cell of a row if this is the resolved table
                } else if (type === 'Resolved') {
                    requestButton.innerText = 'View details';
                    requestButton.onclick = function () {
                        window.location.href = '/instructor/view-resolved/' + request.thread_id; 
                    };
                }
                reviewCell.appendChild(requestButton);
            })
    })
	
	// Append the table to the container
	tableContainer.appendChild(table);
};

/** 
 * Fills in the appropriate information required for the current version of a request on the review request and view resolved pages
 */
function fillCurrentRequestInformation(threadId, view) {

    getLatestRequest(threadId)
        .then(requestData => {
            if (requestData.reserved == true & view == 'Instructor') { // INSTRUCTOR COMPLEX
                document.getElementById("requestNum").innerHTML = 'Request #' + requestData.request_id + '    <span style="font-size: 150%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>'
            } else if (view == 'Instructor') { // INSTRUCTOR NON-COMPLEX
                document.getElementById("requestNum").innerHTML = 'Request #' + requestData.request_id + '    <span style="font-size: 150%; ">☆</span>'
            } else { // STUDENT
                document.getElementById("requestNum").innerHTML = 'Request #' + requestData.request_id;
            }
            
            // count how many requests belong to the thread to find version number
            sloadRequestsData(threadId)
                .then(requests => {
                    versionNumber = requests.length;
                    document.getElementById("versionNum").innerHTML = 'Version #' + versionNumber
                })

            document.getElementById("dates").innerHTML = 'Created ' + requestData.date_created;
            /* need to figure out how we can tell if a request has been resolved or not
            if (requestData.resolveDate != '') {
                document.getElementById("dates").innerHTML = document.getElementById("dates").innerHTML + ', Resolved ' + requestData.resolveDate
            }
            */

            loadThread(threadId)
                .then(thread => {
                    // course identification
                    loadCourse(thread.course_id)
                        .then(course => {
                            document.getElementById("course").innerHTML = 
                                                course.course_code + ' - ' + course.course_name;
                        })
                    // assignment name
                    loadAssignment(thread.assignment_id)
                        .then(assignment => {
                            document.getElementById("assessment").innerHTML = assignment.assignment_name;
                        })
                    document.getElementById("requestType").innerHTML = thread.request_type;
                    document.getElementById("status").innerHTML = thread.current_status;
                })
            //document.getElementById("requestTitle").innerHTML = requestData.requestTitle
            document.getElementById("message").innerHTML = requestData.request_content;
            // Place instructor notes (only exist for resolved requests)
            //if (document.getElementById("notes") !== null) {
            //    document.getElementById("notes").innerHTML = requestData.instructorNotes;
            //}
        })
};

/** 
 * Generates a supporting documentation table, number denotes which supporting documentation table this is on the page
 */
function generateSuppDocTable(requestList, number) {
	const tableContainer = document.getElementById(`suppDocContainer${number}`);
	const table = document.createElement('table');
	
	// Create table header row
	const headerRow = table.insertRow();
	
	for (const key in requestList[0]) {
		if (requestList[0].hasOwnProperty(key)) {
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
	requestList.forEach(request => {
		const row = table.insertRow();
		for (const key in request) {
			if (request.hasOwnProperty(key)) {
				const cell = row.insertCell();
				cell.className = 'tableEntry'; // Apply the CSS class to the cell
                cell.innerHTML = request[key];
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

    // Set up expandable box
    const expandableBox = document.createElement("div");
    expandableBox.className = "expandableBox";
    expandableBox.setAttribute('data-bs-toggle', 'collapse')
    expandableBox.setAttribute('data-bs-target', `#expandableBoxSection${number}`)

    const expandableBoxContents = document.createElement("div");
    expandableBoxContents.className = "expandableBoxContents";
    expandableBoxContents.innerHTML = `Version #${number} (${version.date_created})`;
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
    

    // Place elements in expandable box
    const messageSpan = document.createElement("span");
    messageSpan.className = "text";
    messageSpan.textContent = "Message";
    
    const messageTextarea = document.createElement("textarea");
    messageTextarea.className = "textBox";
    messageTextarea.setAttribute("readonly", true);
    messageTextarea.style = "resize:none"
    messageTextarea.textContent = version.request_content;
    
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
    
    //generateSuppDocTable(version.documents, number);
    //container.appendChild(document.createElement("br"));
    //container.appendChild(document.createElement("br"));
    //container.appendChild(document.createElement("br"));
}

/** 
 * Deals with the visual elements associated with complex requsts and provides functionality to 
 * the mark as complex button
 */

function handleComplexRequestFunctionality(thread) {
    // If a case has already been reserved then we show the unmark button
    if (thread.complex_case) {
        reserveButton.innerHTML = 'Unmark'
    }
    // Modify the reserved status when mark as complex is clicked and change the 'Mark as complex' button
    // to 'Unmark'. Vice versa if the unmark button is clicked
    // Also update the star appropriately at the top of the page
    
    // Get a reference to the reserveButton
    const reserveButton = document.getElementById('reserveButton');

    // Perform the aforementioned steps on button click
    reserveButton.addEventListener('click', function() {
        setComplex(thread.thread_id) // when returns true it has worked
            .then(response => {
                if(response == true){
                    // set successfully, change the DOM
                    getLatestRequest(thread.thread_id)
                        .then(request => {
                            if (thread.complex_case) { // it is complex now
                                reserveButton.innerHTML = 'Unmark'
                                document.getElementById("requestNum").innerHTML = 'Request #' + request.request_id + '    <span style="font-size: 150%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>'
                            } else { // it is not complex
                                reserveButton.innerHTML = 'Mark as complex'
                                document.getElementById("requestNum").innerHTML = 'Request #' + request.request_id + '    <span style="font-size: 150%; ">☆</span>'
                            }
                        })
                }
                else{
                    console.log("ERROR: ", "put thingo didnt work man");
                }
            })
    });
}

/** 
 * Generates expandable tables for each of a student's active cases
 */

function generateStudentCases(cases) {
    numCases = cases.length;
    const container = document.getElementById("caseContainer");

    // For each active case, create an expandable table containing all requests in that case
    for (let i = 0; i < numCases; i++) {

        // Set up expandable box
		const expandableBox = document.createElement("div");
        expandableBox.className = "expandableBox";
        expandableBox.setAttribute('data-bs-toggle', 'collapse')
        expandableBox.setAttribute('data-bs-target', `#expandableBoxSection${i}`)

        const expandableBoxContents = document.createElement("div");
        expandableBoxContents.className = "expandableBoxContents";
        expandableBoxContents.innerHTML = `Case #` + cases[i].case_id;
        expandableBoxContents.setAttribute('data-bs-toggle', 'collapse')
        expandableBoxContents.setAttribute('data-bs-target', `#expandableBoxSection${i}`)

        const expandButton = document.createElement("span");
        expandButton.className = "expandButton";
        expandButton.setAttribute('data-bs-toggle', 'collapse')
        expandButton.setAttribute('data-bs-target', `#expandableBoxSection${i}`)

        expandableBoxContents.appendChild(expandButton);
        expandableBox.appendChild(expandableBoxContents);

        const expandableBoxSection = document.createElement("div");
        expandableBoxSection.className = "expandableBoxSection";
        expandableBoxSection.id = `expandableBoxSection${i}`;
        expandableBoxSection.style.height = "auto";
        expandableBoxSection.setAttribute('class', 'collapse show')

        // Create table within expandable
        const table = document.createElement('table');

        // Create table header row
	    const headerRow = table.insertRow();
        
        // wait for the requests to load in and then continue
        sloadThreadsData(cases[i].case_id)
            .then(threads => {
                // gets the first request of the first thread just to fill out the headers
                getLatestRequest(threads[0].thread_id)
                        .then(request => {
                            for (const key in request) {
                                if (request.hasOwnProperty(key)) {
                                    const th = document.createElement('th');
                                    th.innerText = key;
                                    headerRow.appendChild(th);
                                }
                            }
                    
                            // Add an empty header for the button column
                            const emptyHeader = document.createElement('th');
                            emptyHeader.textContent = '';
                            headerRow.appendChild(emptyHeader);
                        })

                // Create table data rows
                threads.forEach(thread => {
                    getLatestRequest(thread.thread_id)
                        .then(request => {

                            const row = table.insertRow();
                            for (const key in request) {
                                if (request.hasOwnProperty(key)) {
                                    const cell = row.insertCell();
                                    cell.className = 'tableEntry'; // Apply the CSS class to the cell
                                cell.innerHTML = request[key];
                                }
                            }
                
                            const viewDetailsCell = row.insertCell();
                            viewDetailsCell.className = 'tableEntry';
                            const viewDetailsButton = document.createElement('button');
                            viewDetailsButton.className = 'standardButton';
                            // Add the "View Details" button to the last cell for each request
                            viewDetailsButton.innerText = 'View Details';
                            viewDetailsButton.onclick = function () {
                                window.location.href = '/student/view-req/' + request.thread_id;
                            }
                            viewDetailsCell.appendChild(viewDetailsButton);
                        });
                        // Append the table to the expandable box
                        expandableBoxSection.appendChild(table);
                
                        container.appendChild(expandableBox);
                        container.appendChild(expandableBoxSection);
                        container.appendChild(document.createElement("br"));
                })
                    
            })
    };

    
}

/** 
 * Generates the components required for a student request when a student is
 * creating a case
 */
function generateStudentRequest(number, courseList) {
    const caseContainer = document.getElementById("caseContainer");

    // Set up expandable box
    const expandableBox = document.createElement("div");
    expandableBox.className = "expandableBox";
    expandableBox.setAttribute('data-bs-toggle', 'collapse')
    expandableBox.setAttribute('data-bs-target', `#expandableBoxSection${number}`)
    expandableBox.id = `expandableBox${number}`

    const expandableBoxContents = document.createElement("div");
    expandableBoxContents.className = "expandableBoxContents";
    expandableBoxContents.innerHTML = `Request #${number}`;
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
    
    // Create the elements that will go inside the expandable
    const course = document.createElement("label");
    course.className = "text";
    course.textContent = "Course";
    
    const courseDropdown = document.createElement("select");
    courseDropdown.style = 'margin-bottom: 5px;'
    courseDropdown.id = `courseDropdown${number}`

    const requestType = document.createElement("label");
    requestType.className = "text";
    requestType.textContent = "Request Type";

    const requestTypeDropdown = document.createElement("select")
    requestTypeDropdown.style = 'margin-bottom: 5px;'
    requestTypeDropdown.id = `requestTypeDropdown${number}`

    const requestTypeTextBox = document.createElement("textarea");
    requestTypeTextBox.className = "textBox";

    const requestTitle = document.createElement("span");
    requestTitle.className = "text";
    requestTitle.textContent = "Request Title";
    
    
    const requestTitleTextBox = document.createElement("textarea");
    requestTitleTextBox.className = "textBox";
    requestTitleTextBox.style = 'height:30px; resize:none'
    requestTitleTextBox.id = `requestTitleTextBox${number}`

    const message = document.createElement("span");
    message.className = "text";
    message.textContent = "Message";
    
    const messageTextBox = document.createElement("textarea");
    messageTextBox.className = "textBox";
    messageTextBox.id = `messageTextBox${number}`
    
    const suppDoc = document.createElement("p");
    suppDoc.className = "text";
    suppDoc.textContent = "Supporting Documents";

    const supDocContainer = document.createElement("div");
    supDocContainer.id = `suppDocContainer${number}`;

    const uploadButton = document.createElement('button');
    uploadButton.className = 'standardButton';
    uploadButton.id = `upload${number}`
    uploadButton.innerText = 'Upload';
    uploadButton.onclick = function () {
        // NEED TO ADD UPLOAD FUNCTIONALITY
    }

    supDocContainer.appendChild(uploadButton);
    
    // Append the new elements into the HTML
    expandableBoxSection.appendChild(course);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(courseDropdown);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(requestType);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(requestTypeDropdown);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(requestTitle);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(requestTitleTextBox);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(message);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(messageTextBox);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(suppDoc);
    expandableBoxSection.appendChild(supDocContainer);

    caseContainer.appendChild(expandableBox);
    caseContainer.appendChild(expandableBoxSection);

    lastLineBreak = document.createElement("br")

    lastLineBreak.id = `lastLineBreak${number}`
    caseContainer.appendChild(lastLineBreak);

    // Populate course dropdown
    courseList.forEach(course => {
        const option = document.createElement('option');
        option.textContent = course;
        document.getElementById(`courseDropdown${number}`).appendChild(option);
    });
        

    // Populate request type dropdown
    const reqTypeList = [
        'Extension',
        'General Query',
        'Remark',
        'Quiz Code',
        'Other'    
    ]

    reqTypeList.forEach(request => {
        const option = document.createElement('option');
        option.textContent = request;
        document.getElementById(`requestTypeDropdown${number}`).appendChild(option);
    });

    // Initialise supporting documentation table with upload button
}

/** 
 * Saves each of the requests added during submission by a student
 */
function handleCaseSubmission(numRequests) {

    for (let i=0; i < numRequests; i++) {
        // Save case to database
    }
}