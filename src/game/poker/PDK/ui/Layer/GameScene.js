/**
 * Created by atom on 2016/7/25.
 */
var gameSceneId = 0;

var PDKGameScene = cc.Layer.extend({
    _id: 0,
    panel_head: null,          // 头像坐位相关
    seatHeads: [],
    seat_left: null,
    seat_right: null,
    seat_self: null,

    // panel_status: null,
    text_round: null,

    panel_player: null,

    panel_ready: null,
    btn_ready: null,
    imgReadyArray: null,

    panel_desk: null,

    btn_add: null,

    panel_option_waiting: null,
    btn_invite_wechat: null,
    btn_back_hall: null,

    panel_option_playing: null,
    btn_setting: null,
    btn_msg: null,

    panel_infomation: null,
    text_room_id: null,
    text_time: null,
    btn_speak: null,
    text_room_name: null,
    text_msg: null,

    //
    direRotation: 0,
    rotateTime: 0,
    deskArray: null,
    idArray: null,
    bankerDesk: null,
    selfDesk: null,
    rightDesk: null,
    leftDesk: null,
    imgReadyArray: [],
    imgClockArray: [],
    chuPaiList: {},
    speakTip: null,
    totalIndex: 0,
    nowIndex: 0,
    _Listeners: [],
    resultData: null,
    autoSendRecord: false,
    intervalTouchSpeak: 0,
    beginSpeak: false,
    talkRecordTime: 0,
    gameMode: GameMode.PLAY,
    turnUid: 0,//谁出牌
    opAni: null,
    panel_rule: null,

    ctor: function () {
        this._super();
        var root = util.LoadUI(PDKPokerJson.PDKRoom).node;
        this.addChild(root);
        TableComponent.addComponent(root);

        var _this = this;
        gameSceneId++;
        this._id = gameSceneId;
        //
        // this.panel_head = ccui.helper.seekWidgetByName(root, "panel_head");
        // this.seat_left = ccui.helper.seekWidgetByName(this.panel_head, "seat_left");
        // this.seat_right = ccui.helper.seekWidgetByName(this.panel_head, "seat_right");
        // this.seat_self = ccui.helper.seekWidgetByName(this.panel_head, "seat_self");
        // this.seatHeads[0] = this.seat_self;
        // this.seatHeads[1] = this.seat_right;
        // this.seatHeads[2] = this.seat_left;
        //
        // for (var i = 0; i < this.seatHeads.length; i++) {
        //     var clock = ccui.helper.seekWidgetByName(this.panel_head, "image" + i);
        //     var time = ccui.helper.seekWidgetByName(clock, "text_time");
        //     this.imgClockArray[i] = clock;
        //     this.imgClockArray[i].text_clock = time;
        // }

        // this.panel_status = ccui.helper.seekWidgetByName(root, "panel_status");

        this.setTurnLightOff();
        // this.panel_status.setVisible(false);

        this.panel_player = ccui.helper.seekWidgetByName(root, "panel_player");

        this.panel_ready = ccui.helper.seekWidgetByName(root, "panel_ready");
        this.btn_ready = ccui.helper.seekWidgetByName(this.panel_ready, "btn_ready");
        this.imgReadyArray[0] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_self");
        this.imgReadyArray[1] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_right");
        this.imgReadyArray[2] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_left");
        this.btn_ready.addClickEventListener(function (data) {
            sound.playBtnSound();
            XYGLogic.Instance.ready(function (data) {
                _this.btn_ready.setVisible(false);
            });
        });
        this.panel_ready.setVisible(false);

        this.panel_desk = ccui.helper.seekWidgetByName(root, "panel_desk");

        this.panel_option_waiting = ccui.helper.seekWidgetByName(root, "panel_option_waiting");
        this.btn_invite_wechat = ccui.helper.seekWidgetByName(this.panel_option_waiting, "btn_invite_wechat");

        //btn_dissolve
        this.btn_invite_wechat.addClickEventListener(this.onInviteWeChat);
        this.panel_option_waiting.setVisible(false);


        this.panel_option_playing = ccui.helper.seekWidgetByName(root, "panel_option_playing");

        this.panel_option_playing.setVisible(false);

        var btn_last = ccui.helper.seekWidgetByName(this.panel_option_playing, "btn_last");
        btn_last.addClickEventListener(function () {
            var panel = new CheckLastCards(this.chuPaiList);
            panel.showPanel();
        }.bind(this));

        this.panel_infomation = ccui.helper.seekWidgetByName(root, "panel_infomation");

        this.text_room_name = ccui.helper.seekWidgetByName(this.panel_infomation, "text_room_name");

        this.text_msg = ccui.helper.seekWidgetByName(this.panel_infomation, "text_msg");
        this.text_msg.setVisible(false);

        this.text_round = ccui.helper.seekWidgetByName(this.panel_infomation, "text_round");

        this.deskArray = new Array();
        this.idArray = new Array();
        this.btn_add = ccui.helper.seekWidgetByName(root, "btn_add");
        if (!cc.sys.isNative) {
            this.btn_add.addClickEventListener(function () {
                sound.playBtnSound();
                PDKPoker.net.addRobot(1, function (data) {
                    JJLog.print('add rebot resp');
                });
            });
        } else {
            this.btn_add.setVisible(false);
        }

        this.opAni = new pokerAnimation();
        this.opAni.x = 440;
        this.opAni.y = 340;
        this.panel_option_playing.addChild(this.opAni);

        this.panel_rule = ccui.helper.seekWidgetByName(root, "panel_pdk_rule");

        this.mGameDesk = new PDKGameDesk();
        this.panel_desk.addChild(this.mGameDesk);

        sound.playBgSound(0);
    },


    startRecordSpeaker: function () {
        this.schedule(this.recordTime, 1);
    },

    stopRecordSpeaker: function () {
        this.unschedule(this.recordTime);
    },

    resetRecordTime: function () {
        this.talkRecordTime = 0;
        this.beginSpeak = false;
        this.stopRecordSpeaker();
        JJLog.print('resetRecordTime ======' + this.speakTip != null);
        if (this.speakTip || !!this.speakTip || this.speakTip != null) {
            this.speakTip.dismiss();
            this.speakTip = null;
        }
    },

    recordTime: function (dt) {
        this.talkRecordTime++;
        if (this.talkRecordTime > 10) {
            this.autoSendRecord = true;
            this.resetRecordTime();
            PDKPoker.net.send();
        }
    },

    //微信邀请
    onInviteWeChat: function () {
        sound.playBtnSound();
        JJLog.print('click invite wechat');
        var desc = XYGLogic.Instance.getTableDes();
        hall.wxEnterRoom = XYGLogic.Instance.tableId;
        hall.net.wxShareURL('跑得快,房号:' + XYGLogic.Instance.tableId, desc, 0);
    },

    resetImageReady: function () {
        for (var i = 0; i < this.imgReadyArray.length; i++) {
            this.imgReadyArray[i].setVisible(false);
        }
    },

    setTurnLightOff: function () {
        for (var i = 0; i < this.imgClockArray.length; i++) {
            if (!!this.imgClockArray[i])
                this.imgClockArray[i].setVisible(false);
        }
    },

    speaking: function () {

    },

    onEnter: function () {
        DDZSound.create();
        JJLog.print('gamescene enter' + this._id);
        this._super();
        if (hall.songshen != 1) {
            var notice = new MajhongNotice(true);
            notice.setVisible(false);
            this.addChild(notice, 100);
        }
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.registerAllEvents();
            this.initTable();
            this.registerCustomEvt();
            hall.wxEnterRoom = 0;
        }
    },

    onExit: function () {
        JJLog.print('gamescene exit' + this._id);
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.removeAllEvents();
            XYGLogic.release();
            this.removeCustomEvt();
        }
        XYGLogic.record = null;
        DDZSound.release();
        this._super();
    },

    checkMsg: function (data) {
        if (data["code"] == NetErr.OK) {
            return true;
        }
        return false;
    },

    readyStatus: function () {
        var _this = this;
        XYGLogic.Instance.ready(function (data) {
            _this.btn_ready.setVisible(false);
        });
    },

    initTable: function () {
        var _this = this;
        this.btn_ready.setVisible(false);
        XYGLogic.Instance.reqBaseInfo();
    },

    _baseReadyInfo: function (data) {
        JJLog.print("init table response");
        JJLog.print(JSON.stringify(data));
        var _this = this;
        if (_this.checkMsg(data)) {
            XYGLogic.Instance.currentRound = data['tableStatus']['currRounds'];
            _this.showTableInfo(data['tableStatus']);
            _this.checkGameStatus(data);
            var infoPlayers = data['tableStatus']['players'];
            for (var i = 0; i < infoPlayers.length; i++) {
                var ready = infoPlayers[i]['isReady'];
                var uid = infoPlayers[i]['uid'];
                if (uid == hall.user.uid) {
                    if (ready == 0) {
                        XYGLogic.Instance.ready(function (data) {
                        });
                    }
                    break;
                }
            }
        }
        if (data) {
            _this.mGameDesk.onPlayerEnter(data);
            _this.showPanelPlayer(data['tableStatus']);
        }
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'mjReadyStatus', this.onReadyStatus.bind(this));
        qp.event.listen(this, 'mjReadyStart', this.onReadyStart.bind(this));
        qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
        qp.event.listen(this, 'mjPlayerEnter', this.onPlayerEnter.bind(this));
        qp.event.listen(this, 'mjTableStatus', this.onTableStatus);
        qp.event.listen(this, 'mjGameResult', this.onGameResult);
        // qp.event.listen(this, 'mjNotifyDelCards', this.onNotifyDelCards.bind(this));
        qp.event.listen(this, 'mjSyncDelCards', this.onSyncDelCards.bind(this));
        // qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
        qp.event.listen(this, 'mjChatStatus', this.onReciveChat);
        // qp.event.listen(this, 'mjGameOver', this.onGameOver);
        qp.event.listen(this, 'mjPlayerLeave', this.onPlayerLeave);
        // qp.event.listen(this, 'mjThrowStatus', this.onGamethorw.bind(this));

        qp.event.listen(this, 'appGameBaseInfo', this._baseReadyInfo.bind(this));
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'mjReadyStatus');
        qp.event.stop(this, 'mjReadyStart');
        qp.event.stop(this, 'mjGameStart');
        qp.event.stop(this, 'mjPlayerEnter');
        qp.event.stop(this, 'mjTableStatus');
        qp.event.stop(this, 'mjGameResult');
        qp.event.stop(this, 'mjNotifyDelCards');
        qp.event.stop(this, 'mjSyncDelCards');
        // qp.event.stop(this, 'mjDissolutionTable');
        qp.event.stop(this, 'mjChatStatus');
        // qp.event.stop(this, 'mjGameOver');
        qp.event.stop(this, 'mjPlayerLeave');
        // qp.event.stop(this, 'mjThrowStatus');

        qp.event.stop(this, 'appGameBaseInfo');
    },

    // onGamethorw: function (data) {
    //     console.error("!!!!!!!!!!!!!!!!!!!!!!!", data)
    //
    //     var throwType = data['throwType'];
    //     if (throwType != 0) {
    //         XYGLogic.Instance.addSpriteFrames("res/Animation/throwThing.plist");
    //         var target = data['targetUid'];
    //         var uid = data['uid'];
    //         var startPos = cc.p(0, 0);
    //         var endPos = cc.p(0, 0);
    //         var off = cc.p(50, 80);
    //
    //         var self = { x: 30, y: 35 };
    //         var left = { x: 50, y: 500 };
    //         var right = { x: 1150, y: 500 };
    //
    //         var index = XYGLogic.Instance.uidofPos(uid);
    //         var end_index = XYGLogic.Instance.uidofPos(target);
    //         startPos = this.seatHeads[index].getPosition();
    //         endPos = cc.p(this.seatHeads[end_index].getPosition().x, this.seatHeads[end_index].getPosition().y);
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

    showTableInfo: function (data) {
        JJLog.print("桌子=" + JSON.stringify(data));
        XYGLogic.Instance.tableId = data['tableId'];
        // this.text_room_id.setString(data['tableId']);
        XYGLogic.Instance.status = data['tableStatus'];
        this.idArray = data['chairArr'];
        // this.initInvite(data);
        this.setDirectionIndicator();
        this.showPanelReady(data);
        // this.showPanelHead(data);
        this.showPanelInfomation(data);
        this.showPanelPlaying(data);
        this.showPanelStatus(data);
        this.showPanelWaiting(data);
    },


    showPanelWaiting: function (data) {

        switch (XYGLogic.Instance.status) {
            case GameStatus.SEATING: {
                this.panel_option_waiting.setVisible(true);
                this.btn_invite_wechat.setVisible(true);
                if (hall.songshen == 1) {
                    this.btn_invite_wechat.setVisible(false);
                }
            }
                break;
            case GameStatus.WATING: {
                this.panel_option_waiting.setVisible(false);
                if (XYGLogic.Instance.currentRound == 1) {
                    this.panel_option_waiting.setVisible(true);
                }
            }
                break;
            case GameStatus.PLAYING: {
                this.panel_option_waiting.setVisible(false);
            }
                break;
        }
    },

    showPanelPlaying: function (data) {

        switch (XYGLogic.Instance.status) {
            case GameStatus.SEATING: {
                this.panel_option_playing.setVisible(false);
            }
                break;
            case GameStatus.WATING: {
                this.panel_option_playing.setVisible(true);
                // this.btn_setting.setVisible(false);
                // this.btn_msg.setVisible(false);
            }
                break;
            case GameStatus.PLAYING: {
                this.panel_option_playing.setVisible(true);
                // this.btn_setting.setVisible(true);
                // this.btn_msg.setVisible(true);
            }
                break;
        }
    },

    showPanelInfomation: function (data) {
        this.panel_infomation.setVisible(true);
        // this.btn_speak.setVisible(true);

        // this.text_room_id.setString(data['tableId']);
        var str = XYGLogic.Instance.getTableDes();
        // this.text_msg.setString(str);

        JJLog.print("!!!!!!!!", data);

        var rounds = parseInt(data['roundsTotal']);
        var person = parseInt(data['person']);
        var firstMode = parseInt(data['firstMode']);
        var mustContain = parseInt(data['mustContain']);
        var aaGem = parseInt(data['aaGem']);
        var showNum = parseInt(data['showNum']);
        var mode = parseInt(data['mode']);
        var bombScore = parseInt(data['bombScore']);

        var round_value = [10, 20, 30];
        // var cost = {"4": 24, "6": 36, "8": 45}
        for (var i = 0; i < 3; i++) {
            var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_" + i);
            checkbox.setTouchEnabled(false);
            var _labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            // panel._labelNum.setString(round_value[i]+"局(钻石X"+cost[round_value[i]]+")")
            var saveOp = 10;
            if (rounds == 10 || rounds == 20 || rounds == 30) {
                saveOp = rounds;
            }
            var bl = saveOp == round_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                _labelNum.setTextColor(CommonParam.selectColor);
        }

        var person_value = [3, 2];
        for (var i = 0; i < 2; i++) {
            var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_person" + i);
            var _labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = 3;
            if (person == 3 || person == 2) {
                saveOp = person;
            }
            var bl = saveOp == person_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                _labelNum.setTextColor(CommonParam.selectColor);
        }

        var mode_value = [16, 15];
        for (var i = 0; i < 2; i++) {
            var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_shoupai_" + i);
            var _labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = 1;
            if (mode == 16 || mode == 15) {
                saveOp = mode;
            }
            var bl = saveOp == mode_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                _labelNum.setTextColor(CommonParam.selectColor);
        }

        var fufei_value = [0, 1, 2];
        for (var i = 0; i < 3; i++) {
            var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_fufei" + i);
            var _labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            saveOp = 0;
            if (aaGem == 0 || aaGem == 1 || aaGem == 2) {
                saveOp = aaGem;
            }
            var bl = saveOp == fufei_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                _labelNum.setTextColor(CommonParam.selectColor);
        }

        var showNum_value = [1, 0];
        for (var i = 0; i < 2; i++) {
            var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_shengyu_" + i);
            var _labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = 1;
            if (showNum == 1 || showNum == 0) {
                saveOp = showNum;
            }
            var bl = saveOp == showNum_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                _labelNum.setTextColor(CommonParam.selectColor);
        }

        var firstMode_value = [1, 0];
        for (var i = 0; i < 2; i++) {
            var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_wanfa_" + i);
            var _labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = 1;
            if (firstMode == 1 || firstMode == '0') {
                saveOp = firstMode;
            }
            var bl = saveOp == firstMode_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                _labelNum.setTextColor(CommonParam.selectColor);
        }
        var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_wanfa_2");
        var _labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
        var saveOp = 0;
        if (mustContain == 1 || mustContain == 0) {
            saveOp = mustContain;
        }
        var bl = saveOp == 1;
        checkbox.setSelected(bl);
        if (checkbox.isSelected())
            _labelNum.setTextColor(CommonParam.selectColor);

        var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_boom");
        var saveOp = 0;
        if (bombScore == 1 || bombScore == 0) {
            saveOp = bombScore;
        }
        var bl = saveOp == 1;
        checkbox.setSelected(bl);
    },

    showPanelStatus: function (data) {
        switch (XYGLogic.Instance.status) {
            case GameStatus.SEATING: {
                // this.panel_status.setVisible(true);
                this.text_round.setString(XYGLogic.Instance.currentRound + '/' + XYGLogic.Instance.roundTotal);
            }
                break;
            case GameStatus.WATING: {
                // this.panel_status.setVisible(true);
                this.text_round.setString(XYGLogic.Instance.currentRound + '/' + XYGLogic.Instance.roundTotal);
            }
                break;
            case GameStatus.PLAYING: {
                // this.panel_status.setVisible(true);
                this.text_round.setString(XYGLogic.Instance.currentRound + '/' + XYGLogic.Instance.roundTotal);
            }
                break;
        }
    },

    showPanelReady: function (data) {
        switch (XYGLogic.Instance.status) {
            case GameStatus.SEATING: {
                this.panel_ready.setVisible(true);
                this.btn_ready.setVisible(false);
                this.resetImageReady();
            }
                break;
            case GameStatus.WATING: {
                this.panel_ready.setVisible(true);
                this.btn_ready.setVisible(false);
                this.resetImageReady();

            }
                break;
            case GameStatus.PLAYING: {
                this.panel_ready.setVisible(false);
                this.btn_ready.setVisible(true);
                this.resetImageReady();

                //---------quanzhou-----------
            }
                break;
        }
    },

    showPanelHead: function (data) {
        this.panel_head.setVisible(true);
    },

    showPanelPlayer: function (data) {
        // this.addSelfDesk();
        // this.addRightDesk();
        // if (XYGLogic.Instance.person == 3) {
        //     this.addLeftDesk();
        // }
        if (XYGLogic.Instance.status == GameStatus.WATING || XYGLogic.Instance.status == GameStatus.SEATING) {
            var infoPlayers = data['players'];
            for (var i = 0; i < infoPlayers.length; i++) {
                var ready = infoPlayers[i]['isReady'];
                var uid = infoPlayers[i]['uid'];

                // for (var j = 0; j < this.deskArray.length; j++) {
                //     if (this.deskArray[j] && uid == this.deskArray[j].uid) {
                //         if (ready == 1) {
                //             this.imgReadyArray[j].setVisible(true);
                //         } else {
                //             this.imgReadyArray[j].setVisible(false);
                //             if (hall.user.uid == uid) {
                //                 this.imgReadyArray[j].setVisible(true);
                //                 //this.btn_ready.setVisible(true);
                //             }
                //         }
                //         break;
                //     }
                // }
                var playerSeatAll = this.mGameDesk.playerSeatAll;
                for (var key in playerSeatAll) {
                    if (playerSeatAll.hasOwnProperty(key)) {
                        if (key == uid) {
                            var j = XYGLogic.Instance.uidofPos(key);
                            if (ready == 1) {
                                this.imgReadyArray[j].setVisible(true);
                            } else {
                                this.imgReadyArray[j].setVisible(false);
                                if (hall.user.uid == uid) {
                                    this.imgReadyArray[j].setVisible(true);
                                    //this.btn_ready.setVisible(true);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }

    },

    addSelfDesk: function () {
        this.deskArray[0] = new PDKDeskHead(XYGLogic.Instance.selfSeatInfo());
        this.seat_self.addChild(this.deskArray[0], 1, 1);
        XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.selfSeatInfo().uid] = this.deskArray[0];
        var frame = ccui.helper.seekWidgetByName(this.seat_self, "image_frame");
        frame.setVisible(false);
    },

    addRightDesk: function () {
        var info = XYGLogic.Instance.rightSeatInfo();
        if (info != null) {
            JJLog.print('add right' + this._id);
            this.seat_right.removeChildByTag(1, true);
            this.deskArray[1] = new PDKDeskHead(info);
            this.seat_right.addChild(this.deskArray[1], 1, 1);
            XYGLogic.Instance.SeatPlayerInfo[info.uid] = this.deskArray[1];

            var frame = ccui.helper.seekWidgetByName(this.seat_right, "image_frame");
            frame.setVisible(false);
        }
    },

    addLeftDesk: function () {
        var info = XYGLogic.Instance.leftSeatInfo();
        if (info != null) {
            this.leftDesk = null;
            this.seat_left.removeChildByTag(1, true);
            this.deskArray[2] = new PDKDeskHead(info);
            this.seat_left.addChild(this.deskArray[2], 1, 1);
            XYGLogic.Instance.SeatPlayerInfo[info.uid] = this.deskArray[2];
            var frame = ccui.helper.seekWidgetByName(this.seat_left, "image_frame");
            frame.setVisible(false);
        }
    },

    checkGameStatus: function (data) {
        if (data['tableStatus']['isOffline'] == 1) {
            JJLog.print("断线重连=" + JSON.stringify(data));
            sound.playBgSound();
            XYGLogic.Instance.isOffline = true;
            XYGLogic.Instance.offLineInfo['currOp'] = data["tableStatus"]['currOp'];
            XYGLogic.Instance.offLineInfo['nextChuPai'] = data["tableStatus"]['nextChuPai'];
            XYGLogic.Instance.offLineInfo['lastOP'] = data["tableStatus"]["lastOP"];
            XYGLogic.Instance.lastOpUid = data['tableStatus']['lastOP']['opUid'];
            XYGLogic.Instance.currentRound = data['tableStatus']['currRounds'];
            this.text_round.setString(XYGLogic.Instance.currentRound + '/' + XYGLogic.Instance.roundTotal);

            JJLog.print("最后出牌=" + JSON.stringify(XYGLogic.Instance.offLineInfo['lastOP']));
            // this.panel_desk.removeAllChildren();
            var players = data["tableStatus"]['players'];
            this.panel_option_playing.setVisible(players.length == XYGLogic.Instance.person);
            if (data['tableStatus']['tableStatus'] == GameStatus.PLAYING) {

                this.btn_add.setVisible(false);
                // this.reLoadDirectionIndicator(data['tableStatus']);
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    for (var j = 0; j < this.deskArray.length; j++) {
                        if (player.uid == this.deskArray[j]['uid']) {
                            var num = 1;
                            if (player.uid == hall.user.uid) {
                                num = player['paiQi'].length;
                            } else {
                                num = player['paiQi'].num;
                            }
                            this.deskArray[j].setRemainPaiNum(num);
                            break;
                        }
                    }

                    for (var j = 0; j < player['paiChu'].length; j++) {
                        this.addChupaiArray(player.uid, player['paiChu'][j]);
                    }

                }
            }
            //

            // this.setBankerId(data['tableStatus']);
            //解散房间
            if (data['tableStatus']['dissolutionTable'] != -1 && data['tableStatus']['dissolutionTable']['result'] != 1) {
                var disarr = data['tableStatus']['dissolutionTable']['disArr'];
                var isDisarr = true;
                var disUid = {};
                for (var k = 0; k < disarr.length; k++) {
                    if (k == 0) {
                        disUid['uid'] = disarr[k];
                    }
                    if (hall.user.uid == disarr[k]) {
                        isDisarr = false;
                    }
                }

                if (isDisarr) {
                    var option = new DissloveOptionDialog(disUid);
                    option.showDialog();
                } else {
                    var option = new DissloveResultDialog(data['tableStatus']['dissolutionTable']);
                    option.showDialog();
                }
            }
        }

        this.setBankerId(data['tableStatus']);
    },

    setBankerId: function (data) {
        var fangZhu = data['fangZhu'];
        XYGLogic.Instance.fangZhu = fangZhu;
        // for (var i = 0; i < this.deskArray.length; i++) {
        //     if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
        //     this.deskArray[i].setBanker(this.deskArray[i].uid == fangZhu);
        // }
    },

    onPlayerLeave: function (data) {
        JJLog.print('mjPlayerLeave' + this._id);
        JJLog.print(JSON.stringify(data));
        var playerSeat = this.mGameDesk.playerSeatAll[data['uid']];
        if (playerSeat) {
            var j = XYGLogic.Instance.uidofPos(data['uid']);
            this.imgReadyArray[j].setVisible(false);
        }
        this.mGameDesk.onPlayerLeave(data);

        if (XYGLogic.Instance.status <= GameStatus.READY && data['uid'] == data['fangZhu']) {
            PDKPoker.net.imRoomId = -1;
            if (cc.sys.isNative) {
                GameLink.onUserLeaveRoom();
            }
            var hall2 = new MajhongHall();
            hall2.showHall();
        }

        if (XYGLogic.Instance.status <= TABLESTATUS.READY && data['uid'] == hall.user.uid) {
            PDKPoker.net.imRoomId = -1;
            if (cc.sys.isNative && GameLink)
                GameLink.onUserLeaveRoom();

            var hall2 = new MajhongHall();
            hall2.showHall();
        }
    },
    //游戏状态
    onGameStart: function (data) {
        // this.btn_back_hall.setVisible(false);
        JJLog.print("game start id =" + this._id);
        JJLog.print("start info=" + JSON.stringify(data));
        XYGLogic.Instance.status = GameStatus.PLAYING;
        XYGLogic.Instance.JinPaiId = null;
        XYGLogic.Instance.isOffline = false;
        XYGLogic.Instance.offLineInfo = {};
        XYGLogic.Instance.chairArr = data['chairArr'];
        XYGLogic.Instance.currentRound = data['currRounds'];
        this.idArray = data['chairArr'];
        XYGLogic.Instance.currentRound = data['currRounds'];
        XYGLogic.Instance.lastOp = {};
        XYGLogic.Instance.lastOpUid = null;
        this.chuPaiList = {};

        this.resetReady();
        this.showPanelPlaying(data);
        this.showPanelWaiting(data);
        this.showPanelStatus(data);
        this.showPanelReady(data);

        // this.panel_desk.removeAllChildren();
        // this.mGameDesk = new PDKGameDesk();
        // this.panel_desk.addChild(this.mGameDesk);

        this.btn_add.setVisible(false);

        this.resultData = null;
        this.totalIndex = 0;
        this.nowIndex = 0;
        sound.playBgSound();
    },

    onReadyStart: function (data) {

    },

    onReadyStatus: function (data) {
        var ready = data['readyStatus'];//0,1
        var uid = data['uid'];
        // for (var i = 0; i < this.deskArray.length; i++) {
        //     if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
        //     if (uid == this.deskArray[i].uid) {
        //         if (status == 1) {
        //             this.imgReadyArray[i].setVisible(true);
        //         } else {
        //             this.imgReadyArray[i].setVisible(false);
        //         }
        //         break;
        //     }
        // }
        var playerSeatAll = this.mGameDesk.playerSeatAll;
        for (var key in playerSeatAll) {
            if (playerSeatAll.hasOwnProperty(key)) {
                if (key == uid) {
                    var j = XYGLogic.Instance.uidofPos(key);
                    if (ready == 1) {
                        this.imgReadyArray[j].setVisible(true);
                    } else {
                        this.imgReadyArray[j].setVisible(false);
                    }
                    break;
                }
            }
        }
    },

    onNotifyDelCards: function (data) {
        var uid = data['uid'];
        if (this.turnUid == uid) return;
        this.turnUid = uid
        var pos = 0;
        for (var i = 0; i < this.deskArray.length; i++) {
            var uid_d = this.deskArray[i]['uid'];
            if (uid == uid_d) {
                pos = i;
                break;
            }
        }
        this.setTurnLightOff();
        this.imgClockArray[pos].setVisible(true);
        this.startClock(Times.OPERATETIME);
    },

    addChupaiArray: function (uid, cards) {
        if (this.chuPaiList[uid] == null || this.chuPaiList[uid] == undefined)
            this.chuPaiList[uid] = [];
        this.chuPaiList[uid].push(cards);

        JJLog.print(JSON.stringify(this.chuPaiList));
    },

    onSyncDelCards: function (data) {
        this.stopClock();
        this.addChupaiArray(data['uid'], data['msg']);
        if (data.opCardType == PuKeType.CT_BOMB || data.opCardType == PuKeType.CT_SINGLE_LINE ||
            data.opCardType == PuKeType.CT_DOUBLE_LINE || data.opCardType == PuKeType.CT_SIX_LINE_TAKE_FORE) {
            if (this.opAni != null) {
                this.opAni.play(data.opCardType);
            }
        }
    },

    onReciveChat: function (data) {
        JJLog.print(JSON.stringify(data));
        var uid = data['uid'];
        var type = data['data']['type'];
        var index = data['data']['index'];
        var content = data['data']['content'];
        // for (var i = 0; i < this.deskArray.length; i++) {
        //     if (uid == this.deskArray[i].uid) {
        //         if (type == CHAT_TYPE.Usual) {
        //             this.deskArray[i].showMsg(index, content);
        //         } else {
        //             this.deskArray[i].showFace(index);
        //         }
        //         break;
        //     }
        // }

        var playerSeat = this.mGameDesk.playerSeatAll[uid];
        if (playerSeat) {
            if (type == CHAT_TYPE.Usual) {
                playerSeat.mDeskHead.showMsg(index, content);
            } else {
                playerSeat.mDeskHead.showFace(index);
            }
        }
    },

    onGameResult: function (data) {
        this.resetDeskMode();
        XYGLogic.Instance.result = data;
        JJLog.print("结束通知=" + JSON.stringify(data));
        var result = new PDKRoundResult(data, this);
        result.showResult();
    },

    // onGameOver: function (data) {
    //     JJLog.print('GameOver Response -- -- -- -- ' + JSON.stringify(data));
    //     XYGLogic.Instance.report = data;
    //     if (this.resultData && this.resultData["isOver"] == 1) {
    //         return;
    //     }
    //     var tip = new JJConfirmDialog();
    //     var str = '经玩家 ';
    //     for (var i = 0; i < data['players'].length; i++) {
    //         str += ('【' + base64.decode(data['players'][i]['nickName']) + '】');
    //     }
    //     str += ('同意,房间解散成功!');
    //     tip.setDes(str);
    //     tip.setCallback(function () {
    //         JJLog.print('this is test callback');
    //         var endReport = new PDKEndResult();
    //         endReport.showGameResult();
    //     });
    //     tip.showDialog();
    // },

    registerCustomEvt: function () {
        var ls2 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.EVT_DESK_RESULT_INDEX,
            callback: this.indexCallback.bind(this)
        });
        var listener = cc.eventManager.addListener(ls2, this);
        this._Listeners.push(listener);

        var ls3 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.EVT_GAMING,
            callback: function (data) {
                var dialog = new JJConfirmDialog();
                dialog.setCallback(function () {
                    var hall2 = new MajhongHall();
                    hall2.showHall();
                });
                dialog.setDes('房间已经解散了！');
                dialog.showDialog();
            }
        });
        listener = cc.eventManager.addListener(ls3, this);
        this._Listeners.push(listener);
    },

    removeCustomEvt: function () {
        for (var i = 0; i < this._Listeners.length; i++) {
            cc.eventManager.removeListener(this._Listeners[i]);
        }
        this._Listeners.splice(0, this._Listeners.length);
    },

    indexCallback: function (event) {
        JJLog.print('index call back')
        JJLog.print(event);
        this.nowIndex++;
        JJLog.print('nowIndex = ' + this.nowIndex + ' allIndex = ' + this.totalIndex);

        if (this.nowIndex == this.totalIndex && this.resultData['roundResult'] == 1) {
            var result = new PDKRoundResult(this.resultData, this);
            result.showResult();
        }
    },

    onDissolutionTable: function (data) {
        JJLog.print('onDissolutionTable ');
        JJLog.print(JSON.stringify(data));

        if (data['result'] == 0)//0拒绝解散
        {
            var tip = new JJConfirmDialog();
            var nickName = base64.decode(XYGLogic.Instance.uidOfInfo(data['uid'])["nickName"]);
            tip.setDes('玩家' + '【' + nickName + '】' + '拒绝解散房间,解散房间失败！');
            tip.setCallback(function () {
                JJLog.print('this is test callback');
            });
            tip.showDialog();
        } else if (data['result'] == 1)//1解散成功
        {

        } else if (data['result'] == -1) {
            if (data['status'] == 1) {
                if (data['uid'] == hall.user.uid) {
                    var result = new DissloveResultDialog(data);
                    result.showDialog();
                } else {
                    var option = new DissloveOptionDialog(data);
                    option.showDialog();
                }
            }
        }
    },

    resetReady: function () {
        this.totalIndex = 0;
        this.nowIndex = 0;
        this.panel_ready.setVisible(false);
        for (var i = 0; i < this.imgReadyArray.length; i++) {
            this.imgReadyArray[i].setVisible(false);
        }
        this.btn_ready.setVisible(false);
    },

    showReady: function () {
        var layer = this.GetResult_layer();
        if (layer) {
            layer.removeFromParent();
            layer = null;
        }
        // this.panel_desk.removeAllChildren();
        // this.btn_setting.setVisible(true);
        this.panel_ready.setVisible(true);
        this.btn_ready.setVisible(true);
        this.readyStatus();


    },

    GetResult_layer: function () {
        return this.Result_layer;
    },
    setResultCards: function (data) {
        // this.panel_desk.removeAllChildren();
        var players = data['players'];
        this.Result_layer = new ccui.Layout();
        this.addChild(this.Result_layer);
        for (var i = 0; i < players.length; i++) {
            var info = players[i];
            var paiChu = info["paiChu"];
            var paiQi = info["paiQi"];
            var isSelf = false;

            if (XYGLogic.Instance.leftSeatInfo() && info.uid == XYGLogic.Instance.leftSeatInfo().uid) {
                var panel_card = new cc.Node();
                panel_card.setAnchorPoint(0, 0.5);
                panel_card.x = 150;
                panel_card.y = 350;
                this.Result_layer.addChild(panel_card);
                if (info.hasOwnProperty('huType')) {
                    var cardsData = paiChu[paiChu.length - 1];

                } else {
                    var cardsData = paiQi;
                }
            }
            else if (XYGLogic.Instance.rightSeatInfo() && info.uid == XYGLogic.Instance.rightSeatInfo().uid) {
                if (info.hasOwnProperty('huType')) {
                    var cardsData = paiChu[paiChu.length - 1];

                } else {
                    var cardsData = paiQi;
                }
                var panel_card = new cc.Node();
                panel_card.setAnchorPoint(1, 0.5);
                var nCard = cardsData.length >= 10 ? 10 : cardsData.length
                var size = nCard * 30 + (165 * 0.5 - 30);
                panel_card.x = 1230 - size - 100;
                panel_card.y = 350;
                this.Result_layer.addChild(panel_card);
            }
            else if (XYGLogic.Instance.selfSeatInfo() && info.uid == XYGLogic.Instance.selfSeatInfo().uid) {
                if (info.hasOwnProperty('huType')) {
                    var cardsData = paiChu[paiChu.length - 1];

                } else {
                    var cardsData = paiQi;
                }
                var panel_card = new cc.Node();
                panel_card.setAnchorPoint(0.5, 0.5);
                var size = cardsData.length * 30 + (165 * 0.5 - 30);
                panel_card.x = 640 - size / 2;
                panel_card.y = 150;
                this.Result_layer.addChild(panel_card);
                isSelf = true;
            }

            var posx = 0;
            var _posx = 0;
            var innerWidth = 0;
            // cardsData = DDZCard_Rule.sortCards(cardsData);
            for (var k = 0; k < cardsData.length; k++) {
                var card = new MyPokerCard(this, cardsData[k], false);
                card.setScale(0.5);
                card.setAnchorPoint(cc.p(0, 0));
                if (k == 0 && posx > 0)
                    card.showInsert();

                if (k > 10 && !isSelf) {
                    card.x = _posx;
                    card.y = -60;
                    _posx += 30;
                }
                else {
                    card.x = posx;
                    card.y = 0;
                    posx += 30;
                }
                panel_card.addChild(card);
            }
        }
    },


    checkResp: function (data) {
        if (data["code"] == 200) {
            return true;
        }
        return false;
    },


    onTableStatus: function (data) {
        JJLog.print(" gamescene ontablestatus");
        JJLog.print(JSON.stringify(data));
    },

    onPlayerEnter: function (data) {
        JJLog.print("gamescene player enter" + this._id);
        //this.setDirectionIndicator(data);

        if (!XYGLogic.Instance.inited) return;

        var userData = data["user"];
        var pos = userData["position"];
        XYGLogic.Instance.setSeatPosInfo(userData);

        this.mGameDesk.onPlayerEnter();
        // if (XYGLogic.Instance.person == 2) {
        //     this.addRightDesk();
        // } else {
        //     if (pos > XYGLogic.Instance.selfPos) {
        //         if (pos - XYGLogic.Instance.selfPos == 1)
        //             this.addRightDesk();
        //         else
        //             this.addLeftDesk();
        //     } else {
        //         if (XYGLogic.Instance.selfPos - pos == 1)
        //             this.addLeftDesk();
        //         else
        //             this.addRightDesk();
        //     }
        // }
    },


    reLoadDirectionIndicator: function (data) {
        var nextChupaiId = data['nextChuPai'];
        var chuPaiPos = 0;
        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i].uid == nextChupaiId) {
                chuPaiPos = i;
            }
        }
        this.turnUid = nextChupaiId;
        this.setTurnLightOff();
        this.imgClockArray[chuPaiPos].setVisible(true);
        this.startClock(Times.OPERATETIME);
    },

    setDirectionIndicator: function () {
        var pos = 0;
        for (var i = 0; i < this.idArray.length; i++) {
            if (this.idArray[i] == hall.user.uid) {
                pos = i;
                break;
            }
        }
    },

    resetDeskMode: function () {
        XYGLogic.Instance.isOffline = false;
        XYGLogic.Instance.offLineInfo = null;
        for (var j = 0; j < this.deskArray.length; j++) {
            this.deskArray[j].setRemainPaiNum(-1);
        }
        this.setTurnLightOff();
        this.stopClock();

        for (var key in this.mGameDesk.playerSeatAll) {

            var playerDeskState = this.mGameDesk.playerSeatAll[key];
            if (playerDeskState) {
                var info = XYGLogic.Instance.uidOfInfo(playerDeskState.uid);
                if (!info) break;
                playerDeskState.reStart();
            }
        }

    },

    startClock: function (sec) {
        for (var i = 0; i < this.imgClockArray.length; i++) {
            if (!!this.imgClockArray[i].text_clock)
                this.imgClockArray[i].text_clock.setString(sec);
        }
        this.schedule(this.countDown, 1);
    },

    countDown: function (dt) {
        var sec = parseInt(this.imgClockArray[0].text_clock.getString());
        if (sec == 6 && this.turnUid == hall.user.uid) {
            sound.playTimeUpAlarm();
        }

        if (sec >= 1) {
            sec--;
            if (sec < 10) sec = '0' + sec;
        }
        else {
            sec = '00';
        }

        for (var i = 0; i < this.imgClockArray.length; i++) {
            if (!!this.imgClockArray[i].text_clock)
                this.imgClockArray[i].text_clock.setString(sec);
        }
    },

    stopClock: function () {
        this.unschedule(this.countDown);
        this.turnUid = 0;
        sound.stopTimeUpAlarm();
    },

    initRecordInfo: function () {
        // this.initRecordHead();
        // this.initRecordDesk();
    },

    // initRecordHead: function () {
    //     // for (var i = 0; i < PDKPoker.record.playerInfoArr.length; i++) {
    //     //     var data = PDKPoker.record.playerInfoArr[i];
    //     //     this.deskArray[i] = new PDKDeskHead(data);
    //     //     this.seatHeads[i].addChild(this.deskArray[i], 1, 1);
    //     //     var frame = ccui.helper.seekWidgetByName(this.seatHeads[i], "image_frame");
    //     //     frame.setVisible(false);
    //     // }
    // },

    // initRecordDesk: function () {
    //     // var desc = PDKPoker.record.getTableDes();
    //     //
    //     // this.text_round.setString(PDKPoker.record.currentRound + '/' + PDKPoker.record.roundTotal);
    //     // this.text_msg.setString(desc);
    //     // this.text_msg.setVisible(true);
    //     // var desk = new PDKGameDesk();
    //     // this.panel_desk.addChild(desk);
    // },
});


