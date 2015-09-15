/* global Phaser*/
/* global Utils */
/*global GhostMode */
/*global Ghost */
/*global Blinky */

var game = new Phaser.Game(Utils.mapWidth, Utils.mapHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update});
var map, mapLayer;
var player;
var controls;
var scorePills, superPills;
var scoreTxt, score;
var blinky;
var pinky;
var clyde;
var superTimer;
var modeChangeTimer;
var currentWave;

var decisionPoints;
var specialPoints;

var lives;
var livesTxt;

function preload(){
	game.load.image("tilemap","assets/tilemap.png");
	game.load.spritesheet("pills","assets/pills.png",28,28);
	game.load.tilemap("map","map/tmap.json",null,Phaser.Tilemap.TILED_JSON);
	game.load.image("pacman","assets/pacman.png");
	game.load.image("blinky","assets/red_ghost.png");
	game.load.image("pinky","assets/pink_ghost.png");
	game.load.image("clyde","assets/orange_ghost.png");
	game.load.image("scared","assets/frighten_ghost.png");
	game.load.image("killed","assets/killed_ghost.png");
};

function create(){
	
	createMap();
	createPlayer();
	
	//blinky = new Ghost(game, 1, 2, "blinky",26,0);
	blinky = new Blinky(game,1,2,"blinky",26,0);
	blinky.move(Utils.Right);
	
	pinky = new Pinky(game,26,2,"pinky",1,0);
	pinky.move(Utils.Left);
	
	clyde = new Clyde(game,26,27,"clyde",1,30);
	clyde.move(Utils.Left);
	
	game.add.existing(blinky);
	game.add.existing(pinky);
	game.add.existing(clyde);
	
	// create controls
	controls = game.input.keyboard.createCursorKeys();
	score = 0;
	lives = 3;
	scoreTxt = game.add.text(2,28*11, score, {fill: "#ccc", font: "bold 20px Arial"});
	livesTxt = game.add.text(28*24,28*11, "Lives: " + lives, {fill: "#ccc", font: "bold 20px Arial"});
	
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
	
	specialPoints = [new Phaser.Point(13,11),new Phaser.Point(12,11)];
	
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
	player = game.add.sprite((Utils.TILE_SIZE*9) , (Utils.TILE_SIZE * 8),"pacman"); // debug start point
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.direction = Utils.NONE;
	
}

