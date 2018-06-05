var JJMajhongDecideDialog = JJDialog.extend({
    text_des: null,
    btn_confirm: null,
    btn_cancel: null,
    confirmCb: null,
    cancelCb: null,
    text_title: null,
    ctor: function () {
        this._super();
        var root = util.LoadUI(GameHallJson.Decide).node;
        this.addChild(root);
        this.text_title = ccui.helper.seekWidgetByName(root, "text_title");
        this.text_des = ccui.helper.seekWidgetByName(root, "text_des");
        this.btn_confirm = ccui.helper.seekWidgetByName(root, "btn_confirm");
        this.btn_cancel = ccui.helper.seekWidgetByName(root, "btn_cancel");
        this.btn_cancel.addClickEventListener(this.dismissDialog.bind(this));
        var _this = this;
        this.btn_confirm.addClickEventListener(function () {
            _this.removeFromParent();
            if (_this.confirmCb != null)
                _this.confirmCb();
        });
    },

    dismissDialog: function () {
        this._super();
        if (this.cancelCb != null)
            this.cancelCb();
    },

    setCancelCal: function (cb) {
        this.cancelCb = cb;
    },

    setCallback: function (confirmCb) {
        this.confirmCb = confirmCb;
    },

    setDes: function (text) {
        if(text == undefined || text == null) text = "";
        this.text_des.setString(text);
    },

    setTitle:function (title) {
        if(this.text_title != null)
        {
            this.text_title.loadTexture(title, ccui.Widget.LOCAL_TEXTURE);
            this.text_title.ignoreContentAdaptWithSize(true);
        }
    }

});