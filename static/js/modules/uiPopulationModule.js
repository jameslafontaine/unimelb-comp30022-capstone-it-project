/** 
 * Author: James La Fontaine, Callum Sharman, Jun Youn
 * Date Last Modified: November 12, 2023
 * Description: Functions which generate and deal with the user interface
 */

import { getGlobalAppHeadersValue } from './helperFunctionModule.js';
import { AAP_TABLE_HEADERS, CASE_TABLE_HEADERS, REQUEST_TABLE_HEADERS, SUPP_DOC_HEADERS } from './constantsModule.js'
import { loadData, postData, putData } from './dataModule.js';


/**
 * Dynamically generates the table which contains student cases
 * @param {array} cases - list of student cases
 */
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
        for (const key in CASE_TABLE_HEADERS) {
            const th = document.createElement('th');
            th.innerText = CASE_TABLE_HEADERS[key];
            headerRow.appendChild(th);
        }
        const emptyHeader = document.createElement('th');
        emptyHeader.textContent = '';
        headerRow.appendChild(emptyHeader);

        // Create table data rows
        loadData('/api/data/cases/?caseid=' + cases[i].case_id + '&threads=true', {})
            .then(data => {                
                console.log(data);
                data.threads.forEach(thread => {
                  
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
            })
            .catch(error => {
                throw error;
            });
    }
    
}

/**
 * Inserts the required information into the most recent updated version of a request (top of page)
 * @param {int} threadId - identifier for version of request
 * @param {string} view - Student or Instructor
 */
export function fillCurrentRequestInformation(threadId, view) {

    loadData('/api/data/thread/' + threadId, {})
        .then(data => {

            let thread = data.threadinfo.thread

            let requestData = data.threadinfo.requests[0];
            if (data.threadinfo.thread.complex_case == 1 & view == 'Instructor') { // INSTRUCTOR COMPLEX
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
            if (thread.assignment_id != null) {
            loadData('/api/data/assessments/?assignid=' + data.threadinfo.thread.assignment_id, {})
                .then(assignment => {
                    document.getElementById("assessment").innerHTML = assignment.assignment_name;
                })
            }
            document.getElementById("requestType").innerHTML = data.threadinfo.thread.request_type;
            document.getElementById("status").innerHTML = data.threadinfo.thread.current_status;

            document.getElementById("message").innerHTML = requestData.request_content;
        });
}

/**
 * Dynamically generates the supporting documentation table
 * @param {array} requestList - list of student requests
 * @param {int} number - which version of the request this is (i.e. which supporting doc table this is)
 */
export function generateSuppDocTable(files, number) {
	const tableContainer = document.getElementById(`suppDocContainer${number}`);
	const table = document.createElement('table');

	// Create table header row
	const headerRow = table.insertRow();

    for (const key in SUPP_DOC_HEADERS) {
        const th = document.createElement('th');
        th.innerText = SUPP_DOC_HEADERS[key];
        headerRow.appendChild(th);
    }
	
	// Add an empty header for the button column
	const emptyHeader = document.createElement('th');
	emptyHeader.textContent = '';
	headerRow.appendChild(emptyHeader);
	
    console.error("Logging files array");
    console.log(files);

    if (!files || files.length == 0) {
        console.error("The 'files' array is undefined or empty.");
        return;
    }

    var fileNum = 0;
	// Create table data rows
	files.forEach(file => {

                
        let file_name = file.file_name;
        let file_type = file.file_type;
        let file_data = file.file_data;

        // 'Pad' the base64 data so i don't get error (?)
        while (file_data.length % 4 !== 0) {
            file_data += '=';
        }

        // Create a Blob from the base64 data
        let blob = new Blob([atob(file_data)], {type: file_type});

        // Calculate the file size and format it
        let file_size = blob.size;
        
        let formatted_file_size = formatBytes(file_size);
        
		const row = table.insertRow();

        const fileNameCell = row.insertCell();
        fileNameCell.className = 'tableEntry fileNameCell';
        fileNameCell.innerHTML = file_name;

        const fileSizeCell = row.insertCell();
        fileSizeCell.className = 'tableEntry';
        fileSizeCell.innerHTML = formatted_file_size;

		const downloadCell = row.insertCell();
		downloadCell.className = 'tableEntry';
		const downloadButton = document.createElement('button');
		downloadButton.className = 'standardButton';
        downloadButton.id = `downloadButton_${number}_${fileNum}`

		// Add the "Download" button to the last cell for each document
		downloadButton.innerText = 'Download';

        downloadCell.appendChild(downloadButton);

        // Handle download functionality for the download button

        // Add an onclick event to the downloadButton
        downloadButton.onclick = function() {
            
            // Create a URL for the Blob
            let url = URL.createObjectURL(blob);
            
            // Create a link with a download attribute
            let a = document.createElement('a');
            a.href = url;
            a.download = file_name;
            
            // Append the link to the body
            document.body.appendChild(a);
            
            // Trigger the download
            a.click();

        };
        fileNum += 1;
    });

	// Append the table to the container
	tableContainer.appendChild(table);
}

/**
 * Dynamically generates the boxes which contain past versions of requests and their details
 * @param {JSON} version - past request
 * @param {int} number - which version of the request this is (i.e. which past request this is relative to others)
 */
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


    loadData(`/api/data/files/${getGlobalAppHeadersValue('user_id')}/?requestid=${version.request_id}`, {})
        .then(data => {
            let files = data;
            generateSuppDocTable(files, number);
        });

    
    //container.appendChild(document.createElement("br"));
    //container.appendChild(document.createElement("br"));
    //container.appendChild(document.createElement("br"));
}

