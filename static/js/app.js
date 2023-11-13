/** 
 * Author: Callum Sharman, James La Fontaine, Jun Youn
 * Date Last Modified: November 12, 2023
 * Description: The entrypoint of everything good and holy Javascript related
 */

import { CONTENT_TYPE, MAX_REQUESTS_IN_REQUEST } from './modules/constantsModule.js';
import { loadData, putData } from './modules/dataModule.js';
import { getGlobalAppHeadersValue } from './modules/helperFunctionModule.js';
import { fillCurrentRequestInformation, fillStudentDetailsBox, generateAAPTable, generateRequestTable, generateStudentCases, generateStudentRequest, generateSubjectBox, generateSuppDocTable, generateVersionBox, handleApprovalRejectionAnswer, handleCaseSubmission, handleComplexRequestFunctionality, hideAndDisplayButtons, populateAssessmentDropdown, populatePopups, saveEdits, setupOpenClosePopupButtons } from './modules/uiPopulationModule.js';
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
                    addButton.style.display = 'none';
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
        })
        .catch(error => {
            // Log the error
            console.error('Error:', error);
    
            // Use a dummy placeholder JSON
            let dummyData = {
                aaps: []
            };
    
            // Generate the AAP table with the dummy data
            generateAAPTable(dummyData.aaps);
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

    loadData('/api/data/thread/?threadid=' + threadId, {})
        .then(data => {
            fillStudentDetailsBox(data.student);
        });

    var editButton = document.getElementById('editButton');
    editButton.addEventListener("click", function() {
        window.location.href = '/student/edit-req/' + threadId;
    });

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

    loadData('/api/data/thread/?threadid=' + threadId, {})
        .then(data => {
            fillStudentDetailsBox(data.student);
        });

}

export function subjectSettings() {
    createHeader('instructor');

    let courseId = JSON.parse(document.getElementById('load-course-id').getAttribute('data-course-id'));

    loadData('/api/data/courses/?courseid=' + courseId, {})
        .then(data => {
            let courseData = data.course;
            let subjectCode = courseData.course_code;
            document.getElementById("title").innerHTML = subjectCode + document.getElementById("title").innerHTML;
            fixStyling();
            loadData('/api/data/assessments/?courseid=' + courseId + '&names=true', {})
                .then(data => {
                    populateAssessmentDropdown(data.assessments);
                    fixStyling();
                });
        });
    
    // Populate subject settings

    let coursePrefData;

    // Initialise variables
    loadData('/api/data/courses?courseid=' + courseId + '&preferences=true')
        .then(data => {
            coursePrefData = data.coursepreferences;
            //console.log(coursePrefData);
            document.getElementById('extensionLengthInput').value = coursePrefData.global_extension_length;
            
            var extensionTutorCheckBox = document.getElementById('extensionTutorCheck');
            (coursePrefData.extension_tutor == 1) ? extensionTutorCheckBox.checked = true : extensionTutorCheckBox.checked = false;
            extensionTutorCheckBox.addEventListener("change", function() {
                this.checked ? coursePrefData.extension_tutor = 1 : coursePrefData.extension_tutor = 0;
            });

            var extensionCoordCheckBox = document.getElementById('extensionCoordCheck');
            (coursePrefData.extension_scoord == 1) ? extensionCoordCheckBox.checked = true : extensionCoordCheckBox.checked = false;
            extensionCoordCheckBox.addEventListener("change", function() {
                this.checked ? coursePrefData.extension_scoord = 1 : coursePrefData.extension_scoord = 0;
            });

            var extensionApproveSaveButton = document.getElementById('extensionApproveSave');
            var extensionApproveMsgBox = document.getElementById('extensionApproveMsg');
            extensionApproveMsgBox.value = coursePrefData.extension_approve;
            extensionApproveSaveButton.addEventListener("click", function() {
                coursePrefData.extension_approve = extensionApproveMsgBox.value;
            });

            var extensionRejectSaveButton = document.getElementById('extensionRejectSave');
            var extensionRejectMsgBox = document.getElementById('extensionRejectMsg');
            extensionRejectMsgBox.value = coursePrefData.extension_reject;
            extensionRejectSaveButton.addEventListener("click", function() {
                coursePrefData.extension_reject = extensionRejectMsgBox.value;
            });

            var generalTutorCheckBox = document.getElementById('generalTutorCheck');
            (coursePrefData.general_tutor == 1) ? generalTutorCheckBox.checked = true : generalTutorCheckBox.checked = false;
            generalTutorCheckBox.addEventListener("change", function() {
                this.checked ? coursePrefData.general_tutor = 1 : coursePrefData.general_tutor = 0;
            });

            var generalCoordCheckBox = document.getElementById('generalCoordCheck');
            (coursePrefData.general_scoord == 1) ? generalCoordCheckBox.checked = true : generalCoordCheckBox.checked = false;
            generalCoordCheckBox.addEventListener("change", function() {
                this.checked ? coursePrefData.general_scoord = 1 : coursePrefData.general_scoord = 0;
            });

            var generalRejectSaveButton = document.getElementById('generalRejectSave');
            var generalRejectMsgBox = document.getElementById('generalRejectMsg');
            generalRejectMsgBox.value = coursePrefData.general_reject;
            generalRejectSaveButton.addEventListener("click", function() {
                coursePrefData.general_reject = generalRejectMsgBox.value;
            });

            var remarkTutorCheckBox = document.getElementById('remarkTutorCheck');
            (coursePrefData.remark_tutor == 1) ? remarkTutorCheckBox.checked = true : remarkTutorCheckBox.checked = false;
            remarkTutorCheckBox.addEventListener("change", function() {
                this.checked ? coursePrefData.remark_tutor = 1 : coursePrefData.remark_tutor = 0;
            });

            var remarkCoordCheckBox = document.getElementById('remarkCoordCheck');
            (coursePrefData.remark_scoord == 1) ? remarkCoordCheckBox.checked = true : remarkCoordCheckBox.checked = false;
            remarkCoordCheckBox.addEventListener("change", function() {
                this.checked ? coursePrefData.remark_scoord = 1 : coursePrefData.remark_scoord = 0;
            });

            var remarkApproveSaveButton = document.getElementById('remarkApproveSave');
            var remarkApproveMsgBox = document.getElementById('remarkApproveMsg');
            remarkApproveMsgBox.value = coursePrefData.remark_approve;
            remarkApproveSaveButton.addEventListener("click", function() {
                coursePrefData.remark_approve = remarkApproveMsgBox.value;
            });

            var remarkRejectSaveButton = document.getElementById('remarkRejectSave');
            var remarkRejectMsgBox = document.getElementById('remarkRejectMsg');
            remarkRejectMsgBox.value = coursePrefData.remark_reject;
            remarkRejectSaveButton.addEventListener("click", function() {
                coursePrefData.remark_reject = remarkRejectMsgBox.value;
            });

            var quizTutorCheckBox = document.getElementById('quizTutorCheck');
            (coursePrefData.quiz_tutor == 1) ? quizTutorCheckBox.checked = true : quizTutorCheckBox.checked = false;
            quizTutorCheckBox.addEventListener("change", function() {
                this.checked ? coursePrefData.quiz_tutor = 1 : coursePrefData.quiz_tutor = 0;
            });

            var quizCoordCheckBox = document.getElementById('quizCoordCheck');
            (coursePrefData.quiz_scoord == 1) ? quizCoordCheckBox.checked = true : quizCoordCheckBox.checked = false;
            quizCoordCheckBox.addEventListener("change", function() {
                this.checked ? coursePrefData.quiz_scoord = 1 : coursePrefData.quiz_scoord = 0;
            });

            var quizApproveSaveButton = document.getElementById('quizApproveSave');
            var quizApproveMsgBox = document.getElementById('quizApproveMsg');
            quizApproveMsgBox.value = coursePrefData.quiz_approve;
            quizApproveSaveButton.addEventListener("click", function() {
                coursePrefData.quiz_approve = quizApproveMsgBox.value;
            });

            var quizRejectSaveButton = document.getElementById('quizRejectSave');
            var quizRejectMsgBox = document.getElementById('quizRejectMsg');
            quizRejectMsgBox.value = coursePrefData.quiz_reject;
            quizRejectSaveButton.addEventListener("click", function() {
                coursePrefData.quiz_reject = quizRejectMsgBox.value;
            });

            var otherTutorCheckBox = document.getElementById('otherTutorCheck');
            (coursePrefData.other_tutor == 1) ? otherTutorCheckBox.checked = true : otherTutorCheckBox.checked = false;
            otherTutorCheckBox.addEventListener("change", function() {
                this.checked ? coursePrefData.other_tutor = 1 : coursePrefData.other_tutor = 0;
            });

            var otherCoordCheckBox = document.getElementById('otherCoordCheck');
            (coursePrefData.other_scoord == 1) ? otherCoordCheckBox.checked = true : otherCoordCheckBox.checked = false;
            otherCoordCheckBox.addEventListener("change", function() {
                this.checked ? coursePrefData.other_scoord = 1 : coursePrefData.other_scoord = 0;
            });

            var otherRejectSaveButton = document.getElementById('otherRejectSave');
            var otherRejectMsgBox = document.getElementById('otherRejectMsg');
            otherRejectMsgBox.value = coursePrefData.other_reject;
            otherRejectSaveButton.addEventListener("click", function() {
                coursePrefData.general_reject = otherRejectMsgBox.value;
            });

        });

    // If dropdown box is changed, get the assessment specific extension length
    var assessmentDropdownBox = document.getElementById('assessmentDropdown');
    assessmentDropdownBox.addEventListener("change", function() {
        if (this.value == "Global") {
            document.getElementById('extensionLengthInput').value = coursePrefData.global_extension_length;
        } else {
            loadData('/api/data/assessments?courseid=' + courseId)
                .then(data => {
                    let assessments = data.assessments;
                    for (let i = 0; i < assessments.length; i++) {
                        if (assessments[i].assigment_name == this.value) {
                            // Endpoint to get a specific assignment's preferences
                            loadData('/api/data/preferences/' + assessments[i].assignment_id, {})
                                .then(data => {
                                    document.getElementById('extensionLengthInput').value = data.extension_length;
                                });
                            break;
                        }
                    }
                });
        }
    });

    var saveExtensionLengthButton = document.getElementById('saveExtensionLength');
    saveExtensionLengthButton.addEventListener("click", function() {
        if (this.value == "Global") {
            coursePrefData.global_extension_length = document.getElementById('extensionLengthInput').value;
        } else {
            loadData('/api/data/assessments?courseid=' + courseId)
                .then(data => {
                    let assessments = data.assessments;
                    for (let i = 0; i < assessments.length; i++) {
                        if (assessments[i].assigment_name == this.value) {
                            // Endpoint to set a specific assignment's preferences
                            putData('/api/data/assessments/setpreferences', {
                                'coursepreference_id': coursePrefData.coursepreference_id,
                                'assignment_id': assessments[i].assignment_id,
                                'extension_length': document.getElementById('extensionLengthInput').value
                            });
                            console.log(document.getElementById('extensionLengthInput').value);
                            break;
                        }
                    }
                });
        }
    });

    // PUT coursePrefData via a new endpoint
    
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
        }).catch(error => {
            // Log the error
            console.error('Error:', error);
    
            // Use a dummy placeholder JSON
            let dummyData = {
                aaps: []
            };
    
            // Generate the AAP table with the dummy data
            generateAAPTable(dummyData.aaps);
            fixStyling();
        });;

}

export function viewRequests() {
    createHeader('instructor');

    // Put subject code at start of title
    var courseId = JSON.parse(document.getElementById('load-data').getAttribute('data-course'));
    courseId = 31; // TODO: remove

    loadData('/api/data/courses?courseid=' + courseId)
        .then(data => {
            let subjectCode = data.course.course_code;
            document.getElementById("title").innerHTML = subjectCode + document.getElementById("title").innerHTML;
        });

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
