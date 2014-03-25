function EbyID(name) {
	return document.getElementById(name);
}
function error(message) {
	EbyID("error-message").innerHTML = message;
}