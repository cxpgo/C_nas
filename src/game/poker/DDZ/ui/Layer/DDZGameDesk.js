/**
 * Created by atom on 2016/7/24.
 */
var DDZGameDesk = cc.Layer.extend({
    panel_up: null,
    panel_left: null,
    panel_player: null,
    panel_right: null,
    upCards: null,
    playerSeatAll: null,
    ctor: function () {
        this._super();
        var root = util.LoadUI(DDZPokerJson.Desk).node;
        this.addChild(root);

        this.panel_up = ccui.helper.seekWidgetByName(root, "panel_up");
        this.panel_left = ccui.helper.seekWidgetByName(root, "panel_left");
        this.panel_player = ccui.helper.seekWidgetByName(root, "panel_player");
        this.panel_right = ccui.helper.seekWidgetByName(root, "panel_right");
        this.playerSeatAll = {};
    },

    onEnter: function () {
        this._super();
    },

    getUpMoCardPos: function () {
        var length = this.upCards.length;
        var pos = this.upCards[length - 1].getPosition();
        return cc.p(pos.x - 20, pos.y);
    },
    onUpPlayerMo: function () {
        var card = new CardUp();
        var panel_cardIn = ccui.helper.seekWidgetByName(this.panel_up, "panel_cardIn");
        card.setPosition(this.getUpMoCardPos().x - card.getContentSize().width, this.getUpMoCardPos().y);
        panel_cardIn.addChild(card);
    },

    setLeftCards: function () {
        var panel_cardIn = ccui.helper.seekWidgetByName(this.panel_left, "panel_cardIn");
        var cardInSize = panel_cardIn.getContentSize();
        for (var i = 0; i < 13; i++) {
            var card = new CardLeftStand();
            var cardSize = card.getContentSize();
            var gap = 27;
            card.setPosition(cardInSize.width * 0.25,
                cardInSize.height - cardSize.height - gap * i);
            panel_cardIn.addChild(card);

        }
    },

    setRightCards: function () {
        var panel_cardIn = ccui.helper.seekWidgetByName(this.panel_right, "panel_cardIn");
        var cardInSize = panel_cardIn.getContentSize();
        for (var i = 0; i < 13; i++) {
            var card = new CardRightStand();
            var cardSize = card.getContentSize();
            var gap = 27;
            var posY = 108;
            card.setPosition(cardInSize.width * 0.25,
                posY + gap * i);
            panel_cardIn.addChild(card);
        }
    },

    onPlayerEnter: function (data) {
        JJLog.print("!!!!!!!!!!!!!!!!!!", data);
        console.log("@@@@@@@@@@@@@@@@@", this.playerSeatAll);
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            if (XYGLogic.Instance.selfSeatInfo()) {
                var data = XYGLogic.Instance.selfSeatInfo();
                var playerSeat = this.playerSeatAll[data.uid];
                if(!playerSeat){
                    playerSeat = new DDZSelfSeat(data);
                    this.panel_player.addChild(playerSeat, 100);
                    this.playerSeatAll[data.uid] = playerSeat;
                    XYGLogic.Instance.SeatPlayerInfo[data.uid] = playerSeat;
                }
            }

            if (XYGLogic.Instance.rightSeatInfo()) {
                var data = XYGLogic.Instance.rightSeatInfo();
                var playerSeat = this.playerSeatAll[data.uid];
                if(!playerSeat){
                    playerSeat = new DDZRightSeat(data);
                    this.panel_player.addChild(playerSeat, 99);
                    this.playerSeatAll[data.uid] = playerSeat;
                    XYGLogic.Instance.nextPlayer = playerSeat;
                    XYGLogic.Instance.SeatPlayerInfo[data.uid] = playerSeat;
                }
            }

            if (XYGLogic.Instance.leftSeatInfo()) {
                var data = XYGLogic.Instance.leftSeatInfo();
                var playerSeat = this.playerSeatAll[data.uid];
                if(!playerSeat){
                    playerSeat = new DDZLeftSeat(data);
                    this.panel_player.addChild(playerSeat, 98);
                    this.playerSeatAll[data.uid] = playerSeat;
                    XYGLogic.Instance.SeatPlayerInfo[data.uid] = playerSeat;
                }
            }

            if (XYGLogic.Instance.upSeatInfo()) {
                var data = XYGLogic.Instance.upSeatInfo();
                var playerSeat = this.playerSeatAll[data.uid];
                if(!playerSeat){
                    playerSeat = new DDZUpSeat(data);
                    this.panel_player.addChild(playerSeat, 97);
                    this.playerSeatAll[data.uid] = playerSeat;
                    XYGLogic.Instance.SeatPlayerInfo[data.uid] = playerSeat;
                }
            }

        }
    },

    onPlayerLeave: function (data) {
        var uid = data.uid;
        if(!this.playerSeatAll[uid]) return;
        this.playerSeatAll[uid].removeFromParent();
        this.playerSeatAll[uid] = null;
        delete this.playerSeatAll[uid];
    },

    getPlayerSeatByUID : function ( uid ) {
        return this.playerSeatAll[uid];
    }
});