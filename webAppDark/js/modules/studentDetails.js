function fillStudentDetailsBox(student) {
    document.getElementById('studentName').innerHTML = student.firstName + ' ' + student.lastName
    document.getElementById('studentId').innerHTML = student.id
    document.getElementById('studentEmail').innerHTML = student.email
}

function generateAAPTable(aapData) {
    const tableContainer = document.getElementById('aapTableContainer');
	const table = document.createElement('table');
	
	// Create table header row
	const headerRow = table.insertRow();
	
	for (const key in aapData[0]) {
		if (aapData[0].hasOwnProperty(key)) {
			const th = document.createElement('th');
			th.innerText = key;
			headerRow.appendChild(th);
		}
	}
	
	// Add two empty headers for the button columns
	headerRow.appendChild(document.createElement('th'));
    headerRow.appendChild(document.createElement('th'));
	
	// Create table aapData rows
	aapData.forEach(item => {
		const row = table.insertRow();
		for (const key in item) {
			if (item.hasOwnProperty(key)) {
				const cell = row.insertCell();
				cell.className = 'tableEntry'; // Apply the CSS class to the cell
                cell.innerHTML = item[key];
			}
		}
        // Add the "Download" button to the 2nd last cell 
		const downloadCell = row.insertCell();
		downloadCell.className = 'tableEntry';
		const downloadButton = document.createElement('button');
		downloadButton.className = 'standardButton';
		downloadButton.innerText = 'Download';
		downloadButton.onclick = function () {
			// NEED TO ADD DOWNLOAD FUNCTIONALITY HERE 
        }
        downloadCell.appendChild(downloadButton)

		// Add the "Remove" button to the last cell
        const removeCell = row.insertCell();
		removeCell.className = 'tableEntry';
		const removeButton = document.createElement('button');
		removeButton.className = 'standardButton';
		removeButton.innerText = 'Remove';
		removeButton.onclick = function () {
			// NEED TO ADD REMOVE FUNCTIONALITY HERE 
        }
        removeCell.appendChild(removeButton)
	});

    // Insert upload row
    const row = table.insertRow();
    for (let i = 0; i < 5; i++) {
        if (i == 3) {
            // Add the "Upload" button to the last cell
            const uploadCell = row.insertCell();
            uploadCell.className = 'tableEntry';
            const uploadButton = document.createElement('button');
            uploadButton.className = 'standardButton';
            uploadButton.innerText = 'Upload';
            uploadButton.onclick = function () {
                // NEED TO ADD UPLOAD FUNCTIONALITY HERE
            }
            uploadCell.appendChild(uploadButton)
        } else {
            const cell = row.insertCell();
            cell.className = 'tableEntry'; // Apply the CSS class to the cell
            cell.innerHTML = '';
        }
    }
	
	// Append the table to the container
	tableContainer.appendChild(table);
}