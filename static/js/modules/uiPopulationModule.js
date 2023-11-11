import { AAP_TABLE_HEADERS, CASE_TABLE_HEADERS } from './constantsModule.js'
import { loadData } from './dataModule.js';

export function generateStudentCases(cases) {
    let numCases = cases.length;
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
        loadData('/api/data/cases/?caseid=' + cases[i].case_id + '&threads=true', {})
            .then(data => {                
                let threads = data.threads;

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
                    loadData('/api/data/courses/?courseid=' + thread.course_id, {})
                        .then(data => {
                            courseNameCell.innerHTML = data.course.course_name;
                        });

                    const assessmentNameCell = row.insertCell();
                    assessmentNameCell.className = 'tableEntry';
                    if (thread.assignment_id != null) {
                        loadData('/api/data/assessments/?assignid=' + thread.assignment_id, {})
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
            });
    }
    
}

export function fillCurrentRequestInformation(threadId, view) {

    loadData('/api/data/thread/' + threadId, {})
        .then(data => {
            let requestData = data.threadinfo.requests[0];
            if (requestData.reserved == true & view == 'Instructor') { // INSTRUCTOR COMPLEX
                document.getElementById("requestNum").innerHTML = 'Request #' + requestData.request_id + '    <span style="font-size: 150%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>'
            } else if (view == 'Instructor') { // INSTRUCTOR NON-COMPLEX
                document.getElementById("requestNum").innerHTML = 'Request #' + requestData.request_id + '    <span style="font-size: 150%; ">☆</span>'
            } else { // STUDENT
                document.getElementById("requestNum").innerHTML = 'Request #' + requestData.request_id;
            }
            
            // count how many requests belong to the thread to find version number
            let versionNumber = data.threadinfo.requests.length;
            document.getElementById("versionNum").innerHTML = 'Version #' + versionNumber;
           
            document.getElementById("dates").innerHTML = 'Created ' + requestData.date_created;
            /* need to figure out how we can tell if a request has been resolved or not
            if (requestData.resolveDate != '') {
                document.getElementById("dates").innerHTML = document.getElementById("dates").innerHTML + ', Resolved ' + requestData.resolveDate
            }
            */
            
            loadData('/api/data/courses/?courseid=' + data.threadinfo.thread.course_id, {})
                .then(data => {
                    let course = data.course;
                    document.getElementById("course").innerHTML = 
                                        course.course_code + ' - ' + course.course_name;
                })
            // assignment name
            loadData('/api/data/assessments/?assignid=' + data.threadinfo.thread.assignment_id, {})
                .then(assignment => {
                    document.getElementById("assessment").innerHTML = assignment.assignment_name;
                })
            document.getElementById("requestType").innerHTML = data.threadinfo.thread.request_type;
            document.getElementById("status").innerHTML = data.threadinfo.thread.current_status;

            //document.getElementById("requestTitle").innerHTML = requestData.requestTitle
            document.getElementById("message").innerHTML = requestData.request_content;
            // Place instructor notes (only exist for resolved requests)
            //if (document.getElementById("notes") !== null) {
            //    document.getElementById("notes").innerHTML = requestData.instructorNotes;
            //}
        })
};

export function generateSuppDocTable(requestList, number) {
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
        setupDownloadButton; // TODO:
		downloadCell.appendChild(downloadButton);
	});
	
	// Append the table to the container
	tableContainer.appendChild(table);
};

