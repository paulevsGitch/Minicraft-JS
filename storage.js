const chunkSide = 8;
const chunkHeight = 2;
const chunkMask = chunkSide - 1;
const chunkScale = chunkSide * 64; // 64 = Tile Size in px

const indexTable = [
	 0,  1,  2,  1,  3,  4,  3,  4,  5,  6,  7,  6,  3,  4,  3,  4,
	 8,  9, 10,  9, 11, 12, 11, 12,  8,  9, 10,  9, 11, 12, 11, 12,
	13, 14, 15, 14, 16, 17, 16, 17, 18, 19, 20, 19, 16, 17, 16, 17,
	 8,  9, 10,  9, 11, 12, 11, 12,  8,  9, 10,  9, 11, 12, 11, 12,
	21, 22, 23, 22, 24, 25, 24, 25, 26, 27, 28, 27, 24, 25, 24, 25,
	29, 30, 31, 30, 32, 33, 32, 33, 29, 30, 31, 30, 32, 33, 32, 33,
	21, 22, 23, 22, 24, 25, 24, 25, 26, 27, 28, 27, 24, 25, 24, 25,
	29, 30, 31, 30, 32, 33, 32, 33, 29, 30, 31, 30, 32, 33, 32, 33,
	34,  1, 35,  1, 36,  4, 36,  4, 37,  6, 38,  6, 36,  4, 36,  4,
	39,  9, 40,  9, 41, 12, 41, 12, 39,  9, 40,  9, 41, 12, 41, 12,
	42, 14, 43, 14, 44, 17, 44, 17, 45, 19, 46, 19, 44, 17, 44, 17,
	39,  9, 40,  9, 41, 12, 41, 12, 39,  9, 40,  9, 41, 12, 41, 12,
	21, 22, 23, 22, 24, 25, 24, 25, 26, 27, 28, 27, 24, 25, 24, 25,
	29, 30, 31, 30, 32, 33, 32, 33, 29, 30, 31, 30, 32, 33, 32, 33,
	21, 22, 23, 22, 24, 25, 24, 25, 26, 27, 28, 27, 24, 25, 24, 25,
	29, 30, 31, 30, 32, 33, 32, 33, 29, 30, 31, 30, 32, 33, 32, 33
];

function getShadowTile(world, x, y)
{
	var height = world.getHeight(x, y);
	var index = height < world.getHeight(x, y - 1) ? 1 : 0; // North
	if (height < world.getHeight(x - 1, y - 1)) // North-West
		index += 2;
	if (height < world.getHeight(x - 1, y)) // West
		index += 4;
	if (height < world.getHeight(x - 1, y + 1)) // South-West
		index += 8;
	if (height < world.getHeight(x, y + 1)) // South
		index += 16;
	if (height < world.getHeight(x + 1, y + 1)) // South-East
		index += 32;
	if (height < world.getHeight(x + 1, y)) // East
		index += 64;
	if (height < world.getHeight(x + 1, y - 1)) // North-East
		index += 128;
	return indexTable[index];
}

function getOutlineTile(world, x, y)
{
	var height = world.getHeight(x, y);
	var index = height > world.getHeight(x, y - 1) ? 1 : 0; // North
	if (height > world.getHeight(x - 1, y - 1)) // North-West
		index += 2;
	if (height > world.getHeight(x - 1, y)) // West
		index += 4;
	if (height > world.getHeight(x - 1, y + 1)) // South-West
		index += 8;
	if (height > world.getHeight(x, y + 1)) // South
		index += 16;
	if (height > world.getHeight(x + 1, y + 1)) // South-East
		index += 32;
	if (height > world.getHeight(x + 1, y)) // East
		index += 64;
	if (height > world.getHeight(x + 1, y - 1)) // North-East
		index += 128;
	return indexTable[index];
}

