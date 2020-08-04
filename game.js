var hotbar_sel = document.getElementById("hotbar_sel");

function onResize() {
	global.canvas.width  = document.body.clientWidth;
	global.canvas.height = document.body.clientHeight;
	
	global.hotbar_div.style.top = document.body.clientHeight - 80;
	global.hotbar_div.style.left = (document.body.clientWidth - global.hotbar.length * 64) / 2;
	
	hotbar_sel.style.top = global.hotbar_div.style.top;
	hotbar_sel.style.left = global.hotbar_div.style.left;
}

onResize();

var x = document.body.clientWidth / 2;
var y = document.body.clientHeight / 2;

var dx = 0.0;
var dy = 0.0;
var l = 0.0;

var dragging = false;
var selectX = 0;
var selectY = 0;
var selectX2 = 0;
var selectY2 = 0;

function drawSelection() {
	//selectX = Math.floor(global.worldMouseX / 64);
	//selectY = Math.floor(global.worldMouseY / 64);
	var x = 0;
	var y = 0;
	var w = 64;
	var h = 64;
	if (dragging)
	{
		x = Math.min(selectX, selectX2) * 64 + global.offsetX;
		y = Math.min(selectY, selectY2) * 64 + global.offsetY;
		w = Math.abs(selectX2 - selectX) * 64 + 64;
		h = Math.abs(selectY2 - selectY) * 64 + 64;
	}
	else
	{
		x = Math.floor(global.worldMouseX / 64) * 64 + global.offsetX;
		y = Math.floor(global.worldMouseY / 64) * 64 + global.offsetY;
	}
	
	global.ctx.beginPath();
	global.ctx.strokeStyle = "#00FF00";
	global.ctx.rect(x, y, w, h);
	global.ctx.stroke();
	global.ctx.closePath();
}

var world = new World(2);

var selectedBlock = blocks.stone;

onMouseDown = function(button)
{
	selectX = Math.floor(global.worldMouseX / 64);
	selectY = Math.floor(global.worldMouseY / 64);
	selectX2 = Math.floor(global.worldMouseX / 64);
	selectY2 = Math.floor(global.worldMouseY / 64);
	dragging = true;
	
	/*if (button == 1)
		world.setBlock(selectX, selectY, global.shift ? 0 : 1, selectedBlock);
	else if (button == 3)
		world.setBlock(selectX, selectY, 1, null);*/
}

onMouseUp = function(button)
{
	dragging = false;
	
	var z = global.shift ? 0 : 1;
	if (button == 1)
	{
		world.setArea(Math.min(selectX, selectX2), Math.min(selectY, selectY2), z, Math.max(selectX, selectX2), Math.max(selectY, selectY2), z, selectedBlock);
		selectedBlock.getSound().play();
	}
	else if (button == 3)
	{
		world.setArea(Math.min(selectX, selectX2), Math.min(selectY, selectY2), z, Math.max(selectX, selectX2), Math.max(selectY, selectY2), z, null);
	}
}

onMouseMove = function()
{
	if (dragging)
	{
		selectX2 = Math.floor(global.worldMouseX / 64);
		selectY2 = Math.floor(global.worldMouseY / 64);
	}
}

function updateMovement()
{
	dx = 0;
	dy = 0;
	if (global.moveUp)
		dy -= 1;
	if (global.moveDown)
		dy += 1;
	if (global.moveLeft)
		dx -= 1;
	if (global.moveRight)
		dx += 1;
	var l = dx * dx + dy * dy;
	if (l > 0)
	{
		l = Math.sqrt(l);
		global.cameraX += (dx / l) * 4;
		global.cameraY += (dy / l) * 4;
		global.offsetX = Math.floor(-global.cameraX);
		global.offsetY = Math.floor(-global.cameraY);
	}
}

global.hotbar.selected = 0;
selectedBlock = global.hotbar.items[0];

function onWheel(e) {
	var delta = e.deltaY || e.detail || e.wheelDelta;
	var index = 0;
	if (delta > 0)
	{
		index = global.hotbar.selected + 1;
		if (index == global.hotbar.length)
			index = 0;
		global.hotbar.selected = index;
		selectedBlock = global.hotbar.items[index];
	}
	else
	{
		index = global.hotbar.selected - 1;
		if (index < 0)
			index = global.hotbar.length - 1;
		global.hotbar.selected = index;
		selectedBlock = global.hotbar.items[index];
	}
	
	hotbar_sel.style.left = parseInt(global.hotbar_div.style.left, 10) + index * 68;
}
document.addEventListener("mousewheel", onWheel, false);

document.getElementById("loading").style.visibility = "hidden";

function loop()
{
	updateMovement();
	global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height);
	
	var cx = Math.floor((global.cameraX + document.body.clientWidth / 2) / chunkScale);
	var cy = Math.floor((global.cameraY + document.body.clientHeight / 2) / chunkScale);
	var r = Math.ceil(Math.max(document.body.clientWidth, document.body.clientHeight) / 2 / chunkScale);
	
	world.draw(global.ctx, cx, cy, r);
	drawSelection();
}

function worldUpdate()
{
	var cx = Math.floor((global.cameraX + document.body.clientWidth / 2) / chunkScale);
	var cy = Math.floor((global.cameraY + document.body.clientHeight / 2) / chunkScale);
	var r = Math.ceil(Math.max(document.body.clientWidth, document.body.clientHeight) / 2 / chunkScale);
	world.generateAround(cx, cy, r + 1);
}

setInterval(loop, 10);
setInterval(worldUpdate, 400);