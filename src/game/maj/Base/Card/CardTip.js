var MJCardTip = function () {

    var Card = MJOpenCard.extend({
        initialize: function (root ,data) {
            this._super(root);

            this.setCascadeOpacityEnabled(true);
            this.addChild(root);

            this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
            this.image_card.loadTexture(this.pai.frameImgDownOfPai(), ccui.Widget.PLIST_TEXTURE);
            this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
            var size = root.getContentSize();
            this.setContentSize(size);

            if (typeof (data) == 'object' && !!data['num'] && data['num'] != undefined) {
                this.setCardNum(data.num);
            }

            //显示金标志
            this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
            if ((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key)) {
                this.setJin();
            }
        },

        SetBack: function () {
            if (this.image_cardBG) {
                this.image_cardBG.loadTexture(this.pai.frameImgDownBackOfPai(), ccui.Widget.PLIST_TEXTURE);
                this.image_card.setVisible(false);
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


    var create3D = function (data) {
        if(!window.MJBaseResV3D){
            return this.create2D(data);
        }
        var root = util.LoadUI(MJBaseResV3D.CardTip).node;
        var card = new Card();
        card.init(data , MJGVType.V3D);
        card.initialize(root , data);
        return card;
    };
    var create2D = function (data) {
        var root = util.LoadUI(MJBaseResV2D.CardTip).node;
        var card = new Card();
        card.init(data , MJGVType.V2D);
        card.initialize(root , data);
        return card;
    };
    var ins = {
        create2D: create2D,
        create3D: create3D,
    }

    return ins;
}();
