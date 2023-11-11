/** 
 * Author: Callum Sharman, James La Fontaine, Jun Youn
 * Date Last Modified: November 12, 2023
 * Description: The entrypoint of everything good and holy Javascript related
 */

import { MAX_REQUESTS_IN_REQUEST } from './modules/constantsModule.js';
import { loadData } from './modules/dataModule.js';
import { getGlobalAppHeadersValue, setGlobalAppHeaders } from './modules/helperFunctionModule.js';
import { fillCurrentRequestInformation, fillStudentDetailsBox, generateRequestTable, generateStudentCases, generateStudentRequest, generateSubjectBox, generateSuppDocTable, generateVersionBox, handleApprovalRejectionAnswer, handleCaseSubmission, handleComplexRequestFunctionality, hideAndDisplayButtons, populateAssessmentDropdown, populatePopups, saveEdits, setupOpenClosePopupButtons } from './modules/uiPopulationModule.js';
import { createHeader, fixStyling } from './modules/webHeaderModule.js';

export function loginPage() {
    let globalAppHeaders = new Headers();
    globalAppHeaders.append(CONTENT_TYPE, 'application/json');
    globalAppHeaders.append('user_id', '');
    sessionStorage.setItem('globalAppHeaders', JSON.stringify(Object.fromEntries(globalAppHeaders.entries())));

    for (let i = 1; i <= 4; i++) {
        const option = document.createElement('option');
        option.textContent = i;
        document.getElementById('idSelection').appendChild(option);
    }

    function setId(){
        var selectedElem = document.getElementById("idSelection");
        var selectedIndex = selectedElem.selectedIndex;
        var selectedOption = selectedElem.options[selectedIndex];
        var selectedValue = selectedOption.value;
        setGlobalAppHeaders('user_id', selectedValue);
    }

    function login(){
        var url = getGlobalAppHeadersValue('user_id') <= 2 ? '/student/' : '/instructor/';
        window.location.href = url;
    }
}

/*
 * 
 * Student View
 * 
 */
export function sHome() {
    createHeader("student");
    loadData('/api/data/cases/?userid=' + getGlobalAppHeadersValue('user_id'), {}) 
        .then(data => {
            generateStudentCases(data.cases);
            fixStyling();
        })
        .catch(error => {
            throw error;
        });
}

export function viewCases() {
    createHeader("student");
    loadData('/api/data/cases?userid=' + getGlobalAppHeadersValue('user_id'))
        .then(data => {
            generateStudentCases(data.cases);
            fixStyling();
        })
}

export function viewRequest() {
    createHeader("student");

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
    
    // read in thread id from the provided data
    let threadId = JSON.parse(document.getElementById('load-thread-id').getAttribute('data-thread-id'));

    // Fill information relating to the current request from the database
    fillCurrentRequestInformation(threadId, 'Student');

    // Generate the supporting documentation for the current version of request
    generateSuppDocTable(suppDocs, '');
    
    // generate a list of all previous versions of a thread
    loadData('/api/data/thread/' + threadId, {})
        .then(data => {
            let prevVersions = data.threadinfo.requests.splice(1);
            for (let i = 0; i < prevVersions.length; i++) {
                generateVersionBox(prevVersions[i], prevVersions.length - i)
            }
            fixStyling();
        });

}

export function submitRequest() {
    createHeader("student");

    var numRequests = 1;

    // List of students current course codes
    const courseCodes = []

    const removeButton;

    loadData('/api/data/courses/?userid=' + getGlobalAppHeadersValue('user_id'), {})
        .then(data => {
            let courses = data.courses;
            courses.forEach(item => {
                courseCodes.push(item.course_code);
            })
            generateStudentRequest(numRequests, courseCodes)
            const addButton = document.getElementById('addButton');            
            const removeButton = document.getElementById('removeButton');
            
            // Add a new request when the add request button is clicked
            addButton.addEventListener('click', function() {
                numRequests += 1;
                generateStudentRequest(numRequests, courseCodes)
                if (numRequests == MAX_REQUESTS_IN_REQUEST) {
                    addButton.style.display = 'none';
                } else if (numRequests == 0) {
                    removeButton.style.display = 'none'; 
                } else if (numRequests > 0 & numRequests < MAX_REQUESTS_IN_REQUEST) {
                    removeButton.style.display = 'inline';
                    addButton.style.display = 'inline';  
                }
            });

            // Remove a request when the remove request button is clicked
            removeButton.addEventListener('click', function() {
                document.getElementById(`expandableBox${numRequests}`).remove()
                document.getElementById(`expandableBoxSection${numRequests}`).remove()
                document.getElementById(`lastLineBreak${numRequests}`).remove()
                numRequests -= 1;
                if (numRequests == MAX_REQUESTS_IN_REQUEST) {
                    addButton.style.display = 'none';   ; 
                } else if (numRequests == 0) {
                    removeButton.style.display = 'none'; 
                } else if (numRequests > 0 & numRequests < MAX_REQUESTS_IN_REQUEST) {
                    removeButton.style.display = 'inline';
                    addButton.style.display = 'inline';  
                }
            });

        });

    // Handle submit button being clicked
    var submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', function() {
        handleCaseSubmission(numRequests);
        window.location.href = '/student/';
    });

    // Handle supporting documentation tables

    fixStyling();

}

