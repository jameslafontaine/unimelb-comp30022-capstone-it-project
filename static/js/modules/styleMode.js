/** 
 * Author: Callum Sharman
 * Date Last Modified: November 3, 2023
 * Description: Handles style changes with light and dark modes and such
 */

/**
 * Converts all styles on the page to dark mode. 
 * These functions don't really belong here, may move later
 */
function convertStylesToDarkMode(){

	/*				css/general.css				*/

	const body = document.querySelector('body');
	body.style.backgroundColor = 'rgb(29, 29, 29)';

	const standardButtons = document.querySelectorAll('.standardButton');
	standardButtons.forEach(btn => {
		btn.style.backgroundColor = 'rgb(90, 90, 90)';
	}) 

	const bigButtons = document.querySelectorAll('.bigButton');
	bigButtons.forEach(btn => {
		btn.style.backgroundColor = 'rgb(105, 105, 105)';
	})

	const titles = document.querySelectorAll('.title');
	titles.forEach(title => {
		title.style.color = 'white';
	})

	const subTitles = document.querySelectorAll('.subTitle');
	subTitles.forEach(subTitle => {
		subTitle.style.color = 'white';
	})

	const textElements = document.querySelectorAll('.text');
	textElements.forEach(text => {
		text.style.color = 'white';
	})

	const standardBoxes = document.querySelectorAll('.standardBox');
	standardBoxes.forEach(box => {
		box.style.backgroundColor = 'rgb(105, 105, 105)';
	})

	const standardBoxContentsElements = document.querySelectorAll('.standardBoxContents');
	standardBoxContentsElements.forEach(element => {
		element.style.color = 'white';
	})

	const textBoxes = document.querySelectorAll('.textBox');
	textBoxes.forEach(textBox => {
		textBox.style.backgroundColor = 'rgb(105, 105, 105)';
		textBox.style.color = 'white';
	})


	/*				css/tables.css				*/

	const tableEntries = document.querySelectorAll('.tableEntry');
	tableEntries.forEach(entry => {
		entry.style.backgroundColor = 'rgb(49, 49, 49)';
		entry.style.color = 'white';
	})

	const thtds = document.querySelectorAll('th, td');
	thtds.forEach(element => {
		element.style.border = '1px solid #000000';
	})

	const ths = document.querySelectorAll('th');
	ths.forEach(element => {
		element.style.backgroundColor = 'rgb(105, 105, 105)';
	})

	const specialTableClass = document.querySelectorAll('th:not(:last-child)');
	specialTableClass.forEach(element => {
		element.style.borderRight = '2px solid rgb(0, 0, 0)';
	})


	/*				css/popups.css				*/

	const popUpContents = document.querySelectorAll('.popupContent');
	popUpContents.forEach(element => {
		element.style.backgroundColor = 'rgb(70, 70, 70)';
	})

	const popUpBodies = document.querySelectorAll('.popupBody');
	popUpBodies.forEach(element => {
		element.style.backgroundColor = 'rgb(70, 70, 70)';
	})

}

/**
 * Converts all styles on the page to baby mode for babies. 
 */
function convertStylesToLightMode(){

    /*				css/general.css				*/

	const body = document.querySelector('body');
	body.style.backgroundColor = 'white';

	const standardButtons = document.querySelectorAll('.standardButton');
	standardButtons.forEach(btn => {
		btn.style.backgroundColor = 'rgb(0, 15, 70)';
	}) 

	const bigButtons = document.querySelectorAll('.bigButton');
	bigButtons.forEach(btn => {
		btn.style.backgroundColor = 'rgb(0, 15, 70)';
	})

	const titles = document.querySelectorAll('.title');
	titles.forEach(title => {
		title.style.color = 'black';
	})

	const subTitles = document.querySelectorAll('.subTitle');
	subTitles.forEach(subTitle => {
		subTitle.style.color = 'black';
	})

	const textElements = document.querySelectorAll('.text');
	textElements.forEach(text => {
		text.style.color = 'black';
	})

	const standardBoxes = document.querySelectorAll('.standardBox');
	standardBoxes.forEach(box => {
		box.style.backgroundColor = 'rgb(191, 191, 191)';
	})

	const standardBoxContentsElements = document.querySelectorAll('.standardBoxContents');
	standardBoxContentsElements.forEach(element => {
		element.style.color = 'black';
	})

	const textBoxes = document.querySelectorAll('.textBox');
	textBoxes.forEach(textBox => {
		textBox.style.backgroundColor = 'rgb(191, 191, 191)';
		textBox.style.color = 'black';
	})


	/*				css/tables.css				*/

	const tableEntries = document.querySelectorAll('.tableEntry');
	tableEntries.forEach(entry => {
		entry.style.backgroundColor = 'rgb(191, 191, 191)';
		entry.style.color = 'black';
	})

	const thtds = document.querySelectorAll('th, td');
	thtds.forEach(element => {
		element.style.border = '1px solid #000000';
	})

	const ths = document.querySelectorAll('th');
	ths.forEach(element => {
		element.style.backgroundColor = '#333';
	})

	const specialTableClass = document.querySelectorAll('th:not(:last-child)');
	specialTableClass.forEach(element => {
		element.style.borderRight = '2px solid rgb(0, 0, 0)';
	})


	/*				css/popups.css				*/

	const popUpContents = document.querySelectorAll('.popupContent');
	popUpContents.forEach(element => {
		element.style.backgroundColor = 'white';
	})

	const popUpBodies = document.querySelectorAll('.popupBody');
	popUpBodies.forEach(element => {
		element.style.backgroundColor = 'white';
	})

}

/**
 * Checks if the page is currently dark mode, fixes css if it is or isn't
 */
function fixStyling(){
	// get the stored string value
	const darkModePrefStr = localStorage.getItem('darkModePref');

	// get the boolean version of the string storage
	darkModePref = darkModePrefStr === "true";

	// this page should be dark mode!! Spoopy
	if(darkModePref) convertStylesToDarkMode();
	else convertStylesToLightMode();
}