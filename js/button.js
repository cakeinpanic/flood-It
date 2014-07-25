function Button(obj, colorId, game) {
    this.colorId          = colorId;
    this.obj              = obj;
    this.game             = game;
    var animationTime     = 600;

    this.setColor = function (colorId) {
      this.colorId = colorId;
      this.updateColor();
    }

    this.ClickEvent = function(){
      this.game.onColorChanged(this.colorId);
    }

    this.updateColor = function(){
      var color = this.game.colorScheme[this.game.colorSchemeId][this.colorId];
      this.obj.setAttribute("style","background-color:"+ color);
    }
    this.animateClick = function(){
      $(this.obj).css("transform","scale(1.15)");
      setTimeout(function() {$(this.obj).css("transform","scale(1)");}.bind(this), animationTime);
    }
    
    this.setColor(colorId);
    this.obj.onclick = this.ClickEvent.bind(this);
}

