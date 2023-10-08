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
function populatePopups(requestData, assessmentList) {

        // Populate current deadline (THIS WILL LIKELY HAVE TO BE MODIFIED TO WORK WITH DATE TYPE)
        document.getElementById('currentDeadline').value = requestData.dueDate
        
        // Populate default extension
        document.getElementById('defaultExtension').value = requestData.defaultExtension + ' days'
        
        // Populate override extension dropdown
        for (let i = 1; i <= requestData.maxExtension; i++) {
            const option = document.createElement('option');
            option.textContent = i;
            document.getElementById('extensionOverrideAExt').appendChild(option);
        }
        
        // Set extension override to match default extension
        document.getElementById('extensionOverrideAExt').value = requestData.defaultExtension
        
        // Populate student selected assessment
        document.getElementById('selectedAssessmentAExt').value = requestData.assessment
        document.getElementById('selectedAssessmentRExt').value = requestData.assessment
        document.getElementById('selectedAssessmentARem').value = requestData.assessment
        document.getElementById('selectedAssessmentRRem').value = requestData.assessment
        document.getElementById('selectedAssessmentAQui').value = requestData.assessment
        document.getElementById('selectedAssessmentRQui').value = requestData.assessment
        
        
        // Get all elements with the class "assessmentOverride"
        const overrideDropdowns = document.querySelectorAll('.assessmentOverride');
        
        // Populate override assessment dropdowns
        overrideDropdowns.forEach(overrideDropdown => {
            assessmentList.forEach(assessment => {
                const option = document.createElement('option');
                option.textContent = assessment;
                overrideDropdown.appendChild(option);
            });
            overrideDropdown.value = requestData.assessment;
        });
}


/** 
 * Hides and display the required buttons for a request review depending on request type
 * Only the answer button is displayed for queries and other requests.
 * The approve and reject buttons are displayed for all other request types
 * 
 */
function HideAndDisplayButtons(requestType) {

    const reqShort = requestType.substring(0,3);

    if (requestType != 'Query' && requestType != 'Other') {
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
function handleApprovalRejectionAnswer(requestData, requestType) {

    // First 3 letters of request type used for HTML identifiers
    reqShort = requestType.substring(0,3)



    // Initialise approve and request buttons for all request types except queries and other
    if (requestType != "Query" && requestType != "Other") {
        // Get the Approve Request button
        const popupApproveButton = document.getElementById(`popupApproveButton${reqShort}`);
        
        // Add click event listener to Approve Request button
        popupApproveButton.addEventListener('click', function() {
            
            // Update relevant information
            if (requestType == 'Extension') {
                
                requestData.approvedExtension = document.getElementById('extensionOverrideAExt').value
                console.log('Approved Extension: ', requestData.approvedExtension);
            }
            
            requestData.instructorNotes = document.getElementById(`instructorNotesA${reqShort}`).value
            console.log('Instructor Notes: ', requestData.instructorNotes);
            
            requestData.assessment = document.getElementById(`assessmentOverrideA${reqShort}`).value
            console.log('Selected Assessment Override: ', requestData.assessment);
            
            requestData.status = 'Approved'
            console.log('Updated Request Status: ', requestData.status);
            
            // Change the page to iViewRequests.html (could make a confirmation page or just show confirmation message at top)
            window.location.href = '/instructor/view-reqs';
            
        });
        
        // Get the Reject Request button
        const popupRejectButton = document.getElementById(`popupRejectButton${reqShort}`);
        
        // Add click event listener to Reject Request button
        popupRejectButton.addEventListener('click', function() {
            
            // Update the relevant information
            requestData.instructorNotes = document.getElementById(`instructorNotesR${reqShort}`).value
            console.log('Instructor Notes: ', requestData.instructorNotes);
            
            requestData.assessment = document.getElementById(`assessmentOverrideR${reqShort}`).value
            console.log('Selected Assessment Override: ', requestData.assessment);
            
            requestData.status = 'Rejected'
            console.log('Updated Request Status: ', requestData.status);
            
            // Change the page to iViewRequests.html (could make a confirmation page or just show confirmation message at top)
            window.location.href = '/instructor/view-reqs';
            
        });

    // Initialise Answer button for queries and other requests
    } else {
        // Get the Answer button
        const popupAnswerButton = document.getElementById('popupAnswerButton');
        
        // Add click event listener to the Answer button
        popupAnswerButton.addEventListener('click', function() {
            
            // Update the relevant information
            requestData.instructorNotes = document.getElementById('instructorNotesAns').value
            console.log('Instructor Notes: ', requestData.instructorNotes);
            
            requestData.status = 'Answered'
            console.log('Updated Request Status: ', requestData.status);
            
            // Change the page to iViewRequests.html (could make a confirmation page or just show confirmation message at top)
            window.location.href = '/instructor/view-reqs';
        });
    }
}