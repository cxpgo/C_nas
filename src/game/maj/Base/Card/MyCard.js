var MJMyCard = function () {

    var Card = MJCard.extend({
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

        end_pos: null,
        initialize: function (root, jPlayerPanel, data, disTouch) {

            this.addChild(root);
            //this.mType = data["type"] + data["value"];
            this.mData = data;

            this.valueNum = XYMJ.PaiFace[this.key];
            this.panel_card = ccui.helper.seekWidgetByName(root, "panel_card");
            this.tip_ting = ccui.helper.seekWidgetByName(root, "image_tip");
            this.text_count = ccui.helper.seekWidgetByName(root, "text_count");
            this.text_all = ccui.helper.seekWidgetByName(root, "text_all");
            var scale = 1;
            if (MajhongInfo.MajhongNumber > 14) {
                scale = CommonParam.My17CardStandScale;
            }

            this.size = cc.size(root.getContentSize().width * scale, root.getContentSize().height * scale);
            root.setPosition(cc.p(0, 0));
            this.playerPanel = jPlayerPanel;

            this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
            this.image_card.loadTexture(this.pai.frameImgStandOfPai(), ccui.Widget.PLIST_TEXTURE);
            this.image_card.ignoreContentAdaptWithSize(true);
            this.panel_card.setContentSize(this.size);
            this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
            this.panel_card.setScale(scale);
            this.setContentSize(this.size);
            this._rect = cc.rect(0, 0, this.size.width, this.size.height);
            this._yLine = this.size.height + CommonParam.ShowUpCardHeight / 3;
            this.pos = cc.p(this.size.width / 2, this.size.height / 2);
            this.panel_card.setPosition(this.pos);
            this.type = CARD_SITE.HAND_IN;
            //********quanzhou*********
            //显示金标志
            this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
            if ((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key)) {
                this.setJin();
            }
            if (disTouch == true) {
                this.canTouch = false;
            }
            //---------quanzhou-----------
        },
        changeCardBg: function () {

            this.image_cardBG.loadTexture('tileBase_me_' + CommonParam.PAICARDBACK + '.png', ccui.Widget.PLIST_TEXTURE);
        },
        setCardCount: function (count) {
            if (count > 4) {
                this.text_all.setVisible(true);
                this.image_card.setVisible(false);
                this.image_jin.setVisible(false);
            } else {
                if (this.text_count != null)
                    this.text_count.setString(count + '张');
                this.text_count.setVisible(true);
            }

        },
        removeFromParent: function () {
            this.panel_card = null;
            this.image_card = null;

            this._super();
        },

        isOut: function (pos) {
            if (pos.y > this._yLine) {
                return true;
            }
            return false;
        },
        posOfPanel: function () {
            var pos = this.getPosition();
            var size = this.getContentSize();
            return cc.p(pos.x + size.width * 0.85, pos.y + size.height * 0.5 - CommonParam.ShowUpCardHeight);
        },

        isSelected: function () {
            return this.selected;
        },

        playSelectedAnimation: function (ting) {
            if (this.selected) return;
            this.panel_card.stopAllActions();

            var moveUp = cc.moveTo(CommonParam.MoveUpTime, cc.p(this.pos.x,
                this.pos.y + CommonParam.ShowUpCardHeight));
            this.panel_card.runAction(moveUp);
            this.selected = true;
            if (ting == undefined) {
                this.postTipEvt();
            }
        },

        playResetAnimation: function () {
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
        sendOneCard: function () {
            JJLog.print('点击', this.playerPanel.mCanPutCard, this.playerPanel.pengActionStatu);
            if (this.playerPanel.mCanPutCard && !this.playerPanel.pengActionStatu) {
                this.playerPanel.putOutCardStart(this);
            } else {
                this.resetCard();
            }
            this.postCancelEvt();
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

        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            if (!target.containsTouchLocation(touch) || !target.canTouch) return false;

            var touchPoint = touch.getLocation();
            var pos = target.convertToNodeSpace(touchPoint);
            target.touchBeginPos = pos;
            this.__MOVED__ = false;
            target.topOrder();
            if (this._mInterceptTouchEvent &&
                this._mInterceptTouchEvent.onTouchBegan &&
                this._mInterceptTouchEvent.onTouchBegan(target, touch, event)) {

            } else {
                if (target.isSelected()) {

                } else {
                    sound.playSelectCard();
                    target.resetAllCard();
                }
            }
            return true;
        },

        onTouchMoved: function (touch, event) {
            var target = event.getCurrentTarget();
            if (!target.canTouch) return;

            var touchPoint = touch.getLocation();
            var pos = target.convertToNodeSpace(touchPoint);
            var isCanMoveD = function (pos) {
                return Math.abs(pos.x - target.touchBeginPos.x) >= target.panel_card.width / 3 || Math.abs(pos.y - target.touchBeginPos.y) >= target.panel_card.width / 3;
            }
            if (this._mInterceptTouchEvent &&
                this._mInterceptTouchEvent.onTouchMoved &&
                this._mInterceptTouchEvent.onTouchMoved(target, touch, event)) {
            } else {
                var pos_f = target.pos;
                var panel = target.panel_card;
                if (Math.abs(pos.y - target.touchBeginPos.y) >= CommonParam.ShowUpCardHeight) {
                    if (this.__MOVED__) {
                        var moP = cc.p(0, 0);
                        if (pos.y > target.pos.y) {
                            moP = cc.p(pos.x, pos.y);
                        } else {
                            moP = cc.p(pos_f.x, pos_f.y);
                        }
                        //如果移动的高度没有达到一定高度的时候 x 坐标是不做移动的
                        if (Math.abs(pos.y - target.touchBeginPos.y) < target.panel_card.height) {
                            moP.x = pos_f.x;
                        }

                        panel.setPosition(moP);
                    }
                    this.__MOVED__ = true;
                } else {
                    if (pos.y <= CommonParam.ShowUpCardHeight) {
                        target.resetCard();
                        this.__MOVED__ = false;
                        return;
                    } else if (pos.y >= CommonParam.ShowUpCardHeight && pos.y <= target.panel_card.height) {
                        target.playSelectedAnimation();
                    }

                    if (this.__MOVED__ && target.isSelected()) {
                        panel.setPosition(pos_f.x, pos_f.y + CommonParam.ShowUpCardHeight);
                    }
                }

                cc.log("moved panel Pos ", panel.x, panel.y);
            }
        },
        onTouchEnded: function (touch, event) {
            var target = event.getCurrentTarget();
            var panel = target.panel_card;
            cc.log("ednpanel Pos ", panel.x, panel.y);
            if (!target.canTouch) return;

            var touchPoint = touch.getLocation();
            var pos = target.convertToNodeSpace(touchPoint);
            target.resetOrder();
            if (this._mInterceptTouchEvent &&
                this._mInterceptTouchEvent.onTouchEnded &&
                this._mInterceptTouchEvent.onTouchEnded(target, touch, event)) {

            } else {
                target.end_pos = touchPoint;
                if (target.isSelected()) {
                    if (target.containsTouchBeginRect(pos)) {
                        target.sendOneCard();
                    } else if (target.isOut(pos)) {
                        target.sendOneCard();
                    } else {
                        target.selected = false;
                        target.playSelectedAnimation();
                        // target.resetCard();
                    }
                } else {
                    if (target.containsTouchBeginRect(pos)) {
                        target.playSelectedAnimation();
                    } else if (target.isOut(pos)) {
                        target.sendOneCard();
                    } else {
                        target.resetCard();
                    }
                }
            }
        },

        containsTouchBeginRect: function (endPos) {
            var f = 30;

            var recttmp = cc.rect(this.touchBeginPos.x - f, this.touchBeginPos.y - f, f, f);
            var result = cc.rectContainsPoint(recttmp, endPos);
            return result;

            // var boxRect = this.getBoundingBox();
            // boxRect.x = 0;
            // boxRect.y = 0;

            // var result = cc.rectContainsPoint(boxRect, endPos);
            // return result;

        },

        resetCard: function () {
            if (this.panel_card != null)
                this.panel_card.setPosition(this.pos);
            this.selected = false;

            this.clearMoveCard();
        },

        /**
         * 清理上层拖动的copy的牌
         */
        clearMoveCard: function () {
            if (this.panel_card && this.panel_card.__MOVECARD__) {
                this.panel_card.__MOVECARD__.removeFromParent();
                this.panel_card.__MOVECARD__ = null;
            }
        },

        resetAllCard: function () {
            //this.playerPanel.resetAllCard();
            var event = new cc.EventCustom(CommonEvent.ResetCardState);
            event.setUserData(this.pai);
            cc.eventManager.dispatchEvent(event);
        },

        topOrder: function () {
            this.getParent().reorderChild(this, 100);
        },

        resetOrder: function () {
            this.getParent().reorderChild(this, this._mZOrder);
        },

        iInterceptTouchEvent: function (eventCfg) {
            /** 
            * 
            * eventCft{
            *   onTouchBegan: function,
            *   onTouchMoved: function,
            *   onTouchEnded: function,
            * }
            * 
            * */

            this._mInterceptTouchEvent = eventCfg;

        },
        rInterceptTouchEvent: function () {
            this._mInterceptTouchEvent = null;
        },
        onEnter: function () {
            this._super();
            var _this = this;
            this._touchListener = cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.onTouchBegan.bind(this),
                onTouchMoved: this.onTouchMoved.bind(this),
                onTouchEnded: this.onTouchEnded.bind(this)
            }, this);
            this._mZOrder = this.getLocalZOrder();
            var ls = cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: CommonEvent.ResetCardState,
                callback: function (event) {
                    var eventStr = event.getUserData();
                    _this.resetCard();

                }
            });
            this._Listener = cc.eventManager.addListener(ls, this);
        },

        onExit: function () {
            cc.eventManager.removeListener(this._touchListener);
            this.panel_card = null;
            this.image_card = null;
            this._super();
        },

    });

    var create3D = function (jPlayerPanel, data, disTouch) {
        var root = util.LoadUI(MJBaseResV3D.DownStand).node;
        var card = new Card();
        card.init(data, MJGVType.V3D);
        card.initialize(root, jPlayerPanel, data, disTouch);
        return card;
    };
    var create2D = function (jPlayerPanel, data, disTouch) {
        var root = util.LoadUI(MJBaseResV2D.Card).node;
        var card = new Card();
        card.init(data, MJGVType.V2D);
        card.initialize(root, jPlayerPanel, data, disTouch);
        return card;
    };
    var ins = {
        create2D: create2D,
        create3D: create3D,
    }

    return ins;
}();
