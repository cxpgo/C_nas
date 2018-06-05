var QDTipBar = cc.Layer.extend({

    _text: null,
    _tipBar: null,
    _time: 0,
    _tip_y: null,
    ctor: function () {
        this._super();
        var root = util.LoadUI(GameHallJson.TipBarNotice).node;
        this.addChild(root);
        this._tipBar = ccui.helper.seekWidgetByName(root, "tipBar");
        this._text = ccui.helper.seekWidgetByName(root, "text_des");
    },

    onEnter: function () {
        this._super();
    },

    show: function (text, time) {
        cc.director.getRunningScene().addChild(this, 10000);
        if (this._time > 0) return;
        this._text.setString(text);
        var action = cc.moveTo(time, 640, 500);
        var callfunc = cc.callFunc(this.hideTime, this);
        var seq = cc.sequence(action, callfunc);
        this._tipBar.runAction(seq);
        this._time = time;

    },

    hideTime: function () {
        var self = this;
        this.scheduleOnce(function () {
            this.removeFromParent();
            self._time = 0;
        }, 0.2)
    }


});