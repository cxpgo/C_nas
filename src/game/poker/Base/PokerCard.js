
var CardBase = ccui.Layout.extend({
    image_cardBG: null,
    pai: null,
    image_cardBGback: null,
    ctor: function (data) {
        this._super();
        if (data != undefined) {
            this.pai = new Poker.PokerPai(data);
        }

        this.ignoreContentAdaptWithSize(false);
        this.setAnchorPoint(cc.p(0.5,0.5));

        Object.defineProperties(this, {
            "key": {
                get: function () {
                    if(this.pai) return this.pai.key;
                    return 0;
                }
            },
            "type": {
                get: function () {
                    if(this.pai) return this.pai.type;
                    return 0;
                }
            },
            "value": {
                get: function () {
                    if(this.pai) return this.pai.value;
                    return 0;
                }
            },
        });
    },
    removeFromParent: function () {
        JJLog.print('card removeFromParent');
        this.pai = null;
        this._super();
    },

    setCardData: function (data) {
        if (data != undefined) {
            this.pai = new Poker.PokerPai(data);
        }
    },

    paiOfCard: function () {
        return this.pai;
    },

    onEnter: function () {
        this._super();
        
    },

    showWhite: function () {
        var color = {r: 255, g: 255, b: 255};
        if (this.panel_card != null)
            this.panel_card.setColor(color);
    },

    showGray: function () {
        var color = {r: 100, g: 100, b: 100};
        if (this.panel_card != null)
            this.panel_card.setColor(color);
    },

});

var MPokerCard = CardBase.extend({
    panel_card: null,
    pos: null,
    mData: null,
    _rect: null,
    size: null,
    originZorder: -1,
    ctor: function (data) {
        this._super(data);
        var root = util.LoadUI(PokerJson.PokerCard).node;
        this.addChild(root);
        this.mData = data;
        this.mCardState = true;


        this.panel_card = ccui.helper.seekWidgetByName(root, "panel_card");

        this.size = cc.size(root.getContentSize().width, root.getContentSize().height);
        root.setPosition(cc.p(0, 0));

        this.panel_card.setContentSize(this.size);
        this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
       
        this.setContentSize(this.size);
        this._rect = cc.rect(0, 0, this.size.width, this.size.height);
        this.pos = this.panel_card.getPosition();

        this.image_cardBGback = ccui.helper.seekWidgetByName(root, "image_cardBG_back");
        this.image_cardBGback.setVisible(false);

        this.img_card_tag = ccui.helper.seekWidgetByName(root, "img_card_tag");
        this.img_card_tag.setVisible(false);
        this.imgRTTag = ccui.helper.seekWidgetByName(root, "img_r_t_tag");
        this.imgRTTag.setVisible(false);
        this.mRTType = undefined;

        this.setCardData(data);

    },

    setBackData:function (uid) {
        var info = hall.getPlayingGame().table.uidOfInfo(uid);
        if(info)
        {
            util.ChangeloadCard(this.image_cardBGback,info['equip']);
        }
    },

    _resetBack:function () {
        var cahceV = parseInt(util.getCacheItem(PokerBackGCCacheKey) || 1 );
        this.image_cardBGback.loadTexture(Setting_BackCfg[cahceV-1]);
    },

    setCardData: function (data) {
        this._super(data);
        this.image_cardBG.loadTexture(this.pai.imageOfPai(), ccui.Widget.PLIST_TEXTURE);
    },

    setOriginZorder: function (order) {
        if (this.originZorder == -1) {
            this.originZorder = order;
            this.setLocalZOrder(order);
        }
    },

    getOriginZorder: function () {
        return this.originZorder;
    },
    
    setCardState: function (state , isAni) {
        this.mCardState = state;
        if(state){
            this.SetUpside(isAni);
        }else{
            this.SetBackside();
        }
    },

    getCardState: function () {
       return this.mCardState;
    },

    SetBackside: function () {
        if (this.image_cardBGback) {
            this.image_cardBGback.setVisible(true);
        }
    },
    SetUpside: function (isAni) {
        if(isAni){
            this.stopAllActions();
            var actions = [];
            var dtFlip = 0.07;
            actions.push(
                cc.scaleTo(dtFlip, 0 , 1)
            );
            actions.push(
                cc.scaleTo(dtFlip, 1 , 1)
            );

            actions.push(
                cc.callFunc(function () {
                    if (this.image_cardBGback) {
                        this.image_cardBGback.setVisible(false);
                    }
                }.bind(this))
            );

            this.runAction(cc.sequence(actions));

        }else{
            if (this.image_cardBGback) {
                this.image_cardBGback.setVisible(false);
            }
        }
        
    },

    removeFromParent: function () {
        this.panel_card = null;
        this._super();
    },

    isSelected: function () {
        return this.selected;
    },

    containsTouchLocation: function (touch) {
        var getPoint = touch.getLocation();
        var pos = this.convertToNodeSpace(getPoint);

        var myRect = this.rect();

        var result = cc.rectContainsPoint(myRect, pos);
        return result;
    },

    rect: function () {
        return cc.rect(0, 0, this.size.width, this.size.height);

    },

    containsTouchBeginRect: function (endPos) {
        var f = 30;

        var recttmp = cc.rect(this.touchBeginPos.x - f, this.touchBeginPos.y - f, f, f);
        var result = cc.rectContainsPoint(recttmp, endPos);
        return result;
    },


    loadTextureRTTag: function ( textureP , lType ) {
        this.imgRTTag.loadTexture(textureP , lType);
        this.imgRTTag.setVisible(true);
        this.img_card_tag.setVisible(true);
        return this.imgRTTag;
    },
    //
    setRTType: function (_type) {
        this.mRTType = _type;
    },
    getRTType: function () {
        return this.mRTType;
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'appGameBack', this._resetBack.bind(this));
    },

    onExit: function () {
        this.panel_card = null;
        this.image_card = null;
        this._super();
        qp.event.stop(this, 'appGameBack');
    },

});

