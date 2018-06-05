var InputRoomPanel = cc.Layer.extend({
    btn_reset: null,
    btn_del: null,
    textArray: null,
    btnArray: null,
    panel: null,
    ctor: function () {
        this._super();

        var root = util.LoadUI(GameHallJson.Join).node;
        this.addChild(root);
        this.btnArray = new Array();
        for (var i = 0; i < 10; i++) {
            var str = "btn_" + i;
            var btn = ccui.helper.seekWidgetByName(root, str);
            btn.setTag(i);
            var data = {};
            data['root'] = this;
            data['tag'] = i;
            btn.addClickEventListener(this.onNum.bind(data));
            btn.addTouchEventListener(util.btnTouchEvent);
            this.btnArray.push(btn);
        }

        this.textArray = new Array();
        for (var i = 0; i < 6; i++) {
            var str = "text" + i;
            var text = ccui.helper.seekWidgetByName(root, str);
            text.setString('');
            this.textArray.push(text);
        }

        this.btn_del = ccui.helper.seekWidgetByName(root, "btn_del");
        this.btn_del.addClickEventListener(this.onDel.bind(this));
        this.btn_del.addTouchEventListener(util.btnTouchEvent);


        this.btn_reset = ccui.helper.seekWidgetByName(root, "btn_reset");
        this.btn_reset.addClickEventListener(this.onRest.bind(this));
        this.btn_reset.addTouchEventListener(util.btnTouchEvent);

        this.btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        this.btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        this.btn_close.addTouchEventListener(util.btnTouchEvent);
        this.panel = ccui.helper.seekWidgetByName(root, "panel_room")

    },

    onNum: function () {

        var root = this['root'];
        if (root.textArray[root.textArray.length - 1].length > 0)
            return;
        var num = this['tag'];
        for (var i = 0; i < root.textArray.length; i++) {
            var text = root.textArray[i];
            if (text.getString().length <= 0) {
                text.setString(num);
                break;
            }
        }

        var roomId = '';
        for (var i = 0; i < root.textArray.length; i++) {
            var text = root.textArray[i];
            roomId += text.getString();
            if (text.getString().length <= 0) {
                return;
            }
        }
        var _r = root;

        hall.net.getTableServerType(parseInt(roomId), function (data) {
            if (data.code == 200) {
                var appId = GAMETYPES[data.serverType];
                
                hall.joinPrivate(appId, roomId, function (data) {
                    if (data["code"] == 200) {
                        hall.enter(appId);
                    } else {
                        _r.showErr(data);
                    }
                });
            } else {
                _r.showErr(data);
            }
        })
    },


    showErr: function (data) {
        this.onRest();
        var dialog = new JJConfirmDialog();
        dialog.setDes(data['error'] || data.err);
        dialog.showDialog();
    },


    onRest: function () {
        for (var i = 0; i < this.textArray.length; i++) {
            var text = this.textArray[i];
            text.setString('');

        }
    },

    onDel: function () {

        for (var i = this.textArray.length; i > 0; i--) {
            var text = this.textArray[i - 1];
            if (text.getString().length > 0) {
                text.setString('');
                break;
            }
        }
    },

    onEnter: function () {
        this._super();

    },

    showPanel: function () {
        if (this.panel) {
            this.panel.setScale(0.3)
            this.panel.runAction(cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1, 1)))
        }
        cc.director.getRunningScene().addChild(this);
    }

});

var _SwitchOptStruct_ = function (optBtn, optClass) {
    this.optBtn = optBtn;
    this.optClass = optClass;
    this.show = function () {
        this.optBtn.setBright(false);
        this.optBtn.setTouchEnabled(false);
        this.optClass.setVisible(true);
    };
    this.hide = function () {
        this.optBtn.setBright(true);
        this.optBtn.setTouchEnabled(true);
        this.optClass.setVisible(false);
    };
    this.getOptClass = function () {
        return this.optClass;
    };
};

var CreateRoomView = BaseCreateRoomView.extend({
    mOptGameOpts: {},
    uiOpt: {},
    ctor: function (data, optTipsNode) {
        this._super(data, optTipsNode);
    },

    onCreateRoom: function () {
        var curSwitchClass = this.mOptGameOpts[this.mCurSwitch];
        if (!curSwitchClass) {
            return;
        }
        this.btn_create.setTouchEnabled(false);
        curSwitchClass.getOptClass().recordNewConfig();
        util.setCacheItem('config_gameindex', this.mCurSwitch);
        var roomData = curSwitchClass.getOptClass().getCreateRoomData();

        var appId = roomData.appId;
        var sendData = roomData.data;
        // sendData.rounds = 1;
        hall.createPrivate(appId, sendData, function (data) {
            this.btn_create.setTouchEnabled(true);
            if (data["code"] == 200) {
                hall.enter(appId);
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data['error'] || data.err);
                dialog.showDialog();
            }
        }.bind(this));
    },


    onCreateOtherRoom: function () {

    },
});

