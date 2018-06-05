var AddFKDialog = JJDialog.extend({
    btn_kfWechat: null,
    btn_dlWechat: null,
    btn_tsWechat: null,

    weChat01: null,
    weChat02: null,
    weChat03: null,

    ctor: function () {

        this._super();
        var root = util.LoadUI(GameHallJson.AddFK).node;
        this.addChild(root);
        var panel = ccui.helper.seekWidgetByName(root, "panel");
        var panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        panel.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        this.panel = panel_root;

        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));
        btn_close.addTouchEventListener(util.btnTouchEvent);


        panel_root.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        var text_tip0 = ccui.helper.seekWidgetByName(root, "text_tip0");
        var text_tip1 = ccui.helper.seekWidgetByName(root, "text_tip1");
        var text_tip2 = ccui.helper.seekWidgetByName(root, "text_tip2");

        this.btn_kfWechat = ccui.helper.seekWidgetByName(root, "copy_Button_1");
        this.btn_kfWechat.addTouchEventListener(util.btnTouchEvent);
        this.btn_kfWechat.addClickEventListener(this.onCopyLabel.bind(this));
        this.btn_dlWechat = ccui.helper.seekWidgetByName(root, "copy_Button_2");
        this.btn_dlWechat.addTouchEventListener(util.btnTouchEvent);
        this.btn_dlWechat.addClickEventListener(this.onCopyLabel.bind(this));
        this.btn_tsWechat = ccui.helper.seekWidgetByName(root, "copy_Button_3");
        this.btn_tsWechat.addClickEventListener(this.onCopyLabel.bind(this));
        this.btn_tsWechat.addTouchEventListener(util.btnTouchEvent);

        this.weChat01 = ccui.helper.seekWidgetByName(root, "wechat01");
        this.weChat02 = ccui.helper.seekWidgetByName(root, "wechat02");
        this.weChat03 = ccui.helper.seekWidgetByName(root, "wechat03");

        this.updateWechat();

        if(hall.songshen == 1){
            util.NodesForeverVibleForParent(root , "content" , false);
            util.NodesForeverVibleForParent(root , "content_songshen" , true);
        }
    },

    updateWechat: function () {
        for (var i in hall.agentWeChat) {
            if (hall.agentWeChat[i].key == "kfWeChat") {
                this.weChat01.setString(hall.agentWeChat[i].value)
            } else if (hall.agentWeChat[i].key == "dlWeChat") {
                this.weChat02.setString(hall.agentWeChat[i].value)
            }
            else if (hall.agentWeChat[i].key == "tsWeChat") {
                this.weChat03.setString(hall.agentWeChat[i].value)
            }
        }

        if (hall.PACKAGEFROM == "360" || hall.PACKAGEFROM == "bd") {
            this.weChat01.setString("QQ:949480248");
            this.weChat02.setString("QQ:949480248");
            this.weChat03.setString("QQ:949480248");
        }
    },

    onCopyLabel: function (sender) {
        var weChatId = null;
        switch (sender) {
            case this.btn_kfWechat:
                weChatId = this.weChat01.getString();
                break;
            case this.btn_dlWechat:
                weChatId = this.weChat02.getString();
                break;
            case this.btn_tsWechat:
                weChatId = this.weChat02.getString();
                break;
            default:
                break;
        }
        util.copyLabel(weChatId);
        var bar = new QDTipBar()
        bar.show("复制成功！", 0.8);
    },
});