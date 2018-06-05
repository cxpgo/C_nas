(function () {
    /**
     * 填大坑
     */
    var TDKjsList = [
        "src/game/poker/TDK/majhong.js",
        "src/game/poker/TDK/net.js",

        "src/game/poker/TDK/state/GameStateBase.js",
        "src/game/poker/TDK/state/GameStateWait.js",
        "src/game/poker/TDK/state/GameStateReady.js",
        "src/game/poker/TDK/state/GameStateGameing.js",
        "src/game/poker/TDK/state/GameStateOver.js",

        "src/game/poker/TDK/logic/GameSound.js",
        "src/game/poker/TDK/logic/tiandakeng.js",
        "src/game/poker/TDK/logic/Common.js",
        "src/game/poker/TDK/logic/PlayerMgr.js",
        "src/game/poker/TDK/logic/GameLogic.js",

        "src/game/poker/TDK/views/PourSprite.js",
        "src/game/poker/TDK/views/DeskHead.js",
        "src/game/poker/TDK/views/DeskSeat.js",
        "src/game/poker/TDK/views/LeftSeat.js",
        "src/game/poker/TDK/views/RightSeat.js",
        "src/game/poker/TDK/views/SelfSeat.js",
        "src/game/poker/TDK/views/DeskPlayer.js",
        "src/game/poker/TDK/views/SelfOptCtrl.js",
        "src/game/poker/TDK/views/EndResult.js",
        "src/game/poker/TDK/views/TDKRoom.js",
        "src/game/poker/TDK/views/TDKCardsSelectorHelp.js",
        "src/game/poker/TDK/plugin/CRLayerItem.js",
        "src/game/poker/TDK/plugin/SetupPlugIn.js",
    ];
    XYGameInitAppend(TDKjsList);


    /**
    * 填大坑资源
    */
    TDKJson = {
        RoomView: "res/Game/Poker/TDK/TDKRoomView.json",
        Head: "res/Game/Poker/TDK/TDKHead.json",
        LeftPanel: "res/Game/Poker/TDK/TDKLeftPanel.json",
        EndResult: "res/Game/Poker/TDK/EndResultView.json",
        RightPanel: "res/Game/Poker/TDK/TDKRightPanel.json",
        SelfPanel: "res/Game/Poker/TDK/TDKSelfPanel.json",
        PourSpt: "res/Game/Poker/TDK/TDKPourSpt.json",
        Desk: "res/Game/Poker/TDK/DeskPlayer.json",
        SelfOptCtl: "res/Game/Poker/TDK/SelfOptCtl.json",
        Create: "res/Game/Poker/TDK/TDKCreateItem.json",
        SetupPlugIn: "res/Game/Poker/TDK/SetupPlugIn.json",
        CardsSelector: "res/Game/Poker/TDK/TDKCardsSelectorHelp.json",
    }


    TDKPlist = {
        APAO_PLIST: "res/Game/Poker/TDK/effect/ef_apao.plist",
        APAO_PNG: "res/Game/Poker/TDK/effect/ef_apao.png",

        YINGLE_PLIST: "res/Game/Poker/TDK/effect/ef_yingle.plist",
        YINGLE_PNG: "res/Game/Poker/TDK/effect/ef_yingle.png",
    }
    for (var key in TDKJson) {
        XYGameInitAppendRes(TDKJson[key]);
    }
    for (var key in TDKPlist) {
        XYGameInitAppendRes(TDKPlist[key]);
    }
})();
