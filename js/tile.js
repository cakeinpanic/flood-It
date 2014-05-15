function Tile(obj, position,  colorId, colorScheme, colorSchemeId) {
  this.x                = position[0];
  this.y                = position[1];
  this.colorId          = colorId;
  this.obj              = obj;
  this.captured         = false;
  this.colorScheme      = colorScheme;
  this.colorSchemeId    = colorSchemeId;
  this.setColor(this.colorId);
}

Tile.prototype.setColor= function (colorId) {
  this.colorId= colorId;
  this.updateColor();
}
Tile.prototype.updateColor= function () {
  var color=this.colorScheme[this.colorSchemeId][this.colorId];
  this.obj.setAttribute("style","background-color:"+ color);
}

Tile.prototype.serialize = function () {
  return {
    position: {
      x: this.x,
      y: this.y
    },
    color: this.color
  };
};

Tile.prototype.capture=function() {
  this.captured=true;
}
Tile.prototype.toString=function() {
  return this.x+","+this.y+","+this.color;
}