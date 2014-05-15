function Button(obj,  colorId, app) {
  this.colorId          = colorId;
  this.obj              = obj;
  this.app              = app;
  this.colorScheme      = app.colorScheme;
  this.colorSchemeId    = app.colorSchemeId;
  this.setColor(colorId);
  this.obj.onclick = this.ClickEvent.bind(this);
}

Button.prototype.setColor= function (colorId) {
  this.colorId= colorId;
  this.updateColor();
}

Button.prototype.ClickEvent=function(){
	//console.log("gg",this.colorId);
    this.app.onColorChanged(this.colorId)
}

Button.prototype.updateColor=function(){
	var color=this.colorScheme[this.colorSchemeId][this.colorId];
    this.obj.setAttribute("style","background-color:"+ color);
}