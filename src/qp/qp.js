var qp = {
    event: {},
    net: {},
    onPlayVoice: function (data) {
        if (data.state == 0) {
            sound.gameSoundQuiet();
        } else {
            sound.gameSoundResume();
        }
    },

    exit: function () {
        // if (cc.sys.os == cc.sys.OS_IOS) {
        //   jsb.reflection.callStaticMethod("NativeOcClass",
        //       "exit");
        // }else
        // {
        //
        // }
        cc.game.restart();
    }
}

qp.events = { // 三公游戏事件
    'mjTableStatus': function (data) {
        qp.event.send('mjTableStatus', data);
    }, // 牌桌状态
    'mjPlayerEnter': function (data) {
        qp.event.send('mjPlayerEnter', data);
    }, // 玩家进入

    'mjBankerStart': function (data) {
        qp.event.send('mjBankerStart', data);
    }, // 开始抢庄
    'mjBankerStatus': function (data) {
        qp.event.send('mjBankerStatus', data);
    }, // 抢庄状态
    'mjBankerResult': function (data) {
        qp.event.send('mjBankerResult', data);
    }, // 抢庄结果
    'mjSendHandCards': function (data) {
        qp.event.send('mjSendHandCards', data);
    }, // 发牌

    'mjPlayerLeave': function (data) {
        qp.event.send('mjPlayerLeave', data);
    }, // 玩家退出
    'mjPlayerInfoChange': function (data) {
        qp.event.send('mjPlayerInfoChange', data);
    }, // 玩家信息变化
    'mjChipInStart': function (data) {
        qp.event.send('mjChipInStart', data);
    }, // 开始下注
    'mjChipInStatus': function (data) {
        qp.event.send('mjChipInStatus', data);
    }, // 下注状态
    'mjOpenCardStart': function (data) {
        qp.event.send('mjOpenCardStart', data);
    }, // 开始亮牌
    'mjOpenCardStatus': function (data) {
        qp.event.send('mjOpenCardStatus', data);
    }, // 亮牌状态
    'mjResetTable': function (data) {
        qp.event.send('mjResetTable', data);
    }, // 重置桌子
    'sgChatStatus': function (data) {
        qp.event.send('mjChatStatus', data);
    }, // 桌子上聊天消息
    'mjThrowStatus': function (data) {
        qp.event.send('mjThrowStatus', data);
    }, // 桌子上扔道具消息

    'mjShowTing': function (data) {
        qp.event.send('mjShowTing', data);
    }, // 发牌

    'mjTingChange': function (data) {
        qp.event.send('mjTingChange', data);
    }, // 听牌改变

//======== ===========
//mjPlayerEnter
    'mjReadyStatus': function (data) {
        qp.event.send('mjReadyStatus', data);
    }, // 准备状态
    'mjReadyStart': function (data) {
        qp.event.send('mjReadyStart', data);
    }, // 等待玩家准备

    'mjGameResult': function (data) {
        qp.event.send('mjGameResult', data);
    }, // 结算结果
    'mjGameStart': function (data) {
        qp.event.send('mjGameStart', data);
    },
    'pkGameStart': function (data) {
        qp.event.send('pkGameStart', data);
    },

    'mjNotifyDelCards': function (data) {
        qp.event.send('mjNotifyDelCards', data);
    },

    'mjSyncDelCards': function (data) {
        qp.event.send('mjSyncDelCards', data);
    },

    'mjPlayerMoCards': function (data) {
        qp.event.send('mjPlayerMoCards', data);
    },

    'mjSyncPlayerMocards': function (data) {
        qp.event.send('mjSyncPlayerMocards', data);
    },

    //通知某个玩家可以做的操作类型 天胡 吃碰杠补过胡出牌
    'mjNotifyPlayerOP': function (data) {
        qp.event.send('mjNotifyPlayerOP', data);
    },

    'mjSyncPlayerOP': function (data) {
        qp.event.send('mjSyncPlayerOP', data);
    },

    'mjNiaoPai': function (data) {
        qp.event.send('mjNiaoPai', data);
    },
    //mySyncParams
    'mjSyncParams': function (data) {
        qp.event.send('mjSyncParams', data);
    },

    //mjSyncPlayerTianHu
    'mjSyncPlayerTianHu': function (data) {
        qp.event.send('mjSyncPlayerTianHu', data);
    },

    'mjHaiDiPai': function (data) {
        qp.event.send('mjHaiDiPai', data);
    },

    'mjDissolutionTable': function (data) {
        qp.event.send('mjDissolutionTable', data);
    },

    'imPlayVoice': function (data) { // 语音事件 data = {state: 0}  0: start  1: end  -1: error
        qp.event.send('imPlayVoice', data);
    },

    'mjChatStatus': function (data) { //
        qp.event.send('mjChatStatus', data);
    },
    //mjGameOver
    'mjGameOver': function (data) { //
        qp.event.send('mjGameOver', data);
    },

    //mjPlayerOffLine
    'mjPlayerOffLine': function (data) { //
        qp.event.send('mjPlayerOffLine', data);
    },

    // imCreateRoom
    // 'imCreateRoom': function (data) { //
    //     qp.event.send('imCreateRoom', data);
    // },

    //********quanzhou*********
    //补花
    'mjHuaPai': function (data) { //
        qp.event.send('mjHuaPai', data);
    },

    //同步其他玩家补花牌 群发
    'mjSyncHuaPai': function (data) { //
        qp.event.send('mjSyncHuaPai', data);
    },

    //金牌
    'mjJinPai': function (data) { //
        qp.event.send('mjJinPai', data);
    },

    //大胡
    'mjNotifyDaHu': function (data) { //
        qp.event.send('mjNotifyDaHu', data);
    },

    'mjNotifyTingChoice': function (data) { //
        qp.event.send('mjNotifyTingChoice', data);
    },

    'mjLocalPosition': function (data) {  //断线重连
        qp.event.send('mjLocalPosition', data);
    },

    //同步买庄 （百搭用）
    'mjMaiZhuang': function (data) { //
        qp.event.send('mjMaiZhuang', data);
    },

    //同步个百搭 （百搭用）
    'mjGeBaida': function (data) { //
        qp.event.send('mjGeBaida', data);
    },

    //同步扔骰子 （百搭用）
    'mjSaiZi': function (data) { //
        qp.event.send('mjSaiZi', data);
    },

    //同步真七假八 （百搭用）
    'mjCaiTou': function (data) { //
        qp.event.send('mjCaiTou', data);
    },

    //换3张通知
    'mjHuan3Start': function (data) { //
        qp.event.send('mjHuan3Start', data);
    },

    //换3张同步
    'mjHuan3Status': function (data) { //
        qp.event.send('mjHuan3Status', data);
    },

    //换3张结果
    'mjHuan3End': function (data) { //
        qp.event.send('mjHuan3End', data);
    },

    //定缺通知
    'mjDingQueStart': function (data) { //
        qp.event.send('mjDingQueStart', data);
    },

    //定缺结束
    'mjDingQueEnd': function (data) { //
        qp.event.send('mjDingQueEnd', data);
    },

    'getCopyLabel': function (data) {
        qp.event.send('getCopyLabel', data);
    },

    //十三水
    'pkChipInStart': function (data) {
        qp.event.send('pkChipInStart', data);
    }, // 通知玩家下注
    'pkChipInStatus': function (data) {
        qp.event.send('pkChipInStatus', data);
    }, // 通知玩家下注

    'pkQiePaiStart': function (data) {
        qp.event.send('pkQiePaiStart', data);
    }, // 通知切牌

    'pkSyncQiePai': function (data) {
        qp.event.send('pkSyncQiePai', data);
    }, // 同步切牌

    'mjNotifyGoldNotEnough': function (data) {
        qp.event.send('mjNotifyGoldNotEnough', data);
    }, // 房间续费

    'hallXuFei': function (data) {
        qp.event.send('hallXuFei', data);
    }, // 房间续费

    'gameUpdatePlayerAttr': function (data) {
        qp.event.send('gameUpdatePlayerAttr', data);

    }, //

    'pkSyncForceDelPai': function (data) {
        qp.event.send('pkSyncForceDelPai', data);
    }, // 同步强制比牌

    // 斗地主
    'pkSyncTableStatus': function (data) {
        qp.event.send('pkSyncTableStatus', data);
    },
    // 通知玩家叫地主
    'pkNotifyLord': function (data) {
        qp.event.send('pkNotifyLord', data);
    },

    // 同步玩家抢地主信息
    'pkSyncLordInfo': function (data) {
        qp.event.send('pkSyncLordInfo', data);
    },

    // 同步玩家抢地主结果
    'pkSyncLordResult': function (data) {
        qp.event.send('pkSyncLordResult', data);
    },
    // 通知春天
    'pkSyncTableSpring': function (data) {
        qp.event.send('pkSyncTableSpring', data);
    },

    // 同步倍率
    'pkSyncTableRate': function (data) {
        qp.event.send('pkSyncTableRate', data);
    },
    //摸宝
    'mjBaoPai' : function(data) {
        qp.event.send('mjBaoPai', data);
    },
}
