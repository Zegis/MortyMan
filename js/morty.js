var game = new Phaser.Game(28 * 28,31 * 28, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
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
var current;

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
	
	blinky = game.add.sprite(28*6, (28*1)+1,"blinky");
	game.physics.enable(blinky, Phaser.Physics.ARCADE);
	blinky.body.bounce = 0;
	
	// create controls
	controls = game.input.keyboard.createCursorKeys();
	score = 0;
	scoreTxt = game.add.text(2,28*11, score, {fill: "#ccc", font: "bold 20px Arial"});
	
	isSuper = false;
	superTimer = game.time.create(false);
	
	marker = new Phaser.Point();
	directions = [null, null, null, null, null];
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
	player = game.add.sprite((28*3) , (28 * 14)+1,"pacman"); // debug start point
	game.physics.enable(player, Phaser.Physics.ARCADE);
	
}

function update(){

	this.game.physics.arcade.collide(player,mapLayer);
	this.game.physics.arcade.overlap(player,scorePills,updateScore);
	this.game.physics.arcade.overlap(player,superPills, makeSuper);
	this.game.physics.arcade.overlap(player,blinky, touchGhost);

	// get surroundings
	marker.x = this.math.snapToFloor(Math.floor(player.x), 28) / 28;
	marker.y = this.math.snapToFloor(Math.floor(player.y), 28) / 28;
	
	directions[1] = map.getTileLeft(mapLayer.index, marker.x, marker.y);
	directions[2] = map.getTileRight(mapLayer.index, marker.x, marker.y);
	directions[3] = map.getTileAbove(mapLayer.index, marker.x, marker.y);
	directions[4] = map.getTileBelow(mapLayer.index, marker.x, marker.y);
	
	game.debug.text(map.getTile(marker.x, marker.y,mapLayer).x + " " + map.getTile(marker.x, marker.y,mapLayer).y ,20,20, "#CCC")
	
	// check Key
	if(controls.left.isDown)
	{
		player.body.velocity.x = -112;
		current = Phaser.LEFT;
	}
	else if(controls.right.isDown)
	{
		player.body.velocity.x = 112;
		current = Phaser.RIGHT;
	}
	if(controls.down.isDown)
	{
		player.body.velocity.y = 112;
		current = Phaser.DOWN;
	}
	else if(controls.up.isDown)
	{
		player.body.velocity.y = -112;
		current = Phaser.UP;
	}
	
	if(scorePills.countDead() == scorePills.length)
		alert("Victory!");
	
	
		
	if( (player.x) >= (28*28+14))
		player.x = -28;
	else if((player.x) <= -28)
		player.x = (28*28);
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

function render(){
	
	game.debug.text(isSuper,20,20, "#CCC");
	
	for (var t = 1; t < 5; t++)
    {
        if (directions[t] === null)
        {
            continue;
        }

        var color = 'rgba(0,255,0,0.3)';

        if (directions[t].index !== 1)
        {
			color = 'rgba(255,0,0,0.3)';
        }

        if (t === current)
        {
			color = 'rgba(255,255,255,0.3)';
		}

		game.debug.geom(new Phaser.Rectangle(directions[t].worldX, directions[t].worldY, 28, 28), color, true);
    }

    game.debug.geom(this.turnPoint, '#ffff00');
	
}