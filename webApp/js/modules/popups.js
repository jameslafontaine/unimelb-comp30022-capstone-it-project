/** 
 * Sets up the buttons for opening and closing the popups
 */
function setupOpenClosePopupButtons() {
    const buttons = document.querySelectorAll('.bigButton');
    const popups = document.querySelectorAll('.popupBox');
    
    buttons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the click event from reaching the parent element
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
 * Populates the assessment override dropdowns, extension override dropdown, and the 
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
        document.getElementById('extensionOverrideA').appendChild(option);
    }
    
    // Set extension override to match default extension
    document.getElementById('extensionOverrideA').value = requestData.defaultExtension

    // Populate student selected assessment
    document.getElementById('selectedAssessmentA').value = requestData.assessment
    document.getElementById('selectedAssessmentR').value = requestData.assessment
    
    
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
 * Updates the appropriate information when a case is approved or rejected and performs any other
 * steps that are required
 */
function handleApprovalAndRejection(requestData) {
    // Get the Approve Request button
    const popupApproveButton = document.getElementById('popupApproveButton');
            
    // Add click event listener to Approve Request button
    popupApproveButton.addEventListener('click', function() {
        
        // Update relevant information
        requestData.approvedExtension = document.getElementById('extensionOverrideA').value
        console.log('Approved Extension: ', requestData.approvedExtension);

        requestData.instructorNotes = document.getElementById('instructorNotesA').value
        console.log('Instructor Notes: ', requestData.instructorNotes);
        
        requestData.assessment = document.getElementById('assessmentOverrideA').value
        console.log('Selected Assessment Override: ', requestData.assessment);
        
        requestData.status = 'Approved'
        console.log('Updated Request Status: ', requestData.status);
        
        // Change the page to iViewRequests.html (could make a confirmation page or just show confirmation message at top)
        window.location.href = 'iViewRequests.html';
        
    });
    
    // Get the Reject Request button and the dropdown element
    const popupRejectButton = document.getElementById('popupRejectButton');
    
    // Add click event listener to Reject Request button
    popupRejectButton.addEventListener('click', function() {
        
        // Update the relevant information
        requestData.instructorNotes = document.getElementById('instructorNotesR').value
        console.log('Instructor Notes: ', requestData.instructorNotes);
        
        requestData.assessment = document.getElementById('assessmentOverrideR').value
        console.log('Selected Assessment Override: ', requestData.assessment);
        
        requestData.status = 'Rejected'
        console.log('Updated Request Status: ', requestData.status);
        
        // Change the page to iViewRequests.html (could make a confirmation page or just show confirmation message at top)
        window.location.href = 'iViewRequests.html';
        
    });
}