/**
 * Pushes information to the database after a case is submitted
 * @param {int} numRequests - number of requests in this case
 */
export function handleCaseSubmission(numRequests) {

    // Current time
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);
    var formattedDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    let submissionData = [];

    let requestPromises = [];

    if (numRequests > 0) {

        for (let i = 0; i <= numRequests; i++) {
            requestPromises.push(loadData('/api/data/courses/?userid=' + getGlobalAppHeadersValue('user_id'), {})
                .then(data => {
                    let submissionTemplate;
                    submissionTemplate = {
                        'date_created': formattedDate,
                        'course_id': -1,
                        'request_type': '',
                        'assignment_id': null,
                        'request_content': document.getElementById(`messageTextBox${i}`).value
                    }
                    for (let course of data.courses) {
                        if (course.course_code == document.getElementById(`courseDropdown${i}`).value) {
                            submissionTemplate.course_id = course.course_id;
                            let requestType = document.getElementById(`requestTypeDropdown${i}`).value
                            if ((requestType == 'General Query') || (requestType == 'Other')) {
                                if (requestType == 'General Query') {
                                    submissionTemplate.request_type = "QUERY";
                                }
                                if (requestType == 'Other') {
                                    submissionTemplate.request_type = "OTHER";
                                }
                                submissionData.push(submissionTemplate);
                            }
                            if ((requestType == 'Extension') || (requestType == 'Remark') || (requestType == 'Quiz Code')) {
                                if (requestType == 'Extension') {
                                    submissionTemplate.request_type = "EXTENSION";
                                }
                                if (requestType == 'Remark') {
                                    submissionTemplate.request_type = "REMARK";
                                }
                                if (requestType == 'Quiz Code') {
                                    submissionTemplate.request_type = "QUIZCODE";
                                }
                                loadData('/api/data/assessments/?courseid=' + course.course_id, {})
                                    .then(data => {
                                        let assignments = data.assessments;
                                        for (let assignment of assignments) {
                                            if (assignment.assignment_name == document.getElementById(`assignmentDropdown${i}`).value) {
                                                submissionTemplate.assignment_id = assignment.assignment_id;
                                                submissionData.push(submissionTemplate);
                                                break;
                                            }
                                        }
                                    })
                                    .catch(error => {
                                        throw error
                                    });
                            }
                            break;
                        }
                    }
                }));
        }
        Promise.allSettled(requestPromises)
            .then(() => {
                postData(('/api/data/cases/new/'), {
                    'user_id': getGlobalAppHeadersValue('user_id'),
                    'requests': submissionData
                }).then(() => {
                    window.location.href = '/student/'
                    return true;
                }).catch(error => {
                    throw error;
                });
            });
    }

}