export function sEditRequest() {
    createHeader('student');

    // read in thread id from the provided data
    // let threadId = JSON.parse(document.getElementById('load-thread-id').getAttribute('data-thread-id'));

    var req1 = {
        requestId: 987654,
        creationDate: '10/10/2012',
        resolveDate: '15/10/2012',
        reserved: false,
        course: 'COMP30022 - IT Project',
        assessment: 'Project 1',
        requestType: 'Extension',
        requestTitle: 'Project 1 Extension Request',
        message: 'I am sick ;\'( why must misfortune happen to me',
        status: 'Active',
        instructorNotes: 'Rejected because medicalcertificate.pdf is a handwritten illegible letter begging for sympathy'
    };

    var prevVersions = [
    {
        date: "2011/09/24",
        message: "The power has died!! :(",
        documents: [
            { name: "iamsick.pdf", size: "20 TB" },
            { name: "bible.pdf", size: "40 MB" }
        ]
    },
    {
        date: "2011/09/23",
        message: "Haven't thought of an excuse yet.",
        documents: [
            { name: "bible.pdf", size: "40 MB" }
        ]
    }
    ];

    // TODO: Fill thread info

    // Handle edit button being clicked
    var editButton = document.getElementById('editButton');

    editButton.addEventListener('click', function() {
        saveEdits(req1, prevVersions);
        window.location.href = '/student/';
    });

    // TODO: Handle supporting documentation tables


    fixStyling();
}

export function viewAAPs() {
    createHeader('student');
    loadData('/api/data/files/' + getGlobalAppHeadersValue('user_id') + '?aaps=true', {})
        .then(data => {
            generateAAPTable(data.aaps);
            fixStyling();
        });
}

/**
 * 
 * Instructor View
 * 
 */
export function iHome() {
    createHeader('instructor');
	loadData('/api/data/courses/?userid=' + getGlobalAppHeadersValue('user_id'), {})
        .then(data => {
            let subjects = data.courses;
            // Iterate through the JSON data and create/populate expandable boxes
            subjects.forEach(subject => {
                generateSubjectBox(subject);
            });
        });
}

export function reviewRequest() {
    createHeader('instructor');

    // read in thread id from the provided data
    let threadId = JSON.parse(document.getElementById('load-thread-id').getAttribute('data-thread-id'));
    
    // read in supporting documentation list as a JSON
    let suppDocs = JSON.parse(document.getElementById('something'))

    // Fill information relating to the current request from the database
    fillCurrentRequestInformation(threadId, 'Instructor');

    // Generate the supporting documentation for the current version of request
    //generateSuppDocTable(suppDocs, '');

    // generate a list of all previous versions of a thread
    loadData('/api/data/thread/' + threadId, {})
        .then(data => {
            let prevVersions = data.threadinfo.requests.splice(1);
            // Generate version boxes for all request prevVersions in the data
            for (let i = 0; i < prevVersions.length; i++) {
                generateVersionBox(prevVersions[i], prevVersions.length - i)
            }
        });

    loadData('/api/data/thread/' + threadId, {})
        .then(data => {
            handleComplexRequestFunctionality(data.threadinfo.thread);
        })

    setupOpenClosePopupButtons();

    loadData('/api/data/thread/' + threadId, {})
        .then(data => {
            let thread = data.threadinfo.thread;
            populatePopups(thread);
            hideAndDisplayButtons(thread);
            handleApprovalRejectionAnswer(thread);
        });

    // TODO: Confirm this
    loadData('/api/data/thread/?threadid=' + threadId, {})
        .then(data => {
            fillStudentDetailsBox(data.student);
        });
    
    function toProfile(){
        loadData('/api/data/thread/?threadid=' + threadId, {})
            .then(data => {
                window.location.href = '/instructor/view-profile/' + data.student.user_id; 
            });
    }

    function back(){
        loadData('/api/data/thread/' + threadId, {})
            .then(data => {
                window.location.href = '/instructor/view-reqs/' + data.threadinfo.thread.course_id;
            })
    }

}

