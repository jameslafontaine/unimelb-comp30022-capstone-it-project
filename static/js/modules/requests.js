/** 
 * Author: James La Fontaine, Callum Sharman
 * Date Last Modified: October 14, 2023
 * Description: Handles all functionality surrounding requests
 */

const CASE_TABLE_HEADERS = ["Request Type", "Course Name", "Assessment", "Current Status", "Date Updated"];
const REQUEST_TABLE_HEADERS = ["Complex case", "Request Type", "Assessment", "Current Status", "Date Updated", "Instructor Notes"];

/** 
 * Generates an interactive table of all active and resolved requests for the currently selected course
 */
function generateRequestTable(threads, type) {
	const tableContainer = document.getElementById('tableContainer' + type);
	const table = document.createElement('table');
	
	// Create table header row
	const headerRow = table.insertRow();

    for (const key in REQUEST_TABLE_HEADERS) {
        const th = document.createElement('th');
        th.innerText = REQUEST_TABLE_HEADERS[key];
        headerRow.appendChild(th);
    }

    const emptyHeader = document.createElement('th');
    emptyHeader.textContent = '';
    headerRow.appendChild(emptyHeader);

    // Add thread data
    threads.forEach(thread => {
        const row = table.insertRow();
        
        const complexCaseCell = row.insertCell();
        complexCaseCell.className = 'tableEntry';
        if (thread.complex_case == 0) {
            const hollowStar = '<span style="font-size: 300%; ">☆</span>';
            complexCaseCell.innerHTML = hollowStar;
        } else if (thread.complex_case == 1) {
            const yellowStar = '<span style="font-size: 300%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>';
            complexCaseCell.innerHTML = yellowStar;
        }

        const requestTypeCell = row.insertCell();
        requestTypeCell.className = 'tableEntry';
        requestTypeCell.innerHTML = thread.request_type;

        const assessmentNameCell = row.insertCell();
        assessmentNameCell.className = 'tableEntry';
        if (thread.assignment_id != null) {
            loadAssignment(thread.assignment_id)
                .then(assignmentData => {
                    assessmentNameCell.innerHTML = assignmentData.assignment_name;
                });
        } else {
            assessmentNameCell.innerHTML = "None";
        }

        const currentStatusCell = row.insertCell();
        currentStatusCell.className = 'tableEntry';
        currentStatusCell.innerHTML = thread.current_status;

        const dateUpdatedCell = row.insertCell();
        dateUpdatedCell.className = 'tableEntry';
        dateUpdatedCell.innerHTML = thread.date_updated;

        const instructorNotesCell = row.insertCell();
        instructorNotesCell.className = 'tableEntry';
        getLatestRequest(thread.thread_id)
            .then(data => {
                instructorNotesCell.innerHTML = data.instructor_notes;
            });

        const reviewCell = row.insertCell();
        reviewCell.className = 'tableEntry';
        const requestButton = document.createElement('button');
        requestButton.className = 'standardButton';
        // Add the "Review" button to the last cell if this is the awaiting action table
        if (type === 'Awaiting') {
            requestButton.innerText = 'Review';
            requestButton.onclick = function () {
                window.location.href = '/instructor/review-req/' + thread.thread_id; // id needs to be fetched and put in here 
            };
        // Otherwise add the "View details" button to the last cell of a row if this is the resolved table
        } else if (type === 'Resolved') {
            requestButton.innerText = 'View details';
            requestButton.onclick = function () {
                window.location.href = '/instructor/view-resolved/' + thread.thread_id; 
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
            loadRequestsData(threadId)
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
        setupDownloadButton;
		downloadCell.appendChild(downloadButton);
        fixStyling();
	});
	
	// Append the table to the container
	tableContainer.appendChild(table);
    fixStyling();
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

    fixStyling();
    
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
    initialiseComplexButton(thread);
    
    // Modify the reserved status when mark as complex is clicked and change the 'Mark as complex' button
    // to 'Unmark'. Vice versa if the unmark button is clicked
    // Also update the star appropriately at the top of the page

    // Perform the aforementioned steps on button click
    reserveButton.addEventListener('click', function() {
        setComplex(thread.thread_id) // when returns true it has worked
            .then(response => {
                if(response == true){
                    // set successfully, change the DOM
                    initialiseComplexButton(thread);
                }
                else{
                    console.log("ERROR: ", "put thingo didnt work man");
                }
            })
    });
}

/**
 * Initialises the complex button based on request status
 */
function initialiseComplexButton(thread){
    // Get a reference to the reserveButton
    const reserveButton = document.getElementById('reserveButton');
    // If a case has already been reserved then we show the unmark button
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

                // Make the table headers

                for (const key in CASE_TABLE_HEADERS) {
                    const th = document.createElement('th');
                    th.innerText = CASE_TABLE_HEADERS[key];
                    headerRow.appendChild(th);
                }

                const emptyHeader = document.createElement('th');
                emptyHeader.textContent = '';
                headerRow.appendChild(emptyHeader);

                // Create table data rows
                threads.forEach(thread => {
                  
                    const row = table.insertRow();

                    const requestTypeCell = row.insertCell();
                    requestTypeCell.className = 'tableEntry';
                    requestTypeCell.innerHTML = thread.request_type;

                    const courseNameCell = row.insertCell();
                    courseNameCell.className = 'tableEntry';
                    loadCourse(thread.course_id)
                        .then(courseData => {
                            courseNameCell.innerHTML = courseData.course_name;
                        });

                    const assessmentNameCell = row.insertCell();
                    assessmentNameCell.className = 'tableEntry';
                    if (thread.assignment_id != null) {
                        loadAssignment(thread.assignment_id)
                            .then(assignmentData => {
                                assessmentNameCell.innerHTML = assignmentData.assignment_name;
                            });
                    } else {
                        assessmentNameCell.innerHTML = "None";
                    }

                    const currentStatusCell = row.insertCell();
                    currentStatusCell.className = 'tableEntry';
                    currentStatusCell.innerHTML = thread.current_status;

                    const dateUpdatedCell = row.insertCell();
                    dateUpdatedCell.className = 'tableEntry';
                    dateUpdatedCell.innerHTML = thread.date_updated;

                    const viewDetailsCell = row.insertCell();
                    viewDetailsCell.className = 'tableEntry';
                    const viewDetailsButton = document.createElement('button');
                    viewDetailsButton.className = 'standardButton';
                    viewDetailsButton.innerText = 'View Details';
                    viewDetailsButton.onclick = function () {
                        window.location.href = '/student/view-req/' + thread.thread_id;
                    }
                    viewDetailsCell.appendChild(viewDetailsButton);
                    expandableBoxSection.appendChild(table);
            
                    container.appendChild(expandableBox);
                    container.appendChild(expandableBoxSection);
                    container.appendChild(document.createElement("br"));
                
                });
                fixStyling();
            });
    }

    
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

    // create an assignment holder to be filled in later if needed
    const assignment = document.createElement("label");
    assignment.className = "text";
    assignment.id = `assignment${number}`;

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
    uploadButton.id = `uploadBtn${number}`;
    uploadButton.innerText = 'Upload';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = `fileInput${number}`;
    fileInput.style.display = 'none'; // Hide the file input element

    const fileContainer = document.createElement('div');
    fileContainer.id = `fileContainer${number}`;

    supDocContainer.appendChild(fileContainer)

    supDocContainer.appendChild(fileInput);

    // Append the upload button to the document body 
    supDocContainer.appendChild(uploadButton);


    // // Event listener for the upload button
    // uploadButton.onclick = function () {
    //     // Programmatically trigger a click event on the file input element
    //     fileInput.click();
    // };
    
    // Append the new elements into the HTML
    expandableBoxSection.appendChild(course);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(courseDropdown);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(requestType);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(requestTypeDropdown);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(assignment);
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

    // only done here because the first option will always be extension which needs it
    createAssignmentDropDown(number, courseList);

    // listen for changes in the request type and add or remove drop down as needed
    assignmentDropDownListener(number, courseList);


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

    // Setup upload button and make sure the files uploaded are displayed correctly and are allowed to be removed

    // CHANGE UPLOAD URL TO WHATEVER IS CORRECT FOR OUR DATABASE
    setupUploadButton(`uploadBtn${number}`, `fileInput${number}`, `fileContainer${number}`, 
    '/api/data/files/upload');

    fixStyling();

}

