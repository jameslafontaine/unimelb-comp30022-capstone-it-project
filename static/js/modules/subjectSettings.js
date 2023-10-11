/** 
 * Author: James La Fontaine
 * Date Last Modified: October 5, 2023
 * Description: Handles the subject settings page
 */

/** 
 * Populates the assessment override dropdowns, extension override dropdown, and the 
 * current deadline, extension and assessment boxes 
 */
function populateAssessmentDropdown(assessmentList) {
    
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