/**
 * Creates a student request form to be filled when a student is submitting a request
 * @param {int} number - which request this is within the current case the student is making
 * @param {array} courseList - list of courses this student is enrolled in
 */
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
    
    const table = document.createElement('table');
    table.style.tableLayout = 'fixed'; // set the table layout to fixed
    table.id = `table${number}`;
    
    const headerRow = table.insertRow();
    for (const key in SUPP_DOC_HEADERS) {
        const th = document.createElement('th');
        th.innerText = SUPP_DOC_HEADERS[key];
        headerRow.appendChild(th);
    }
    const emptyHeader = document.createElement('th');
    emptyHeader.textContent = '';
    headerRow.appendChild(emptyHeader);
    
    supDocContainer.appendChild(table);
    
    const uploadButton = document.createElement('button');
    uploadButton.className = 'standardButton';
    uploadButton.id = `uploadBtn${number}`;
    uploadButton.innerText = 'Upload';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = `fileInput${number}`;
    fileInput.style.display = 'none'; // Hide the file input element
    
    supDocContainer.appendChild(fileInput);
    
    supDocContainer.appendChild(document.createElement('br'));
    
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


    const lastLineBreak = document.createElement("br")
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
    setupUploadButton(`uploadBtn${number}`, `fileInput${number}`, `table${number}`, 
    '/api/data/files/upload/', '/api/data/files/remove/');

}

 
/*
 * Creates the assignment dropdown for a student submitting a request
 * @param {int} number - which request this is within the current case the student is making
 * @param {array} courseList - list of courses this student is enrolled in
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

    let courseCode;
    if (courseList.length > 0) {
        courseCode = courseList[0];
    } else {
        courseCode = "";
    }
    const courseDropDown = document.getElementById(`courseDropdown${number}`);
    loadData('/api/data/courses/?userid=' + getGlobalAppHeadersValue('user_id'), {})
        .then(data => {
            courseCode = courseDropDown.value;
            let courses = data.courses;
            const requestDropdown = document.getElementById(`requestTypeDropdown${number}`);
            const selectedRequestType = requestDropdown.value;
            console.log(`first assessment dropdown population run, request type = ${selectedRequestType}`)
            if (selectedRequestType == 'General Query' || selectedRequestType == 'Other') {
                document.getElementById(`assignment${number}`).style.visibility = 'hidden';
                //document.getElementById(`assignmentDropdown${number}`).style.visibility = 'hidden';
                return;
            } else {
                document.getElementById(`assignment${number}`).style.visibility = 'visible';
                //document.getElementById(`assignmentDropdown${number}`).style.visibility = 'visible';
            }
            for (let course of courses) {
                if (courseCode == course.course_code) {
                    loadData('/api/data/assessments/?courseid=' + course.course_id, {})
                        .then(data => {
                            let assignments = data.assessments;
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
    
    courseDropDown.addEventListener("change", function() {
        loadData('/api/data/courses/?userid=' + getGlobalAppHeadersValue('user_id'), {})
            .then(data => {
                
                courseCode = courseDropDown.value;
                let courses = data.courses;
                const requestDropdown = document.getElementById(`requestTypeDropdown${number}`);
                const selectedRequestType = requestDropdown.value;
                console.log(`event listener triggered, request type = ${selectedRequestType}`)
                if (selectedRequestType == 'General Query' || selectedRequestType == 'Other') {
                    document.getElementById(`assignment${number}`).style.visibility = 'hidden';
                    return;
                } else {
                    document.getElementById(`assignment${number}`).style.visibility = 'visible';
                    //document.getElementById(`assignmentDropdown${number}`).style.visibility = 'visible';
                }
                for (let course of courses) {
                    if (courseCode == course.course_code) {
                        loadData('/api/data/assessments/?courseid=' + course.course_id, {})
                            .then(data => {
                                let assignments = data.assessments;
                                document.getElementById(`assignmentDropdown${number}`).options.length = 0;
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
    });
}

/**
 * Checks whether the assignment dropdown needs to be displayed or not
 * @param {int} number - which request this is within the current case the student is making
 * @param {array} courseList - list of courses this student is enrolled in
 */
function assignmentDropDownListener(number, courseList){

    const requestDropDown = document.getElementById(`requestTypeDropdown${number}`);
    const assignment = document.getElementById(`assignment${number}`);

    requestDropDown.addEventListener("change", function() {
        const selectedValue = requestDropDown.value;

        console.log(`selected request type = ${selectedValue}`)
        
        // when the request type is any of these the user must pick the assignment as well
        if((selectedValue == "Extension") || 
           (selectedValue == "Remark") || 
           (selectedValue == "Quiz Code")){
            createAssignmentDropDown(number, courseList);
        } 
        // if the request type is any of the following any assignment dropdown much be removed
        else if((selectedValue == "General Query") ||
                  (selectedValue == "Other")){
            // TODO
            createAssignmentDropDown(number, []);
        }
    });
}

/**
 * Handles functionality relating to the upload button for supporting documentation
 * @param {int} buttonId - HTML id for the upload button
 * @param {array} fileInputId - HTML id for the fileinput element
 * @param {int} tableId - HTML id for the table which will display file information
 * @param {array} uploadUrl - URL endpoint for uploading files
 * @param {array} removeUrl - URL endpoint for removing files
 */
function setupUploadButton(buttonId, fileInputId, tableId, uploadUrl, removeUrl) {
    const buttonElement = document.getElementById(buttonId);
    buttonElement.addEventListener('click', function() {
        document.getElementById(fileInputId).click();
    });

    document.getElementById(fileInputId).addEventListener('change', function(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('user_id', getGlobalAppHeadersValue('user_id'));
        formData.append('file', file);

        fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(() => {
            // Check if the table already exists
            let table = document.getElementById(tableId)

            // If the table does not exist, create a new one
            if (!table) {
                table = document.createElement('table');
                table.style.tableLayout = 'fixed'; // set the table layout to fixed

                const headerRow = table.insertRow();
                for (const key in SUPP_DOC_HEADERS) {
                    const th = document.createElement('th');
                    th.innerText = SUPP_DOC_HEADERS[key];
                    headerRow.appendChild(th);
                }
                const emptyHeader = document.createElement('th');
                emptyHeader.textContent = '';
                headerRow.appendChild(emptyHeader);
            }

            const row = table.insertRow();

            const fileNameCell = row.insertCell();
            fileNameCell.className = 'tableEntry fileNameCell';
            fileNameCell.innerHTML = file.name;

            const fileSizeCell = row.insertCell();
            fileSizeCell.className = 'tableEntry';
            fileSizeCell.innerHTML = formatBytes(file.size);

            const removeCell = row.insertCell();
            removeCell.className = 'tableEntry removeCell';
            const removeButton = document.createElement('button');
            removeButton.className = 'standardButton removeButton'; // Make sure the class name matches the one used in the event listener
            removeButton.innerText = 'Remove';
            removeCell.style.width = '50px'
            removeCell.appendChild(removeButton);

            // Handle remove functionality for the remove button
            removeButton.addEventListener('click', function() {
                const row = removeButton.parentNode.parentNode; // Get the parent row of the remove button
                const fileName = row.querySelector('.fileNameCell').innerText; // Get the file name from the row

                fetch(removeUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filename: fileName }),
                })
                .then(response => {
                    if (response.ok) {
                        row.remove(); // remove the table row
                    }
                })
                .then(() => {
                    // Reset the file input value to allow reuploading the same file immediately
                    document.getElementById(fileInputId).value = '';
                })
                .catch(error => {
                    throw error;
                });
            });
        })
        .catch(error => {
            throw error;
        });
    });
}