function drawShadow(world, wx, wy, context, x, y)
{
	var index = getShadowTile(world, x + wx, y + wy);
	var startX = (index & 7) * 64;
	var startY = Math.floor(index / 8) * 64;
	context.drawImage(shadows, startX, startY, 64, 64, x * 64, y * 64, 64, 64);
}

function drawOutline(world, wx, wy, context, x, y)
{
	var index = getOutlineTile(world, x + wx, y + wy) + 48;
	var startX = (index & 7) * 64;
	var startY = Math.floor(index / 8) * 64;
	context.drawImage(shadows, startX, startY, 64, 64, x * 64, y * 64, 64, 64);
}

var worldNoise = new ValueNoise(0);

class Chunk
{
	constructor(world, x, y)
	{
		this.canvas = document.createElement('canvas');
		this.canvas.width = chunkScale;
		this.canvas.height = chunkScale;
		this.ctx = this.canvas.getContext("2d");
		this.x = x * chunkScale;
		this.y = y * chunkScale;
		this.blockX = x * chunkSide;
		this.blockY = y * chunkSide;
		this.chunkX = x;
		this.chunkY = y;
		this.world = world;
		this.blocks = [];
		this.heightmap = [];
	}
	
	getIndex(x, y, z)
	{
		return (x * chunkSide + y) * chunkHeight + z;
	}
	
	/*getIndex(x, y)
	{
		return x * chunkSide + y;
	}*/
	
	getBlock(x, y, z)
	{
		return this.blocks[this.getIndex(x, y, z)];
	}
	
	getHeight(x, y)
	{
		//return this.heightmap[x * chunkSide + y];
		var index = this.getIndex(x, y, 1);
		return this.blocks[index] != null && !this.blocks[index].isTransparent() ? 1 : 0;
	}
	
	setBlock(x, y, z, block)
	{
		this.blocks[this.getIndex(x, y, z)] = block;
		var index =  x * chunkSide + y;;//this.getIndex(x, y);
		this.heightmap[index] = z;
		/*if (block != null)
		{
			if (this.heightmap[index] < z)
			{
				this.heightmap[index] = z;
			}
		}
		else
		{
			if (this.heightmap[index] == z)
			{
				this.heightmap[index] = z - 1;
			}
		}*/
	}
	
	rebuildChunk()
	{
		for (var z = 0; z < chunkHeight; z++)
		{
			for (var x = 0; x < chunkSide; x++)
			{
				for (var y = 0; y < chunkSide; y++)
				{
					var block = this.getBlock(x, y, z);
					if (block != null)
					{
						if (z == 0)
						{
							block.draw(this.ctx, x * 64, y * 64);
						}
						drawShadow(this.world, this.blockX, this.blockY, this.ctx, x, y);
						if (z > 0)
						{
							block.draw(this.ctx, x * 64, y * 64);
							drawOutline(this.world, this.blockX, this.blockY, this.ctx, x, y);
						}
					}
				}
			}
		}
		
		/*this.ctx.beginPath();
		this.ctx.lineWidth = "2";
		this.ctx.strokeStyle = "#FFFF00";
		this.ctx.rect(0, 0, chunkScale, chunkScale);
		this.ctx.stroke();*/
	}
	
	fillRandom()
	{
		var area = worldNoise.getArea(this.chunkX, this.chunkY, chunkSide);
		for (var x = 0; x < chunkSide; x++)
		{
			for (var y = 0; y < chunkSide; y++)
			{
				this.setBlock(x, y, 0, blocks.grass);
				if (area[y * chunkSide + x] > 0.5)
					this.setBlock(x, y, 1, blocks.stone);
			}
		}
	}
	
	draw(context)
	{
		context.drawImage(this.canvas, this.x + global.offsetX, this.y + global.offsetY);
	}
}

