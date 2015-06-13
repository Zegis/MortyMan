var game = new Phaser.Game(28 * 28,31 * 28, Phaser.AUTO, '', { preload: preload, create: create, update: update});
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
var current;

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
	
	blinky = game.add.sprite((28*1), (28*2),"blinky");
//	blinky.anchor.set(0.5);
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
	directions = [null, null, null, null, null];
	distance = [null, null, null, null, null];
	
	blinky.body.velocity.x = 93;
	blinky.direction = 2;
	
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
	player = game.add.sprite((28*3) , (28 * 14),"pacman"); // debug start point
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
		tmpX = Phaser.Math.snapToFloor(Math.floor(blinky.x + blinky.width),28) / 28;
	else
		tmpX = Phaser.Math.snapToFloor(Math.floor(blinky.x),28) / 28;
		
	if(blinky.body.velocity.y < 0)
	{
		tmpY  = Phaser.Math.snapToFloor(Math.floor(blinky.y + blinky.height),28) / 28;
	}
	else
		tmpY  = Phaser.Math.snapToFloor(Math.floor(blinky.y),28) / 28;
	
	if(tmpX != marker.x || tmpY != marker.y){
		marker.x = tmpX;
		marker.y = tmpY;
		if(decisionPoints.contains(marker)) // if in decision point
		{
			updateTarget(player,decideGhostDirection);
			// decideGhostDirection();
		}
	}

	this.game.physics.arcade.collide(blinky,mapLayer, ghostCollide);
	
	
	// check Key
	if(controls.left.isDown)
	{
		player.body.velocity.x = -93;
		current = Phaser.LEFT;
	}
	else if(controls.right.isDown)
	{
		player.body.velocity.x = 93;
		current = Phaser.RIGHT;
	}
	if(controls.down.isDown)
	{
		player.body.velocity.y = 93;
		current = Phaser.DOWN;
	}
	else if(controls.up.isDown)
	{
		player.body.velocity.y = -93;
		current = Phaser.UP;
	}
	
	if(scorePills.countDead() == scorePills.length)
		alert("Victory!");	
		
	if( (player.x) >= (28*28+14))
		player.x = -28;
	else if((player.x) <= -28)
		player.x = (28*28);
};

function updateTarget(player, callback)
{
	target.x = Phaser.Math.snapToFloor(Math.floor(player.x),28) / 28;
	target.y = Phaser.Math.snapToFloor(Math.floor(player.y),28) / 28;
	
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
	
	directions[1] = map.getTileAbove(mapLayer.index, marker.x, marker.y);
	directions[2] = map.getTileLeft(mapLayer.index, marker.x, marker.y);
	directions[3] = map.getTileBelow(mapLayer.index, marker.x, marker.y);
	directions[4] = map.getTileRight(mapLayer.index, marker.x, marker.y);
	
	for( var i = 1; i < 5;)
	{
		if(i !== ghost.direction && directions[i].index === 1)
		{
			if(i === 1)
			{
				ghost.body.velocity.y = -93;
				ghost.direction = 3;
			}
			else if(i === 2)
			{
				ghost.direction = 4;
				ghost.body.velocity.x = -93;
			}
			else if(i === 3)
			{
				ghost.direction = 1;
				ghost.body.velocity.y = 93;
			}
			else if(i === 4)
			{
				ghost.direction = 2;
				ghost.body.velocity.x = 93;
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
	directions[1] = map.getTileAbove(mapLayer.index, marker.x, marker.y);
	directions[2] = map.getTileLeft(mapLayer.index, marker.x, marker.y);
	directions[3] = map.getTileBelow(mapLayer.index, marker.x, marker.y);
	directions[4] = map.getTileRight(mapLayer.index, marker.x, marker.y);
	
	blinky.x = marker.x*28;
	blinky.y = marker.y*28;
	
	blinky.body.reset(marker.x*28,marker.y*28);
	
	for(var i=1; i<5; i++)
	{	
		if(directions[i].index === 1 && i !== blinky.direction)
			distance[i] = Phaser.Point.distance(target,directions[i]);
		else
			distance[i] = 2000;
	}
	
	var smallest = 1;
	for(i=2; i<5; i++)
	{
		if(distance[smallest] > distance[i])
			smallest = i;
	}
	
	if(smallest != blinky.direction && directions[smallest].index === 1)
	{
		if(smallest === 1)
		{
			blinky.body.velocity.x = 0;
			blinky.body.velocity.y = -93;
			blinky.direction = 3;
		}
		else if(smallest === 2)
		{
			blinky.direction = 4;
			blinky.body.velocity.x = -93;
			blinky.body.velocity.y = 0;
		}
		else if(smallest === 3)
		{
			blinky.direction = 1;
			blinky.body.velocity.y = 93;
			blinky.body.velocity.x = 0;
		}
		else if(smallest === 4)
		{
			blinky.direction = 2;
			blinky.body.velocity.y = 0;
			blinky.body.velocity.x = 93;
		}
	}
}

Array.prototype.contains = function(obj){
	var i = this.length;
	while(i--)
	{
		if(Phaser.Point.equals(obj,this[i]))
			return true;
	}
	return false;
};