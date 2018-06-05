var DissloveOptionDialog = JJDialog.extend({
    btn_pass: null,
    btn_agree: null,
    text_name: null,
    ctor: function (data) {
        this._super();
        var root = util.LoadUI(GameRes.Dissolve).node;
        this.addChild(root);

        this.btn_pass = ccui.helper.seekWidgetByName(root, "btn_pass");
        this.btn_pass.addClickEventListener(function () {
            hall.getPlayingGame().net.dissolveSeat(3, function (data) {
                this.dismissDialog();
            }.bind(this));
        }.bind(this));
        this.btn_agree = ccui.helper.seekWidgetByName(root, "btn_agree");
        this.btn_agree.addClickEventListener(function () {
            hall.getPlayingGame().net.dissolveSeat(2, function (data) {
                this.dismissDialog();
            }.bind(this));
        }.bind(this));
        this.text_name = ccui.helper.seekWidgetByName(root, "text_name");
        var info = XYGLogic.Instance.uidOfInfo(data['uid']);
        this.text_name.setString(cutStringLenght(info['nickName']));
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
        qp.event.listen(this, 'mjGameOver', this.onGameOver);
    },

    onExit: function () {
        qp.event.stop(this, 'mjDissolutionTable');
        qp.event.stop(this, 'mjGameOver');
        this._super();
    },

    onGameOver: function (data) {
        cc.setTimeout(function () {
            this.removeFromParent();
        }.bind(this), 1200)
    },

    onDissolutionTable: function (data) {
        if (data['result'] == 0)//0拒绝解散
        {
            this.removeFromParent();
        } else if (data['result'] == 1)//1 解散成功
        {
            this.removeFromParent();
        } else {

        }
    }


});
var DissloveResultDialog = JJDialog.extend({
    text_dissolve: null,
    text_dissolve_1: null,
    text_dissolve_2: null,
    text_dissolve_3: null,
    text_clock: null,
    panel_root: null,
    ctor: function (data) {
        this._super();
        var root = util.LoadUI(GameRes.DissolveResult).node;
        this.addChild(root);
        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        this.text_dissolve = ccui.helper.seekWidgetByName(root, "text_dissolve");
        this.text_dissolve.setString('玩家[' + cutStringLenght(hall.user.nickName) + ']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
        this.text_dissolve_clone = ccui.helper.seekWidgetByName(root, "text_dissolve_clone");

        this._allTextDisV = {};

        var disUID = data.uid || data.disArr[0];

        var list_rs = ccui.helper.seekWidgetByName(root, "list_rs");
        var disArr = data.disArr;
        var allPlayerInfo = hall.getPlayingGame().table.getAllPlayerInfo();
        for (var index = 0; index < allPlayerInfo.length; index++) {
            var playerInfo = allPlayerInfo[index];
            var uid =   playerInfo.uid;
            if (uid != disUID) {
                var text_dissolve_item = this.text_dissolve_clone.clone();
                list_rs.pushBackCustomItem(text_dissolve_item);

                this._allTextDisV[uid] = text_dissolve_item;
                this.refreshPlyerDisIfno(uid , disArr.indexOf(uid) >= 0 ? 2 : -1 );
            }
        };

        this.text_dissolve_clone.setVisible(false);


        

        var btn_agree = ccui.helper.seekWidgetByName(root, "btn_agree");
        var btn_refuse = ccui.helper.seekWidgetByName(root, "btn_refuse");
        btn_agree.setVisible(false);
        btn_refuse.setVisible(false);
        this.text_clock = ccui.helper.seekWidgetByName(root, "text_clock");


        this.refreshCurDisInfo(data);
    },

    refreshCurDisInfo: function (data) {
        var uid = data['uid'] || data.disArr[0];
        var info = hall.getPlayingGame().table.uidOfInfo(uid);
        var secondTime = data['time'];
        // var minute = secondTime / 60;
        this.text_dissolve.setString('玩家[' + cutStringLenght(info.nickName) + ']申请解散房间,请等待其他玩家选择.(超过 ' + secondTime + ' 秒钟未选择,默认同意)');
        this.startClock(secondTime);
    },
    refreshPlyerDisIfno: function (uid , status) {
        var info = hall.getPlayingGame().table.uidOfInfo(uid);
        var text_dissolve = this._allTextDisV[uid];
        if(!text_dissolve) return;
        switch (status) {
            case -1:
                text_dissolve.string = '[' + cutStringLenght(info['nickName']) + ']' + '  等待选择';
                break;
            case 1:
                text_dissolve.string = '[' + cutStringLenght(info['nickName']) + ']' + '  拒绝';
                break;
            case 2:
                text_dissolve.string = '[' + cutStringLenght(info['nickName']) + ']' + '  同意';
                break;
    
        }
    },

    onDissolutionTable: function (data) {

        if (data['result'] == 0)//0拒绝解散
        {
            this.removeFromParent();
        } else if (data['result'] == 1)//1 解散成功
        {
            this.removeFromParent();
        } else {
            this.refreshPlyerDisIfno(data.uid , data.status);
        }
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
        qp.event.listen(this, 'mjGameOver', this.onGameOver);
    },

    startClock: function (sec) {
        this.text_clock.setString(sec);

        this.schedule(this.countDown, 1);
    },

    onGameOver: function (data) {
        this.removeFromParent();
    },

    countDown: function (dt) {
        var sec = parseInt(this.text_clock.getString());
        if (sec >= 1) {
            sec--;
        }
        else {
            sec = '0';
        }

        this.text_clock.setString(sec);
    },

    stopClock: function () {
        this.unschedule(this.countDown);
    },

    onExit: function () {
        qp.event.stop(this, 'mjDissolutionTable');
        qp.event.stop(this, 'mjGameOver');
        this._super();
    },


});