function lerp(a, b, mix)
{
	return a * (1 - mix) + b * mix;
}

class ValueNoise
{
	constructor(seed)
	{
		this.seed = seed;
		this.rnd = new RND();
	}
	
	getValue(x, y)
	{
		this.rnd.setSeed(x, y);
		return this.rnd.randomFloat();
	}
	
	getArea(x, y, side)
	{
		var x2 = x + 1;
		var y2 = y + 1;
		
		var a = this.getValue(x, y);
		var b = this.getValue(x2, y);
		var c = this.getValue(x, y2);
		var d = this.getValue(x2, y2);
		
		var result = [];
		var s2 = side * side;
		for (var i = 0; i < s2; i++)
		{
			var dx = (i % side) / side;
			var dy = (Math.floor(i / side)) / side;
			
			var e = lerp(a, b, dx);
			var f = lerp(c, d, dx);
			
			result[i] = lerp(e, f, dy);
		}
		
		return result;
	}
}