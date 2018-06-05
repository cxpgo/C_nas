var GameStateOver = GameBaseState.extend({
    ctor: function (status ) {
        this._super(status , "over");
    },

    onInit: function () {
        this._super();
        qp.event.listen(this, 'mjGameResult', this.onGameResult);
        for (var key in this.mGameDesk.playerSeatAll) {

            var playerDeskState = this.mGameDesk.playerSeatAll[key];
            if(playerDeskState)
            {
                var info = XYGLogic.Instance.uidOfInfo(playerDeskState.uid);
                if(!info) break;

                // this._checkReadyStatus(playerDeskState , {readyStatus: info.isReady});
                playerDeskState.reStart();
            }
        }
    },
    onRelease: function () {
        this._super();
        qp.event.stop(this, 'mjGameResult');
    },
    onGameResult: function (data) {
        XYGLogic.Instance.result = data;
        var self = this;
        for(var key in XYGLogic.Instance.getReady)
        {
            XYGLogic.Instance.getReady[key] = 0;
        }
        this.setResultCards(data);

        XYGLogic.Instance.checkNum = 0;
        // this.setCheckNum(false);

        if(XYGLogic.Instance.chuntian)
        {
            this.opAni = new DDZChunTianAnimation();
            cc.director.getRunningScene().addChild(this.opAni);
            this.opAni.play(function () {
                if (XYGLogic.Instance.isGold == 1) {
                    var result = new DDZGoldRoundResult(data, self);
                } else {
                    var result = new DDZRoundResult(data, self);
                }
                result.showResult();
                XYGLogic.Instance.chuntian = null;
            });
        }
        else
        {
            JJLog.print("结束通知=" + JSON.stringify(data));
            if (XYGLogic.Instance.isGold == 1) {
                var result = new DDZGoldRoundResult(data, self);
            } else {
                var result = new DDZRoundResult(data, self);
            }
            result.showResult();
        }
    },
    _checkReadyStatus: function (playerDeskState , data) {
        playerDeskState.setReadyState(data);

    }
});