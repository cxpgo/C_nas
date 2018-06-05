var MJPlugInDaAnTingHu = SeatPlugInBase.extend({
    ctor: function (deskSeat){
        this._super();
        this.mDeskSeat = deskSeat;
        this.mRoot = util.LoadUI(MJBaseRes.WGShowTingHuType).node;
        this.addChild(this.mRoot);
        this.mRoot.setVisible(true);

        this.isTingTip = false;
        this.TingChoiceTip = {};

        this._mtext_hu = ccui.helper.seekWidgetByName(this.mRoot, "text_hu");
        this._mCellClone = ccui.helper.seekWidgetByName(this.mRoot, "cell");
        this._mtext_hu.setVisible(false);
        this._mCellClone.setVisible(false);
        this.image_huTips = ccui.helper.seekWidgetByName(this.mRoot, "image_huTips");
        this.image_huTips.setVisible(false);

        Object.defineProperties(this, {
            "cardInArray": {
                get: function () {
                    return this.mDeskSeat.cardInArray;
                }
            },
        });
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'appNotifyShowTing', this.appNotifyShowTing.bind(this));
        qp.event.listen(this, 'appShowInfoClose', this.appShowInfoClose.bind(this));
    },

    CardTouchGray:function () {
        for(var i=0;i<this.cardInArray.length;i++)
        {
            var card = this.cardInArray[i];
            card.showGray();
        }
    },

    CardTouchWhite:function (tingChoice) {
        for(var i=0;i<this.cardInArray.length;i++)
        {
            var card = this.cardInArray[i];
            var isGray = true;
            var del = tingChoice['del'];
            if (!!del && del.type + del.value == card.paiOfCard().keyOfPai()) {
                isGray = false;
            }
            if (isGray) {
                card.showGray();
            }
            else
            {
                card.showWhite();
            }
        }
    },

    onExit: function () {
        this._super();
        qp.event.stop(this, 'appNotifyShowTing');
        qp.event.stop(this, 'appShowInfoClose');
    },

    appNotifyShowTing:function (data) {
        this.CardTouchGray();
        this.image_huTips.removeAllChildren();
        this.tingChoice = data['tingChoice'];
        this.Index = 0;
        for(var i=0;i<this.tingChoice.length;i++)
        {
            var tingChoice = this.tingChoice[i];
            var showInfo = this.tingChoice[i]['showInfo'];
            var num = this.tingChoice[i]['num'];
            var del = this.tingChoice[i]['del'];
            for(var j=0;j<showInfo.length;j++)
            {
                var showCards = showInfo[j]['showCards'];
                var hu = showInfo[j]['hu'];
                this.HuShowCards(showCards,hu,num,del,tingChoice);
            }
            // this.image_huTips.addChild(layout);
        }
        this.mhu_height = 125 * this.Index;
        this.image_huTips.setContentSize( this.mhu_width ,this.mhu_height);
    },

    HuShowCards:function (showCards,hu,num,del,tingChoice) {
        this.image_huTips.setVisible(true);
        var layout = new ccui.Layout();
        layout.y = this.Index * 120;
        this.Index++;
        layout.showCards = showCards;
        layout.tingChoice = tingChoice;
        layout.hu = hu;
        layout.setContentSize(cc.size(110+72*(showCards.length -1) + 350 ,120 ));
        layout.setTouchEnabled(true);
        layout.addClickEventListener(this.selHuCards.bind(this));
        for(var j=0;j<showCards.length;j++)
        {
            var cell = this._mCellClone.clone();
            cell.setVisible(true);
            var image_card = ccui.helper.seekWidgetByName(cell, "image_card");
            this.pai = new XYMJ.Pai(showCards[j]);
            image_card.loadTexture(this.pai.frameImgStandOfPai(), ccui.Widget.PLIST_TEXTURE);
            layout.addChild(cell);
            // var tingID = huCards[j].type + huCards[j].value;
            // this.TingChoiceTip[tingID] = tingcard
            cell.y = 9;
            cell.x = 72*j + 30;
        }

        var str = '打' + XYMJ.PaiWord[del['type'] + del['value']] +',';
        for(var i=0;i<hu.length;i++)
        {
            str += '胡' + XYMJ.PaiWord[hu[i].type + hu[i].value] + '(剩' + num[i] + '张)';
        }
        var text = this._mtext_hu.clone();
        text.setString(str);
        text.setVisible(true);
        text.y = layout.height / 2;
        // text.x = 90*showCards.length;
        text.x = layout.width - text.width;
        layout.addChild(text);

        if(this.mhu_width)
        {
            this.mhu_width = this.mhu_width > layout.width ? this.mhu_width : layout.width;
        }
        else
        {
            this.mhu_width = layout.width;
        }
        this.image_huTips.addChild(layout);
    },

    selHuCards:function (sender) {
        var tingChoice = sender.tingChoice;
        var showCards = sender.showCards;
        var hu = sender.hu;
        var Info = {};
        Info['showCards'] = showCards;
        Info['hu'] = hu;
        var self = this;
        XYGLogic.Net.mingPaiSelect(Info,function (data) {
             if(data.code == 200)
             {
                 self.image_huTips.setVisible(false);
                 self.CardTouchWhite(tingChoice);
             }
        });
    },
    appShowInfoClose:function () {
        this.image_huTips.setVisible(false);
    },

    getHuData: function () {
        return this.mDeskSeat.huDate;
    },

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
                    this.TingChoiceTip[tingID].setCardNum(nums[j]);
                    if(nums[j] == 0)
                    {
                        this.TingChoiceTip[tingID].showGray();
                    }
                }
            }
            break;
        }
    },
});