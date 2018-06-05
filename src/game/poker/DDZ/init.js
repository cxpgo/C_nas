(function () {
    /**
     * 斗地主
     */
    var DDZjsList = [
        "src/game/poker/DDZ/majhong.js",
        "src/game/poker/DDZ/net.js",

        "src/game/poker/DDZ/ui/Common/DDZCommon.js",
        "src/game/poker/DDZ/ui/Common/DDZSoundMgr.js",

        "src/game/poker/DDZ/model/DDZCard_Rule.js",
        "src/game/poker/DDZ/model/DDZCard_Hinter.js",
        "src/game/poker/DDZ/model/DDZPokerPai.js",
        "src/game/poker/DDZ/model/DDZGameLogic.js",
        "src/game/poker/DDZ/model/record.js",
        "src/game/poker/DDZ/model/DDZCardSet.js",

        "src/game/poker/DDZ/model/game_state/GameStateBase.js",
        "src/game/poker/DDZ/model/game_state/GameStateSeate.js",
        "src/game/poker/DDZ/model/game_state/GameStateWait.js",
        "src/game/poker/DDZ/model/game_state/GameStateBeneath.js",
        "src/game/poker/DDZ/model/game_state/GameStateDispatching.js",
        "src/game/poker/DDZ/model/game_state/GameStateGameing.js",
        "src/game/poker/DDZ/model/game_state/GameStateOver.js",

        "src/game/poker/DDZ/ui/Layer/DDZPokerAnimation.js",
        "src/game/poker/DDZ/ui/Layer/DDZCreateRoom.js",
        "src/game/poker/DDZ/ui/Layer/DDZGameScene.js",
        "src/game/poker/DDZ/ui/Layer/DDZGameDesk.js",
        "src/game/poker/DDZ/ui/Layer/DDZRoundResult.js",
        "src/game/poker/DDZ/ui/Layer/DDZEndResult.js",
        "src/game/poker/DDZ/ui/Layer/DDZRecordControll.js",
        "src/game/poker/DDZ/ui/Layer/DDZChunTianAnimation.js",
        "src/game/poker/DDZ/ui/Layer/DDZCardsSelectorHelp.js",

        "src/game/poker/DDZ/ui/Sprite/DDZClock.js",
        "src/game/poker/DDZ/ui/Sprite/DDZDeskHead.js",
        "src/game/poker/DDZ/ui/Sprite/DDZPokerCard.js",
        "src/game/poker/DDZ/ui/Sprite/DDZDeskSeat.js",
        "src/game/poker/DDZ/ui/Sprite/DDZSelfSeat.js",
        "src/game/poker/DDZ/ui/Sprite/DDZRightSeat.js",
        "src/game/poker/DDZ/ui/Sprite/DDZLeftSeat.js",
        "src/game/poker/DDZ/ui/Sprite/DDZUpSeat.js",

        "src/game/poker/DDZ/ui/Record/DDZGameSceneRecord.js",
        "src/game/poker/DDZ/ui/Record/DDZGameDeskRecord.js",
        "src/game/poker/DDZ/ui/Record/DDZLeftSeatRecord.js",
        "src/game/poker/DDZ/ui/Record/DDZRightSeatRecord.js",
        "src/game/poker/DDZ/ui/Record/DDZSelfSeatRecord.js",
        "src/game/poker/DDZ/ui/Record/DDZUpSeatRecord.js",


        "src/game/poker/DDZ/ui/Gold/DDZGoldGameScene.js",
        "src/game/poker/DDZ/ui/Gold/DDZGoldBtn.js",
        "src/game/poker/DDZ/ui/Gold/DDZGoldRoundResult.js",
    ];

    XYGameInitAppend(DDZjsList);

    DDZPlist = {
        Cards: "res/Game/Poker/DDZ/Resoures/cards.plist",
        Table: "res/Game/Poker/DDZ/Resoures/pdkTable.plist",
        Word: "res/Game/Poker/DDZ/Resoures/pdkWord.plist",
    }
    DDZPokerJson = {
        WG_Speak: "res/Game/Poker/DDZ/WG_Speak.json",
        Head: "res/Game/Poker/DDZ/DDZHead.json",
        Desk: "res/Game/Poker/DDZ/DDZDesk.json",
        Chat: "res/Game/Poker/DDZ/DDZChat.json",
        Card: "res/Game/Poker/DDZ/DDZCard.json",
        LeftPanel: "res/Game/Poker/DDZ/DDZLeftPanel.json",
        RightPanel: "res/Game/Poker/DDZ/DDZRightPanel.json",
        PlayerPanel: "res/Game/Poker/DDZ/DDZPlayerPanel.json",
        UpPanel: "res/Game/Poker/DDZ/DDZUpPanel.json",
        GameRoom: "res/Game/Poker/DDZ/DDZGameRoom.json",
        EndResult: "res/Game/Poker/DDZ/DDZEndResult.json",
        RoundResult: "res/Game/Poker/DDZ/DDZRoundResult.json",
        OpCardTypeEffect: "res/Game/Poker/DDZ/DDZCardTypeEffect.json",
        // DDZWG_CR:           "res/Game/Poker/DDZ/DDZWG_CR.json",
        // WG_CR_PDK:           "res/Game/Poker/DDZ/WG_CR_PDK.json",
        // CreateRoom:         "res/Game/Poker/DDZ/DDZCreateRoom.json",
        EffectAnima: "res/Game/Poker/DDZ/DDZChunTianAnimation.json",
        CardsSelector: "res/Game/Poker/DDZ/DDZCardsSelectorHelp.json",
        RecordControll: "res/Game/Poker/DDZ/DDZRecordControll.json",
        TypeSelect: "res/Game/Poker/DDZ/DDZCardTypeSelect.json",
        DDZCreateRoom: "res/Game/Poker/DDZ/DDZCreateRoom.json",

        GameRoomGold: "res/Game/Poker/DDZ/DDZRoomGold.json",
        GoldBtn: "res/Game/Poker/DDZ/DDZGoldBtn.json",
        GoldRoundResult: "res/Game/Poker/DDZ/DDZGoldRoundResult.json",


        Eff_feiji: "res/Game/Poker/DDZ/ef_feiji.json",
        Eff_liandui: "res/Game/Poker/DDZ/ef_liandui.json",
        Eff_shunzi: "res/Game/Poker/DDZ/ef_shunzi.json",
        Eff_wanzha: "res/Game/Poker/DDZ/ef_wanzha.json",
        Eff_zhadan: "res/Game/Poker/DDZ/ef_zhadan.json",
    
    
    }
    for (var key in DDZPlist) {
        XYGameInitAppendRes(DDZPlist[key]);
    }
    
    for (var key in DDZPokerJson) {
        XYGameInitAppendRes(DDZPokerJson[key]);
    }

})();
