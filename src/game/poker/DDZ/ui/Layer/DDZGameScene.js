/**
 * Created by atom on 2016/7/25.
 */
var gameSceneId = 0;

var DDZStateTable = {
    0: GameStateSeating,
    1: GameStateWait,
    2: GameStateWait,
    3: GameStateDispatching,
    4: GameStateBeneath,
    5: GameStateGameing,
    6: GameStateOver,
    7: GameStateOver,
}

var DDZGameScene = cc.Layer.extend({
    _id: 0,
    text_round: null,

    panel_player: null,

    panel_desk: null,

    btn_add: null,

    panel_option_waiting: null,
    btn_invite_wechat: null,
    panel_option_playing: null,
    btn_setting: null,
    btn_msg: null,

    panel_infomation: null,
    btn_exit_game: null,
    panel_rule: null,
    text_room_id: null,
    text_time: null,
    text_room_name: null,
    text_msg: null,

    direRotation: 0,
    idArray: null,

    chuPaiList: {},
    speakTip: null,
    resultData: null,

    gameMode: GameMode.PLAY,
    turnUid: 0,//谁出牌
    opAni: null,
    mGameDesk: null,

    btn_back_hall: null,
    btn_dissolve: null,

    img_dolordCount: null,
    text_dolordCount: null,
    img_checkNum: null,
    text_checkNum: null,
    panel_gameInfo: null,
    //电量
    powerStatusImg: null,
    netWorkDelayIcon: null,
    netWorkDelayMS: null,

    ctor: function () {
        this._super();

        var root = util.LoadUI(DDZPokerJson.GameRoom).node;
        this.addChild(root);
        TableComponent.addComponent(root);

        var _this = this;
        gameSceneId++;
        this._id = gameSceneId;

        this.panel_player = ccui.helper.seekWidgetByName(root, "panel_player");

        this.panel_desk = ccui.helper.seekWidgetByName(root, "panel_desk");

        this.panel_option_playing = ccui.helper.seekWidgetByName(root, "panel_option_playing");

        this.img_dolordCount = ccui.helper.seekWidgetByName(this.panel_option_playing, "img_dolordCount");
        this.text_dolordCount = ccui.helper.seekWidgetByName(this.img_dolordCount, "text_dolordCount");

        this.img_dolordCount.setVisible(false);

        this.panel_option_playing.setVisible(false);


        this.panel_infomation = ccui.helper.seekWidgetByName(root, "panel_infomation");
        this.panel_option_waiting = ccui.helper.seekWidgetByName(root, "panel_option_waiting");

        var powerStatusBg = ccui.helper.seekWidgetByName(root, "power_BG");
        this.powerStatusImg = ccui.helper.seekWidgetByName(root, "power");
        this.netWorkDelayIcon = ccui.helper.seekWidgetByName(root, "delay");
        this.netWorkDelayMS = ccui.helper.seekWidgetByName(root, "delayMS");
        var enableShow = false;    // todo 是否显示电量和网络信号
        if (enableShow) {
            this.initPowerStatus();
            powerStatusBg.setVisible(true);
            this.schedule(this.updatePowerAndNetSatus, 5);
        }
        else {
            powerStatusBg.setVisible(false);
            //    this.powerStatusImg.setVisible(false)
            this.netWorkDelayIcon.setVisible(false);
            this.netWorkDelayMS.setVisible(false);
        }

        this.panel_gameInfo = ccui.helper.seekWidgetByName(this.panel_infomation, "panel_gameInfo");

        this.img_checkNum = ccui.helper.seekWidgetByName(this.panel_gameInfo, "panel_checkNum");
        this.text_checkNum = ccui.helper.seekWidgetByName(this.img_checkNum, "text_checkNum");

        this.img_checkNum.setVisible(false);

        this.btn_exit_game = ccui.helper.seekWidgetByName(this.panel_infomation, "btn_exit_game");
        this.btn_exit_game.addClickEventListener(function () {
            sound.playBtnSound();
            this.exitGame();
        }.bind(this));
        this.btn_exit_game.setVisible(false);

        this.text_round = ccui.helper.seekWidgetByName(this.panel_infomation, "text_round");

        this.panel_rule = ccui.helper.seekWidgetByName(root, "panel_ddz_rule");

        this.text_room_name = ccui.helper.seekWidgetByName(this.panel_infomation, "text_room_name");

        this.text_msg = ccui.helper.seekWidgetByName(this.panel_infomation, "text_msg");

        this.idArray = new Array();
        this.btn_add = ccui.helper.seekWidgetByName(root, "btn_add");
        if (!cc.sys.isNative) {
            var self = this;
            this.btn_add.addClickEventListener(function () {
                sound.playBtnSound();
                DDZPoker.net.addRobot(1, function (data) {
                    JJLog.print('add rebot resp');
                });
            });
        } else {
            this.btn_add.setVisible(false);
        }

        this.beneathCardPanel = ccui.helper.seekWidgetByName(root, "panel_beanth_cards");
        this.setBeneathCards([]);
        this.panel_laizi = ccui.helper.seekWidgetByName(root, "panel_laizi");

        this.panel_mulity = ccui.helper.seekWidgetByName(root, "panel_mulity");
        this.txtMulityValue = ccui.helper.seekWidgetByName(this.panel_mulity, "txt_mulity");

        this.mGameDesk = new DDZGameDesk();
        this.panel_desk.addChild(this.mGameDesk);

        this.opAni = new DDZPokerAnimation();
        this.opAni.x = 440;
        this.opAni.y = 340;
        this.panel_option_playing.addChild(this.opAni);

    },
    initPowerStatus: function () {
        var poswerPercent = util.getBatteryPercent();
        this.powerStatusImg.setScale(poswerPercent, 1);
        var red = { r: 255, g: 0, b: 0, a: 255 };
        var green = { r: 0, g: 205, b: 0, a: 255 };
        var yellow = { r: 255, g: 200, b: 0, a: 255 };
        if (poswerPercent > 0.5) {
            this.powerStatusImg.setColor(green)
        } else if (poswerPercent > 0.3) {
            this.powerStatusImg.setColor(yellow)
        }
        else {
            this.powerStatusImg.setColor(red)
        }
    },

    updateNetWorkDelayInfo: function () {

        var red = { r: 255, g: 0, b: 0, a: 255 };
        var green = { r: 0, g: 205, b: 0, a: 255 };
        var yellow = { r: 255, g: 200, b: 0, a: 255 };
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
        this.updatePowerSatus();
    },

    onEnter: function () {
        JJLog.print('gamescene enter' + this._id);
        this._super();
        DDZSound.create();
        // sound.playBgSound(0);
        if (hall.songshen != 1) {
            var notice = new MajhongNotice(true);
            notice.setVisible(false);
            this.addChild(notice, 100);
        }
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.registerAllEvents();
            this.initTable();
            hall.wxEnterRoom = 0;
        }
    },

    onExit: function () {
        JJLog.print('gamescene exit' + this._id);
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.removeAllEvents();
            XYGLogic.release();
        }
        if (this.mCurGameState) {
            this.mCurGameState.destroy();
            this.mCurGameState = null;
        }
        DDZSound.release();
        this._super();
    },
    initRecordInfo: function () {

    },

    checkMsg: function (data) {
        if (data["code"] == NetErr.OK) {
            return true;
        }
        return false;
    },

    reStart: function () {
        XYGLogic.Instance.reStart();

        var layer = this.GetResult_layer();
        if (layer) {
            layer.removeFromParent();
            layer = null;
        }

        this.setCheckNum(true);
        this.setGameState(TABLESTATUS.WATING);
        for (var key in XYGLogic.Instance.getReady) {
            var playerDeskState = this.mGameDesk.getPlayerSeatByUID(key);
            if (!playerDeskState) return;
            playerDeskState.getReadyState();
            playerDeskState.getSelfReady();
        }
    },

    readyStatus: function () {
        var _this = this;
        XYGLogic.Instance.ready(function (data) {

        });
    },

    setBeneathCards: function (cards) {

        if (!cards || !this.benethCards) {
            this.benethCards = [];
            for (var i = 0; i < 3; i++) {
                var pai = { "type": 0x00, "value": 0x00 };
                var card = new DDZPokerCard({ uid: XYGLogic.Instance.whoIsBanker() }, pai);
                card.removeTouchListener();
                card.setPosition(cc.p(0, 0));
                var cardRoot = ccui.helper.seekWidgetByName(this.beneathCardPanel, "card" + (i + 1));
                cardRoot.removeAllChildren();
                cardRoot.addChild(card);
                this.benethCards.push(card);
            }
        } else {
            cards.forEach(function (card, index) {
                this.benethCards[index].setCardData(card);
            }, this);
        }
    },

    initTable: function () {
        var _this = this;
        XYGLogic.Instance.reqBaseInfo();
    },

    _baseReadyInfo: function (data) {
        this.roomInfo = data;
        XYGLogic.Instance.getReady = {};
        if (data) {
            JJLog.print("init table response");
            JJLog.print(JSON.stringify(data));
            if (this.checkMsg(data)) {
                this.showTableInfo(data['tableStatus']);

                var infoPlayers = data['tableStatus']['players'];
                for (var i = 0; i < infoPlayers.length; i++) {
                    var ready = infoPlayers[i]['isReady'];
                    var uid = infoPlayers[i]['uid'];
                    XYGLogic.Instance.getReady[uid] = ready;
                }
            }

            var curStatus = data.tableStatus.tableStatus;
            this.mGameDesk.onPlayerEnter(data);
            this.setGameState(curStatus);
            this.setChangeMulity();
        }

    },

    setGameState: function (status) {
        if (!DDZStateTable[status]) {
            JJLog.print("Error current status", status);
            return;
        }

        if (this.mCurGameState) {
            if (status === this.mCurGameState.mID) {
                return;
            }
            this.mCurGameState.destroy();
            this.mCurGameState = null;
        }

        var gameState = new DDZStateTable[status](status);
        Object.getOwnPropertyNames(this.__proto__).forEach(function (key) {
            if (key.indexOf('_') != 0) {
                if (typeof (this[key]) == "function") {
                    gameState[key] = this[key].bind(this);
                } else {
                    gameState[key] = this[key];
                }
            }
        }, this);
        gameState.init();

        this.mCurGameState = gameState;
    },

    onChangeStatus: function (status) {
        JJLog.print("gamescene onChangeStatus", status);

        this.setGameState(status);

    },

    registerAllEvents: function () {
        qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
        qp.event.listen(this, 'mjPlayerEnter', this.onPlayerEnter.bind(this));
        // qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
        qp.event.listen(this, 'mjPlayerLeave', this.onPlayerLeave);
        qp.event.listen(this, 'pkSyncTableStatus', this.onChangeStatus);
        // qp.event.listen(this, 'mjThrowStatus', this.onGamethorw.bind(this));
        qp.event.listen(this, 'mulityChange', this.setChangeMulity);
        // qp.event.listen(this, 'mjGameOver', this.onGameOver);
        qp.event.listen(this, 'mjJinPai', this.setChangeValue.bind(this));

        qp.event.listen(this, 'appGameBaseInfo', this._baseReadyInfo.bind(this));
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'mjGameStart');
        qp.event.stop(this, 'mjPlayerEnter');
        // qp.event.stop(this, 'mjDissolutionTable');
        qp.event.stop(this, 'mjPlayerLeave');
        qp.event.stop(this, 'pkSyncTableStatus');
        // qp.event.stop(this, 'mjThrowStatus');
        qp.event.stop(this, 'mulityChange');
        // qp.event.stop(this, 'mjGameOver');
        qp.event.stop(this, 'mjJinPai');

        qp.event.stop(this, 'appGameBaseInfo');
    },

    setCheckNum: function (bool) {
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            if (XYGLogic.Instance.person == 2) {
                if (bool) {
                    this.img_checkNum.setVisible(true);
                    this.text_checkNum.setString(XYGLogic.Instance.checkNum);
                } else {
                    this.img_checkNum.setVisible(false);
                }
            }
        }
    },
    setDoLordCount: function (count) {
        if (count > 0) {
            this.img_dolordCount.setVisible(true);
            this.text_dolordCount.setString(count);
        } else {
            this.img_dolordCount.setVisible(false);
        }
    },
    setChangeValue: function (data) {
        JJLog.print("!!!!!!!!!!!!!!!!!!!!setChangeValue", data);
        this.runLaiZiAction(data, function () {
            XYGLogic.Instance.changeValue = data;
            var event = new cc.EventCustom(CommonEventAction.KAIJIN_EVT);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
            if (this.benethCards) {
                this.benethCards.forEach(function (el) {
                    el.refreshCard();
                });
                this.showChangeValue(data);
            }
        }.bind(this));
    },
    showChangeValue: function (data) {
        var cardRoot = ccui.helper.seekWidgetByName(this.beneathCardPanel, "card4");
        cardRoot.removeAllChildren();
        if (data.value > 0) {
            var card = new DDZPokerCard(this, { value: data.value }, false);
            card.setPosition(cc.p(0, 0));
            card.refreshCard(true);
            cardRoot.addChild(card);
            card.runAction(cc.fadeIn(1));
        }
    },
    runLaiZiAction: function (data, cb) {
        this.panel_laizi.removeAllChildren();
        var panel_laizi = this.panel_laizi;
        var pai1 = { "type": 0x00, "value": 0x00 };
        var pai2 = { type: _.random(1, 4), value: _.random(1, 13) }
        var card1 = new DDZPokerCard(this, pai1);
        var card2 = new DDZPokerCard(this, pai2);
        card1.setPosition(cc.p(0, 0));
        card2.setPosition(cc.p(0, 0));

        card1.setVisible(true);
        card2.setVisible(true);
        card1.setScaleX(1);
        card2.setScaleX(0);
        this.panel_laizi.addChild(card1);
        this.panel_laizi.addChild(card2);
        var cardRoot = ccui.helper.seekWidgetByName(this.beneathCardPanel, "card4");
        var end_pos = this.beneathCardPanel.convertToWorldSpace(cardRoot.getPosition());
        end_pos = this.panel_laizi.convertToNodeSpace(end_pos);
        var time = 0.08;
        var count = 0;
        var startRandom = function () {
            var seq1 = null;
            var func6 = function () {
                startRandom();
            };
            var func5 = function () {
                JJLog.print("=====panel_laizi.removeAllChildren")
                panel_laizi.removeAllChildren();
                if (cb) {
                    cb();
                }
            };
            var func4 = function () {
                card2.runAction(cc.moveTo(1, end_pos));
            };
            var func3 = function () {
                if (count == 2) {
                    card2.setCardData({ type: _.random(1, 4), value: data.value });
                    card2.refreshCard(true);
                } else {
                    card2.setCardData({ type: _.random(1, 4), value: _.random(1, 13) });
                }
                card1.runAction(cc.sequence(cc.scaleTo(time, 1, 1), cc.callFunc(func6)));
            };
            var func2 = function () {
                if (++count < 3) {
                    card2.runAction(cc.sequence(cc.scaleTo(time, 0, 1), cc.callFunc(func3)))
                } else {
                    card2.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(func4), cc.delayTime(0.2), cc.callFunc(func5)));
                }
            };
            var func1 = function () {
                card2.runAction(cc.sequence(cc.scaleTo(time, 1, 1), cc.callFunc(func2)));
            }
            seq1 = cc.sequence(cc.scaleTo(time, 0, 1), cc.callFunc(func1));
            card1.runAction(seq1);
        };

        startRandom();
    },
    GetResult_layer: function () {
        return this.Result_layer;
    },
    setResultCards: function (data) {
        JJLog.print("!!!!!!!!!!!!!!!!!!!!!setResultCards", data)
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
                if (paiQi.length > 0) {
                    var cardsData = paiQi;

                } else {
                    var cardsData = paiChu[paiChu.length - 1];
                }
            }
            else if (XYGLogic.Instance.rightSeatInfo() && info.uid == XYGLogic.Instance.rightSeatInfo().uid) {
                if (paiQi.length > 0) {
                    var cardsData = paiQi;

                } else {
                    var cardsData = paiChu[paiChu.length - 1];
                }
                var panel_card = new cc.Node();
                panel_card.setAnchorPoint(1, 0.5);
                var nCard = cardsData.length >= 10 ? 10 : cardsData.length
                var size = nCard * 30 + (165 * 0.5 - 30);
                panel_card.x = 1230 - size - 100;
                panel_card.y = 350;
                this.Result_layer.addChild(panel_card);
            }
            else if (XYGLogic.Instance.upSeatInfo() && info.uid == XYGLogic.Instance.upSeatInfo().uid) {
                if (paiQi.length > 0) {
                    var cardsData = paiQi;

                } else {
                    var cardsData = paiChu[paiChu.length - 1];
                }
                var panel_card = new cc.Node();
                panel_card.setAnchorPoint(1, 0.5);
                var size = cardsData.length * 30 + (165 * 0.5 - 30);
                panel_card.x = 640 - size / 2;
                panel_card.y = 500;
                this.Result_layer.addChild(panel_card);
                isSelf = true;
            }
            else if (info.uid == XYGLogic.Instance.selfSeatInfo().uid) {
                if (paiQi.length > 0) {
                    var cardsData = paiQi;

                } else {
                    var cardsData = paiChu[paiChu.length - 1];
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
            cardsData = DDZCard_Rule.sortCards(cardsData);
            for (var k = 0; k < cardsData.length; k++) {
                var card = new DDZPokerCard(this, cardsData[k], false);
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
        var posx = 0;
        var feipais = data['feiPais'];
        if (feipais.length > 0) {
            feipais = DDZCard_Rule.sortCards(feipais);
            var panel_card = new cc.Node();
            panel_card.setAnchorPoint(0, 0.5);
            var size = feipais.length * 30 + (165 * 0.5 - 30);
            panel_card.x = 640 - size / 2;
            panel_card.y = 350;
            this.Result_layer.addChild(panel_card);
            for (var i = 0; i < feipais.length; i++) {
                var card = new DDZPokerCard(this, feipais[i], false);
                card.setScale(0.5);
                card.setAnchorPoint(cc.p(0, 0));
                if (i == feipais.length - 1) {
                    card.showFeiPaisTip(true);
                }
                if (i == 0 && posx > 0)
                    card.showInsert();
                card.x = posx;
                card.y = 0;
                posx += 30;
                panel_card.addChild(card);
            }
        }
    },
    setChangeMulity: function (value) {
        value = value || XYGLogic.Instance.getMulityValue();
        this.txtMulityValue.string = "x" + value;
    },
    //hxx
    getpkSyncTableSpring: function (data) {
        var value = 1;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                value *= data[key];
            }
        }
        this.txtMulityValue.string = "x" + value;
    },

    showTableInfo: function (data) {
        JJLog.print("桌子=" + JSON.stringify(data));
        if (data['tableStatus'] > 2) {
            sound.playGameSound(1);
        }
        XYGLogic.Instance.tableId = data['tableId'];
        // this.text_room_id.setString(data['tableId']);
        XYGLogic.Instance.status = data['tableStatus'];
        XYGLogic.Instance.chairArr = data['chairArr'];
        for (var idx = 0; idx < data['players'].length; idx++) {
            XYGLogic.Instance.seatArray[data['players'][idx].position]['coinNum'] = data['players'][idx]['coinNum'];
        }
        this.idArray = data['chairArr'];
        if (XYGLogic.Instance.person == 2) {
            this.beneathCardPanel.setPositionX(90);
            this.beneathCardPanel.setPositionY(690);
            this.panel_gameInfo.setPositionY(480);
        }
        // this.initInvite(data);
        this.setDirectionIndicator();
        this.showPanelInfomation(data);
    },

    showPanelInfomation: function (data) {
        this.panel_infomation.setVisible(true);

        this.text_msg.setVisible(false);

        console.error("!!!!!!!!!!", data)
        var rounds = parseInt(data['roundsTotal']);
        var fengding = parseInt(data['maxBomb']);
        var aaGem = parseInt(data['aaGem']);
        var showNum = parseInt(data['isLaiZi']);
        var mode = parseInt(data['mode']);
        var person = parseInt(data['person']);

        if (person == 2) {
            this.setCheckNum(true);
        }

        var round_value = [4, 6, 8];
        var cost = { "4": 24, "6": 36, "8": 45 }
        for (var i = 0; i < 3; i++) {
            var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_" + i);
            checkbox.setTouchEnabled(false);
            var _labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            _labelNum.setString(round_value[i] + "局(钻石X" + cost[round_value[i]] + ")")
            var saveOp = 4;
            if (rounds == 4 || rounds == 6 || rounds == 8) {
                saveOp = rounds;
            }
            var bl = saveOp == round_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                _labelNum.setTextColor(CommonParam.selectColor);
        }

        var fengding_value = [3, 4, 5];
        for (var i = 0; i < 3; i++) {
            var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_fengd" + i);
            var _labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = 3;
            if (fengding == 4 || fengding == 3 || fengding == 5) {
                saveOp = fengding;
            }
            var bl = saveOp == fengding_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                _labelNum.setTextColor(CommonParam.selectColor);
        }

        var mode_value = [1, 2];
        for (var i = 0; i < 2; i++) {
            var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_wanfa_" + i);
            var _labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = 1;
            if (mode == 1 || mode == 2) {
                saveOp = mode;
            }
            var bl = saveOp == mode_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                _labelNum.setTextColor(CommonParam.selectColor);
        }

        var person_value = [3, 2];
        for (var i = 0; i < 2; i++) {
            var checkbox = ccui.helper.seekWidgetByName(this.panel_rule, "checkbox_ren" + i);
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

    },

    onPlayerLeave: function (data) {
        JJLog.print('mjPlayerLeave' + this._id);
        JJLog.print(JSON.stringify(data));
        if (XYGLogic.Instance.currentRound > 1)
            return;

        this.mGameDesk.onPlayerLeave(data);

        if (XYGLogic.Instance.status <= TABLESTATUS.READY && data['uid'] == data['fangZhu']) {
            DDZPoker.net.imRoomId = -1;
            if (cc.sys.isNative && GameLink)
                GameLink.onUserLeaveRoom();

            var hall2 = new MajhongHall();
            hall2.showHall();
        }

        if (XYGLogic.Instance.status <= TABLESTATUS.READY && data['uid'] == hall.user.uid) {
            DDZPoker.net.imRoomId = -1;
            if (cc.sys.isNative && GameLink)
                GameLink.onUserLeaveRoom();

            var hall2 = new MajhongHall();
            hall2.showHall();
        }
    },
    //游戏状态
    onGameStart: function (data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this.roomInfo.tableStatus[key] = data[key];
            }
        }
        JJLog.print("game start id =" + this._id);
        JJLog.print("start info=" + JSON.stringify(data));
        XYGLogic.Instance.status = GameStatus.PLAYING;
        XYGLogic.Instance.JinPaiId = null;
        XYGLogic.Instance.isOffline = false;
        XYGLogic.Instance.offLineInfo = {};
        XYGLogic.Instance.chairArr = data['chairArr'];
        XYGLogic.Instance.currentRound = data['currRounds'];
        this.idArray = data['chairArr'];
        XYGLogic.Instance.lastOp = {};
        this.chuPaiList = {};
        this.btn_add.setVisible(false);

        XYGLogic.Instance.result = null;
        sound.playGameSound(1);
    },

    addChupaiArray: function (uid, cards) {
        if (this.chuPaiList[uid] == null || this.chuPaiList[uid] == undefined)
            this.chuPaiList[uid] = [];
        this.chuPaiList[uid].push(cards);

        JJLog.print(JSON.stringify(this.chuPaiList));
    },

    checkResp: function (data) {
        if (data["code"] == 200) {
            return true;
        }
        return false;
    },

    onPlayerEnter: function (data) {
        JJLog.print("gamescene player enter" + this._id);
        if (!XYGLogic.Instance.inited) return;

        var userData = data["user"];
        var pos = userData["position"];
        userData['coinNum'] = 0;
        XYGLogic.Instance.setSeatPosInfo(userData);
        this.mGameDesk.onPlayerEnter(data);
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
});