function Button(obj,  colorId, game) {
  this.colorId          = colorId;
  this.obj              = obj;
  this.game				= game;
  this.setColor(colorId);
  this.obj.onclick = this.ClickEvent.bind(this);
}

Button.prototype.setColor= function (colorId) {
  this.colorId= colorId;
  this.updateColor();
}

Button.prototype.ClickEvent=function(){
	console.log(this.game);
	this.game.onColorChanged(this.colorId)
}

Button.prototype.updateColor=function(){
	var color=this.game.colorScheme[this.game.colorSchemeId][this.colorId];
    this.obj.setAttribute("style","background-color:"+ color);
}