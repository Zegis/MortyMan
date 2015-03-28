var game = new Phaser.Game(28 * 32,31 * 32, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var map, mapLayer;

function preload(){

	game.load.image("tileset","assets/tilemap.png");
	game.load.tilemap("map","map/tmap.json",null,Phaser.Tilemap.TILED_JSON);

};

function create(){

	map = game.add.tilemap("map");
	map.addTilesetImage("tilemap","tileset");
	
	mapLayer = map.createLayer("tiles");
	mapLayer.resizeWorld();

};

function update(){
};