export function viewResolved() {
    createHeader('instructor');

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

    // read in thread id from the provided data
    let threadId = JSON.parse(document.getElementById('load-thread-id').getAttribute('data-thread-id'));

    // Fill information relating to the current request from the database
    fillCurrentRequestInformation(threadId, 'Instructor');

    // Generate the supporting documentation for the current version of request
    generateSuppDocTable(suppDocs, '');

    // generate a list of all previous versions of a thread
    loadData('/api/data/thread/' + threadId, {})
        .then(data => {
            let prevVersions = data.threadinfo.requests.splice(1);
            // Generate version boxes for all request prevVersions in the data
            for (let i = 0; i < prevVersions.length; i++) {
                generateVersionBox(prevVersions[i], prevVersions.length - i)
            }
        });

    // TODO: Confirm this
    loadData('/api/data/thread/?threadid=' + threadId, {})
        .then(data => {
            fillStudentDetailsBox(data.student);
        });
    
    function toProfile(){
        loadData('/api/data/thread/?threadid=' + threadId, {})
            .then(data => {
                window.location.href = '/instructor/view-profile/' + data.student.user_id; 
            });
    }

    function back(){
        loadData('/api/data/thread/' + threadId, {})
            .then(data => {
                window.location.href = '/instructor/view-reqs/' + data.threadinfo.thread.course_id;
            });
    }

}

export function subjectSettings() {
    createHeader('instructor');

    loadData('/api/data/courses/?courseid=' + 31, {})
        .then(data => {
            let courseData = data.course;
            let subjectCode = courseData.course_code;
            document.getElementById("title").innerHTML = subjectCode + document.getElementById("title").innerHTML;
        });

    loadData('/api/data/assessments/?courseid=' + 31 + '&names=true', {})
        .then(data => {
            populateAssessmentDropdown(data.assessments);
        });
}

export function viewProfile() {
    createHeader('instructor');

    // read in user id from the provided data
    let userId = JSON.parse(document.getElementById('load-user-id').getAttribute('data-user-id'));

    loadData('/api/data/thread/?userid=' + userId + '&status=pending', {})
        .then(data => {
            generateRequestTable(data.threads, 'Awaiting');
        });
    
    loadData('/api/data/thread/?userid=' + userId + '&status=resolved', {})
        .then(data => {
            generateRequestTable(data.threads, 'Resolved');
        });
    
    loadData('/api/data/user/' + userId, {})
        .then(user => {
            fillStudentDetailsBox(user);
        });
    
    loadData('/api/data/files/' + getGlobalAppHeadersValue('user_id')+ '?aaps=true', {})
        .then(data => {
            generateAAPTable(data.aaps);
        });

}

export function viewRequests() {
    createHeader('instructor');

    // Put subject code at start of title
    var course = JSON.parse(document.getElementById('load-data').getAttribute('data-course'));
    subjectCode = course.course_code;
    
    // Get the title by its ID
    const myElement = document.getElementById("title").innerHTML
    subjectCode + document.getElementById("title").innerHTML;

    loadData('/api/data/thread/?courseid=' + courseId, {})
        .then(data => {
            return data.threads.filter(thread => (thread.course_id == courseId) && (thread.current_status == "PENDING") );
        })
        .then(threads => {
            generateRequestTable(threads, 'Awaiting');
        });

    loadData('/api/data/thread/?courseid=' + courseId, {})
        .then(data => {
            return data.threads.filter(thread => (thread.course_id == courseId) && ((thread.current_status == "APPROVED") || (thread.current_status == "REJECTED")));
        })
        .then(threads => {
            generateRequestTable(threads, 'Resolved');
        });

}
