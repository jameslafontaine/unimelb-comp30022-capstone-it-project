export function setupDownloadButton(buttonId, fileUrl, fileName) {
    document.getElementById(buttonId).addEventListener('click', function() {
        fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = fileName;
            link.click();
        })
        .catch(error => console.error('Error:', error));
    });
}
    
export function setupUploadButton(buttonId, fileInputId, fileContainerId, uploadUrl) {
    document.getElementById(buttonId).addEventListener('click', function() {
        document.getElementById(fileInputId).click();
    });
    
    document.getElementById(fileInputId).addEventListener('change', function(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const fileInfo = document.createElement('div');
            fileInfo.innerHTML = `
            <p>Filename: ${file.name}</p>
            <p>Filesize: ${file.size} bytes</p>
            <p>Datetime Uploaded: ${new Date().toISOString()}</p>
            <button class="removeBtn">Remove</button>
            `;
            document.getElementById(fileContainerId).appendChild(fileInfo);
            
            fileInfo.querySelector('.removeBtn').addEventListener('click', function() {
                fetch(uploadUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filename: file.name }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fileInfo.remove();
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
    });
}