var CheckLastCards = JJDialog.extend({
    isSelf: 0,
    ctor: function (cardsArray) {
        this._super();
        var root = util.LoadUI(PDKPokerJson.PDKLastCards).node;
        this.addChild(root);
        var close = ccui.helper.seekWidgetByName(root, "panel");
        close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));

        var node0 = ccui.helper.seekWidgetByName(root, "node0");
        node0.removeAllChildren();
        var node1 = ccui.helper.seekWidgetByName(root, "node1");
        node1.removeAllChildren();
        var node2 = ccui.helper.seekWidgetByName(root, "node2");
        node2.removeAllChildren();
        var no0 = ccui.helper.seekWidgetByName(root, "no0");
        no0.setVisible(false);
        var no1 = ccui.helper.seekWidgetByName(root, "no1");
        no1.setVisible(false);
        var no2 = ccui.helper.seekWidgetByName(root, "no2");
        no2.setVisible(false);

        var rightinfo = XYGLogic.Instance.rightSeatInfo();
        var leftinfo = XYGLogic.Instance.leftSeatInfo();
        var leftLen = 0;
        var rightLen = 0;
        var selfLen = 0;
        var min = 0;
        if (!!rightinfo) {
            if (!!cardsArray[rightinfo.uid]) {
                rightLen = cardsArray[rightinfo.uid].length;
            }
        }

        if (!!cardsArray[hall.user.uid]) {
            selfLen = cardsArray[hall.user.uid].length;
        }

        if (!!leftinfo) {
            if (!!cardsArray[leftinfo.uid]) {
                leftLen = cardsArray[leftinfo.uid].length;
            }
        }

        if (XYGLogic.Instance.person == 3) {
            min = Math.min(rightLen, leftLen, selfLen);
        } else {
            min = Math.min(rightLen, selfLen);
        }

        if (min > 0) {
            min--;
            var rightCards = null;
            var leftCards = null;
            var selfCards = null;
            if (XYGLogic.Instance.person == 3) {
                rightCards = cardsArray[rightinfo.uid][min];
                leftCards = cardsArray[leftinfo.uid][min];
                selfCards = cardsArray[hall.user.uid][min];
            } else {
                rightCards = cardsArray[rightinfo.uid][min];
                selfCards = cardsArray[hall.user.uid][min];
            }
            var posx = -selfCards.length / 2 * 30 - 38;
            for (var i = 0; i < selfCards.length; i++) {
                var card = new MyPokerCard(this, selfCards[i], false);
                card.setScale(0.5);
                card.setAnchorPoint(cc.p(0, 0));
                card.x = posx;
                card.y = 0;
                posx += 30;
                node0.addChild(card);
            }
            no0.setVisible(selfCards.length == 0);

            posx = -rightCards.length / 2 * 30 - 38;
            for (var i = 0; i < rightCards.length; i++) {
                var card = new MyPokerCard(this, rightCards[i], false);
                card.setScale(0.5);
                card.setAnchorPoint(cc.p(0, 0));
                card.x = posx;
                card.y = 0;
                posx += 30;
                node1.addChild(card);
            }
            no1.setVisible(rightCards.length == 0);

            if (leftCards != null) {
                posx = -leftCards.length / 2 * 30 - 38;
                for (var i = 0; i < leftCards.length; i++) {
                    var card = new MyPokerCard(this, leftCards[i], false);
                    card.setScale(0.5);
                    card.setAnchorPoint(cc.p(0, 0));
                    card.x = posx;
                    card.y = 0;
                    posx += 30;
                    node2.addChild(card);
                }
                no2.setVisible(leftCards.length == 0);
            }

        }
    },

    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    }

});

