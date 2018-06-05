var TDKStateTable = {};
TDKStateTable[TDK_TABLESTATUS.SEATING] = GameTDKStateWait;
TDKStateTable[TDK_TABLESTATUS.WATING] = GameTDKStateReady;
TDKStateTable[TDK_TABLESTATUS.READY] = GameTDKStateReady;
TDKStateTable[TDK_TABLESTATUS.INITTABLE] = GameTDKStateGameing;
TDKStateTable[TDK_TABLESTATUS.PLAYING] = GameTDKStateGameing;
TDKStateTable[TDK_TABLESTATUS.GAMERESULT] = GameTDKStateOver;



var TDKRoom = cc.Layer.extend({
    ctor: function(data, time) {
        this._super();

        var jsonres = util.LoadUI(TDKJson.RoomView);
        var root = jsonres.node;
        this.addChild(root);
        this.mRoot = root;

        TableComponent.addComponent(root);

        //发牌器
        this.img_fpq = ccui.helper.seekWidgetByName(root, "img_fpq");
        this.panel_player = ccui.helper.seekWidgetByName(root, "panel_desk_player");
        this.panel_infomation = ccui.helper.seekWidgetByName(root, "panel_infomation");

        this.text_room_name = ccui.helper.seekWidgetByName(this.panel_infomation, "text_room_name");
        // this.text_room_id = ccui.helper.seekWidgetByName(this.panel_infomation, "text_room_id");

        this.text_round = ccui.helper.seekWidgetByName(this.panel_infomation, "text_round");
        this.text_remain = ccui.helper.seekWidgetByName(this.panel_infomation, "text_remain");

        this.panel_pourOut = ccui.helper.seekWidgetByName(root, "panel_pourOut");

        this.mFlyCardPanel = ccui.helper.seekWidgetByName(root, "panel_disCard");


        this.mPanel_tips = ccui.helper.seekWidgetByName(root, "panel_tips");
        this.mPanel_tips.setVisible(false);

        this.mPanelTotalChipIn = ccui.helper.seekWidgetByName(root, "panel_cp_pour");
        this.mPanelTotalChipIn.setVisible(false);

        this.mTxtTotalChipIn = ccui.helper.seekWidgetByName(this.mPanelTotalChipIn, "txt_cp_v");

        this.mPanelEffect = ccui.helper.seekWidgetByName(root, "panel_effect");
        this.mImgLGTip = ccui.helper.seekWidgetByName(this.mPanelEffect, "img_lg_tip");
        this.mImgLGTip.setVisible(false);

        this.btn_startGame = ccui.helper.seekWidgetByName(root, "btn_startGame");
        this.btn_startGame.addClickEventListener(this.onBtnStartGame.bind(this));
        this.btn_startGame.setVisible(false);

        this.panel_option_waiting = ccui.helper.seekWidgetByName(root, "panel_option_waiting");
        this.panel_option_waiting.setVisible(false);

        var TDK_SC_DISCP_INP = {
            WM: this.panel_pourOut.width / 2 + 50,
            WN: this.panel_pourOut.width / 2 - 50,
            HM: this.panel_pourOut.height / 2 + 30,
            HN: this.panel_pourOut.height / 2 - 30,
        };

        this._disWC = {
            M: TDK_SC_DISCP_INP.WM,
            N: TDK_SC_DISCP_INP.WN
        };
        this._disHC = {
            M: TDK_SC_DISCP_INP.HM,
            N: TDK_SC_DISCP_INP.HN
        };
        this._mPourZorder = 0;

        this.btn_add = ccui.helper.seekWidgetByName(root, "btn_addRobot");
        if (!cc.sys.isNative) {
            this.btn_add.addClickEventListener(function () {
                TDKPoker.net.addRobot(1, function (data) {
                    JJLog.print('add rebot resp');
                });
            });
        } else {
            this.btn_add.setVisible(false);
        }
    },

    onEnter: function() {
        this._super();
        this.initView();
        this._resetBackground();
        
        TDKSoundMgr.create();
        XYGLogic.initialize(TDKGameLogic);
        PCardBoxMgr.create(this.mFlyCardPanel, cc.p(940, 675));

        this.registerAllEvents();
        XYGLogic.Instance.reqBaseInfo();
        sound.playBgSound();

    },

    initView: function() {
        var root = this.mRoot;

        this.mDeskPlayer = new TDKDeskPlayer();
        this.panel_player.addChild(this.mDeskPlayer);

        var powerStatusBg = ccui.helper.seekWidgetByName(root, "power_BG");
        this.powerStatusImg = ccui.helper.seekWidgetByName(root, "power");
        this.netWorkDelayIcon = ccui.helper.seekWidgetByName(root, "delay");
        this.netWorkDelayMS = ccui.helper.seekWidgetByName(root, "delayMS");
        var enableShow = false;    // todo 是否显示电量和网络信号
        if (enableShow) {
            //   this.initPowerStatus();
            powerStatusBg.setVisible(false);
            this.schedule(this.updatePowerAndNetSatus, 5);
        }
        else {
            powerStatusBg.setVisible(false);
            //    this.powerStatusImg.setVisible(false)
            this.netWorkDelayIcon.setVisible(false);
            this.netWorkDelayMS.setVisible(false);
        }
    },

    _resetBackground:function () {
        var cahceV = parseInt(util.getCacheItem(PokerBackGCCacheKey) || 1 );
        this.img_fpq.loadTexture(Setting_BackCfg[cahceV-1]);
    },

    _baseReadyInfo: function(data) {
        qp.event.listen(this, 'pkSyncTableStatus', this.onChangeStatus.bind(this));

        this.mDeskPlayer.build();

        this.refreshTableInfo();

        TianDaKeng.create(data.tableStatus.config);

        var curStatus = data.tableStatus.tableStatus;
        var time = 0;
        this.setGameState(curStatus, time);
    },

    showPanelWaiting: function() {
        var data = TDKGameLogic.Instance._mTableData;
        switch (data.tableStatus) {
            case TDK_TABLESTATUS.SEATING:
            {
                TDKPoker.table.inGame = false;
                this.panel_option_waiting.setVisible(true);
                //this.btn_invite_wechat.setVisible(true);
                if (hall.songshen == 1) {
                    //this.btn_invite_wechat.setVisible(false);
                }
            }
                break;
            case TDK_TABLESTATUS.WATING:
            {
                TDKPoker.table.inGame = false;
                this.panel_option_waiting.setVisible(false);
                if (data.currRounds == 1) {
                    this.panel_option_waiting.setVisible(true);
                }
            }
                break;
            case TDK_TABLESTATUS.INITTABLE:
            case TDK_TABLESTATUS.PLAYING:
            {
                this.panel_option_waiting.setVisible(false);
                var info = TDKPoker.table.uidOfInfo(hall.user.uid);
                if (info != null && info.isWatch != 1)
                    TDKPoker.table.inGame = true;
                if (info != null && info["isWatch"] == 1 && data.ishavebanker != 1 && data.isGold != 1) {
                    //this.btn_invite_wechat.setVisible(false);
                    this.panel_option_waiting.setVisible(true);
                }
            }
                break;
        }
    },
    onExit: function() {

        this.removeAllEvents();

        TDKPlayerMgr.release();
        TianDaKeng.release();
        PCardBoxMgr.release();
        TDKSoundMgr.release();
        if (this.mCurGameState) {
            this.mCurGameState.destroy();
            this.mCurGameState = null;
        }
        //必须放在最后处理
        XYGLogic.release();
        this._super();
    },

    registerAllEvents: function() {
        qp.event.listen(this, 'mjSyncPlayerOP', this.onUpdatePourOut.bind(this));
        qp.event.listen(this, 'mjPlayerLeave', this.onPlayerExit.bind(this));
        qp.event.listen(this, 'mjGameOver', this.onGameOver.bind(this));

        qp.event.listen(this, 'appGameBaseInfo', this._baseReadyInfo.bind(this));
        qp.event.listen(this, 'appGameBack', this._resetBackground.bind(this));
        // qp.event.listen(this, 'mjThrowStatus', this.onGamethorw.bind(this));
    },

    removeAllEvents: function() {
        qp.event.stop(this, 'pkSyncTableStatus');
        qp.event.stop(this, 'mjSyncPlayerOP');
        qp.event.stop(this, 'mjPlayerLeave');
        qp.event.stop(this, 'mjGameOver');

        qp.event.stop(this, 'appGameBaseInfo');
        qp.event.stop(this, 'appGameBack');
        // qp.event.stop(this, 'mjThrowStatus');
    },

    // onGamethorw: function (data) {
    //     console.error("!!!!!!!!!!!!!!!!!!!!!!!", data)
    //     var throwType = data['throwType'];
    //     if (throwType != 0) {
    //         XYGLogic.Instance.addSpriteFrames("res/Animation/throwThing.plist");
    //         var target = data['targetUid'];
    //         var uid = data['uid'];
    //         var startPos = cc.p(0, 0);
    //         var endPos = cc.p(0, 0);
    //         var off = cc.p(50, 80);
    //
    //         var self = {x: 30, y: 35};
    //         var left = {x: 50, y: 500};
    //         var right = {x: 1150, y: 500};
    //
    //         startPos = this.mDeskPlayer.mSeatUIDPlayers[uid].mDeskHead.getPosition();
    //
    //         endPos = cc.p(this.mDeskPlayer.mSeatUIDPlayers[target].mDeskHead.getPosition().x, this.mDeskPlayer.mSeatUIDPlayers[target].mDeskHead.getPosition().y);
    //         if (THROWTHINGTYPE[throwType] != null && THROWTHINGTYPE[throwType] != undefined) {
    //             var img = new ccui.ImageView(THROWTHINGTYPE[throwType] + "_0.png", ccui.Widget.PLIST_TEXTURE);
    //             img.setPosition(cc.pAdd(off, startPos));
    //             this.panel_infomation.addChild(img, 100);
    //             img.runAction(cc.sequence(cc.moveTo(0.3, cc.pAdd(off, endPos)), cc.callFunc(function () {
    //                 var ani = new cc.Sprite('#' + THROWTHINGTYPE[throwType] + "_1.png");
    //                 ani.setScale(2);
    //                 this.panel_infomation.addChild(ani, 100);
    //                 ani.setPosition(cc.pAdd(off, endPos));
    //                 var animFrames = [];
    //                 for (var j = 0; j < THROWTHINGPNGLEGTH[throwType]; j++) {
    //                     var str = THROWTHINGTYPE[throwType] + "_" + j + ".png";
    //                     var frame = cc.spriteFrameCache.getSpriteFrame(str);
    //                     animFrames.push(frame);
    //                 }
    //                 var bomb = new cc.Animation(animFrames, 0.06);
    //                 sound.playSound("res/audio/effect/" + THROWTHINGTYPE[throwType] + ".mp3", false);
    //                 ani.runAction(cc.sequence(cc.animate(bomb), cc.removeSelf()));
    //             }.bind(this)), cc.removeSelf()));
    //         }
    //     }
    // },

    setGameState: function(status, time) {
        if (!TDKStateTable[status]) {
            JJLog.print("Error current status", status);
            return;
        }

        if (this.mCurGameState) {
            if (TDKStateTable[status].ID === this.mCurGameState.ID) {
                return;
            }
            this.mCurGameState.destroy();
            this.mCurGameState = null;
        }

        var gameState = TDKStateTable[status].create(status);
        Object.getOwnPropertyNames(this).forEach(function(key) {
            if (key.indexOf('_') != 0) {
                gameState[key] = this[key];
            }
        }, this);
        if (time && typeof(time) == "number") {
            time = Math.ceil(time);
        }
        gameState.init(this, time);

        this.mCurGameState = gameState;
    },

    onChangeStatus: function(s) {
        var status = s;
        var time = 3;
        if (typeof(s) == "object") {
            status = s.tableStatus;
            time = s.startTime;
        }
        JJLog.print("gamescene onChangeStatus", status);

        this.setGameState(status, time);

    },

    refreshTableInfo: function() {
        this.text_remain.setString("共" + XYGLogic.Instance.Data.config['roundsTotal'] + "局");
        this.text_round.setString("已开" + XYGLogic.Instance.Data['currRounds'] + "局");
    },

    getPlayerSeatCtrlByChair: function(chair) {
        return this.mDeskPlayer.getPlayerSeatCtrlByChair(chair);
    },

    getPlayerSeatCtrl: function(uid) {
        return this.mDeskPlayer.getPlayerSeatCtrl(uid);
    },

    initPowerStatus: function () {
        // var poswerPercent = util.getBatteryPercent();
        // this.powerStatusImg.setScale(poswerPercent, 1);
        // var red = {r: 255, g: 0, b: 0, a: 255};
        // var green = {r: 0, g: 205, b: 0, a: 255};
        // var yellow = {r: 255, g: 200, b: 0, a: 255};
        // if (poswerPercent > 0.5) {
        //     this.powerStatusImg.setColor(green)
        // } else if (poswerPercent > 0.3) {
        //     this.powerStatusImg.setColor(yellow)
        // }
        // else {
        //     this.powerStatusImg.setColor(red)
        // }
    },

    updateNetWorkDelayInfo: function () {

        var red = {r: 255, g: 0, b: 0, a: 255};
        var green = {r: 0, g: 205, b: 0, a: 255};
        var yellow = {r: 255, g: 200, b: 0, a: 255};
        var delay = hall.delayMS;
        this.netWorkDelayMS.setVisible(true);
        this.netWorkDelayMS.setString(delay + "ms");

        if (delay > 800) {
            this.netWorkDelayMS.setVisible(false);
            this.netWorkDelayIcon.loadTexture("res/GameHall/Resoures/large/gprs_strength_3.png", ccui.Widget.LOCAL_TEXTURE);
        } else if (delay > 500) {
            this.netWorkDelayMS.setTextColor(red);
            this.netWorkDelayIcon.loadTexture("res/GameHall/Resoures/large/gprs_strength_0.png", ccui.Widget.LOCAL_TEXTURE);
        } else if (delay > 200) {
            this.netWorkDelayMS.setTextColor(yellow);
            this.netWorkDelayIcon.loadTexture("res/GameHall/Resoures/large/gprs_strength_1.png", ccui.Widget.LOCAL_TEXTURE);

        } else {
            this.netWorkDelayMS.setTextColor(green);
            this.netWorkDelayIcon.loadTexture("res/GameHall/Resoures/large/gprs_strength_2.png", ccui.Widget.LOCAL_TEXTURE);
        }
    },

    updatePowerSatus: function () {
        this.initPowerStatus();
    },

    updatePowerAndNetSatus: function () {
        this.updateNetWorkDelayInfo()
        //  this.updatePowerSatus();
    },

    onUpdatePourOut: function(data, pourAni) {
        pourAni = pourAni == false ? false : true;
        if (data.uid && data.msg.amount) {
            this._playerChipIn(data, pourAni);
        }

        if (data.msg.tableCoins && data.msg.tableCoins.total)
            this.setTotalPourValue(data.msg.tableCoins.total);
        if (data.msg && data.msg.total)
            this.setTotalPourValue(data.msg.total);
    },

    _playerChipIn: function(data, isAni) {
        isAni = isAni != false ? true : false;
        var pos = cc.p(0, 0);

        var uid = data.uid;

        var playerSeatCtrl = this.getPlayerSeatCtrl(uid);
        if (!playerSeatCtrl) return;

        pos = playerSeatCtrl.getChipInSWPos();

        if (data.msg.amount && isAni) this.showTips("+" + data.msg.amount);

        var splitPours = TDK_POUR_Arr[data.msg.amount] || [];
        for (var i = 0; i < splitPours.length; i++) {
            var amount = splitPours[i];
            this.addPourNode(pos, amount, uid, null, null, isAni);
        }
    },

    /**
     * initPos 请使用世界坐标
     */
    addPourNode: function(initWdPos, cm, inUID, maxDt, minDt, isAni) {
        var pourSpt = null;
        var tempParent = this.panel_pourOut;

        pourSpt = new TDKSmallPourSpt(cm, inUID);
        isAni = isAni != false ? true : false;
        var moveToPos = cc.p(
            Math.random() * (this._disWC.M - this._disWC.N + 1) + this._disWC.N,
            Math.random() * (this._disHC.M - this._disHC.N + 1) + this._disHC.N
        );
        tempParent.addChild(pourSpt);

        if (!isAni) {
            pourSpt.setPosition(moveToPos);
        } else {
            var nodePos = tempParent.convertToNodeSpace(initWdPos);
            pourSpt.setPosition(nodePos);

            maxDt = maxDt || (maxDt || 0.1);
            minDt = (minDt || 0.05);

            var dT = Math.random() * (maxDt - minDt) + minDt;

            var actions = [];
            actions.push(cc.hide());
            actions.push(cc.show());
            actions.push(cc.callFunc(function() {
                sound.playChipIn();
            }.bind(this)));

            actions.push(cc.moveTo(0.3, moveToPos));
            pourSpt.runAction(
                cc.sequence(
                    actions
                )
            );
        }

        this._disWC.M = Math.min(this._disWC.M + 25, tempParent.width - 40);
        this._disWC.N = Math.max(this._disWC.N - 25, 40);
        this._disHC.M = Math.min(this._disHC.M + 25, tempParent.height - 40);
        this._disHC.N = Math.max(this._disHC.N - 25, 40);
    },

    rePourForWinner: function(winnerUid) {

        var playerSeatCtrl = this.getPlayerSeatCtrl(winnerUid);
        if (!playerSeatCtrl) return;

        var tempParent = this.panel_pourOut;

        var allPours = tempParent.getChildren();
        var length = allPours.length;
        var pos = playerSeatCtrl.getChipInSWPos();
        var moveToPos = tempParent.convertToNodeSpace(pos);
        sound.playRewardPour();


       
        for (var i = 0; i < length; i++) {
            var pourSpt = allPours[i];
            var actions = [];
            
            var minDf = Math.ceil(i/2);
            minDf = Math.min(minDf , 10);
            actions.push(cc.delayTime(0.03 * minDf));
            actions.push(cc.callFunc(function() {
                //  sound.playChipIn();
            }.bind(this)));

            actions.push(cc.moveTo(0.3, moveToPos));
            actions.push(cc.removeSelf());
            pourSpt.runAction(
                cc.sequence(
                    actions
                )
            );
        }

    },

    showTips: function(msg) {
        if (!msg) return;
        var tPanelTips = this.mPanel_tips.clone();
        this.mPanel_tips.parent.addChild(tPanelTips);

        var txtMsgTip = ccui.helper.seekWidgetByName(tPanelTips, "txt_tips");
        // this.mPanel_tips.stopAllActions();
        txtMsgTip.string = msg;
        var initPos = tPanelTips.getPosition();
        tPanelTips.y = initPos.y - 100;

        tPanelTips.runAction(
            cc.sequence(
                cc.fadeIn(0.02),
                cc.show(),
                cc.moveTo(0.5, initPos),
                cc.delayTime(0.5),
                cc.fadeOut(0.5),
                cc.removeSelf()
            )
        );
    },

    showPrLGAni: function() {
        var actions = [];
        this.mImgLGTip.setScale(0);
        this.mImgLGTip.setVisible(true);
        actions.push(
            cc.scaleTo(0.5, 1)
        );


        this.mImgLGTip.runAction(
            cc.sequence(
                actions
            )
        );
    },

    setTotalPourValue: function(pourV) {
        if (!pourV) return;
        this.mPanelTotalChipIn.setVisible(true);
        this.mTxtTotalChipIn.string = pourV;
    },

    cleanAllPurs: function() {
        this.panel_pourOut.removeAllChildren();
    },
    onBtnStartGame: function() {
        XYGLogic.Instance.lessPersonStart(
            function(data) {
                if (data.code == 200) {

                } else {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data['err']);
                    dialog.showDialog();
                }
            }.bind(this)
        );
    },

    onPlayerExit: function(data) {
        if (hall.user.uid == data.uid) {

            TDKPoker.net.imRoomId = -1;
            if (cc.sys.isNative) {
                GameLink.onUserLeaveRoom();
            }

            this.stopAllActions();
            this.removeAllEvents();
            var majHall = new MajhongHall();
            majHall.showHall();


        }
    },
    onGameOver: function() {
        //结束掉所有的监听事件   防止出现显示幺蛾子
        this.removeAllEvents();
        TDKPoker.net.imRoomId = -1;
        if (cc.sys.isNative) {
            GameLink.onUserLeaveRoom();
        }
    },

    reset: function() {
        this.mPanelTotalChipIn.setVisible(false);
        this.mImgLGTip.setVisible(false);
    },

});