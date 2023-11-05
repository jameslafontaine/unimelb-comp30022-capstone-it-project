/** 
 * Author: James La Fontaine, Callum Sharman
 * Date Last Modified: October 12, 2023
 * Description: Handles the headers for both instructor and student
 */

//========================TEMPORARY GLOBAL VARIABLES========================//
// 0 is off, 1 is on
// held as vars in local storage now
//==========================================================================//


// Fill in the relevant information for the "Signed in as:" within the header
function populateSignIn() {
	let headerText = document.querySelector('.headerText');

	var usr = JSON.parse(document.getElementById('load-header-data').getAttribute('data-usr'));

	headerText.innerHTML = "Signed in as: " + usr.first_name + " " + usr.last_name;

}

/**
 * Depending on whether instructor or student (string value) 
 * loads in and fills out the appropriate _webHeader.html file
 */
function createHeader(instOrStudent) {
	let url;

	if(instOrStudent == "instructor") url = '/instructor/iWebHeader'
	else if(instOrStudent == "student") url = '/student/sWebHeader'
	else{
		console.error("ERROR: incorrect student/instructor value given in 'createHeader'")
		return;
	}

	loadTextData(url)
		.then(data =>{

			// Insert the loaded header into the headerContainer
			document.getElementById('webHeaderContainer').innerHTML = data;

			// Call populateSignIn function to populate header text
			populateSignIn();
			setPreferences();
			checkAndChangePrefs();
		})
}

/**
 * Sets current preference values for emails and darkMode
 */
function setPreferences(){
	// will be extended to make calls to database eventually instead of using locally stored global vars

	let emailNotifsPref;
	let darkModePref;

	// initialise local storage of prefs if not already done
	if(localStorage.getItem('emailNotifsPref') === null){
		localStorage.setItem('emailNotifsPref', "false"); 
	}
	if(localStorage.getItem('darkModePref') === null){
		localStorage.setItem('darkModePref', "false");
	}

	// get the stored string values
	const emailNotifsPrefStr = localStorage.getItem('emailNotifsPref');
	const darkModePrefStr = localStorage.getItem('darkModePref');

	// get the boolean version of the string storage
	emailNotifsPref = emailNotifsPrefStr === "true";
	darkModePref = darkModePrefStr === "true";

	document.getElementById('emailNotifCheckBox').checked = emailNotifsPref;
	document.getElementById('darkModeCheckBox').checked = darkModePref;

	// this page should be dark mode!! Spoopy
	if(darkModePref) convertStylesToDarkMode();
	else convertStylesToLightMode();
}

/**
 * Checks for changes and resets the preferences accordingly
 */
function checkAndChangePrefs(){
	// email pref listener
	const emailNotifCheckBox = document.getElementById('emailNotifCheckBox');
	emailNotifCheckBox.addEventListener("change", function() {

		const updatedEmailNotifsPref = document.getElementById('emailNotifCheckBox').checked;
		const emailNotifsPrefStr = updatedEmailNotifsPref.toString();

		localStorage.setItem('emailNotifsPref', emailNotifsPrefStr); 
		setPreferences();
	})

	// dark mode pref listener
	const darkModeCheckBox = document.getElementById('darkModeCheckBox');
	darkModeCheckBox.addEventListener("change", function() {

		const updatedDarkModePref = document.getElementById('darkModeCheckBox').checked;
		const darkModePrefStr = updatedDarkModePref.toString();

		localStorage.setItem('darkModePref', darkModePrefStr);
		setPreferences();
	})

}