/* global phaser */
/* global Utils */

function Ghost(game, x, y, image){
	Phaser.Sprite.call(this, game, x, y, image);
	
	game.add.existing(this);
};

Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Ghost.prototype.constructor = Ghost;