/*
hello = function() {
    fetch('/get_data/')
        .then(response => response.json())
        .then(data => {
            // Update the page with the retrieved data
            document.getElementById('headerText').innerHTML = "Signed in as: " + data.ID;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

hello();
*/


var req = JSON.parse(document.getElementById('load-data').getAttribute('data-req'));
document.getElementById('title').innerHTML = "Request #" + req.id;
document.getElementById('versionAndDateCreated').innerHTML = "Version 3 Created" + req.dateCreated;
document.getElementById('course').innerHTML = req.course + " - Deadline extension for *assessment name*";
document.getElementById('message').innerHTML = req.message;
document.getElementById('status').innerHTML = req.status;

