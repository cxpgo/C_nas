var buy_time = [1,3,7,30,0];
var buy_value = {1:1000,3:3000,7:7000,30:30000,0:-1};
var Majhong_exchangeBuyType = cc.Layer.extend({
    alreadyClose:false,
    ctor: function (data,target) {
        this._super();
        var JsonRes = GameHallJson.GameExchangeBuyType;
        var root = ccs.load(JsonRes).node;
        this.addChild(root);

        this.alreadyClose = false;
        this.panel_root =  ccui.helper.seekWidgetByName(root,"panel_root");
        this.ListView_1 =  ccui.helper.seekWidgetByName(root,"ListView_1");
        this.panel_buyItem =  ccui.helper.seekWidgetByName(root,"panel_buyItem");
        this.panel_buyNum =  ccui.helper.seekWidgetByName(root,"panel_buyNum");
        var text_count = ccui.helper.seekWidgetByName(this.panel_buyNum, "text_count");
        var Text_34 = ccui.helper.seekWidgetByName(this.panel_buyNum, "Text_34");
        var buy_count = 1;
        text_count.setString(buy_count);
        var btn_jian = ccui.helper.seekWidgetByName(this.panel_buyNum, "btn_jian");
        btn_jian._text_count = text_count;
        btn_jian.addTouchEventListener(this.jian_cellEvent,this);
        var btn_jia = ccui.helper.seekWidgetByName(this.panel_buyNum, "btn_jia");
        btn_jia._text_count = text_count;
        btn_jia.addTouchEventListener(this.jia_cellEvent,this);
        btn_jian.setVisible(true);
        btn_jia.setVisible(true);

        this.img_bg =  ccui.helper.seekWidgetByName(root,"img_bg");
        this.img_icon =  ccui.helper.seekWidgetByName(root,"img_icon");
        this.text_tianshu =  ccui.helper.seekWidgetByName(root,"text_tianshu");
        this.text_name =  ccui.helper.seekWidgetByName(root,"text_name");
        this.btn_sure =  ccui.helper.seekWidgetByName(root,"btn_sure");
        this.btn_sure.addClickEventListener(function () {
        }.bind(this));
        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        this.text_name.setString(data.goodName);
        this.text_tianshu.setString(data.time + '天');
        this.mCheckAy = new Array();
        for(var i=0;i<5;i++)
        {
            var buyItem_clone = this.panel_buyItem.clone();
            var text_time = ccui.helper.seekWidgetByName(buyItem_clone, "text_time");
            var text_value = ccui.helper.seekWidgetByName(buyItem_clone, "text_value");
            var check_btn = ccui.helper.seekWidgetByName(buyItem_clone, "check_btn");
            buyItem_clone.setTag(i);
            check_btn.setTag(i);
            this.mCheckAy.push(check_btn);
            if(i==0)
            {
                check_btn.setSelected(true);
                check_btn.setTouchEnabled(true);
            }
            else
            {
                check_btn.setSelected(false);
                check_btn.setTouchEnabled(false);
            }
            check_btn.addClickEventListener(this.buyItemFun.bind(this));
            text_time.setString(buy_time[i] == 0 ? '无限期': (buy_time[i] + '天'));
            text_value.setString(buy_time[i] == 0 ? '无限期': buy_value[buy_time[i]]);
            buyItem_clone.addClickEventListener(this.buyItemFun.bind(this));
            this.ListView_1.pushBackCustomItem(buyItem_clone);
        }

        this.loadHead(this.img_icon , Backpack_small[backpackCfg[data.goodId].attrId]);
        this.updateInfoDialog(data,target);
    },

    buyItemFun:function (sender) {
        var Index = sender.getTag();
        this.text_tianshu.setString(buy_time[Index] == 0 ? '无限期': (buy_time[Index] + '天'));
        for(var i=0;i<this.mCheckAy.length;i++)
        {
            if(i == Index)
            {
                this.mCheckAy[i].setSelected(true);
            }
            else
            {
                this.mCheckAy[i].setSelected(false);
            }
        }
    },

    updateInfoDialog:function (data,target)
    {

    },
    jiaupdate_count:function () {
        this.count++;
        this._text_count.setString(this.count);

    },
    jianupdate_count:function () {
        if(this.count > 1)
        {
            this.count--;
            this._text_count.setString(this.count);
        }
    },
    jia_cellEvent:function (sender, type) {
        this.count = sender._text_count.getString();
        this._text_count = sender._text_count;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN: {
                console.log('type:' + type);
                this.schedule(this.jiaupdate_count, 0.6);
                break;
            }
            case ccui.Widget.TOUCH_MOVED: {
                console.log('type:' + type);
            }
                break;
            case ccui.Widget.TOUCH_ENDED: {
                console.log('type:' + type);
                this.count ++;
                this.unschedule(this.jiaupdate_count);
                this._text_count.setString(this.count);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED: {
                console.log('type:' + type);
                this.count ++;
                this.unschedule(this.jiaupdate_count);
                this._text_count.setString(this.count);
            }
                break;
            default:
                break;
        }
    },
    jian_cellEvent:function (sender, type) {
        this.count = sender._text_count.getString();
        this._text_count = sender._text_count;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN: {
                console.log('type:' + type);
                this.schedule(this.jianupdate_count, 0.6);
                break;
            }
            case ccui.Widget.TOUCH_MOVED: {
                console.log('type:' + type);
            }
                break;
            case ccui.Widget.TOUCH_ENDED: {
                console.log('type:' + type);
                if(this.count > 1) {
                    this.count--;
                }
                this.unschedule(this.jianupdate_count);
                this._text_count.setString(this.count);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED: {
                console.log('type:' + type);
                if(this.count > 1) {
                    this.count--;
                }
                this.unschedule(this.jianupdate_count);
                this._text_count.setString(this.count);
            }
                break;
            default:
                break;
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