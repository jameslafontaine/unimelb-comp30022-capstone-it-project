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
			downloadFunctionality();
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
			removeFunctionality(); 
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
				uploadFunctionality();
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
};


function downloadFunctionality() {
	fetch('/api/data/files/' + item.user_id + '?aaps=true', {
		method: 'GET',
	})
	.then(response => response.json())
	.then(data => {
		// Handle the downloaded data
		let blob = new Blob([atob(data.file_data)], { type: data.file_type });
		let link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = data.file_name;
		link.click();
	})
	.catch((error) => {
		console.error('Error:', error);
	});
	
};

function uploadFunctionality() {
	// Get the files from the input field
    let files = document.querySelector('input[type="file"]').files;

    let formData = new FormData();
    formData.append('user_id', 'YourUserIdHere');

    // Append each file to the form data
    for(let i = 0; i < files.length; i++) {
        let file = files[i];
        formData.append('fileName[]', file, file.name);
    }

    fetch('api/data/files/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data here
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// !!!!!!!!!!!!!!!!!!  THIS ENDPOINT HAS TO BE FIXED !!!!!!!!!!!!!!!!!!!!!!!!!!!
function removeFunctionality() {
		// Assuming that the item object has an id property
		fetch('/api/data/files/remove?fileid=' + item.id, {
			method: 'DELETE',
		}).then(response => response.json())
			.then(data => {
				// Handle the response data here
				console.log(data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
}
