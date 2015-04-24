var game = new Phaser.Game(28 * 28,31 * 28, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var map, mapLayer, pillsLayer;

function preload(){

	game.load.image("tileset","assets/tilemap.png");
	game.load.image("pills","assets/pills.png");
	game.load.tilemap("map","map/tmap.json",null,Phaser.Tilemap.TILED_JSON);

};

function create(){

	map = game.add.tilemap("map");
	map.addTilesetImage("tilemap","tileset");
	map.addTilesetImage("pills","pills");
	
	mapLayer = map.createLayer("tiles");
	pillsLayer = map.createLayer("pills");
	mapLayer.resizeWorld();


};

function update(){
};