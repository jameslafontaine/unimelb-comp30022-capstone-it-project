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
// Function to create and populate an expandable subject box
function generateSubjectBox(subject) {
    // Create a new standard box element
    const standardBox  = document.createElement('div');
    standardBox.classList.add('standardBox');
    // Create the standardBoxContents element
    const standardBoxContents = document.createElement('div');
    standardBoxContents.classList.add('standardBoxContents');
    standardBoxContents.style.fontSize = '18px';
    // Create the subjectCode element
    const subjectCodeElement = document.createElement('span');
    subjectCodeElement.textContent = `${subject.code} (${subject.numReserved} reserved, ${subject.numUnresolved} unresolved)`;
    // Create the rightItems container
    const rightItems = document.createElement('span');
    rightItems.classList.add('rightItems');
    // Create the "View Requests & Queries" button
    // Will have to hide or grey out and have popup on hover if tutor has not been given permission by subject coordinator to view any requests
    const viewRequestsButton = document.createElement('button');
    viewRequestsButton.classList.add('standardButton');
    viewRequestsButton.textContent = 'View Requests & Queries';
    viewRequestsButton.style = 'font-size:16px'
    viewRequestsButton.onclick = function() {
        window.location.href = 'iViewRequests.html';
    };
    // Create the "Settings" button
    // Will have to hide or grey out and have popup on hover if instructor is not subject coordinator
    const settingsButton = document.createElement('button');
    settingsButton.classList.add('standardButton');
    settingsButton.textContent = 'Settings';
    settingsButton.style = 'font-size:16px'
    settingsButton.onclick = function() {
        window.location.href = 'iSubjectSettings.html';
    };
    // Append the elements to their respective parent elements
    rightItems.appendChild(viewRequestsButton);
    rightItems.appendChild(settingsButton);
    standardBoxContents.appendChild(subjectCodeElement);
    standardBoxContents.appendChild(rightItems);
    standardBox.appendChild(standardBoxContents);
    // Append the subject box to the container
    document.getElementById('subjectBoxContainer').appendChild(standardBox );
    document.getElementById('subjectBoxContainer').appendChild(document.createElement('br'));
};