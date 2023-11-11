let subjectCoordinator = {
	id: 1234567890,
	title: 'Prof.',
	firstName: 'Joe',
	lastName: 'Bloggs',
	role: 'SC',
	email: 'jbloggs@unimelb.edu.au',
	//emailPreference: false // i actually have no idea what this type is lol
};

let student = {
	id: 1234567890,
	title: 'Mr.',
	firstName: 'John',
	lastName: 'Smith',
	email: 'jsmith@student.unimelb.edu.au',
	role: 'student'
	//emailPreference: false // i actually have no idea what this type is lol
};

let tutor = {
	id: 1234567890,
	title: 'Mrs.',
	firstName: 'Jane',
	lastName: 'Doe',
	email: 'jdoe@unimelb.edu.au',
	role: 'tutor'
	//emailPreference: false // i actually have no idea what this type is lol
};

// Fill in the relevant information for the "Signed in as:" within the header
function populateSignIn(user) {
	let headerText = document.querySelector('.headerText');
	if (user.role == 'SC') {
		headerText.innerHTML = "Signed in as: " + " " + user.firstName + " " + user.lastName + " [Subject Coordinator]";
	} else if (user.role == 'student') {
		headerText.innerHTML = "Signed in as: " + " " + user.firstName + " " + user.lastName + " [Student]";
	} else if (user.role == 'tutor') {
		headerText.innerHTML = "Signed in as: " + " " + user.firstName + " " + user.lastName + " [Tutor]";
	}
};



// Use Fetch API to load the iWebHeader.html file
function createHeader(user) {
	fetch('iWebHeader.html')
	.then(response => response.text())
	.then(data => {
		// Insert the loaded header into the headerContainer
		document.getElementById('webHeaderContainer').innerHTML = data;
		
		// Call populateSignIn function to populate header text
		populateSignIn(user);
	})
	.catch(error => console.error(error));
}

createHeader(subjectCoordinator)


