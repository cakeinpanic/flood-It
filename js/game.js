function FloodGame(params){



    this.colorScheme = [["#57385C", "#A75265", "#EC7263", "#FEBE7E","#FFEDBC"],
                    ["#004358", "#1F8A70", "#BEDB39", "#FF5347", "#FD7400"],
                    ["#F72F41", "#399DF6", "#99C946", "#FBDB52", "#635358"],
                    ["#F53644", "#449AA7", "#A0B823", "#EBB80F", "#FA5D05"]
                    ];

    this.colorSchemeId = params.colorSchemeId || 3;
    this.grid = null;
    this.$gameField = params.gameField;
    this.$colorPanel = params.colorPanel;
    this.$schemePanel = params.schemePanel;
    this.capturedTiles = [];
    this.currentColor = null;
    this.steps = 0;
    this.buttons = [];

    this.start = function(gameSize){
        this.grid=new Grid(gameSize);
        for (var i=0; i<gameSize; i++) {
            var row= document.createElement("ul");
            row.setAttribute("class", "grid-row");
            this.$gameField.appendChild(row);
            this.grid.addRow(new Array);
            var numColors=this.colorScheme[0].length;

            for (var j=0; j<gameSize; j++)
                {
                    var tileObj= document.createElement("li");
                    tileObj.setAttribute("class", "tile")
                    row.appendChild(tileObj);
                    var newTile= new Tile(tileObj, [j, i], this.getRandomInt(0,numColors-1),this.colorScheme,  this.colorSchemeId );
                    this.grid.addTileToRow(i,newTile);
                }
        }
        this.capturedTiles.push(this.grid.getTile(0,0));
        this.grid.getTile(0,0).capture();

        this.onColorChanged(this.capturedTiles[0].colorId);

        for (i=0; i<numColors; i++) {
            var btn=document.createElement("div");
            btn.setAttribute("class","color-btn");
            var newBtn=new Button(btn, i, this);
            this.buttons.push(newBtn);
            this.$colorPanel.appendChild(btn);

        }

        for (i=0; i<this.colorScheme.length; i++) {
            var scheme=document.createElement("div");
            scheme.setAttribute("class","mini-color-scheme");
            var miniColorScheme=new Scheme(scheme, this.colorScheme, i)
            this.$schemePanel.appendChild(scheme);
        }

    };
    this.changeColorScheme = function(newColorSchemeId){
        this.colorSchemeId=newColorSchemeId;
        this.grid.updateColors();
        this.buttons.forEach(function(btn){
            btn.updateColor()
        });

    };
    this.onColorChanged = function(newColor) {
        if (newColor!=this.currentColor){
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
                this.finish();
        }

    };
    this.finish = function(){
        var winField=document.createElement("div");
        winField.classList.add("winfield");
        winField.innerHTML="You won in "+this.steps+" steps";
        this.$gameField.appendChild(winField);

    };
    this.captureTiles = function(tiles){
        for (var i=0; i<tiles.length; i++){
            tiles[i].capture();
        }

    };
    this.getAllNewTiles = function(tiles, newColor){

        var newlyAdded=new Array;
        for (var i=0; i< tiles.length; i++) {

            var temp=this.checkForColor(this.getRelatives(tiles[i]), newColor);
            this.captureTiles(temp);
            newlyAdded=newlyAdded.concat(temp);

            //debugger
            if (temp.length>0) {
                var temp2=this.getAllNewTiles(temp, newColor);
                newlyAdded=newlyAdded.concat(temp2);
            }

        }
        return newlyAdded;


    };
    this.getRelatives = function(tile){

        var x=tile.x;
        var y=tile.y;
        //console.log(x,y);
        var relatives=new Array();
        relatives.push(this.grid.getTile(x+1,y));
        relatives.push(this.grid.getTile(x-1,y));
        relatives.push(this.grid.getTile(x,y+1));
        relatives.push(this.grid.getTile(x,y-1));
        //console.log("getting relatives of", tile,": ", relatives);
        //relatives.push(tile);
        return this.getRidOfNulls(relatives);
    };
    this.getRidOfNulls = function(arr){
        for (var i=0; i<arr.length; i++){
            if (!(arr[i]!=null && !arr[i].captured))
            {
                arr.splice(i,1);
                i--;
            }

        }
            return arr;
    };
    this.checkForColor = function(tiles, newColor){
        var sameColorTiles=[];

        for ( var j=0; j<tiles.length; j++){
            //console.log(newColor, tiles[j].colorId);
            if (tiles[j].colorId==newColor)
                sameColorTiles.push(tiles[j]);

        }
        //console.log("newcolor tiles", sameColorTiles);
        return sameColorTiles;
    };
    this.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
}

