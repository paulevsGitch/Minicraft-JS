class RND
{
	constructor()
	{
		this.next = 0;
	}

	setSeed(seed)
	{
		this.next = seed;
	}
	
	setSeed(x, y)
	{
		this.next = x * 1103515245 + y;
	}
	
	randomInt()
	{
		this.next = (this.next * 25214903917 + 11) % 281474976710656;
		return this.next;
	}
	
	randomFloat()
	{
		return this.randomInt() % 1000 / 1000.0;
	}
}