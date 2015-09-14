/*global phaser */
/*global Utils */
/*global GhostMode */
/*global Ghost */

function Blinky(game, x, y, image, targetX, targetY){
	Ghost.call(this,game,x,y,image,targetX,targetY);
};

Blinky.prototype = Object.create(Ghost.prototype);
Blinky.prototype.constructor = Blinky;

Blinky.prototype.updateTarget = function(player)
{
	console.log("Blinky function");
	if(this.mode === GhostMode.Chase){
		this.target.x = Utils.pixelsToTiles(player.x);
		this.target.y = Utils.pixelsToTiles(player.y);
	}
	else if(this.mode === GhostMode.Scatter){
		this.target.x = this.scatterTarget.x;
		this.target.y = this.scatterTarget.y;
	}
	else if(this.mode === GhostMode.Scared){
		this.target.x = Math.random() * (Utils.mapWidth - 1) + 1;
		this.target.y = Math.random() * (Utils.mapHeight - 1) + 1;
	}
	else{ // if it's not chasing, or scattering nor scared it's killed
		this.target.x = this.respawnTarget.x;
		this.target.y = this.respawnTarget.y;
	}
};