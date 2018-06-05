var TDKSelfOptCtrl = cc.Layer.extend({

    ctor: function () {
        this._super();
        var root = util.LoadUI(TDKJson.SelfOptCtl).node;
        this.addChild(root);

        this.mRoot = root;

        this.mOptBtnTypes = {};
        this.mBuildCustomData = null; //{opType : value}
        this.mCOpType = -1;
        this.mSOpType = -1;

        this._initView();
        this._initOptTypes();

    },

    _initView: function () {
        var root = this.mRoot;
        this.mPanelOpt = ccui.helper.seekWidgetByName(root, "panel_opt");

        this.panel_touchpour = ccui.helper.seekWidgetByName(root, "panel_touchpour");
        this.panel_clickpour = ccui.helper.seekWidgetByName(root, "panel_clickpour");


        this.Slider_1 = ccui.helper.seekWidgetByName(this.panel_touchpour, "Slider_1");
        this.Slider_1.addEventListener(this.sliderEvent, this);

        this.text_score = ccui.helper.seekWidgetByName(this.panel_touchpour, "text_score");


        this.btn_Touchsure = ccui.helper.seekWidgetByName(this.panel_touchpour, "btn_sure");
        this.btn_Touchsure.addClickEventListener(this.onTouchsureEvent.bind(this));


        this.input_pour = ccui.helper.seekWidgetByName(this.panel_clickpour, "input_pour");

        this.panel_touchpour.setVisible(false);
        this.panel_clickpour.setVisible(false);


        this.btn_del = ccui.helper.seekWidgetByName(this.panel_clickpour, "btn_del");
        this.btn_del.addClickEventListener(this.onBtnDelEvent.bind(this));

        this.btn_cancel = ccui.helper.seekWidgetByName(this.panel_clickpour, "btn_cancel");
        this.btn_cancel.addClickEventListener(this.onClosePourView.bind(this));

        this.btn_Clicksure = ccui.helper.seekWidgetByName(this.panel_clickpour, "btn_sure");
        this.btn_Clicksure.addClickEventListener(this.onBtnSureEvent.bind(this));

        this.panel_pourView = ccui.helper.seekWidgetByName(root, "panel_pourView");
        this.panel_pourView.setVisible(false);
        
        this.panel_pourView.addClickEventListener(this.onClosePourView.bind(this));
        for (var i = 0; i < 4; i++) {
            var btn_pour = ccui.helper.seekWidgetByName(this.panel_clickpour, "btn_pour" + i);
            btn_pour.setTag(i);
            btn_pour.addClickEventListener(this.onBtnPourEvent.bind(this));
        }
    },
    _initOptTypes: function () {
        var root = this.mPanelOpt;

        this.btn_genzhu = ccui.helper.seekWidgetByName(root, "btn_genzhu");
        this.btn_fanti = ccui.helper.seekWidgetByName(root, "btn_fanti");
        this.btn_buti = ccui.helper.seekWidgetByName(root, "btn_buti");
        this.btn_koupai = ccui.helper.seekWidgetByName(root, "btn_koupai");
        this.btn_kaipai = ccui.helper.seekWidgetByName(root, "btn_kaipai");
        this.btn_qijiao = ccui.helper.seekWidgetByName(root, "btn_qijiao");
        this.btn_tisi = ccui.helper.seekWidgetByName(root, "btn_tishi");
        this.btn_zhunbei = ccui.helper.seekWidgetByName(root, "btn_zhunbei");
        this.btn_xiazhu = ccui.helper.seekWidgetByName(root, "btn_xiazhu");


        this.resetOptBtnsVisible();


        this.mOptBtnTypes[TDK_COP_TYPE.ZB] = this.btn_zhunbei;
        this.mOptBtnTypes[TDK_COP_TYPE.GZ] = this.btn_genzhu;
        this.mOptBtnTypes[TDK_COP_TYPE.PASS] = this.btn_buti;
        this.mOptBtnTypes[TDK_COP_TYPE.CALL] = this.btn_xiazhu;
        this.mOptBtnTypes[TDK_COP_TYPE.TI] = this.btn_qijiao;
        this.mOptBtnTypes[TDK_COP_TYPE.FT] = this.btn_fanti;
        this.mOptBtnTypes[TDK_COP_TYPE.OVER] = this.btn_koupai;
        this.mOptBtnTypes[TDK_COP_TYPE.SHOW] = this.btn_kaipai;


        this.btn_zhunbei.addClickEventListener(this.onBtnReady.bind(this));
        this.btn_genzhu.addClickEventListener(this.onBtnCallEvent.bind(this, TDK_COP_TYPE.GZ));
        this.btn_buti.addClickEventListener(this.onBtnBuTiEvent.bind(this, TDK_COP_TYPE.PASS));
        this.btn_xiazhu.addClickEventListener(this.onXiazhuEvent.bind(this, TDK_COP_TYPE.CALL, TIANDAKENGTYPE.CALL));
        this.btn_fanti.addClickEventListener(this.onXiazhuEvent.bind(this, TDK_COP_TYPE.FT, TIANDAKENGTYPE.TI));
        this.btn_qijiao.addClickEventListener(this.onXiazhuEvent.bind(this, TDK_COP_TYPE.TI, TIANDAKENGTYPE.TI));
        this.btn_koupai.addClickEventListener(this.onBtnKouPaiEvent.bind(this, TDK_COP_TYPE.OVER));
        this.btn_kaipai.addClickEventListener(this.onBtnKaiPai.bind(this, TDK_COP_TYPE.SHOW));
    },
    resetOptBtnsVisible: function () {
        this.btn_genzhu.setVisible(false);
        this.btn_fanti.setVisible(false);
        this.btn_buti.setVisible(false);
        this.btn_koupai.setVisible(false);
        this.btn_kaipai.setVisible(false);
        this.btn_qijiao.setVisible(false);
        this.btn_tisi.setVisible(false);
        this.btn_zhunbei.setVisible(false);
        this.btn_xiazhu.setVisible(false);
    },

    onEnter: function () {
        this._super();


    },
    onExit: function () {
        this._super();
    },

    setVisible: function (flag) {
        this._super(flag);
        this.mBuildCustomData = null;
        if (flag == false) {
            this.resetOptBtnsVisible();
            this.panel_touchpour.setVisible(false);
            this.panel_clickpour.setVisible(false);
            this.input_pour.setString(0);
        } else {
            this.changeSliderPour(100);
            this.input_pour.setString(5);
        }

    },

    BuildShow: function (optTypes, customData, isAni) {

        isAni = isAni != false ? true : false;

        if (this.isVisible()) {
            isAni = false;
        }
        this.setVisible(true);
        this.mBuildCustomData = customData;
        if (optTypes.length == 1 && optTypes[0] == TDK_COP_TYPE.CALL) { //必须下注的情况下  直接下注出去
            var optBtn = this.mOptBtnTypes[TDK_COP_TYPE.CALL];
            if (optBtn) {
                var optBtnC = optBtn.clone();
                optBtn.parent.addChild(optBtnC);
                optBtnC.addClickEventListener(function (target) {
                    this.mBuildCustomData = {};
                    this.mBuildCustomData[TIANDAKENGTYPE.CALL] = 5;
                    target.removeFromParent();
                    this.onBtnCallEvent(TDK_COP_TYPE.GZ);
                }.bind(this , optBtnC));
                optBtnC.setVisible(true);
            }
        } else {
            for (var index = 0; index < optTypes.length; index++) {
                var optType = optTypes[index];
                var optBtn = this.mOptBtnTypes[optType];
                if (optBtn) {
                    optBtn.setVisible(true);
                }
            }
        }
        if (isAni) {
            this.y -= 100;
            this.runAction(cc.moveBy(0.2, 0, 100));
        }
    },

    onClosePourView: function () {
        this.panel_pourView.setVisible(false);
        this.panel_clickpour.setVisible(false);
        this.panel_touchpour.setVisible(false);
    },

    onXiazhuEvent: function (cOpType, xzType) {
        this.mCOpType = cOpType;
        this.mSOpType = xzType;

        this.panel_pourView.setVisible(true);
        var isTouchPour = util.getCacheItem("TDK_XZ_TYPE") == TDK_XZ_TYPE.TOUCH_T;
        if (isTouchPour) {
            this.panel_touchpour.setVisible(true);
        }
        else {
            this.panel_clickpour.setVisible(true);
        }

    },

    sliderEvent: function (sender, type) {
        switch (type) {
            case ccui.Slider.EVENT_PERCENT_CHANGED: {
                this.changeSliderPour(sender.getPercent());
            }
                break;
            default:
                break;
        }
    },

    changeSliderPour: function (percent) {
        percent = Math.ceil(percent);
        if (percent <= 10) {
            percent = 10;
        } else if (percent >= 90) {
            percent = 90;
        }
        var volume = Math.ceil(percent / 20);
        this.Slider_1.setPercent(percent);
        this.text_score.setString(volume);
    },

    onBtnDelEvent: function (sender) {
        this.input_pour.setString('');
    },

    onBtnPourEvent: function (sender) {
        var pour_Idx = sender.getTag();
        var key = 'POUR_C' + pour_Idx;
        var pourV = TDK_POUR_C[key];
        this.input_pour.string = pourV;
    },

    onBtnReady: function () {
        this.btn_zhunbei.setTouchEnabled(false);
        XYGLogic.Instance.ready(
            function () {
                this.btn_zhunbei.setTouchEnabled(true);
            }.bind(this)
        );
    },

    onTouchsureEvent: function () {
        var pour_score = this.text_score.getString();
        if (pour_score == 0) {
            return;
        }
        this.btn_Touchsure.setTouchEnabled(false);
        XYGLogic.Instance.updatePlayerOp(
            this.mSOpType,
            pour_score,
            this.mCOpType,
            function () {
                this.btn_Touchsure.setTouchEnabled(true);
            }.bind(this)
        );
    },
    onBtnSureEvent: function () {
        var pour_score = this.input_pour.getString();

        if (pour_score == 0) {
            return;
        }
        this.btn_Clicksure.setTouchEnabled(false);
        XYGLogic.Instance.updatePlayerOp(
            this.mSOpType,
            pour_score,
            this.mCOpType,
            function () {
                this.btn_Clicksure.setTouchEnabled(true);
            }.bind(this)
        );

    },

    onBtnCallEvent: function (cOpType) {
        var callAmount = this.mBuildCustomData ? this.mBuildCustomData[TIANDAKENGTYPE.CALL] : 0;
        this.btn_genzhu.setTouchEnabled(false);
        XYGLogic.Instance.updatePlayerOp(
            TIANDAKENGTYPE.CALL,
            callAmount,
            cOpType,
            function () {
                this.btn_genzhu.setTouchEnabled(true);
            }.bind(this)
        );
    },


    onBtnBuTiEvent: function (cOpType) {
        this.btn_buti.setTouchEnabled(false);
        XYGLogic.Instance.updatePlayerOp(
            TIANDAKENGTYPE.PASS,
            0,
            cOpType,
            function () {
                this.btn_buti.setTouchEnabled(true);
            }.bind(this)
        );
    },

    onBtnKouPaiEvent: function (cOpType) {
        this.btn_koupai.setTouchEnabled(false);
        XYGLogic.Instance.updatePlayerOp(
            TIANDAKENGTYPE.OVER,
            0,
            cOpType,
            function () {
                this.btn_koupai.setTouchEnabled(true);
            }.bind(this)
        );
    },

    onBtnKaiPai: function (cOpType) {
        this.btn_kaipai.setTouchEnabled(false);
        XYGLogic.Instance.updatePlayerOp(
            TIANDAKENGTYPE.SHOW,
            0,
            cOpType,
            function () {
                this.btn_kaipai.setTouchEnabled(true);
            }.bind(this)
        );
    },

});