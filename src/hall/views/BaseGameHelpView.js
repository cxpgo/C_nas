
var BaseGameHelpView = cc.Layer.extend({
    root: null,
    panel_root: null,
    ctor: function () {
        this._super();

    },

    initUI: function (root) {

    },

    onEnter: function () {
        this._super();
        this.registerAllEvents();
    },

    onExit: function () {
        this._super();
        this.removeAllEvents();
    },

    registerAllEvents: function () {

    },

    removeAllEvents: function () {

    },

    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    },
});

