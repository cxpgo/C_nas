var MJSelfSeatBase = MJDeskSeat.extend({
    panel_cardInTouch: null,
    panel_control: null,
    panel_guo: null,
    btn_guo: null,
    panel_controlCell: null,
    gangMode: false,
    gap_panel: 0,
    gap_cardStand: 0,
    delCard: null,
    qihu_tip: false,//弃胡提示
    btn_test: null,
    isAction: false,
    opArray: null,
    outArray: null,
    testNum: 0,
    isdahu: 0,
    huDate: null,
    chiGray: false,
    pengActionStatu: false,


    ctor: function (resFile, data) {
        this._super(data, 'selfseat');
        this.root = util.LoadUI(resFile).node;
        this.addChild(this.root);
        this.mOutDelWaitCard = null;
        this.opArray = new Array();
        this.outArray = new Array();

        this.deskType = DeskType.Player;

        this.gap_cardStand = 0;
        this.posXHandInCard = 0;
        this.posYHandInCard = 0;

        this.initLastEnd = true;
        this.isPauseAutoOutCardC = false; //用于标记 客户端模拟自动出牌检测

        this.schedule(this.updateTime, 0.5);
    },

    initUI: function () {
        this._super();
        if (MajhongInfo.MajhongNumber > 14) {
            this.pengPanel.setScale(CommonParam.My17CardShowScale);
        } else {
            this.pengPanel.setScale(CommonParam.My14CardShowScale);
        }
        this.gap_panel = this.pengPanel.getContentSize().width * 0.1 * this.pengPanel.getScale();

    },

    initSelfUI: function () {
        this.mCanPutCard = false;
        this.pengActionStatu = false;
        this.panel_cardInTouch = ccui.helper.seekWidgetByName(this.root, "panel_cardInTouch");
        this.panel_card_seat = ccui.helper.seekWidgetByName(this.root, "panel_card_seat");//ListView

        this.reset();

    },

    //暂停自动出牌检测
    onPauseAutoOutCard: function () {
        this.isPauseAutoOutCardC = true;
    },
    //恢复自动出牌检测
    onResumeAutoOutCard: function () {
        this.isPauseAutoOutCardC = false;
    },

    updateTime: function (dt) {
        if (!this.isAction && this.opArray.length > 0) {
            var data = this.opArray.shift();
            this.showControlPanel(data);
        }

        if (!this.isAction && this.outArray.length > 0 && !this.isPauseAutoOutCardC) {
            JJLog.print('自动打牌');
            var data = this.outArray.shift();
            if (this.gangMode || this.gangMode > 0) {
                this.autoPutOutCard();
            } else {
                this.setCardInTouchEnable(true);
            }
        }

    },

    onEnter: function () {
        this._super();
        this.initSelfUI();
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.registerSelfEvent();
            this.checkOffline();
        }
    },

    onExit: function () {
        this.moCard = null;
        this.removeSelfEvent();
        this._super();
    },

    registerSelfEvent: function () {
        qp.event.listen(this, 'mjPlayerMoCards', this.onMoCard.bind(this));
        qp.event.listen(this, 'mjNotifyPlayerOP', this.onNotifyPlayerOP.bind(this));
        qp.event.listen(this, 'mjNotifyDaHu', this.onNotifyDaHu.bind(this));
        qp.event.listen(this, 'mjNotifyTingChoice', this.onNotifyTingChoice.bind(this));

        qp.event.listen(this, 'mjSyncParams', this.onSyncParams.bind(this));

        qp.event.listen(this, 'appPauseAutoOutCard', this.onPauseAutoOutCard.bind(this));
        qp.event.listen(this, 'appResumeAutoOutCard', this.onResumeAutoOutCard.bind(this));

        var ls = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEventAction.BUHUA_EVT,
            callback: this.removeHuaPaiCards.bind(this)
        });
        cc.eventManager.addListener(ls, this);

        var ls3 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEventAction.PLAYEROP_EVT,
            callback: this.opEvent.bind(this)
        });
        cc.eventManager.addListener(ls3, this);
    },

    removeSelfEvent: function () {
        qp.event.stop(this, 'mjPlayerMoCards');
        qp.event.stop(this, 'mjNotifyPlayerOP');
        qp.event.stop(this, 'mjNotifyDaHu');
        qp.event.stop(this, 'mjNotifyTingChoice');
        qp.event.stop(this, 'mjSyncParams');

        qp.event.stop(this, 'appPauseAutoOutCard');
        qp.event.stop(this, 'appResumeAutoOutCard');
    },

    onNotifyDaHu: function (data) {
        // data.huType 1游金 2双游 3 三游 4三金倒  data.uid
        var huType = data['huType'];
        var uid = data['uid'];
        if (uid == this.uid && huType < 4) {
            this.isdahu = huType;
        }
    },

    onNotifyTingChoice: function (data) {

        if (this.moCard != null) {
            var tempArray = this.cardInArray.concat(this.moCard)
        } else {
            var tempArray = this.cardInArray;
        }
        this.huDate = data['tingChoice'];
        for (var i = 0; i < tempArray.length; i++) {
            var card = tempArray[i];
            var isGray = true;
            var hutype = 0;
            for (var j = 0; j < this.huDate.length; j++) {
                var tingDate = this.huDate[j];
                var del = tingDate['del'];

                if (!!del && del.type + del.value == card.paiOfCard().keyOfPai()) {
                    var jintype = tingDate['jin_type'];
                    if (!!jintype) {
                        hutype = jintype;
                    }

                    isGray = false;
                }
            }
            if (isGray) {
                //card.showGray();
            } else {
                card.showTingTip(hutype);
            }
        }
    },

    onShowMoPaiTingChoice: function (moCard) {

        //  {"uid":100003,"tingChoice":[{"del":{"type":"T","value":6},"hu":[],"num":[],"jin":1}]}#################2
        if (this.huDate != null && moCard != null) {
            var card = moCard;
            var isGray = true;
            var hutype = 0;
            for (var j = 0; j < this.huDate.length; j++) {
                var tingDate = this.huDate[j];
                var del = tingDate['del'];

                if (!!del && del.type + del.value == card.paiOfCard().keyOfPai()) {
                    var jintype = tingDate['jin_type'];
                    if (!!jintype) {
                        hutype = jintype;
                    }

                    isGray = false;
                }
            }
            if (isGray) {
                //card.showGray();
            } else {
                card.showTingTip(hutype);
            }
        }
    },

    setCardInTouchEnable: function (enable) {
        if (this.panel_cardInTouch != null) {
            this.panel_cardInTouch.setVisible(!enable);
        }
        this.mCanPutCard = enable;
    },

    onSyncPlayerMocards: function (data) {
        JJLog.print('self onSyncPlayerMocards');
    },

    setHandCards: function (data) {
        this.panel_cardIn.removeAllChildren();
        for (var p in data) {
            this.addCardIn(data[p]);
        }
        this.resetPanelInChild();
    },

    onNotifyDelCards: function (data) {
        JJLog.print("onNotifyDelCards uid :" + JSON.stringify(data));
        if (data["uid"] != hall.user.uid) {
            this.setCardInTouchEnable(false);
            return;
        }
        if (this.gangMode || this.gangMode > 0) {
            this.autoPutOutCard(this.moCard);
        } else {
            this.setCardInTouchEnable(true);
        }
    },

    onMoCard: function (data) {
        JJLog.print("onMoCard");
        this.addMoCard(data);
    },

    onNotifyPlayerOP: function (data) {
        JJLog.print("onNotifyPlayerOP");
        if (data["uid"] != hall.user.uid) return;
        JJLog.print(JSON.stringify(data));
        this.opArray.push(data);
        //this.showControlPanel(data);
    },

    synPlayerOp: function (data) {
        this._super(data);
        this.dismissControlPanel();
    },

    onSyncDelCards: function (data) {
        JJLog.print('sync self del card');
        if (data.uid == this.uid) {

            if (this.huDate != null) {
                for (var i = 0; i < this.cardInArray.length; i++) {
                    var handCard = this.cardInArray[i];
                    handCard.showWhite();
                }
                // this.panel_ting_tips.setVisible(false);
                // qp.event.send('appPluginHuTipsClose', {});
                this.huDate = null;
                this.postGangMode();
            }
            var card;
            if (this.mOutDelWaitCard != null) {
                if (this.mOutDelWaitCard.paiOfCard().type === data.msg.type && this.mOutDelWaitCard.paiOfCard().value === data.msg.value) {
                    card = this.mOutDelWaitCard;
                } else {
                    card = this.getOneCardForHandCards(data.msg);
                }
            } else {
                card = this.getOneCardForHandCards(data.msg);
            }
            if (!card) return;

            var _pai = card.paiOfCard().keyOfPai();
            var soundData = {};
            soundData['cardType'] = _pai;
            soundData['userSex'] = this.sexType;
            sound.playCard(soundData);
            if (card != null) {
                card.end_pos = card.getPosition();
            }
            this.putOutCardAnimation(card);
            var cardCount = this.getCardCount();
            if (cardCount != MajhongInfo.MajhongNumber - 1) {
                this.forceDisconnect();
            }

            this.mOutDelWaitCard = null;
            this.setCardInTouchEnable(false);
        }
    },

    initLastCards: function () {
        this.initLastEnd = false;
        this._super();
        
        var info = XYGLogic.table.getCardByPlayer(this.uid);
        this.gangMode = info['isGang'];
        if (this.uid == XYGLogic.table.offLineInfo['nextChuPai']) {
            var data = { 'uid': this.uid };
            this.onNotifyDelCards(data);
        }

        if (XYGLogic.table.offLineInfo != null && XYGLogic.table.offLineInfo['currOp']['isOp'] != 0) {
            this.showControlPanel(XYGLogic.table.offLineInfo['currOp']);
        }
        if (info['paiLast'] != undefined && info['paiLast'] != null) {
            var lastCard = info['paiLast'];
            this.resetMoPai(lastCard);
        }
        
        this.initLastEnd = true;
    },

    resetMoPai: function (cardObj) {
        
        var moIndex = this.getIndexHandInCard(cardObj);
        if (moIndex != undefined) {
            var card = this.cardInArray.splice(moIndex, 1)[0];
            this.resetPanelInChild();
            //必须在这里  删除牌之后 moCard这只之前
            var moPos = this.posMoOfPanel();

            this.moCard = card;

            this.moCard.setPosition(moPos);
            this.moCard.setCardPosition(moPos);
            if (this.gangMode == 1) {
                this.postGangMode();
                this.setCardInTouchEnable(false);
                this.autoPutOutCard();
            }
        }
    },


    addCardIn: function (cardObj) {
        //TODO
    },

    addCardOut: function (cardObj) {
        //TODO
    },

    postGangMode: function () {
        var event = new cc.EventCustom(CommonEvent.EVT_DESK_MODE);
        event.setUserData(CommonEventAction.GANG_EVT);
        cc.eventManager.dispatchEvent(event);
    },

    addMoCard: function (data) {
        //TODO
    },

    putOutCardStart: function (card) {
        var currGame = hall.getPlayingGame().table;
        if (!this.mCanPutCard && MajhongInfo.GameMode == GameMode.PLAY) {
            return false;
        }

        if (MajhongInfo.GameMode == GameMode.PLAY) {
            //查看手牌中是否有定缺牌 要强行先打出
            if (this.searchQueInHandCard() && card.paiOfCard().type != currGame.playerQue) {
                return false;
            }
        }

        if (this.huDate != null) {
            for (var i = 0; i < this.cardInArray.length; i++) {
                var handCard = this.cardInArray[i];
                handCard.showWhite();
            }
            // this.panel_ting_tips.setVisible(false);
            qp.event.send('appPluginHuTipsClose', {});
            if (this.gangMode == 1 && this.huDate != null) {
                this.reqTingOp(card);
                return;
            }
            this.huDate = null;
        }
        if (this.moCard != null) {
            this.moCard.hideTingTip();
        }
        this.setCardInTouchEnable(false);
        this.mOutDelWaitCard = card;
        var cardData = card.paiOfCard().objectOfPai();


        if (MajhongInfo.GameMode == GameMode.RECORD) {
            var _pai = card.paiOfCard().keyOfPai();
            var soundData = {};
            soundData['cardType'] = _pai;
            soundData['userSex'] = this.sexType;
            sound.playCard(soundData);
            this.putOutCardAnimation(card);
        }
        this.postOutCard(cardData);
        return true;
    },

    reqTingOp: function (card) {
        var _this = this;
        var cellData = {};
        cellData["opType"] = OPERATIONNAME.TING;
        cellData["opCard"] = {};
        cellData["index"] = -1;
        XYGLogic.net.updatePlayerOp(cellData, this.reqTingOpEnd.bind(this, card));
    },

    reqTingOpEnd: function (card, data) {
        var _this = this;
        if (data["code"] == 200) {
            for (var i = 0; i < _this.cardInArray.length; i++) {
                var handCard = _this.cardInArray[i];
                handCard.showWhite();
            }
            var cardData = card.paiOfCard().objectOfPai();
            qp.event.send('appPluginHuTipsOpen', {});
            this.postGangMode();
            // var event = new cc.EventCustom(CommonEvent.TipEvent);
            // event.setUserData(card.key);
            // cc.eventManager.dispatchEvent(event);
            this.huDate = null;
            this.postOutCard(cardData);
        }
    },


    postOutCard: function (data2) {
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            XYGLogic.net.updatePlayerDelCard(data2, function (data) {
                if (data["code"] == 200) {

                    if (this.chiGray == true) //打牌以后切换成能打状态
                    {
                        for (var i = 0; i < this.cardInArray.length; i++) {
                            this.cardInArray[i].showWhite();
                        }
                        this.chiGray = false;
                        // this.noDelPaiFun();
                    }
                } else {
                    this.forceDisconnect();
                }
                JJLog.print("put out card resp");
                JJLog.print(JSON.stringify(data));
            }.bind(this));
        }

    },

    posIndexOfOutCard: function () {
        var num = this.cardOutArray.length;
        var width = 0;
        var height = 0;
        var a = [0, 46, 91, 139, 184, 229];
        if (num > 0) {
            var card = this.cardOutArray[0];
            //46 91 137 184 230
            width = card.getContentSize().width * card.getScale() * CommonParam.DownCardGap; // 500  546  591 637  684  730
            height = card.getContentSize().height * card.getScale() * CommonParam.DownCardHeightGap;
        }

        if (MajhongInfo.MajhongNumber > 14) {
            var index = num % CommonParam.DeskOneNum;
            var floor = Math.floor(num / CommonParam.DeskOneNum);
            return cc.p(index * width - 15, height * floor - 10); //3 - 1.25*i
        } else {
            var index = num % CommonParam.DeskOneNum;
            var floor = Math.floor(num / CommonParam.DeskOneNum);
            return cc.p(a[index], -height * floor);
        }
    },

    //摸牌位置
    posMoOfPanel: function (isAbs) {
        // this.resetPanelInChild();
        var card = this.getHandLastCard();
        if(card){
            var cardPos = isAbs ? card.getCardPosition() : card.getPosition();
            return cc.p(cardPos.x + this.gap_stand + this.gap_stand * this.gap_moCard, cardPos.y);
        }
        return cc.p(this.gap_stand * 0 - this.gap_cardStand * 0, 0);
    },

    removePutOutCard: function (data) {


    },

    putOutCardAnimation: function (card) {
        //TODO
    },

    autoPutOutCard: function () {
        if (this.moCard != null) {
            this.delAndPutCard(this.moCard);
        }
    },

    delAndPutCard: function (card) {
        if (!card) return;
        var paiData = card.paiOfCard().objectOfPai();


        this.runAction(cc.sequence(cc.delayTime(0.2),
            cc.callFunc(this.autoSelect.bind(this, card)),
            cc.delayTime(0.2),
            cc.callFunc(this.autoPutOut.bind(this, card)),
            cc.delayTime(0.2),
            cc.callFunc(this.autoDelCard.bind(paiData))
        ));
    },

    autoSelect: function () {
        if (this.moCard != null) {
            this.moCard.playSelectedAnimation(true);
        }
    },

    autoPutOut: function () {
        if (!this.moCard) return;

        // var soundData = {};
        // JJLog.print("打牌=" + this.moCard);
        // soundData['cardType'] = this.moCard.paiOfCard().keyOfPai();
        // soundData['userSex'] = this.sexType;
        // sound.playCard(soundData);
        // this.putOutCardAnimation(this.moCard);
        this.putOutCardStart(this.moCard);
    },

    autoDelCard: function () {
        XYGLogic.net.updatePlayerDelCard(this, function (data) {

        }.bind(this));

    },

    putOutCardEnd: function (card) {
        JJLog.print("@@@@@@@@@@@@@@putOutCardEnd", card, this.moCard, this.cardInArray);
        if (card == this.moCard) {
            this.moCard.removeFromParent();
            this.moCard = null;
        } else {
            if (this.moCard == null) {
                this.moCard = this.cardInArray.splice(this.cardInArray.length - 1, 1)[0];
            }
            this.addNewHandCard(this.moCard, card);
            this.removeOutHandCard(card);
            this.playMoPaiInsertCardAnimation(this.moCard);
            this.moCard = null;
        }
    },

    addNewHandCard: function (moCard, daCard) {
        JJLog.print("@@@@@@@@@@@@@@addNewHandCard", moCard, daCard, this.cardInArray);
        this.insetMoCard(moCard);
        this.playInsertCardAnimation(moCard, daCard);
    },

    insetMoCard: function (moCard) {
        var currGame = hall.getPlayingGame().table;

        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            if (moCard.getCardJin() > card.getCardJin()) {
                this.cardInArray.splice(i, 0, moCard);
                return;
            } else if (moCard.getCardJin() == card.getCardJin()) {
                if (currGame.isQueCard && (currGame.isQueCard(moCard) || currGame.isQueCard(card))) {
                    if (currGame.isQueCard(moCard)) {
                        if (currGame.isQueCard(card)) {
                            if (card.paiOfCard().numOfPai() > moCard.paiOfCard().numOfPai()) {
                                this.cardInArray.splice(i, 0, moCard);
                                return;
                            }
                        }
                    } else {
                        this.cardInArray.splice(i, 0, moCard);
                        return;
                    }
                }
                else {
                    if (card.paiOfCard().numOfPai() > moCard.paiOfCard().numOfPai()) {
                        this.cardInArray.splice(i, 0, moCard);
                        return;
                    }
                }

            }
        }
        this.cardInArray.push(moCard);
    },

    playInsertCardAnimation: function (moCard, daCard) {
        var move_cards = new Array();
        var move_type;
        var mo_pos;
        var da_pos;
        var size = moCard.getContentSize();
        for (var i = 0; i < this.cardInArray.length; i++) {
            var tmpCard = this.cardInArray[i];
            if (tmpCard == daCard) {
                da_pos = i;
            }
            if (tmpCard == moCard) {
                mo_pos = i;
            }
        }
        JJLog.print("mo_pos, da_pos", mo_pos, da_pos, size);
        var _result = mo_pos - da_pos;
        if (_result == 1 || _result == -1) {
            return;
        }
        if (mo_pos < da_pos) {
            move_cards = this.cardInArray.slice(mo_pos + 1, da_pos);
            move_type = "RIGHT";
        } else {
            move_cards = this.cardInArray.slice(da_pos + 1, mo_pos);
            move_type = "LEFT";
        }
        JJLog.print("@@@@@@@@@@@@@@2move_card", move_cards, move_type)
        for (var j = 0; j < move_cards.length; j++) {
            if (move_type == "LEFT") {
                move_cards[j].runAction(cc.moveBy(CommonParam.handCardMoveTime, -this.gap_stand, 0));
            } else if (move_type == "RIGHT") {
                move_cards[j].runAction(cc.moveBy(CommonParam.handCardMoveTime, this.gap_stand, 0));
            }
        }
    },

    playMoPaiInsertCardAnimation: function (moCard) {
        //TODO
    },


    opEvent: function (event) {
        var data = event.getUserData();
        JJLog.print("触摸=" + JSON.stringify(data));
        this.isAction = data;
        if (this.isAction) {
            this.setCardInTouchEnable(false);
        }
        // else
        //{
        //  this.setCardInTouchEnable(true);
        //}
    },

    removeHuaPaiCards: function (event) {
        //TODO
    },
    //---------quanzhou-----------

    removeOutHandCard: function (card) {
        for (var i = 0; i < this.cardInArray.length; i++) {
            var tmpCard = this.cardInArray[i];
            if (tmpCard == card) {
                this.cardInArray.splice(i, 1);
                card.removeFromParent();
                break;
            }
        }
    },

    playPengAction: function (panelPeng) {
        if (!this.initLastEnd) {
            return;
        };
        var orgPos = cc.p(0, 0);
        var initPos = cc.p(0, 0);
        this.pengActionStatu = true;
        var self = this;

        var actFunc2 = function () {
            panelPeng.runAction(
                cc.sequence(
                    cc.delayTime(CommonParam.pengPaisStopTime),
                    cc.moveTo(CommonParam.pengPaisMoveTime, orgPos.x, orgPos.y),
                    cc.callFunc(function () {
                        self.pengActionStatu = false;
                    })
                )
            );
        }

        var actFunc1 = function () {
            panelPeng.runAction(
                cc.sequence(
                    cc.delayTime(1 / 60),
                    cc.callFunc(function () {
                        self.playHandCardAction();

                        var pos = cc.p(self.posCenterPengShow.x - panelPeng.getContentSize().width / 2, self.posCenterPengShow.y);
                        pos = self.node_pos_center.parent.convertToWorldSpace(pos);
                        initPos = panelPeng.parent.convertToNodeSpace(pos);

                        orgPos = panelPeng.getPosition();//this.getPengPaiInsetPos(panelPeng);
                        ///cc.p(orgPos.x + 100, orgPos.y + 100);
                        panelPeng.setPosition(initPos);

                        actFunc2();
                    })
                )
            )
        }

        actFunc1();

        // this.playHandCardAction();
    },

    playHandCardAction: function () {

        this.resetPanelInChild(true, true);
    },


    removePengCards: function (data) {
        var msg = data["msg"];
        var opType = msg["opType"];
        var opCard = msg["opCard"];
        var cards = msg["cards"];
        var key = opCard["type"] + opCard["value"];
        var right_pos;
        var left_pos;
        var index = 0;
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            if (key == card.paiOfCard().keyOfPai() && index < 2) {
                this.cardInArray.splice(i, 1);
                card.removeFromParent();
                index++;
                if (index == 1) {
                    right_pos = i;
                }
                if (index >= 2) {
                    left_pos = i;
                    break;
                }
            }
        }
        // this.playHandCardAction(left_pos, right_pos, 1);
    },

    addBuzhangCardsPanel: function (cardObjs, gang_type, sourceChair) {
        var TData = {
            numPanel: this.getShowPanelCount(),
        };

        var panelPeng = null;
        switch (gang_type) {
            case OPER_GANG_TYPE.GANG_AN:
            case OPER_GANG_TYPE.GANG_OTHER:
            case OPER_GANG_TYPE.GANG_MING: {
                var cards = [].concat(cardObjs);
                for (var i = 0; i < cards.length; i++) {
                    var cardObj = cards[i];
                    var key = cardObj['type'] + cardObj['value'];
                    this.removePengCardSetByKey(key, TData);
                }
                panelPeng = this.createPengCardSetForGang(cards[0], gang_type, sourceChair);

            }
                break;
            case OPER_GANG_TYPE.GANG_JTF:
            case OPER_GANG_TYPE.GANG_J1:
            case OPER_GANG_TYPE.GANG_T1:
            case OPER_GANG_TYPE.GANG_T9:
            case OPER_GANG_TYPE.GANG_F1:
            case OPER_GANG_TYPE.GANG_BU: {
                var cards = [].concat(cardObjs);

                var cards = SetGangCardNums(cards);

                if (cards.length == 1) { //添加蛋牌
                    this.appendCardDanForPengCardSet(cards[0], gang_type, sourceChair);
                } else {
                    panelPeng = this.createPengCardSetForDan(cards, gang_type, sourceChair);
                }
            }
                break;
        }
        if (panelPeng) {
            var numPanel = TData.numPanel;
            panelPeng.index = numPanel;
            panelPeng.gang_type = gang_type;

            panelPeng.setVisible(true);

            // this.panel_card_seat.insertCustomItem(panelPeng, numPanel);
            this._insertPanelCardSeat(panelPeng, numPanel);

            panelPeng.width *= panelPeng.getScale();
            panelPeng.height *= panelPeng.getScale();

            this.buzhangArray.push(cardObj);
            this.buzhangPanelArray.push(panelPeng);

            this.playPengAction(panelPeng);
            // this.playHandCardAction();
        }
        this.panel_card_seat.updateSizeAndPosition();
        return panelPeng;
    },


    addChiCardsPanel: function (cardArray) {
        var numPanel = this.getShowPanelCount();
        var panelPeng = this.createCardSetPanelForChi(cardArray);
        if (panelPeng) {
            panelPeng.index = numPanel;

            // this.panel_card_seat.insertCustomItem(panelPeng, numPanel);
            this._insertPanelCardSeat(panelPeng, numPanel);
            panelPeng.setVisible(true);
            panelPeng.width *= panelPeng.getScale();
            panelPeng.height *= panelPeng.getScale();

            this.chiPanelArray.push(panelPeng);
            this.chiArray.push(cardArray);

            this.playPengAction(panelPeng);

        }
    },

    addPengCardsPanel: function (cardObj, sourceChair, robbedShow) {
        var numPanel = this.getShowPanelCount();
        var panelPeng = this.createCardSetPanelForPeng(cardObj, sourceChair, robbedShow);
        if (panelPeng) {
            panelPeng.index = numPanel;
            // this.panel_card_seat.insertCustomItem(panelPeng, numPanel);
            this._insertPanelCardSeat(panelPeng, numPanel);
            panelPeng.setVisible(true);
            panelPeng.width *= panelPeng.getScale();
            panelPeng.height *= panelPeng.getScale();
            this.pengArray.push(cardObj);
            this.pengPanelArray.push(panelPeng);

            this.playPengAction(panelPeng);
        }
    },

    pengPanelAddTo: function (arrMgr, panelPeng, addIndex) {
        this._insertPanelCardSeat(panelPeng, addIndex);
        panelPeng.setVisible(true);
        panelPeng.width *= panelPeng.getScale();
        panelPeng.height *= panelPeng.getScale();
        arrMgr.push(panelPeng);

        this.playPengAction(panelPeng);
    },

    //处理杠时的牌行
    createPengCardSetForGang: function (cardObj, gang_type, sourceChair) {
        var pengPanel = this.pengPanel.clone();
        for (var i = 0; i < 4; i++) {
            var card = this.appendCardToPengPanel(pengPanel, cardObj, i);
            // var card = MJCardShowUp.create3D(cardObj);
            if (i == 3) {
                var centerCard = pengPanel.getChildByTag(1);
                card.x = centerCard.x;
                card.y = centerCard.y +  centerCard.height* 0.17;

                if (gang_type == OPER_GANG_TYPE.GANG_OTHER && sourceChair == 1) {
                    card.showBlue();
                }
                card.setLocalZOrder(centerCard.getLocalZOrder() + 10);
            } else {
                // card.x = (panelPeng.getContentSize().width / 3) * i;
                // card.y = 0;
                if (gang_type == OPER_GANG_TYPE.GANG_AN) {
                    card.SetBack();
                }
                if (gang_type == OPER_GANG_TYPE.GANG_OTHER) {
                    if (i == 0 || i == 2) {
                        if (sourceChair == i) {
                            card.showBlue();
                        }
                    }
                }
            }
            // panelPeng.addChild(card, i);
        }
        return pengPanel;
    },
    /**
     * 创建蛋牌
     */
    createPengCardSetForDan: function (cards, gang_type, sourceChair) {
        var pengPanel = this.pengPanel.clone();
        pengPanel.isSizeAdd = true;
        for (var i = 0; i < cards.length; i++) {
            this.appendCardToPengPanel(pengPanel, cards[i], i , i == (cards.length - 1));
        }
        pengPanel.isSizeAddScale = true;
        return pengPanel;
    },

    createCardSetPanelForPeng: function (cardObj, sourceChair) {
        var pengPanel = this.pengPanel.clone();

        for (var i = 0; i < 3; i++) {
            var card = this.appendCardToPengPanel(pengPanel, cardObj, i);
            if (sourceChair != undefined && sourceChair != null && sourceChair == i) {
                card.showBlue();
            }
        }
        return pengPanel;
    },

    createCardSetPanelForChi: function (cardArray) {
        var panelCell = this.pengPanel.clone();
        for (var i = 0; i < cardArray.length; i++) {
            var card = this.appendCardToPengPanel(panelCell, cardArray[i], i)
            if (i == 1) {
                card.showBlue();
            }
        }
        return panelCell;
    },


    addHu: function (msg) {
        //TODO
    },

    removeBuzhangCards: function (data, newPengPanel) {
        var msg = data["msg"];
        var opType = msg["opType"];
        var opCard = msg["opCard"];
        var cards = msg["cards"];
        var ganeType = msg.origin;
        var tCards = [].concat(opCard);

        switch (ganeType) {
            case OPER_GANG_TYPE.GANG_AN:
            case OPER_GANG_TYPE.GANG_OTHER:
            case OPER_GANG_TYPE.GANG_MING: {
                left_pos = this.removeHandInCard(tCards[0]);
                while (left_pos) {
                    left_pos = this.removeHandInCard(tCards[0]);
                }
            }
                break;
            case OPER_GANG_TYPE.GANG_JTF:
            case OPER_GANG_TYPE.GANG_J1:
            case OPER_GANG_TYPE.GANG_T1:
            case OPER_GANG_TYPE.GANG_T9:
            case OPER_GANG_TYPE.GANG_F1:
            case OPER_GANG_TYPE.GANG_BU: {
                for (var i = 0; i < tCards.length; i++) {
                    left_pos = this.removeHandInCard(tCards[i]);
                }
            }
                break;
        }
    },

    removeChiCards: function (data) {
        JJLog.print("@@@@@@@@@@remove chi=>", data);
        var msg = data["msg"];
        var opType = msg["opType"];
        var opCard = msg["opCard"];
        var cards = msg["cards"];
        var key = opCard["type"] + opCard["value"];
        var right_pos;
        var left_pos;
        var index = 0;
        for (var i = 0; i < cards.length; i++) {
            var tmpCard = cards[i];
            var tmpKey = tmpCard["type"] + tmpCard["value"];
            if (tmpKey == key) {
                continue;
            }
            index++;
            var pos = this.getIndexHandInCard(tmpCard);
            if (index == 1) {
                left_pos = pos
            } else {
                right_pos = pos
            }
        }
        for (var i = 0; i < cards.length; i++) {
            var tmpCard = cards[i];
            var tmpKey = tmpCard["type"] + tmpCard["value"];
            if (tmpKey == key) {
                continue;
            }
            this.removeHandInCard(tmpCard);
        }
        // this.playHandCardAction(left_pos, right_pos, 2);
    },

    removeHandInTargetCard: function (card) {
        JJLog.print('card ');
        JJLog.print(card);
        var cardValue = card["type"] + card["value"];
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];

            if (cardValue == card.paiOfCard().keyOfPai()) {
                this.cardInArray.splice(i, 1);
                card.removeFromParent();
                break;
            }
        }
    },

    removeHandInCard: function (card) {
        var cardValue = card["type"] + card["value"];
        var index = null;
        JJLog.print("cardValue", cardValue);
        if (this.moCard != null && this.moCard.paiOfCard().keyOfPai() == cardValue) {
            this.moCard.removeFromParent();
            this.moCard = null;
            return this.cardInArray.length;
        }
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            JJLog.print("card.paiOfCard().keyOfPai()", card.paiOfCard().keyOfPai())
            if (cardValue == card.paiOfCard().keyOfPai()) {
                index = i;
                this.cardInArray.splice(i, 1);
                card.removeFromParent();
                return index;
            }
        }
    },
    getIndexHandInCard: function (card) {
        var cardValue = card["type"] + card["value"];
        var index = null;
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            if (cardValue == card.paiOfCard().keyOfPai()) {
                index = i;
                return index;
            }
        }
    },

    fixMoCardPos: function () {
        var card = this.moCard;
        if (!card) return;
        card.stopAllActions();

        var asbPos = this.posMoOfPanel(true);

        var actions = [];
        actions.push(cc.moveTo(CommonParam.pengPaisMoveTime, asbPos.x, asbPos.y));
        card.runAction(cc.sequence(actions));
    },
    resetPanelInChild: function (isAni, ignoreApendMoCard) {
        this._super();

        if (this.moCard != null && !ignoreApendMoCard) {
            this.cardInArray.push(this.moCard);
            this.moCard = null;
        }
        if (!isAni) {
            this.cardInArray = this.cardInArray.sort(this.sortCardList);
        }
        var self = this;
        var nextCardPos = cc.p(0, 0);
        var cardsLen = this.cardInArray.length;
        for (var i = 0; i < cardsLen; i++) {
            var card = this.cardInArray[i];

            var pos = cc.p(this.gap_stand * i - this.gap_cardStand * i, 0);

            if (this.getShowPanelCardCount() + i + 1 == MajhongInfo.MajhongNumber) {
                pos.x += this.gap_stand * this.gap_moCard;
            }
            card.stopAllActions();
            card.setCardPosition(pos);
            if (isAni) {

                var actions = [];
                actions.push(cc.moveTo(CommonParam.pengPaisMoveTime, pos.x, pos.y));
                if (i == 0) {
                    actions.push(
                        cc.callFunc(function () {
                            self.fixMoCardPos();
                        })
                    );
                }
                card.runAction(cc.sequence(actions));
            } else {
                card.setPosition(pos);
            }
            if (MajhongInfo.GameMode == GameMode.PLAY && XYGLogic.table.isQueCard) {
                if (XYGLogic.table.isQueCard(card)) card.xuezhanShowGray();
            }

            nextCardPos.x = this.gap_stand * (i + 1) - this.gap_cardStand * (i + 1);
        }

        this.upDateNotifyTingChoice();

        if (!!this.moCard) {
            this.moCard.setPosition(this.posMoOfPanel());
        }
        return nextCardPos;
    },

    upDateNotifyTingChoice: function () {

        // 修复补花之后听牌显示错误
        if (!this.huDate) return;
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            var isGray = true;
            var hutype = 0;
            for (var j = 0; j < this.huDate.length; j++) {
                var tingDate = this.huDate[j];
                var del = tingDate['del'];

                if (!!del && del.type + del.value == card.paiOfCard().keyOfPai()) {
                    var jintype = tingDate['jin_type'];
                    if (!!jintype) {
                        hutype = jintype;
                    }

                    isGray = false;
                }
            }
            if (isGray) {
                //card.showGray();
            } else {
                card.showTingTip(hutype);
            }
        }
    },

    showControlPanel: function (data) {
        //TODO
    },

    _drawControlForGang: function (tag, data) {
        //TODO
    },

    dismissControlPanel: function () {
        this.qihu_tip = false;
        qp.event.send("appPluginControlHide", {});
    },

    showControlPanel: function (data) {
        var _this = this;
        var opData = data["opCard"];
        var panelSize = 0;
        if (this.gangMode || this.gangMode > 0) {
            var huData = data[OPERATIONNAME.HU];
            if (huData == 1) {
                var cellData = {};
                cellData["opType"] = OPERATIONNAME.HU;
                cellData["opCard"] = opData;
                cellData["index"] = -1;
                cellData['pai'] = opData;
                XYGLogic.net.updatePlayerOp(cellData, function (data) {
                });
                return;
            }
        }

        qp.event.send('appPluginControlShow', data);
    },
    onNotifyAutoDelCards: function (data) {
        this._super(data);
        JJLog.print("SelfSeat onNotifyDelCards");
        if (this.checkMsg(data)) {
            if (data.msg && "autoDel" === data.msg.opType) {
                var autoDelCard = this.getOneCardForHandCards(data['msg'].opCard);
                if (autoDelCard) {
                    this.delAndPutCard(autoDelCard);
                }
            } else if (data.msg && "qiangGangHu" === data.msg.opType) {
                var autoDelCard = this.getOneCardForHandCards(data['msg'].opCard);
                if (autoDelCard) {
                    this.removeOutHandCard(autoDelCard);
                }
            }
        }
    },

    onSyncParams: function (data) {

        var num = data['havePai'];
        if (num != undefined) {
            this.mHaveCardNum = num;
        }

    },

    searchQueInHandCard: function () {
        var currGame = hall.getPlayingGame().table;
        if (!currGame || !currGame.playerQue) return false;

        if (this.moCard != null) {
            var card = this.moCard;
            if (currGame.playerQue == card.paiOfCard().type) {
                return card;
            }
        }

        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            if (currGame.playerQue == card.paiOfCard().type) {
                return card;
            }
        }
        return null;
    },
    readyTing: function (data) {
        this.gangMode = 1;
        if (this.moCard != null) {
            this.cardInArray.push(this.moCard);
            this.moCard = null;
        }
        this.huDate = data;
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            var isGray = true;
            for (var j = 0; j < data.length; j++) {
                var tingDate = data[j];
                var del = tingDate['del'];
                if (!!del && del.type + del.value == card.paiOfCard().keyOfPai()) {
                    isGray = false;
                }
            }
            if (isGray) {
                card.showGray();
            }
        }
        if (this.moCard != null) {
            this.cardInArray.push(this.moCard);
            this.moCard = null;
        }
    },
    cleanReadyTing: function () {
        this.gangMode = false;
        this.huDate = null;
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            card.showWhite();
        }
    },

    reset: function () {
        this._super();
        this.panel_card_seat.removeAllChildren();
        this.isAction = false;
        this.gangMode = false;
        this.outArray = [];

        var tempCardIn = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardIn")
        tempCardIn.setVisible(false);
        this.panel_cardIn = tempCardIn.clone();
        this.panel_cardIn.setVisible(true);
        // this.panel_card_seat.insertCustomItem(this.panel_cardIn, 20);
        this._insertPanelCardSeat(this.panel_cardIn, 19)
        this.isPauseAutoOutCardC = false;
    },

    getPengInsertIndex : function () {
        var tI = this.panel_card_seat.getIndex(this.panel_cardIn);
        if (tI <= 0) {
            tI = 0;
        }
        return tI;
    },

    _insertPanelCardSeat: function (node, index) {
        // var tI = this.panel_card_seat.getIndex(this.panel_cardIn);
        // if (tI <= 0) {
        //     tI = 0;
        // }
        var tI = this.getPengInsertIndex();
        this.panel_card_seat.insertCustomItem(node, tI);
    }
});
