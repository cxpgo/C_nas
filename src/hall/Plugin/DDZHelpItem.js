var DDZHelpItem = ccui.Widget.extend({
    root: null,
    panel_root: null,
    ctor: function () {
        this._super();
        var node = util.LoadUI(GameHallJson.DDZHelp).node;
        this.root = ccui.helper.seekWidgetByName(node, "panel_root").clone();
        this.addChild(this.root);
        this.setContentSize(this.root.getContentSize());

        this.panel_sss = new Array();
        for (var j = 0; j < 2; j++) {
            var msg_view = ccui.helper.seekWidgetByName(this.root, "msg_view" + j);
            this.panel_sss.push(msg_view);
        }
        this.btns_sss = new Array();
        var btn_1 = ccui.helper.seekWidgetByName(this.root, "Button_0");
        btn_1.addClickEventListener(this.showSSSMsg.bind(this));
        var btn_2 = ccui.helper.seekWidgetByName(this.root, "Button_1");
        btn_2.addClickEventListener(this.showSSSMsg.bind(this));
        this.btns_sss.push(btn_1);
        this.btns_sss.push(btn_2);
        this.showSSSMsg(btn_1);
    },
    showSSSMsg: function (sender) {
        sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.btns_sss.forEach(function (element) {
            if (element.name != sender.name) {
                element.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
            }
        });

        for (var i = 0; i < this.btns_sss.length; i++) {
            this.panel_sss[i].setVisible(sender.name == "Button_" + i);
        }
    },
});