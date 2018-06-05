var GameExchange = cc.Layer.extend({
    btn_array:null,
    listview_array:null,
    text_jinbi:null,
    panel_jifen:null,
    text_jifen:null,
    panel_jinbi:null,
    type:0,
    exchangeObj:{},
    m_CellObj:{},
    gemList:null,
    goldList:null,
    EffectListIcon:null,
    alreadyClose:false,
    ctor: function (listData) {
        this._super();
        var root = ccs.load(GameHallJson.Exchange).node;
        this.addChild(root);
        this.alreadyClose = false;

        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        this.panel_jinbi = ccui.helper.seekWidgetByName(root, "panel_jinbi");
        this.text_jinbi = ccui.helper.seekWidgetByName(this.panel_jinbi, "text_fangka");
        this.text_jinbi.setString(util.convertScore(hall.user.goldNum));
        this.panel_jifen = ccui.helper.seekWidgetByName(root, "panel_jifen");
        this.text_jifen = ccui.helper.seekWidgetByName(this.panel_jifen, "text_fangka");
        this.text_jifen.setString(util.convertScore(hall.user.scoreNum));
        this.panel_item = ccui.helper.seekWidgetByName(root, "panel_item");
        this.panel_item.setVisible(false);
        var Text_8 = ccui.helper.seekWidgetByName(root, "Text_8");
        Text_8.setVisible(false);
        var btn_exchange = ccui.helper.seekWidgetByName(root, "btn_exchange");
        btn_exchange.addClickEventListener(function () {
            hall.net.orderList(0,100,function (data) {
                console.log("兑换记录:" + JSON.stringify(data));
                if(data.code == 200)
                {
                    var a = new GameExchangeConversion(data.data);
                    a.showPanel();
                }
                else
                {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data.msg || data.error || data.err);
                    dialog.showDialog();
                }
            });
        }.bind(this));

        this.btn_array = new Array();
        this.listview_array = new Array();
        this.gemList = new Array();
        this.goldList = new Array();
        this.EffectListIcon = new Array();

        this.shop_goodlist = listData;
        for(var idx =0;idx<listData.data.length;idx++)
        {
            var type = listData.data[idx].type;
            var id = listData.data[idx].id;
            // if(type == 1)
            // {
            //     this.goldList.push(listData.data[idx]);
            // }
            if(type == 2)
            {
                this.gemList.push(listData.data[idx]);
            }
        }
        // this.exchangeObj[0] = this.goldList;
        this.exchangeObj[0] = this.gemList;
        CTimeMgr.Instance.ResetTime(util.CreateDate(listData.time)/1000);

        for (var i = 0; i < 1; i++) {
            var btn = ccui.helper.seekWidgetByName(root, "btn_" + i);
            btn.addClickEventListener(this.onSwitchItem.bind(this));
            var listview = ccui.helper.seekWidgetByName(root, "listview_item_" + i);
            this.btn_array.push(btn);
            this.listview_array.push(listview);
            this.EffectListIcon[i] =  new Array();
        }
        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        btn_close.addTouchEventListener(util.btnTouchEvent);
        this.onSwitchItem.bind(this, this.btn_array[0])();
        this.schedule(this.updateTime, 1);
        // this.schedule(this.showEffect,2);
        this.UpdateExchangeList(this.exchangeObj[0],0);
        // this.UpdateExchangeList(this.exchangeObj[1],1);
    },
    updateTime: function (dt) {
       if(this.type == null || this.type == undefined) return;
       var items = this.listview_array[this.type].getItems();
       for(var i=0;i<items.length;i++)
       {
           for(var j=0;j<2;j++)
           {
               if(j==0)
               {
                   if(items[i].start_time1 == null || items[i].start_time1 == undefined || items[i].end_time1 == null || items[i].end_time1 == undefined) continue;
                   var startTime = new Date(items[i].start_time1).getTime()/1000;
                   var endTime = new Date(items[i].end_time1).getTime()/1000;
                   var localTime = CTimeMgr.Instance.m_pServerTime;
                   if(endTime>localTime && localTime>startTime)
                   {
                       items[i].text_time1.setVisible(true);
                       if(endTime - localTime <= 86400)
                       {
                           items[i].text_time1.setString('限时折扣:'+util.numberToHM(endTime - localTime));
                       }
                       items[i]._text_score1.setString(ExchangeType[items[i]._info1.type] +':'+ util.convertScore( items[i]._info1.scoreNum * items[i]._info1.discount/100));
                   }
                   else
                   {
                       items[i]._img_discount1.setVisible(false);
                       items[i].text_time1.setVisible(false);
                       items[i]._text_score1.setString(ExchangeType[items[i]._info1.type] +':'+ util.convertScore( items[i]._info1.scoreNum));
                   }
               }
               else if(j==1)
               {
                   if(items[i].start_time2 == null || items[i].start_time2 == undefined || items[i].end_time2 == null || items[i].end_time2 == undefined) continue;
                   var startTime = new Date(items[i].start_time2).getTime()/1000;
                   var endTime = new Date(items[i].end_time2).getTime()/1000;
                   var localTime = CTimeMgr.Instance.m_pServerTime;
                   if(endTime>localTime && localTime>startTime)
                   {
                       items[i].text_time2.setVisible(true);
                       if(endTime - localTime <= 86400)
                       {
                           items[i].text_time2.setString('限时折扣:'+util.numberToHM(endTime - localTime));
                       }
                       items[i]._text_score2.setString(ExchangeType[items[i]._info2.type] +':'+ util.convertScore( items[i]._info2.scoreNum * items[i]._info2.discount/100));
                   }
                   else
                   {
                       items[i]._img_discount2.setVisible(false);
                       items[i].text_time2.setVisible(false);
                       items[i]._text_score2.setString(ExchangeType[items[i]._info2.type] +':'+ util.convertScore( items[i]._info2.scoreNum));
                   }
               }
           }
       }
    },
    showPanel: function () {
        if(this.panel_root)
        {
            this.panel_root.setScale(0.3)
            this.panel_root.runAction(cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1, 1)))
        }
        cc.director.getRunningScene().addChild(this);
    },

    onSwitchItem: function (sender) {
        for (var i = 0; i < this.btn_array.length; i++) {
            var btn = this.btn_array[i];
            btn.setBright(btn.name != sender.name);
            btn.setTouchEnabled(btn.name != sender.name);
            this.listview_array[i].setVisible(btn.name == sender.name);
            if (btn.name == sender.name){
                this.type = i;
                // this.panel_jifen.setVisible(i == 0);
                // this.panel_jinbi.setVisible(i == 1);
                this.panel_jinbi.setVisible(i == 0);
            }
        }
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'hallUpdatePlayerAttr');
    },

    onUpdatePlayerAttr: function (data) {
        JJLog.print('hall onUpdatePlayerAttr:' + JSON.stringify(data));
        if (data['goldNum'] != null || data['goldNum'] != undefined) {
            this.text_jinbi.setString(util.convertScore(data['goldNum']));
        }
        if(data['scoreNum'] != null || data['scoreNum'] != undefined)
        {
            this.text_jifen.setString(util.convertScore(data['scoreNum']));
        }
    },

    UpdateExchangeList:function(data,Btn_Idx) {
        this.listview_array[Btn_Idx].removeAllChildren();
        var count = Math.ceil(data.length/2);
        var idx = 0;
        for(var k=0;k< count;k++)
        {
            var layout = new ccui.Layout();
            var cell = this.panel_item.clone();
            for(var j=0;j<2;j++)
            {
                var item = ccui.helper.seekWidgetByName(cell, "Image_bg"+j);
                var info = data[idx];
                if(info)
                {
                    item.setVisible(true);
                    this.m_CellObj[info.id] = item;
                    var img_1 = ccui.helper.seekWidgetByName(item, "img_1");
                    var img_2 = ccui.helper.seekWidgetByName(item, "img_2");
                    var img_3 = ccui.helper.seekWidgetByName(item, "img_3");
                    var text_name = ccui.helper.seekWidgetByName(item, "text_name");
                    text_name.setColor(cc.color(255,255,255));
                    text_name.enableOutline(cc.color(117,55,0),2);
                    var text_time = ccui.helper.seekWidgetByName(item, "text_time");
                    var text_score = ccui.helper.seekWidgetByName(item, "text_score");
                    var text_num = ccui.helper.seekWidgetByName(item, "text_num");
                    var text_count = ccui.helper.seekWidgetByName(item, "text_count");
                    var head_bg = ccui.helper.seekWidgetByName(item, "head_bg");
                    head_bg.setVisible(false);
                    var img_icon = ccui.helper.seekWidgetByName(item, "img_icon");
                    this.EffectListIcon[Btn_Idx].push(img_icon);
                    var img_discount = ccui.helper.seekWidgetByName(item, "img_discount");
                    var img_stockout = ccui.helper.seekWidgetByName(item, "img_stockout");
                    var panel_cover = ccui.helper.seekWidgetByName(item, "panel_cover");
                    var Text_34 = ccui.helper.seekWidgetByName(item, "Text_34");
                    var buy_count = 1;
                    text_count.setString(buy_count);
                    var btn_jian = ccui.helper.seekWidgetByName(item, "btn_jian");
                    btn_jian._text_count = text_count;
                    btn_jian.addTouchEventListener(this.jian_cellEvent,this);
                    var btn_jia = ccui.helper.seekWidgetByName(item, "btn_jia");
                    btn_jia._text_count = text_count;
                    btn_jia.addTouchEventListener(this.jia_cellEvent,this);
                    btn_jian.setVisible(true);
                    btn_jia.setVisible(true);
                    var StartTime = new Date(info.activeStartTime).getTime()/1000;
                    var disTime = new Date(info.activeEndTime).getTime()/1000;
                    var localTime = CTimeMgr.Instance.m_pServerTime;
                    if(disTime>localTime && localTime > StartTime)
                    {
                        text_time.setVisible(true);
                        if(disTime - localTime >= 86400)
                        {
                            text_time.setString("剩余:" + Math.floor((disTime - localTime)/86400) + '天');
                        }
                        else
                        {
                            text_time.setString('限时折扣:'+util.numberToHM(disTime - localTime));
                        }
                        var icon_dis = 'res/GameHall/Resoures/exchange/img_discount' + parseInt(info.discount/10) + '.png';
                        img_discount.loadTexture(icon_dis,ccui.Widget.LOCAL_TEXTURE);
                        img_discount.setVisible(true);
                        text_score.setString(ExchangeType[info.type] +':'+ util.convertScore( info.scoreNum * info.discount/100));
                    }
                    else
                    {
                        text_time.setVisible(false);
                        img_discount.setVisible(false);
                        img_3.setVisible(false);
                        text_score.setString(ExchangeType[info.type] +':'+ util.convertScore( info.scoreNum));
                    }
                    if(info.time == 0)
                    {
                        text_num.setString('永久');
                    }
                    else
                    {
                        text_num.setString(info.time + '天');
                    }
                    text_name.setString(info.goodName);
                    if(info['goodType'] == 'gem' || info['goodType'] == 'score' || info['goodType'] == 'gold')
                    {
                        this.loadHead(img_icon , Item_cfg[info['goodType']]);
                        img_3.setVisible(true);
                        img_2.setVisible(false);
                    }
                    else if(info['goodType'] == 'head' || info['goodType'] == 'back')
                    {
                        img_3.setVisible(false);
                        img_2.setVisible(true);
                        if(info['goodType'] == 'head')
                        {
                            head_bg.setVisible(true);
                        }
                        if(backpackCfg.hasOwnProperty(info.goodId))
                            this.loadHead(img_icon , Backpack_small[backpackCfg[info.goodId].attrId]);
                    }
                    else
                    {
                        img_3.setVisible(false);
                        img_2.setVisible(true);
                        img_stockout.setVisible(info.store <= 0);
                        panel_cover.setVisible(info.store <= 0);
                        text_num.setString('库存:'+info.store);
                        this.loadHead(img_icon , info.picUrl);
                    }
                    if(j == 0)
                    {
                        layout.text_time1 = text_time;
                        layout._img_discount1 = img_discount;
                        layout._text_score1 = text_score;
                        layout._info1 = info;
                        layout.start_time1 = info.activeStartTime;
                        layout.end_time1 = info.activeEndTime;
                    }
                    else if(j == 1)
                    {
                        layout.text_time2 = text_time;
                        layout._img_discount2 = img_discount;
                        layout._text_score2 = text_score;
                        layout._info2 = info;
                        layout.start_time2 = info.activeStartTime;
                        layout.end_time2 = info.activeEndTime;
                    }
                    var btn_des = ccui.helper.seekWidgetByName(item, "btn_des");
                    btn_des.setTag(info.id);
                    btn_des.itemInfo = info;
                    btn_des.addClickEventListener(function (sender) {
                        var tag = sender.getTag();
                        var a = new GameItemDialog(sender.itemInfo,1);
                        a.showPanel();
                    }.bind(this));
                    var img_yiyongyou = ccui.helper.seekWidgetByName(item, "img_yiyongyou");
                    img_yiyongyou.setVisible(false);
                    var btn_item_exchange = ccui.helper.seekWidgetByName(item, "btn_item_exchange");
                    btn_item_exchange.setTag(info.id);
                    btn_item_exchange.itemInfo = info;
                    btn_item_exchange._text_count = text_count;
                    btn_item_exchange.addClickEventListener(function (sender) {
                        var tag = sender.getTag();
                        var buy_count = sender._text_count.getString();
                        var StartTime = new Date(sender.itemInfo.activeStartTime).getTime()/1000;
                        var EndTime = new Date(sender.itemInfo.activeEndTime).getTime()/1000;
                        var localTime = CTimeMgr.Instance.m_pServerTime;
                        if(EndTime>localTime && localTime > StartTime)
                        {
                            var dis_count = sender.itemInfo.discount;
                        }
                        else
                        {
                            var dis_count = 100;
                        }
                        var self = this;
                        var str = '';
                        str = '是否花费'+ sender.itemInfo.scoreNum*dis_count/100 * buy_count + ExchangeType[sender.itemInfo.type] +'兑换'+ sender.itemInfo.goodName + 'x' + buy_count;
                        var dialog = new JJMajhongDecideDialog();
                        dialog.setDes(str);
                        dialog.setCallback(function()
                        {
                            var event = new cc.EventCustom(CommonEventAction.ADDORDER);
                            event.setUserData(sender);
                            cc.eventManager.dispatchEvent(event);
                        });
                        dialog.showDialog();
                        console.log('兑换界面：' + JSON.stringify(sender.itemInfo) + "按钮：" + tag);
                    }.bind(this));

                    for(var key in GameBagEquipMgr.Instance.MyBagDataObj)
                    {
                        var key_id = key.substring(0,5);
                        if(key_id == info.attrId && GameBagEquipMgr.Instance.MyBagDataObj[key]['validTime'] == 0 && (info['goodType'] == 'head' || info['goodType'] == 'back'))
                        {
                            btn_item_exchange.setVisible(false);
                            img_yiyongyou.setVisible(true);
                        }
                    }
                    if(!img_3.isVisible())
                    {
                        img_1.y = 185;
                        img_2.y = 125;
                    }
                    else if(!img_2.isVisible())
                    {
                        img_1.y = 185;
                        img_3.y = 125;
                    }
                }
                else
                {
                    item.setVisible(false);
                }
                idx++;
            }
            layout.setContentSize(cell.getContentSize());
            cell.x = 0;
            cell.y = 0;
            cell.setVisible(true);
            layout.addChild(cell);

            this.listview_array[Btn_Idx].pushBackCustomItem(layout);
        }
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
                this.schedule(this.jiaupdate_count, 0.6);
                break;
            }
            case ccui.Widget.TOUCH_MOVED: {

            }
                break;
            case ccui.Widget.TOUCH_ENDED: {
                this.count ++;
                this.unschedule(this.jiaupdate_count);
                this._text_count.setString(this.count);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED: {
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
                this.schedule(this.jianupdate_count, 0.6);
                break;
            }
            case ccui.Widget.TOUCH_MOVED: {
            }
                break;
            case ccui.Widget.TOUCH_ENDED: {
                if(this.count > 1) {
                    this.count--;
                }
                this.unschedule(this.jianupdate_count);
                this._text_count.setString(this.count);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED: {
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

    add_order:function (event) {
        var temp = event.getUserData();
        var info = temp.itemInfo;
        var text_count = parseInt(temp._text_count.getString());
        var goodid = info.id;
        var state = false;
        for(var key in GameBagEquipMgr.Instance.MyBagDataObj)
        {
            var key_id = key.substring(0,5);
            if(key_id == info.attrId && GameBagEquipMgr.Instance.MyBagDataObj[key]['validTime'] != 0 && (info['goodType'] == 'head' || info['goodType'] == 'back'))
            {
                state = true;
            }
        }
        if(text_count<1)
            text_count = 1;
        hall.net.add_order(goodid,text_count,function (data) {
            console.log("goodlist:" + JSON.stringify(data));
            if(data.code == 200)
            {
                var cell = this.m_CellObj[goodid];
                // var text_num = ccui.helper.seekWidgetByName(cell, "text_num");
                // text_num.setString('库存:' + (info.store-1) > 0 ? (info.store-1) : info.store);
                if(state)
                {
                    var bar = new QDTipBar();
                    bar.show("相同道具时效延长", 1);
                }
                var a = new GameExchangeDialog(info,data.data,this);
                a.showPanel();

                // var start = {x:616,y:340};
                // var end = {x:710,y:40};
                // util.showReceiveExchange(start,end,Backpack_small[info.attrId]);

                // hall.net.goodlist(0,100,function (data) {
                //     if(data.code == 200)
                //     {
                //         this.gemList = new Array();
                //         this.goldList = new Array();
                //         this.shop_goodlist = data;
                //         for(var idx =0;idx<data.data.length;idx++)
                //         {
                //             var type = data.data[idx].type;
                //             var id = data.data[idx].id;
                //             // if(type == 1)
                //             // {
                //             //     this.goldList.push(data.data[idx]);
                //             // }
                //             if(type == 2)
                //             {
                //                 this.gemList.push(data.data[idx]);
                //             }
                //         }
                //         // this.exchangeObj[0] = this.goldList;
                //         this.exchangeObj[0] = this.gemList;
                //         // this.UpdateExchangeList(this.exchangeObj[0],0);
                //         // this.UpdateExchangeList(this.exchangeObj[1],1);
                //     }
                //     else
                //     {
                //         var dialog = new JJConfirmDialog();
                //         dialog.setDes(data.msg || data.error || data.err);
                //         dialog.showDialog();
                //     }
                // }.bind(this));
            }
            else if(data.code == 504 || data.code == 505)
            {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data.msg || data.error || data.err);
                dialog.showDialog();
                // hall.net.goodlist(0,100,function (data) {
                //     if(data.code == 200)
                //     {
                //         this.gemList = new Array();
                //         this.goldList = new Array();
                //         this.shop_goodlist = data;
                //         for(var idx =0;idx<data.data.length;idx++)
                //         {
                //             var type = data.data[idx].type;
                //             var id = data.data[idx].id;
                //             if(type == 1)
                //             {
                //                 this.goldList.push(data.data[idx]);
                //             }
                //             else if(type == 2)
                //             {
                //                 this.gemList.push(data.data[idx]);
                //             }
                //         }
                //         this.exchangeObj[0] = this.goldList;
                //         this.exchangeObj[1] = this.gemList;
                //         this.UpdateExchangeList(this.exchangeObj[0],0);
                //         this.UpdateExchangeList(this.exchangeObj[1],1);
                //     }
                //     else
                //     {
                //         var dialog = new JJConfirmDialog();
                //         dialog.setDes(data.msg || data.error || data.err);
                //         dialog.showDialog();
                //     }
                // }.bind(this));
            }else if (data.code == CodeCommon.NO_GOLD.CODE) {
                var dialog = new JJMajhongDecideDialog();
                dialog.setDes(CodeCommon.NO_GOLD.ERROR);
                dialog.setCallback(function () {
                    util.showLessGoldDialog();
                });
                dialog.showDialog();
            }
            else
            {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data.msg || data.error || data.err);
                dialog.showDialog();
            }
        }.bind(this));},
    showEffect:function() {
        var btn = this.btn_array[0];
        var listViewIndex = btn.isTouchEnabled()? 1:0;
        var curListIcon = null;
        curListIcon = this.EffectListIcon[listViewIndex];
        var length = curListIcon.length-1;
        var index = 0;//Math.round(Math.random()*length);

        var icon = curListIcon[index];

        var randomPos =  Math.round(Math.random()*15);
        var aniNode = util.playTimeLineAnimation("res/Animation/effect/ef_zuanshishangguang.json",true);
        aniNode.setPosition(cc.p(icon.getContentSize().width/2.0+randomPos,icon.getContentSize().height/2.0+randomPos));
        aniNode.runAction(cc.sequence(cc.delayTime(1.3),cc.removeSelf()));

        var randomPos1 =  Math.round(Math.random()*-15);
        var aniNode1 = util.playTimeLineAnimation("res/Animation/effect/ef_zuanshishangguang.json",true);
        aniNode1.setPosition(cc.p(icon.getContentSize().width/2.0+randomPos1,icon.getContentSize().height/2.0+randomPos1));
        aniNode1.runAction(cc.sequence(cc.delayTime(1.8),cc.removeSelf()));

        icon.addChild(aniNode,100);
        icon.addChild(aniNode1,100);
    },
    onEnter:function () {
        this._super();
        var ls = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEventAction.ADDORDER,
            callback: this.add_order.bind(this)
        });
        cc.eventManager.addListener(ls, this);
        this.registerAllEvents();
    },
    onExit:function () {
        this._super();
        this.alreadyClose = true;
        this.removeAllEvents();
        // this.unschedule(this.showEffect);
    },
});




