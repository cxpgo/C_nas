/**
 * Created by atom on 2016/9/11.
 */

var PaoSelfSeat = PaoDeskSeat.extend({
    btn_guo: null,
    TishiIdx: 0,
    TishiArray: [],
    chupai: null,
    img_rule: null,
    img_big: null,
    ctor: function (data) {
        this._super(data, 'selfseat');
        this.root = util.LoadUI(PDKPokerJson.PDKPlayerPanel).node;
        this.addChild(this.root);
        this.deskType = DeskType.Player;
        this.chupai = [];
        this.TishiIdx = 0;
        this.TishiArray = [];
        this.initSelfUI();
    },

    onEnter: function () {
        this._super();
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.checkOffline();
        } else if (MajhongInfo.GameMode == GameMode.RECORD) {

        }
    },

    onExit: function () {
        this._super();
    },

    // 初始化
    initSelfUI: function () {
        this.img_rule = ccui.helper.seekWidgetByName(this.root, "Image_rule");
        this.img_big = ccui.helper.seekWidgetByName(this.root, "Image_big");
        //控制面板
        this.panel_chupai = ccui.helper.seekWidgetByName(this.root, "panel_chupai");
        this.panel_chupai.setVisible(false);
        this.btn_guo = ccui.helper.seekWidgetByName(this.panel_chupai, "btn_guo");
        this.btn_guo.addClickEventListener(this.onGuo.bind(this));
        this.btn_guo.setVisible(false);
        this.btn_chu = ccui.helper.seekWidgetByName(this.panel_chupai, "btn_chu");
        this.btn_chu.addClickEventListener(this.onChuPai.bind(this));
        this.btn_tishi = ccui.helper.seekWidgetByName(this.panel_chupai, "btn_tishi");
        this.btn_tishi.addClickEventListener(this.onTiShi.bind(this));
        this.btn_tuo = ccui.helper.seekWidgetByName(this.panel_chupai, "btn_tuo");
        this.btn_tuo.addClickEventListener(this.onCancelTuo.bind(this));
        this.btn_tuo.setVisible(false);
    },

    // 发牌
    setHandCards: function (data) {
        this.panel_cardIn.removeAllChildren();
        for (var p in data) {
            var card = new MyPokerCard(this, data[p]);
            card.setVisible(false);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
        }
        this.resetPanelInChild();
        this.runCardsAnimation();
    },

    initRecordHandCards: function () {
        // var cards = PDKPoker.record.selfHandCards;
        // this.panel_cardIn.removeAllChildren();
        // for (var i = 0; i < cards.length; i++) {
        //     var card = new MyPokerCard(this, cards[i]);
        //     this.cardInArray.push(card);
        //     this.panel_cardIn.addChild(card);
        // }
        // this.resetPanelInChild();
    },

    // 出牌通知
    onNotifyDelCards: function (data, ani) {
        JJLog.print("onNotifyDelCards uid :" + JSON.stringify(data));
        if (data['uid'] != this.uid) return;
        this.mClockCtrl.countDown("GiveCards" , 9);

        this.image_tip.setVisible(false);

        if (this.b_first || ani == true) {
            this.panel_chupai.setVisible(false);
            this.panel_chupai.runAction(cc.sequence(cc.delayTime(this.cardInArray.length * 2 * 0.05), cc.show()));
        } else {
            this.panel_chupai.setVisible(true);
        }
        this.btn_guo.setVisible(false);
        if (XYGLogic.Instance.canPass == 1 && this.b_first == false) {
            this.btn_guo.setVisible(true);
        }

        this.btn_chu.setVisible(false);
        this.btn_tishi.setVisible(false);
        this.btn_tuo.setVisible(false);

        // 清除上次出的牌
        this.panel_cardOut.removeAllChildren();
        //this.chupai = [];
        //this.ResetCardInAnimation();
        this.cardOutArray.splice(0, this.cardOutArray.length);

        if (data['uid'] == data['opUid'] || data['opUid'] == null || data['opUid'] == undefined) {
            this.lastOpPai.cards = [];
            this.lastOpPai.type = PuKeType.CT_ERROR;
            this.btn_chu.setVisible(true);
            this.btn_tishi.setVisible(true);
            this.btn_guo.setVisible(false);
        }
        else {
            var lastOutPai = {};
            this.createLastOp(this.lastOpPai, lastOutPai);
            if (this.selectHint(lastOutPai, this.cardInArray, this.TishiArray)) {
                this.btn_chu.setVisible(true);
                this.btn_tishi.setVisible(true);
            }
            else {
                var time = ani ? this.cardInArray.length*2*0.05 * 1000  : 0 ;
                cc.setTimeout(function() {
                    this.onGuo();
                }.bind(this), time + 500);
            }
        }
    },

    ResetCardInAnimation: function () {
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            if (card.isSelected() && card.getTag() == 0) {
                card.playResetAnimation();
            }
        }

    },
    initLastCards: function () {
        JJLog.print("initLastCards");
        this._super();
        this.runCardsAnimation();
        if (this.uid == XYGLogic.Instance.offLineInfo['nextChuPai']) {
            var lastOpData = XYGLogic.Instance.offLineInfo['lastOP'];
            var data = { 'uid': this.uid, 'opUid': lastOpData.opUid };
            this.onNotifyDelCards(data, true);
        }
    },

    runCardsAnimation: function () {
        
        var delTime = DDZCommonParam.HandCardShowTime;

        var tCards = [].concat(this.cardInArray);
        //this.cardInArray = [];
        for (var i = 0; i < tCards.length; i++) {
            var card = tCards[i];
            var revertTime = delTime * (i + 1);
            card.runAction(cc.sequence(
                cc.delayTime(revertTime),
                cc.show(),
                cc.callFunc(function (card) {
                    // this.cardInArray.push(card);
                    this.resetPanelInChild();
                }.bind(this, card)),
                cc.fadeIn(delTime)
            ));
        }
    },

    addCardIn: function (cardObj) {
        var card = new MyPokerCard(this, cardObj);
        card.setVisible(false);
        this.cardInArray.push(card);
        this.panel_cardIn.addChild(card);
    },

    addCardOut: function (data) {
        this.panel_cardOut.removeAllChildren();
        this.cardOutArray.splice(0, this.cardOutArray.length);
        for (var i = 0; i < data.length; i++) {
            var cardObj = data[i];
            var card = new MyPokerCard(this, cardObj, false);

            var length = this.cardOutArray.length;
            this.panel_cardOut.addChild(card, 20 - length);
            this.cardOutArray.push(card);
        }
        this.resetOutPanelInChild();
    },

    // 计算出牌的位置
    resetOutPanelInChild: function () {
        // 起始位置的计算，保证剩余的牌都在正中间
        var posXNext = -this.cardOutArray.length * CommonParam.pokerGap / 2 - CommonParam.pokerGap + 80;
        for (var i = 0; i < this.cardOutArray.length; i++) {
            var card = this.cardOutArray[i];
            card.x = posXNext + CommonParam.pokerGap * i;
            card.y = 0;
            this.panel_cardOut.reorderChild(card, i);
        }
    },
    //滑动选牌
    slipping: function (startPos, pos) {
        var index = 0;
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            if (cc.rectContainsPoint(card.getBoundingBox(), pos)) {
                card.showGray();
                card.setTag(1);
                index = i;
                break;
            }
        }

        if (startPos.x > pos.x) {
            for (var i = 0; i < index; i++) {
                var card = this.cardInArray[i];
                if (card.getTag() == 1) {
                    card.showWhite();
                    card.setTag(0);
                }
            }
        } else if (startPos.x < pos.x) {
            for (var i = this.cardInArray.length - 1; i > index; i--) {
                var card = this.cardInArray[i];
                if (card.getTag() == 1) {
                    card.showWhite();
                    card.setTag(0);
                }
            }
        }
    },
    //滑动选牌结束
    slippingEnd: function () {
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];

            if (!card.isSelected() && card.getTag() == 1) {
                card.playSelectedAnimation();
            }
            else if (card.isSelected() && card.getTag() == 1) {
                card.playResetAnimation();
            }
            card.setTag(0);
            card.showWhite();
        }
        sound.playSound('res/audio/effect/audio_card_click.mp3');
    },

    removePutOutCard: function (pais) {
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
        JJLog.print(this.chupai.length + "@@@@@@@@@@@@@@@@@" + pais.length);
        if (this.chupai.length >= pais.length) {
            this.chupai.splice(0, pais.length);
            JJLog.print("this.chupai :" + JSON.stringify(this.chupai));
        } else {
            this.chupai = [];
        }
        this.resetPanelInChild();
    },

    autoPutOutCard: function () {
        if (this.moCard != null) {
            var paiData = this.moCard.paiOfCard().objectOfPai();


            this.runAction(cc.sequence(cc.delayTime(1),
                cc.callFunc(this.autoSelect.bind(this)),
                cc.delayTime(1.0),
                cc.callFunc(this.autoPutOut.bind(this)),
                cc.delayTime(0.5),
                cc.callFunc(this.autoDelCard.bind(paiData))
            ));
        }
    },

    autoSelect: function () {

    },

    autoPutOut: function () {

    },

    autoDelCard: function () {
        XYGLogic.Instance.updatePlayerDelCard(this, function (data) {

        }.bind(this));

    },

    // 计算牌的位置
    resetPanelInChild: function () {
        var posXNext = 140;
        var posIntel = 60;  //牌间隔
        this.cardInArray = this.cardInArray.sort(this.sortCardList);
        // 起始位置的计算，保证剩余的牌都在正中间
        posXNext += (16 - this.cardInArray.length) * (posIntel / 2);
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            var cardSize = card.getContentSize();
            card.x = posXNext + posIntel * i;
            card.y = 0;
            this.panel_cardIn.reorderChild(card, i);
        }
    },

    recordResetPanelInChild: function () {
        // this.resetPanelInChild();
    },

    // 点击提示
    onTiShi: function () {
        sound.playBtnSound();
        if (this.lastOpPai.cards && this.lastOpPai.cards.length == 0 || !this.lastOpPai.cards) {
            var outCardsArr = {};
            var bRes = this.SearchOutCard(this.cardInArray, outCardsArr)
            if (bRes && outCardsArr.cbResultCard.length > 0) {
                for (var i = 0; i < this.cardInArray.length; i++) {
                    if (this.hasPai(this.cardInArray[i], outCardsArr.cbResultCard)) {
                        this.cardInArray[i].playSelectedAnimation();
                    } else {
                        this.cardInArray[i].playResetAnimation();
                    }
                }
            }
            return;
        }
        var outCard = [];
        if (this.TishiIdx > 0) {
            this.TishiIdx = (this.TishiIdx + 1) % this.TishiArray.length;
            if (this.TishiIdx == 0)
                this.TishiIdx = this.TishiArray.length;
            outCard = this.TishiArray[this.TishiIdx - 1];
            for (var i = 0; i < this.cardInArray.length; i++) {
                if (this.hasPai(this.cardInArray[i], outCard)) {
                    this.cardInArray[i].playSelectedAnimation();
                }
                else {
                    this.cardInArray[i].playResetAnimation();
                }
            }
        }
        else {
            if (this.TishiArray.length > 0) {
                this.TishiIdx = 1;
                outCard = this.TishiArray[0];
                for (var i = 0; i < this.cardInArray.length; i++) {
                    if (this.hasPai(this.cardInArray[i], outCard)) {
                        this.cardInArray[i].playSelectedAnimation();
                    }
                    else {
                        this.cardInArray[i].playResetAnimation();
                    }
                }
            } else {
                this.chupai = [];
                var lastOutPai = {};
                this.createLastOp(this.lastOpPai, lastOutPai);
                JJLog.print("onTiShi createLastOp :" + JSON.stringify(lastOutPai));
                if (this.selectHint(lastOutPai, this.cardInArray, this.TishiArray)) {
                    this.TishiIdx = 1;
                    outCard = this.TishiArray[0];
                    for (var i = 0; i < this.cardInArray.length; i++) {
                        if (this.hasPai(this.cardInArray[i], outCard)) {
                            this.cardInArray[i].playSelectedAnimation();
                        }
                        else {
                            this.cardInArray[i].playResetAnimation();
                        }
                    }
                }
            }
        }
    },

    // 判断牌型
    checkPaiType: function (outPai) {
        if (outPai.length == 1) {
            return PuKeType.CT_SINGLE;  // 一张牌，肯定是单牌类型
        }
        if (outPai.length == 2) {
            // 两张牌，只能是对子
            if (outPai[0].value == outPai[1].value)
                return PuKeType.CT_DOUBLE;
            else
                return PuKeType.CT_ERROR;
        }
        if (outPai.length == 3) {
            if (outPai[0].value == outPai[1].value && outPai[0].value == outPai[2].value) {
                if (outPai[0].value == 12)
                    return PuKeType.CT_BOMB;
                else
                    return PuKeType.CT_THREE;
            }
            else
                return PuKeType.CT_ERROR;
        }
        if (outPai.length >= 4) {
            //是不是连对
            if (this.IsContinue2(outPai, [])) {
                return PuKeType.CT_DOUBLE_LINE;
            }
            // 是不是炸弹
            if (this.IsBomb(outPai, [])) {
                return PuKeType.CT_BOMB;
            }

            // 是不是三同张
            if (this.IsContinue3(outPai, [])) {
                return PuKeType.CT_THREE;
            }
            // 是不是顺子
            if (this.IsStraight(outPai, [])) {
                return PuKeType.CT_SINGLE_LINE;
            }
            //是不是三带二
            if (this.Is3And2(outPai, [])) {
                return PuKeType.CT_THREE_LINE_TAKE_TWO;
            }

            // 是不是三带一
            if (this.Is3And1(outPai, [])) {
                return PuKeType.CT_THREE_LINE_TAKE_ONE;
            }

            // 是不是四带三
            if (this.Is4And3(outPai, [])) {
                return PuKeType.CT_FORE_LINE_TAKE_THREE;
            }
        }
        return PuKeType.CT_ERROR;
    },

    // 数组中是否启有某张牌
    hasPai: function (checkPai, checkArray) {
        for (var i = 0; i < checkArray.length; i++) {
            if ((checkPai.value == checkArray[i].value) && (checkPai.type == checkArray[i].type)) {
                return true;
            }
        }
        return false;
    },

    // 点击要不起
    onGuo: function () {
        JJLog.print("on guo");
        var data = [];
        var _this = this;
        this.panel_chupai.setVisible(false);
        XYGLogic.Instance.updatePlayerDelCard(data, function (data) {
            JJLog.print(JSON.stringify(data));
            if (data.code != 200) {
                _this.panel_chupai.setVisible(true);
            } else {
                _this.btn_chu.setVisible(true);
                _this.btn_tishi.setVisible(true);
                _this.btn_guo.setVisible(false);
            }
        });
    },

    // 点击出牌
    onChuPai: function () {
        sound.playBtnSound();
        var _this = this;
        this.chupai.sort(function (cardA, cardB) {
            if ((cardA.value != cardB.value) || (cardA.value == cardB.value && cardA.type != cardB.type)) {
                return compare[cardA.value] - compare[cardB.value];
            }
        });

        var found = true;
        if (this.b_first && XYGLogic.Instance.mustContain == 1 && XYGLogic.Instance.firstMode == 0) {
            found = this.IsFound3(this.chupai);
        }

        if (found == false || this.chupai.length == 0 || !this.IsPDKBiggerThanLastCard(this.chupai, this.lastOpPai.cards, this.b_first, this.cardInArray.length)) {
            this.img_rule.stopAllActions();
            this.img_rule.setVisible(true);
            this.img_rule.runAction(cc.sequence(cc.delayTime(1), cc.hide()));
            return false;
        }

        if (this.getHandMaxSingleCard() && XYGLogic.Instance.nextPlayer != null && XYGLogic.Instance.nextPlayer.getHandCardsCount() == 1) {
            this.img_rule.setVisible(false);
            this.img_big.stopAllActions();
            this.img_big.setVisible(true);
            this.img_big.runAction(cc.sequence(cc.delayTime(1), cc.hide()));
            return false;
        }
        this.panel_chupai.setVisible(false);
        XYGLogic.Instance.updatePlayerDelCard(this.chupai, function (data) {
            JJLog.print(JSON.stringify(data));
            if (data.code != 200) {
                _this.panel_chupai.setVisible(true);
            } else {
                _this.img_rule.setVisible(false);
                _this.TishiIdx = 0;
                _this.TishiArray = [];
            }
        });
    },

    getHandMaxSingleCard: function () {
        if (this.chupai.length != 1)
            return false;
        var bLogicValue = compare[this.chupai[0].value];
        for (var i = 0; i < this.cardInArray.length; i++) {
            var value = compare[this.cardInArray[i].value];
            if (value > bLogicValue)
                return true;
        }
        return false;
    },

    // 点击取消托管
    onCancelTuo: function () {
        sound.playBtnSound();
    },

    addPai: function (card) {
        // 不要重复加牌
        for (var i = 0; i < this.chupai.length; i++) {
            if (this.chupai[i].type + "" + this.chupai[i].value == card.key) {
                return;
            }
        }
        this.chupai.push(card.paiOfCard().object);
        JJLog.print("addPai this.chupai" + JSON.stringify(this.chupai));
    },

    delPai: function (card) {
        for (var i = 0; i < this.chupai.length; i++) {
            if (this.chupai[i].type + "" + this.chupai[i].value == card.key) {
                this.chupai.splice(i, 1);
            }
        }
        JJLog.print("delPai this.chupai" + JSON.stringify(this.chupai));
    },

});
