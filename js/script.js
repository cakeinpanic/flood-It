window.onload=function(){
    var game1 = new FloodGame({
        gameField : $('#game1 .game-field')[0],
        colorPanel : $('#game1 .color-panel')[0],
        schemePanel : $('#game1 .mini-color-scheme-wrapper')[0]
    });

    game1.start(12);

    var game2 = new FloodGame({
        gameField : $('#game2 .game-field')[0],
        colorPanel : $('#game2 .color-panel')[0],
        schemePanel : $('#game2 .mini-color-scheme-wrapper')[0],
        colorSchemeId: 1
    });

    game2.start(6);


}