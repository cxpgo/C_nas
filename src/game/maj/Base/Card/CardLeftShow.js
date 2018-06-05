var MJCardLeftShow = function () {

    var Card = MJOpenCard.extend({
        initialize: function (root , data, type) {
            this._super(root);
            this.addChild(root);
            this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
            this.image_card.loadTexture(this.pai.frameImgLeftShowOfPai(), ccui.Widget.PLIST_TEXTURE);
            this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
            this.img_arrow = ccui.helper.seekWidgetByName(root, "Image_arrow");
            var size = root.getContentSize();
            this.setContentSize(size);

            //显示金标志
            this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
            if ((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key)) {
                this.setJin();
            }
            
            if (typeof (data) == 'object' && !!data['num'] && data['num'] != undefined) {
                this.setCardNum(data.num);
            }
            if (type != undefined && type != null) {
                this.type = type;
                if (MajhongInfo.MajhongNumber > 14 && type == CARD_SITE.RECORD) {
                    this.resetcontentSize(root, CommonParam.Other17CardRecordScale);
                }
            }
        },
        changeCardBg: function () {
            this.image_cardBG.loadTexture('tileBase_leftRight_' + CommonParam.PAICARDBACK + '.png', ccui.Widget.PLIST_TEXTURE);
            if (this.issetback == true) {
                this.SetBack();
            }
        },
        SetBack: function () {
            if (this.image_cardBG) {
                this.issetback = true;
                this.image_cardBG.loadTexture(this.pai.frameImgLeftBackOfPai(), ccui.Widget.PLIST_TEXTURE);
                this.image_card.setVisible(false);
            }
            if (!!this.image_jin) {
                this.image_jin.setVisible(false)
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

    var create3D = function (data, type) {
        var root = util.LoadUI(MJBaseResV3D.LeftShow).node;
        var card = new Card();
        card.init(data , MJGVType.V3D);
        card.initialize(root , data, type);
        return card;
    };
    var create2D = function (data, type) {
        var root = util.LoadUI(MJBaseResV2D.CardLeftShow).node;
        var card = new Card( );
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
