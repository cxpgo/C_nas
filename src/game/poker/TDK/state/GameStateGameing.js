var GameTDKStateGameing = function () {
    var State = GameTDKBaseState.extend({
        ctor: function (status) {
            this._super(status);
        },
        onInit: function () {
            this._super();
            qp.event.listen(this, 'mjSyncPlayerMocards', this.onSyncPlayerMocards.bind(this));
            qp.event.listen(this, 'mjSyncPlayerOP', this.onSyncPlayerOP.bind(this));
            qp.event.listen(this, 'pkGameStart', this.onGameStart.bind(this));
            qp.event.listen(this, 'mjNotifyPlayerOP', this.onNotifyPlayerOP.bind(this));

            //仅仅当前用户可接受到消息
            qp.event.listen(this, 'mjSendHandCards', this.onSendHandCards.bind(this));
            this.btn_add.setVisible(false);

            for (var chair = 0; chair < TDK_TABLE_TOTAL_PN; chair++) {
                var cpSCtrl = this.mDelegate.getPlayerSeatCtrlByChair(chair);
                if(cpSCtrl){
                    cpSCtrl.setReadyStatus(false);
                }
            }
            if(XYGLogic.Instance.Data.isOffline){
                //先重置下注状态 -》 重置炒作状态
                this.reBuildChipInState();
                this.reBuildPlayerOp();
            }
            qp.event.send('appGameRoomInfo', {});
            this.mDelegate.showPanelWaiting();
        },

        onRelease: function () {
            this._super();
            qp.event.stop(this, 'mjSyncPlayerMocards');
            qp.event.stop(this, 'mjSyncPlayerOP');
            qp.event.stop(this, 'pkGameStart');

            qp.event.stop(this, 'mjSendHandCards');
            qp.event.stop(this, 'mjNotifyPlayerOP');
        },

        onGameStart: function (data) {
            var tableCoins = data.tableCoins.coin || {};
            var playerCoin = data.players || {};
            for (var uid in tableCoins) {
                var coins = tableCoins[uid];
                this.pcUserChinCoin(uid , coins);
                var cpSCtrl = this.mDelegate.getPlayerSeatCtrl(uid);
                if (cpSCtrl && playerCoin[uid] != undefined) {
                    //拼装数据
                    var sData = {
                        uid : uid,
                        msg : {
                            coinNum:playerCoin[uid],
                            tableCoins: data.tableCoins
                        }
                    };
                    cpSCtrl.synPlayerOp(sData);
                }
            }
            this.mDelegate.onUpdatePourOut({msg : data});
        },

        onSendHandCards: function (data) {
            JJLog.print("onSendHandCards:", JSON.stringify(data));
            //其他座位上的玩家 , 模拟一下 将牌发下去
            for (var chair = 1; chair < TDK_TABLE_TOTAL_PN; chair++) {
                var cpSCtrl = this.mDelegate.getPlayerSeatCtrlByChair(chair);
                if (cpSCtrl) {
                    var nPaiQis = [];
                    nPaiQis.length = 2;
                    cpSCtrl.addPaiQiCard(nPaiQis);
                }
            }

            //当前用户玩家
            var uid = hall.user.uid;
            var playSeatCtrl = this.mDelegate.getPlayerSeatCtrl(uid);
            if (!playSeatCtrl) return;

            var paiQis = data;
            if (paiQis) {
                playSeatCtrl.addPaiQiCard(paiQis);
            }
        },

        onNotifyPlayerOP: function (data) {
            JJLog.print("onNotifyPlayerOP", JSON.stringify(data));
            var uid = data.uid;
            //设置操作指示器
            for (var chair = 0; chair < TDK_TABLE_TOTAL_PN; chair++) {
                var cpSCtrl = this.mDelegate.getPlayerSeatCtrlByChair(chair);
                if(cpSCtrl){
                    cpSCtrl.setOptCurShowLight( cpSCtrl.uid == uid );
                }
            }
            
            var playSeatCtrl = this.mDelegate.getPlayerSeatCtrl(uid);
            if (!playSeatCtrl) return;

            //冲锋A
            if(data.opTypes && data.opTypes.length == 1){
                playSeatCtrl.showAPaoEffect();
            }

            if(uid != hall.user.uid) return;

            var nOptTypes = [];
            var nCustomData = {};
            for (var index = 0; index < data.opTypes.length; index++) {
                var oT = data.opTypes[index];
                if (oT == TIANDAKENGTYPE.CALL) {
                    if (data.amount != 0) {
                        oT = TDK_COP_TYPE.GZ;
                    }
                    nCustomData[TIANDAKENGTYPE.CALL] = data.amount;
                }
                if (data.first !== hall.user.uid) {
                    if (oT == TIANDAKENGTYPE.TI) {
                        oT = TDK_COP_TYPE.FT;
                    }
                }else if (data.tCount >= 1) {
                    if (oT == TIANDAKENGTYPE.TI) {
                        oT = TDK_COP_TYPE.FT;
                    }
                }
                
                nOptTypes.push(oT);
            };


            playSeatCtrl.BuildShowOpt(nOptTypes, nCustomData);
            playSeatCtrl.setOptCurShowLight(true);

            
        },

        onSyncPlayerMocards: function (data) {
            JJLog.print("onSyncPlayerMocards:", JSON.stringify(data));

            var uid = data.uid;
            var playSeatCtrl = this.mDelegate.getPlayerSeatCtrl(uid);
            if (playSeatCtrl) {
                var paiQi = data.poker;
                playSeatCtrl.addMoCard(paiQi);
            }

        },

        onSyncPlayerOP: function (data) {
            JJLog.print("DeskSeat onSyncPlayerOP" + JSON.stringify(data));

            //设置操作状态取消
            for (var chair = 0; chair < TDK_TABLE_TOTAL_PN; chair++) {
                var cpSCtrl = this.mDelegate.getPlayerSeatCtrlByChair(chair);
                if(cpSCtrl){
                    cpSCtrl.hideOptTips( );
                }
            }
            
            this._pPlayerOp(data);
            this._pNextPlayerOp(data);
        },

        _pPlayerOp: function (data) {
            var uid = data.uid;
            if(!uid) return;
            var playSeatCtrl = this.mDelegate.getPlayerSeatCtrl(uid);
            if (playSeatCtrl) {
                playSeatCtrl.synPlayerOp(data);
            }
        },

        _pNextPlayerOp: function (data) {
            var uid = data.msg.nextUid;
            if(!uid) return;
            var playSeatCtrl = this.mDelegate.getPlayerSeatCtrl(uid);
            if (playSeatCtrl) {
                playSeatCtrl.setOptCurShowLight(true);
            }
        },
        
    });
    var ins = {
        ID: "GAMEING",
        create: function (status) {
            var s = new State(status);
            s.ID = this.ID;
            return s;
        },
    };
    return ins;
}();
