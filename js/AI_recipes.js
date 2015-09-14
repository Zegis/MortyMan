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
	console.log("Blinky function");
	this.target.x = Utils.pixelsToTiles(player.x);
	this.target.y = Utils.pixelsToTiles(player.y);
};