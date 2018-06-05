/**
 * Created by atom on 2016/7/24.
 */

var DDZPokerCardBase = cc.Layer.extend({
	image_cardBG: null,
	image_insert: null,
	pai: null,
	type: null,
	cardtype: null,
	value: null,
	key: null,
	text_count: null,
	root: null,
	ctor: function (data) {
		this._super();
		this.setData(data);
	},

	setData: function (data) {
		if (data != undefined) {
			this.pai = new DDZPokerPai(data);
			this.key = this.pai.key;
			this.value = this.pai.value;
			this.type = this.pai.type;
		}
	},

	removeFromParent: function () {
		JJLog.print('card removeFromParent');
		this.pai = null;
		this._super();
	},
	showYellow: function () {
		if (this.cardtype == CARD_SITE.HAND_IN) return;
		var color = { r: 255, g: 255, b: 0 };
		if (this.image_cardBG != null)
			this.image_cardBG.setColor(color);

	},

	showNormal: function () {
		if (this.cardtype == CARD_SITE.HAND_IN) return;
		var color = { r: 255, g: 255, b: 255 };
		if (this.image_cardBG != null)
			this.image_cardBG.setColor(color);
	},

	showWhite: function () {
		var color = { r: 255, g: 255, b: 255 };
		if (this.image_cardBG != null)
			this.image_cardBG.setColor(color);
	},

	showGray: function () {
		var color = { r: 100, g: 100, b: 100 };
		if (this.image_cardBG != null)
			this.image_cardBG.setColor(color);
	},
    showBlue: function () {
        var color = { r: 120, g: 150, b: 120 };
        if (this.image_cardBG != null)
            this.image_cardBG.setColor(color);
    },

	paiOfCard: function () {
		return this.pai;
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
	},

	onExit: function () {
		this._super();
		this.pai = null;
	}

});

