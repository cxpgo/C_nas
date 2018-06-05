var _SwitchOptStruct_ = function (optBtn , optClass) {
    this.optBtn  = optBtn;
    this.optClass = optClass;
    this.show = function (){
        this.optBtn.setBright(false);
        this.optBtn.setTouchEnabled(false);
        this.optClass.setVisible(true);
    };
    this.hide = function (){
        this.optBtn.setBright(true);
        this.optBtn.setTouchEnabled(true);
        this.optClass.setVisible(false);
    };
    this.getOptClass = function () {
        return this.optClass;
    };
};

var clubCreateRoomView = BaseCreateRoomView.extend( {
    mOptGameOpts : {},
    uiOpt:{},
    btn_Array:null,
    ctor: function (gameType, data, isAuto, cb) {
        this.pid = data;
        this.isAuto = isAuto;
        this.callbackUpdate = cb;
        this._super();
    },

    onCreateRoom: function () {
        if (this.isAuto) {
            this.onCreateAutoRoom();
            this.removeFromParent();
            return;
        }
        var curSwitchClass = this.mOptGameOpts[this.mCurSwitch];
        if(!curSwitchClass){
            return;
        }
        this.btn_create.setTouchEnabled(false);
        curSwitchClass.getOptClass().recordNewConfig();
        util.setCacheItem('config_gameindex', this.mCurSwitch);
        var roomData = curSwitchClass.getOptClass().getCreateRoomData();

        var appId = roomData.appId;
        var sendData = roomData.data;

        var game = hall.gameEntries[appId];
        var GameValue = game.net.GameValue;
        var GameName = game.net.GameName;

        var roomConfig = JSON.stringify(sendData);

        club.net.memberCreateTable(this.pid, GameValue,roomConfig, GameName,function (data) {
            if (data["code"] == 200) {
                hall.joinPrivate(appId, data.data.tableId, function (data) {
                    if (data["code"] == 200) {
                        hall.enter(appId);
                    } else {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(data['error']);
                        dialog.showDialog();
                    }
                });
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data['error']);
                dialog.showDialog();
            }
        }.bind(this));
    },

    onCreateAutoRoom: function () {
        var curSwitchClass = this.mOptGameOpts[this.mCurSwitch];
        if(!curSwitchClass){
            return;
        }
        this.btn_create.setTouchEnabled(false);
        curSwitchClass.getOptClass().recordNewConfig();
        util.setCacheItem('config_gameindex', this.mCurSwitch);
        var cb = this.callbackUpdate;
        var roomData = curSwitchClass.getOptClass().getCreateRoomData();

        var appId = roomData.appId;
        var sendData = roomData.data;

        var game = hall.gameEntries[appId];
        var GameValue = game.net.GameValue;
        var GameName = game.net.GameName;

        var roomConfig = JSON.stringify(sendData);
        club.net.createAutoTable(this.pid, GameValue, roomConfig, GameName, function (data) {
            if (data["code"] == 200) {
                cb();
                var dialog = new JJConfirmDialog();
                dialog.setDes("自动房间创建成功");
                dialog.showDialog();
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data['error']);
                dialog.showDialog();
            }
        }.bind(this))

    },
});


var clubSelectGameType = cc.Layer.extend({

    pid:null,
    isAuto:null,
    callbackUpdate:null,
    img_sssfree:null,
    img_mjfree:null,
    ctor: function (pid, isAuto, cb) {
        this._super();
        var root = util.LoadUI(ClubJson.ClubSelectGame).node;
        this.addChild(root);
        this.pid = pid;
        this.isAuto = isAuto;
        this.callbackUpdate = cb;
        var btn_create = ccui.helper.seekWidgetByName(root, "btn_create");
        btn_create.addClickEventListener(this.onCreateGame.bind(this));
        btn_create.addTouchEventListener(util.btnTouchEvent);

        // var node_anim = util.playTimeLineAnimation(GameHallJson.SSS,true);
        // node_anim.setPosition(cc.p(btn_create.getContentSize().width/2,btn_create.getContentSize().height/2));
        // btn_create.addChild(node_anim, -1);
        this.img_sssfree = ccui.helper.seekWidgetByName(btn_create, "img_free");
        this.img_sssfree.setVisible(false);


        var btn_create1 = ccui.helper.seekWidgetByName(root, "btn_create_1");
        btn_create1.addClickEventListener(this.onCreateMJGame.bind(this));
        btn_create1.addTouchEventListener(util.btnTouchEvent);
        this.img_mjfree = ccui.helper.seekWidgetByName(btn_create1, "img_free");
        this.img_mjfree.setVisible(false);
        // var node_anim = util.playTimeLineAnimation(GameHallJson.MJ,true);
        // node_anim.setPosition(cc.p(btn_create1.getContentSize().width/2,btn_create1.getContentSize().height/2));
        // btn_create1.addChild(node_anim, -1);

        var btn_back = ccui.helper.seekWidgetByName(root, "btn_backfk");
        btn_back.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        btn_back.addTouchEventListener(util.btnTouchEvent);

        for(var j = 0;j<hall.freeData.length;j++)
        {
            var freeData = hall.freeData[j];

            if(freeData.serverType == "shisanshui")
            {
                this.img_sssfree.setVisible(freeData.status == 1);
            }else if(freeData.status == 1)
            {
                this.img_mjfree.setVisible(true);
            }

        }

    },
    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    },
    onCreateGame: function () {
        var panel = new clubCreateRoomView(1, this.pid, this.isAuto, this.callbackUpdate);
        panel.showPanel();
        this.removeFromParent();
    },
    onCreateMJGame: function () {
        var panel = new clubCreateRoomView(2, this.pid, this.isAuto, this.callbackUpdate);
        panel.showPanel();
        this.removeFromParent();
    },

    hallFreeActiveSwitch:function (data) {
        for(var j = 0;j<data.length;j++)
        {
            var freeData = data[j];

            if(freeData.serverType == "shisanshui")
            {
                this.img_sssfree.setVisible(freeData.status == 1);
            }else
            {
                this.img_mjfree.setVisible(freeData.status == 1);
            }

        }
    },

    onEnter:function () {
        qp.event.listen(this, 'hallFreeActiveSwitch', this.hallFreeActiveSwitch.bind(this));
        this._super();
    },

    onExit:function () {
        qp.event.stop(this, 'hallFreeActiveSwitch');
        this._super();
    }

});