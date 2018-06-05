var MJPlugInTiongTips = SeatPlugInBase.extend({
    isTingTip:false,
    TingChoiceTip:{},
    ctor: function (deskSeat){
        this._super();
        this.mDeskSeat = deskSeat;
        this.mRoot = util.LoadUI(MJBaseRes.WGTingTips).node;
        this.action = util.LoadUI(MJBaseRes.WGTingTips).action;
        this.mRoot.runAction(this.action);
        this.addChild(this.mRoot);
        this.mRoot.setVisible(true);

        this.isTingTip = false;
        this.TingChoiceTip = {};

        this._mCellClone = ccui.helper.seekWidgetByName(this.mRoot, "cell");
        this._mCellClone.setVisible(false);
        this.image_huTips = ccui.helper.seekWidgetByName(this.mRoot, "image_huTips");
        this.sprite_tingtips = ccui.helper.seekWidgetByName(this.mRoot, "sprite_tingtips");
        this.btn_tingtips = ccui.helper.seekWidgetByName(this.mRoot, "btn_tingtips");
        this.btn_tingtips.addClickEventListener(this.onTingtips.bind(this));
        this.sprite_tingtips.setVisible(false);
        this.btn_tingtips.setVisible(false);
        this.image_huTips.setVisible(false);

        Object.defineProperties(this, {
            "cardInArray": {
                get: function () {
                    return this.mDeskSeat.cardInArray;
                }
            },
        });

        this.action.play('tingtips', true);
    },

    onEnter: function () {
        this._super();
        var self = this;
        var ls4 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.TipEvent,
            callback: function (event) {
                self.huTipEvent(event);
            }
        });
        cc.eventManager.addListener(ls4, this);

        var ls5 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.TINGChOICE,
            callback: function (event) {
                self.OnlineTing(event);
            }
        });
        cc.eventManager.addListener(ls5, this);

        qp.event.listen(this, 'appPluginHuTipsClose', this.onAppPluginHuTipsClose.bind(this));
        qp.event.listen(this, 'appPluginHuTipsOpen', this.appPluginHuTipsOpen.bind(this));
        qp.event.listen(this, 'mjTingChange', this.mjTingChange.bind(this));
    },

    onExit: function () {
        this._super();
        qp.event.stop(this, 'appPluginHuTipsClose');
        qp.event.stop(this, 'appPluginHuTipsOpen');
        qp.event.stop(this, 'mjTingChange');
    },

    onTingtips:function () {
        this.image_huTips.setVisible(this.isTingTip);
        this.isTingTip = !this.isTingTip;
    },

    onAppPluginHuTipsClose: function () {
        this.image_huTips.setVisible(false);
        this.btn_tingtips.setVisible(false);
        this.sprite_tingtips.setVisible(false);

    },

    appPluginHuTipsOpen: function () {
        this.image_huTips.setVisible(true);
        this.btn_tingtips.setVisible(true);
        this.sprite_tingtips.setVisible(true);
    },

    getHuData: function () {
        return this.mDeskSeat.huDate;
    },

    reset: function () {
        this.huDate = null;
        this.isTingTip = false;
        this.TingChoiceTip = {};
        this.btn_tingtips.setVisible(false);
        this.sprite_tingtips.setVisible(false);
        this.image_huTips.setVisible(false);
    },

    //听的牌改动，服务器推送，客户端刷新
    mjTingChange: function (data) {
        var huDate = data['tingChoice'];
        for(var i = 0;i<huDate.length;i++)
        {
            var huCards = huDate[i]['hu'];
            var nums  = huDate[i]['num'];
            for(var j=0;j<huCards.length;j++)
            {
                var tingID = huCards[j].type + huCards[j].value;
                if(this.TingChoiceTip.hasOwnProperty(tingID))
                {
                  this.TingChoiceTip[tingID].NumIndex.string = nums[j];
                    if(nums[j] == 0)
                    {
                        this.TingChoiceTip[tingID].showGray();
                    }
                }
            }
            break;
        }
    },

    //断线重连，听牌提示
    OnlineTing:function (event) {
        this.huDate = event.getUserData();
        this.btn_tingtips.setVisible(true);
        this.sprite_tingtips.setVisible(true);
        this.image_huTips.setVisible(true);
        // var key = card.paiOfCard().keyOfPai();
        if(!!this.huDate)
        {
            this.huTingTipEvent(null,0);
        }
    },

    //听牌提示代码提取
    huTingTipEvent:function (key,type) {
        var showTip = false;
        if(this.huDate instanceof Array)
        {
            for(var i = 0;i<this.huDate.length;i++)
            {
                if(type == 1 ? this.huTingjudge(key,i) : true)
                {
                    this.image_huTips.removeAllChildren();
                    var huCards = this.huDate[i]['hu'];
                    var nums  = this.huDate[i]['num'];
                    this.image_huTips.setContentSize(cc.size(110+100*(huCards.length-1),145));
                    for(var j=0;j<huCards.length;j++)
                    {
                        var tingcard = MJMyCard.create3D(this, huCards[j]);
                        var cell = this._mCellClone.clone();
                        cell.setVisible(true);
                        var txtCount = ccui.helper.seekWidgetByName(cell, "txt_zhang");
                        if (nums && !!nums[j] || nums[j] == 0) {
                            txtCount.string = nums[j];
                            if (nums[j] == 0) {
                                tingcard.showGray();
                            }
                        }
                        tingcard.y = -5;
                        tingcard.x = 10;
                        cell.addChild(tingcard);
                        this.image_huTips.addChild(cell);
                        var tingID = huCards[j].type + huCards[j].value;
                        this.TingChoiceTip[tingID] = tingcard;
                        this.TingChoiceTip[tingID].NumIndex = txtCount;
                        cell.y = 0;
                        cell.x = 100*j;
                    }
                    showTip = true;
                    this.btn_tingtips.setVisible(showTip);
                    this.sprite_tingtips.setVisible(showTip);
                    break;
                }
            }
            this.image_huTips.setVisible(showTip);
            this.mRoot.setVisible(true);
        }
    },

    huTingjudge:function (key,i) {
        return  (!!this.huDate[i]['del'] && key == this.huDate[i]['del'].type + this.huDate[i]['del'].value);
    },

    huTipEvent: function (event) {
        this.huDate = this.getHuData();
        if (!!this.huDate) {
            var key = event.getUserData();
            this.huTingTipEvent(key,1);
        }
    },

});