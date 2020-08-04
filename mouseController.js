var LMB = 1;
var RMB = 3;
var CMB = 2;

var onMouseDown = function(button) {};
var onMouseUp = function(button) {};
var onMouseMove = function() {};

function mouseMoveHandler(e) {
	global.mouseX = e.clientX;  // (e.clientX - global.canvas.offsetLeft) / global.zoom;
	global.mouseY = e.clientY;   // (e.clientY - global.canvas.offsetTop) / global.zoom;
	global.worldMouseX = global.mouseX - global.offsetX;
	global.worldMouseY = global.mouseY - global.offsetY;
	onMouseMove();
}

function mouseDownHandler(e) {
	onMouseDown(event.which);
}

function mouseUpHandler(e) {
	onMouseUp(event.which);
}

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);

document.addEventListener('contextmenu', event => event.preventDefault());