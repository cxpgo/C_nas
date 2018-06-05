var hall = {

    AppName         :   "姚记东北棋牌",
    AppNameID       :   "yjdbqp",
    AppAgentType    :   "yjdbqp",
    AppAgentShareCxt:   "好友约局，线上麻将，随时随地干一把！最正宗的姚记东北棋牌！",
    AppShareCxt     :   "好友约局，线上麻将，随时随地干一把！最正宗的姚记东北棋牌！",

    appId           :   'com.qp.hall',
    curVersion      :   '1.0.0',  // 线上的版本
    distChannel     :   'default',
    songshen        :   0,   //是否处于送审环境中
    mustUpdate      :   false,
    updateUrl       :   '',
    
    gameCfgs: [],
    gameEntries: [],
    inTableId: null,

    net: {},
    user: {},
    userNav: null,
    shopItems: [],

    inRoom: false,

    SPEAK_MSG_LENGTH: 20,
    speakMsg: [],//喇叭消息
    feedMsg: [],//反馈消息
    mailType: {system: 1, game: 2},
    mails: [],
    safeBox: null,
    soundOn: true,
    notice: {},
    bLogined: false,
    podiumList: [],//领取奖励
    shopList: [],
    speakerInfo: null,
    agentWeChat: [],

    wxEnterRoom: 0,
    delayMS:0,
    lastSendTime:0,
    lastRecieveTime:0,
    club: null,
    gameInfo:null,
    freeData:[],
    enableSendMsg:1,
    registerClub: function (game, cb) {
        hall.club = game;
    },
    registerGame: function (game, cb) {
        hall.gameEntries[game.appId] = game;
        PackageMgr.registerGame(game);
    },
    listGames: function () {
        return hall.gameCfgs;
    },

    gameConfig: function (index) {
        return hall.gameCfgs[index];
    },

    getSpeakerCount: function () {
        if (hall.speakerInfo['hallBagMsg'] != undefined && hall.speakerInfo['hallBagMsg'] != null
            && hall.speakerInfo['hallBagMsg']['items'] != undefined
            && hall.speakerInfo['hallBagMsg']['items'] != null
            && hall.speakerInfo['hallBagMsg']['items'].length > 0) {
            for (var i = 0; i < hall.speakerInfo['hallBagMsg']['items'].length; i++) {
                var item = hall.speakerInfo['hallBagMsg']['items'][i];
                if (item["type"] == "itemChat") {
                    return item['count'];
                }
            }
        }

        return 0;
    },

    isCanSpeak: function () {
        if (this.getSpeakerCount() > 0) {
            return true;
        }
        return false;
    },


    gameSize: function () {
        return hall.gameCfgs.length;
    },
    //断线重回进入
    rePlayingEnter: function (serverId , arenaId) {
        var _Game = null;
        for (var gameId in hall.gameEntries) {
            var game = hall.gameEntries[gameId];
            if(serverId && game.net && serverId.indexOf(game.net.GameName) != -1){
                this.enter(gameId , arenaId);
                break;
            }
        }
    },
    enter: function (gameId,arenaData) {
        if(arenaData == null || arenaData == undefined)
            arenaData = 0;
        qp.event.bind(qp.events);
        hall.wxEnterRoom = 0;
        hall.inRoom = true;
        hall.inTableId = gameId;
        hall.gameEntries[gameId].enter(arenaData);
    },

    enterRecord: function (gameId, recordData) {
        hall.inTableId = gameId;
        hall.gameEntries[gameId].enterRecord(recordData);
    },

    getPlayingGame: function () {
        return hall.gameEntries[hall.inTableId];
    },

    createPrivate: function (gameId, tableName, cb) {
        hall.gameEntries[gameId].createPrivate(tableName, cb);
    },

    joinPrivate: function (gameId, tableId, cb) {
        hall.gameEntries[gameId].joinPrivate(tableId, cb);
    },

    getCurGameSetUpPlugin: function (context , args) {
        var playingGame = this.getPlayingGame();
        if(!playingGame || !playingGame.getSetUpPlugin) return;
        
        return playingGame.getSetUpPlugin(context , args);
    },

    isSafeBoxUsed: function () {
        if (hall.safeBox["noSafebox"] == 1) {
            return false;
        } else {
            return true;
        }
    },
};

if (cc.game.config.packageFrom == 0 || !!cc.game.config.packageFrom) {
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        hall.PACKAGEFROM = "android";
    } else {
        hall.PACKAGEFROM = "ios";
    }
} else {
    hall.PACKAGEFROM = cc.game.config.packageFrom;
}

