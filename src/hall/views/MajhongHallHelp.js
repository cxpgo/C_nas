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

var HallHelpView = BaseGameHelpView.extend( {
    mOptGameOpts : {},
    uiOpt:{},
    btn_Array:null,
    ctor: function (data, optTipsNode) {
        this._super(data, optTipsNode);
        this.root = util.LoadUI(GameHallJson.Help , "res/").node;
        this.addChild(this.root);
        this.initUI();
    },

    initUI: function () {
        this._super();
        this.mCurSwitch = 0;
        
        var Cfgs = PackageMgr.getGameHelpCfg();
        this.CreCfgs_btn = [];
        this.btnGameAy = new Array();
        this.panelCreItemAy = new Array();
        this.panelGameObj = {};
        this.mOptGameOpts = {};

        var btn_back = ccui.helper.seekWidgetByName(this.root,"btn_back");
        btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this)
        );

        this.btn_ListView = ccui.helper.seekWidgetByName(this.root,"btn_ListView");
        this.panel_game = ccui.helper.seekWidgetByName(this.root,"panel_game");
        this.ScrollView_1 = ccui.helper.seekWidgetByName(this.root,"ScrollView_1");
        this.btn_Array = new Array();
        this.btn_game = ccui.helper.seekWidgetByName(this.root,"btn_game");

        for(var i=0;i<Cfgs.length;i++)
        {
            var btn = this.btn_game.clone();
            this.CreCfgs_btn.push(Cfgs[i]['class']);
            btn.loadTextureNormal(Cfgs[i]['url'][0],ccui.Widget.LOCAL_TEXTURE);
            btn.loadTexturePressed(Cfgs[i]['url'][1],ccui.Widget.LOCAL_TEXTURE);
            btn.loadTextureDisabled(Cfgs[i]['url'][2],ccui.Widget.LOCAL_TEXTURE);
            this.btn_Array.push(btn);
            this.btn_ListView.pushBackCustomItem(btn);
        }

        this.createSwitchGameBtn();
        this.showGameOptLayer();
    },

    createSwitchGameBtn : function () {
        var initPosY = 540.78;
        var offPoxY = 10;
        for (var index = 0; index < this.CreCfgs_btn.length; index++) {
            var btn = this.btn_Array[index];
            btn.setVisible(true);
            // btn.y = initPosY - index * (88 + offPoxY);
            // this._btnGameClone.parent.addChild(btn);
            btn.__bindData__ = {
                index : index,
            };

            this.btnGameAy.push(btn);
            btn.addClickEventListener(this.onSwitchGame.bind(this));
        }

    },

    onSwitchGame: function (target) {
        var switchIndex = target.__bindData__.index;
        if(switchIndex == this.mCurSwitch) return;

        this.mCurSwitch = switchIndex;
        this.showGameOptLayer();

    },

    showGameOptLayer: function () {
        var switchIndex = this.mCurSwitch;
        for (var key in this.mOptGameOpts) {
            var cl = this.mOptGameOpts[key];
            cl.hide();
        }
        // this.ScrollView_1.jumpToTop();
        var showCL = this.mOptGameOpts[switchIndex];
        if(showCL){
            showCL.show();
        }
        else
        {
            var cfg = this.CreCfgs_btn[switchIndex];
            var showLayer = new (cfg)();
            var layout = new ccui.Layout();
            layout.setContentSize(showLayer.getContentSize());
            showLayer.setAnchorPoint(0, 0);
            showLayer.x = 0;
            showLayer.y = 0;
            showLayer.setVisible(true);
            layout.addChild(showLayer);
            layout.x = 0;
            // layout.y = this.ScrollView_1.getInnerContainerSize().height - showLayer.getContentSize().height;
            // layout.retain();
            this.panelCreItemAy.push(showLayer);
            this.panelGameObj[switchIndex] = layout;
            this.ScrollView_1.setContentSize(showLayer.getContentSize());
            this.ScrollView_1.addChild(layout);
            // layout.release();
            this.mOptGameOpts[switchIndex] = new _SwitchOptStruct_(this.btnGameAy[switchIndex] , showLayer);
            this.mOptGameOpts[switchIndex].show();
        }
    },

    showHelp: function () {
        if(this.panel_root)
        {
            this.panel_root.setScale(0.3)
            this.panel_root.runAction(cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1, 1)))
        }
        cc.director.getRunningScene().addChild(this);
    },
});