var MJCardUpDesk = function () {

    var Card = MJOpenCard.extend({
        panel_card: null,
        initialize: function (root ,data, cardIndex) {
            this._super(root);

            if (cardIndex == null || cardIndex == undefined)
                cardIndex = 0;
            var ori = cardIndex;
            
            this.addChild(root);
            this.panel_card = ccui.helper.seekWidgetByName(root, "panel_card");
            this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
            this.image_card.loadTexture(this.pai.frameImgDownDesk(), ccui.Widget.PLIST_TEXTURE);
            this.image_card.ignoreContentAdaptWithSize(true);
            if (cardIndex > 4)
                ori = 9 - cardIndex;
            this.image_card.setRotationX(card_deskSkewX[9 - cardIndex]);
            this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
            this.image_cardBG.loadTexture("down" + ori + ".png", ccui.Widget.PLIST_TEXTURE);
            this.image_cardBG.ignoreContentAdaptWithSize(true);
            if (cardIndex > 4) this.image_cardBG.setFlippedX(false);
            var size = root.getContentSize();
            this.setContentSize(size);
            this.image_indicator = ccui.helper.seekWidgetByName(root, "image_indicator");
            this.image_indicator.setPositionX(indicator_UpPosx[cardIndex]);
            this.image_indicator.setVisible(false);
            //显示金标志
            this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
            if (cardIndex > 4) {
                if (!!this.image_jin)         //BG翻转以后金的位置就不对了  得调一下
                {
                    this.image_jin.setPositionX(this.image_jin.getPositionX() + 12);
                    this.image_jin.setRotationX(-5);

                }
            }
            if ((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key)) {
                this.setJin();
            }
            
            if (typeof (data) == 'object' && !!data['num'] && data['num'] != undefined) {
                this.setCardNum(data.num);
            }
        },
        changeCardBg: function () {
            this.image_cardBG.loadTexture('tileBase_meUp_' + CommonParam.PAICARDBACK + '.png', ccui.Widget.PLIST_TEXTURE);
            if (this.issetback == true) {
                this.SetBack();
            }
        },

        removeFromParent: function () {
            this.image_indicator = null;
            this.image_card = null;

            this._super();
        },

        onExit: function () {
            this.image_indicator = null;
            this.image_card = null;
            this._super();
        },
    });

    var create3D = function (data, cardIndex) {
        var root = util.LoadUI(MJBaseResV3D.UpDesk).node;
        var card = new Card();
        card.init(data , MJGVType.V3D);
        card.initialize(root , data, cardIndex);
        return card;
    };
    var create2D = function (data, cardIndex) {
        var root = util.LoadUI(MJBaseResV2D.CardUpStand).node;
        var card = new Card();
        card.init(data , MJGVType.V2D);
        card.initialize(root , data, cardIndex);
        return card;
    };
    var ins = {
        create2D: create2D,
        create3D: create3D,
    }

    return ins;
}();
