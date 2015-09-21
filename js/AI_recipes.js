/*global phaser */
/*global Utils */
/*global GhostMode */
/*global Ghost */

function Blinky(game, x, y, image, targetX, targetY){
	Ghost.call(this,game,x,y,image,targetX,targetY);
};

Blinky.prototype = Object.create(Ghost.prototype);
Blinky.prototype.constructor = Blinky;

Blinky.prototype.ChasingTarget = function(player, additionalPoint)
{
	this.target.x = Utils.pixelsToTiles(player.x);
	this.target.y = Utils.pixelsToTiles(player.y);
};

function Pinky(game, x, y, image, targetX, targetY){
	Ghost.call(this,game,x,y,image,targetX,targetY);
};

Pinky.prototype = Object.create(Ghost.prototype);
Pinky.prototype.constructor = Pinky;

Pinky.prototype.ChasingTarget = function(player, additionalPoint)
{
	var Offset = { x: 0, y : 0};

	switch(player.direction){
		case Utils.Up:
			Offset.y = -4;
			break;
		case Utils.Left:
			Offset.x = -4;
			Utils.break;
		case Utils.Down:
			Offset.y = 4;
			break;
		case Utils.Right:
			Offset.x = 4;
			break;
	}
	this.target.x = Utils.pixelsToTiles(player.x) + Offset.x;
	this.target.y = Utils.pixelsToTiles(player.y) + Offset.y;
}

function Clyde(game, x, y, image, targetX, targetY){
	Ghost.call(this, game, x, y, image, targetX, targetY);
};

Clyde.prototype = Object.create(Ghost.prototype);
Clyde.prototype.constructor = Clyde;

Clyde.prototype.ChasingTarget = function(player, additionalPoint)
{
	var ClydePoint = new Phaser.Point(0,0);
	var PlayerPoint = new Phaser.Point(0,0);
	if(this.body.velocity.x < 0)
		ClydePoint.x = Utils.pixelsToTiles(this.x + this.width);
	else
		ClydePoint.x = Utils.pixelsToTiles(this.x);
		
	if(this.body.velocity.y < 0)
		ClydePoint.y = Utils.pixelsToTiles(this.y + this.height);
	else
		ClydePoint.y = Utils.pixelsToTiles(this.y);
	
	PlayerPoint.x = Utils.pixelsToTiles(player.x);
	PlayerPoint.y = Utils.pixelsToTiles(player.y);
	
	if(Phaser.Point.distance(ClydePoint,PlayerPoint) < 8){
		this.target.x = this.scatterTarget.x;
		this.target.y = this.scatterTarget.y;
	}
	else{
		this.target.x = PlayerPoint.x;
		this.target.y = PlayerPoint.y;
	}
}

function Inky(game, x, y, image, targetX, targetY){
	Ghost.call(this,game,x,y,image,targetX,targetY);
};

Inky.prototype = Object.create(Ghost.prototype);
Inky.prototype.constructor = Inky;

Inky.prototype.ChasingTarget = function(player, additionalPoint)
{
	// target.x = additionalPoint.x * 2 - player.x;
	// target.y = additionalPoint.y * 2 - player.y;
	
	var Offset = { x: 0, y : 0};

	switch(player.direction){
		case Utils.Up:
			Offset.y = -2;
			break;
		case Utils.Left:
			Offset.x = -2;
			Utils.break;
		case Utils.Down:
			Offset.y = 2;
			break;
		case Utils.Right:
			Offset.x = 2;
			break;
	}
	
	this.target.x = (Utils.pixelsToTiles(player.x) + Offset.x) * 2
		- Utils.pixelsToTiles(additionalPoint.x);
	this.target.y = (Utils.pixelsToTiles(player.y) + Offset.y) * 2
		- Utils.pixelsToTiles(additionalPoint.y);
}