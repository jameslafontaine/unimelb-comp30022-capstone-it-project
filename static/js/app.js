/** 
 * Author: Callum Sharman, James La Fontaine, Jun Youn
 * Date Last Modified: November 12, 2023
 * Description: The entrypoint of everything good and holy Javascript related
 */

import { MAX_REQUESTS_IN_REQUEST } from './modules/constantsModule.js';
import { loadData } from './modules/dataModule.js';
import { getGlobalAppHeadersValue } from './modules/helperFunctionModule.js';
import { fillCurrentRequestInformation, generateStudentCases, generateStudentRequest, generateSuppDocTable, generateVersionBox, handleCaseSubmission, saveEdits } from './modules/uiPopulationModule.js';
import { createHeader, fixStyling } from './modules/webHeaderModule.js';

/**
 * Student View functions
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
                    addButton.style.display = 'none';   ; 
                } else if (numRequests == 0) {
                    removeButton.style.display = 'none'; 
                } else if (numRequests > 0 & numRequests < MAX_REQUESTS_IN_REQUEST) {
                    removeButton.style.display = 'inline';
                    addButton.style.display = 'inline';  
                }
            });
        })
    
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
    let threadId = JSON.parse(document.getElementById('load-thread-id').getAttribute('data-thread-id'));

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

    // Handle supporting documentation tables


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
