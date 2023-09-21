var req = JSON.parse(document.getElementById('load-data').getAttribute('data-req'));
document.getElementById('title').innerHTML = "Request #" + req.id;
document.getElementById('versionAndDateCreated').innerHTML = "Version 3 Created" + req.dateCreated;
document.getElementById('course').innerHTML = req.course;
document.getElementById('message').innerHTML = req.message;
document.getElementById('status').innerHTML = req.status;

