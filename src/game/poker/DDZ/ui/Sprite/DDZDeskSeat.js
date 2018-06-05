/**
 * Created by atom on 2016/8/21.
 */

var DDZDeskSeat = cc.Layer.extend({
    root: null,
    panel_root: null,
    panel_cardIn: null,             // 显示玩家手中的牌
    panel_cardOut: null,            // 显示玩家打出去的牌
    cardInArray: null,              // 玩家手中的牌
    cardOutArray: null,             // 玩家打出去的牌
    panel_baojing: null,
    uid: 0,                         // 玩家的ID
    cardInList: null,//xianshi
    deskType: DeskType.Other,
    info: '',                       // 标识哪个位置的玩家
    sexType: 2,
    maxCardLength: -1,
    seatHeads: [],
    ctor: function (data, info) {
        this._super();
        this.info = info;
        this.uid = data["uid"];
        this.mRoot = null;
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.sexType = data['userSex'];
        }
        else if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.sexType = 1;
        }

        this.cardOutArray = new Array();
        this.cardInArray = new Array();
        this.cardInList = new Array();
    },

    initUI: function () {
        this.panel_root = ccui.helper.seekWidgetByName(this.mRoot, "panel_root");
        this.panel_cardIn = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardIn");
        if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.panel_cardIn = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardIn_record");
        }
        this.panel_cardOut = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardOut");

        // this.fnt_label_tip = ccui.helper.seekWidgetByName(this.panel_root, "fnt_label_tip");
        this.fnt_label_tip = ccui.helper.seekWidgetByName(this.panel_root, "panel_label_tip");
        this.fnt_label_tip.setVisible(false);

        this.panel_baojing = ccui.helper.seekWidgetByName(this.panel_root, "panel_baojing");
        this.panel_baojing.setVisible(false);

        this.panelHead = ccui.helper.seekWidgetByName(this.mRoot, "panel_head");
        this.mDeskHead = new DDZDeskHead(XYGLogic.Instance.uidOfInfo(this.uid));
        this.panelHead.addChild(this.mDeskHead, 1, 1);

        this.txt_cardNum = ccui.helper.seekWidgetByName(this.mRoot, "txt_cardNum");
        this.resetCardNum();

        if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.mDeskHead.recordResetBakerShow();
        }
        this.panelWait = this.findChild("panel_status_waiting");
        var img_zb = ccui.helper.seekWidgetByName(this.mRoot, "img_zb");
        img_zb.setVisible(true);
        this.getReadyState();
        var frame = ccui.helper.seekWidgetByName(this.panelHead, "image_frame");
        frame.setVisible(false);

        var clockView = ccui.helper.seekWidgetByName(this.panelHead, "image0");
        this.mClockCtrl = new ClockCtrl(clockView);
        this.addChild(this.mClockCtrl);//只用于内存管理
    },

    getSpriteHeadPos: function () {
        return this.panelHead.getPosition();
    },

    findChild: function (name) {
        return ccui.helper.seekWidgetByName(this.mRoot, name);
    },

    onEnter: function () {
        this._super();
        this.initUI();
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.registerAllEvents();
            this.panel_cardOut.setScale(DDZCommonParam.panelCardOutScale);
        }
        else if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.panelWait.setVisible(false);
            this.initRecordHandCards();
            this.registerRecordEvent();
            this.panel_cardOut.setScale(0.5);
        }
    },

    onExit: function () {
        this._super();
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.removeAllEvents();
        }
        else if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.removeAllParam();
        }
        this.mDeskHead = null;
    },

    getSelfReady: function () {

    },

    getReadyState: function () {
        this.panelWait.setVisible(true);
        var img_zb = ccui.helper.seekWidgetByName(this.mRoot, "img_zb");
        if (XYGLogic.Instance.getReady[this.uid]) {
            img_zb.setVisible(true);
        }
        else {
            img_zb.setVisible(false);
        }
    },
    setReadyState: function (data) {
        var status = data['readyStatus'];//0,1
        if (status == 1) {
            this.panelWait.setVisible(true);
            var img_zb = ccui.helper.seekWidgetByName(this.mRoot, "img_zb");
            img_zb.setVisible(true);
        } else {
            this.panelWait.setVisible(false);
        }
        XYGLogic.Instance.getReady[data.uid] = data.readyStatus;
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
                    case RecordType.SEND: {
                        var uid = userData['uid'];
                        if (_this.uid == uid) {
                            _this.playRecordSend(userData);
                        }
                    }
                        break;
                }
            }
        });
        _this._Listener = cc.eventManager.addListener(ls, this);
    },
    playRecordSend: function (data) {
        this.removeOutHandCard(data['pai']);
        this.addCardOut(data['pai'], true);
        // this.image_tip.setVisible(data['pai'].length == 0);
        if (data['pai'].length == 0) {
            this.optNoticeTips("buchu")
        }
        var cardSound = {sex: this.sexType, cardsType: data.opCardType, cards: data['pai']};
        sound.playPokerCard(cardSound);
        qp.event.send('playerPainum', {uid: data['uid'], painum: this.cardInArray.length});
    },

    removeAllParam: function () {
        this.cardInArray.splice(0, this.cardInArray.length);
        this.cardInArray = null;
        this.cardOutArray.splice(0, this.cardOutArray.length);
        this.cardOutArray = null;
    },
    //hxx
    //记录=======================
    removeOutHandCard: function (pais) {
        for (var i = 0; i < pais.length; i++) {
            for (var j = 0; j < this.cardInArray.length; j++) {
                var tmpCard = this.cardInArray[j];
                if (tmpCard.key == pais[i].type + "" + pais[i].value) {
                    this.cardInArray.splice(j, 1);
                    tmpCard.removeFromParent();
                    break;
                }
            }
        }
        this.recordResetPanelInChild();
        this.postNextStep();
    },
    ClearCardInAnimation: function () {

    },
    ResetCardInAnimation: function () {

    },
    initRecordHandCards: function () {

    },
    recordResetPanelInChild: function () {

    },
    postNextStep: function () {
        var dtime = 0.5;
        this.schedule(this.delayStep, dtime);
    },
    delayStep: function (dt) {
        this.unschedule(this.delayStep);
        DDZPoker.record.postNextStep();
    },

    // 注册事件
    registerAllEvents: function () {

        //聊天消息
        qp.event.listen(this, 'mjChatStatus', this.onReciveChat.bind(this));
    },

    // 移除事件
    removeAllEvents: function () {
        qp.event.stop(this, 'mjChatStatus');

    },

    // 检验消息是否是自己的
    checkMsg: function (data) {
        if (data["uid"] == this.uid) {
            return true;
        }
        return false;
    },

    onReciveChat: function (data) {
        JJLog.print(JSON.stringify(data));
        var uid = data['uid'];
        var type = data['data']['type'];
        var index = data['data']['index'];
        var content = data['data']['content'];

        if (uid == this.uid) {
            if (type == CHAT_TYPE.Usual) {
                this.mDeskHead.showMsg(index, content);
            } else {
                this.mDeskHead.showFace(index);
            }
        }
    },
    //hxx
    setCardsShowNum: function (showNum) {
        if (this.txt_cardNum) {
            if (showNum == 1) {
                if (this.getHandCardsCount() > 0) {
                    this.txt_cardNum.setVisible(true);
                    this.txt_cardNum.string = this.getHandCardsCount();
                }
                else {
                    this.txt_cardNum.setVisible(false);
                }
            }
            else if (showNum == 0) {
                this.txt_cardNum.setVisible(false);
            }
        }
    },
    // 发牌
    setHandCards: function (cards, bLast) {
        this.panel_cardIn.removeAllChildren();
        this.cardInArray = [];
        for (var p = 0; p < cards.length; p++) {
            var card = new DDZPokerCard(this, cards[p], this.uid === hall.user.uid);
            card.setBackData(this.uid);
            if (bLast) {
                card.setVisible(true);
            } else {
                card.setVisible(false);
            }
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
        }
        this.showBaojing();
        this.setCardsShowNum(XYGLogic.Instance.showNum);
        if (bLast) {
            this.resetPanelInChild(false, false);
        } else {
            // this.resetPanelInChild(false, false);
            this.runCardsAnimation();
        }
    },
    //2人发牌
    set2HandCards: function (cards, cardTip) {
        this.panel_cardIn.removeAllChildren();
        this.cardInArray = [];
        for (var p = 0; p < cards.length; p++) {
            var card = new DDZPokerCard(this, cards[p], this.uid === hall.user.uid);
            card.setVisible(false);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
        }
        this.setCardsShowNum(XYGLogic.Instance.showNum);
        this.runFaPaiAction(cardTip);
        this.runCardsAnimation(cardTip);
    },
    //hxx
    insertHandCards: function (cards) {
        //this.panel_cardIn.removeAllChildren();
        // this.cardInArray = [];
        var idx = 0;
        for (var i = 0; i < this.cardInArray.length; i++) {
            if (cards[idx] && cards[idx] >= this.cardInArray[i] && cards[idx] <= this.cardInArray[i++]) {
                if (this.uid === hall.user.uid) {
                    var card = new DDZPokerCard(this, cards[idx], true);
                    card.setPosition(cc.p(600, 500));
                    // card.setVisible(false);
                } else {
                    var card = new DDZPokerCard(this, {type: 0x00, value: 0x00}, false);
                }
                this.cardInArray.push(card);
                this.panel_cardIn.addChild(card);
                idx++;
                //地主底牌显示
                this.TipCards(card);
            }
        }
        this.resetPanelInChild(false, false);
        this.setCardsShowNum(XYGLogic.Instance.showNum);
        var self = this;
        cc.setTimeout(function () {
            self.ClearCardInAnimation();
        }, 500, this)
        //this.runCardsAnimation();
    },
    TipCards: function (card) {

    },
    //hxx
    clearCards: function (data) {
        if (data['uid'] != this.uid) return;
        this.panel_cardOut.removeAllChildren();
    },
    runFaPaiAction: function () {

    },
    runCardsAnimation: function () {
        var delTime = 0.05;
        var maxShowCount = 1;
        for (var i = 0; i < maxShowCount && i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            var minLength = Math.min(1, this.cardInArray.length);
            var revertTime = minLength * delTime + delTime * (minLength - 1 - i);
            card.runAction(cc.sequence(cc.delayTime(revertTime), cc.show(), cc.fadeIn(delTime)));
        }
        this.resetPanelInChild(false, false);
    },

    operationGiveCards: function (data) {
        JJLog.print("DeskSeat onNotifyDelCards");
        JJLog.print("DeskSeat onNotifyDelCards", data);
        if (data['uid'] != this.uid) return;
        // 轮到我出牌了
        // 清除上次出的牌
        this.fnt_label_tip.setVisible(false);
        this.panel_cardOut.removeAllChildren();
        this.cardOutArray.splice(0, this.cardOutArray.length);
    },

    // 同步出牌
    oprationRemoveCards: function (data) {
        this.cardInList.push(data['msg']);
        var cardSet = DDZCard_Rule.cardsToCardsSet(data['msg']);
        cardSet.addType(data['opCardType'].cardsType, data['opCardType'].maxLevel, data['opCardType'].cardsLength);
        var sortType = cardSet.autoSort();

        JJLog.print("!!!!!!!!!!!!!!!1", sortType, cardSet);
        this.removePutOutCard(data['msg']);
        this.addCardOut(cardSet.cards, true);
        this.setCardsShowNum(XYGLogic.Instance.showNum);

        // if (this.uid != hall.user.uid) {
        //     this.resetPanelInChild();
        // }

        JJLog.print("@@@@@@@@@@@@@@@", data);
        var cardSound = {sex: this.sexType, cardsType: data.opCardType, cards: data['msg']};
        sound.playPokerCard(cardSound, XYGLogic.Instance.lastOpUid == data.uid);
        if (data['msg'].length == 0) {
            // this.optNoticeTips("不出");
            this.optNoticeTips("buchu");
        } else {
            sound.playPokerCardDown();
            XYGLogic.Instance.lastOpUid = data.uid;
        }

        //播放音效提示手牌数量
        var checkNum = this.uid != XYGLogic.Instance.whoIsBanker() ? XYGLogic.Instance.checkNum : 0;
        if (this.cardInArray.length == checkNum + 1 && data['msg'].length > 0) {
            var soundData = {};
            soundData['userSex'] = this.sexType;
            soundData['index'] = 11;
            cc.setTimeout(function () {
                sound.playPokerMsg(soundData);
            }, 500);
        } else if (this.cardInArray.length == 2 + checkNum && data['msg'].length > 0) {
            var soundData = {};
            soundData['userSex'] = this.sexType;
            soundData['index'] = 12;
            cc.setTimeout(function () {
                sound.playPokerMsg(soundData);
            }, 500);
        }
        //背景音乐变化
        if (this.cardInArray.length <= 2 || data.opCardType == DouDiZhuType.CT_KING_BOMB) {
            sound.playGameSound(3, true);
        } else if (this.cardInArray.length <= 10 || data.opCardType == DouDiZhuType.CT_BOMB) {
            sound.playGameSound(2, true);
        }

    },

    // 获取剩余的牌数量
    getHandCardsCount: function () {
        return this.cardInArray.length;
    },

    updateTip: function () {

    },
    forceDisconnect: function () {
        cc.setTimeout(function () {
            var pomelo = window.pomelo;
            if (pomelo.connectState != 'disconnected') {
                pomelo.disconnect();
            }
        }, 100);
    },

    addHu: function (opCard) {

    },

    removeOutCard: function (msg) {
        var cardValue = msg["type"] + msg["value"];
        for (var i = this.cardOutArray.length - 1; i >= 0; i--) {
            var tmpCard = this.cardOutArray[i];
            if (cardValue == tmpCard.paiOfCard().keyOfPai()) {
                this.cardOutArray.splice(i, 1);
                tmpCard.removeFromParent();
                break;
            }
        }
    },

    putOutCard: function (data) {
        //todo

    },

    removePutOutCard: function (pais) {
        for (var i = 0; i < pais.length; i++) {
            var last = this.cardInArray.length - 1;
            var card = this.cardInArray[last];
            if (card) {
                this.cardInArray.splice(last, 1);
                card.removeFromParent();
                card = null;
            }
        }
    },
    // 计算牌的位置
    resetPanelInChild: function () {
        console.error("!!!!!!!!!!!!!", this.uid);
        var posXNext = 40;
        var posIntel = 20;  //牌间隔
        var maxShowCount = 1;
        this.maxCardLength = Math.min(maxShowCount, this.cardInArray.length);
        // 起始位置的计算，保证剩余的牌都在正中间
        posXNext += (-1) * (posIntel / 2);

        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            var cardSize = card.getContentSize();
            card.x = 0;

            var zorder = 100 - i;
            var offX = i;
            if (i >= maxShowCount) {
                // zorder = i-maxShowCount+1 ;
                // offX = maxShowCount;
                card.setVisible(false);
            }
            card.y = posXNext + posIntel * offX;
            card.setLocalZOrder(zorder);
        }
        this.resetCardNum();
    },

    sortCardList: function (cardA, cardB) {
        var numA = cardA.value == XYGLogic.Instance.changeValue.value ? cardA.paiOfCard().numOfPai() + 60 : cardA.paiOfCard().numOfPai();
        var numB = cardB.value == XYGLogic.Instance.changeValue.value ? cardB.paiOfCard().numOfPai() + 60 : cardB.paiOfCard().numOfPai();
        return numB - numA;
    },
    //
    getCardsFromData: function (data) {
        var pais = data['paiQi'];
        var arr = new Array();
        if (this.deskType == DeskType.Other) {
            for (var i = 0; i < data['paiQi']['num']; i++) {
                arr.push({type: 0x00, value: 0x00});
            }
            return arr;
        } else {

            for (var tag in pais) {
                var infoArray = pais[tag];
                arr.push(infoArray);
            }
            return arr;
        }
    },

    checkOffline: function () {
        if (XYGLogic.Instance.isOffline) {
            this.initLastCards();
        }
    },

    initLastCards: function () {
        var info = XYGLogic.Instance.getCardByPlayer(this.uid);
        if (!info) return;

        var nextChuPai = XYGLogic.Instance.offLineInfo['nextChuPai']
        var data = XYGLogic.Instance.offLineInfo['lastOP'];
        var paiChu = info['paiChu'];
        this.cardInList = paiChu;
        if (paiChu.length > 0 && nextChuPai != this.uid) {
            var cardOuts = paiChu[paiChu.length - 1];

            var cardSet = DDZCard_Rule.cardsToCardsSet(cardOuts);
            cardSet.addType(data['opCardType'].cardsType, data['opCardType'].maxLevel, data['opCardType'].cardsLength);
            var sortType = cardSet.autoSort();

            this.addCardOut(cardSet.cards);
            if (cardOuts.length == 0) {
                // this.optNoticeTips("不出");
                this.optNoticeTips("buchu");
            } else {
                this.fnt_label_tip.setVisible(false);
            }
        }

        var cardArray = this.getCardsFromData(info);
        this.setHandCards(cardArray, true);
    },

    addCardIn: function (cardObj) {
        this.cardInArray.push(cardObj);
    },

    addCardOut: function (cardObj) {

    },

    cardOfString: function (cardObj) {
        return cardObj['type'] + cardObj['value'];
    },

    getHuCards: function (msg) {
        var cards = new Array();
        for (var i = 0; i < msg['cards'].length; i++) {
            var data = msg['cards'][i];
            var data2 = data['pais'];
            for (var j = 0; j < data2.length; j++) {
                var obj = data2[j];
                var isContains = false;
                for (var k = 0; k < cards.length; k++) {
                    if (this.cardOfString(obj) == this.cardOfString(cards[k])) {
                        isContains = true;
                        break;
                    }
                }
                if (!isContains) {
                    cards.push(obj);
                }
            }
        }
        return cards;
    },

    getHandCards: function (msg) {
        var info = msg['selfPaiQi'];
        var huCards = this.getHuCards(msg);

        var cards = new Array();
        for (var typeTag in info) {
            var data = info[typeTag];
            for (var i = 0; i < data.length; i++) {
                var cardObj = data[i];
                var cardStr = this.cardOfString(data[i]);
                var isAdd = true;
                if (isAdd) cards.push(cardObj);
            }
        }

        return cards;
    },
    getCardType: function (cards) {
        return DDZCard_Rule.getCardType(cards);
    },

    trace: function (string) {
    },

    selectHint: function (handCard, tipsCardsArr, cardsLast) {
        cardsLast = cardsLast || {};
        var hitCards = DDZCard_Hinter.getCardHint(handCard, cardsLast.cards, cardsLast.type);
        [].push.apply(tipsCardsArr, hitCards);
        return tipsCardsArr.length > 0;
    },

    optNoticeTips: function (txt) {
        // this.fnt_label_tip.setString(txt);
        var str = "Img_" + txt;
        this.fnt_label_tip.setVisible(true);
        this.fnt_label_tip.removeAllChildren();
        var image = new ccui.ImageView(DDZPokerPic[str]);
        image.setAnchorPoint(cc.p(0.5, 0.5));
        image.setPosition(cc.p(this.fnt_label_tip.width/2, this.fnt_label_tip.height/2));
        this.fnt_label_tip.addChild(image);
        this.fnt_label_tip.stopAllActions();
        this.fnt_label_tip.runAction(
            cc.sequence(
                cc.fadeIn(0),
                cc.delayTime(2),
                cc.fadeOut(0.1),
                cc.callFunc(
                    function () {
                        this.fnt_label_tip.setVisible(false);
                    }.bind(this)
                )
            )
        );
    },

    resetCardNum: function () {
        if (XYGLogic.Instance.showNum == 1) {
            if (this.txt_cardNum) {
                if (this.getHandCardsCount() > 0) {
                    this.txt_cardNum.setVisible(true);
                    this.txt_cardNum.string = this.getHandCardsCount();
                } else {
                    this.txt_cardNum.setVisible(false);
                }
            }
        }
        else if (XYGLogic.Instance.showNum == 0) {
            if (this.txt_cardNum)
                this.txt_cardNum.setVisible(false);
        }
    },
    operationcallpointsEnd: function () {

    },
    operationcallpoints: function () {

    },
    operationLord: function (data) {
        //TODO
    },

    operationLordEnd: function (data) {
        //TODO
    },
    operationDouble: function (data) {
        //TODO
    },
    operationDoubleEnd: function (data) {
        //TODO
    },


    showBaojing: function (data) {
    },

    autoHosting: function () {
        //todo 托管出牌
    },

    reStart: function () {
        this.panel_cardIn.removeAllChildren();
        this.panel_cardOut.removeAllChildren();
        this.chupai = [];
        this.cardInArray = [];
        this.cardOutArray = [];
        this.maxCardLength = -1;
        this.resetCardNum();
        this.mDeskHead.resetBakerShow();
        this.updateTip();
        this.panel_baojing.setVisible(false);
    },
});