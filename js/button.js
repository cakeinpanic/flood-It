function Button(obj,  colorId) {
  this.colorId          = colorId;
  this.obj              = obj;
  this.setColor(colorId);
  this.obj.onclick = this.ClickEvent.bind(this);
}

Button.prototype.setColor= function (colorId) {
  this.colorId= colorId;
  this.updateColor();
}

Button.prototype.ClickEvent=function(){
	//console.log("gg",this.colorId);
	onColorChanged(this.colorId)
}

Button.prototype.updateColor=function(){
	var color=colorScheme[colorSchemeId][this.colorId];
    this.obj.setAttribute("style","background-color:"+ color);
}