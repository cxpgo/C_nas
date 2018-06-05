var MJCardRightDesk = function () {

    var Card = MJOpenCard.extend({
        panel_card: null,
        initialize: function (root ,data, panelIndex) {
            this._super(root);
            
            this.addChild(root);
            this.panel_card = ccui.helper.seekWidgetByName(root, "panel_card");
            this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
            this.image_card.loadTexture(this.pai.frameImgRightShowOfPai(), ccui.Widget.PLIST_TEXTURE);
            this.image_card.ignoreContentAdaptWithSize(true);

            this.image_indicator = ccui.helper.seekWidgetByName(root, "image_indicator");
            this.image_indicator.setVisible(false);
            this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
            if (panelIndex == 1) {
                this.image_cardBG.loadTexture("left1.png", ccui.Widget.PLIST_TEXTURE);
                this.image_cardBG.ignoreContentAdaptWithSize(true);
            }

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
            var size = root.getContentSize();
            this.setContentSize(size);
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
                this.image_cardBG.loadTexture(this.pai.frameImgRightBackOfPai(), ccui.Widget.PLIST_TEXTURE);
                this.image_card.setVisible(false);
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

    var create3D = function (data, panelIndex) {
        var root = util.LoadUI(MJBaseResV3D.RightDesk).node;
        var card = new Card( );
        card.init(data , MJGVType.V3D);
        card.initialize(root , data, panelIndex);
        return card;
    };
    var create2D = function (data, panelIndex) {
        var root = util.LoadUI(MJBaseResV2D.CardRightStand).node;
        var card = new Card( );
        card.init(data , MJGVType.V2D);
        card.initialize(root ,data, panelIndex);
        return card;
    };
    var ins = {
        create2D: create2D,
        create3D: create3D,
    }

    return ins;
}();
