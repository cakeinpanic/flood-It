function Button(obj,  colorId, game) {
  this.colorId          = colorId;
  this.obj              = obj;
  this.game			   	= game;
  animationTime         = 40000;

  this.setColor= function (colorId) {
    this.colorId= colorId;
    this.updateColor();
  }

  this.ClickEvent=function(){
    //this.animateClick();
   this.game.onColorChanged(this.colorId);
  }

  this.updateColor=function(){
    var color=this.game.colorScheme[this.game.colorSchemeId][this.colorId];
    this.obj.setAttribute("style","background-color:"+ color);
  }
  this.animateClick= function(){
  $(this.obj).animate({opacity:.5},animationTime, function(){ console.log(this.obj);$(this.obj).animate({opacity:1},animationTime)}.bind(this));
    
  }
  this.setColor(colorId);
  this.obj.onclick = this.ClickEvent.bind(this);
}

