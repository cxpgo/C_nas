var MJCardRightStand = function () {

    var Card = MJCard.extend({
        initialize: function (root , panel) {
            
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

    var create3D = function (panel) {
        var root = util.LoadUI(MJBaseResV3D.RightStand).node;
        var card = new Card();
        card.init(null , MJGVType.V3D);
        card.initialize(root , panel);
        return card;
    };
    var create2D = function (panel) {
        var root = util.LoadUI(MJBaseResV2D.CardRightStand).node;
        var card = new Card();
        card.init(null , MJGVType.V2D);
        card.initialize(root , panel);
        return card;
    };
    var ins = {
        create2D: create2D,
        create3D: create3D,
    }

    return ins;
}();
