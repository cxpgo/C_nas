var MJCard = cc.Layer.extend({
    image_card: null,
    image_cardBG: null,
    pai: null,
    _Listener: null,
    _Listener2: null,
    type: null,
    jinType: CARD_JIN.NO,
    image_jin: null,
    key: null,
    tip_ting: null,
    text_count: null,
    canTouch: true,
    issetback: false,
    isNeedBlue: false,
    img_arrow: null,
    ctor: function () {
        this._super();
        this.mGViewType = MJGVType.V3D;
        this.mCardPosition = cc.p(0,0);
    },

    /**
     *  data 数据
     *  gViewType  全局视图模式
     */
    init: function (data, gViewType) {
        if (gViewType) {
            this.mGViewType = gViewType;
        }
        if(!data){
            data = {type: 0 , value:0};
        }
        XYGLogic.Instance.addSpriteFrames(MJBaseRes.PL_MajCardTit);

        if (this.mGViewType == MJGVType.V3D) {
            if (data != undefined) {
                this.pai = new XYMJ.Pai(data);
                this.key = this.pai.key;
            }
            XYGLogic.Instance.addSpriteFrames(MJBaseResV3D.PL_Cards);

        } else if (this.mGViewType == MJGVType.V2D) {
            if (data != undefined) {
                this.pai = new XYMJ.Pai2D(data);
                this.key = this.pai.key;
            }
            XYGLogic.Instance.addSpriteFrames(MJBaseResV2D.PL_Cards);
        }
    },

    removeFromParent: function () {
        JJLog.print('card removeFromParent');
        this.pai = null;
        this.image_card = null;

        this._super();
    },

    reloadCardIndex: function (cardIndex) {

    },
    showYellow: function () {
        if (this.type == CARD_SITE.HAND_IN) return;
        var color = { r: 255, g: 255, b: 0 };
        if (this.image_card != null)
            this.image_card.setColor(color);
        if (this.image_cardBG != null)
            this.image_cardBG.setColor(color);
    },

    showBlue: function () {
        var color = { r: 176, g: 236, b: 243 };
        this.isNeedBlue = true;
        if (this.image_card != null)
            this.image_card.setColor(color);
        if (this.image_cardBG != null)
            this.image_cardBG.setColor(color);
    },

    showRed: function () {
        var color = { r: 214, g: 165, b: 165 };
        this.isNeedRed = true;
        if (this.image_card != null)
            this.image_card.setColor(color);
        if (this.image_cardBG != null)
            this.image_cardBG.setColor(color);
    },

    showArrow: function (index) {
        if (this.img_arrow != null) {
            this.img_arrow.setVisible(true);
            this.img_arrow.loadTexture('tileArrow_' + index + '.png', ccui.Widget.PLIST_TEXTURE);
        }
    },

    hideTingTip: function () {
        if (this.tip_ting != null)
            this.tip_ting.setVisible(false);
    },


    showNormal: function () {
        if (this.isNeedBlue) this.showBlue();
        if (this.type == CARD_SITE.HAND_IN || this.isNeedBlue) return;
        this.canTouch = true;
        var color = { r: 255, g: 255, b: 255 };
        if (this.image_card != null)
            this.image_card.setColor(color);
        if (this.image_cardBG != null)
            this.image_cardBG.setColor(color);
        if (this.tip_ting != null)
            this.tip_ting.setVisible(false);
    },

    showWhite: function () {
        this.canTouch = true;
        if (this.isNeedBlue) {
            this.showBlue();
            return;
        }
        var color = { r: 255, g: 255, b: 255 };
        if (this.image_card != null)
            this.image_card.setColor(color);
        if (this.image_cardBG != null)
            this.image_cardBG.setColor(color);
        if (this.tip_ting != null)
            this.tip_ting.setVisible(false);
    },

    showTingTip: function (hutype) {
        if (this.tip_ting != null) {
            this.tip_ting.setVisible(true);
            this.tip_ting.ignoreContentAdaptWithSize(true);
        }
    },

    showGray: function () {
        this.canTouch = false;
        var color = { r: 100, g: 100, b: 100 };
        if (this.image_card != null)
            this.image_card.setColor(color);
        if (this.image_cardBG != null)
            this.image_cardBG.setColor(color);
    },

    xuezhanShowGray: function () {
        var color = { r: 100, g: 100, b: 100 };
        if (this.image_card != null)
            this.image_card.setColor(color);
        if (this.image_cardBG != null)
            this.image_cardBG.setColor(color);
    },

    paiOfCard: function () {
        return this.pai;
    },
    //********quanzhou*********
    setJin: function () {
        this.jinType = CARD_JIN.YES;
        //显示金标志
        if (!!this.image_jin) {
            this.image_jin.setVisible(true)
        }
    },

    getCardJin: function () {
        return this.jinType;
    },
    //---------quanzhou-----------

    postTipEvt: function () {
        var event = new cc.EventCustom(CommonEvent.TipEvent);
        event.setUserData(this.pai.key);
        cc.eventManager.dispatchEvent(event);
    },

    postCancelEvt: function () {
        var event = new cc.EventCustom(CommonEvent.TipEvent);
        event.setUserData(CommonEventAction.TipCancel);
        cc.eventManager.dispatchEvent(event);
    },

    onEnter: function () {
        this._super();
        var _this = this;
        var ls = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.TipEvent,
            callback: function (event) {

                if (_this.pai != null) {
                    var eventStr = event.getUserData();
                    if (eventStr == CommonEventAction.TipCancel) {
                        _this.showNormal();
                        return;
                    }

                    var key = event.getUserData();
                    if (key == _this.pai.key) {
                        _this.showYellow();
                    } else {
                        _this.showNormal();
                    }
                }

            }
        });
        this._Listener = cc.eventManager.addListener(ls, this);

        var ls2 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.ChangeCardBg,
            callback: function (event) {
                // _this.changeCardBg();
            }
        });
        this._Listener2 = cc.eventManager.addListener(ls2, this);
    },
    changeCardBg: function () {

    },
    onExit: function () {
        this._super();
        this.pai = null;
        this.image_card = null;
    },
    //********quanzhou*********
    resetcontentSize: function (root, scale) {
        var panel_card = ccui.helper.seekWidgetByName(root, "panel_card");
        panel_card.setScale(scale);
        var size = cc.size(root.getContentSize().width * scale, root.getContentSize().height * scale);
        root.setPosition(cc.p(0, 0));
        this.setContentSize(size);
    },

    setCardPosition: function (newPosOrxValue, yValue) {
        var locPosition = this.mCardPosition;
        if (yValue === undefined) {
            if(locPosition.x === newPosOrxValue.x && locPosition.y === newPosOrxValue.y)
                return;
            locPosition.x = newPosOrxValue.x;
            locPosition.y = newPosOrxValue.y;
        } else {
            if(locPosition.x === newPosOrxValue && locPosition.y === yValue)
                return;
            locPosition.x = newPosOrxValue;
            locPosition.y = yValue;
        }
    },

    getCardPosition: function (){
        return this.mCardPosition;
    },
});

