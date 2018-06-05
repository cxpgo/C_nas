var PDKChat = cc.Layer.extend({
    list_usual: null,
    list_expression: null,
    panel_usual: null,
    panel_expression: null,
    editbox_input: null,
    btn_send: null,
    bool_msg: true,
    btn_usual: null,
    btn_expression: null,
    isEmojiLoad: false,
    m_root: null,
    ctor: function () {
        this._super();
        var root = util.LoadUI(GameHallJson.Chat).node;
        this.addChild(root);
        this.panel_usual = ccui.helper.seekWidgetByName(root, "Panel_Usual");
        this.panel_expression = ccui.helper.seekWidgetByName(root, "Panel_Expression");
        this.panel_usual.setVisible(this.bool_msg);
        this.panel_expression.setVisible(!this.bool_msg);
        this.list_usual = ccui.helper.seekWidgetByName(this.panel_usual, "ListView_Usual");
        this.list_usual.addEventListener(this.selectedItemEvent, this);
        this.list_expression = ccui.helper.seekWidgetByName(this.panel_expression, "ListView_Expression");
        this.editbox_input = ccui.helper.seekWidgetByName(root, "TextField_Input");
        if (!cc.sys.isNative) {
            this.editbox_input.setMaxLength(100);
        }
        this.btn_send = ccui.helper.seekWidgetByName(root, "Button_Send");
        this.btn_send.addClickEventListener(this.onSend.bind(this));

        this.btn_usual = ccui.helper.seekWidgetByName(root, "Button_Usual");
        this.btn_expression = ccui.helper.seekWidgetByName(root, "Button_Expression");
        this.btn_usual.addClickEventListener(this.onSwitchUsual.bind(this));
        this.btn_expression.addClickEventListener(this.onSwitchExp.bind(this));
        this.btn_usual.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);

        var close = ccui.helper.seekWidgetByName(root, "Panel");
        close.addClickEventListener(function () {
            this.removeFromParent()
        });

        var JsonUsualItem = GameHallJson.ChatUsualItem;
        var usualRoot = util.LoadUI(JsonUsualItem).node;
        var usual_item = ccui.helper.seekWidgetByName(usualRoot, "Panel");
        usual_item.setTouchEnabled(true);
        this.list_usual.setItemModel(usual_item);
        var sexType = hall.user.userSex;
        if (sexType == undefined || sexType == null || sexType == 2) {
            sexType = 0;
        } else {
            sexType = 1;
        }
        var chat_cfg = hall.getPlayingGame().getChatCfg()[sexType];
        for (var i = 0; i < chat_cfg.length; ++i) {
            this.list_usual.pushBackDefaultItem();
            var item = this.list_usual.getItem(i);
            item.getChildByName("Text_Content").setString(chat_cfg[i]);
        }

        this.m_root = root;
    },

    selectedItemEvent: function (sender, type) {
        switch (type) {
            case ccui.ListView.ON_SELECTED_ITEM_END:
                var _this = this;

                if (hall.enableSendMsg == 1) {
                    hall.enableSendMsg = 0;
                    hall.getPlayingGame().net.chat({
                        'index': sender.getCurSelectedIndex(),
                        'type': CHAT_TYPE.Usual
                    }, function (data) {
                        if (data['code'] == 200) {
                            _this.removeFromParent();
                        } else {

                        }
                    });
                } else {
                    var bar = new QDTipBar();
                    bar.show("您的发言过于频繁，请稍后再试！", 0.8);
                }
                break;
            default:
                break;
        }
    },

    selectExpression: function (sender) {
        var _this = this;
        if (hall.enableSendMsg == 1) {
            hall.enableSendMsg = 0;
            hall.getPlayingGame().net.chat({'index': sender.getTag(), 'type': CHAT_TYPE.Exp}, function (data) {
                if (data['code'] == 200) {
                    _this.removeFromParent();
                } else {

                }
            });
        } else {
            var bar = new QDTipBar();
            bar.show("您的发言过于频繁，请稍后再试！", 0.8);
        }
    },

    onSwitchUsual: function () {
        //setBright
        this.btn_usual.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.btn_expression.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        this.panel_usual.setVisible(true);
        this.panel_expression.setVisible(false);
    },

    onEnter: function () {
        this._super();
        this.editbox_input = util.ChangeTextField2EditBox(ccui.helper.seekWidgetByName(this.m_root, "TextField_Input"));
        this.editbox_input.setTextColor(cc.color(255, 255, 255));
        // this.scheduleOnce(this.loadEmoji, 0.2);
        this.loadEmoji();
    },

    loadEmoji: function (dt) {
        if (!this.isEmojiLoad) {
            //表情
            var expRoot = util.LoadUI(GameHallJson.ChatExpItem).node;
            var exp_item = ccui.helper.seekWidgetByName(expRoot, "Panel");
            this.list_expression.setItemModel(exp_item);
            for (var i = 0; i < 6; ++i) {
                var cell = exp_item.clone();
                for (var j = 0; j < 3; j++) {
                    var emoji = cell.getChildByName('btn_emoji'+j);
                    var index = i * 3 + j + 1;
                    emoji.loadTextureNormal("emoji_" + index + "-obj-1.png", ccui.Widget.PLIST_TEXTURE);
                    emoji.setTag(index);
                    emoji.addClickEventListener(this.selectExpression.bind(this))
                }
                var layout = new ccui.Layout();
                layout.setContentSize(cell.getContentSize());
                layout.addChild(cell);
                this.list_expression.pushBackCustomItem(layout);
            }
            this.isEmojiLoad = true;
        }

    },

    onSwitchExp: function () {

        this.btn_expression.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.btn_usual.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        this.panel_usual.setVisible(false);
        this.panel_expression.setVisible(true);
    },

    onSend: function () {
        var content = this.editbox_input.getString();
        if (content.length > 0) {
            if (hall.enableSendMsg == 1) {
                hall.enableSendMsg = 0;
                if (content.indexOf("##") != -1) {
                    content = content.substring(2);
                    hall.getPlayingGame().net.gmCommand(content);
                    this.removeFromParent();
                    return;
                }

                var _this = this;
                hall.getPlayingGame().net.chat({'content': content, 'type': CHAT_TYPE.Usual}, function (data) {
                    JJLog.print(data);
                    if (data['code'] == 200) {
                        _this.removeFromParent();
                    } else {

                    }
                });
            } else {
                var bar = new QDTipBar();
                bar.show("您的发言过于频繁，请稍后再试！", 0.8);
            }
        }
    },

    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    }

});


