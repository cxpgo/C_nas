var GameTDKStateWait = function () {
    var State = GameTDKBaseState.extend({
        ctor: function (status ) {
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

                JJLog.print("chair: " + chair + " , cpSCtrl:" , cpSCtrl);
                if(cpSCtrl){
                    cpSCtrl.reset();
    
                    cpSCtrl.checkReadyStatus();
                }
            }

            this.mDelegate.refreshTableInfo();
            this.checkCanOpToStartGame();

            qp.event.send('appGameRoomInfo', {});
            this.mDelegate.showPanelWaiting();
        },

        onRelease: function () {
            this._super();
            qp.event.stop(this, 'mjReadyStatus');
            qp.event.stop(this, 'appPlayerExit');
            qp.event.stop(this, 'appPlayerEnter');
        },
    
        onReadyStatus: function (data) {
            var uid = data.uid;
            
            var playSeatCtrl = this.mDelegate.getPlayerSeatCtrl(uid);
            if(playSeatCtrl){
                playSeatCtrl.setReadyStatus(data.readyStatus);
            }
            sound.playReady();
            
            this.checkCanOpToStartGame();

        },
    
    });

    var ins = {
        ID: "WAIT",
        create: function (status) {
            var s = new State(status);
            s.ID = this.ID;
            return s;
        },
    };
    return ins; 
}();