/**
 * Handles functionality relating to the download button for supporting documentation
 * @param {int} buttonId - HTML id for the download button
 * @param {string} fileUrl - URL endpoint for downloading files
 * @param {string} fileName - Name of the file that the user will download
 */
// function setupDownloadButton(buttonId, fileUrl, fileName) {
//     document.getElementById(buttonId).addEventListener('click', function() {
//         fetch(fileUrl)
//         .then(response => response.blob())
//         .then(blob => {
//             const objectUrl = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = objectUrl;
//             link.download = fileName;
//             link.click();
//         })
//         .catch(error => {
//             throw error;
//         });
//     });
// }



/**
 * Pushes edits made to a request
 * @param {JSON} currRequest - JSON containing information about the 'current' version of the request (before edits are made)
 * @param {array} prevVersions - list of previous versions of the request
 */
export function saveEdits(currRequest, prevVersions) {

    const suppDocs = [
        {
            name: 'iamsick.pdf',
            size: '20 TB'
        },
        {
            name: 'bible.pdf',
            size: '40 MB'
        },
        {
            name: 'medcert.pdf',
            size: '3 MB'
        }
    ]

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

/**
 * Generates the table which contains AAPs and the ability to upload and download them
 * @param {array} aapData - list of AAP JSONs
 * @param {string} uploadUrl - URL to upload the files
 * @param {string} removeUrl - URL to remove files
 */
export function generateAAPTable(aapData, uploadUrl, removeUrl) {
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
    
    var aapNum = 0;
    
    aapData.forEach((aap, index) => {
        const row = table.insertRow();
        
        let file_name = aap.file_name;
        let file_type = aap.file_size;
        let file_data = aap.file_data;

        // Create a Blob from the base64 data
        let blob = new Blob([atob(file_data)], {type: file_type});

        const fileNameCell = row.insertCell();
        fileNameCell.className = 'tableEntry fileNameCell';
        fileNameCell.innerHTML = file_name;

        const fileSizeCell = row.insertCell();
        fileSizeCell.className = 'tableEntry';
        fileSizeCell.innerHTML = formatBytes(blob.size)

        // Download button
        const downloadCell = row.insertCell();
        downloadCell.className = 'tableEntry';
        const downloadButton = document.createElement('button');
        downloadButton.className = 'standardButton';
        downloadButton.id = `downloadButton${aapNum}`
        downloadButton.innerText = 'Download';
        downloadCell.appendChild(downloadButton)

        // Remove button
        const removeCell = row.insertCell();
        removeCell.className = 'tableEntry';
        const removeButton = document.createElement('button');
        removeButton.className = 'standardButton';
        removeButton.innerText = 'Remove';
        removeCell.appendChild(removeButton)

        // Handle download functionality for the download button
        downloadButton.onclick = function() {
            // Create a URL for the Blob
            let url = URL.createObjectURL(blob);
            
            // Create a link with a download attribute
            let a = document.createElement('a');
            a.href = url;
            a.download = file_name;
            
            // Append the link to the body
            document.body.appendChild(a);
            
            // Trigger the download
            a.click();

            // Remove the link from the body
            document.body.removeChild(a);
        };

        // Handle remove functionality for the remove button
        removeButton.onclick = function() {
            fetch(removeUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: file_name }),
            })
            .then(response => {
                response.json
                if (response.ok) {
                    table.deleteRow(index + 1); // +1 because the first row is the header
                }
            })
        }

        aapNum += 1;
    });
    
    // Append the table to the container
    tableContainer.appendChild(table);

    // Create a new upload button below the table
    const uploadButton = document.createElement('button');
    uploadButton.className = 'standardButton';
    uploadButton.innerText = 'Upload';
    tableContainer.appendChild(document.createElement('br'));
    tableContainer.appendChild(uploadButton);

    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    tableContainer.appendChild(fileInput);

    // Setup the upload button
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });

    // Handle upload button click
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('user_id', getGlobalAppHeadersValue('user_id'));
        formData.append('file', file);

        fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(() => {
            const row = table.insertRow();

            const fileNameCell = row.insertCell();
            fileNameCell.className = 'tableEntry fileNameCell';
            fileNameCell.innerHTML = file.name;

            const fileSizeCell = row.insertCell();
            fileSizeCell.className = 'tableEntry';
            fileSizeCell.innerHTML = formatBytes(file.size);

            // Download button
            const downloadCell = row.insertCell();
            downloadCell.className = 'tableEntry';
            const downloadButton = document.createElement('button');
            downloadButton.className = 'standardButton';
            downloadButton.innerText = 'Download';
            downloadCell.appendChild(downloadButton)

            // Remove button
            const removeCell = row.insertCell();
            removeCell.className = 'tableEntry';
            const removeButton = document.createElement('button');
            removeButton.className = 'standardButton';
            removeButton.innerText = 'Remove';
            removeCell.appendChild(removeButton)

            // Handle download functionality for the download button
            downloadButton.onclick = function() {
                // Create a URL for the Blob
                let url = URL.createObjectURL(file);
                
                // Create a link with a download attribute
                let a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                
                // Append the link to the body
                document.body.appendChild(a);
                
                // Trigger the download
                a.click();

                // Remove the link from the body
                document.body.removeChild(a);
            };

            // Handle remove functionality for the remove button
            removeButton.onclick = function() {
                fetch(removeUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filename: file.name }),
                })
                .then(response => { 
                    response.json()
                    if (response.ok) {
                        row.remove(); // remove the table row          
                    }
                }).then(() => {
                    // Reset the file input value to allow reuploading the same file immediately
                    fileInput.value = '';
                })
                .catch(error => {
                    throw error;
                });
            };
        })
        .catch(error => {
            throw error;
        });
    });
}


