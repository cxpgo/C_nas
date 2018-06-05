var PaoLeftSeatRecord = PaoLeftSeat.extend({
    ctor: function (data) {
        this._super(data, 'leftseat');
    },

    onEnter: function () {
        this._super();
       if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.panel_cardOut.setScale(0.5);
            this.panel_cardIn.setScale(0.4);
        }
    },
    //hxx
    initRecordHandCards: function () {
        var cards = XYGLogic.record.leftHandCards;
        this.panel_cardIn.removeAllChildren();
        for (var i = 0;i<cards.length;i++) {
            var card = new MyPokerCard(this, cards[i]);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
        }

        this.recordResetPanelInChild();
    },

    recordResetPanelInChild:function () {
        for(var i = 0;i<this.cardInArray.length;i++)
        {
            var card = this.cardInArray[i];
            card.setPosition(cc.p(CommonParam.pokerGap*i-70,0));
            this.panel_cardOut.reorderChild(card,i);
        }
    },
});