function Scheme(obj, colorSchemeId, game) {
  this.colorSchemeId    = colorSchemeId;
  this.obj              = obj;
  this.game             = game;
  

  this.setColors= function () {

    for (var i=0; i<this.game.colorScheme[this.colorSchemeId].length; i++){
      var color=this.game.colorScheme[this.colorSchemeId][i];
      var colorTile=document.createElement("div");
      colorTile.setAttribute("class","mini-color-scheme-tile");
      colorTile.setAttribute("style","background-color:"+ color);
      this.obj.appendChild(colorTile);
    }
  }

  this.ClickEvent=function(){
    this.game.changeColorScheme(this.colorSchemeId);
  }

  this.setColors();
  this.obj.onclick = this.ClickEvent.bind(this);

}

