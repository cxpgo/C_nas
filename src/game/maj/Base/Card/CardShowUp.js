var MJCardShowUp = function () {

    var Card = MJOpenCard.extend({
        initialize: function (root , data, type) {
            this._super(root);

            this.setCascadeOpacityEnabled(true);
            this.addChild(root);
            this.panel_card = ccui.helper.seekWidgetByName(root, "panel_card");
            this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
            this.image_card.loadTexture(this.pai.frameImgDownOfPai(), ccui.Widget.PLIST_TEXTURE);
            this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
            this.img_arrow = ccui.helper.seekWidgetByName(root, "Image_arrow");
            var size = root.getContentSize();
            this.setContentSize(size);

            if(data){
                this.setCardNum(data.num);
            }
            
            if (type != undefined && type != null)
                this.type = type;
            //显示金标志
            this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
            if ((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key)) {
                this.setJin();
            }
        },

        changeCardBg: function () {
            this.image_cardBG.loadTexture('tileBaseFinish_me_' + CommonParam.PAICARDBACK + '.png', ccui.Widget.PLIST_TEXTURE);
            if (this.issetback == true) {
                this.SetBack();
            }
        },
        SetBack: function () {
            if (this.image_cardBG) {
                this.issetback = true;
                this.image_cardBG.loadTexture(this.pai.frameImgDownBackOfPai(), ccui.Widget.PLIST_TEXTURE);
                this.image_card.setVisible(false);
            }

            if (!!this.image_jin) {
                this.image_jin.setVisible(false)
            }
        },

        posOfPanel: function () {
            var pos = this.getPosition();
            var size = this.getContentSize();
            return pos;
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
        var root = util.LoadUI(MJBaseResV3D.DownShow).node;
        var card = new Card();
        card.init(data , MJGVType.V3D);
        card.initialize(root ,data, type);
        return card;
    };
    var create2D = function (data, type) {
        var root = util.LoadUI(MJBaseResV2D.CardShowUp).node;
        var card = new Card();
        card.init(data , MJGVType.V2D);
        card.initialize(root ,data, type);
        return card;
    };
    var ins = {
        create2D: create2D,
        create3D: create3D,
    }

    return ins;
}();
