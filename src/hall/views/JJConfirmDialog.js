var JJConfirmDialog = JJDialog.extend({
    text_des: null,
    text_title: null,
    btn_confirm: null,
    confirmCb: null,
    ctor: function () {
        this._super();
        this.root = util.LoadUI(GameHallJson.Comfirm).node;
        this.addChild(this.root);

        this.text_title = ccui.helper.seekWidgetByName(this.root, "text_title");
        this.text_des = ccui.helper.seekWidgetByName(this.root, "text_des");
        this.btn_confirm = ccui.helper.seekWidgetByName(this.root, "btn_confirm");
        var _this = this;
        this.btn_confirm.addClickEventListener(function () {
            _this.removeFromParent();
            if (_this.confirmCb != null)
                _this.confirmCb();
        });
    },

    setCallback: function (confirmCb) {
        this.confirmCb = confirmCb;
    },

    setDes: function (text) {
        if(text == undefined || text == null) text = "";
        this.text_des.setString(text);
    }

});