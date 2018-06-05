var GameTDKStateReady = function () {
    var State = GameTDKBaseState.extend({
        ctor: function (status) {
            this._super(status);
        },
        onInit: function () {
            this._super();
            qp.event.listen(this, 'mjReadyStatus', this.onReadyStatus.bind(this));
            qp.event.listen(this, 'appPlayerExit', this.checkCanOpToStartGame.bind(this));
            qp.event.listen(this, 'appPlayerEnter', this.checkCanOpToStartGame.bind(this));

            this.mDelegate.reset();
            for (var chair = 0; chair < TDK_TABLE_TOTAL_PN; chair++) {
                var cpSCtrl = this.mDelegate.getPlayerSeatCtrlByChair(chair);

                JJLog.print("chair: " + chair + " , cpSCtrl:", cpSCtrl);
                if (cpSCtrl) {
                    cpSCtrl.checkReadyStatus();
                }
            }

            this.mDelegate.refreshTableInfo();
            this.checkCanOpToStartGame();

            qp.event.send('appGameRoomInfo', {});
            this.mDelegate.showPanelWaiting();
        },

        resetSeats: function () {
            if(this._resetS) return;
            for (var chair = 0; chair < TDK_TABLE_TOTAL_PN; chair++) {
                var cpSCtrl = this.mDelegate.getPlayerSeatCtrlByChair(chair);
                if (cpSCtrl) {
                    cpSCtrl.reset();
                }
            }
            this._resetS = true;
        },

        onRelease: function () {
            this._super();
            qp.event.stop(this, 'mjReadyStatus');
            qp.event.stop(this, 'appPlayerExit');
            qp.event.stop(this, 'appPlayerEnter');
            this.resetSeats();
        },

        onReadyStatus: function (data) {
            var uid = data.uid;
            if(uid == hall.user.uid){
                this.resetSeats();
            }
            var playSeatCtrl = this.mDelegate.getPlayerSeatCtrl(uid);
            if (playSeatCtrl) {
                
                playSeatCtrl.setReadyStatus(data.readyStatus);
            }
            sound.playReady();

            this.checkCanOpToStartGame();

        },

    });

    var ins = {
        ID: "READY",
        create: function (status) {
            var s = new State(status);
            s.ID = this.ID;
            return s;
        },
    };
    return ins;
}();
