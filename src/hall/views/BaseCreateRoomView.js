
var BaseCreateRoomView = cc.Layer.extend({
    root: null,
    panel_root: null,
    ctor: function () {
        this._super();
        this.root = util.LoadUI(GameHallJson.CreateRoom).node;
        this.addChild(this.root);
        this.initUI();
    },

    initUI: function () {
        this.mCurSwitch = 0;
        // this.CreCfgs_btn = [{'class':TDKCreateRoomItem}, {'class': DDZCreateRoomLayout}, {'class': PDKCreateRoomLayout}, {'class': CreateRoomLayout_xz}];

        this.CreCfgs_btn = [];
        this.panelCreItemAy = new Array();
        this.panelGameObj = {};
        this.mOptGameOpts = {};

        var btn_back = ccui.helper.seekWidgetByName(this.root, "btn_back");
        btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this)
        );

        this.btn_create = ccui.helper.seekWidgetByName(this.root, "btn_create");
        this.btn_create.addClickEventListener(this.onCreateRoom.bind(this));
        this.btn_create.addTouchEventListener(util.btnTouchEvent);

        var fingerAni = util.playTimeLineAnimation("res/Animation/effect/ef_finger.json", true);
        fingerAni.setScale(0.8);
        fingerAni.setPosition(this.btn_create.getContentSize().width - 20, this.btn_create.getContentSize().height / 2 - 20);
        this.btn_create.addChild(fingerAni, 1000);

        this.btn_ListView = ccui.helper.seekWidgetByName(this.root, "btn_ListView");
        this.panel_game = ccui.helper.seekWidgetByName(this.root, "panel_game");
        this.ScrollView_1 = ccui.helper.seekWidgetByName(this.root, "ScrollView_1");
        // this.btn_Array = new Array();
        this._mShowGamesChildOpt = {};
        this.btn_game = ccui.helper.seekWidgetByName(this.root, "btn_game");

        var GameCfgs = PackageMgr.getCreateRoomCfg(this.pid);
        this.btn_ListView.removeAllChildren();
        this.mCurSwitch = util.getCacheItem('config_gameindex') || GameCfgs[0] + "_0";

        for (var i = 0; i < GameCfgs.length; i++) {
            var appId = GameCfgs[i];
            this.appendShowGame(appId);
        }

        this.showGameOptLayer();
    },

    onEnter: function () {
        this._super();
        this.registerAllEvents();
    },

    onExit: function () {
        this._super();
        this.removeAllEvents();
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'appPackageMgrAppend', this.appendShowGame.bind(this));
        qp.event.listen(this, 'appPackageMgrRemove', this.removeShowGame.bind(this));
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'appPackageMgrAppend');
        qp.event.stop(this, 'appPackageMgrRemove');
    },

    showPanel: function () {
        JJLog.print("创建房间======");
        cc.director.getRunningScene().addChild(this);
    },

    onSwitchGame: function (target) {
        var switchIndex = target.__bindData__.index;
        if (switchIndex == this.mCurSwitch) return;

        this.mCurSwitch = switchIndex;
        this.showGameOptLayer();
        if (this.mCurSwitch.indexOf("XYPackageMgr") >= 0) {
            this.btn_create.setVisible(false);
        } else {
            this.btn_create.setVisible(true);
        }

    },

    showGameOptLayer: function () {
        var switchIndex = this.mCurSwitch;
        for (var key in this.mOptGameOpts) {
            var cl = this.mOptGameOpts[key];
            cl.hide();
        }
        this.ScrollView_1.jumpToTop();
        var showCL = this.mOptGameOpts[switchIndex];
        if (showCL) {
            showCL.show();
        }
        else {
            var cfg = this._mShowGamesChildOpt[switchIndex];
            if (cfg) {
                var showLayer = new (cfg.__bindData__.creClass)();
                var layout = new ccui.Layout();
                layout.setContentSize(showLayer.getContentSize());
                showLayer.setAnchorPoint(0, 0);
                showLayer.x = 0;
                showLayer.y = 0;
                showLayer.setVisible(true);
                layout.addChild(showLayer);
                layout.x = 0;
                layout.y = this.ScrollView_1.getInnerContainerSize().height - showLayer.getContentSize().height;
                // layout.retain();
                this.panelCreItemAy.push(showLayer);
                this.panelGameObj[switchIndex] = layout;

                this.ScrollView_1.addChild(layout);
                // layout.release();
                this.mOptGameOpts[switchIndex] = new _SwitchOptStruct_(this._mShowGamesChildOpt[switchIndex], showLayer);
                this.mOptGameOpts[switchIndex].show();
            }
            else {
                this.mCurSwitch = PackageMgr.getCreateRoomCfg()[0] + "_0";
                this.showGameOptLayer();
            }
        }
        if (!this.panelGameObj[switchIndex]) return;

        if (this.panelGameObj[switchIndex].y > 200) {
            this.ScrollView_1.setTouchEnabled(false);
        } else {
            this.ScrollView_1.setTouchEnabled(true);
        }
    },

    appendShowGame: function (appIdOrCfg, tagF) {

        var cfgs = null;
        var appId = appIdOrCfg;
        if (typeof (appIdOrCfg) == "string") {
            var game = hall.gameEntries[appId];
            if(!!game){
                cfgs = [].concat(game.getCreateRoomItem());
            }else{
                cfgs = [];
            }

        } else {
            cfgs = [appIdOrCfg];
            appId = "XYPackageMgr";
        }

        for (var index = 0; index < cfgs.length; index++) {

            var cfg = cfgs[index];
            var wgID = appId + "_" + index;
            if (this._mShowGamesChildOpt[wgID]) {
                return;
            };
            var btn = this.btn_game.clone();
            // this.CreCfgs_btn.push();
            btn.loadTextureNormal(cfg['url'][0], ccui.Widget.LOCAL_TEXTURE);
            btn.loadTexturePressed(cfg['url'][1], ccui.Widget.LOCAL_TEXTURE);
            btn.loadTextureDisabled(cfg['url'][2], ccui.Widget.LOCAL_TEXTURE);
            // this.btn_Array.push(btn);
            btn.addClickEventListener(this.onSwitchGame.bind(this));
            this._mShowGamesChildOpt[wgID] = btn;
            btn.__bindData__ = {
                index: wgID,
                creClass: cfg['class']
            };
            var lvIndex = tagF;
            if (this.mCurSwitch == wgID) {
                lvIndex = 0;
            }
            if (lvIndex != undefined) {
                if (lvIndex == "append") {
                    lvIndex = this.btn_ListView.getItems().length - 1;
                }
                this.btn_ListView.insertCustomItem(btn, lvIndex);
            } else {
                this.btn_ListView.pushBackCustomItem(btn);
            }
        }

        this.btn_ListView.updateSizeAndPosition();
        this.scheduleOnce(function () {
            if (tagF == "append") {
                if (this.btn_ListView.getInnerContainerSize().height >= this.btn_ListView.getContentSize().height) {
                    this.btn_ListView.getInnerContainer().y = 0;
                } else {
                    this.btn_ListView.getInnerContainer().y = this.btn_ListView.getContentSize().height - this.btn_ListView.getInnerContainerSize().height;
                }
                this.btn_ListView.updateSizeAndPosition();
            }
        }.bind(this), 0.1)


    },
    removeShowGame: function (appId) {
        for (var wgID in this._mShowGamesChildOpt) {
            var btn = this._mShowGamesChildOpt[wgID];
            if (wgID.indexOf(appId) >= 0) {
                btn.removeFromParent();
                this._mShowGamesChildOpt[wgID] = null;
            }
        }

        this.btn_ListView.updateSizeAndPosition();
        this.scheduleOnce(function () {
            if (this.btn_ListView.getInnerContainerSize().height >= this.btn_ListView.getContentSize().height) {
                this.btn_ListView.getInnerContainer().y = 0;
            } else {
                this.btn_ListView.getInnerContainer().y = this.btn_ListView.getContentSize().height - this.btn_ListView.getInnerContainerSize().height;
            }
            this.btn_ListView.updateSizeAndPosition();
        }.bind(this), 0.1)
    },
});

