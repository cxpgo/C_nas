var GameItemDialog = cc.Layer.extend({
    alreadyClose:false,
    ctor: function (data,type) {
        this._super();
        var JsonRes = GameHallJson.GameItemDialog;
        var root = ccs.load(JsonRes).node;
        this.addChild(root);
        this.alreadyClose = false;
        this.panel_root =  ccui.helper.seekWidgetByName(root,"panel_root");
        var panel_cover = ccui.helper.seekWidgetByName(root, "panel_cover");
        panel_cover.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        this.updateInfoDialog(data,type);
    },
    updateInfoDialog:function (data,type) {
        var img_icon =  ccui.helper.seekWidgetByName(this.panel_root,"img_icon");
        var img_bg =  ccui.helper.seekWidgetByName(this.panel_root,"img_bg");
        img_bg.setVisible(false);
        var text_des_1 = ccui.helper.seekWidgetByName(this.panel_root,"text_des_1");
        var text_des_2 = ccui.helper.seekWidgetByName(this.panel_root,"text_des_2");
        var text_name = ccui.helper.seekWidgetByName(this.panel_root,"text_name");
        var text_count = ccui.helper.seekWidgetByName(this.panel_root,"text_count");
        if(type == 1)
        {
            text_count.setVisible(false);
            if(data['goodType'] == 'head' || data['goodType'] == 'back')
            {
                if(data['goodType'] == 'head')
                {
                    img_bg.setVisible(true);
                }
                this.loadHead(img_icon , Backpack_small[backpackCfg[data.goodId].attrId]);
            }
            else if(data['goodType'] == 'gem' || data['goodType'] == 'score' || data['goodType'] == 'gold')
            {
                this.loadHead(img_icon , Item_cfg[data['goodType']]);
            }
            else
            {
                this.loadHead(img_icon , data.picUrl);
            }
            text_name.setString(data.goodName);
            text_des_1.setString('商品描述:'+data.goodText);
            var StartTime = new Date(data.activeStartTime).getTime()/1000;
            var disTime = new Date(data.activeEndTime).getTime()/1000;
            var localTime = CTimeMgr.Instance.m_pServerTime;
            if(disTime>localTime && localTime>StartTime)
            {
                text_des_2.setString('兑换'+ExchangeType[data.type]+':'+data.scoreNum*data.discount/100 +ExchangeType[data.type]);
            }
            else
            {
                text_des_2.setString('兑换'+ExchangeType[data.type]+':'+ data.scoreNum +ExchangeType[data.type]);
            }
        }
        else if(type == 2)
        {
            if(data.type == 'head' || data.type == 'back')
            {
                if(data['type'] == 'head')
                {
                    img_bg.setVisible(true);
                }
                text_des_2.setVisible(true);
                text_count.setVisible(false);
                if(data['validTime'] == 0)
                {
                    text_des_2.setString('永久');
                }
                else
                {
                    text_des_2.setString('有效期:'+data.remainTime+'天');
                }
                this.loadHead(img_icon , Backpack_small[backpackCfg[data.id].attrId]);
            }
            else if(data['type'] == 'gem' || data['type'] == 'score' || data['type'] == 'gold')
            {
                text_des_2.setVisible(false);
                text_count.setVisible(true);
                text_count.setString('x' + data.count);
                this.loadHead(img_icon , Item_cfg[data['type']]);
            }
            text_name.setString(data.name);
            text_des_1.setString('描述：'+data.desc);
        }
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