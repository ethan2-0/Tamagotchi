function EbyID(name) {
    return document.getElementById(name);
}
function error(message) {
    EbyID("error-message").innerHTML = message;
}
//Note: progressbar is the INNER progressbar, NOT the outer.
//progressbar should have already been EbyID'd.
function updateProgressBar(progressbar, value, color) {
    if(value < 0) {
        value = 0;
    }
    if(color == null) {
        healthRed = 127 - Math.floor(127 * (value / 100));
        healthGreen = Math.floor((196 * (value / 100)));
        color = "rgb(" + healthRed + ", " + healthGreen + ", 0)";
    }
    progressbar.setAttribute("style", "width: " + (value * 2) + "px; background-color: " + color + ";");
}
function getPageName() {
    return App.getStack()[App.getStack().length - 1][0];
}
function loadPage(name, transition) {
    if(transition == null) {
        App.load(name);
    } else {
        App.load(name, transition);
    }
}