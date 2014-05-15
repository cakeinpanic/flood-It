function Scheme(obj, colorScheme, colorSchemeId) {
  this.colorSchemeId    = colorSchemeId;
  this.colorScheme      = colorScheme;
  this.obj              = obj;

  this.setColors();

  this.obj.onclick = this.ClickEvent.bind(this);
}

Scheme.prototype.setColors= function () {

for (var i=0; i<this.colorScheme[this.colorSchemeId].length; i++){
  var color=this.colorScheme[this.colorSchemeId][i];
  var colorTile=document.createElement("div");
  colorTile.setAttribute("class","mini-color-scheme-tile");
  colorTile.setAttribute("style","background-color:"+ color);
  this.obj.appendChild(colorTile);
}
}

Scheme.prototype.ClickEvent=function(){
	changeColorScheme(this.colorSchemeId);
}

