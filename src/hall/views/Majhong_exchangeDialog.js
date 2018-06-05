var GameExchangeDialog = cc.Layer.extend({
    alreadyClose:false,
    ctor: function (info,data,target) {
        this._super();
        var JsonRes = GameHallJson.ExchangeDialog;
        var root = ccs.load(JsonRes).node;
        this.addChild(root);
        this.alreadyClose = false;
        this.panel_root =  ccui.helper.seekWidgetByName(root,"panel_root");
        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        this.btn_copy = ccui.helper.seekWidgetByName(root,"btn_copy");
        this.btn_copy.addClickEventListener(this.onCopyLabel.bind(this));
        this.updateInfoDialog(info,data,target);
    },
    onCopyLabel: function (sender) {
        var weChatId = null;
        switch (sender) {
            case this.btn_copy:
                weChatId = this.text_des_2.getString();
                break;
            default:
                break;
        }
        util.copyLabel(weChatId);
        var bar = new QDTipBar()
        bar.show("复制成功！",1);
    },
    updateInfoDialog:function (info,data,target) {
        var img_icon =  ccui.helper.seekWidgetByName(this.panel_root,"img_icon");
        var img_bg =  ccui.helper.seekWidgetByName(this.panel_root,"img_bg");
        img_bg.setVisible(false);
        var text_count = ccui.helper.seekWidgetByName(this.panel_root,"text_count");
        var text_des_1 = ccui.helper.seekWidgetByName(this.panel_root,"text_des_1");
        if(info['goodType'] == 'head' || info['goodType'] == 'back')
        {
            if(info['goodType'] == 'head')
            {
                img_bg.setVisible(true);
            }
            text_des_1.x = 616;
            img_icon.x = 616;
            img_icon.y = 340;
            img_bg.x = 616;
            img_bg.y = 340;
            text_count.x = 680;
            this.loadHead(img_icon , Backpack_small[backpackCfg[info.goodId].attrId]);
        }
        else if(info['goodType'] == 'gem' || info['goodType'] == 'score' || info['goodType'] == 'gold')
        {
            text_des_1.x = 616;
            img_icon.x = 616;
            img_icon.y = 340;
            text_count.x = 680;
            this.loadHead(img_icon , Item_cfg[info['goodType']]);
        }
        else
        {
            this.loadHead(img_icon , info.picUrl);
        }
        this.text_des_2 = ccui.helper.seekWidgetByName(this.panel_root,"text_des_2");
        var text_des_3 = ccui.helper.seekWidgetByName(this.panel_root,"text_des_3");
        var Text_1 = ccui.helper.seekWidgetByName(this.panel_root,"Text_1");
        var img_lianxi = ccui.helper.seekWidgetByName(this.panel_root,"img_lianxi");
        var btn_sure = ccui.helper.seekWidgetByName(this.panel_root,"btn_sure");
        btn_sure.addClickEventListener(function()
        {
            this.removeFromParent();
        }.bind(this));
        var btn_use = ccui.helper.seekWidgetByName(this.panel_root,"btn_use");
        btn_use.addClickEventListener(function()
        {
            target.removeFromParent();
            this.removeFromParent();
            var c = new Majhong_Backpack();
            c.showPanel();
        }.bind(this));
        text_des_1.setString('恭喜您成功兑换'+ info.goodName);
        if(info['goodType'] == 'head' || info['goodType'] == 'back' || info['goodType'] == 'gem' || info['goodType'] == 'score' || info['goodType'] == 'gold')
        {
            this.text_des_2.setVisible(false);
            text_des_3.setVisible(false);
            Text_1.setVisible(false);
            btn_sure.setVisible(true);
            btn_use.setVisible(true);
            img_lianxi.setVisible(false);
            this.btn_copy.setVisible(false);
        }
        else
        {
            this.text_des_2.setVisible(true);
            text_des_3.setVisible(true);
            this.text_des_2.setString(data.goodCode);
            img_lianxi.setVisible(true);
            btn_sure.setVisible(false);
            btn_use.setVisible(false);
            this.btn_copy.setVisible(true);
        }
        text_count.setString('x' + data.goodnum);
    },
    loadHead: function (sprite_head,url) {
        sprite_head.removeAllChildren();
        if (url != undefined && url.length > 0) {
            cc.loader.loadImg(url, { isCrossOrigin: true },
                function (err, tex) {
                    JJLog.print(err, tex);
                    if (err == null && this.alreadyClose == false) {
                        var size = sprite_head.getContentSize();
                        var sprite = new cc.Sprite(tex);
                        var size_sp = sprite.getContentSize();
                        sprite.setScaleX(size.width / size_sp.width);
                        sprite.setScaleY(size.height / size_sp.height);
                        sprite.setAnchorPoint(cc.p(0, 0));
                        sprite_head.addChild(sprite);
                    }
                }.bind(this));
        }
    },
    onEnter:function () {
        this._super();
    },
    onExit:function () {
        this._super();
        this.alreadyClose = true;
    },
    showPanel:function()
    {
        cc.director.getRunningScene().addChild(this);
    }
});