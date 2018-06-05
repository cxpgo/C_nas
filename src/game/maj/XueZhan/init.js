(function () {

    var JSPath = "src/game/maj/XueZhan/";
    var RESPath = "res/Game/Maj/XueZhan/";
    
    var XueZhanjsList = [
        JSPath + "majhong.js",
        JSPath + "net.js",
        JSPath + "Model/GameLogic.js",
        JSPath + "Model/GameRecord.js",
        JSPath + "Common/Common.js",
        JSPath + "Views/GameDesk.js",
        JSPath + "Views/RecordControll.js",
        JSPath + "Views/RoundResult.js",
        JSPath + "Views/EndResult.js",
        JSPath + "Views/XZCreateRoom.js",
        JSPath + "Views/DahhuAniamtion.js",
        JSPath + "Views/GameScene.js",
    ];

    XYGameInitAppend(XueZhanjsList);


    XueZhanMajhongJson = {
        CreateRoom_xz   : RESPath + "CreateRoom_xz.json",
        CreateRoom_ss   : RESPath + "CreateRoom_ss.json",
        CreateRoom_td   : RESPath + "CreateRoom_td.json",
        CreateRoom_sl   : RESPath + "CreateRoom_sl.json",

        RecordControll  : RESPath + "RecordControll.json",
        WGRoomDingQue   : RESPath + "WGRoomDingQue.json",

        PointPlist      : RESPath + "Resoures/effect/point.plist",
        PointPng        : RESPath + "Resoures/effect/point.png",
        RainPlist       : RESPath + "Resoures/effect/rain.plist",
        RainPng         : RESPath + "Resoures/effect/rain.png",
        WindPlist       : RESPath + "Resoures/effect/wind.plist",
        WindPng         : RESPath + "Resoures/effect/wind.png",
    }

    for (var key in XueZhanMajhongJson) {
        XYGameInitAppendRes(XueZhanMajhongJson[key]);
    }

    MJXueZhan = {
        JSPath  : JSPath,
        RESPath : RESPath,
        RES     : XueZhanMajhongJson,
    };
})();
