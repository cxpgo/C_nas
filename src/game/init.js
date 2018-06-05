(function(){
    var jsList = [
        "src/game/mode/GameImpl.js",
        "src/game/mode/XYGameScene.js",
        "src/game/mode/XYGLogic.js",
        "src/game/mode/GameLogicBase.js",
        "src/game/mode/GameNet.js",

        "src/game/views/TableComponent.js",
        "src/game/views/speakCtrl.js",
        "src/game/views/DissloveView.js",
        "src/game/views/MajhongPlayerInfo.js",
        "src/game/views/SetupPlugInScene.js",
        "src/game/views/SetupPlugInPokerScene.js",
        "src/game/views/WGApdGameMGView.js",

    ];
    XYGameInitAppend(jsList);


    var list = [
        "src/game/maj/init.js",
        "src/game/poker/init.js",

    ];
    XYGameInitLoad(list);

    GameRes = {
        Dissolve: "res/Game/Views/GameDissolveDialog.json",
        DissolveResult: "res/Game/Views/GameDissolveResult.json",

        PlayerInfoDialog: "res/Game/Views/GamePlayerInfoDialog.json",
        Speak: "res/Game/Views/GameSpeakTip.json",
        SetupPlugInScene: "res/Game/Views/SetupPlugInScene.json",
        SetupPlugInPokerScene: "res/Game/Views/SetupPlugInPokerScene.json",
        WGApdGameMGView: "res/Game/Views/WGApdGameMGView.json",

        History: "res/Game/Resoures/gameHistory.plist",
        HistoryPng: "res/Game/Resoures/gameHistory.png",

        YUYINPLIST: "res/Game/Resoures/yuyin/yinliang.plist",
        YUYINPNG: "res/Game/Resoures/yuyin/yinliang.png",

        WGAptRsBtn1_PNG : "res/Game/Resoures/apdgameCr/btn_tianjiayouxi_01.png",
        WGAptRsBtn2_PNG : "res/Game/Resoures/apdgameCr/btn_tianjiayouxi_02.png",
    }

    for(var key in GameRes)
    {
        XYGameInitAppendRes(GameRes[key]);
    }
    
}());