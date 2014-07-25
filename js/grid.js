function Grid(size) {
    this.rows      =  new Array();
    this.size      = size;
    this.numTiles  = size * size;

    this.addRow = function (row) {
        this.rows.push(row);
    }
    this.addTileToRow = function (row,tile) {
        this.rows[row].push(tile);
    }
    this.getRow = function(y){
        if (this.size < y)
            return this.rows[y];
        else
        {
            console.log("error");
            return -1;
        }
    }
    this.updateColors = function()
    {
        for (var i = 0; i < this.size; i++)
            for (var j = 0; j < this.size; j++)
            {
                this.rows[i][j].updateColor();
            }
        }
        this.getTile = function(x,y){
            if (x < this.size && y < this.size && x > -1 && y > -1)
            {
                return this.rows[y][x];
            }
            return null;
        }
    }
