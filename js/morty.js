/* global Phaser*/
/* global Utils */

var game = new Phaser.Game(Utils.mapWidth, Utils.mapHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update});
var map, mapLayer;
var player;
var controls;
var scorePills, superPills;
var scoreTxt, score;
var blinky;
var isSuper;
var superTimer;

var marker;
var directions;
var distance;

var decisionPoints;
var target;

function preload(){
	game.load.image("tilemap","assets/tilemap.png");
	game.load.spritesheet("pills","assets/pills.png",28,28);
	game.load.tilemap("map","map/tmap.json",null,Phaser.Tilemap.TILED_JSON);
	game.load.image("pacman","assets/pacman.png");
	game.load.image("blinky","assets/red_ghost.png");
	game.load.image("scared","assets/frighten_ghost.png");
};

function create(){
	
	createMap();
	createPlayer();
	
	blinky = game.add.sprite((Utils.TILE_SIZE*1), (Utils.TILE_SIZE*2),"blinky");
	game.physics.enable(blinky, Phaser.Physics.ARCADE);
	blinky.body.bounce.y = 0;
	blinky.body.bounce.x = 0;
	
	// create controls
	controls = game.input.keyboard.createCursorKeys();
	score = 0;
	scoreTxt = game.add.text(2,28*11, score, {fill: "#ccc", font: "bold 20px Arial"});
	
	isSuper = false;
	superTimer = game.time.create(false);
	
	marker = new Phaser.Point(0,0);
	target = new Phaser.Point(1,29);
	directions = [null, null, null, null];
	distance = [null, null, null, null];
	
	blinky.body.velocity.x = 93;
	blinky.direction = Utils.Left;
	
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

function update(){

	this.game.physics.arcade.collide(player,mapLayer);
	this.game.physics.arcade.overlap(player,scorePills,updateScore);
	this.game.physics.arcade.overlap(player,superPills, makeSuper);
	this.game.physics.arcade.overlap(player,blinky, touchGhost);
	
	var	tmpX ;
	var	tmpY;
	
	if(blinky.body.velocity.x < 0)
		tmpX = Phaser.Math.snapToFloor(Math.floor(blinky.x + blinky.width),Utils.TILE_SIZE) / Utils.TILE_SIZE;
	else
		tmpX = Phaser.Math.snapToFloor(Math.floor(blinky.x),Utils.TILE_SIZE) / Utils.TILE_SIZE;
		
	if(blinky.body.velocity.y < 0)
	{
		tmpY  = Phaser.Math.snapToFloor(Math.floor(blinky.y + blinky.height),Utils.TILE_SIZE) / Utils.TILE_SIZE;
	}
	else
		tmpY  = Phaser.Math.snapToFloor(Math.floor(blinky.y),Utils.TILE_SIZE) / Utils.TILE_SIZE;
	
	if(tmpX != marker.x || tmpY != marker.y){
		marker.x = tmpX;
		marker.y = tmpY;
		if(Utils.arrayContains(decisionPoints,marker)) // if in decision point
		{
			updateTarget(player,decideGhostDirection);
		}
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
};

function tunel(object)
{
	if(object.x >= (Utils.TILE_SIZE*28+14))
		object.x = -1 * Utils.TILE_SIZE;
	else if(object.x <= -1 * Utils.TILE_SIZE)
		object.x = (28*Utils.TILE_SIZE);
};

function updateTarget(player, callback)
{
	target.x = Phaser.Math.snapToFloor(Math.floor(player.x),Utils.TILE_SIZE) / Utils.TILE_SIZE;
	target.y = Phaser.Math.snapToFloor(Math.floor(player.y),Utils.TILE_SIZE) / Utils.TILE_SIZE;
	
	callback();
};

function updateScore(player,pill){
	pill.kill();
	score += 10;
	scoreTxt.setText("Score: " + score);
};

function makeSuper(player,pill){
	if(isSuper == false)
	{
	pill.kill();
	isSuper = true;
	blinky.loadTexture("scared");
	superTimer.add(6000, makeNormal,this);
	superTimer.start();
	}
}

function makeNormal(){
	isSuper = false;
	blinky.loadTexture("blinky");
}

function touchGhost(player, ghost){
	if(isSuper)
		ghost.kill();
	else
		player.kill();
}

function ghostCollide(ghost, tile)
{
	
	directions[Utils.Up] = map.getTileAbove(mapLayer.index, marker.x, marker.y);
	directions[Utils.Left] = map.getTileLeft(mapLayer.index, marker.x, marker.y);
	directions[Utils.Down] = map.getTileBelow(mapLayer.index, marker.x, marker.y);
	directions[Utils.Right] = map.getTileRight(mapLayer.index, marker.x, marker.y);
	
	var length = directions.length;
	
	for( var i = Utils.Up; i < length;)
	{
		if(i !== ghost.direction && directions[i].index === 1)
		{
			if(i === Utils.Up)
			{
				ghost.body.velocity.y = -93;
				ghost.direction = Utils.Down;
			}
			else if(i === Utils.Left)
			{
				ghost.body.velocity.x = -93;
				ghost.direction = Utils.Right;
			}
			else if(i === Utils.Down)
			{
				ghost.body.velocity.y = 93;
				ghost.direction = Utils.Up;
			}
			else if(i === Utils.Right)
			{
				ghost.body.velocity.x = 93;
				ghost.direction = Utils.Left;
			}
				
			break;
		}
		else
		{
			++i;
		}
	}
}

function decideGhostDirection()
{
	directions[Utils.Up] = map.getTileAbove(mapLayer.index, marker.x, marker.y);
	directions[Utils.Left] = map.getTileLeft(mapLayer.index, marker.x, marker.y);
	directions[Utils.Down] = map.getTileBelow(mapLayer.index, marker.x, marker.y);
	directions[Utils.Right] = map.getTileRight(mapLayer.index, marker.x, marker.y);
	
	blinky.x = marker.x*Utils.TILE_SIZE;
	blinky.y = marker.y*Utils.TILE_SIZE;
	
	blinky.body.reset(marker.x*Utils.TILE_SIZE,marker.y*Utils.TILE_SIZE);
	
	var length = directions.length;
	
	for(var i= 0; i < length; i++)
	{	
		if(directions[i].index === 1 && i !== blinky.direction)
			distance[i] = Phaser.Point.distance(target,directions[i]);
		else
			distance[i] = 2000;
	}
	
	var smallest = 0;
	for(i=1; i < length; i++)
	{
		if(distance[smallest] > distance[i])
			smallest = i;
	}
	
	if(smallest != blinky.direction && directions[smallest].index === 1)
	{
		if(smallest === Utils.Up)
		{
			blinky.body.velocity.x = 0;
			blinky.body.velocity.y = -93;
			blinky.direction = Utils.Down;
		}
		else if(smallest === Utils.Left)
		{
			blinky.body.velocity.x = -93;
			blinky.body.velocity.y = 0;
			blinky.direction = Utils.Right;
		}
		else if(smallest === Utils.Down)
		{
			blinky.body.velocity.y = 93;
			blinky.body.velocity.x = 0;
			blinky.direction = Utils.Up;
		}
		else if(smallest === Utils.Right)
		{
			blinky.body.velocity.y = 0;
			blinky.body.velocity.x = 93;
			blinky.direction = Utils.Left;
		}
	}
}