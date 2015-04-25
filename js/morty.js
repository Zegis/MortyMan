var game = new Phaser.Game(28 * 28,31 * 28, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var map, mapLayer, pillsLayer;
var player;
var controls;

function preload(){

	game.load.image("tileset","assets/tilemap.png");
	game.load.image("pills","assets/pills.png");
	game.load.tilemap("map","map/tmap.json",null,Phaser.Tilemap.TILED_JSON);
	game.load.image("pacman","assets/pacman.png");
	
};

function create(){

	map = game.add.tilemap("map");
	map.addTilesetImage("tilemap","tileset");
	map.addTilesetImage("pills","pills");
	
	
	
	mapLayer = map.createLayer("tiles");
	pillsLayer = map.createLayer("pills");
	
	// create player
	player = game.add.sprite(28*13 , 28 * 23,"pacman");
	game.physics.enable(player, Phaser.Physics.ARCADE);
	
	mapLayer.resizeWorld();
	
	// create controls
	controls = game.input.keyboard.createCursorKeys();


};

function update(){
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	if(controls.left.isDown)
		player.body.velocity.x = -28;
	else if(controls.right.isDown)
		player.body.velocity.x = 28;
	else if(controls.down.isDown)
		player.body.velocity.y = 28;
	else if(controls.up.isDown)
		player.body.velocity.y = -28;
};