blockAtlas.onload = function()
{
	global.loaded = true;
}

class Block
{
	constructor(name, x, y)
	{
		this.name = name;
		this.x = x * 64;
		this.y = y * 64;
		this.itemcanvas = document.createElement('canvas');
		this.itemcanvas.width = 64;
		this.itemcanvas.height = 64;
		this.draw(this.itemcanvas.getContext("2d"), 0, 0);
		this.transparent = false;
		this.sound = sounds.default;
	}
	
	draw(context, x, y)
	{
		context.drawImage(blockAtlas, this.x, this.y, 64, 64, x, y, 64, 64);
	}
	
	setTransparent()
	{
		this.transparent = true;
		return this;
	}
	
	isTransparent()
	{
		return this.transparent;
	}
	
	getSound()
	{
		return this.sound;
	}
}

function putItem(block)
{
	var cell = global.hotbar.rows[0].insertCell(global.hotbar.rows[0].cells.length);
	cell.appendChild(block.itemcanvas);
	cell.style.width = "64px";
	cell.style.height = "64px";
	cell.style.overflow = "hidden";
	global.hotbar.length = global.hotbar.rows[0].cells.length;
	global.hotbar.items[global.hotbar.length - 1] = block;
}

function registerBlock(block)
{
	blocks[block.name] = block;
	putItem(block);
}

registerBlock(new Block("grass", 0, 0));
registerBlock(new Block("stone", 1, 0));
registerBlock(new Block("dirt", 2, 0));
registerBlock(new Block("planks", 3, 0));
registerBlock(new Block("cobblestone", 0, 1));
registerBlock(new Block("bedrock", 1, 1));
registerBlock(new Block("sand", 2, 1));
registerBlock(new Block("gravel", 3, 1));
registerBlock(new Block("glass", 3, 2).setTransparent());
registerBlock(new Block("log", 0, 3));
registerBlock(new Block("leaves", 1, 3).setTransparent());