var colorScheme=[["#57385C", "#A75265", "#EC7263", "#FEBE7E","#FFEDBC"],
				["#004358", "#1F8A70", "#BEDB39", "#FF5347", "#FD7400"],
				["#F72F41", "#399DF6", "#99C946", "#FBDB52", "#635358"],
				["#F53644", "#449AA7", "#A0B823", "#EBB80F", "#FA5D05"]
				];
var colorSchemeId=3;
var grid;
var $gameField= $('.game-field')[0];
var $colorPanel= $('.color-panel')[0];
var $schemePanel= $('.mini-color-scheme-wrapper')[0];
var capturedTiles=new Array();
var currentoColor;
var steps=0;
var buttons=new Array();

function startGame(gameSize){
	grid=new Grid(gameSize);
	for (var i=0; i<gameSize; i++) {
		var row= document.createElement("ul");
		row.setAttribute("class", "grid-row");
		$gameField.appendChild(row);
		grid.addRow(new Array);
		var numColors=colorScheme[0].length;

		for (var j=0; j<gameSize; j++)
			{
				var tileObj= document.createElement("li");
				tileObj.setAttribute("class", "tile")
				row.appendChild(tileObj);
				var newTile= new Tile(tileObj, [j, i], getRandomInt(0,numColors-1));
				grid.addTileToRow(i,newTile);
			}
	}
	capturedTiles.push(grid.getTile(0,0));
	grid.getTile(0,0).capture();
	currentColor= capturedTiles[0].color;

	onColorChanged(currentColor);

	for (i=0; i<numColors; i++) {
		var btn=document.createElement("div");
		btn.setAttribute("class","color-btn");
		var newBtn=new Button(btn, i);
		buttons.push(newBtn);
		$colorPanel.appendChild(btn);

	}

	for (i=0; i<colorScheme.length; i++) {
		var scheme=document.createElement("div");
		scheme.setAttribute("class","mini-color-scheme");
		var miniColorScheme=new Scheme(scheme, i)
		$schemePanel.appendChild(scheme);
	}

}
function changeColorScheme(newColorSchemeId){
	colorSchemeId=newColorSchemeId;
	grid.updateColors();
	buttons.forEach(function(btn){
		btn.updateColor()
	});

}
function onColorChanged(newColor) {
	if (newColor!=currentColor){
		currentColor=newColor;
		steps++;
		var newTiles=getAllNewTiles(capturedTiles, newColor);

		for (var j=0; j< newTiles.length; j++) {
			var k=true;
			for (var i=0; i<capturedTiles.length && k; i++) {

				if (newTiles[j]==capturedTiles[i]) k=false;
			}
			if (k) capturedTiles.push(newTiles[j]);
		}
		for (i=0; i<capturedTiles.length; i++)
			capturedTiles[i].setColor(newColor);

		if (capturedTiles.length==grid.numTiles)
			finishGame();
	}

}
function finishGame(){
	var winField=document.createElement("div");
	winField.classList.add("winfield");
	winField.innerHTML="You won in "+steps+" steps";
	$gameField.appendChild(winField);

}
function captureTiles(tiles){
	for (var i=0; i<tiles.length; i++){
		tiles[i].capture();
	}

}
function getAllNewTiles(tiles, newColor){

	var newlyAdded=new Array;
	for (var i=0; i< tiles.length; i++) {

		var temp=checkForColor(getRelatives(tiles[i]), newColor);
		captureTiles(temp);
		newlyAdded=newlyAdded.concat(temp);

		//debugger
		if (temp.length>0) {
			var temp2=getAllNewTiles(temp, newColor);
			newlyAdded=newlyAdded.concat(temp2);
		}

	}
	return newlyAdded;


}
function getRelatives(tile){

	var x=tile.x;
	var y=tile.y;
	//console.log(x,y);
	var relatives=new Array();
	relatives.push(grid.getTile(x+1,y));
	relatives.push(grid.getTile(x-1,y));
	relatives.push(grid.getTile(x,y+1));
	relatives.push(grid.getTile(x,y-1));
	//console.log("getting relatives of", tile,": ", relatives);
	//relatives.push(tile);
	return getRidOfNulls(relatives);
}
function getRidOfNulls(arr){
	for (var i=0; i<arr.length; i++){
		if (!(arr[i]!=null && !arr[i].captured))
		{
			arr.splice(i,1);
			i--;
		}

	}
		return arr;
}
function checkForColor(tiles, newColor){
	var sameColorTiles=new Array();

	for ( var j=0; j<tiles.length; j++){
		//console.log(newColor, tiles[j].colorId);
		if (tiles[j].colorId==newColor)
			sameColorTiles.push(tiles[j]);

	}
	//console.log("newcolor tiles", sameColorTiles);
	return sameColorTiles;
}
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
window.onload=function(){

startGame(8);
}