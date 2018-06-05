(function () {
    var JSPath = "src/game/maj/BaiShan/";
    var RESPath = "res/Game/Maj/BaiShan/";

    var BaiShanjsList = [
        JSPath +"majhong.js",
        JSPath +"net.js",
        JSPath +"Model/GameLogic.js",
        JSPath +"Model/GameRecord.js",
        JSPath +"Common/Common.js",
        JSPath +"Views/GameDesk.js",
        JSPath +"Views/RecordControll.js",
        JSPath +"Views/RoundResult.js",
        JSPath +"Views/EndResult.js",
        JSPath +"Views/BSCreateRoom.js",
        JSPath +"Views/DahhuAniamtion.js",
        JSPath +"Views/GameScene.js",
    ];

    XYGameInitAppend(BaiShanjsList);

    var RES = {
        WGCRoom             : RESPath + "CreateRoom.json",
        RecordControll      : RESPath + "RecordControll.json",
        RoundResult      : RESPath + "RoundResult.json",

        DaHu_PL             : RESPath + "Resoures/dahu.plist",
        DaHu_PN             : RESPath + "Resoures/dahu.png",
    }

    for (var key in RES) {
        XYGameInitAppendRes(RES[key]);
    }


    MJBaiShan = {
        JSPath  : JSPath,
        RESPath : RESPath,
        RES     : RES,
    };
    
})();
