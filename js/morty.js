var game = new Phaser.Game(28 * 28,31 * 28, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var map, mapLayer, pillsLayer;
var player;
var controls;

function preload(){

	game.load.image("tilemap","assets/tilemap.png");
	game.load.image("pills","assets/pills.png");
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
	pillsLayer = map.createLayer("pills");
	mapLayer.resizeWorld();
	
	map.setCollisionByExclusion([1],true, "tiles");
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