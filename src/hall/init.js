(function(){


    var jsList = [
        "src/hall/hall.js",
        "src/hall/net.js",
        "src/hall/logic/sound.js",
        "src/hall/logic/GameBagEquip.js",
        "src/hall/views/SetupDialog.js",
        "src/hall/views/sangong_login.js",
        "src/hall/views/BaseCreateRoomView.js",
        "src/hall/views/BaseGameHelpView.js",
        "src/hall/views/CreateRoom.js",
        "src/hall/views/JJDialog.js",
        "src/hall/views/Majhong_hall.js",
        "src/hall/views/MajhongNotice.js",
        "src/hall/views/MajhongHistory.js",
        "src/hall/views/MajhongHallMessage.js",
        "src/hall/views/MajhongHallHelp.js",
        "src/hall/views/MajhongLoading.js",
        "src/hall/views/MajhongXieyi.js",
        "src/hall/views/Chat.js",
        "src/hall/views/MajhongBindCode.js",
        "src/hall/views/Majhong_shop.js",
        "src/hall/views/GameAnnounce.js",
        "src/hall/views/GameCoinRankView.js",
        "src/hall/views/MajhongPlayerInfoDialog.js",
        "src/hall/views/MajhongDecideDialog.js",
        "src/hall/views/MajhongGoldField.js",
        "src/hall/views/JJCheckRecord.js",
        "src/hall/views/JJConfirmDialog.js",
        "src/hall/views/JJGiveRoomCard.js",
        "src/hall/views/JJMustUpdateDialog.js",
        "src/hall/views/MajhongAddFKDialog.js",
        "src/hall/views/JJShareDialog.js",
        "src/hall/views/QDTipBar.js",
        "src/hall/Plugin/TDKHelpItem.js",
        "src/hall/Plugin/DDZHelpItem.js",
        "src/hall/Plugin/PDKHelpItem.js",
        "src/hall/Plugin/XZHelpItem.js",
        "src/hall/Plugin/BSHelpItem.js",
        "src/hall/Plugin/CCHelpItem.js",
        "src/hall/Plugin/DAHelpItem.js",
        "src/hall/Plugin/JTHelpItem.js",
        "src/hall/Plugin/SYHelpItem.js",
        "src/hall/views/Majhong_exchange.js",
        "src/hall/views/Majhong_exchangeConversion.js",
        "src/hall/views/Majhong_exchangeDialog.js",
        "src/hall/views/Majhong_Backpack.js",
        "src/hall/views/MajhongBigZhuanPan.js",
        "src/hall/views/Majhong_Task.js",
        "src/hall/views/Majhong_Prob.js",
        "src/hall/views/Majhong_ItemDialog.js",
        "src/hall/views/Majhong_exchangeBuyType.js",
    ];

    XYGameInitAppend(jsList);


    GameHallPlist = {
        newUi: "res/GameHall/Resoures/new_ui.plist",
        newUiPng: "res/GameHall/Resoures/new_ui.png",
    }
    
    GameHallJson = {
        JLB:"res/GameHall/effect/julebu/ef_julebu.json",
        JBC:"res/GameHall/effect/jinbichang/ef_taiwan_jinbi.json",
        GOLD:"res/GameHall/effect/kuaisujiaru/ef_kuaisujiaru.json",
        BD:"res/GameHall/effect/bangding/ef_daboluo_banding.json",
        FX:"res/GameHall/effect/fenxiang/ef_daboluo_fenxiang.json",
        YYL:"res/GameHall/effect/yaoyaole/ef_daboluo_yaoyaole.json",
        RW:"res/GameHall/effect/dongbeirenwu/ef_dongbeirenwu.json",
        ZZPP:"res/GameHall/effect/zhengzaipipei/ef_zhengzaipipei.json",
        PBXZ:"res/GameHall/effect/paibeixuanzhe/ef_paibeixuanzhe.json",
        DH:"res/GameHall/effect/duihuanzhongxin/ef_duihuanzhongxin.json",
        DZP:"res/GameHall/effect/dazhuanpan/ef_dazhuanpan.json",

        AddFK: "res/GameHall/GameAddFKDialog.json",
        Chat: "res/GameHall/GameChat.json",
        ChatExpItem: "res/GameHall/GameChatExpItem.json",
        ChatUsualItem: "res/GameHall/GameChatUsualItem.json",
        CheckRecord: "res/GameHall/GameCheckRecord.json",
        Comfirm: "res/GameHall/GameConfirmDialog.json",
        Decide: "res/GameHall/GameDecideDialog.json",
        Hall: "res/GameHall/GameHall.json",
        Join: "res/GameHall/GameJoinRoom.json",
        GameLogin: "res/GameHall/GameLogin.json",
        AccountLogin: "res/GameHall/GameAccountLogin.json",
        Notice: "res/GameHall/GameNotice.json",
        PlayerInfo: "res/GameHall/GamePlayerInfo.json",
        Share: "res/GameHall/GameShare.json",
        Xieyi: "res/GameHall/GameXieyi.json",
        loading: "res/GameHall/loading.json",
        Help: "res/GameHall/GameHallHelp.json",
    
        Histrory: "res/GameHall/GameHistory.json",
        BindCode: "res/GameHall/GameBindCode.json",
        HallActivety: "res/GameHall/GameHallActivity.json",
    
        TipBarNotice: "res/GameHall/GameTipBar.json",
    
        Shop: "res/GameHall/GameShop.json",
        Announce: "res/GameHall/GameAnnounce.json",
        PokerDialog:"res/Common/PokerSelectorHelp.json",
        GameCoinRankViews:"res/GameHall/GameCoinRank.json",
        CreateRoom: "res/GameHall/GameCreateRoom.json",
        DeskSetup:"res/GameHall/GameDeskSetup.json",
        GoldField:"res/GameHall/GameHallGoldField.json",
        TDKHelp:"res/GameHall/TDKHelp.json",
        DDZHelp:"res/GameHall/DDZHelp.json",
        PDKHelp:"res/GameHall/PDKHelp.json",
        XZHelp:"res/GameHall/XZHelp.json",
        BSHelp:"res/GameHall/BSHelp.json",
        CCHelp:"res/GameHall/CCHelp.json",
        DAHelp:"res/GameHall/DAHelp.json",
        JTHelp:"res/GameHall/JTHelp.json",
        SYHelp:"res/GameHall/SYHelp.json",

        TestServers:"res/GameHall/TestServers.json",
        Exchange: "res/GameHall/GameExchange.json",
        GameBackpack:"res/GameHall/GameBackpack.json",
        ExchangeConversion:"res/GameHall/GameExchangeConversion.json",
        ExchangeDialog:"res/GameHall/GameExchangeDialog.json",
        BigZhuanPan: "res/GameHall/BigZhuanPan.json",
        // EfTurnReward: "res/GameHall/ef_turn_reward.json",
        // GameTask: "res/GameHall/GameTask.json",
        GameProb: "res/GameHall/GameProb.json",
        GameItemDialog: "res/GameHall/GameItemDialog.json",
        GameExchangeBuyType: "res/GameHall/GameExchangeBuyType.json",

    };

    for (var key in GameHallPlist) {
        XYGameInitAppendRes(GameHallPlist[key]);
    }
    
    for (var key in GameHallJson) {
        XYGameInitAppendRes(GameHallJson[key]);
    }
}());