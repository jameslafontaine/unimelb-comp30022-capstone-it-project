/******** STUDENT VIEW TABLES ********/
// Chuck student tables in here if they are different to anything already in the instructor tables




/******** INSTRUCTOR VIEW TABLES ********/

const jsonDataAwaiting = [
	{
		reserved: '<span style="font-size: 300%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>',
		date: '29/08/2023',
		studentName: 'Joe Bloggs',
		requestType: 'Extension',
		status: 'Pending'
	},
];

const jsonDataResolved = [
	{
		reserved: '<span style="font-size: 300%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>',
		date: '29/08/2023',
		studentName: 'Joe Bloggs',
		requestType: 'Extension',
		status: 'Pending'
	},
];

function generateRequestTable(data, type) {
	const tableContainer = document.getElementById('tableContainer' + type);
	const table = document.createElement('table');
	
	// Create table header row
	const headerRow = table.insertRow();
	
	for (const key in data[0]) {
		if (data[0].hasOwnProperty(key)) {
			const th = document.createElement('th');
			th.innerText = key;
			headerRow.appendChild(th);
		}
	}
	
	// Add an empty header for the button column
	const emptyHeader = document.createElement('th');
	emptyHeader.textContent = ''; // Empty text
	headerRow.appendChild(emptyHeader);
	
	// Create table data rows
	data.forEach(item => {
		const row = table.insertRow();
		for (const key in item) {
			if (item.hasOwnProperty(key)) {
				const cell = row.insertCell();
				cell.className = 'tableEntry'; // Apply the CSS class to the cell
				cell.innerHTML = item[key];
			}
		}
		
		// Add the "Review" button to the last cell if this is the awaitng action table
		if (type === 'Awaiting') {
			const reviewCell = row.insertCell();
			reviewCell.className = 'tableEntry';
			const reviewButton = document.createElement('button');
			reviewButton.className = 'standardButton';
			reviewButton.innerText = 'Review';
			reviewButton.onclick = function () {
				window.location.href = 'iReviewRequest.html'; 
			};
			reviewCell.appendChild(reviewButton);
		
		} else if (type === 'Resolved') {
			// Otherwise add the "View details" button to the last cell of a row if this is the resolved table
			const reviewCell = row.insertCell();
			reviewCell.className = 'tableEntry';
			const reviewButton = document.createElement('button');
			reviewButton.className = 'standardButton';
			reviewButton.innerText = 'View details';
			reviewButton.onclick = function () {
				window.location.href = 'iViewResolved.html'; 
			};
			reviewCell.appendChild(reviewButton);
		}
		
	});
	
	// Append the table to the container
	tableContainer.appendChild(table);
};

// Call the function with the JSON data
generateRequestTable(jsonDataAwaiting, 'Awaiting');
generateRequestTable(jsonDataResolved, 'Resolved');
