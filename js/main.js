setTimeout(function () {   window.scrollTo(0, 1); }, 1000);

var	colorScheme1 		=[["#57385C", "#A75265", "#EC7263", "#FEBE7E","#FFEDBC"],
						  ["#004358", "#1F8A70", "#BEDB39", "#FF5347", "#FD7400"],
						  ["#F72F41", "#399DF6", "#99C946", "#FBDB52", "#635358"],
						  ["#4F7288", "#85CFD0", "#EDE872", "#F39A70", "#D0408D"]
						 ];


window.onload=function(){
	var $wrapper= $('.wrapper')[0];
	var a=new Game(12,colorScheme1);
	a.startGame();
	$wrapper.classList.remove("d")
}