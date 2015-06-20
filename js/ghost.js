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