/*class World
{
	constructor(size)
	{
		this.size = size;
		this.blockSize = size * chunkSide;
		this.chunks = [];
		
		for (var x = 0; x < this.size; x++)
		{
			for (var y = 0; y < this.size; y++)
			{
				var chunk = new Chunk(this, x, y);
				chunk.fillRandom();
				this.chunks[x * this.size + y] = chunk;
			}
		}
		
		for (var x = 0; x < this.size; x++)
		{
			for (var y = 0; y < this.size; y++)
			{
				var chunk = this.getChunk(x, y);
				chunk.rebuildChunk();
			}
		}
	}
	
	getChunk(x, y)
	{
		return this.chunks[x * this.size + y];
	}
	
	setBlock(x, y, z, block)
	{
		var cx = Math.floor(x / chunkSide);
		var cy = Math.floor(y / chunkSide);
		if (cx >= 0 && cy >= 0 && cx < this.size && cy < this.size)
		{
			var bx = x & chunkMask;
			var by = y & chunkMask;
			var chunk = this.getChunk(cx, cy);
			chunk.setBlock(bx, by, z, block);
			
			var cx1 = bx == 0 ? cx - 1 : cx;
			var cy1 = by == 0 ? cy - 1 : cy;
			
			var cx2 = bx == chunkMask ? cx + 1 : cx;
			var cy2 = by == chunkMask ? cy + 1 : cy;
			
			for (cx = cx1; cx <= cx2; cx++)
			{
				for (cy = cy1; cy <= cy2; cy++)
				{
					if (cx >= 0 && cy >= 0 && cx < this.size && cy < this.size)
					{
						chunk = this.getChunk(cx, cy);
						chunk.rebuildChunk();
					}
				}
			}
		}
	}
	
	setArea(x1, y1, z1, x2, y2, z2, block)
	{
		x1 = Math.max(x1, 0);
		y1 = Math.max(y1, 0);
		
		x2 = Math.min(x2, this.blockSize - 1);
		y2 = Math.min(y2, this.blockSize - 1);
		
		var cx1 = Math.floor((x1 - 1) / chunkSide);
		var cy1 = Math.floor((y1 - 1) / chunkSide);
		
		var cx2 = Math.floor((x2 + 1) / chunkSide);
		var cy2 = Math.floor((y2 + 1) / chunkSide);
		
		cx1 = Math.max(cx1, 0);
		cy1 = Math.max(cy1, 0);
		
		cx2 = Math.min(cx2, this.size - 1);
		cy2 = Math.min(cy2, this.size - 1);
		
		var chunk;
		for (var x = x1; x <= x2; x++)
		{
			var cx = Math.floor(x / chunkSide);
			var bx = x & chunkMask;
			for (var y = y1; y <= y2; y++)
			{
				var cy = Math.floor(y / chunkSide);
				var by = y & chunkMask;
				chunk = this.getChunk(cx, cy);
				for (var z = z1; z <= z2; z++)
				{
					chunk.setBlock(bx, by, z, block);
				}
			}
		}
		
		for (cx = cx1; cx <= cx2; cx++)
		{
			for (cy = cy1; cy <= cy2; cy++)
			{
				chunk = this.getChunk(cx, cy);
				chunk.rebuildChunk();
			}
		}
	}
	
	getHeight(x, y)
	{
		var cx = Math.floor(x / chunkSide);
		var cy = Math.floor(y / chunkSide);
		if (cx >= 0 && cy >= 0 && cx < this.size && cy < this.size)
		{
			var chunk = this.getChunk(cx, cy);
			return chunk.getHeight(x & chunkMask, y & chunkMask);
		}
		return -1;
	}
	
	draw(context)
	{
		for (var x = 0; x < this.size; x++)
		{
			for (var y = 0; y < this.size; y++)
			{
				var chunk = this.getChunk(x, y);
				chunk.draw(context);
			}
		}
	}
}*/


