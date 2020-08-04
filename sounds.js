sounds = [];

function registerSound(name)
{
	sounds[name] = new Audio("sounds/" + name + ".mp3");
}

function getSound(name)
{
	return sounds[name];
}

registerSound("stone");

sounds.default = getSound("stone");