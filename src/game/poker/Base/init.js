(function () {

    var PokerBaseList = [
        "src/game/poker/Base/pokerpai.js",
        "src/game/poker/Base/PokerCard.js",
        "src/game/poker/Base/PCardBoxMgr.js",
    ];
    XYGameInitAppend(PokerBaseList);

    
    PokerJson = {
        Card: "res/Game/Poker/Base/Resoures/cards.plist",
        CardPng: "res/Game/Poker/Base/Resoures/cards.png",
    
        PokerCard: "res/Game/Poker/Base/Card.json",
    }

    for(var key in PokerJson)
    {
        XYGameInitAppendRes(PokerJson[key]);
    }

})();
