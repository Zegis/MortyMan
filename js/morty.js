/* global Phaser*/
/* global Utils */
/*global GhostMode */
/*global Ghost */

var game = new Phaser.Game(Utils.mapWidth, Utils.mapHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update});
var map, mapLayer;
var player;
var controls;
var scorePills, superPills;
var scoreTxt, score;
var blinky;
var superTimer;
var modeChangeTimer;
var currentWave;

var decisionPoints;
var specialPoints;

function preload(){
	game.load.image("tilemap","assets/tilemap.png");
	game.load.spritesheet("pills","assets/pills.png",28,28);
	game.load.tilemap("map","map/tmap.json",null,Phaser.Tilemap.TILED_JSON);
	game.load.image("pacman","assets/pacman.png");
	game.load.image("blinky","assets/red_ghost.png");
	game.load.image("scared","assets/frighten_ghost.png");
	game.load.image("killed","assets/killed_ghost.png");
};

function create(){
	
	createMap();
	createPlayer();
	
	blinky = new Ghost(game, 1, 2, "blinky",26,0);
	blinky.move(Utils.Right);
	
	// create controls
	controls = game.input.keyboard.createCursorKeys();
	score = 0;
	scoreTxt = game.add.text(2,28*11, score, {fill: "#ccc", font: "bold 20px Arial"});
	
	superTimer = game.time.create(false);
	currentWave = 0;
	modeChangeTimer = game.time.create(false);
	modeChangeTimer.add(WaveTimes[currentWave],modeChange,this);
		
	decisionPoints = [ new Phaser.Point(6,1), new Phaser.Point(21,1),
	new Phaser.Point(1,5),new Phaser.Point(6,5),new Phaser.Point(9,5),new Phaser.Point(12,5),
	new Phaser.Point(15,5),new Phaser.Point(18,5),new Phaser.Point(21,5),new Phaser.Point(26,5),
	new Phaser.Point(6,8),new Phaser.Point(21,8),
	new Phaser.Point(6,14),new Phaser.Point(9,14),new Phaser.Point(18,14),new Phaser.Point(21,14),
	new Phaser.Point(9,17),new Phaser.Point(18,17),
	new Phaser.Point(6,20),new Phaser.Point(9,20),new Phaser.Point(18,20),new Phaser.Point(21,20),
	new Phaser.Point(6,23),new Phaser.Point(9,23),new Phaser.Point(18,23),new Phaser.Point(21,23),
	new Phaser.Point(3,26),new Phaser.Point(24,26),
	new Phaser.Point(12,29),new Phaser.Point(15,29)];
	
	specialPoints = [new Phaser.Point(13,11)];
	
	modeChangeTimer.start();
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
	//player = game.add.sprite((28*13)+16 , (28 * 23)+1,"pacman"); // original start point
	player = game.add.sprite((Utils.TILE_SIZE*3) , (Utils.TILE_SIZE * 14),"pacman"); // debug start point
	game.physics.enable(player, Phaser.Physics.ARCADE);
	
}

function modeChange(){
	if(blinky.mode !== GhostMode.Killed)
	{
		if(blinky.mode === GhostMode.Scatter)
			blinky.changeMode(GhostMode.Chase);
		else
			blinky.changeMode(GhostMode.Scatter);
	}
	if(currentWave < WaveTimes.length)
	{
		++currentWave;
		modeChangeTimer.add(WaveTimes[currentWave],modeChange,this);
	}
};

function update(){

	this.game.physics.arcade.collide(player,mapLayer);
	this.game.physics.arcade.overlap(player,scorePills,updateScore);
	this.game.physics.arcade.overlap(player,superPills, makeSuper);
	this.game.physics.arcade.overlap(player,blinky, touchGhost);
	
	if(blinky.PositionChanged()){
		if(Utils.arrayContains(decisionPoints,blinky.marker)) // if in decision point
			blinky.makeDecision(player,map);
		else if(Utils.arrayContains(specialPoints, blinky.marker))
			blinky.utilizeSpecialPoint();
	}
	this.game.physics.arcade.collide(blinky,mapLayer, ghostCollide);
	
	
	// check Key
	if(controls.left.isDown)
	{
		player.body.velocity.x = -93;
	}
	else if(controls.right.isDown)
	{
		player.body.velocity.x = 93;
	}
	if(controls.down.isDown)
	{
		player.body.velocity.y = 93;
	}
	else if(controls.up.isDown)
	{
		player.body.velocity.y = -93;
	}
	
	if(scorePills.countDead() == scorePills.length)
		alert("Victory!");	
		
	tunel(player);
	tunel(blinky);
	
	game.debug.text(currentWave,20,20,"#CCC");
};

function tunel(object)
{
	if(object.x >= (Utils.TileToPixels(28)+14))
		object.x = Utils.TileToPixels(-1);
	else if(object.x <= Utils.TileToPixels(-1))
		object.x = Utils.TileToPixels(28);
};

function updateScore(player,pill){
	pill.kill();
	score += 10;
	scoreTxt.setText("Score: " + score);
};

function makeSuper(player,pill){
		pill.kill();
		blinky.changeMode(GhostMode.Scared,"scared");
		superTimer.add(6000, makeNormal,this);
		superTimer.start();
		
		modeChangeTimer.pause();
}

function makeNormal(){
	if(blinky.mode !== GhostMode.Killed)
		blinky.changeMode(GhostMode.BackToNormal,"blinky");
	modeChangeTimer.resume();
}

function touchGhost(player, ghost){
	if(ghost.mode !== GhostMode.Killed)
	{
		if(ghost.mode === GhostMode.Scared)
			ghost.changeMode(GhostMode.Killed,"killed");
		else
			player.kill();
	}
}

function ghostCollide(ghost, tile){
	
	ghost.updateDirections(map);
	ghost.collide();
}