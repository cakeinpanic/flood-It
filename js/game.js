function Game( colorScheme, callBack ) {

    this.colorScheme    = colorScheme;
    this.colorSchemeId  = 0;

    var self                = this,
        showGameWrapper     = callBack,
        gameSize            = 12,
        self                = this,
        $gameField          = $('.gameField')[0],
        $howTo              = $('.btn-howTo')[0],
        $colorPanel         = $('.colorPanel')[0],
        $score              = $('.score'),
        $upBtn              = $('.btn-up')[0],
        $downBtn            = $('.btn-down')[0],
        $restart            = $('.btn-restart')[0],
        $schemePanel        = $('.miniColorScheme--wrapper')[0],

        numColors           = this.colorScheme[this.colorSchemeId].length;
        grid                = null,
        buttons             = new Array(),
        currentColor        = null,
        capturedTiles       = null,
        
        isGameOn            = true,
        steps               = -1,
        maxSteps            = 20,
        winField            = null,
        restartBtn          = null,
        
        demoIsRunning       = false,
        demoColorsArray     = [1,3,0,4,2,2,4,1,4,4,3,3,1,1,4,0,2,4,4,2,2,0,4,3,1,1,4,1,2,4,0,0,3,4,2,1,2,4,1,3,3,2,0,2,2,4,2,2,3,1,1,1,4,0,1,3,1,4,3,3,3,4,1,2,0,1,3,1,2,2,0,0,1,2,3,0,0,1,2,2,3,3,4,4,3,4,4,4,1,2,2,3,4,1,3,3,2,0,4,0,4,2,4,2,0,2,3,2,4,3,4,2,1,4,4,0,4,1,1,1,1,0,2,2,0,4,2,3,1,3,1,1,0,3,0,2,1,0,2,2,2,1,3,4],
        demoStepTimeout     = null,
        demoButtonTimeout   = null,
        demoTileTimeout     = null;


    this.startGame = function() {
        
        drawGameField();

        for (i = 0; i < numColors; i++) {
            var btn = document.createElement("div");
            btn.setAttribute("class","btn-color");
            btn.classList.add("animation-order-" + (i + 1));
            var newBtn = new Button(btn, i, this);
            buttons.push(newBtn);
            $colorPanel.appendChild(btn);
        }

        for (i = 0; i < this.colorScheme.length; i++) {
            var scheme = document.createElement("div");
            scheme.setAttribute("class","miniColorScheme");
            var miniColorScheme = new Scheme(scheme, i, this);
            $schemePanel.appendChild(scheme);
        }   
        
    }

    this.onColorChanged= function(newColor) {   
        if (!demoIsRunning && isGameOn && newColor != currentColor) {

            currentColor = newColor;
            steps++;

            for (var t = 0; t < $score.length; t++){
                    $score[t].innerHTML = steps+"/"+maxSteps;
            }

            var newTiles = getAllNewTiles(capturedTiles, newColor);


            for (var j = 0; j < newTiles.length; j++) {
                var k = true;
                for (var i = 0; i < capturedTiles.length && k; i++) {

                    if (newTiles[j] == capturedTiles[i]) k = false;
                }
                if (k) capturedTiles.push(newTiles[j]);
            }
            for (i = 0; i < capturedTiles.length; i++)
                capturedTiles[i].setColor(newColor);

            var tilesLeft = grid.numTiles - capturedTiles.length;
            if (steps == maxSteps || tilesLeft == 0)
                finishGame(tilesLeft == 0);
        }
    }

    this.changeColorScheme = function(newColorSchemeId) {
        this.colorSchemeId = newColorSchemeId;
        numColors = this.colorScheme[this.colorSchemeId].length;
        grid.updateColors();
        buttons.forEach(function(btn){
            btn.updateColor();
        });
    }
    
    function increaseLevel() {
        stopDemo();
        gameSize = 24;
        maxSteps = 100;
        $upBtn.classList.add("hidden");
        $downBtn.classList.remove("hidden");
        drawGameField();
    }

    function decreaseLevel() {
        stopDemo();
        gameSize = 12;
        maxSteps = 20;
        $upBtn.classList.remove("hidden");
        $downBtn.classList.add("hidden");
        drawGameField();
    }
    
    function showHowTo() {
        decreaseLevel();
        demoIsRunning = true;
        restartGame(demoIsRunning);

        var demoSteps = [4,1,2,3,4,0,1,2,4,3,2,1,0,3,4,1,2];
        var currentStepIndex = 0;

        var makeStep = function(animateClickDelay, animateTileDelay){
            colorIndex = demoSteps[currentStepIndex];
            demoButtonTimeout = setTimeout(function() {buttons[colorIndex].animateClick();}, animateClickDelay);
            demoTileTimeout   = setTimeout(function() {buttons[colorIndex].ClickEvent();}, animateTileDelay);
            currentStepIndex++;
            if (currentStepIndex < demoSteps.length) {
                var newDelay = 1500;
                if (currentStepIndex > 5) newDelay = 1000;
                if (currentStepIndex > 8) newDelay = 500;
                demoStepTimeout = setTimeout(function() { makeStep(0,newDelay); }, newDelay+500)
            }
        };
        makeStep(500,2000);
    }

    function restartGame(demo) {
        stopDemo();

        if (winField) {
            $(restartBtn).hide();
            $(winField).hide();
        }
        isGameOn = true;
        capturedTiles = new Array();
        steps = -1;
        currentColor = null;
        for (var i = 0; i < gameSize; i++) {
            for (var j = 0; j < gameSize; j++)
                {
                    if (demo==true) {
                        grid.getTile(i,j).setColor(demoColorsArray[i*gameSize+j]);
                    }
                    else {
                        grid.getTile(i,j).setColor(getRandomInt(0,numColors-1));
                    }
                    grid.getTile(i,j).unCapture();
                }
        }

        capturedTiles.push(grid.getTile(0,0));
        grid.getTile(0,0).capture();
        self.onColorChanged(capturedTiles[0].colorId);
    }

    function drawGameField() {

        $($gameField).empty();
        grid = new Grid(gameSize);
        capturedTiles = new Array();
        steps = -1;
        currentColor = null;
        var demoArray = new Array();

        for (var i = 0; i < gameSize; i++) {
            var row =  document.createElement("ul");
            row.setAttribute("class", "gridRow cf");
            $gameField.appendChild(row);
            grid.addRow(new Array);

            for (var j = 0; j < gameSize; j++)
                {
                    var tileObj = document.createElement("li");
                    tileObj.classList.add("tile");
                    if (gameSize == 24)
                        tileObj.classList.add("tile-24");
                    else
                        tileObj.classList.add("tile-12");
                    row.appendChild(tileObj);
                    var color = getRandomInt(0,numColors-1);
                    var newTile = new Tile(tileObj, [j, i], color, self);
                    grid.addTileToRow(i,newTile);
                }
        }

        for (var t = 0; t < $score.length; t++){
            $score[t].innerHTML = steps+"/"+maxSteps;
        }

        capturedTiles.push(grid.getTile(0,0));
        grid.getTile(0,0).capture();
        self.onColorChanged(capturedTiles[0].colorId);

        showGameWrapper();
    }

    function getAllNewTiles(tiles, newColor) {
        var newlyAdded = new Array;
        for (var i = 0; i < tiles.length; i++) {
        
            var sameColorRelatives = checkForColor(getRelatives(tiles[i]), newColor);
            captureTiles(sameColorRelatives);
            newlyAdded = newlyAdded.concat(sameColorRelatives);

            if (sameColorRelatives.length > 0) {
                var relativesOfRelative = getAllNewTiles(sameColorRelatives, newColor);
                newlyAdded = newlyAdded.concat(relativesOfRelative);
            }

        }
        return newlyAdded;
    }   

    function finishGame(win) {
        
        isGameOn = false;
        if (!winField){
            winField = document.createElement("div");
            winFieldText = document.createElement("span");
            winField.appendChild(winFieldText);
            winField.classList.add("winfield");
        }
        if (!restartBtn){
            restartBtn = document.createElement("div");
            restartBtn.onclick = restartGame;
            winField.appendChild(restartBtn);
            restartBtn.classList.add("btn-restart");        
        }
        if (win){
            winFieldText.innerHTML = "You won in " + steps + " steps";
        }
        else
        {
            winFieldText.innerHTML = "You exceeded the number of steps";
        }
        $(winField).show();
        $(restartBtn).show();
        
        $gameField.appendChild(winField);
    }

    function stopDemo() {
        demoIsRunning = false;
        clearTimeout(demoTileTimeout);
        clearTimeout(demoButtonTimeout);
        clearTimeout(demoStepTimeout);
    }

    function captureTiles(tiles) {
        for (var i = 0; i < tiles.length; i++) {
            tiles[i].capture();
        }
    }
    
    function getRelatives(tile) {
        var x = tile.x;
        var y = tile.y;
        var relatives = new Array();
        relatives.push(grid.getTile(x + 1,y));
        relatives.push(grid.getTile(x - 1,y));
        relatives.push(grid.getTile(x,y + 1));
        relatives.push(grid.getTile(x,y - 1));
        return getRidOfNulls(relatives);
    }
    function getRidOfNulls(arr) {
        for (var i = 0; i<arr.length; i++) {
            if (!(arr[i] != null && !arr[i].captured))
            {
                arr.splice(i,1);
                i--;
            }
        }
        return arr;
    }
    function checkForColor(tiles, newColor) {
        var sameColorTiles = new Array();

        for ( var j = 0; j < tiles.length; j++) {
            if (tiles[j].colorId == newColor)
                sameColorTiles.push(tiles[j]);

        }
        return sameColorTiles;
    }

    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $upBtn.onclick = increaseLevel;
    $downBtn.onclick = decreaseLevel;
    $restart.onclick = restartGame;
    $howTo.onclick = showHowTo;

}

