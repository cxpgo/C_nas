
var TDKLeftSeat = TDKDeskSeat.extend({
    ctor: function (data, optTipsNode) {
        this._super(data, optTipsNode);
        this.root = util.LoadUI(TDKJson.LeftPanel).node;
        this.addChild(this.root);

        this.initUI();
    },

    onEnter: function () {
        this._super();
    },

    setChipInOpt:function () {

    },

    initUI:function()
    {
        this._super();
    },
});
