
var TDKSmallPourSpt = cc.Layer.extend({
    _scale: 1,
    ctor: function (cm, inUID) {
        this._super();
        this.CMValue = cm;
        this.InUID = inUID;
        this.root = util.LoadUI(TDKJson.PourSpt).node;
        this.root.setScale(this._scale);
        this.addChild(this.root);
        // this.setColor();

        this.spt = ccui.helper.seekWidgetByName(this.root, "spt");
        this.lab_vv = ccui.helper.seekWidgetByName(this.root, "lab_vv");

        this._initView();
    },
    _initView: function () {
        var size = this.root.getContentSize();
        this.setContentSize(size.width * this._scale, size.height * this._scale);
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(0.5, 0.5);

        this.loadBg();
    },

    setPour: function (cv) {
        this.CMValue = cv;
        this.loadBg();
    },

    loadBg: function () {
        var defPath = "img_chouma_5.png";
        var nameKey = null;
        var lastBOV = 0;
        for (var key in TDK_POUR_V) {
            if (TDK_POUR_V[key] == this.CMValue) {
                nameKey = key;
                break;
            }
            if (lastBOV < this.CMValue && this.CMValue < TDK_POUR_V[key]) {
                nameKey = key;
                break;
            }
            lastBOV = TDK_POUR_V[key];
        }
        switch (nameKey) {
            case "POUR_V1":
                defPath = "img_chouma_1.png";
                break;
            case "POUR_V2":
                defPath = "img_chouma_2.png";
                break;
            case "POUR_V3":
                defPath = "img_chouma_2.png";
                break;
            case "POUR_V4":
                defPath = "img_chouma_5.png";
                break;
            case "POUR_V5":
                defPath = "img_chouma_5.png";
                break;
        }
        defPath = "res/Game/Poker/TDK/Resoures/bottompour/" + defPath;
        this.spt.loadTexture(defPath);
    },
    clone: function () {
        var pourSpt = new TDKSmallPourSpt(this.CMValue, this.InUID);
        return pourSpt;
    },

});
