var JJShareDialog = JJDialog.extend({
    _Listeners: [],
    sharetype: 1,              //1是群  2是朋友圈
    agentCode: 0,
    ctor: function (data) {
        this._super();
        var Json = GameHallJson.Share;
        if (data.code == 200)
            this.agentCode = data['agentId'];

        var root = util.LoadUI(Json).node;
        this.addChild(root);
        var panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        var _this = this;
        panel_root.addClickEventListener(function () {
            _this.dismissDialog();
        });
        var btn_friendgrounps = ccui.helper.seekWidgetByName(root, "btn_friendgrounps");
        btn_friendgrounps.addClickEventListener(this.onShareGroup.bind(this));
        btn_friendgrounps.addTouchEventListener(util.btnTouchEvent);
        var btn_friendmoments = ccui.helper.seekWidgetByName(root, "btn_friendmoments");
        btn_friendmoments.addClickEventListener(this.onShareMoments.bind(this));
        btn_friendmoments.addTouchEventListener(util.btnTouchEvent);

        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));
        btn_close.addTouchEventListener(util.btnTouchEvent);

        var img_award = ccui.helper.seekWidgetByName(root, "img_award1");
        var act1 = cc.scaleTo(0.8, 0.9);
        var act2 = cc.scaleTo(0.8, 1);
        var act3 = cc.sequence(act1, act2);
        var act4 = act3.repeatForever();
        img_award.runAction(act4);
        this.panel = ccui.helper.seekWidgetByName(root, "panel_2");
    },
    onEnter: function () {
        this._super();
        var ls = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.EVT_ShareCallback,
            callback: this.onShareRultCallback.bind(this)
        });
        var listener = cc.eventManager.addListener(ls, this);
        this._Listeners.push(listener);

    },

    onExit: function () {
        for (var i = 0; i < this._Listeners.length; i++) {
            cc.eventManager.removeListener(this._Listeners[i]);
        }
        this._Listeners.splice(0, this._Listeners.length);

        this._super();
    },
    onShareGroup: function () {
        JJLog.print('分享到 朋友/群');
        this.sharetype = 1;
        if (this.agentCode > 0) {
            hall.net.wxShareURLWithAgentId("邀请码:" + this.agentCode, hall.AppAgentShareCxt, this.agentCode, 0);
        } else {
            hall.net.wxShareURL(hall.AppName, hall.AppShareCxt, 0);
        }
    },

    onShareMoments: function () {
        JJLog.print('分享到 朋友圈.');
        this.sharetype = 2;
        if (this.agentCode > 0) {
            hall.net.wxShareURLWithAgentId("邀请码:" + this.agentCode, hall.AppAgentShareCxt, this.agentCode, 1);
        } else {
            hall.net.wxShareURL(hall.AppShareCxt, hall.AppShareCxt, 1);
        }
    },

    onShareRultCallback: function (event) {
        var evt = event.getUserData();
        if (this.sharetype == 2) {
            if (evt == 0) {
                JJLog.print(" 发送服务器加房卡");
                hall.net.addShareAward(
                    function (data) {
                        JJLog.print("加房卡回调=" + JSON.stringify(data));
                        if (data['code'] == 200) {
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("获得钻石成功！");
                            dialog.showDialog();
                            this.dismissDialog();
                        } else {

                        }
                    }.bind(this));
            }
        }

    }

});