export function generateVersionBox(version, number) {
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

export function generateStudentRequest(number, courseList) {
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

function createAssignmentDropDown(number, courseList){
    const assignment = document.getElementById(`assignment${number}`);
    assignment.textContent = "Assignment"; 

    const assignmentDropdown = document.createElement("select")
    assignmentDropdown.style = 'margin-bottom: 5px;'
    assignmentDropdown.id = `assignmentDropdown${number}`;
    assignment.appendChild(document.createElement("br"));
    assignment.appendChild(assignmentDropdown);
    assignment.appendChild(document.createElement("br"));

    let courseCode = courseList[0]; // use the first course unless it has been changed
    const courseDropDown = document.getElementById(`courseDropdown${number}`);
    
    courseDropDown.addEventListener("change", function() {
        courseCode = courseDropDown.value;
    });

    // Populate the dropdown
    loadData('/api/data/courses/?userid=' + getGlobalAppHeadersValue('user_id'), {})
        .then(data => {
            let courses = data.courses;
            for (let course of courses) {
                if (courseCode == course.course_code) {
                    loadData('/api/data/assessments/?courseid=' + course.course_id, {})
                        .then(data => {
                            assignments = data.assessments
                            assignments.forEach(assignment => {
                                const option = document.createElement('option');
                                option.textContent = assignment.assignment_name;
                                document.getElementById(`assignmentDropdown${number}`).appendChild(option);
                            });
                        });
                    break;
                }
            }
        });
}

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

export function handleCaseSubmission(numRequests) {
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

export function saveEdits(currRequest, prevVersions) {

    // Create a new 'version' with the old 'current request' data
    const newVersion = {
        date: currRequest.creationDate,
        message: currRequest.message,
        documents: suppDocs.map(doc => ({ name: doc.name, size: doc.size }))
    };

    // Add the old 'current request' data to the previous versions list
    prevVersions.unshift(newVersion);

    // Save the edits to the current request
    currRequest.creationDate = new Date().toUTCString().slice(5, 16);

    currRequest.message = document.getElementById('messageTextBox').value

    // Add altered supporting documentation
    //currRequest.suppDocs = document.getElementById('suppDocContainer')
}

export function generateAAPTable(aapData) {
    const tableContainer = document.getElementById('aapTableContainer');
	const table = document.createElement('table');
	
	// Create table header row
	const headerRow = table.insertRow();

	for (const key in AAP_TABLE_HEADERS) {
		const th = document.createElement('th');
		th.innerText = AAP_TABLE_HEADERS[key]
		headerRow.appendChild(th);
	}
	
	// Add two empty headers for the button columns
	headerRow.appendChild(document.createElement('th'));
    headerRow.appendChild(document.createElement('th'));
	
	aapData.forEach(item => {
		const row = table.insertRow();
		
		const fileNameCell = row.insertCell();
		fileNameCell.className = 'tableEntry';
		fileNameCell.innerHTML = item.file_name;

		const fileTypeCell = row.insertCell();
		fileTypeCell.className = 'tableEntry';
		fileTypeCell.innerHTML = item.file_type

		// Download button
		const downloadCell = row.insertCell();
		downloadCell.className = 'tableEntry';
		const downloadButton = document.createElement('button');
		downloadButton.className = 'standardButton';
		downloadButton.innerText = 'Download';
		downloadButton.onclick = function () {
			// NEED TO ADD DOWNLOAD FUNCTIONALITY HERE 
			downloadFunctionality();
        }
        downloadCell.appendChild(downloadButton)

		// Remove button
		const removeCell = row.insertCell();
		removeCell.className = 'tableEntry';
		const removeButton = document.createElement('button');
		removeButton.className = 'standardButton';
		removeButton.innerText = 'Remove';
		removeButton.onclick = function () {
			// NEED TO ADD REMOVE FUNCTIONALITY HERE
			removeFunctionality(); 
        }
        removeCell.appendChild(removeButton)
	});

    // Insert upload row
    const row = table.insertRow();
    for (let i = 0; i < 5; i++) {
        if (i == 3) {
            // Add the "Upload" button to the last cell
            const uploadCell = row.insertCell();
            uploadCell.className = 'tableEntry';
            const uploadButton = document.createElement('button');
            uploadButton.className = 'standardButton';
            uploadButton.innerText = 'Upload';
            uploadButton.onclick = function () {
                // NEED TO ADD UPLOAD FUNCTIONALITY HERE
				uploadFunctionality();
            }
            uploadCell.appendChild(uploadButton)
        } else {
            const cell = row.insertCell();
            cell.className = 'tableEntry'; // Apply the CSS class to the cell
            cell.innerHTML = '';
        }
    }
	
	// Append the table to the container
	tableContainer.appendChild(table);
};

function downloadFunctionality() {
	fetch('/api/data/files/' + item.user_id + '?aaps=true', {
		method: 'GET',
	})
	.then(response => response.json())
	.then(data => {
		// Handle the downloaded data
		let blob = new Blob([atob(data.file_data)], { type: data.file_type });
		let link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = data.file_name;
		link.click();
	})
	.catch((error) => {
		console.error('Error:', error);
	});
	
};

function uploadFunctionality() {
	// Get the files from the input field
    let files = document.querySelector('input[type="file"]').files;

    let formData = new FormData();
    formData.append('user_id', 'YourUserIdHere');

    // Append each file to the form data
    for(let i = 0; i < files.length; i++) {
        let file = files[i];
        formData.append('fileName[]', file, file.name);
    }

    fetch('api/data/files/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data here
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// !!!!!!!!!!!!!!!!!!  THIS ENDPOINT HAS TO BE FIXED !!!!!!!!!!!!!!!!!!!!!!!!!!!
function removeFunctionality() {
		// Assuming that the item object has an id property
		fetch('/api/data/files/remove?fileid=' + item.id, {
			method: 'DELETE',
		}).then(response => response.json())
			.then(data => {
				// Handle the response data here
				console.log(data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
}