/**
 * Generates a subject box which instructors can use to access subjects from the home page
 * @param {JSON} subject - contains information about the subject relevant to the subject box UI element
 */
export function generateSubjectBox(subject) {
	// Create a new expandable box element
	const standardBox  = document.createElement('div');
	standardBox.classList.add('standardBox');
  
	// Create the standardBoxContents element
	const standardBoxContents = document.createElement('div');
	standardBoxContents.classList.add('standardBoxContents');
	standardBoxContents.style.fontSize = '18px';
  
	// Create the subjectCode element
	const subjectCodeElement = document.createElement('span');
	subjectCodeElement.textContent = `${subject.course_code} (${subject.course_name})`;
	
	// change to this when you can get the numreserved and unresolved
	//subjectCodeElement.textContent = `${subject.course_id} (${subject.numReserved} reserved, ${subject.numUnresolved} unresolved)`;
	
	// Create the rightItems container
	const rightItems = document.createElement('span');
	rightItems.classList.add('rightItems');
  
	// Create the "View Requests & Queries" button
	const viewRequestsButton = document.createElement('button');
	viewRequestsButton.classList.add('standardButton');
	viewRequestsButton.textContent = 'View Requests & Queries';
	viewRequestsButton.style = 'font-size:16px'
	viewRequestsButton.onclick = function() {
		window.location.href = '/instructor/view-reqs/' + subject.course_id; 
	};
  
    // TODO:
	// Create the "Settings" button
    // Will have to hide or grey out and have popup on hover if instructor is not subject coordinator
loadData('/api/data/user/enrollment?courseid=' + subject.course_id + '&userid=' + getGlobalAppHeadersValue('user_id'), {})
    .then(data => {
        if (data.enrollment_role == "SCOORD") {
            const settingsButton = document.createElement('button');
            settingsButton.classList.add('standardButton');
            settingsButton.textContent = 'Settings';
            settingsButton.style = 'font-size:16px'
            settingsButton.onclick = function() {
                window.location.href = '/instructor/subject-settings/' + subject.course_id; 
            };
            rightItems.appendChild(settingsButton);
        }
    });

  
	// Append the elements to their respective parent elements
	rightItems.appendChild(viewRequestsButton);
	standardBoxContents.appendChild(subjectCodeElement);
	standardBoxContents.appendChild(rightItems);
	standardBox.appendChild(standardBoxContents);
  
	// Append the subject box to the container
	document.getElementById('subjectBoxContainer').appendChild(standardBox);
	document.getElementById('subjectBoxContainer').appendChild(document.createElement('br'));

}

/**
 * Handles the display of request complexity and the ability to toggle request complexity
 * @param {JSON} thread - current version of a request
 */
