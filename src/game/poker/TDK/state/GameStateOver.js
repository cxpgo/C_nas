var GameTDKStateOver = function() {
    var State = GameTDKBaseState.extend({
        ctor: function(status) {
            this._super(status);
        },

        onInit: function() {
            this._super();

            qp.event.listen(this, 'mjGameResult', this.onStateGameResult.bind(this));

            this.setPlayerSeatReady();
        },
        onRelease: function() {
            qp.event.stop(this, 'mjGameResult');

            this._super();

        },

        setPlayerSeatReady: function() {
            var allPlayers = TDKPlayerMgr.Instance.getPlayers();
            for (var uid in allPlayers) {
                var playerData = allPlayers[uid];
                playerData.isReady = 0;
            }
        },

        onStateGameResult: function(data) {


            JJLog.print("[Over] onStateGameResult:", JSON.stringify(data));
            this.resultPreView(data);

        },

        resultPreView: function(resultData) {
            var players = resultData['players'];
            if (resultData.isLG == 0) {
                var winnerUID = 0;
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    var uid = player.uid;
                    if (player.winner >= 1) {
                        winnerUID = uid;
                    }

                    var cpSCtrl = this.mDelegate.getPlayerSeatCtrl(uid);
                    if (cpSCtrl) {
                        cpSCtrl.showResultInfo(player);
                    }
                }

                if (winnerUID) {

                    var playerSeatCtrl = this.mDelegate.getPlayerSeatCtrl(winnerUID);
                    if (!playerSeatCtrl) return;
                    playerSeatCtrl.showWinnerEffect();

                    this.mDelegate.scheduleOnce(
                        function (winnerUID) {
                            this.mDelegate.rePourForWinner(winnerUID);
                        }.bind(this , winnerUID),
                        0.5
                    );
                }
            }else{
                this.mDelegate.showPrLGAni();
            }
        },
    });
    var ins = {
        ID: "OVER",
        create: function(status) {
            var s = new State(status);
            s.ID = this.ID;
            return s;
        },
    };
    return ins;
}();