/** 
 * Author: James La Fontaine, Callum Sharman
 * Date Last Modified: October 12, 2023
 * Description: Handles the headers for both instructor and student
 */

// Fill in the relevant information for the "Signed in as:" within the header
function populateSignIn() {
	let headerText = document.querySelector('.headerText');

	var usr = JSON.parse(document.getElementById('load-header-data').getAttribute('data-usr'));

	headerText.innerHTML = "Signed in as: " + usr.first_name + " " + usr.last_name;

};
/**
 * Depending on whether instructor or student (string value) 
 * loads in and fills out the appropriate _webHeader.html file
 */
function createHeader(instOrStudent) {
	let url;

	if(instOrStudent == "instructor") url = '/instructor/iWebHeader'
	else if(instOrStudent == "student") url = '/student/sWebHeader'
	else{
		console.error("ERROR: incorrect student/instructor value given in 'createHeader'")
		return;
	}

	loadTextData(url)
		.then(data =>{

			// Insert the loaded header into the headerContainer
			document.getElementById('webHeaderContainer').innerHTML = data;

			// Call populateSignIn function to populate header text
			populateSignIn();
		})
}