class World
{
	constructor(size)
	{
		this.chunks = [];
		
		/*for (var x = 0; x < size; x++)
		{
			for (var y = 0; y < size; y++)
			{
				var chunk = new Chunk(this, x, y);
				chunk.fillRandom();
				this.chunks[x + ";" + y] = chunk;
			}
		}
		
		for (var x = 0; x < size; x++)
		{
			for (var y = 0; y < size; y++)
			{
				var chunk = this.getChunk(x, y);
				chunk.rebuildChunk();
			}
		}*/
	}
	
	getChunk(x, y)
	{
		var chunk = this.chunks[x + ";" + y];
		/*if (chunk == null)
		{
			chunk = new Chunk(this, x, y);
			chunk.fillRandom();
			this.chunks[x + ";" + y] = chunk;
		}*/
		return chunk;
	}
	
	setBlock(x, y, z, block)
	{
		var cx = Math.floor(x / chunkSide);
		var cy = Math.floor(y / chunkSide);

		var bx = x & chunkMask;
		var by = y & chunkMask;
		var chunk = this.getChunk(cx, cy);
		chunk.setBlock(bx, by, z, block);
		
		var cx1 = bx == 0 ? cx - 1 : cx;
		var cy1 = by == 0 ? cy - 1 : cy;
		
		var cx2 = bx == chunkMask ? cx + 1 : cx;
		var cy2 = by == chunkMask ? cy + 1 : cy;
		
		for (cx = cx1; cx <= cx2; cx++)
		{
			for (cy = cy1; cy <= cy2; cy++)
			{
				chunk = this.getChunk(cx, cy);
				chunk.rebuildChunk();
			}
		}
	}
	
	setArea(x1, y1, z1, x2, y2, z2, block)
	{
		var cx1 = Math.floor((x1 - 1) / chunkSide);
		var cy1 = Math.floor((y1 - 1) / chunkSide);
		
		var cx2 = Math.floor((x2 + 1) / chunkSide);
		var cy2 = Math.floor((y2 + 1) / chunkSide);
		
		var chunk;
		for (var x = x1; x <= x2; x++)
		{
			var cx = Math.floor(x / chunkSide);
			var bx = x & chunkMask;
			for (var y = y1; y <= y2; y++)
			{
				var cy = Math.floor(y / chunkSide);
				var by = y & chunkMask;
				chunk = this.getChunk(cx, cy);
				for (var z = z1; z <= z2; z++)
				{
					chunk.setBlock(bx, by, z, block);
				}
			}
		}
		
		for (cx = cx1; cx <= cx2; cx++)
		{
			for (cy = cy1; cy <= cy2; cy++)
			{
				chunk = this.getChunk(cx, cy);
				chunk.rebuildChunk();
			}
		}
	}
	
	getHeight(x, y)
	{
		var cx = Math.floor(x / chunkSide);
		var cy = Math.floor(y / chunkSide);
		var chunk = this.getChunk(cx, cy);
		return chunk.getHeight(x & chunkMask, y & chunkMask);
	}
	
	generateAround(cx, cy, radius)
	{
		for (var x = cx - radius; x <= cx + radius; x++)
		{
			for (var y = cy - radius; y <= cy + radius; y++)
			{
				var chunk = this.chunks[x + ";" + y];
				if (chunk == null)
				{
					chunk = new Chunk(this, x, y);
					chunk.fillRandom();
					chunk.isNew = true;
					this.chunks[x + ";" + y] = chunk;
				}
			}
		}
		
		radius -= 1;
		for (var x = cx - radius; x <= cx + radius; x++)
		{
			for (var y = cy - radius; y <= cy + radius; y++)
			{
				var chunk = this.chunks[x + ";" + y];
				if (chunk != null && chunk.isNew == true)
				{
					chunk.rebuildChunk();
					chunk.isNew = false;
				}
			}
		}
	}
	
	draw(context, cx, cy, radius)
	{
		for (var x = cx - radius; x <= cx + radius; x++)
		{
			for (var y = cy - radius; y <= cy + radius; y++)
			{
				var chunk = this.getChunk(x, y);
				if (chunk != null)
					chunk.draw(context);
			}
		}
	}
}