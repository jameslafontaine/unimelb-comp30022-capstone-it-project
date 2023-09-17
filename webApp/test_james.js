/*********** TEST DATA ***********/

let instructor = {
	id: 1234567890,
	title: 'Prof.',
	firstName: 'Joe',
	lastName: 'Bloggs',
	email: 'jbloggs@unimelb.edu.au',
	//emailPreference: false // i actually have no idea what this type is lol
};

let student = {
	id: 1234567890,
	firstName: 'John',
	lastName: 'Smith',
	email: 'jsmith@unimelb.edu.au',
	//emailPreference: false // i actually have no idea what this type is lol
};

// request case (case) (can't use the name case, i think its a keyword)
let reqCase1 = {
	id: 34252345,
	studentId: 2834589734,
	dateCreated: "27/11/2001",
	dateUpdated: "28/11/2001"
};

let reqCase2 = {
	id: 67564728,
	studentId: 7777777777,
	dateCreated: "01/01/0001",
	dateUpdated: "99/99/9999"
};

let cases = [reqCase1, reqCase2];

let request = {
	id:'75896',
	course: "COMP30026",
	dateCreated: 12/12/2013,
	status: "unresolved",
};


// These will be retrieved from an instructor in the database
let subjects = [
	{
	  code: "COMP30022",
	  numReserved: 1,
	  numUnresolved: 1,
	},
	{
	  code: "MAST30027",
	  numReserved: 5,
	  numUnresolved: 21,
	},
	{
		code: "MAST30034",
		numReserved: 0,
		numUnresolved: 14,
	  },
  ];





/*********** FUNCTIONS ***********/

function changeSignIn() { // Is there a good way we can generalise this to both instructors and students either through the code or through the database?
	document.getElementById('headerText').innerHTML = "Signed in as: " + instructor.title + " " + instructor.firstName  + " " + instructor.lastName + " [Instructor]";
};
changeSignIn();

function addSubject(subject) {
	let clone = template.content.cloneNode(true);
	clone.querySelector(".expandableBox").textContent = 'Case #' + reqCase.id + ' Last updated: ' + reqCase.dateUpdated;

	let span = document.createElement('span');
	span.className = 'expandButton';
	span.textContent = '4/4 Waiting for Action, 0/4 Approved, 0/4 Rejected -';
	clone.querySelector(".expandableBox").append(span);

	template.after(clone);
	return clone;
};

/*
// Function to populate the expandable box with JSON data
function populateExpandableBox(subject) {
	// Get the elements
	const subjectCodeElement = document.querySelector('.subjectCode');
	const expandableBoxContents = document.querySelector('.expandableBoxContents');
  
	// Create a text string based on the subject JSON
	const textContent = `${subject.code} (${subject.numReserved} reserved, ${subject.numUnresolved} unresolved)`;
  
	// Update the text content of the subjectCodeElement
	subjectCodeElement.textContent = textContent;
  

  }
  
  // Call the function with the JSON data
  populateExpandableBox(subject1);
*/

// Function to create and populate an expandable box
function createAndPopulateSubjectBox(subject) {
	// Create a new expandable box element
	const expandableBox = document.createElement('div');
	expandableBox.classList.add('expandableBox');
  
	// Create the expandableBoxContents element
	const expandableBoxContents = document.createElement('div');
	expandableBoxContents.classList.add('expandableBoxContents');
	expandableBoxContents.style.fontSize = '13px';
  
	// Create the subjectCode element
	const subjectCodeElement = document.createElement('span');
	subjectCodeElement.textContent = `${subject.code} (${subject.numReserved} reserved, ${subject.numUnresolved} unresolved)`;
  
	// Create the rightItems container
	const rightItems = document.createElement('span');
	rightItems.classList.add('rightItems');
  
	// Create the "View Requests & Queries" button
	const viewRequestsButton = document.createElement('button');
	viewRequestsButton.classList.add('standardButton');
	viewRequestsButton.textContent = 'View Requests & Queries';
	viewRequestsButton.onclick = function() {
	  // Handle button click (navigate to viewRequests.html or perform other actions)
	};
  
	// Create the "Settings" button, but only if instructor is subject coordinator
	const settingsButton = document.createElement('button');
	settingsButton.classList.add('standardButton');
	settingsButton.textContent = 'Settings';
	settingsButton.onclick = function() {
	  // Handle button click (navigate to subjectSettings.html or perform other actions)
	};
  
	// Append the elements to their respective parent elements
	rightItems.appendChild(viewRequestsButton);
	rightItems.appendChild(settingsButton);
	expandableBoxContents.appendChild(subjectCodeElement);
	expandableBoxContents.appendChild(rightItems);
	expandableBox.appendChild(expandableBoxContents);
  
	// Append the expandable box to the container
	document.getElementById('expandableBoxContainer').appendChild(expandableBox);
  }
  
  // Iterate through the JSON data and create/populate expandable boxes
  subjects.forEach(subject => {
	createAndPopulateSubjectBox(subject);
  });


function addCase(reqCase){
	let template = document.getElementById("expandableBox");
	let clone = template.content.cloneNode(true);
	clone.querySelector(".expandableBoxContents").textContent = 'Case #' + reqCase.id + ' Last updated: ' + reqCase.dateUpdated;

	let span = document.createElement('span');
	span.className = 'expandButton';
	span.textContent = '4/4 Waiting for Action, 0/4 Approved, 0/4 Rejected -';
	clone.querySelector(".expandableBoxContents").append(span);

	template.after(clone);
	return clone;
};

function addRequest(request){
	let template = document.getElementById("expandableBoxSection");
	let clone = template.content.cloneNode(true);
	clone.querySelector(".expandableBoxContents").textContent = '#' + request.id + ' ' + request.course;

	let span = document.createElement('span');
	span.className = 'rightItems';
	span.textContent = 'Waiting for action ';
	clone.querySelector(".expandableBoxContents").append(span);

	let button = document.createElement('button');
	button.className = 'standardButton';
	button.textContent = 'View Details';
	span.append(button);

	document.body.append(clone);
	return clone;
};

function addCases(cases){
	for(reqCase of cases){
		caseNode = addCase(reqCase);
	}
};

addCases(cases);
addRequest(request);