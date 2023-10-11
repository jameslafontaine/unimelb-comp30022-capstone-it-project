/** 
 * Author: James La Fontaine, Callum Sharmans=
 * Date Last Modified: October 11, 2023
 * Description: Handles the students header
 */

// Fill in the relevant information for the "Signed in as:" within the header
function populateSignIn() {
	let headerText = document.querySelector('.headerText');
	var usr = JSON.parse(document.getElementById('load-header-data').getAttribute('data-usr'));
	console.log("usr: ", usr);
	headerText.innerHTML = "Signed in as: " + usr.first_name + " " + usr.last_name;

};

// Use Fetch API to load the sWebHeader.html file
function createHeader() {
	fetch('/student/sWebHeader')
	.then(response => response.text())
	.then(data => {
		// Insert the loaded header into the headerContainer
		document.getElementById('webHeaderContainer').innerHTML = data;
		// Call populateSignIn function to populate header text
		populateSignIn();
	})
	.catch(error => console.error(error));
}

createHeader()


