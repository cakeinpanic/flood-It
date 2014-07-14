function Game(gameSize,colorScheme){

	this.grid 			= null;
	this.buttons		= new Array();
	this.gameOn			= true;
	this.steps			= -1;
	this.currentColor  	= null;
	this.capturedTiles  = null;
	this.colorScheme    = colorScheme;
	this.colorSchemeId  = 0;
	this.maxSteps 		= 20;
	this.winField 		= null;
	this.restartBtn		= null;
	this.demoIsRunning	= false;

	var	gameSize 		= gameSize,
		numColors 			= this.colorScheme[this.colorSchemeId].length;
		self 				= this,
		$gameField 			= $('.game-field')[0],
		$rules	 			= $('.rules')[0],
		$colorPanel 		= $('.color-panel')[0],
		$score  			= $('.score'),
		$upBtn				= $('.up')[0],
		$downBtn			= $('.down')[0],
		$restart			= $('.restart')[0],
		$schemePanel 		= $('.mini-color-scheme-wrapper')[0];
		demoColorsArray		= [1,3,0,4,2,2,4,1,4,4,3,3,1,1,4,0,2,4,4,2,2,0,4,3,1,1,4,1,2,4,0,0,3,4,2,1,2,4,1,3,3,2,0,2,2,4,2,2,3,1,1,1,4,0,1,3,1,4,3,3,3,4,1,2,0,1,3,1,2,2,0,0,1,2,3,0,0,1,2,2,3,3,4,4,3,4,4,4,1,2,2,3,4,1,3,3,2,0,4,0,4,2,4,2,0,2,3,2,4,3,4,2,1,4,4,0,4,1,1,1,1,0,2,2,0,4,2,3,1,3,1,1,0,3,0,2,1,0,2,2,2,1,3,4],
		demoStepTimeout		= null,
		demoButtonTimeout	= null,
		demoTileTimeout		= null;


	this.drawGameField=function(){

		$($gameField).empty();
		this.grid=  new Grid(gameSize);
		this.capturedTiles= new Array();
		this.steps=-1;
		this.currentColor=null;
		var demoArray=new Array();

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
					var color=getRandomInt(0,numColors-1);
					var newTile= new Tile(tileObj, [j, i], color, this);
					this.grid.addTileToRow(i,newTile);
				}
		}

		for (var t=0; t<$score.length; t++){
			$score[t].innerHTML=this.steps+"/"+this.maxSteps;
		}

		this.capturedTiles.push(this.grid.getTile(0,0));
		this.grid.getTile(0,0).capture();
		this.onColorChanged(this.capturedTiles[0].colorId);

		var $wrapper= $('.wrapper')[0];
		$wrapper.classList.remove("disabled");
	}

	this.restartGame=function(demo){
		this.stopTest();

		if (this.winField) {
			$(this.restartBtn).hide();
			$(this.winField).hide();
		}
		this.gameOn=true;
		this.capturedTiles= new Array();
		this.steps=-1;
		this.currentColor=null;
		for (var i=0; i<gameSize; i++) {
			for (var j=0; j<gameSize; j++)
				{
					if (demo==true) {
						this.grid.getTile(i,j).setColor(demoColorsArray[i*gameSize+j]);
					}
					else {
						this.grid.getTile(i,j).setColor(getRandomInt(0,numColors-1));
					}
					this.grid.getTile(i,j).unCapture();
				}
		}

		this.capturedTiles.push(this.grid.getTile(0,0));
		this.grid.getTile(0,0).capture();
		this.onColorChanged(this.capturedTiles[0].colorId);
	}

	this.increaseLevel= function(){
		this.stopTest();
		gameSize = 24;
		this.maxSteps = 100;
		this.drawGameField();
	}

	this.decreaseLevel= function(){
		this.stopTest();
		gameSize = 12;
		this.maxSteps = 20;
		this.drawGameField();
	}
	this.toggleRules= function(){
		
		this.decreaseLevel();
		this.demoIsRunning = true;
		this.restartGame(this.demoIsRunning);

		var demoSteps= [4,1,2,3,4,0,1,2,4,3,2,1,0,3,4,1,2];
		var currentStepIndex=0;

		var makeStep = function(animateClickDelay, animateTileDelay){
			colorIndex=demoSteps[currentStepIndex];
			demoButtonTimeout = setTimeout(function() {this.buttons[colorIndex].animateClick();}.bind(this), animateClickDelay);
			demoTileTimeout   = setTimeout(function() {this.buttons[colorIndex].ClickEvent();}.bind(this), animateTileDelay);
			currentStepIndex++;
			if (currentStepIndex<demoSteps.length) {
				var newDelay=1500;
				if (currentStepIndex>5) newDelay=1000;
				if (currentStepIndex>8) newDelay=500;
				demoStepTimeout=setTimeout(function() { makeStep(0,newDelay); }, newDelay+500)
			}
		}.bind(this);

		makeStep(500,2000);
	}

	this.getAllNewTiles = function(tiles, newColor) {
		var newlyAdded=new Array;
		for (var i=0; i< tiles.length; i++) {
		
			var sameColorRelatives=checkForColor(getRelatives(tiles[i]), newColor);
			captureTiles(sameColorRelatives);
			newlyAdded=newlyAdded.concat(sameColorRelatives);

			if (sameColorRelatives.length>0) {
				var relativesOfRelative=this.getAllNewTiles(sameColorRelatives, newColor);
				newlyAdded=newlyAdded.concat(relativesOfRelative);
			}

		}
		return newlyAdded;
	}	

	this.finishGame= function(win) {
		
		this.gameOn=false;
		if (!this.winField){
			this.winField=document.createElement("div");
			this.winFieldText=document.createElement("span");
			this.winField.appendChild(this.winFieldText);
			this.winField.classList.add("winfield");
		}
		if (!this.restartBtn){
			this.restartBtn= document.createElement("div");
			this.winField.appendChild(this.restartBtn);
			this.restartBtn.classList.add("restart");		
		}
		if (win){
			this.winFieldText.innerHTML="You won in "+this.steps+" steps";
		}
		else
		{
			this.winFieldText.innerHTML="You exceeded the number of steps";
		}
		$(this.winField).show();
		$(this.restartBtn).show();
		this.restartBtn.onclick=this.restartGame.bind(this);

		$gameField.appendChild(this.winField);
	}
	this.stopTest= function(){
		this.demoIsRunning=false;
		clearTimeout(demoTileTimeout);
		clearTimeout(demoButtonTimeout);
		clearTimeout(demoStepTimeout);
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
		
		if (!this.demoIsRunning && this.gameOn && newColor!=this.currentColor) {

			this.currentColor=newColor;
			this.steps++;

			for (var t=0; t<$score.length; t++){
					$score[t].innerHTML=this.steps+"/"+this.maxSteps;
			}

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

			var tilesLeft=this.grid.numTiles-this.capturedTiles.length;
			if (this.steps==this.maxSteps || tilesLeft==0)
				this.finishGame(tilesLeft==0);
		}
	}
	
	this.startGame= function() {
		
		this.drawGameField();

		for (i=0; i<numColors; i++) {
			var btn=document.createElement("div");
			btn.setAttribute("class","color-btn");
			btn.classList.add("animation-order-"+(i+1));
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
			if (tiles[j].colorId==newColor)
				sameColorTiles.push(tiles[j]);

		}
		return sameColorTiles;
	}
	function getRandomInt (min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	$upBtn.onclick = this.increaseLevel.bind(this);
	$downBtn.onclick = this.decreaseLevel.bind(this);
	$restart.onclick = this.restartGame.bind(this);
	$rules.onclick= this.toggleRules.bind(this);

}

