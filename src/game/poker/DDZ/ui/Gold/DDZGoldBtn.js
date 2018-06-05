var DDZGoldBtn = cc.Layer.extend({
    btn_open: null,
    btn_close: null,
    panel_btns: null,
    panel_root: null,
    isAction: null,
    isOpen: null,
    room: null,
    btn_rule: null,
    btn_change: null,
    init:false,
    ctor: function (jRoom) {
        this._super();
        var root = util.LoadUI(DDZPokerJson.GoldBtn).node;
        this.addChild(root);
        jRoom.addChild(this, 999);
        this.room = jRoom;
        this.initUI(root);
    },
    initUI: function (root) {
        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        this.panel_btns = ccui.helper.seekWidgetByName(root, "panel_btns");
        this.btn_open = ccui.helper.seekWidgetByName(root, "btn_open");
        this.btn_close = ccui.helper.seekWidgetByName(root, "btn_close");

        this.btn_open.addClickEventListener(this.onOpen.bind(this));
        this.btn_close.addClickEventListener(this.onClose.bind(this));
        this.panel_root.addClickEventListener(this.onClose.bind(this));

        var btn_exit = ccui.helper.seekWidgetByName(root, "btn_exit");
        this.btn_change = ccui.helper.seekWidgetByName(root, "btn_change");
        this.btn_rule = ccui.helper.seekWidgetByName(root, "btn_wanfa");
        var btn_setting = ccui.helper.seekWidgetByName(root, "btn_setting");

        btn_exit.addClickEventListener(this.onExitEvent.bind(this))
        this.btn_change.addClickEventListener(this.onChangeEvent.bind(this))
        this.btn_rule.addClickEventListener(this.onWanfaEvent.bind(this))
        btn_setting.addClickEventListener(this.onSetEvent.bind(this))

        this.setBtnStatus(false);

    },
    onEnter: function () {
        this._super();

    },

    onExit: function () {
        this._super();
    },
    setBtnStatus: function (status) {
        this.btn_close.setVisible(status);
        this.panel_root.setTouchEnabled(status);
        this.btn_open.setVisible(!status);
        this.isOpen = status;
    },

    onOpen: function () {
        if (this.isAction || this.isOpen) return;
        this.isAction = true;
        this.panel_btns.runAction(cc.sequence(cc.moveBy(0.2, -200, 0), cc.callFunc(function () {
            this.setBtnStatus(true);
            this.isAction = false;
            this.isOpen = true;
        }.bind(this))));
    },

    onClose: function () {
        if (this.isAction || !this.isOpen) return;
        this.isAction = true;
        this.panel_btns.runAction(cc.sequence(cc.moveBy(0.2, 200, 0), cc.callFunc(function () {
            this.setBtnStatus(false)
            this.isAction = false;
            this.isOpen = false;
        }.bind(this))));
    },
    // showPanel: function () {
    //     cc.director.getRunningScene().addChild(this, 999);
    // },

    onExitEvent: function () {
        sound.playBtnSound();
        this.onClose();
        console.log("status", XYGLogic.Instance.status)
        var status = XYGLogic.Instance.status;
        if (status > 1) {
            var bar = new QDTipBar()
            bar.show("游戏正在进行中,请在空闲时离开！",1);
            return;
        }
        XYGLogic.net.leavePrivateTable(0, function (data) {
            var majHall = new MajhongHall();
            majHall.showHall();
        });
    },
    onChangeEvent: function () {
        sound.playBtnSound();
        this.onClose();
        console.log("status", XYGLogic.Instance.status)
        var status = XYGLogic.Instance.status;
        if (status > 1) {
            var bar = new QDTipBar();
            bar.show("空闲时才能换桌！",1);
            return;
        }
        this.btn_change.setTouchEnabled(false);
        MajhongLoading.show('加载中...');
        hall.net.changeGoldTable("doudizhu",XYGLogic.table.tableId,1,1,
            function (cbData) {
                MajhongLoading.dismiss();
                if(cbData.code == 200)
                {
                    this.removeFromParent();
                    hall.enter(DDZPoker.appId, -1);
                }else if(cbData.code == 400)
                {
                    this.btn_change.setTouchEnabled(true);
                    this.room.onSelfLeave(false);
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(cbData['error']);
                    dialog.showDialog();
                    dialog.setCallback(function () {
                        this.room.onSelfLeave(true);
                        hall.net.changeGoldTable("doudizhu",XYGLogic.table.tableId,0,1,
                            function (cbD) {
                                if(cbD.code == 200)
                                {
                                    this.removeFromParent();
                                    hall.enter(DDZPoker.appId, -1);
                                }else
                                {
                                    this.room.onSelfLeave(false);
                                    var dialog = new JJConfirmDialog();
                                    dialog.setDes(cbD['error']);
                                    dialog.showDialog();
                                }
                            }.bind(this));
                    }.bind(this));

                }else if (cbData.code == 510) {
                    var majHall = new MajhongHall();
                    majHall.showHall();
                }
                else if(cbData.needGold == 1)
                {
                    this.btn_change.setTouchEnabled(true);
                    this.room.onSelfLeave(false);
                    var times =  hall.dayLogin.activeData.dayGold;
                    if(times < 4 && XYGLogic.table.goldLevel == 1)
                    {
                        util.getDayGoldTip(cbData.rewardNum,times+1);
                    }else
                    {
                        var dialog = new JJMajhongDecideDialog();
                        dialog.setDes(cbData['error']);
                        dialog.setCallback(function () {
                            util.showLessGoldDialog();
                        });
                        dialog.setCancelCal(function () {
                            XYGLogic.net.leavePrivateTable(0, function (data) {
                                if(data.code == 200)
                                {
                                    var majHall = new MajhongHall();
                                    majHall.showHall();
                                }
                            });
                        });
                        dialog.showDialog();
                    }
                }else
                {
                    this.btn_change.setTouchEnabled(true);
                    this.room.onSelfLeave(false);
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(cbData['error']);
                    dialog.showDialog();
                }

            }.bind(this));

    },
    onWanfaEvent: function () {
        sound.playBtnSound();
        this.onClose();
        this.room.panel_rule.setVisible(true);
        this.btn_rule.setTouchEnabled(false);
        this.room.panel_rule.runAction(cc.sequence(cc.moveBy(0.4, 0, -720), cc.callFunc(function () {
            this.btn_rule.setTouchEnabled(true);
            this.btn_close.setTouchEnabled(false)
            this.btn_open.setTouchEnabled(false)
        }.bind(this))))

        if (this.init) return;
        this.init = true;
        this.room.panel_rule.addClickEventListener(function () {
            this.room.panel_rule.runAction((cc.moveBy(0.2, 0, 720)))
            this.btn_close.setTouchEnabled(true)
            this.btn_open.setTouchEnabled(true)
        }.bind(this));
    },
    onSetEvent: function () {
        sound.playBtnSound();
        this.onClose();
        var set = new SetupDialog(1);
        set.registerDissolveEvent(this.onExitEvent.bind(this));
        set.showDialog();

    },
});
