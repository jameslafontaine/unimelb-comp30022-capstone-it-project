/** 
 * Author: James La Fontaine, Callum Sharman
 * Date Last Modified: October 12, 2023
 * Description: Handles the headers for both instructor and student
 */

/**
 * Depending on whether instructor or student (string value) 
 * loads in and fills out the appropriate _webHeader.html file
 */
function createHeader(instOrStudent) {
	let url = (instOrStudent == "student") ? '/student/sWebHeader' : '/instructor/iWebHeader';

	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': getGlobalAppHeadersValue('Content-Type'),
			'user_id': getGlobalAppHeadersValue('user_id')
		}
	})
		.then(response => response.text())
		.then(data => {
			document.getElementById('webHeaderContainer').innerHTML = data;
			let headerText = document.querySelector('.headerText');
			loadUserDetails(getGlobalAppHeadersValue('user_id'))
				.then(usr => {
					headerText.innerHTML = "Signed in as: " + usr.first_name + " " + usr.last_name;
				});
        })
        .catch(error => {
			console.error('Error:', error);
		});

}
