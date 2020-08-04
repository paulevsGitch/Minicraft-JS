var keys = [];

function keyDownHandler(e) {
	if(e.code == "KeyD" || e.key == "ArrowRight") {
		global.moveRight = true;
	}
	else if(e.code == "KeyA" || e.key == "ArrowLeft") {
		global.moveLeft = true;
	}
	
	if(e.code == "KeyW" || e.key == "ArrowUp") {
		global.moveUp = true;
	}
	else if(e.code == "KeyS" || e.key == "ArrowDown") {
		global.moveDown = true;
	}
	
	if(e.key == "Shift") {
		global.shift = true;
	}
	
	keys[e.key] = true;
}

function keyUpHandler(e) {
	if(e.code == "KeyD" || e.key == "ArrowRight") {
		global.moveRight = false;
	}
	else if(e.code == "KeyA" || e.key == "ArrowLeft") {
		global.moveLeft = false;
	}
	
	if(e.code == "KeyW" || e.key == "ArrowUp") {
		global.moveUp = false;
	}
	else if(e.code == "KeyS" || e.key == "ArrowDown") {
		global.moveDown = false;
	}
	
	if(e.key == "Shift") {
		global.shift = false;
	}
	
	keys[e.key] = false;
}

function isKeyPressed(key)
{
	return keys[key] == true;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);