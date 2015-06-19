/* global phaser */
/* global Utils */

function Ghost(game, x, y, image){
	Phaser.Sprite.call(this, game, x, y, image);
	
	
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.enableBody = true;
	this.body.bounce.y = 0;
	this.body.bounce.x = 0;
	
	game.add.existing(this);
};

Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Ghost.prototype.constructor = Ghost;