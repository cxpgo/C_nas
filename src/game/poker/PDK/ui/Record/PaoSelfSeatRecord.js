var PaoSelfSeatRecord = PaoSelfSeat.extend({
    TishiIdx: 0,
    TishiArray: [],
    chupai: null,
    img_rule: null,
    img_big: null,
    ctor: function (data) {
        this._super(data, 'selfseat');

    },

    onEnter: function () {
        this._super();
    },

    onExit: function () {
        this._super();
    },

    //hxx
    initRecordHandCards: function () {
        var cards = XYGLogic.record.selfHandCards;
        this.panel_cardIn.removeAllChildren();
        for (var i = 0; i < cards.length; i++) {
            var card = new MyPokerCard(this, cards[i]);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
        }
        this.resetPanelInChild();
    },

    recordResetPanelInChild: function () {
        this.resetPanelInChild();
    },
});