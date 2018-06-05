(function () {

    var JSPath = "src/game/maj/Base/";
    var RESPath = "res/Game/Maj/Base/";

    var jsList = [
        JSPath + "Model/Common.js",
        JSPath + "Model/GameLogicBase.js",
        JSPath + "Model/GameRecordBase.js",
        JSPath + "Model/GameSound.js",

        JSPath + "Card/pai.js",
        JSPath + "Card/pai2d.js",
        JSPath + "Card/Card.js",
        JSPath + "Card/CardDownDesk.js",
        JSPath + "Card/CardLeftDesk.js",
        JSPath + "Card/CardLeftShow.js",
        JSPath + "Card/CardLeftStand.js",
        JSPath + "Card/CardRightDesk.js",
        JSPath + "Card/CardRightShow.js",
        JSPath + "Card/CardRightStand.js",
        JSPath + "Card/CardShowUp.js",
        JSPath + "Card/CardTip.js",
        JSPath + "Card/CardUpDesk.js",
        JSPath + "Card/CardUpShow.js",
        JSPath + "Card/CardUpStand.js",
        JSPath + "Card/MyCard.js",

        JSPath + "SeatPlugIn/PlugInBase.js",
        JSPath + "SeatPlugIn/PlugInDingQue.js",
        JSPath + "SeatPlugIn/PlugInHuan3.js",
        JSPath + "SeatPlugIn/PlugInTingTips.js",
        JSPath + "SeatPlugIn/PlugInControl.js",
        // JSPath + "SeatPlugIn/PlugInShowTingHuType.js",ss

        JSPath + "SeatPlugIn/Component/CmpAutoOutCard.js",
        JSPath + "SeatPlugIn/Component/CmpDeskSeatRe.js",
        // JSPath + "SeatPlugIn/Component/CmpShowTingDelCards.js",

        JSPath + "SeatPlugIn/Seat/DeskSeat.js",
        JSPath + "SeatPlugIn/Seat/SelfSeat.js",
        JSPath + "SeatPlugIn/Seat/LeftSeat.js",
        JSPath + "SeatPlugIn/Seat/RightSeat.js",
        JSPath + "SeatPlugIn/Seat/UpSeat.js",
        
        JSPath + "V3D/Seat/SelfSeat.js",
        JSPath + "V3D/Seat/RightSeat.js",
        JSPath + "V3D/Seat/UpSeat.js",
        JSPath + "V3D/Seat/LeftSeat.js",

        
        JSPath + "V3D/RecordSeat/SelfSeatRe.js",
        JSPath + "V3D/RecordSeat/RightSeatRe.js",
        JSPath + "V3D/RecordSeat/UpSeatRe.js",
        JSPath + "V3D/RecordSeat/LeftSeatRe.js",

        JSPath + "V2D/Component/CmpOutCardAni2D.js",
        JSPath + "V2D/Seat/SelfSeat.js",
        JSPath + "V2D/Seat/RightSeat.js",
        JSPath + "V2D/Seat/UpSeat.js",
        JSPath + "V2D/Seat/LeftSeat.js",

        JSPath + "Views/GameRoomBase.js",
        JSPath + "Views/GameDesk.js",
        JSPath + "Views/DeskHead.js",
        JSPath + "Views/DahhuAniamtion.js",
        JSPath + "Views/RecordControll.js",
        JSPath + "Views/MJEndResultBase.js",
        JSPath + "Views/MajhongCardsHelp.js",

        
    ];

    XYGameInitAppend(jsList);


    MJBaseRes = {
        
        QuanPlist       : RESPath + "Effect/quan.plist",
        QuanPng         : RESPath + "Effect/quan.png",

        Buhua           : RESPath + "Buhua.json",
        EndResult       : RESPath + "MajhongEndResult.json",
        Head            : RESPath + "MajhongHead.json",
        HuAnimation     : RESPath + "MajhongHuAnimation.json",
        Record          : RESPath + "MajhongRecordControll.json",
        RoundResult     : RESPath + "MajhongRoundResult.json",
        MajhongHelp     : RESPath + "MajhongHelp.json",
        CardsSelectorHelp     : RESPath + "CardsSelectorHelp.json",

        WGDingQue       : RESPath + "WGDingQue.json",
        WGHuan3         : RESPath + "WGHuan3.json",
        WGTingTips      : RESPath + "WGTingTips.json",
        WGControl       : RESPath + "WGControl.json",
        WGShowTingHuType       : RESPath + "WGShowTingHuType.json",

        Room            : RESPath + "MajhongRoom.json",

        PL_Word         : RESPath + "Resoures/control_word.plist",
        PL_Dahu         : RESPath + "Resoures/dahu.plist",
        PL_TableOther   : RESPath + "Resoures/table_other.plist",
        PL_Head_light   : RESPath + "Resoures/head_light.plist",

        P_Room_H3_JT    : RESPath + "Resoures/huan3/room_huan3_ditu_jt.png",
        Huan3Atlas      : RESPath + "Resoures/huan3/spine/jiantou.atlas",
        Huan3Json       : RESPath + "Resoures/huan3/spine/jiantou.json",
        Huan3Png        : RESPath + "Resoures/huan3/spine/jiantou.png",

        Huan3PxzAtlas   : RESPath + "Resoures/huan3/spine/xuanzhuan.atlas",
        Huan3PxzJson    : RESPath + "Resoures/huan3/spine/xuanzhuan.json",
        Huan3PxzPng     : RESPath + "Resoures/huan3/spine/xuanzhuan.png",

        XiaoHu_PNG      : RESPath + "Resoures/table/hu_xiaohu.png",
        Hu_Zimo_Png     : RESPath + "Resoures/table/hu_zimo.png",
        LiuJu            : RESPath + "Resoures/large/img_liuju.png",

        PL_MajCardTit   : RESPath + "Resoures/MajCardTit.plist",
        PN_MajCardTit   : RESPath + "Resoures/MajCardTit.png",

    };

    MJBaseResV2D = {
        Card            : RESPath + "V2D/MajhongCard.json",
        CardLeftShow    : RESPath + "V2D/MajhongCardLeftShow.json",
        CardLeftStand   : RESPath + "V2D/MajhongCardLeftStand.json",
        CardRightShow   : RESPath + "V2D/MajhongCardRightShow.json",
        CardRightStand  : RESPath + "V2D/MajhongCardRightStand.json",
        CardShowUp      : RESPath + "V2D/MajhongCardShowUp.json",
        CardUpShow      : RESPath + "V2D/MajhongCardUpShow.json",
        CardUpStand     : RESPath + "V2D/MajhongCardUpStand.json",


        CardTip         : RESPath + "V2D/MajhongCardTip.json",
        
        PlayerLeft      : RESPath + "V2D/MajhongPlayerLeft.json",
        PlayerRight     : RESPath + "V2D/MajhongPlayerRight.json",
        PlayerSelf      : RESPath + "V2D/MajhongPlayerSelf.json",
        PlayerUp        : RESPath + "V2D/MajhongPlayerUp.json",
        
        Desk            : RESPath + "V2D/MajhongDesk.json",
        WGRoom          : RESPath + "V2D/WGRoom2D.json",

        PL_Cards        : RESPath + "Resoures/V2D/tileImage.plist",
        PN_CardsPNG     : RESPath + "Resoures/V2D/tileImage.png",
    };

    MJBaseResV3D = {
        DownDesk        : RESPath + "V3D/MajhongCardDownDesk.json",
        DownShow        : RESPath + "V3D/MajhongCardDownShow.json",
        DownStand       : RESPath + "V3D/MajhongCardDownStand.json",
        LeftDesk        : RESPath + "V3D/MajhongCardLeftDesk.json",
        LeftShow        : RESPath + "V3D/MajhongCardLeftShow.json",
        LeftStand       : RESPath + "V3D/MajhongCardLeftStand.json",
        RightDesk       : RESPath + "V3D/MajhongCardRightDesk.json",
        RightShow       : RESPath + "V3D/MajhongCardRightShow.json",
        RightStand      : RESPath + "V3D/MajhongCardRightStand.json",
        UpDesk          : RESPath + "V3D/MajhongCardUpDesk.json",
        UpShow          : RESPath + "V3D/MajhongCardUpShow.json",
        UpStand         : RESPath + "V3D/MajhongCardUpStand.json",
        CardTip         : RESPath + "V3D/MajhongCardTip.json",

        Right           : RESPath + "V3D/MajhongRighterPanel.json",
        Left            : RESPath + "V3D/MajhongLefterPanel.json",
        Up              : RESPath + "V3D/MajhongUperPanel.json",
        Player          : RESPath + "V3D/MajhongPlayerPanel.json",
        
        Desk            : RESPath + "V3D/MajhongDesk.json",
        WGRoom          : RESPath + "V3D/WGRoom3D.json",

        PL_Cards        : RESPath + "Resoures/V3D/tileImage.plist",
        PN_CardsPNG     : RESPath + "Resoures/V3D/tileImage.png",
        PL_TableClock   : RESPath + "Resoures/V3D/tableclock.plist",
    };

    for (var key in MJBaseRes) {
        XYGameInitAppendRes(MJBaseRes[key]);
    }
    
    for (var key in MJBaseResV2D) {
        XYGameInitAppendRes(MJBaseResV2D[key]);
    }
    for (var key in MJBaseResV3D) {
        XYGameInitAppendRes(MJBaseResV3D[key]);
    }
    

})();
