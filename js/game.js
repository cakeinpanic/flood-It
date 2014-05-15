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
var currentColor=null;
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

	onColorChanged(capturedTiles[0].colorId);


function Game(gameSize,colorScheme){

	this.grid 			= new Grid(gameSize);
	this.buttons		= new Array();
	this.gameOn			= true;
	this.steps			= 0;
	this.currentColor  	= null;
	this.capturedTiles  = new Array();
	this.colorScheme    = colorScheme;
	this.colorSchemeId  = 0;

	var	gameSize 			= gameSize,
		self 				= this,
		$gameField 			= $('.game-field')[0],
		$colorPanel 		= $('.color-panel')[0],
		$schemePanel 		= $('.mini-color-scheme-wrapper')[0];

	startGame();

	this.getAllNewTiles= function (tiles, newColor) {

		var newlyAdded=new Array;
		for (var i=0; i< tiles.length; i++) {

			var temp=checkForColor(getRelatives(tiles[i]), newColor);
			captureTiles(temp);
			newlyAdded=newlyAdded.concat(temp);
			if (temp.length>0) {
				var temp2=this.getAllNewTiles(temp, newColor);
				newlyAdded=newlyAdded.concat(temp2);
			}

		}
		return newlyAdded;
	}


	this.finishGame= function () {
		self.gameOn=false;
		var winField=document.createElement("div");
		winField.classList.add("winfield");
		winField.innerHTML="You won in "+steps+" steps";
		$gameField.appendChild(winField);
	}



	function startGame() {
		var numColors=self.colorScheme[self.colorSchemeId].length;

		for (var i=0; i<gameSize; i++) {
			var row= document.createElement("ul");
			row.setAttribute("class", "grid-row");
			$gameField.appendChild(row);
			//console.log(self.grid,self.grid);
			self.grid.addRow(new Array);

			for (var j=0; j<gameSize; j++)
				{
					var tileObj= document.createElement("li");
					tileObj.setAttribute("class", "tile")
					row.appendChild(tileObj);
					var newTile= new Tile(tileObj, [j, i], getRandomInt(0,numColors-1), self);
					self.grid.addTileToRow(i,newTile);
				}
		}

		self.capturedTiles.push(self.grid.getTile(0,0));
		self.grid.getTile(0,0).capture();
		self.onColorChanged(self.capturedTiles[0].colorId);

		for (i=0; i<numColors; i++) {
			var btn=document.createElement("div");
			btn.setAttribute("class","color-btn");
			var newBtn=new Button(btn, i, self);
			self.buttons.push(newBtn);
			$colorPanel.appendChild(btn);

		}

		for (i=0; i<self.colorScheme.length; i++) {
			var scheme=document.createElement("div");
			scheme.setAttribute("class","mini-color-scheme");
			var miniColorScheme=new Scheme(scheme, i, self);
			$schemePanel.appendChild(scheme);
		}

	}

	function captureTiles (tiles) {
		for (var i=0; i<tiles.length; i++) {
			tiles[i].capture();
		}
	}

	function getRelatives(tile) {

		var x=tile.x;
		var y=tile.y;
		var relatives=new Array();
		relatives.push(self.grid.getTile(x+1,y));
		relatives.push(self.grid.getTile(x-1,y));
		relatives.push(self.grid.getTile(x,y+1));
		relatives.push(self.grid.getTile(x,y-1));
		return getRidOfNulls(relatives);
	}
	function getRidOfNulls (arr) {
		for (var i=0; i<arr.length; i++) {
			if (!(arr[i]!=null && !arr[i].captured))
			{
				arr.splice(i,1);
				i--;
			}

		}
			return arr;
	}
	function checkForColor(tiles, newColor) {
		var sameColorTiles=new Array();

		for ( var j=0; j<tiles.length; j++) {
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
}

Game.prototype.changeColorScheme= function(newColorSchemeId) {
		this.colorSchemeId=newColorSchemeId;
		this.grid.updateColors();
		this.buttons.forEach(function(btn){
			btn.updateColor()
		});

}

Game.prototype.onColorChanged= function(newColor) {
	 console.log(this);
	if (this.gameOn && newColor!=this.currentColor) {
		this.currentColor=newColor;
		this.steps++;
		var newTiles=this.getAllNewTiles(this.capturedTiles, newColor);

		for (var j=0; j< newTiles.length; j++) {
			var k=true;
			for (var i=0; i<this.capturedTiles.length && k; i++) {

				if (newTiles[j]==this.capturedTiles[i]) k=false;
			}
			if (k) this.capturedTiles.push(newTiles[j]);
		}
		for (i=0; i<this.capturedTiles.length; i++)
			this.capturedTiles[i].setColor(newColor);

		if (this.capturedTiles.length==this.grid.numTiles)
			this.finishGame();
	}

}