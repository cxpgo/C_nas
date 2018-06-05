var TDKGameLogic = function () {
    var logic = GameLogicBase.extend({
        ctor: function () {
            this._super(TDK_TABLESTATUS);
        },
        registerAllEvents: function () {
            this._super();
        },

        removeAllEvents: function () {
            this._super();
        },

        initSeatInfo: function (data) {
            this.SeatPlayerInfo = {};
            var playerDataArray = data["tableStatus"]["players"];
            this.config = data["tableStatus"]['config'];

            for (var i = 0; i < playerDataArray.length; i++) {
                var info = playerDataArray[i]["player"];
                TDKPlayerMgr.Instance.add(playerDataArray[i]);
            }

           this._super(data);
        },

        // 玩家退出游戏
        onPlayerExit: function (data) {
            qp.event.send('appPlayerLeave', data.uid);
            TDKPlayerMgr.Instance.removePlayer(data.uid);
        },


        onPlayerEnter: function (data) {
            TDKPlayerMgr.Instance.add({
                uid: data.user.uid,
                player: data.user
            });
            XYGLogic.Instance.setSeatPosInfo(data.user);
            qp.event.send('appPlayerEnter', data.user.uid);
        },

        onGameResult: function (data) {
            this._super(data);
            //刷新桌子数据
            this._mTableData.currRounds = data.currRounds || this._mTableData.currRounds++;

        },
        updatePlayerOp: function (optType, amuout, cOpType, cb) {
            TDKPoker.net.updatePlayerOp(
                optType,
                amuout,
                cOpType,
                function (resp) {
                    if (resp.code == 200) {

                    }
                    if (cb) cb(resp);
                }.bind(this)
            );
        },
        
        onTableStatus: function (jtable) {
            this._super(jtable)
            var status = jtable.tableStatus;
            if (status == TDK_TABLESTATUS.READY) {
                this.ResultData = null;
            }
        },
        getTableDes:function () {
            var config = this.config;
            var desc = config.person + "人场,";
            if (config.showCard == 1)
                desc += "亮底,";
            else
                desc += "不亮底,";
            if (config.king == 1)
                desc += "带王,";
            else
                desc += "不带王,";
            if (config.kingBomb == 1)
                desc += "带王中炮,";
            else
                desc += "不带王中炮,";
            if (config.tMode == 1)
                desc += "把踢,";
            else
                desc += "末踢,";
            if (config.gzBomb == 1)
                desc += "共张随豹,";
            else
                desc += "共张随点,";
            if (config.aaGem == 0)
                desc += "房主付费,";
            else if (config.aaGem == 1)
                desc += "平摊付费,";
            else if (config.aaGem == 2)
                desc += "大赢家付费,";
            if (config.isSameIp == 1) desc += "防作弊,"
            if (config.languo == 1)  desc += "烂锅翻倍,";
            if (config.jinyan == 1)  desc += "是否禁言,";
            if (config.lastT == 1)  desc += "末脚踢服,";
            if (config.ABig == 1)  desc += "抓A必炮,";
            if (config.auto == 1)  desc += "超时托管,";
            if (config.difen == 1)  desc += "底分,";
            desc +=  config.xifen + "喜分,";
            desc += config.rounds + "局";
            return desc;
        },


		showEndResult: function () {
			var endReport = new TDKEndResult();
			endReport.showGameResult();
        },

        CardsSelectorHelp:function () {
            var UICardsSelector = new TDKCardsSelectorHelp();
            UICardsSelector.showHelp();
        },

        getSeatHeadStartPos:function (uid) {
            var startPos = this.SeatPlayerInfo[uid];
            return startPos;
        },

        getSeatHeadEndPos:function (targetUid) {
            var endPos = cc.p(this.SeatPlayerInfo[targetUid].x, this.SeatPlayerInfo[targetUid].y);
            return endPos;
        },

        getGameLogo:function () {
            if(false)
                return BSGame_Logo.BSLogo;
            return false;
        },

        getGameType:function () {
            return true;
        },

        IsChangeGameBg:function () {
            return false;
        },

    });

    /**
     * 创建
     * 释放
     * 实例访问
     */
    var instance = null;
    var create = function () {
        if (!instance) {
            instance = new logic();
        }
        return instance;
    };

    var release = function () {
        if (instance) {
            instance.release();
            instance = null;
        }
    };

    /**
     * 导出接口
     * 每个单例对象都要到处三个接口
     * 一个create、一个release、一个Instance
     */
    var reLogic = {
        create: create,
        release: release
    };

    Object.defineProperty(reLogic, "Instance", {
        get: function () {
            create();
            return instance;
        }
    });

    return reLogic;
}();


