var MJPlugInDingQue= SeatPlugInBase.extend({
    ctor: function (deskSeat){
        this._super();
        this.mDeskSeat = deskSeat;
        this.node_que = util.LoadUI(MJBaseRes.WGDingQue).node;
        this.addChild(this.node_que);
        this.node_que.setVisible(false);

        for (var i = 0; i < 3; i++) {
            var btn_que = ccui.helper.seekWidgetByName(this.node_que, "btn_que" + i);
            btn_que.addClickEventListener(this.onPlayerDingQue.bind(this));
        }
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'mjDingQueStart', this.onDingQueStart.bind(this));
        qp.event.listen(this, 'mjDingQueEnd', this.onDingQueEnd.bind(this));
    },

    onExit: function () {
        this._super();

        qp.event.stop(this, 'mjDingQueStart');
        qp.event.stop(this, 'mjDingQueEnd');

    },



    onDingQueStart: function (data) {

        JJLog.print("onDingQueStart" + JSON.stringify(data));

        this.mDeskSeat.resetHandCards();

        var key = this.calDingQue();
        var btn_que = ccui.helper.seekWidgetByName(this.node_que, "btn_que" + key);
        XYGLogic.Instance.addSpriteFrames(MJBaseRes.QuanPlist);
        var img = new cc.Sprite('#' + 'quan-animation_0.png');
        img.setTag(1234);
        img.setScale(1.1);
        var animFrames = [];
        for (var i = 0; i < 30; i++) {
            var str = "quan-animation_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var anim = new cc.Animation(animFrames, 0.05);
        img.runAction(cc.animate(anim).repeatForever());
        btn_que.parent.addChild(img);
        img.setPosition(btn_que.getPosition());
        this.node_que.setVisible(true);
    },
    onDingQueEnd: function (data) {
        var currGame = hall.getPlayingGame().table;
        JJLog.print("onDingQueEnd" + JSON.stringify(data));
        this.node_que.setVisible(false);
        this.node_que.removeChildByTag(1234);
        for (var i = 0; i < data.length; i++) {
            var uid = data[i].uid;
            var que = data[i].que;
            if (uid == this.mDeskSeat.uid) {
                currGame.playerQue = que;
                this.mDeskSeat.resetPanelInChild();
                break;
            }
        }
        if (currGame) currGame.status = XueZhanGameStatus.PLAYING;
    },

    calDingQue: function () {
        //W T B
        var countW = 0;
        var countT = 0;
        var countB = 0;
        var tempArr = [];
        if (this.mDeskSeat.moCard) tempArr.push(this.mDeskSeat.moCard);
        tempArr = [].concat.apply(tempArr, this.mDeskSeat.cardInArray);

        for (var i = 0; i < tempArr.length; i++) {
            var card = tempArr[i];
            if (card.paiOfCard().keyOfPai().indexOf("W") >= 0) {
                countW++;
            } else if (card.paiOfCard().keyOfPai().indexOf("T") >= 0) {
                countT++;
            } else if (card.paiOfCard().keyOfPai().indexOf("B") >= 0) {
                countB++;
            }
        }
        var min = Math.min(countW, countT, countB);
        if (min == countW) {
            return 0;
        } else if (min == countT) {
            return 1;
        } else {
            return 2;
        }
    },

    onPlayerDingQue: function (sender) {
        sound.playBtnSound();
        var queMen = sender.name == "btn_que0" ? "W" : sender.name == "btn_que1" ? "T" : "B";
        //W T B
        XYGLogic.net.dingQue(
            {"que": queMen},
            function (data) {
                if (data.code == 200)
                    this.node_que.setVisible(false);
                if (this.delegate) this.delegate.showQueByUID(this.uid, queMen);
            }.bind(this)
        );
    },


    
});