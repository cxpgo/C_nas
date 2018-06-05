//麻将回放控制处理
//这个类里的所有方法 可直接代用MJDeskSeat里方法
var MJCmpDeskSeatRe = {
    ctor: function (data, info) {
        this._super(data, info);
        this.sexType = 1;
    },
    initUI: function () {
        this._super()
        var btn_chi = ccui.helper.seekWidgetByName(this.panel_replay, "btn_chi");
        btn_chi.setTag(OPERATIONTYPE.CHI);
        var btn_gang = ccui.helper.seekWidgetByName(this.panel_replay, "btn_gang");
        btn_gang.setTag(OPERATIONTYPE.GANG);
        var btn_peng = ccui.helper.seekWidgetByName(this.panel_replay, "btn_peng");
        btn_peng.setTag(OPERATIONTYPE.PENG);
        // var btn_bu = ccui.helper.seekWidgetByName(this.panel_replay, "btn_bu");
        // btn_bu.setTag(OPERATIONTYPE.BUZHANG);
        var btn_guo = ccui.helper.seekWidgetByName(this.panel_replay, "btn_guo");
        btn_guo.setTag(OPERATIONTYPE.GUO);
        var btn_hu = ccui.helper.seekWidgetByName(this.panel_replay, "btn_hu");
        btn_hu.setTag(OPERATIONTYPE.HU);
        var btn_ting = ccui.helper.seekWidgetByName(this.panel_replay, "btn_ting");
        btn_ting.setTag(OPERATIONTYPE.TING);

        var image_finger = ccui.helper.seekWidgetByName(this.panel_replay, "image_finger");
        image_finger.setTag(101);
        image_finger.setVisible(false);
    },
    onEnter: function () {
        this._super();
        this.initUI();
    },

    onExit: function () {
        this._super();

        this.removeRecordEvent();
        this.removeAllParam();

    },

    recordOfHandCard: function () {
        return null;
    },

    showRecordControlPanel: function (data) {
        for (var j = 1; j < 7; j++) {
            if (this.panel_replay.getChildByTag(j) != null) {
                this.panel_replay.getChildByTag(j).setEnabled(true);
                this.panel_replay.getChildByTag(j).setBright(true);
            }
        }

        var info = data;
        this.panel_replay.getChildByTag(OPERATIONTYPE.CHI).setEnabled(info['chi'].length > 0 ? true : false);
        this.panel_replay.getChildByTag(OPERATIONTYPE.CHI).setBright(info['chi'].length > 0 ? true : false);

        this.panel_replay.getChildByTag(OPERATIONTYPE.PENG).setEnabled(info['peng'] > 0 ? true : false);
        this.panel_replay.getChildByTag(OPERATIONTYPE.PENG).setBright(info['peng'] > 0 ? true : false);

        this.panel_replay.getChildByTag(OPERATIONTYPE.GANG).setEnabled(info['gang'].length > 0 ? true : false);
        this.panel_replay.getChildByTag(OPERATIONTYPE.GANG).setBright(info['gang'].length > 0 ? true : false);

        // this.panel_replay.getChildByTag(OPERATIONTYPE.BUZHANG).setEnabled(info['bu'].length > 0 ? true : false);
        // this.panel_replay.getChildByTag(OPERATIONTYPE.BUZHANG).setBright(info['bu'].length > 0 ? true : false);

        // this.panel_replay.getChildByTag(OPERATIONTYPE.BUZHANG).setEnabled(info['ting'] ? info['ting'].length : info['ting'] ? true : false);
        // this.panel_replay.getChildByTag(OPERATIONTYPE.BUZHANG).setBright(info['ting'] ? info['ting'].length : info['ting'] ? true : false);

        this.panel_replay.getChildByTag(OPERATIONTYPE.TING).setEnabled(info['ting'] ? info['ting'].length:info['ting'] ? true : false);
        this.panel_replay.getChildByTag(OPERATIONTYPE.TING).setBright(info['ting'] ? info['ting'].length:info['ting'] ? true : false);

        this.panel_replay.getChildByTag(OPERATIONTYPE.HU).setEnabled(info['hu'] > 0 ? true : false);
        this.panel_replay.getChildByTag(OPERATIONTYPE.HU).setBright(info['hu'] > 0 ? true : false);

        this.panel_replay.getChildByTag(OPERATIONTYPE.GUO).setEnabled(info['guo'] > 0 ? true : false);
        this.panel_replay.getChildByTag(OPERATIONTYPE.GUO).setBright(info['guo'] > 0 ? true : false);

        this.panel_replay.setVisible(true);
        if (data['end'] != undefined) {
            this.postNextStep();
        }
    },
    runRecordOpAction: function (data) {
        var opType = data['opType'];
        var tPos = cc.p(0, 0);
        var btn = null;
        switch (opType) {
            case OPERATIONNAME.GUO:
                btn = this.panel_replay.getChildByTag(OPERATIONTYPE.GUO);
                break;
            case OPERATIONNAME.GANG:
                btn = this.panel_replay.getChildByTag(OPERATIONTYPE.GANG);
                break;
            case OPERATIONNAME.PENG:
                btn = this.panel_replay.getChildByTag(OPERATIONTYPE.PENG);
                break;
            case OPERATIONNAME.CHI:
                btn = this.panel_replay.getChildByTag(OPERATIONTYPE.CHI);
                break;
            // case OPERATIONNAME.BUZHANG:
            //     btn = this.panel_replay.getChildByTag(OPERATIONTYPE.BUZHANG);
            //     break;
            case OPERATIONNAME.TING:
                btn = this.panel_replay.getChildByTag(OPERATIONTYPE.TING);
                break;
            case OPERATIONNAME.HU:
                btn = this.panel_replay.getChildByTag(OPERATIONTYPE.HU);
                break;
            default:
                break;
        }
        tPos = btn.getPosition();
        btn.setScale(1.0);
        var image_finger = ccui.helper.seekWidgetByName(this.panel_replay, "image_finger");
        image_finger.setVisible(true);
        image_finger.setOpacity(255);
        image_finger.setPosition(tPos);
        image_finger.setScale(1.2);
        image_finger.runAction(cc.sequence(
            cc.scaleTo(0.1, 1.0),
            cc.delayTime(0.3),
            cc.fadeOut(0.1)));

        if (data['end'] != undefined) {
            btn.runAction(cc.sequence(cc.delayTime(0.2),
                cc.scaleTo(0.15, 0.8), cc.scaleTo(0.15, 1.0),
                cc.delayTime(0.3),
                cc.callFunc(this.postNextStep.bind(this)),
                cc.callFunc(this.disMissRecordControl.bind(this))));
        } else {
            btn.runAction(cc.sequence(cc.delayTime(0.2),
                cc.scaleTo(0.15, 0.8), cc.scaleTo(0.15, 1.0),
                cc.delayTime(0.3),
                cc.callFunc(this.disMissRecordControl.bind(this))));
        }
    },

    runRecordOpResultAction: function (data) {
        var opType = data['opType'];
        switch (opType) {
            case OPERATIONNAME.GUO: {
                if (data['uid'] == this.uid) this.postNextStep();
            }
                break;
            case OPERATIONNAME.PENG: {
                if (data['uid'] == this.uid) {
                    var soundData = {};
                    soundData['userSex'] = this.sexType;
                    soundData['optionType'] = opType;
                    sound.playOption(soundData);
                    this.playTipAnimation(opType);

                    this.recordPengResp(data);
                }

                if (data['sourceUid'] == this.uid) {
                    this.recordPengedResp(data);
                }

            }
                break;
            case OPERATIONNAME.CHI: {
                if (data['uid'] == this.uid) {
                    var soundData = {};
                    soundData['userSex'] = this.sexType;
                    soundData['optionType'] = opType;
                    sound.playOption(soundData);
                    this.playTipAnimation(opType);

                    this.recordChiResp(data);
                }

                if (data['sourceUid'] == this.uid) {
                    this.recordChiedResp(data);
                }
            }
                break;
            case OPERATIONNAME.GANG:
            case OPERATIONNAME.BUZHANG: {
                if (data['uid'] == this.uid) {
                    var soundData = {};
                    soundData['userSex'] = this.sexType;
                    soundData['optionType'] = opType;
                    sound.playOption(soundData);
                    this.playTipAnimation(opType);

                    this.recordBuzhangResp(data);
                }

                if (data['sourceUid'] == this.uid) {
                    this.recordBuzhangedResp(data);
                }
            }
                break;

            case OPERATIONNAME.TING: {
                if (data['uid'] == this.uid) {
                    var soundData = {};
                    soundData['userSex'] = this.sexType;
                    soundData['optionType'] = opType;
                    sound.playOption(soundData);
                    this.playTipAnimation(opType);
                    this.postNextStep();
                }
            }
                break;
            case OPERATIONNAME.HU: {
                if (data['uid'] == this.uid) {
                    var soundData = {};
                    soundData['userSex'] = this.sexType;
                    soundData['optionType'] = opType;
                    sound.playOption(soundData);
                    this.playTipAnimation(opType);
                    this.recordHu(data);
                }
            }
                break;
            default:
                break;
        }
    },
    disMissRecordControl: function () {
        this.panel_replay.setVisible(false);
    },
    postNextStep: function (dt) {
        var dtime = 0.1;
        if (dt != undefined) dtime = dt;
        this.schedule(this.delayStep, dtime);
    },

    delayStep: function (dt) {
        this.unschedule(this.delayStep);
        XYGLogic.record.postNextStep();
    },

    //吃碰的
    recordPengResp: function (data) {
        JJLog.print('recordPengResp');
        JJLog.print(data);
        var opCard = data['opCard'];
        var opCardStr = this.cardOfString(opCard);
        var index = 0;

        for (var k = this.cardInArray.length - 1; k >= 0; k--) {
            var tmpCard2 = this.cardInArray[k].key;
            if (opCardStr == tmpCard2) {
                this.cardInArray[k].removeFromParent();
                this.cardInArray.splice(k, 1);
                index++;
                if (index >= 2) {
                    break;
                }
            }
        }

        this.addPengCardsPanel(opCard, data['sourceChair']);
        this.postNextStep(0.2);

        this.resetPanelInChild();
    },

    //被碰的
    recordPengedResp: function (data) {
        JJLog.print('recordPengedResp');
        JJLog.print(data);
        var opCardStr = this.cardOfString(data['opCard']);
        this.recordRemoveOutCard(opCardStr)

    },


    //吃吃的
    recordChiResp: function (data) {
        JJLog.print('recordChiResp');
        var cards = data['cards'];
        var opCard = data['opCard'];
        var opCardStr = this.cardOfString(opCard);

        var tmpCards = data['cards'];

        var index = 0;
        for (var i = 0; i < cards.length; i++) {
            var tmpCard = this.cardOfString(cards[i]);
            if (opCardStr == tmpCard) {
                continue;
            }
            for (var k = this.cardInArray.length - 1; k >= 0; k--) {
                var tmpCard2 = this.cardInArray[k].key;
                if (tmpCard == tmpCard2) {
                    this.cardInArray[k].removeFromParent();
                    this.cardInArray.splice(k, 1);
                    break;
                    //index++;
                    //if (index >= 2) {
                    //  break;
                    //}
                }
            }
        }

        this.addChiCardsPanel(cards);
        this.resetPanelInChild();
        this.postNextStep();
    },

    //被吃的
    recordChiedResp: function (data) {
        JJLog.print('recordChiedResp');
        var opCardStr = this.cardOfString(data['opCard']);
        this.recordRemoveOutCard(opCardStr)
    },

    recordRemoveOutCard: function (cardStr) {
        if (cardStr['type'] != undefined) cardStr = this.cardOfString(cardStr);
        for (var i = this.cardOutArray.length - 1; i >= 0; i++) {
            var card = this.cardOutArray[i];
            if (cardStr == card.key) {
                card.removeFromParent();
                this.cardOutArray.splice(i, 1);
                break;
            }
        }
    },

    recordRemoveHandCard: function (cardObj, removeAll) {
        if (this.moCard != null) {
            this.cardInArray.push(this.moCard);
            this.moCard = null;
        }
        var cardStr = this.cardOfString(cardObj);
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            var tmpCard = card.key;
            if (tmpCard == cardStr) {
                this.cardInArray.splice(i, 1);
                card.removeFromParent();
                if (removeAll == undefined || removeAll == false)
                    break;
            }
        }
    },

    recordRemovePengCard: function (cardObj) {
        var key = this.cardOfString(cardObj);
        for (var i = 0; i < this.pengArray.length; i++) {
            var tmpCard = this.pengArray[i];
            var tmpKey = tmpCard['type'] + tmpCard['value'];
            if (key == tmpCard) {
                this.pengArray.splice(i, 1);
                var panel = this.pengPanelArray[i];
                panel.removeFromParent();
                this.pengPanelArray.splice(i, 1);
                break;
            }
        }
    },

    recordRemoveHandGangCards: function (data) {
        this.recordRemoveOutCard(data['opCard']);
    },


    recordBuzhangResp: function (data) {
        var opCard = data['opCard'];
        this.recordRemoveHandinBuzhangCards(data);
        this.addBuzhangCardsPanel(opCard, data.origin);
        this.resetPanelInChild();
        this.postNextStep();
    },

    recordBuzhangedResp: function (data) {
        this.recordRemoveHandinBuzhangCards(data);
        this.resetPanelInChild();
    },

    recordRemoveHandinBuzhangCards: function (data) {

        var msg = data;
        var opType = msg["opType"];
        var opCard = msg["opCard"];
        var cards = msg["cards"];
        var gang_type = msg.origin;
        var tCards = [].concat(opCard);

        switch (gang_type) {
            case OPER_GANG_TYPE.GANG_AN: {
                this.recordRemoveHandCard(tCards[0], true);
            }
                break;
            case OPER_GANG_TYPE.GANG_OTHER:
            case OPER_GANG_TYPE.GANG_MING: {
                this.recordRemoveHandCard(tCards[0], true);
                this.recordRemovePengCard(tCards[0]);
            }
                break;
            case OPER_GANG_TYPE.GANG_JTF:
            case OPER_GANG_TYPE.GANG_J1:
            case OPER_GANG_TYPE.GANG_T1:
            case OPER_GANG_TYPE.GANG_T9:
            case OPER_GANG_TYPE.GANG_F1:
            case OPER_GANG_TYPE.GANG_BU: {
                for (var i = 0; i < tCards.length; i++) {
                    left_pos = this.recordRemoveHandCard(tCards[i]);
                }
            }
                break;
        }
    },

    recordHu: function (data) {
        this.postNextStep();
    },

    registerRecordEvent: function () {
        var _this = this;
        var ls = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.EVT_RECORD,
            callback: function (event) {
                var userData = event.getUserData();
                if (userData == null) return;
                var evtId = userData['type'];
                switch (evtId) {
                    case RecordType.READY: {
                        _this.postNextStep();
                    }
                        break;
                    case RecordType.SEND: {
                        var uid = userData['uid'];
                        if (_this.uid == uid) {
                            _this.playRecordSend(userData['pai']);
                        }
                    }
                        break;
                    case RecordType.MO: {
                        var uid = userData['uid'];
                        if (_this.uid == uid) {
                            _this.playRecordMoCard(userData['pai']);
                        }
                    }
                        break;
                    case RecordType.NOTIFY_OP: {
                        var typeData = userData['notifyOP'];
                        for (var i = 0; i < typeData.length; i++) {
                            if (i == typeData.length - 1) {
                                typeData[i]['end'] = 1;
                            }
                            var uid = typeData[i]['uid'];
                            if (_this.uid == uid) {
                                _this.showRecordControlPanel(typeData[i]);
                            }
                        }
                    }
                        break;
                    case RecordType.SYSC_OP: {
                        var typeData = userData['syncOP'];
                        for (var i = 0; i < typeData.length; i++) {
                            if (i == typeData.length - 1) {
                                typeData[i]['end'] = 1;
                            }
                            var uid = typeData[i]['uid'];
                            if (_this.uid == uid) {
                                _this.runRecordOpAction(typeData[i]);
                            }
                        }
                    }
                        break;
                    case RecordType.SYSC_OP_RESULT: {
                        _this.disMissRecordControl();
                        var typeData = userData['opResult'];
                        _this.runRecordOpResultAction(typeData);
                    }
                        break;
                    case RecordType.BIRD_CARDS: {
                        if(userData['niao']){
                            var typeData = userData['niao'];
                            var lastUid = typeData['lastUid'];
                            if (_this.uid == lastUid) {
                                _this.recordNiao(typeData);
                            }
                        }else if(userData['bao']){
                            qp.event.send("mjBaoPai" , {pai: userData['bao'] });
                            _this.postNextStep();
                        }
                    }
                        break;
                    case RecordType.BUHUA: {
                        var uid = userData['uid'];
                        if (_this.uid == uid) {
                            _this.runRecordBuhuaOpAction(userData['hua']);
                        }
                    }
                        break;
                    case RecordType.HengGang: {
                        _this.postNextStep();
                    }
                        break;
                }
            }
        });
        _this._Listener = cc.eventManager.addListener(ls, this);
    },

    removeRecordEvent: function () {
        if(this._Listener){
            cc.eventManager.removeListener(this._Listener);
        }
    },

    //记录=======================
    playRecordSend: function (cardObj) { },

    runRecordBuhuaOpAction: function (data) { },

    playRecordMoCard: function (data) { },

    recordMoCardPos: function () { },

    recordMoCard: function (data) { },

    recordPutOutCard: function (data) { },
};