(function(){


    var ClubList = [
        "src/club/majhong.js",
        "src/club/net.js",
        "src/club/ui/Layer/clubLayer.js",
        "src/club/ui/Layer/mainLayer.js",
        "src/club/ui/Layer/roomInfoLayer.js",
        "src/club/ui/Layer/CreateRoom.js",
        "src/club/ui/Layer/adminLayer.js",
        "src/club/ui/Layer/clubHistory.js",
        "src/club/ui/Common/common.js",
    ];

    XYGameInitAppend(ClubList);

    ClubJson = {
        PlayerUnion: "res/Club/GamePlayerUnion.json",
        ClubMain: "res/Club/ClubMain.json",
        RoomInfo: "res/Club/RoomInfo.json",
        ClubSelfInfo: "res/Club/ClubSelfInfo.json",
        CreatePack: "res/Club/ClubCreatePack.json",
        Admin: "res/Club/ClubAdmin.json",
        Recharge: "res/Club/ClubRecharge.json",
        Notice: "res/Club/ClubPackNotice.json",
        Invite: "res/Club/ClubInvitePlayer.json",
        InviteRoomInfo: "res/Club/ClubInviteRoomInfo.json",
        InviteButton: "res/Club/ClubInviteButton.json",
        ClubHistory: "res/Club/ClubHistory.json",
        ClubSelectGame: "res/Club/ClubSelectGameType.json",
        ClubWanFa: "res/Club/ClubWanFa.json",
    }
    
    
    
    
    for(var key in ClubJson)
    {
        XYGameInitAppendRes(ClubJson[key]);
    }

}());