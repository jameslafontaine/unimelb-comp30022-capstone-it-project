/** 
 * Author: James La Fontaine, Callum Sharman
 * Date Last Modified: October 26, 2023
 * Description: handles the students edit request page
 */

/** 
 * Hides the edit button if a case is resolved
 */
function hideEditButton() {
    document.getElementById("editButton").remove()
}

/** 
 * Saves the edits to a request made by a student while keeping the old information
 */
function saveEdits(currRequest, prevVersions) {

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