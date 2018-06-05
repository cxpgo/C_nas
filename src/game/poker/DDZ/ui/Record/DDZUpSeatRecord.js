var DDZUpSeatRecord = DDZUpSeat.extend({
    ctor: function (data) {
        this._super(data, 'upseat');
    },

    onEnter: function () {
        this._super();
        if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.panel_cardOut.setScale(0.5);
        }
    },
    //hxx
    initRecordHandCards: function () {
        var cards = XYGLogic.record.upHandCards;
        this.panel_cardIn.removeAllChildren();
        for (var i = 0;i<cards.length;i++) {
            var card = new DDZPokerCard(this, cards[i]);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
        }
        this.cardInArray = this.cardInArray.sort(this.sortCardList);
        this.recordResetPanelInChild();
    },

    recordResetPanelInChild:function () {
        this.resetPanelInChild();
    },
});