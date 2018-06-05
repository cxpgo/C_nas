var MJCardUpShow = function () {

    var Card = MJOpenCard.extend({
        initialize: function (root , data, cardIndex, type) {
            this._super(root);
            
            this.addChild(root);
            if (cardIndex >= card_indexs.length) cardIndex = card_indexs.length - 1;
            this.cardIndex = card_indexs[GetCardDifferentIndex(cardIndex)];
            this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
            this.image_card.loadTexture(this.pai.frameImgUpShowOfPai(), ccui.Widget.PLIST_TEXTURE);
            this.image_card.ignoreContentAdaptWithSize(true);
            
            this.img_arrow = ccui.helper.seekWidgetByName(root, "Image_arrow");

            this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
	
            var size = root.getContentSize();
            this.setContentSize(size);
            //显示金标志
            this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
            if ((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key)) {
                this.setJin();
            }
            this.text_cardCount = ccui.helper.seekWidgetByName(root, "text_count");
            if (typeof (data) == 'object' && !!data['num'] && data['num'] != undefined) {
                this.setCardNum(data.num);
            }
            if (type != undefined && type != null) {
                this.type = type;
                if (MajhongInfo.MajhongNumber > 14 && type == CARD_SITE.RECORD) {
                    this.resetcontentSize(root, CommonParam.UP17CardRecordScale);
                }
            }
        },
        changeCardBg: function () {
            this.image_cardBG.loadTexture('tileBase_meUp_' + CommonParam.PAICARDBACK + '.png', ccui.Widget.PLIST_TEXTURE);
            if (this.issetback == true) {
                this.SetBack();
            }
        },

        SetBack: function (cardIndex) {
            if (this.image_cardBG) {
                this.issetback = true;
                this.image_cardBG.loadTexture(this.pai.frameImgUpBackOfPai(this.cardIndex), ccui.Widget.PLIST_TEXTURE);
                
                this.image_card.setVisible(false);
                // if (cardIndex != undefined && cardIndex > (MajhongInfo.MajhongNumber - 2) / 2) this.image_cardBG.setFlippedX(true);
            }
        },

        reloadCardIndex: function (cardIndex) {
            if (cardIndex >= card_indexs.length) cardIndex = card_indexs.length - 1;
            this.cardIndex = card_indexs[GetCardDifferentIndex(cardIndex)];
            if (this.issetback) {
                this.SetBack(cardIndex);
            } else {
                this.image_cardBG.loadTexture(this.pai.frameImgUpBackOfPai(cardIndex), ccui.Widget.PLIST_TEXTURE);
                // this.image_card.setRotationX(card_showSkewX[GetCardDifferentIndex(cardIndex)]);
                // this.image_card.setPositionX(card_showPosX[GetCardDifferentIndex(cardIndex)] + 2);
                if (cardIndex > (MajhongInfo.MajhongNumber - 2) / 2)
                    this.image_cardBG.setFlippedX(true);
                else
                    this.image_cardBG.setFlippedX(false);
            }
        },

        removeFromParent: function () {
            this.image_card = null;

            this._super();
        },

        onExit: function () {
            this.image_card = null;
            this._super();
        },
    });

    var create3D = function (data, cardIndex, type) {
        var root = util.LoadUI(MJBaseResV3D.UpShow).node;
        var card = new Card();
        card.init(data , MJGVType.V3D);
        card.initialize(root , data, cardIndex, type);
        return card;
    };
    var create2D = function (data, type) {
        var root = util.LoadUI(MJBaseResV2D.CardUpShow).node;
        var card = new Card();
        card.init(data , MJGVType.V2D);
        card.initialize(root , data, type);
        return card;
    };
    var ins = {
        create2D: create2D,
        create3D: create3D,
    }

    return ins;
}();
