/** 
 * Author: James La Fontaine, Callum Sharman
 * Date Last Modified: October 11, 2023
 * Description: handles the loading/creating of subject boxes
 */

// These will be retrieved from an instructor in the database
let subjects = new Array();
let usrId;

function loadSubjectBoxData(){
	return getUserId()
		.then(() => getSubjects())
		.catch(error => {
			console.error('Error:', error);
		});

}

// gets the users id and puts it into usrId for future use
function getUserId(){
	return fetch('/instructor/get-user-id/')
		.then(response => response.json())
		.then(data => {
			usrId = data.id;
			//console.log('usrId', usrId);
		})
		.catch(error => {
			console.error('Error:', error);
		});

}


	
// Calls the api and makes a list of the subjects (courses)
function getSubjects(){
	url = '/instructor/courses/' + usrId;
	return fetch(url)
        .then(response => response.json())
        .then(data => {
            subjects = JSON.parse(data.courses);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// Function to create and populate an expandable subject box
function generateSubjectBox(subject) {
	// Create a new expandable box element
	const standardBox  = document.createElement('div');
	standardBox.classList.add('standardBox');
  
	// Create the standardBoxContents element
	const standardBoxContents = document.createElement('div');
	standardBoxContents.classList.add('standardBoxContents');
	standardBoxContents.style.fontSize = '13px';
  
	// Create the subjectCode element
	const subjectCodeElement = document.createElement('span');
	subjectCodeElement.textContent = `${subject.subject_name}`;
	
	// change to this when you can get the numreserved and unresolved
	//subjectCodeElement.textContent = `${subject.course_id} (${subject.numReserved} reserved, ${subject.numUnresolved} unresolved)`;
	
	// Create the rightItems container
	const rightItems = document.createElement('span');
	rightItems.classList.add('rightItems');
  
	// Create the "View Requests & Queries" button
    // Will have to hide or grey out and have popup on hover if tutor has not been given permission by subject coordinator to view any requests
	const viewRequestsButton = document.createElement('button');
	viewRequestsButton.classList.add('standardButton');
	viewRequestsButton.textContent = 'View Requests & Queries';
	viewRequestsButton.onclick = function() {
		window.location.href = '/instructor/view-reqs/' + subject.course_id; 
	};
  
	// Create the "Settings" button
    // Will have to hide or grey out and have popup on hover if instructor is not subject coordinator
	const settingsButton = document.createElement('button');
	settingsButton.classList.add('standardButton');
	settingsButton.textContent = 'Settings';
	settingsButton.onclick = function() {
		window.location.href = '/instructor/subject-settings/' + subject.course_id; 
	};
  
	// Append the elements to their respective parent elements
	rightItems.appendChild(viewRequestsButton);
	rightItems.appendChild(settingsButton);
	standardBoxContents.appendChild(subjectCodeElement);
	standardBoxContents.appendChild(rightItems);
	standardBox.appendChild(standardBoxContents);
  
	// Append the subject box to the container
	document.getElementById('subjectBoxContainer').appendChild(standardBox );
};
  
