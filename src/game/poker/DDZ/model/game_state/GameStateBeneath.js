var GameStateBeneath = GameBaseState.extend({

    ctor: function (status ) {
        this._super(status , "beneath");
    },

    onInit: function () {
        this._super();
        this.panel_option_waiting.setVisible(false);
        this.panel_option_playing.setVisible(true);
        //通知叫地主
        qp.event.listen(this, 'pkNotifyLord', this.onNotifyLord.bind(this));

        //通知叫地主状态
        qp.event.listen(this, 'pkSyncLordInfo', this.onNotifyLordInfo.bind(this));

        //叫地主结果
        qp.event.listen(this, 'pkSyncLordResult', this.onSyncLordResult.bind(this));
        //发牌、抢地主校验
        qp.event.listen(this, 'mjSendHandCards', this.onReceiveHandCards.bind(this));

        //玩家操作 加倍 让牌
        //同步操作
        qp.event.listen(this, 'mjSyncPlayerOP', this.onSyncPlayerOP.bind(this));
        //通知操作
        qp.event.listen(this, 'mjNotifyPlayerOP', this.onNotifyPlayerOP.bind(this));

        this.checkOptOfflinRePlay();
        for (var key in this.mGameDesk.playerSeatAll) {
            
            var playerDeskState = this.mGameDesk.playerSeatAll[key];

            var panelWait = playerDeskState.findChild("panel_status_waiting");
            if(panelWait) panelWait.setVisible(false);
        }

    },

    onRelease: function () {
        this._super();
        qp.event.stop(this, 'pkNotifyLord');
        qp.event.stop(this, 'pkSyncLordInfo');
        qp.event.stop(this, 'pkSyncLordResult');
        //hxx
        qp.event.stop(this, 'mjSendHandCards');
        qp.event.stop(this, 'mjSyncPlayerOP');
        qp.event.stop(this, 'mjNotifyPlayerOP');
    },
    //hxx
    onReceiveHandCards: function (data) {
        // //发牌、抢地主校验
        var ay1 = data.cards;
        var ay2 = XYGLogic.Instance.lordCards;
        
    },

    checkOptOfflinRePlay: function () {
        if(XYGLogic.Instance.CurOptLord){
            this.onNotifyLord({uid:XYGLogic.Instance.CurOptLord});
        } else if (XYGLogic.Instance.offLineInfo.currOp) {
            this.onNotifyPlayerOP(XYGLogic.Instance.offLineInfo.currOp);
        }
    },

    onNotifyLord: function (data) {
        var uid = data.uid;
        var playerDeskState = this.mGameDesk.getPlayerSeatByUID(uid);   
        if(!playerDeskState) return;
        if(XYGLogic.Instance.mode == 1)
           playerDeskState.operationLord(data);
        else if(XYGLogic.Instance.mode == 2)
           playerDeskState.operationcallpoints(data);
        playerDeskState.mClockCtrl.countDown("Beneath" , 9, playerDeskState.autoHosting.bind(playerDeskState, POKERDDZOPTYPE.LORD));

    },

    onNotifyLordInfo: function (data) {
        JJLog.print("!!!!!!!!!!!", data);
        var uid = data.uid;
        var msg = data.msg;
        var playerDeskState = this.mGameDesk.getPlayerSeatByUID(uid);

        if(!playerDeskState) return;

        if(XYGLogic.Instance.mode == 1)
        {
            var count = msg.count;
            playerDeskState.operationLordEnd(data);
            if(count < 2)
            {
                sound.PlayOrderSound(XYGLogic.Instance.uidOfInfo(uid),data.msg.isLord);
                playerDeskState.optNoticeTips(data.msg.isLord ? "jiaodizhu" : "bujiao") ;
            }
            else
            {
                if (XYGLogic.Instance.person == 2) {
                    this.img_dolordCount.setVisible(true);
                    this.setDoLordCount(count - 1);
                }
                sound.PlayGrabSound(XYGLogic.Instance.uidOfInfo(uid), data.msg.isLord);
                // playerDeskState.optNoticeTips(data.msg.isLord ? "抢地主" : "不抢") ;
                playerDeskState.optNoticeTips(data.msg.isLord ? "qiangdizhu" : "buqiang") ;
            }
        }
        else if(XYGLogic.Instance.mode == 2)
        {
            playerDeskState.operationcallpointsEnd(data);
            // var calls = ["不叫","1倍","2倍","3倍"];
            var calls = ["bujiao","yifen","erfen","sanfen"];
            switch(data.msg.isLord)
            {
                case 0:
                    sound.PlaycallsSound(XYGLogic.Instance.uidOfInfo(uid),data.msg.isLord);
                    playerDeskState.optNoticeTips(calls[data.msg.isLord]) ;
                    break;
                case 1:
                    sound.PlaycallsSound(XYGLogic.Instance.uidOfInfo(uid),data.msg.isLord);
                    playerDeskState.optNoticeTips(calls[data.msg.isLord]) ;
                    break;
                case 2:
                    sound.PlaycallsSound(XYGLogic.Instance.uidOfInfo(uid),data.msg.isLord);
                    playerDeskState.optNoticeTips(calls[data.msg.isLord]) ;
                    break;
                case 3:
                    sound.PlaycallsSound(XYGLogic.Instance.uidOfInfo(uid),data.msg.isLord);
                    playerDeskState.optNoticeTips(calls[data.msg.isLord]) ;
                    break;
            }
        }
        playerDeskState.mClockCtrl.stop();
    },

    onSyncLordResult: function (data) {
        JJLog.print("onSyncLordResult" , JSON.stringify(data));
        XYGLogic.Instance.lordCards = data.msg.cards;
        this.setBeneathCards(data.msg.cards);
        XYGLogic.Instance.bankerId = data.msg.banker;
        XYGLogic.Instance.checkNum = data.msg.checkNum;
        XYGLogic.Instance.updateMulityValue();

        if (XYGLogic.Instance.person == 2) {
            this.setDoLordCount(0)
           this.setCheckNum(true);
        }
        var uid = data.uid;
        var playerDeskState = this.mGameDesk.getPlayerSeatByUID(data.msg.banker);

        if(!playerDeskState) return;
        playerDeskState.mDeskHead.resetBakerShow();
        if (data.msg.cards.length > 0) {
            XYGLogic.Instance.playCardsNum[uid] += data.msg.cards.length;
        }
        playerDeskState.insertHandCards(data.msg.cards);
        var event = new cc.EventCustom(CommonEventAction.UPDATETIP_EVT);
        if (XYGLogic.Instance.person == 2) {
            event.setUserData(true);
        } else {
            event.setUserData(false);
        }
        cc.eventManager.dispatchEvent(event);
    },
    onSyncPlayerOP: function (data) {
        JJLog.print("onSyncPlayerOP =>", data);
        var uid = data.uid;
        var msg = data.msg;
        var playerDeskState = this.mGameDesk.getPlayerSeatByUID(uid);
        if(!playerDeskState) return;
        var opType = msg.opType;
        switch (opType) {
            case POKERDDZOPTYPE.DOUBLE:
                sound.PlayDoubleSound(XYGLogic.Instance.uidOfInfo(uid), msg.isDouble);
                playerDeskState.mClockCtrl.stop();
                playerDeskState.operationDoubleEnd();
                playerDeskState.optNoticeTips(msg.isDouble ? "jiabei" : "bujiabei") ;
                break;
            case POKERDDZOPTYPE.CHECK:
                break;

        }
    },
    onNotifyPlayerOP: function (data) {
        JJLog.print("onNotifyPlayerOP =>", data);
        var uid = data.uid;
        var msg = data.msg;
        var playerDeskState = this.mGameDesk.getPlayerSeatByUID(uid);
        if(!playerDeskState) return;
        var opType = msg.opType;
        switch (opType) {
            case POKERDDZOPTYPE.DOUBLE:
                playerDeskState.operationDouble();
                playerDeskState.mClockCtrl.countDown("Double" , 9, playerDeskState.autoHosting.bind(playerDeskState, POKERDDZOPTYPE.DOUBLE));
                break;
            case POKERDDZOPTYPE.CHECK:
                break;

        }

    }
});
