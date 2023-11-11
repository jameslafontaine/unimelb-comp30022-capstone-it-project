/** 
 * Author: James La Fontaine, Callum Sharman
 * Date Last Modified: October 15, 2023
 * Description: Handles student detail functionality
 */

const AAP_TABLE_HEADERS = ["File name", "File type"]

function fillStudentDetailsBox(student) {
    document.getElementById('studentName').innerHTML = student.first_name + ' ' + student.last_name
    document.getElementById('studentId').innerHTML = student.user_id
    document.getElementById('studentEmail').innerHTML = student.email
}

function generateAAPTable(aapData) {
    const tableContainer = document.getElementById('aapTableContainer');
	const table = document.createElement('table');
	
	// Create table header row
	const headerRow = table.insertRow();

	for (const key in AAP_TABLE_HEADERS) {
		const th = document.createElement('th');
		th.innerText = AAP_TABLE_HEADERS[key]
		headerRow.appendChild(th);
	}
	
	// Add two empty headers for the button columns
	headerRow.appendChild(document.createElement('th'));
    headerRow.appendChild(document.createElement('th'));
	
	aapData.forEach(item => {
		const row = table.insertRow();
		
		const fileNameCell = row.insertCell();
		fileNameCell.className = 'tableEntry';
		fileNameCell.innerHTML = item.file_name;

		const fileTypeCell = row.insertCell();
		fileTypeCell.className = 'tableEntry';
		fileTypeCell.innerHTML = item.file_type

		// Download button
		const downloadCell = row.insertCell();
		downloadCell.className = 'tableEntry';
		const downloadButton = document.createElement('button');
		downloadButton.className = 'standardButton';
		downloadButton.innerText = 'Download';
		downloadButton.onclick = function () {
			// NEED TO ADD DOWNLOAD FUNCTIONALITY HERE 
        }
        downloadCell.appendChild(downloadButton)

		// Remove button
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
	fixStyling();
}