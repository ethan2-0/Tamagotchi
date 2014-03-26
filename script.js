function EbyID(name) {
	return document.getElementById(name);
}
function error(message) {
	EbyID("error-message").innerHTML = message;
}
//Note: progressbar is the INNER progressbar, NOT the outer.
//progressbar should have already been EbyID'd.
function updateProgressBar(progressbar, value) {
	progressbar.setAttribute("style", "width: " + (value * 2) + "px");
}
function getPageName() {
	return App.getStack()[App.getStack().length - 1][0];
}
function loadPage(name) {
	App.load(name);
}