
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