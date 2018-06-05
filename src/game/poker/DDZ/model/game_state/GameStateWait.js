var GameStateWait = GameBaseState.extend({
    ctor: function (status) {
        this._super(status, "wait");
    },
    onInit: function () {
        this._super();
        qp.event.listen(this, 'mjReadyStatus', this.onReadyStatus.bind(this));

        this.setBeneathCards([{"type": 0x00, "value": 0x00}, {"type": 0x00, "value": 0x00}, {
            "type": 0x00,
            "value": 0x00
        }]);
        this.showChangeValue({});

        this.panel_option_waiting.setVisible(false);
        // this.btn_invite_wechat.setVisible(true);
        if (hall.songshen == 1) {
            if (this.btn_invite_wechat) this.btn_invite_wechat.setVisible(false);
        }

        this.panel_option_playing.setVisible(false);
        // this.btn_exit_game.setVisible(true);
        // for (var index = 0; index < this.mGameDesk.playerSeatAll.length; index++) {
        for (var key in this.mGameDesk.playerSeatAll) {

            var playerDeskState = this.mGameDesk.playerSeatAll[key];
            if (playerDeskState) {
                var info = XYGLogic.Instance.uidOfInfo(playerDeskState.uid);
                if (!info) break;

                // this._checkReadyStatus(playerDeskState , {readyStatus: info.isReady});
                playerDeskState.reStart();
            }
        }

        this.setChangeMulity();

    },
    onRelease: function () {
        this._super();
        qp.event.stop(this, 'mjReadyStatus');
    },

    onReadyStatus: function (data) {

        var uid = data['uid'];
        // var layer = this.GetResult_layer();
        // if(layer && uid == hall.user.uid)
        //     layer.removeFromParent();
        var playerDeskState = this.mGameDesk.getPlayerSeatByUID(uid);
        if (!playerDeskState) return;
        this._checkReadyStatus(playerDeskState, data);
    },

    _checkReadyStatus: function (playerDeskState, data) {
        playerDeskState.setReadyState(data);

    }

});