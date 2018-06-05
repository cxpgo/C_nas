var TDKDeskPlayer = cc.Layer.extend({
    SeatClassCfg: [
        TDKSelfSeat,    //0
        TDKRightSeat,   //1
        TDKRightSeat,    //2
        TDKLeftSeat,    //3
        TDKLeftSeat,    //4
    ],
    ctor: function () {
        this._super();
        var root = util.LoadUI(TDKJson.Desk).node;
        this.addChild(root);

        this.mRoot = root;

        this.mSeatPanels = [];
        this.mSeatPlayers = {};
        this.mSeatUIDPlayers = {};

        this._initView();

    },

    _initView: function () {
        for (var i = 0; i < 5; i++) {
            var node = ccui.helper.seekWidgetByName(this.mRoot, "node_" + i);
            node.setVisible(false);
            this.mSeatPanels.push(node);
        }
        for (var i = 0; i < 5; i++) {
            var node = ccui.helper.seekWidgetByName(this.mRoot, "img_tips_" + i);
            node.setVisible(false);
        }
    },


    onEnter: function () {
        this._super();

        qp.event.listen(this, 'appPlayerEnter', this.onPlayerEnter.bind(this));
        qp.event.listen(this, 'appPlayerLeave', this.onPlayerExit.bind(this));

        qp.event.listen(this, 'appDisPEnd', this.checkBestCardSetSocre.bind(this));
    },
    onExit: function () {
        this._super();
        qp.event.stop(this, 'appPlayerEnter');
        qp.event.stop(this, 'appPlayerLeave');
        qp.event.stop(this, 'appDisPEnd');
    },

    build: function () {
        for (var chair = 0; chair < this.mSeatPanels.length; chair++) {
            this.addPlayerByChair(chair);
        }
    },
    
    getPlayerSeatCtrlByChair: function (chair) {
        return this.mSeatPlayers[chair];
    },

    getPlayerSeatCtrl: function (uid) {
        return this.mSeatUIDPlayers[uid];
    },

    addPlayerByChair: function (chair) {
        var player = TDKPlayerMgr.Instance.getPlayerByPos(chair);
        JJLog.print("addPlayerByChair:",chair , player);
        if (!player) { return;}

        if (this.mSeatPlayers[chair]) {
            this.mSeatPlayers[chair].removeFromParent();
            this.mSeatPlayers[chair] = null;
        }
        this.mSeatPanels[chair].setVisible(true);
        var seatClass = this.SeatClassCfg[chair];
        var optTipsNode = ccui.helper.seekWidgetByName(this.mRoot, "img_tips_" + chair);
        var _deskSeat = new seatClass(player , optTipsNode);
        this.mSeatPanels[chair].addChild(_deskSeat , 0);
        this.mSeatPlayers[chair] = _deskSeat;
        this.mSeatUIDPlayers[player.uid] = _deskSeat;
        if(chair<3)
        {
            XYGLogic.Instance.SeatPlayerInfo[player.uid] = cc.p(this.mSeatPanels[chair].getPosition().x - 100,this.mSeatPanels[chair].getPosition().y + 71);
        }
        else
        {
            XYGLogic.Instance.SeatPlayerInfo[player.uid] = cc.p(this.mSeatPanels[chair].getPosition().x + 40,this.mSeatPanels[chair].getPosition().y + 71);
        }
    },
    removePlayerByChair: function (chair) {
        if (this.mSeatPlayers[chair]) {
            var uid = this.mSeatPlayers[chair].uid;
            
            this.mSeatPanels[chair].setVisible(false);

            this.mSeatPlayers[chair].removeFromParent();
            this.mSeatPlayers[chair] = null;
            this.mSeatUIDPlayers[uid] = null;
            delete this.mSeatPlayers[chair];
            delete this.mSeatUIDPlayers[uid];
        }
    },

    onPlayerEnter: function (uid) {
        var player = TDKPlayerMgr.Instance.getPlayer(uid);
        if (!player) { return;}
        var viewIndex = player.position;
        var chair = TDKPlayerMgr.Instance.viewIndex2Chair(viewIndex);
        this.addPlayerByChair(chair);
        
    },

    onPlayerExit: function (uid) {
        var player = TDKPlayerMgr.Instance.getPlayer(uid);
        if (!player) { return;}
        var viewIndex = player.position;
        var chair = TDKPlayerMgr.Instance.viewIndex2Chair(viewIndex);
        this.removePlayerByChair(chair);
    },

    checkBestCardSetSocre: function () {
        var BestScoreUID = 0;
        var BestScore = 0;
        var BestCount = 0;
        for (var uid in  this.mSeatUIDPlayers) {
            var seat =  this.mSeatUIDPlayers[uid];
            var score = seat.getCardSetScore() ;
            if(score == BestScore){
                BestCount ++;
            }
            if(score > BestScore){
                BestScore = score;
                BestScoreUID = uid;
                BestCount = 0;
            }
        }

        for (var uid in  this.mSeatUIDPlayers) {
            var seat =  this.mSeatUIDPlayers[uid];
            var score = seat.getCardSetScore() ;
            var diffScore = BestScore - score;
            if(diffScore  == 0){ //是最高那一位
                if(BestCount < 1){
                    seat.setDiffHandCardScore(BestScore , true);
                }else{
                    seat.setDiffHandCardScore(diffScore);
                }
                
            }else{
                seat.setDiffHandCardScore(diffScore);
            }
        }

    },

});