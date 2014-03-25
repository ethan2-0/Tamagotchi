function EbyID(name) {
	return document.getElementById(name);
}
function error(message) {
	EbyID("error-message").innerHTML = message;
}
//Note: progressbar is the INNER progressbar, NOT the outer.
//progressbar should have already been EbyID'd.
function updateProgressBar(progressbar, value) {
	progressbar.style.width = "" + (value * 2);
}