export function handleComplexRequestFunctionality(thread) {



    // Get a reference to the reserveButton
    const reserveButton = document.getElementById('reserveButton');

    loadData('/api/data/thread/' + thread.thread_id, {})
    .then(data => {
         
        let request = data.threadinfo.requests[0];

        // If these types of requests aren't reservable for Scoord, we hide the reserve button
        // Retrieve the request permissions for the role of the current instructor
        loadData('/api/data/courses/?courseid=' + thread.course_id + '&preferences=true', {})
        .then(prefs => {
            let keyName = `scoord_${thread.request_type}`.toLowerCase();

            if (prefs[keyName] == false) {
                reserveButton.style.display = 'none';
            }

        });

        // If a case has already been reserved then we show the unmark button
        if (data.threadinfo.thread.complex_case) { // it is complex now
            reserveButton.innerHTML = 'Unmark'
            document.getElementById("requestNum").innerHTML = 'Request #' + request.request_id + '    <span style="font-size: 150%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>'
        } else { // it is not complex
            reserveButton.innerHTML = 'Mark as complex'
            document.getElementById("requestNum").innerHTML = 'Request #' + request.request_id + '    <span style="font-size: 150%; ">☆</span>'
        }
    })

    // Modify the reserved status when mark as complex is clicked and change the 'Mark as complex' button
    // to 'Unmark'. Vice versa if the unmark button is clicked
    // Also update the star appropriately at the top of the page

    // Perform the aforementioned steps on button click
    reserveButton.addEventListener('click', function() {
        setComplex(thread.thread_id) // when returns true it has worked
            .then(response => {
                if(response == true){
                    // set successfully, change the DOM
                    const reserveButton = document.getElementById('reserveButton');
                    // If a case has already been reserved then we show the unmark button
                    loadData('/api/data/thread/' + thread.thread_id, {})
                        .then(data => {
                            let request = data.threadinfo.requests[0];
                            if (data.threadinfo.thread.complex_case) { // it is complex now
                                reserveButton.innerHTML = 'Unmark'
                                document.getElementById("requestNum").innerHTML = 'Request #' + request.request_id + '    <span style="font-size: 150%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>'
                            } else { // it is not complex
                                reserveButton.innerHTML = 'Mark as complex'
                                document.getElementById("requestNum").innerHTML = 'Request #' + request.request_id + '    <span style="font-size: 150%; ">☆</span>'
                            }
                        })
                }
            })
    });
}

/**
 * Sets up the buttons that allow popups to be opened and closed for approving and rejecting requests
 */
export function setupOpenClosePopupButtons() {
    const buttons = document.querySelectorAll('#approveButton, #rejectButton, #answerButton');
    const popups = document.querySelectorAll('.popupBox');
    
    buttons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent clicking off the popup box from closing it
            const targetId = this.getAttribute('data-target');
            const popup = document.getElementById(targetId);
            document.body.style.overflow = 'hidden'; // Disable scrolling
            popup.style.overflow = 'hidden'; // Disable scrolling within the popup
            popup.classList.add('show');
        });
    });
    
    popups.forEach(popup => {
        const closeButton = popup.querySelector('.closePopup');
        closeButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent clicking off the popup box from closing it
           
            document.body.style.overflow = 'auto'; // Enable scrolling
            popup.classList.remove('show');
        });
    });
}

/**
 * Fills in the information for the student details box on a view request page
 * @param {JSON} student - contains information about the student who made the request
 */
export function fillStudentDetailsBox(student) {
    document.getElementById('studentName').innerHTML = student.first_name + ' ' + student.last_name
    document.getElementById('studentId').innerHTML = student.user_id
    document.getElementById('studentEmail').innerHTML = student.email
}

/**
 * Creates the table of requests which instructors view for a particular subject
 * @param {array} threads - list of request JSONs
 * @param {string} type - denotes whether this is the table for active requests or resolved requests ('Awaiting' or 'Resolved)
 */
