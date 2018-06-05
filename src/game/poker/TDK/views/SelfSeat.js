var TDKSelfSeat = TDKDeskSeat.extend({
    ctor: function(data, optTipsNode) {
        this._super(data, optTipsNode);
        this.root = util.LoadUI(TDKJson.SelfPanel).node;
        this.addChild(this.root);

        this.mSelfOptCtl = new TDKSelfOptCtrl();
        this.mSelfOptCtl.x = 800;
        this.mSelfOptCtl.y = 0;
        this.addChild(this.mSelfOptCtl);

        this.mSelfOptCtl.setVisible(false);
        this.gap_cardStand = 55;


        this.initUI();
    },

    onEnter: function() {
        this._super();
        this.parent.setLocalZOrder(1000);
    },

    registerAllEvents: function() {
        this._super();

    },

    removeAllEvents: function() {
        this._super();
    },

    initUI: function() {
        this._super();

        this.mPanelCardIn.setTouchEnabled(true);
        this.mPanelCardIn.addTouchEventListener(this.touchHandDPaiQi.bind(this));

        // this.mPanelCardIn.setScale(1);
        // this.mPanelPaiMo.x += 20;
    },

    BuildShowOpt: function(optTypes, customData) {
        this.mSelfOptCtl.BuildShow(optTypes, customData);
    },

    checkReadyStatus: function() {
        this._super();
        var playerData = this.m_Data;
        if (!playerData.isReady) {
            this.mSelfOptCtl.BuildShow([TDK_COP_TYPE.ZB], null, false);
        }
    },

    setReadyStatus: function(isReady) {
        this._super(isReady);
        this.mSelfOptCtl.setVisible(false);

    },

    synPlayerOp: function(data) {
        this._super(data);
        if (data.uid !== this.uid) return;

        this.mSelfOptCtl.setVisible(false);

    },

    showDPaiQi: function(paiQis) {
        this._super(paiQis);
        this.mPanelCardIn.setTouchEnabled(false);
    },
    //操作显示底牌
    touchHandDPaiQi: function(sender, type) {

        var paiLen = this.mDPaiQiCards.length;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                for (var index = 0; index < this.mDPaiQiCards.length; index++) {
                    var card = this.mDPaiQiCards[index];
                    card.setCardState(true);
                    card.runAction(cc.sequence(
                        cc.moveBy(0.25, -((index + 1) * 10 + (paiLen - 1 - index) * 5), 0),
                        cc.callFunc(function() {

                        })
                    ));
                }

                var socre = TianDaKeng.Instance.CalScore([].concat(this.mMoCards, this.mDPaiQiCards));
                this.text_pour_score1.string = socre;

                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
            case ccui.Widget.TOUCH_CANCELED:
                for (var index = 0; index < this.mDPaiQiCards.length; index++) {
                    var card = this.mDPaiQiCards[index];
                    card.setCardState(false);
                    card.runAction(cc.sequence(
                        cc.moveBy(0.25, ((index + 1) * 10 + (paiLen - 1 - index) * 5), 0),
                        cc.callFunc(function() {

                        })
                    ));
                }
                var socre = TianDaKeng.Instance.CalScore(this.mMoCards);
                this.text_pour_score1.string = socre;
                break;
            default:
                break;
        }
    },
    setHandCardType: function(isOp) {
        this._super(isOp);
        this.mPanelCardIn.setTouchEnabled(isOp);
    },

    reset: function() {
        this._super();
        this.mPanelCardIn.setTouchEnabled(true);
    }
});