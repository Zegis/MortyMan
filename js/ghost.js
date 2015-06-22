/* global phaser */
/* global Utils */

function Ghost(game, x, y, image){
	Phaser.Sprite.call(this, game, Utils.TILE_SIZE * x, Utils.TILE_SIZE * y, image);
	
	
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.enableBody = true;
	this.body.bounce.y = 0;
	this.body.bounce.x = 0;
	
	this.marker = new Phaser.Point(x,y);
	this.target = new Phaser.Point(0,0);
	
	this.directions = [null, null, null, null]
	this.distance = [null, null, null, null];
	
	game.add.existing(this);
};

Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Ghost.prototype.constructor = Ghost;

Ghost.prototype.move = function(direction){
	if(direction === Utils.Up)
	{
		this.body.velocity.y = -93;
		this.direction = Utils.Down;
		
	}
	else if(direction === Utils.Down)
	{
		this.body.velocity.y = 93;
		this.direction = Utils.Up;
	}
	else if(direction === Utils.Left)
	{
		this.body.velocity.x = -93;
		this.direction = Utils.Right;
	}
	else if(direction === Utils.Right)
	{
		this.body.velocity.x = 93;
		this.direction = Utils.Left;
	}
};

Ghost.prototype.stop = function(){
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
};

Ghost.prototype.PositionChanged = function(){

	var tmpX, tmpY;
	
	if(this.body.velocity.x < 0)
		tmpX = Utils.pixelsToTiles(this.x + this.width);
	else
		tmpX = Utils.pixelsToTiles(this.x);
		
	if(this.body.velocity.y < 0)
		tmpY = Utils.pixelsToTiles(this.y + this.height);
	else
		tmpY = Utils.pixelsToTiles(this.y);
		
	if(tmpX != this.marker.x || tmpY != this.marker.y)
	{
		this.marker.x = tmpX;
		this.marker.y = tmpY;
		return true;
	}
	else
		return false;

};

Ghost.prototype.makeDecision = function(player, map)
{
	this.updateTarget(player);
	this.decideDirection(map);
}

Ghost.prototype.updateTarget = function(player)
{
	this.target.x = Phaser.Math.snapToFloor(Math.floor(player.x),Utils.TILE_SIZE) / Utils.TILE_SIZE;
	this.target.y = Phaser.Math.snapToFloor(Math.floor(player.y),Utils.TILE_SIZE) / Utils.TILE_SIZE;
};

Ghost.prototype.decideDirection = function(map){

	this.updateDirections(map);
	
	this.x = Utils.TileToPixels(this.marker.x);
	this.y = Utils.TileToPixels(this.marker.y);
	
	this.body.reset(Utils.TileToPixels(this.marker.x),Utils.TileToPixels(this.marker.x));
	
	var length = this.directions.length;
	
	for(var i= 0; i < length; i++)
	{	
		if(this.directions[i].index === 1 && i !== this.direction)
			this.distance[i] = Phaser.Point.distance(this.target,this.directions[i]);
		else
			this.distance[i] = 2000;
	}
	
	var smallest = 0;
	for(i=1; i < length; i++)
	{
		if(this.distance[smallest] > this.distance[i])
			smallest = i;
	}
	
	if(smallest != this.direction && this.directions[smallest].index === 1)
	{
		this.stop();
		this.move(smallest);
	}
};

Ghost.prototype.updateDirections = function(map){

	this.directions[Utils.Up] = map.getTileAbove(map.getLayer(), this.marker.x, this.marker.y);
	this.directions[Utils.Left] = map.getTileLeft(map.getLayer(), this.marker.x, this.marker.y);
	this.directions[Utils.Down] = map.getTileBelow(map.getLayer(), this.marker.x, this.marker.y);
	this.directions[Utils.Right] = map.getTileRight(map.getLayer(), this.marker.x, this.marker.y);

};

Ghost.prototype.collide = function(){

	var length = this.directions.length;
	
	for( var i = Utils.Up; i < length;)
	{
		if(i !== this.direction && this.directions[i].index === 1)
		{			
			this.move(i);
			break;
		}
		else
		{
			++i;
		}
	}

};