var GameStateGameing = GameBaseState.extend({
    ctor: function (status ) {
        this._super(status , "playing");
    },
    onInit : function () {
        this._super();

        
        // 通知出牌
        qp.event.listen(this, 'mjNotifyDelCards', this.onNotifyDelCards.bind(this));
        // 同步出牌
        qp.event.listen(this, 'mjSyncDelCards', this.onSyncDelCards.bind(this));
        qp.event.listen(this, 'pkSyncTableSpring', this.setpkSyncTableSpring);

        this.panel_option_waiting.setVisible(false);
        this.panel_option_playing.setVisible(true);
        // this.btn_msg.setVisible(true);
        
        for (var key in this.mGameDesk.playerSeatAll) {
            
            var playerDeskState = this.mGameDesk.playerSeatAll[key];

            if (!playerDeskState) continue;
            var panelWait = playerDeskState.findChild("panel_status_waiting");
            if(panelWait) panelWait.setVisible(false);

            playerDeskState.mDeskHead.resetBakerShow();
        }

        this.setBeneathCards(XYGLogic.Instance.lordCards);
        this.showChangeValue(XYGLogic.Instance.changeValue);
        this.setCheckNum(true);
        this.checkOptOfflinRePlay();
    },

    onRelease: function () {
        this._super();
        qp.event.stop(this, 'mjSyncDelCards');
        qp.event.stop(this, 'mjNotifyDelCards');
        qp.event.stop(this, 'pkSyncTableSpring');
    },
    //hxx
    setpkSyncTableSpring:function (data) {
        XYGLogic.Instance.chuntian = data;
        JJLog.print("春天=" + JSON.stringify(data));
        qp.event.send('pkSyncTableRate', data);

    },
    checkOptOfflinRePlay: function () {
        var uid = XYGLogic.Instance.offLineInfo['nextChuPai']
        if (uid) {
            var lastOpData = XYGLogic.Instance.offLineInfo['lastOP'];
            var data = { 'uid': uid, 'opUid': lastOpData.opUid };
            this.onNotifyDelCards(data, true);
        }
    },

    onNotifyDelCards: function (data , ani) {
        var uid = data.uid;
        var playerDeskState = this.mGameDesk.getPlayerSeatByUID(uid);

        console.error("onNotifyDelCards!!!!!!!!!!!!!!!!!!!!!!!!", data);
        if(!playerDeskState) return;

        //开局出牌bug
        var bankerId = XYGLogic.Instance.whoIsBanker();
        if (bankerId && data['uid'] != bankerId && this.mGameDesk.getPlayerSeatByUID(bankerId).cardInArray.length == 20) {
            console.error("开局bug!!!!!!!!!!!!!!!!!!!!!!!!", data);
            // var dialog = new JJConfirmDialog();
            // dialog.setDes('开局bug!');
            // dialog.showDialog();
            return;
        }

        playerDeskState.operationGiveCards(data , ani);
        //金币场 时间到了自动打牌
        playerDeskState.mClockCtrl.countDown("GiveCards" , 9, playerDeskState.autoHosting.bind(playerDeskState, POKERDDZOPTYPE.SEND));
    },

    // 同步出牌
    onSyncDelCards: function (data) {
        JJLog.print("onSyncDelCards=" + JSON.stringify(data));
        var uid = data.uid;
        var playerDeskState = this.mGameDesk.getPlayerSeatByUID(uid);   
        if(!playerDeskState) return;
        
        //记录上一家出的牌   用户自能提示  和 压制操作
        if(uid !== hall.user.uid){ //自己出的牌不需要记录
            if(data['msg'].length > 0)
            {
                XYGLogic.Instance.LastOpPai = {
                    cards : data['msg'],
                    type  : data['opCardType']
                };
            }
        } else {
            //如果自己出了牌 上一手牌置为null;
            if(data['msg'].length > 0)
            {
                XYGLogic.Instance.LastOpPai = null;
            }
        }
        if (data["msg"].length > 0) {
            XYGLogic.Instance.playCardsNum[uid] -= data["msg"].length;
        }


        playerDeskState.oprationRemoveCards(data);
        playerDeskState.showBaojing(true);
        playerDeskState.mClockCtrl.stop("GiveCards");

        this.addChupaiArray(data['uid'], data['msg']);

		if (this.opAni != null) {
			this.opAni.play(data.opCardType);
		}
    },
    
});