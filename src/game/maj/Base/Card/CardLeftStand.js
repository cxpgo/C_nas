var MJCardLeftStand = function () {

    var Card = MJCard.extend({
        initialize: function (root) {
            this.addChild(root);
            this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
            this.type = CARD_SITE.HAND_IN;
            if (MajhongInfo.MajhongNumber > 14) {
                this.resetcontentSize(root, CommonParam.Other17CardStandScale);
            } else {
                var size = root.getContentSize();
                this.setContentSize(size);
            }
        },
        changeCardBg: function () {

            this.image_card.loadTexture('tileBack_left_' + CommonParam.PAICARDBACK + '.png', ccui.Widget.PLIST_TEXTURE);
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

    var create3D = function () {
        var root = util.LoadUI(MJBaseResV3D.LeftStand).node;
        var card = new Card();
        card.init(null , MJGVType.V3D);
        card.initialize(root);
        return card;
    };
    var create2D = function () {
        var root = util.LoadUI(MJBaseResV2D.CardLeftStand).node;
        var card = new Card();
        card.init(null , MJGVType.V2D);
        card.initialize(root);
        return card;
    };
    var ins = {
        create2D: create2D,
        create3D: create3D,
    }

    return ins;
}();
