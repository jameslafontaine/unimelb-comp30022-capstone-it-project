/** 
 * Author: James La Fontaine
 * Date Last Modified: October 5, 2023
 * Description: Handles the functionality of popups
 */

/** 
 * Sets up the buttons for opening and closing the popups
 */
function setupOpenClosePopupButtons() {
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
 * Populates the popup with assessment override dropdowns, extension override dropdown, and the 
 * current deadline, extension and assessment boxes 
 */
function populatePopups(thread) {

    loadAssignment(thread.assignment_id)
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
        })

    // Populate override extension dropdown
    for (let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.textContent = i;
        document.getElementById('extensionOverrideAExt').appendChild(option);
    }

    iloadCoursePreferenceFromThread(thread.thread_id)
        .then(prefs => {
            // Populate default extension
            document.getElementById('defaultExtension').value = prefs.global_extension_length;
            // Set extension override to match default extension
            document.getElementById('extensionOverrideAExt').value = prefs.global_extension_length;
        })

}


/** 
 * Hides and display the required buttons for a request review depending on request type
 * Only the answer button is displayed for queries and other requests.
 * The approve and reject buttons are displayed for all other request types
 * 
 */
function HideAndDisplayButtons(thread) {

    const reqShort = thread.request_type.substring(0,3);

    if (thread.request_type != 'Query' && thread.request_type != 'Other') {
        document.getElementById('approveButton').setAttribute('data-target', `approve${reqShort}Popup`);
        document.getElementById('rejectButton').setAttribute('data-target', `reject${reqShort}Popup`);
        $("#answerButton").hide();

    } else {
        document.getElementById('answerButton').setAttribute('data-target', 'answerPopup');
        $("#approveButton").hide();
        $("#rejectButton").hide();
    }
}


/** 
 * Updates the appropriate information when a request is approved, rejected or answered and performs any other
 * steps that are required
 */
function handleApprovalRejectionAnswer(thread) {


    // First 3 letters of request type used for HTML identifiers
    reqShort = thread.request_type.substring(0,3)

    // Initialise approve and request buttons for all request types except queries and other
    if (thread.request_type != "Query" && thread.request_type != "Other") {
        // Get the Approve Request button
        const popupApproveButton = document.getElementById(`popupApproveButton${reqShort}`);
        
        // Add click event listener to Approve Request button
        popupApproveButton.addEventListener('click', function() {
            
            // Update relevant information
            /*
            if (thread.request_type == 'Extension') {
                
                requestData.approvedExtension = document.getElementById('extensionOverrideAExt').value
                console.log('Approved Extension: ', requestData.approvedExtension);
            }
            */
            /*
            requestData.instructorNotes = document.getElementById(`instructorNotesA${reqShort}`).value
            console.log('Instructor Notes: ', requestData.instructorNotes);
            
            requestData.assessment = document.getElementById(`assessmentOverrideA${reqShort}`).value
            console.log('Selected Assessment Override: ', requestData.assessment);
            
            requestData.status = 'Approved'
            console.log('Updated Request Status: ', requestData.status);
            */
            // Change the page to home (could make a confirmation page or just show confirmation message at top)
            redirectHome();
            
        });
        
        // Get the Reject Request button
        const popupRejectButton = document.getElementById(`popupRejectButton${reqShort}`);
        
        // Add click event listener to Reject Request button
        popupRejectButton.addEventListener('click', function() {
            
            // Update the relevant information
            /*
            requestData.instructorNotes = document.getElementById(`instructorNotesR${reqShort}`).value
            console.log('Instructor Notes: ', requestData.instructorNotes);
            
            requestData.assessment = document.getElementById(`assessmentOverrideR${reqShort}`).value
            console.log('Selected Assessment Override: ', requestData.assessment);
            
            requestData.status = 'Rejected'
            console.log('Updated Request Status: ', requestData.status);
            */
            // Change the page to home (could make a confirmation page or just show confirmation message at top)
            redirectHome();
            
        });

    // Initialise Answer button for queries and other requests
    } else {
        // Get the Answer button
        const popupAnswerButton = document.getElementById('popupAnswerButton');
        
        // Add click event listener to the Answer button
        popupAnswerButton.addEventListener('click', function() {
            
            // Update the relevant information
            /*
            requestData.instructorNotes = document.getElementById('instructorNotesAns').value
            console.log('Instructor Notes: ', requestData.instructorNotes);
            
            requestData.status = 'Answered'
            console.log('Updated Request Status: ', requestData.status);
            */
            // Change the page to home (could make a confirmation page or just show confirmation message at top)
            redirectHome();
        });
    }
}