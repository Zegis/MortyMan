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