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
		numColors 			= this.colorScheme[this.colorSchemeId].length;
		self 				= this,
		maxSteps 			= 20,
		$gameField 			= $('.game-field')[0],
		$colorPanel 		= $('.color-panel')[0],
		$score  			= $('.score')[0],
		$upBtn				= $('.up')[0],
		$downBtn			= $('.down')[0],
		$schemePanel 		= $('.mini-color-scheme-wrapper')[0];


	this.drawGameField=function(){
		for (var i=0; i<gameSize; i++) {
			var row= document.createElement("ul");
			row.setAttribute("class", "grid-row cf");
			$gameField.appendChild(row);
			this.grid.addRow(new Array);

			for (var j=0; j<gameSize; j++)
				{
					var tileObj= document.createElement("li");
					tileObj.classList.add("tile");
					if (gameSize==24)
						tileObj.classList.add("tile-24");
					else
						tileObj.classList.add("tile-12");
					row.appendChild(tileObj);
					var newTile= new Tile(tileObj, [j, i], getRandomInt(0,numColors-1), this);
					this.grid.addTileToRow(i,newTile);
				}
		}

		this.capturedTiles.push(this.grid.getTile(0,0));
		this.grid.getTile(0,0).capture();
		this.onColorChanged(this.capturedTiles[0].colorId);

	}

	this.increaseLevel= function(){
		console.log($gameField);
		$($gameField).empty();
		
		gameSize=24;
		this.grid=  new Grid(gameSize);
		this.capturedTiles= new Array();
		this.steps=0;
		this.drawGameField();
	}

	this.decreaseLevel= function(){
		console.log(this.$gameField);
		$($gameField).empty();
		gameSize=12;
		this.grid=  new Grid(gameSize);
		this.capturedTiles= new Array();
		this.steps=0;	
		this.drawGameField();
	}

	$upBtn.onclick = this.increaseLevel.bind(this);
	$downBtn.onclick = this.decreaseLevel.bind(this);

	this.getAllNewTiles = function(tiles, newColor) {

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

	this.finishGame= function() {
		this.gameOn=false;
		var winField=document.createElement("div");
		winField.classList.add("winfield");
		winField.innerHTML="You won in "+this.steps+" steps";
		$gameField.appendChild(winField);
	}

	this.changeColorScheme= function(newColorSchemeId) {
		this.colorSchemeId=newColorSchemeId;
		numColors=this.colorScheme[this.colorSchemeId].length;
		this.grid.updateColors();
		this.buttons.forEach(function(btn){
			btn.updateColor()
		});
	}
	this.onColorChanged= function(newColor) {
		if (this.gameOn && newColor!=this.currentColor) {

			this.currentColor=newColor;
			this.steps++;
			$score.innerHTML=this.steps+"/"+maxSteps;
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
	
	
	this.startGame= function() {
		
		
		this.drawGameField();
		for (i=0; i<numColors; i++) {
			var btn=document.createElement("div");
			btn.setAttribute("class","color-btn");
			var newBtn=new Button(btn, i, this);
			this.buttons.push(newBtn);
			$colorPanel.appendChild(btn);

		}

		for (i=0; i<this.colorScheme.length; i++) {
			var scheme=document.createElement("div");
			scheme.setAttribute("class","mini-color-scheme");
			var miniColorScheme=new Scheme(scheme, i, this);
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

