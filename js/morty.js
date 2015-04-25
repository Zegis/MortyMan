var game = new Phaser.Game(28 * 28,31 * 28, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var map, mapLayer;
var player;
var controls;
var scorePills, superPills;

function preload(){

	game.load.image("tilemap","assets/tilemap.png");
	game.load.spritesheet("pills","assets/pills.png",28,28);
	game.load.tilemap("map","map/tmap.json",null,Phaser.Tilemap.TILED_JSON);
	game.load.image("pacman","assets/pacman.png");
	
};

function create(){
	
	createMap();
	createPlayer();
	
	// create controls
	controls = game.input.keyboard.createCursorKeys();
};

function createMap(){
	map = game.add.tilemap("map");
	
	map.addTilesetImage("tilemap","tilemap");
	map.addTilesetImage("pills","pills");
	
	mapLayer = map.createLayer("tiles");
	
	mapLayer.resizeWorld();
	
	map.setCollisionByExclusion([1],true, "tiles");
	
	scorePills = game.add.group();
	superPills = game.add.group();
	
	map.createFromTiles(6,null,"pills","pills",scorePills, {frame: 0});
	map.createFromTiles(7,null,"pills","pills",superPills, {frame: 1});
};

function createPlayer(){
	player = game.add.sprite((28*13)+16 , (28 * 23)+1,"pacman");
	game.physics.enable(player, Phaser.Physics.ARCADE);
}

function update(){

	this.game.physics.arcade.collide(player,mapLayer);

	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	
	if(controls.left.isDown)
		player.body.velocity.x = -112;
	else if(controls.right.isDown)
		player.body.velocity.x = 112;
	if(controls.down.isDown)
		player.body.velocity.y = 112;
	else if(controls.up.isDown)
		player.body.velocity.y = -112;
};