var pokerAnimation = cc.Layer.extend({
    panel_root: null,
    panel_bomb: null,
    panel_shunzi: null,
    panel_liandui: null,
    panel_feiji: null,
    action: null,
    root: null,
    ctor: function () {
        this._super();
    },

    play: function (type) {
        switch (type) {
            case PuKeType.CT_BOMB:
                var node_anim = util.playTimeLineAnimation(DDZPokerJson.Eff_zhadan, false);
                node_anim.setPositionX(200);
                this.addChild(node_anim, 100);
                break;
            case PuKeType.CT_SINGLE_LINE:
                var node_anim = util.playTimeLineAnimation(DDZPokerJson.Eff_shunzi, false);
                node_anim.setPositionX(200);
                this.addChild(node_anim, 100);
                break;
            case PuKeType.CT_DOUBLE_LINE:
                var node_anim = util.playTimeLineAnimation(DDZPokerJson.Eff_liandui, false);
                node_anim.setPositionX(200);
                this.addChild(node_anim, 100);
                break;
            case PuKeType.CT_SIX_LINE_TAKE_FORE:
                var node_anim = util.playTimeLineAnimation(DDZPokerJson.Eff_feiji, false);
                node_anim.setPositionX(200);
                this.addChild(node_anim, 100);
                break;
        }
    }
});


