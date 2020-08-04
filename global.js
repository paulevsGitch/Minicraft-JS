var blockAtlas = new Image();
blockAtlas.src = "textures/terrain_2.png";

var shadows = new Image();
shadows.src = "textures/edges_shadows.png";

var blocks = [];

var global = [];
global.canvas = document.getElementById("myCanvas");
global.ctx = global.canvas.getContext("2d");
global.loaded = false;
global.cameraX = 0.0;
global.cameraY = 0.0;
global.offsetX = 0;
global.offsetY = 0;

global.moveRight = false;
global.moveLeft = false;
global.moveUp = false;
global.moveDown = false;
global.shift = false;

global.ctx.imageSmoothingEnabled = false;
global.ctx.webkitImageSmoothingEnabled  = false;
global.ctx.mozImageSmoothingEnabled  = false;

global.hotbar_div = document.getElementById("hotbar_div");
global.hotbar = document.getElementById("hotbar");
global.hotbar.items = [];