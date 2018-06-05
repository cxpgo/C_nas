var GameStateDispatching = GameBaseState.extend({
    ctor: function (status ) {
        this._super(status , "beneath");
    },
    onInit: function () {
        this._super();
        // 发牌
        qp.event.listen(this, 'mjSendHandCards', this.onReceiveHandCards.bind(this));

        this.panel_option_waiting.setVisible(false);
        this.panel_option_playing.setVisible(true);
        for (var key in this.mGameDesk.playerSeatAll) {

            var playerDeskState = this.mGameDesk.playerSeatAll[key];

            if (!playerDeskState) continue;
            var panelWait = playerDeskState.findChild("panel_status_waiting");
            if(panelWait) panelWait.setVisible(false);
        }
    },

    onRelease: function () {
        qp.event.stop(this, 'mjSendHandCards');
        this._super();

    },
    onReceiveHandCards: function (data) {
        JJLog.print("[GameStateBase] "+this.mID+" onReceiveHandCards", JSON.stringify(data));
        var uid = data.uid;
        var playerDeskState = this.mGameDesk.getPlayerSeatByUID(uid);
        if (!playerDeskState) return;
        if (data.cards.length == 0) {
            for (var i = 0; i < data.cardNum; i++) {
                var pai = { "type": 0, "value": 0 };
                data.cards.push(pai);
            }
        }
        if (data.cards.length > 0) {
            XYGLogic.Instance.playCardsNum[uid] = data.cards.length ;
        }

        console.error("!!!!!!!!!!!!!!!!!onReceiveHandCards", data)
        if (data['cardTip']) {
            playerDeskState.set2HandCards(data.cards,data['cardTip']);
        } else {
            playerDeskState.setHandCards(data.cards);
        }
        playerDeskState.setCardsShowNum(XYGLogic.Instance.showNum);
        playerDeskState.clearCards(data);
    },

});