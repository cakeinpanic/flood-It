setTimeout(function () {  window.scrollTo(0, 1); }, 1000);

var colorScheme        = [["#57385C", "#A75265", "#EC7263", "#FEBE7E","#FFEDBC"],
                          ["#F72F41", "#399DF6", "#99C946", "#FBDB52", "#635358"],
                          ["#FF8787", "#FFBD8C", "#FFE2CC", "#938787", "#72D4FF"],
                          ["#435A66", "#88A6AF", "#F5F2EB", "#D9CDB8", "#413541"],
                         ];

function unhideEverything(){
	var wrapper= $(".wrapper");
	wrapper.removeClass("disabled");
}
window.onload = function(){
    var a = new Game(colorScheme, unhideEverything);
    a.startGame();  
}