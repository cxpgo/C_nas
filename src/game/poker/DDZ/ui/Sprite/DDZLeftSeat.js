/**
 * Created by atom on 2016/8/21.
 */
var DDZLeftSeat = DDZDeskSeat.extend({
    ctor: function (data) {
        this._super(data, 'leftseat');
        this.mRoot = util.LoadUI(DDZPokerJson.LeftPanel).node;
        this.addChild(this.mRoot);

        this.startPos = cc.p(180, 455);
        this.endPos = cc.p(300, 480);
        this.gap_stand = 27;
    },

    onEnter: function () {
        this._super();
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.checkOffline();
            this.panel_cardOut.setScale(0.5);
        }
    },
    //hxx
    initRecordHandCards: function () {

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
        // var posXNext = -this.cardOutArray.length * CommonParam.pokerGap / 2 - CommonParam.pokerGap;
        var posXNext = 0;

        for (var i = 0; i < this.cardOutArray.length; i++) {
            var card = this.cardOutArray[i];
            card.x = posXNext + CommonParam.pokerGap * i;
            card.y = -70;
            this.panel_cardOut.reorderChild(card, i);
        }
        if (bAct) {
            this.panel_cardOut.setPosition(this.startPos.x, this.startPos.y);
            this.panel_cardOut.setScale(0.1);
            this.panel_cardOut.runAction(cc.fadeIn(0.1));
            this.panel_cardOut.runAction(cc.moveTo(0.1, this.endPos.x, this.endPos.y));
            this.panel_cardOut.runAction(cc.scaleTo(0.08, DDZCommonParam.panelCardOutScale));
        }
    },
});
