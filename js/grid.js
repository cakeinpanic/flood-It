function Grid(size) {
this.rows      = new Array();
this.size      = size;
this.numTiles  = size*size;
}

Grid.prototype.addRow= function (row) {
  this.rows.push(row);
}

Grid.prototype.addTileToRow= function (row,tile) {
  this.rows[row].push(tile);
}


Grid.prototype.getRow=function(y){
  if (this.size<y)
    return this.rows[y];
  else
    {
      console.log("error");
      return -1;
    }
}
Grid.prototype.updateColors=function()
{
  for (var i=0; i<this.size; i++)
    for (var j=0; j<this.size; j++)
    {
      this.rows[i][j].updateColor();
    }
}
Grid.prototype.getTile=function(x,y){
  if (x<this.size && y<this.size && x>-1 && y>-1)
  {
    return this.rows[y][x];
  }


  return null;
}
