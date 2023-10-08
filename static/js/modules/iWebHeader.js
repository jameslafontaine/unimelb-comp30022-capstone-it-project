// Fill in the relevant information for the "Signed in as:" within the header
function populateSignIn() {
	let headerText = document.querySelector('.headerText');
	var usr = JSON.parse(document.getElementById('load-data').getAttribute('data-usr'));

	headerText.innerHTML = "Signed in as: " + usr.firstName + " " + usr.lastName;

};

// Use Fetch API to load the iWebHeader.html file
function createHeader() {
	fetch('/instructor/iWebHeader')
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


