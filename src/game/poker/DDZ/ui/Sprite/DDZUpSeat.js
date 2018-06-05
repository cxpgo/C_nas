//斗地主两人模式 玩家放在上面
var DDZUpSeat = DDZDeskSeat.extend({
    ctor: function (data) {
        this._super(data, 'upseat');
        this.mRoot = util.LoadUI(DDZPokerJson.UpPanel).node;
        this.addChild(this.mRoot);

        this.startPos = cc.p(640, 175);
        this.endPos = cc.p(640, 20);
        this.gap_stand = 27;

    },

    onEnter: function () {
        this._super();
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.checkOffline();
            this.registerSelfEvent();
            this.panel_cardOut.setScale(DDZCommonParam.panelCardOutScale);
        }
    },
    onExit: function () {
      this._super();
        qp.event.stop(this, 'pkSyncLordInfo');
    },
    registerSelfEvent: function () {
        qp.event.listen(this, 'pkSyncLordInfo', this.onNotifyLordInfo.bind(this));
        var ls1 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEventAction.UPDATETIP_EVT,
            callback: this.setHandCardsColor.bind(this)
        });
        cc.eventManager.addListener(ls1,this);
    },
    //hxx
    initRecordHandCards: function () {

    },

    runCardsAnimation: function (cardTip){
        var index = -1;
        var tipCard = null;
        var lordUid = null;
        if (cardTip ) {
            tipCard = cardTip.card;
            index = cardTip.index;
            lordUid = cardTip.lordUid;
        }
        var delTime = DDZCommonParam.HandCardShowTime;
        this.resetPanelInChild();
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            if (index == i && lordUid == this.uid) {
                card.setCardData(tipCard);
            }
            card.runAction(cc.sequence(cc.delayTime(delTime * i),cc.show(), cc.fadeIn(delTime)));
        }

    },

    recordResetPanelInChild:function () {

    },
    // 同步出牌
    addCardOut: function (data, bAct) {
        this.panel_cardOut.removeAllChildren();
        this.cardOutArray.splice(0,this.cardOutArray.length );
        // data = DDZCard_Rule.sortCards(data);
        for (var i = 0; i < data.length; i++) {
            var cardObj = data[i];
            var card = new DDZPokerCard(this, cardObj, false);
            if (i == data.length -1) {
                card.showLordTip(true);
            }

            this.panel_cardOut.addChild(card, 20 - i);
            this.cardOutArray.push(card);
        }
        this.resetOutPanelInChild(bAct);
    },

    removePutOutCard: function (pais) {
        for (var i = 0; i < pais.length; i++) {
            if (i % 2 == 0) {
                var last = 0;
            } else {
                var last = this.cardInArray.length - 1;
            }
            var card = this.cardInArray[last];
            if (card) {
                this.cardInArray.splice(last, 1);
                card.removeFromParent();
                card = null;
            }
        }
        this.resetPanelInChild(true);
    },

    showBaojing: function (effAct) {
        var checkNum = this.uid != XYGLogic.Instance.whoIsBanker() ? XYGLogic.Instance.checkNum : 0;
        if (this.cardInArray.length > 2 + checkNum || this.cardInArray.length <= checkNum || this.uid == hall.user.uid || this.panel_baojing.isVisible()) return;
        this.panel_baojing.setVisible(true);
        var tip = ccui.helper.seekWidgetByName(this.panel_baojing, "img_baojing_1");
        tip.stopAllActions();
        tip.runAction(cc.sequence(cc.fadeIn(DDZCommonParam.BaojingBlinkTime), cc.fadeOut(DDZCommonParam.BaojingBlinkTime)).repeatForever());
        if (effAct) {
            for (var i=0; i<3; i++) {
                cc.setTimeout(function () {
                    sound.playBaojingSound();
                }, 1000 * i)
            }
        }
    },

    // 计算出牌的位置
    resetOutPanelInChild: function (bAct) {
        var posXNext = -this.cardOutArray.length * CommonParam.pokerGap / 2 - CommonParam.pokerGap;
        for (var i = 0; i < this.cardOutArray.length; i++) {
            var card = this.cardOutArray[i];
            card.x = posXNext + CommonParam.pokerGap * i;
            card.y = 0;
            // card.setScale(1.2);
            // card.runAction(cc.scaleTo(DDZCommonParam.CardOutScaleTime, 1));
            this.panel_cardOut.reorderChild(card, i);
        }
        if (bAct) {
            this.panel_cardOut.setPosition(this.startPos.x, this.startPos.y);
            this.panel_cardOut.setScale(0.1);
            // this.panel_cardOut.runAction(cc.fadeIn(0.1));
            this.panel_cardOut.runAction(cc.moveTo(0.1, this.endPos.x, this.endPos.y));
            this.panel_cardOut.runAction(cc.scaleTo(0.08, DDZCommonParam.panelCardOutScale));
        }
    },

    //计算手牌的位置
    resetPanelInChild: function (moveAct) {
        if (this.cardInArray.length == 0) {
            return;
        }
        var maxShowCount = 17;//this.uid == XYGLogic.Instance.whoIsBanker() ? 20 : 17;
        this.maxCardLength = Math.max(maxShowCount, this.maxCardLength, this.cardInArray.length);

        this.maxCardLength = Math.max(maxShowCount, this.maxCardLength, this.cardInArray.length);
        var cardInLength =950;
        var cardSize = this.cardInArray[0].getContentSize();
        var posXNext = 375;
        // var posIntel = 53;  //牌间隔
        var posIntel = (cardInLength - cardSize.width) / (this.maxCardLength - 1);
        this.maxCardLength = Math.max(maxShowCount, this.maxCardLength, this.cardInArray.length);

        // 起始位置的计算，保证剩余的牌都在正中间
        posXNext += ((this.maxCardLength - this.cardInArray.length)) * (posIntel / 2);

        this.setHandCardsColor();
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            if (moveAct) {
                var x = posXNext + posIntel * i;
                card.runAction(cc.moveTo(DDZCommonParam.MoveSideTime, cc.p(x, 0)));
            } else {
                var cardSize = card.getContentSize();
                this.panel_cardIn.reorderChild(card, i);
                card.x = posXNext + posIntel * i;
                card.y = 0;
            }
        }
    },

    onNotifyLordInfo: function (data) {
        if (XYGLogic.Instance.person == 2) {
            var count = data.msg.count - 1;
            if (count > 0) {
                for (var i = 0; i < this.cardInArray.length; i++) {
                    var card = this.cardInArray[i];
                    if (i < count) {
                        card.showBlue();
                    } else {
                        card.showWhite();
                    }
                }
            }
        }
    },
    setHandCardsColor: function (event) {

        if (event) {
            var data = event.getUserData();
            if (data) {
                for (var i = 0; i < this.cardInArray.length; i++) {
                    var card = this.cardInArray[i];
                    card.setCardData({type: 0, value: 0});
                }
            }
        }

        var checkNum = 0;
        if (XYGLogic.Instance.checkNum > 0 && this.uid != XYGLogic.Instance.whoIsBanker()) {
            checkNum = XYGLogic.Instance.checkNum;
        }
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            if (i < checkNum) {
                card.showBlue();
            } else {
                card.showWhite();
            }
        }
    }
});