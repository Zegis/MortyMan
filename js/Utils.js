/*global Phaser */

var Utils = {
	TILE_SIZE: 28,
	mapWidth: 28 * 28,
	mapHeight: 31 * 28,
	Up: 0,
	Left: 1,
	Down: 2,
	Right: 3,
	arrayContains: function(array, object){
		var i = array.length;
		while(i--)
		{
			if(Phaser.Point.equals(object,array[i]))
				return true;
		}
		return false;
	},
	pixelsToTiles: function(pixelValue){
		return Phaser.Math.snapToFloor(Math.floor(pixelValue), this.TILE_SIZE) / this.TILE_SIZE;
	},
	
	tileToPixels: function(tileValue){
		return tileValue * this.TILE_SIZE;
	}
};

var WaveTimes = [7000, 20000, 7000, 20000, 5000, 20000, 5000];