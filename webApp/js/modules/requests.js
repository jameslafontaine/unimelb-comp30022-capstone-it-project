






function fillCurrentRequestInformation(requestData) {
    document.getElementById("title").innerHTML = 'Request #' + requestData.requestId
    document.getElementById("dates").innerHTML = 'Created ' + requestData.creationDate
    if (requestData.resolveDate != '') {
        document.getElementById("dates").innerHTML = document.getElementById("dates").innerHTML + ', Resolved ' + requestData.resolveDate
    }
    document.getElementById("course").innerHTML = requestData.course
    document.getElementById("assessment").innerHTML = requestData.assessment
    document.getElementById("requestType").innerHTML = requestData.requestType
    document.getElementById("requestTitle").innerHTML = requestData.requestTitle
    document.getElementById("message").innerHTML = requestData.message
    document.getElementById("status").innerHTML = requestData.status
};

function generateSuppDocTable(data, number) {
	const tableContainer = document.getElementById(`suppDocContainer${number}`);
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
                cell.innerHTML = item[key];
			}
		}

		const downloadCell = row.insertCell();
		downloadCell.className = 'tableEntry';
		const downloadButton = document.createElement('button');
		downloadButton.className = 'standardButton';
		// Add the "Download" button to the last cell for each document
		downloadButton.innerText = 'Download';
		downloadButton.onclick = function () {
			// Need to add functionality to download the file somehow
        }
		downloadCell.appendChild(downloadButton);
	});
	
	// Append the table to the container
	tableContainer.appendChild(table);
};

function generateVersionBox(version, number) {
    const container = document.getElementById("requestHistoryContainer");

    const expandableBox = document.createElement("div");
    expandableBox.className = "expandableBox";
    expandableBox.setAttribute('data-bs-toggle', 'collapse')
    expandableBox.setAttribute('data-bs-target', `#expandableBoxSection${number}`)

    const expandableBoxContents = document.createElement("div");
    expandableBoxContents.className = "expandableBoxContents";
    expandableBoxContents.innerHTML = `Version #${number} (${version.date})`;
    expandableBoxContents.setAttribute('data-bs-toggle', 'collapse')
    expandableBoxContents.setAttribute('data-bs-target', `#expandableBoxSection${number}`)

    const expandButton = document.createElement("span");
    expandButton.className = "expandButton";
    expandButton.setAttribute('data-bs-toggle', 'collapse')
    expandButton.setAttribute('data-bs-target', `#expandableBoxSection${number}`)

    expandableBoxContents.appendChild(expandButton);
    expandableBox.appendChild(expandableBoxContents);

    const expandableBoxSection = document.createElement("div");
    expandableBoxSection.className = "expandableBoxSection";
    expandableBoxSection.id = `expandableBoxSection${number}`;
    expandableBoxSection.style.height = "auto";
    //expandableBoxSection.style.display = "block";
    expandableBoxSection.setAttribute('class', 'collapse show')
    
    const messageSpan = document.createElement("span");
    messageSpan.className = "text";
    messageSpan.textContent = "Message";
    
    const messageTextarea = document.createElement("textarea");
    messageTextarea.className = "textBox";
    messageTextarea.setAttribute("readonly", true);
    messageTextarea.style = "resize:none"
    messageTextarea.textContent = version.message;
    
    const suppDocSpan = document.createElement("p");
    suppDocSpan.className = "text";
    suppDocSpan.textContent = "Supporting Documents";


    const suppDocContainer = document.createElement("div");
    suppDocContainer.id = `suppDocContainer${number}`;
    
    expandableBoxSection.appendChild(messageSpan);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(messageTextarea);
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(document.createElement("br"));
    expandableBoxSection.appendChild(suppDocSpan);
    expandableBoxSection.appendChild(suppDocContainer);

    container.appendChild(expandableBox);
    container.appendChild(expandableBoxSection);
    container.appendChild(document.createElement("br"));
    
    generateSuppDocTable(version['documents'], number);
    //container.appendChild(document.createElement("br"));
    //container.appendChild(document.createElement("br"));
    //container.appendChild(document.createElement("br"));
}

