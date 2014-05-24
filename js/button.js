function Button(obj,  colorId, game) {
  this.colorId          = colorId;
  this.obj              = obj;
  this.game			      	= game;


  this.setColor= function (colorId) {
    this.colorId= colorId;
    this.updateColor();
  }

  this.ClickEvent=function(){
    console.log(this.game);
    this.game.onColorChanged(this.colorId)
  }

  this.updateColor=function(){
    var color=this.game.colorScheme[this.game.colorSchemeId][this.colorId];
    this.obj.setAttribute("style","background-color:"+ color);
  }

  this.setColor(colorId);
  this.obj.onclick = this.ClickEvent.bind(this);
}