function modeChange(){
	if(blinky.mode !== GhostMode.Killed)
	{
		if(blinky.mode === GhostMode.Scatter)
			blinky.changeMode(GhostMode.Chase);
		else
			blinky.changeMode(GhostMode.Scatter);
	}
	if(pinky.mode !== GhostMode.Killed)
	{
		if(pinky.mode === GhostMode.Scatter)
			pinky.changeMode(GhostMode.Chase);
		else
			pinky.changeMode(GhostMode.Scatter);
	}
	if(clyde.mode !== GhostMode.Killed)
	{
		if(clyde.mode === GhostMode.Scatter)
			clyde.changeMode(GhostMode.Chase);
		else
			clyde.changeMode(GhostMode.Scatter);
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
	this.game.physics.arcade.overlap(player,pinky, touchGhost);
	this.game.physics.arcade.overlap(player,clyde, touchGhost);
	
	if(blinky.PositionChanged()){
		if(Utils.arrayContains(decisionPoints,blinky.marker)) // if in decision point
			blinky.makeDecision(player,null,map);
		else if(Utils.arrayContains(specialPoints,blinky.marker))
			blinky.utilizeSpecialPoint(map);
	}
	this.game.physics.arcade.collide(blinky,mapLayer, ghostCollide);
	
	if(pinky.PositionChanged()){
		if(Utils.arrayContains(decisionPoints,pinky.marker)) // if in decision point
			pinky.makeDecision(player,null,map);
		else if(Utils.arrayContains(specialPoints,pinky.marker))
			pinky.utilizeSpecialPoint(map);
	}
	this.game.physics.arcade.collide(pinky,mapLayer, ghostCollide);
	
	if(clyde.PositionChanged()){
		if(Utils.arrayContains(decisionPoints,clyde.marker)) // if in decision point
			clyde.makeDecision(player,null,map);
		else if(Utils.arrayContains(specialPoints,clyde.marker))
			clyde.utilizeSpecialPoint(map);
	}
	this.game.physics.arcade.collide(clyde,mapLayer, ghostCollide);
	
	
	// check Key
	if(controls.left.isDown)
	{
		player.body.velocity.x = -93;
		player.direction = Utils.Left;
	}
	else if(controls.right.isDown)
	{
		player.body.velocity.x = 93;
		player.direction = Utils.Right;
	}
	if(controls.down.isDown)
	{
		player.body.velocity.y = 93;
		player.direction = Utils.Down;
	}
	else if(controls.up.isDown)
	{
		player.body.velocity.y = -93;
		player.direction = Utils.Up;
	}
	
	if(scorePills.countDead() == scorePills.length)
	{
		blinky.body.velocity.x = 0;
		blinky.body.velocity.y = 0;
		
		pinky.body.velocity.x = 0;
		pinky.body.velocity.y = 0;
		
		clyde.body.velocity.x = 0;
		clyde.body.velocity.y = 0;
		
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		
		livesTxt.setText("Victory!");
		livesTxt.reset(Utils.tileToPixels(13), Utils.tileToPixels(14));
		
	}
		
	tunel(player);
	tunel(blinky);
	tunel(pinky);
	tunel(clyde);
	
	game.debug.text(Utils.pixelsToTiles(player.x) + " " 
				+ Utils.pixelsToTiles(player.y) + ","
				+ clyde.target.x + " " 
				+ clyde.target.y,20,20,"#CCC");
				
	game.debug.text(currentWave,5,50,"#CCC");
	game.debug.text("b " + blinky.mode,5,70,"#CCC");
	game.debug.text("p " + pinky.mode,5,90,"#CCC");
	
};

function tunel(object)
{
	if(object.x >= (Utils.tileToPixels(28)+14))
		object.x = Utils.tileToPixels(-1);
	else if(object.x <= Utils.tileToPixels(-1))
		object.x = Utils.tileToPixels(28);
};

function updateScore(player,pill){
	pill.kill();
	score += 10;
	scoreTxt.setText("Score: " + score);
};

function makeSuper(player,pill){
		pill.kill();
		blinky.changeMode(GhostMode.Scared,"scared");
		pinky.changeMode(GhostMode.Scared,"scared");
		clyde.changeMode(GhostMode.Scared,"scared");
		superTimer.add(6000, makeNormal,this);
		superTimer.start();
		
		modeChangeTimer.pause();
}

function makeNormal(){
	if(blinky.mode !== GhostMode.Killed)
		blinky.changeMode(GhostMode.BackToNormal,"blinky");
	if(pinky.mode !== GhostMode.Killed)
		pinky.changeMode(GhostMode.BackToNormal,"pinky");
	if(clyde.mode !== GhostMode.Killed)
		clyde.changeMode(GhostMode.BackToNormal,"clyde");
	modeChangeTimer.resume();
}

function touchGhost(player, ghost){
	if(ghost.mode !== GhostMode.Killed)
	{
		if(ghost.mode === GhostMode.Scared)
		{
			ghost.changeMode(GhostMode.Killed,"killed");
			score += 100;
			scoreTxt.setText("Score: " + score);
		}
		else
		{
			lives -= 1;
			livesTxt.setText("Lives: " + lives);
			if(lives > 0)
			{
				player.x = Utils.tileToPixels(9);
				player.y = Utils.tileToPixels(8);
				player.body.reset(Utils.tileToPixels(9),Utils.tileToPixels(8));
				
				ghost.resetPosition();
				ghost.move(Utils.Left);
			}
			else
			{
				player.kill();
				livesTxt.setText("Game over!");
				livesTxt.reset(Utils.tileToPixels(12), Utils.tileToPixels(14));
			}
		}
	}
}

function ghostCollide(ghost, tile){
	
	ghost.updateDirections(map);
	ghost.collide();
}