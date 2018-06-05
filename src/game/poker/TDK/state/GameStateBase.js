var GameTDKBaseState = cc.Class.extend({
    ctor: function (status) {
        this.mStatus = status;
        XYGLogic.Instance.status = status;
        this.mOptTime = -1;
        this.mDelegate = null;
        JJLog.print("[GameState] status:", status);
    },

    init: function (delegate, time) {
        this.mDelegate = delegate;
        this.mOptTime = time;
        this.btn_startGame.setVisible(false);
        this.onInit.apply(this, arguments);
    },
    destroy: function () {
        this.onRelease.apply(this, arguments);
        XYGLogic.Instance.Data.isOffline = 0;
    },

    pcUserChinCoin: function (uid, coins , pourAni) {
        pourAni = pourAni == false ? false : true;
        for (var pourV in coins) {
            var pourN = coins[pourV];
            for (var i = 0; i < pourN; i++) {
                //拼装数据
                var sData = {
                    uid: uid,
                    msg: {
                        amount: pourV,
                    }
                }

                this.mDelegate.onUpdatePourOut(sData , pourAni);
            }
        }
    },

    reBuildPlayerOp: function () {
        //玩家操作状态
        var lastOp = XYGLogic.Instance.Data.lastOP;
        if (lastOp) {
            lastOp.uid = lastOp.lastUid;
            qp.event.send("mjNotifyPlayerOP", lastOp);
        }
    },

    reBuildChipInState: function () {
        //所有玩家的筹码下注状态

        var tableCoins = XYGLogic.Instance.Data.tableCoins;
        if (!tableCoins || !tableCoins.coin) {
            return;
        }
        for (var uid in tableCoins.coin) {
            var coins = tableCoins.coin[uid];
            this.pcUserChinCoin(uid, coins , false);

            var cpSCtrl = this.mDelegate.getPlayerSeatCtrl(uid);
            if (cpSCtrl) {
                //拼装数据
                var sData = {
                    uid: uid,
                    msg: {
                        tableCoins: tableCoins
                    }
                };
                cpSCtrl.synPlayerOp(sData);
            }
        }
    },

    checkCanOpToStartGame: function () {
        var localUID = hall.user.uid;
        var fzUID = XYGLogic.Instance.Data.fangZhu;
        var currRounds = XYGLogic.Instance.Data.currRounds;
        if(fzUID != localUID) return;
        if(currRounds != 1) return;

        var localPlayer = TDKPlayerMgr.Instance.getPlayer(localUID);
        if(!localPlayer) return;

        var isVisible = TDKPlayerMgr.Instance.mPCount >= 2;
        
        _.forEach(TDKPlayerMgr.Instance.getPlayers() , function (player , uid) {
            if(player.isReady != 1){
                isVisible = false;
            }
        });

        this.btn_startGame.setVisible(isVisible);
        // if(localPlayer.isReady){

        // }

    },

    //over
    onInit: function () { },
    onRelease: function () { },
});