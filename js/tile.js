function Tile(obj, position,  colorId,game) {
    this.x                = position[0];
    this.y                = position[1];
    this.colorId          = colorId;
    this.obj              = obj;
    this.captured         = false;
    this.game             = game;


    this.setColor = function (colorId) {
      this.colorId = colorId;
      this.updateColor();
    }

    this.updateColor = function () {
      var color = this.game.colorScheme[this.game.colorSchemeId][this.colorId];
      this.obj.setAttribute("style","background-color:" + color);
    }

    this.capture = function() {
      this.captured = true;
    }
    this.unCapture = function() {
      this.captured = false;
    }
    this.toString = function() {
      return this.x + "," + this.y + "," + this.color;
    }

    this.setColor(this.colorId);
}

