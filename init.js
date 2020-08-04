var scripts = [
	"global.js",
	"random.js",
	"noise.js",
	"keyController.js",
	"mouseController.js",
	"mouseController.js",
	"sounds.js",
	"blocks.js",
	"storage.js",
	"game.js"
];

var bar = document.getElementById("progress");
bar.style.top = (document.body.clientHeight + document.getElementById("header").clientHeight) / 2;
bar.style.left = (document.body.clientWidth - bar.clientWidth) / 2;

function enableScript(input)
{
	var myScript = document.createElement("script");
	myScript.setAttribute("src", input);
	myScript.defer = true;
	document.body.appendChild(myScript);
	return myScript;
}

function setProgress(value)
{
	bar.style.background = "linear-gradient(to right, green " + value + "%, black " + value + "%)";
	bar.innerHTML = Math.floor(value) + "%";
}

var scriptIndex = 0;
var loadingScript = enableScript(scripts[0]);
var checkExist = setInterval(function() {
	if (loadingScript != null) {
		scriptIndex += 1;
		setProgress(scriptIndex * 100 / scripts.length);
		if (scriptIndex == scripts.length)
			clearInterval(checkExist);
		else
			loadingScript = enableScript(scripts[scriptIndex]);
	}
}, 100);