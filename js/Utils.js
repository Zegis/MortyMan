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
	}
};