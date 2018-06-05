(function () {
    var PDKjsList = [
        "src/game/poker/PDK/majhong.js",
        "src/game/poker/PDK/net.js",
        "src/game/poker/PDK/model/record.js",
        "src/game/poker/PDK/model/pokerpai.js",
        "src/game/poker/PDK/model/GameLogic.js",
        "src/game/poker/PDK/ui/Layer/GameScene.js",
        "src/game/poker/PDK/ui/Layer/GameDesk.js",
        "src/game/poker/PDK/ui/Layer/RecordControll.js",
        "src/game/poker/PDK/ui/Sprite/DeskHead.js",
        "src/game/poker/PDK/ui/Layer/PDKCreateRoom.js",
        "src/game/poker/PDK/ui/Layer/RoundResult.js",
        "src/game/poker/PDK/ui/Layer/EndResult.js",
        "src/game/poker/PDK/ui/Sprite/PokerCard.js",
        "src/game/poker/PDK/ui/Sprite/PaoDeskSeat.js",
        "src/game/poker/PDK/ui/Sprite/PaoSelfSeat.js",
        "src/game/poker/PDK/ui/Sprite/PaoRightSeat.js",
        "src/game/poker/PDK/ui/Sprite/PaoLeftSeat.js",

        "src/game/poker/PDK/ui/Record/PDKGameSceneRecord.js",
        "src/game/poker/PDK/ui/Record/PDKGameDeskRecord.js",
        "src/game/poker/PDK/ui/Record/PaoLeftSeatRecord.js",
        "src/game/poker/PDK/ui/Record/PaoRightSeatRecord.js",
        "src/game/poker/PDK/ui/Record/PaoSelfSeatRecord.js",
    ];

    XYGameInitAppend(PDKjsList);


    PDKPokerJson = {
        PDKCard: "res/Game/Poker/PDK/PDKCard.json",
        PDKDesk: "res/Game/Poker/PDK/PDKDesk.json",
        PDKEndResult: "res/Game/Poker/PDK/PDKEndResult.json",
        PDKHead: "res/Game/Poker/PDK/PDKHead.json",
        PDKLastCards: "res/Game/Poker/PDK/PDKLastCards.json",
        PDKLeftPanel: "res/Game/Poker/PDK/PDKLeftPanel.json",
        PDKPlayerPanel: "res/Game/Poker/PDK/PDKPlayerPanel.json",
        PDKRecordControll: "res/Game/Poker/PDK/PDKRecordControll.json",
        PDKRightPanel: "res/Game/Poker/PDK/PDKRightPanel.json",
        PDKRoom: "res/Game/Poker/PDK/PDKRoom.json",
        PDKRoundResult: "res/Game/Poker/PDK/PDKRoundResult.json",
        PDKCreateRoom: "res/Game/Poker/PDK/PDKCreateRoom.json",
    }

    for (var key in PDKPokerJson) {
        XYGameInitAppendRes(PDKPokerJson[key]);
    }

    PDKPokerPlist = {
        DeskUI: "res/Game/Poker/PDK/Resoures/desk_ui.plist",
    }

    for (var key in PDKPokerPlist) {
        XYGameInitAppendRes(PDKPokerPlist[key]);
    }
})();
