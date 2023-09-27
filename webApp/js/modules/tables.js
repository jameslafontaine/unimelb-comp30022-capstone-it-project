/******** STUDENT VIEW TABLES ********/
// Chuck student tables in here if they are different to anything already in the instructor tables




/******** INSTRUCTOR VIEW TABLES ********/

const jsonDataAwaiting = [
	{
		reserved: true,
		date: '29/08/2023',
		studentName: 'Joe Bloggs',
		requestType: 'Extension',
		status: 'Pending'
	},
];

const jsonDataResolved = [
	{
		reserved: false,
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
	emptyHeader.textContent = '';
	headerRow.appendChild(emptyHeader);
	
	// Create table data rows
	data.forEach(item => {
		const row = table.insertRow();
		for (const key in item) {
			if (item.hasOwnProperty(key)) {
				const cell = row.insertCell();
				cell.className = 'tableEntry'; // Apply the CSS class to the cell
				 // Check if the key is 'reserved'
				 if (key === 'reserved') {
                    // Check if 'reserved' is true, and display a yellow star for such requests
                    if (item[key] === true) {
                        const yellowStar = '<span style="font-size: 300%; color: yellow; text-shadow: -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;">&bigstar;</span>';
                        cell.innerHTML = yellowStar;
                    } else {
                        // Display a hollow star for non-reserved requests
                        const hollowStar = '<span style="font-size: 300%; ">☆</span>';
                        cell.innerHTML = hollowStar;
                    }
                } else {
                    // For other keys, just display the value as is
                    cell.innerHTML = item[key];
                }
			}
		}

		const reviewCell = row.insertCell();
		reviewCell.className = 'tableEntry';
		const requestButton = document.createElement('button');
		requestButton.className = 'standardButton';
		// Add the "Review" button to the last cell if this is the awaiting action table
		if (type === 'Awaiting') {
			requestButton.innerText = 'Review';
			requestButton.onclick = function () {
				window.location.href = 'iReviewRequest.html'; 
			};
		// Otherwise add the "View details" button to the last cell of a row if this is the resolved table
		} else if (type === 'Resolved') {
			requestButton.innerText = 'View details';
			requestButton.onclick = function () {
				window.location.href = 'iViewResolved.html'; 
			};
		}
		reviewCell.appendChild(requestButton);
	});
	
	// Append the table to the container
	tableContainer.appendChild(table);
};

// Call the function with the JSON data
generateRequestTable(jsonDataAwaiting, 'Awaiting');
generateRequestTable(jsonDataResolved, 'Resolved');