var MJOpenCard = MJCard.extend({
    image_indicator: null,
    text_cardCount: null,
    cardCount: 1,
    cardIndex: 0,
    ctor: function (data) {
        this._super(data);
    },

    initialize: function (root){
        this.panel_card = ccui.helper.seekWidgetByName(root, "panel_card");
        
        //牌上数字显示
        this.text_cardCount = ccui.helper.seekWidgetByName(root, "text_count");
        if(this.text_cardCount){
            this.text_cardCount.setVisible(false);
        }

        
    },
    removeFromParent: function () {
        this.image_indicator = null;
        this._super();
    },
    runIndicator: function () {
        if (this.image_indicator == null) return;

        this.postStopLastIndic();

        this.image_indicator.setVisible(true);
        var act1 = cc.moveBy(0.5, cc.p(0, 10));
        var act2 = act1.reverse();
        var act3 = cc.sequence(act1, act2);
        var act4 = act3.repeatForever();
        //this.image_indicator.runAction(cc.sequence(cc.delayTime(0.2),cc.fadeTo(0.2,200)));
        this.image_indicator.runAction(act4);
    },

    stopIndicator: function () {
        if (this.image_indicator == null) return;

        this.image_indicator.setVisible(false);
        this.image_indicator.stopAllActions();
    },

    postStopLastIndic: function () {
        var event = new cc.EventCustom(CommonEvent.Indicator);
        event.setUserData(CommonEventAction.Indicator_Stop);
        cc.eventManager.dispatchEvent(event);
    },

    addCardNum: function () {
        if (!this.text_cardCount) return;
        this.cardCount += 1;
        this.text_cardCount.setString('0' + this.cardCount);
        this.text_cardCount.setVisible(true);
    },

    getCardNum: function () {
        return this.cardCount;
    },
    
    setCardNum: function (num) {
        if (!this.text_cardCount || num == undefined) return;
        this.cardCount = num;
        if (this.cardCount > 1) {
            this.text_cardCount.setString('0' + this.cardCount + '张');
            this.text_cardCount.setVisible(true);
        }
    },

    onEnter: function () {
        this._super();
        var _this = this;
        var ls = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.Indicator,
            callback: function (event) {
                //JJLog.print(event.getUserData());
                if (event.getUserData == CommonEventAction.Indicator_Start) {
                    _this.runIndicator();
                } else if (event.getUserData() == CommonEventAction.Indicator_Stop) {
                    _this.stopIndicator();
                }

            }
        });
        this._Listener = cc.eventManager.addListener(ls, this);
    },

    onExit: function () {
        this.image_indicator = null;
        this._super();
    },

    SetBack: function () {

    },
});