/**
 * Listens for changes in the request type to either add or delete the assignment dropdown
 */
function assignmentDropDownListener(number, courseList){

    const requestDropDown = document.getElementById(`requestTypeDropdown${number}`);
    const assignment = document.getElementById(`assignment${number}`);

    requestDropDown.addEventListener("change", function() {
        const selectedValue = requestDropDown.value;

        // when the request type is any of these the user must pick the assignment as well
        if((selectedValue == "Extension") || 
           (selectedValue == "Remark") || 
           (selectedValue == "Quiz Code")){
            createAssignmentDropDown(number, courseList);
        } 
        // if the request type is any of the following any assignment dropdown much be removed
        else if((selectedValue == "General Query") ||
                  (selectedValue == "Other")){
            while (assignment.firstChild) {
                assignment.removeChild(assignment.firstChild);
            }
        }
    });
}

/**
 * Creates and add the assignments dropdown
 */
function createAssignmentDropDown(number, courseList){

    const assignment = document.getElementById(`assignment${number}`);
    assignment.textContent = "Assignment"; 
    const assignmentDropdown = document.createElement("select")
    assignmentDropdown.style = 'margin-bottom: 5px;'
    assignmentDropdown.id = `assignmentDropdown${number}`;
    assignment.appendChild(document.createElement("br"));
    assignment.appendChild(assignmentDropdown);
    assignment.appendChild(document.createElement("br"));



    courseCode = courseList[0]; // use the first course unless it has been changed
    const courseDropDown = document.getElementById(`courseDropdown${number}`);
    
    courseDropDown.addEventListener("change", function() {
        courseCode = courseDropDown.value;
    });

    // Populate the dropdown
    getCourseData()
        .then(courses => {
            for (let course of courses) {
                if (courseCode == course.course_code) {
                    getAssignments(course.course_id)
                        .then(assignments => {
                            assignments.forEach(assignment => {
                                const option = document.createElement('option');
                                option.textContent = assignment.assignment_name;
                                document.getElementById(`assignmentDropdown${number}`).appendChild(option);
                            });
                            fixStyling();
                        });
                    break;
                }
            }
        });
}

/** 
 * Saves each of the requests added during submission by a student
 */
function handleCaseSubmission(numRequests) {
    let requestsData = new Array();
    for (let i=1; i <= numRequests; i++) {

        requestData = {
            'courseId': document.getElementById(`courseDropdown${i}`).value,
            'requestType': document.getElementById(`requestTypeDropdown${i}`).value,
            'assignmentId': -1,
            'requestTitle': document.getElementById(`requestTitleTextBox${i}`).value,
            'message': document.getElementById(`messageTextBox${i}`).value,
            'supportingDocuments': -1,
        }
        requestsData.push(requestData);
    }
    postNewCase({'requests': requestsData});
}
