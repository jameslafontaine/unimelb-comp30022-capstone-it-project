let student = {
	id: 1234567890,
	firstName: 'John',
	lastName: 'Smith',
	email: 'jsmith@student.unimelb.edu.au',
	emailPreference: false // i actually have no idea what this type is lol
};

function changeSignIn() {
	document.getElementById('headerText').innerHTML = "Signed in as: " + student.firstName + " " + student.lastName;
}
changeSignIn();

// request case (case) (can't use the name case, i think its a keyword)
let reqCase1 = {
	id: 34252345,
	studentId: 2834589734,
	dateCreated: "27/11/2001",
	dateUpdated: "28/11/2001"
}

let reqCase2 = {
	id: 67564728,
	studentId: 7777777777,
	dateCreated: "01/01/0001",
	dateUpdated: "99/99/9999"
}

let cases = [reqCase1, reqCase2];

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
}

let request = {
	id:'75896',
	course: "COMP30026",
	dateCreated: 12/12/2013,
	status: "unresolved",
}

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
}

function addCases(cases){
	for(reqCase of cases){
		caseNode = addCase(reqCase);
	}
}

addCases(cases);
addRequest(request);