var DDZPokerCard = DDZPokerCardBase.extend({
	panel_card: null,
	selected: false,
	pos: null,
	valueNum: 0,
	playerPanel: null,
	mData: null,
	_rect: null,
	size: null,
	_touchListener: null,
	_mZOrder: null,
	_yLine: null,
	_localPos: null,
	touchBeginPos: null,
	canTouch: true,
	text_all: null,
	ctor: function (jPlayerPanel, data, disTouch) {
		this._super(data);
		var root = util.LoadUI(DDZPokerJson.Card).node;
		this.root = root;
		this.addChild(root);
		this.mData = data;

		if (disTouch == false)
			this.canTouch = false;

		this.panel_card = ccui.helper.seekWidgetByName(root, "panel_card");
		var scale = 1;

		this.size = cc.size(root.getContentSize().width * scale, root.getContentSize().height * scale);
		root.setPosition(cc.p(0, 0));
		this.playerPanel = jPlayerPanel;

		this.panel_card.setContentSize(this.size);
		this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
        this.image_cardBGback = ccui.helper.seekWidgetByName(root, "image_cardBG_back");
        this.image_cardBGback.setVisible(false);
		this._rect = cc.rect(0, 0, this.size.width, this.size.height);
		this._yLine = this.size.height;
		this.pos = this.panel_card.getPosition();
		this.cardtype = CARD_SITE.HAND_IN;

		this.image_insert = ccui.helper.seekWidgetByName(root, "image_insert");
		this.image_insert.setVisible(false);

		this.img_lord_show = ccui.helper.seekWidgetByName(root , "img_lord_show");
		this.img_lord_show.setVisible(false);

        this.img_feipai = ccui.helper.seekWidgetByName(root , "img_feipai");
        this.img_feipai.setVisible(false);
        this.img_xianshou = ccui.helper.seekWidgetByName(root , "img_xianshou");
        this.img_xianshou.setVisible(false);

		this.setCardData(data);
		//this._resetBack();
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
		this.setData(data);
        if (this.value == XYGLogic.Instance.changeValue.value) {
        	if (data.level && data.levelChanged && data.level != data.levelChanged && data.levelChanged != DDZGlobal.CARD_LEVEL_CHANGECARD) {
                this.image_cardBG.loadTexture("DDZLZ_" + DDZCard_Rule.levelToValue(data.levelChanged) + ".png", ccui.Widget.PLIST_TEXTURE);
			} else {
                this.image_cardBG.loadTexture("DDZLZ_" + this.value + ".png", ccui.Widget.PLIST_TEXTURE);
			}
        } else {
            if(this.key == '00')
			{
				this.setCardState(false);
			}
            else
			{
                this.setCardState(true);
			}
        }
		this.setContentSize(this.size);
	},

    SetBackside: function () {
        if (this.image_cardBGback) {
            this.image_cardBGback.setVisible(true);
        }
    },
    SetUpside: function () {
        if (this.image_cardBGback) {
            this.image_cardBGback.setVisible(false);
            this.image_cardBG.loadTexture(this.pai.imageOfPai(), ccui.Widget.PLIST_TEXTURE);
        }
    },

    setCardState: function (state) {
        if(state){
            this.SetUpside();
        }else{
            this.SetBackside();
        }
    },

	removeFromParent: function () {
		this.panel_card = null;
		this._super();
	},
	refreshCard: function (bRes) {
        if (this.value == XYGLogic.Instance.changeValue.value || bRes) {
            this.image_cardBG.loadTexture("DDZLZ_" + this.value + ".png", ccui.Widget.PLIST_TEXTURE);
        }
    },

	showLordTip: function (enable) {
		if (this.img_lord_show && this.playerPanel.uid == XYGLogic.Instance.whoIsBanker()) {
            this.img_lord_show.setVisible(enable);
		}
    },

    showFirstTip: function (enable) {
        if (this.img_xianshou ) {
            this.img_xianshou.setVisible(enable);
        }
    },

    showFeiPaisTip: function (enable) {
        if (this.img_feipai ) {
            this.img_feipai.setVisible(enable);
        }
    },

	showInsert: function () {
		if (this.image_insert != null)
			this.image_insert.setVisible(true);
	},

	posOfPanel: function () {
		var pos = this.getPosition();
		var size = this.getContentSize();
		return cc.p(pos.x + size.width * 0.85, pos.y + size.height * 0.5 - CommonParam.ShowUpCardHeight);
	},

	isSelected: function () {
		return this.selected;
	},

	playSelectedAnimation: function () {
		if (this.selected == true)
			return;
        this.panel_card.stopAllActions();
		var moveUp = cc.moveTo(CommonParam.MoveUpTime, cc.p(this.pos.x,
			this.pos.y + CommonParam.ShowUpCardHeight));
		this.panel_card.runAction(moveUp);
		this.selected = true;
		this.playerPanel.addPai(this);
	},

	playResetAnimation: function () {
		if (this.selected == false)
			return;
		this.panel_card.stopAllActions();
		var moveUp = cc.moveTo(CommonParam.MoveDownTime, this.pos);
		this.panel_card.runAction(moveUp);
		this.selected = false;
		this.playerPanel.delPai(this);
	},

    SelectedAnimation:function () {
        if (this.selected == true)
            return;
        var moveUp = cc.moveTo(CommonParam.MoveUpTime, cc.p(this.pos.x,
            this.pos.y + CommonParam.ShowUpCardHeight));
        this.panel_card.runAction(moveUp);
        this.selected = true;
    },
    ResetAnimation:function () {
        if (this.selected == false)
            return;
        var moveUp = cc.moveTo(CommonParam.MoveDownTime, this.pos);
        this.panel_card.runAction(moveUp);
        this.selected = false;
    },

	playInsertAnimation: function () {
		this.panel_card.setVisible(false);
		this.panel_card.setPosition(this.pos.x, this.pos.y + CommonParam.ShowUpCardHeight - 10);
		var moveUp = cc.moveTo(CommonParam.MoveDownTime, this.pos);
		this.panel_card.runAction(cc.sequence(cc.delayTime(0.2), cc.show(), moveUp));
	},

	playEnterInAnimation: function () {
		this.panel_card.setVisible(false);
		this.panel_card.setOpacity(50);
		this.panel_card.setCascadeOpacityEnabled(true);
		this.panel_card.setPosition(this.pos.x, this.pos.y);
		//var moveUp = cc.moveTo(CommonParam.MoveDownTime, this.pos);
		var fadein = cc.fadeIn(CommonParam.MoveDownTime);
		this.panel_card.runAction(cc.sequence(cc.delayTime(0.2), cc.show(), fadein));

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

    setPokerTouchEnable:function (canTouch) {
        this.canTouch = canTouch;
    },

	onTouchBegan: function (touch, event) {
		var target = event.getCurrentTarget();
		if (!target.containsTouchLocation(touch) || !target.canTouch) return false;

		var touchPoint = touch.getLocation();
		var pos = target.getParent().convertToNodeSpace(touchPoint);
		target.touchBeginPos = pos;
		target.playerPanel.slipping(pos, pos);
		return true;
	},

	onTouchMoved: function (touch, event) {
		var target = event.getCurrentTarget();
		var touchPoint = touch.getLocation();
		var pos = target.getParent().convertToNodeSpace(touchPoint);
		target.playerPanel.slipping(target.touchBeginPos, pos);
	},

	onTouchEnded: function (touch, event) {
		var target = event.getCurrentTarget();
		var touchPoint = touch.getLocation();
		var pos = target.getParent().convertToNodeSpace(touchPoint);
		target.playerPanel.slippingEnd(pos);
	},

	containsTouchBeginRect: function (endPos) {
		var f = 30;

		var recttmp = cc.rect(this.touchBeginPos.x - f, this.touchBeginPos.y - f, f, f);
		var result = cc.rectContainsPoint(recttmp, endPos);
		return result;
	},

	resetCard: function () {
		if (this.panel_card != null)
			this.panel_card.setPosition(this.pos);
		this.selected = false;
	},

	removeTouchListener: function () {
		if (this._touchListener) {
			cc.eventManager.removeListener(this._touchListener);
			this._touchListener = null;
		}
		this.canTouch = false;
	},

	showLord: function () {
		this.img_lord_show.setVisible(true);
	},

	onEnter: function () {
		this._super();
		if (this.canTouch) {
			this._touchListener = cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: this.onTouchBegan,
				onTouchMoved: this.onTouchMoved,
				onTouchEnded: this.onTouchEnded
			}, this);
		}
		this._mZOrder = this.getLocalZOrder();
        qp.event.listen(this, 'appGameBack', this._resetBack.bind(this));
	},

	onExit: function () {
		this.removeTouchListener();
		this.panel_card = null;
		this._super();
        qp.event.stop(this, 'appGameBack');
	},

});
