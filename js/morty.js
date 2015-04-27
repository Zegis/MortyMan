var game = new Phaser.Game(28 * 28,31 * 28, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var map, mapLayer;
var player;
var controls;
var scorePills, superPills;
var scoreTxt, score;
var blinky;
var isSuper;

function preload(){

	game.load.image("tilemap","assets/tilemap.png");
	game.load.spritesheet("pills","assets/pills.png",28,28);
	game.load.tilemap("map","map/tmap.json",null,Phaser.Tilemap.TILED_JSON);
	game.load.image("pacman","assets/pacman.png");
	game.load.image("blinky","assets/red_ghost.png");
};

function create(){
	
	createMap();
	createPlayer();
	
	blinky = game.add.sprite(28*5, (28*14)+1,"blinky");
	game.physics.enable(blinky, Phaser.Physics.ARCADE);
	
	// create controls
	controls = game.input.keyboard.createCursorKeys();
	score = 0;
	scoreTxt = game.add.text(2,28*11, score, {fill: "#ccc", font: "bold 20px Arial"});
	
	isSuper = false;
};

function createMap(){
	map = game.add.tilemap("map");
	
	map.addTilesetImage("tilemap","tilemap");
	map.addTilesetImage("pills","pills");
	
	mapLayer = map.createLayer("tiles");
	
	mapLayer.resizeWorld();
	
	map.setCollisionByExclusion([1],true, "tiles");
	
	scorePills = game.add.group();
	game.physics.enable(scorePills, Phaser.Physics.ARCADE);
	scorePills.enableBody = true;
	superPills = game.add.group();
	game.physics.enable(superPills, Phaser.Physics.ARCADE);
	superPills.enableBody = true;
	
	map.createFromTiles(6,null,"pills","pills",scorePills, {frame: 0});
	map.createFromTiles(7,null,"pills","pills",superPills, {frame: 1});
	
	scorePills.forEach(function(s){
		s.body.immovable = true;
	},this);
};

function createPlayer(){
	//player = game.add.sprite((28*13)+16 , (28 * 23)+1,"pacman");
	player = game.add.sprite((28*3) , (28 * 14)+1,"pacman");
	game.physics.enable(player, Phaser.Physics.ARCADE);
	
}

function update(){

	this.game.physics.arcade.collide(player,mapLayer);
	this.game.physics.arcade.collide(player,scorePills,updateScore);
	this.game.physics.arcade.collide(player,superPills, makeSuper);
	this.game.physics.arcade.collide(player,blinky, touchGhost);

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
		
	if(scorePills.countDead() == scorePills.length)
		alert("Victory!");
	
	game.debug.text(isSuper,20,20, "#CCC");
		
	if( (player.x) >= (28*28+14))
		player.x = -28;
	else if((player.x) <= -28)
		player.x = (28*28);
};

function updateScore(player,pill){
	console.log("!");
	pill.kill();
	score += 10;
	scoreTxt.setText("Score: " + score);
	console.log(scorePills.countDead());
};

function makeSuper(player,pill){
	pill.kill();
	isSuper = true;
}

function touchGhost(player, ghost){
	if(isSuper)
		ghost.kill();
	else
		player.kill();
}