export function generateRequestTable(threads, type) {
    console.log('Now in generateRequestTable()')
    console.log(`threads = ${threads}`)
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
    
    console.log('About to add thread data')
    // Add thread data
    threads.forEach(thread => {
        
        console.log(thread)
        
        // Example usage:
        shouldDisplayRequest(thread.request_type, thread.complex_case, thread.course_id)
        .then(result => {
            console.log("Returned prefs[key]:", result);
            // Check if this thread is meant to be displayed for this instructor or not, if not then skip this request
            if (result == 1) {
                // Proceed with displaying the relevant information in this table row if we should display it
                console.log(`we should display this request, generating table now`)
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
                
                const instructorNotesCell = row.insertCell();
                instructorNotesCell.className = 'tableEntry';
                loadData('/api/data/thread/' + thread.thread_id, {})
                .then(data => {
                    return data.threadinfo.requests[0].instructor_notes;
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
            }
            
            
            
            
            
        });
        
        // Append the table to the container
        tableContainer.appendChild(table);
    })
    .catch(error => {
        console.error("Error:", error);
        // Handle the error
    });
    
    
}

/**
 * Checks whether the provided request should be display to the current instructor
 *
 * @param {string} requestType - Denotes the type of request this is [general, query, quiz, remark, other]
 * @param {int} isComplex - 1 to note that a case is complex, 0 for not
 * @param {int} courseId - Identifier for the course to allow retrieval of subject settings
 * @returns {boolean} - Describes whether we should display this request for the instructor or not
 *
 */
export function shouldDisplayRequest(requestType, isComplex, courseId) {
    // Wrap the entire logic in a Promise
    return new Promise((resolve, reject) => {
        // Retrieve the request permissions for the role of the current instructor
        loadData('/api/data/courses/?courseid=' + courseId + '&preferences=true', {})
            .then(data => {
                let prefs = data.coursepreferences;

                console.log(`prefs =  ${prefs}`);

                console.log(`requestType = ${requestType}`);

                console.log(`isComplex = ${isComplex}`);
                // Get the role of the instructor (are they a tutor or a subject coordinator)
                loadData('/api/data/user/enrollment?courseid=' + courseId + '&userid=' + getGlobalAppHeadersValue('user_id'), {})
                    .then(data => {
                        let role = data.enrollment_role;

                        let keyName;
                        if (requestType == "QUIZCODE") {
                            keyName = "quiz" + `_${role.toLowerCase()}`;
                            console.log(`key = ${keyName}`);
                        } else if (requestType == "QUERY") {
                            keyName = "general" + `_${role.toLowerCase()}`;
                        } else {
                            keyName = requestType.toLowerCase() + `_${role.toLowerCase()}`;
                            console.log(`key = ${keyName}`);
                        }
                        console.log(`role = ${role}`);
                        if ((role == 'TUTOR') || (role == 'SCOORD' && isComplex == 1)) {
                            for (let key in prefs) {
                                console.log(`currently iterating, reached key = ${key}`);
                                if (key == keyName) {
                                    console.log(`matched key = ${key}`);
                                    console.log(`prefs[key] = ${prefs[key]}`);
                                    // Resolve the Promise with the prefs[key] value
                                    resolve(prefs[key]);
                                    return;
                                }
                            }
                        }
                        // If the loop completes without finding a match, resolve with undefined
                        resolve(undefined);
                    })
                    .catch(error => reject(error));  // Reject the Promise if there's an error in the inner loadData call
            })
            .catch(error => reject(error));  // Reject the Promise if there's an error in the outer loadData call
    });
}

/*
 * Populates the popups with required information when instructors are reviewing a request
 * @param {JSON} thread - contains information about the current version of the request being reviewed
 */
export function populatePopups(thread) {

    // Retrieve the template response and put it into the value of the instructor notes box
    loadData('/api/data/courses/?courseid=' + thread.course_id + '&preferences=true', {})
    .then(data => {
        document.getElementById('instructorNotesAExt').value = data.coursepreferences.extension_approve || '';
        document.getElementById('instructorNotesRExt').value = data.coursepreferences.extension_reject || '';
        document.getElementById('instructorNotesARem').value = data.coursepreferences.remark_approve || '';
        document.getElementById('instructorNotesRRem').value = data.coursepreferences.remark_reject || '';
        document.getElementById('instructorNotesAQui').value = data.coursepreferences.quiz_approve || '';
        document.getElementById('instructorNotesRQui').value = data.coursepreferences.quiz_reject || '';
        document.getElementById('instructorNotesAns').value = data.coursepreferences.general_reject || '';
    });


    if (thread.assignment_id != null) {
        loadData('/api/data/assessments/?assignid=' + thread.assignment_id, {})
        .then(assignment => {
            // Populate current deadline
            document.getElementById('currentDeadline').value = assignment.due_date;
            // Populate student selected assessment
            document.getElementById('selectedAssessmentAExt').value = assignment.assignment_name;
            document.getElementById('selectedAssessmentRExt').value = assignment.assignment_name;
            document.getElementById('selectedAssessmentARem').value = assignment.assignment_name;
            document.getElementById('selectedAssessmentRRem').value = assignment.assignment_name;
            document.getElementById('selectedAssessmentAQui').value = assignment.assignment_name;
            document.getElementById('selectedAssessmentRQui').value = assignment.assignment_name;
        });
    }
    

    if (thread.request_type == 'EXTENSION') {
           // Populate override extension dropdown
           for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.textContent = i;
            document.getElementById('extensionOverrideAExt').appendChild(option);
        }
    }
 

    loadData('/api/data/thread/' + thread.thread_id, {})
        .then(data => {
            let prefs = data.threadinfo.coursepreferences;
            // Populate default extension
            document.getElementById('defaultExtension').value = prefs.global_extension_length;
            // Set extension override to match default extension
            document.getElementById('extensionOverrideAExt').value = prefs.global_extension_length;
        })
        
        if (thread.request_type != 'QUERY' && thread.request_type != 'OTHER') {
            // Populate the assignment override dropDown
            loadData('/api/data/assessments/?courseid=' + thread.course_id, {})
            .then(data => {
                let assignments = data.assessments;
                assignments.forEach(assignment => {
                    const option = document.createElement('option');
                    option.textContent = assignment.assignment_name;
                    let reqShort = thread.request_type.substring(0,3).toLowerCase();
                    reqShort = reqShort.charAt(0).toUpperCase() + reqShort.slice(1);
                    let dropDownId = "assessmentOverrideA" + reqShort;
                    document.getElementById(dropDownId).appendChild(option);
                });
            });
        }
    }

/**
 * Handles the displaying and hiding of buttons as needed depending on the type of request being reviewed
 * @param {JSON} thread - contains information about the request currently being reviewed
 */
export function hideAndDisplayButtons(thread) {

    let reqShort = thread.request_type.substring(0,3).toLowerCase();
    reqShort = reqShort.charAt(0).toUpperCase() + reqShort.slice(1);

    var approveButton = document.getElementById('approveButton');
    var rejectButton = document.getElementById('rejectButton');
    var answerButton = document.getElementById('answerButton');

    if (thread.request_type != 'QUERY' && thread.request_type != 'OTHER') {
        approveButton.setAttribute('data-target', `approve${reqShort}Popup`);
        rejectButton.setAttribute('data-target', `reject${reqShort}Popup`);
        approveButton.style.display = '';
        rejectButton.style.display = '';
        answerButton.style.display = 'none';

    } else {
        answerButton.setAttribute('data-target', 'answerPopup');
        approveButton.style.display = 'none';
        rejectButton.style.display = 'none';
    }
}

/**
 * Updates the relevant information and performs required operations when a request is resolved
 * @param {JSON} thread - contains information about the request currently being reviewed
 */
export function handleApprovalRejectionAnswer(thread) {

    // First 3 letters of request type used for HTML identifiers
    let reqShort = thread.request_type.substring(0,3).toLowerCase();
    reqShort = reqShort.charAt(0).toUpperCase() + reqShort.slice(1);
    console.log(`reqShort = ${reqShort}`)
    let responseJson;

    // Initialise approve and request buttons for all request types except queries, other and quiz
    if (thread.request_type != "QUERY" && thread.request_type != "OTHER") {
        // Get the Approve Request button
        const popupApproveButton = document.getElementById(`popupApproveButton${reqShort}`);
        
        // Add click event listener to Approve Request button
        popupApproveButton.addEventListener('click', function() {


            let assignmentName = document.getElementById(`assessmentOverrideA${reqShort}`).value
            let assignmentId = -1; //placeholder
            
            // find the assignment id to return by matching to the name in backend
            loadData('/api/data/assessments/?courseid=' + thread.course_id, {})
                .then(data => {
                    let assignments = data.assessments;
                    assignments.forEach(assignment => {
                        if(assignment.assignment_name == assignmentName){
                            assignmentId = assignment.assignment_id;
                        }
                    });
                    // assignment id found, organise response json now

                    // Quiz has the extra field of quiz password to return and doesn't need extension
                    if (thread.request_type == "Quiz") {
                        responseJson = {
                            'instructorNotes' : document.getElementById(`instructorNotesA${reqShort}`).value,
                            'status' : 'Approved',
                            'quizPassword' : document.getElementById(`instructorNotesA${reqShort}`).value,
                            'assignmentId' : assignmentId,
                        }
                    } else {
                        responseJson = {
                            'instructorNotes' : document.getElementById(`instructorNotesA${reqShort}`).value,
                            'status' : 'Approved',
                            'extended by' : document.getElementById('extensionOverrideAExt').value,
                            'assignmentId' : assignmentId,
                        }
                    }

                    respond(thread.thread_id, responseJson);
                    // return to view reqs (could make a confirmation page or just show confirmation message at top)
                    window.location.href = '/instructor/view-reqs/' + thread.course_id;

                });
        });
        
        // Get the Reject Request button
        const popupRejectButton = document.getElementById(`popupRejectButton${reqShort}`);
        
        // Add click event listener to Reject Request button
        popupRejectButton.addEventListener('click', function() {
            responseJson = {
                'instructorNotes' : document.getElementById(`instructorNotesR${reqShort}`).value,
                'status' : 'Rejected',
                'extended by' : 0,
            }

            respond(thread.thread_id, responseJson);

            // return to view reqs (could make a confirmation page or just show confirmation message at top)
            window.location.href = '/instructor/view-reqs/' + thread.course_id;
            
        });

    // Initialise Answer button for queries and other requests
    } else {
        // Get the Answer button
        const popupAnswerButton = document.getElementById('popupAnswerButton');
        
        // Add click event listener to the Answer button
        popupAnswerButton.addEventListener('click', function() {
            // write the response json with notes and status
            responseJson = {
                'instructorNotes' : document.getElementById('instructorNotesAns').value,
                'status' : 'Answered',
            }
            respond(thread.thread_id, responseJson);
            window.location.href = '/instructor/view-reqs/' + thread.course_id;
        });
    }
}

/**
 * Populates the assessment dropdown for instructor popups
 * @param {array} assessmentList - list of assesssments for the subject of the request currently being reviewed
 */
export function populateAssessmentDropdown(assessmentList) {
    
    const assessmentDropdown = document.getElementById('assessmentDropdown');


    // Add global option
    const option = document.createElement('option');
    option.textContent = 'Global';
    assessmentDropdown.appendChild(option);

    // Add all assessments for this subject to dropdown
    assessmentList.forEach(assessment => {
        const option = document.createElement('option');
        option.textContent = assessment;
        assessmentDropdown.appendChild(option);
    });
    assessmentDropdown.value = 'Global'

}

/**
 * Sets a request to complex in the database
 * @param {int} threadId - numeric identifier for the current request
 */
function setComplex(threadId){
    return putData(('/api/data/thread/complex/'), {
        "thread_id": threadId
    }).then(() => {
            return true;
        })
        .catch(error => {
            throw error;
        });
}

/**
 * Send response to a thread
 * @param {int} threadId - numeric identifier for the current request
 */
function respond(threadId, response){
    return putData('/api/data/requests/respond/', {
        "thread_id": threadId,
        "response": response
    })
        .then(() => {
            return true;
        })
        .catch(error => {
            throw error;
        });
}

/**
 * Function to format size in bytes to KB, MB, GB, etc.
 * @param {number} bytes - number of bytes
 * @param {number} decimals - number of decimal places
 * @returns {string} - returns the formatted file size
 */
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
