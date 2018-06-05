var Majhong_Backpack = cc.Layer.extend({
    olditem_Btn:null,
    alreadyClose:false,
    allItem:{},
    daojuItem:{},
    zhuangshiItem:{},
    ctor: function () {
        this._super();
        var root = ccs.load(GameHallJson.GameBackpack).node;
        this.addChild(root);
        this.alreadyClose = false;
        this.mPanelRoot = root;
        this.panel = ccui.helper.seekWidgetByName(root, "panel_root");
        this.list_btns = ccui.helper.seekWidgetByName(root, "list_btns");
        this.list_btns.setTouchEnabled(false);
        this.mRankCellClone = ccui.helper.seekWidgetByName(root, "panel_item");
        this.mRankCellClone.setVisible(false);
        this.btn_array = new Array();
        this.listview_array = new Array();
        // this.daoju_array = new Array();
        this.zhuangshi_array = new Array();
        this.allItem = {};
        this.daojuItem = {};
        this.zhuangshiItem = {};
        this.initView();
    },
    initView: function () {
        for (var i = 0; i < 2; i++) {
            var btn = ccui.helper.seekWidgetByName(this.mPanelRoot, "btn_" + i);
            btn.addClickEventListener(this.onSwitchItem.bind(this));
            var listview = ccui.helper.seekWidgetByName(this.mPanelRoot, "listview_item_" + i);
            this.btn_array.push(btn);
            this.listview_array.push(listview);
        }
        var btn_close = ccui.helper.seekWidgetByName(this.mPanelRoot, "btn_close");
        btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        btn_close.addTouchEventListener(util.btnTouchEvent);
        this.onSwitchItem.bind(this, this.btn_array[0])();

        for(var i=0;i<GameBagEquipMgr.Instance.MyBagDataAy.length;i++)
        {
            if(GameBagEquipMgr.Instance.MyBagDataAy[i]['type'] == 'head' || GameBagEquipMgr.Instance.MyBagDataAy[i]['type'] == 'back')
            {
                this.zhuangshi_array.push(GameBagEquipMgr.Instance.MyBagDataAy[i]);
            }
            // else
            // {
            //     this.daoju_array.push(hall.MyBagDataAy[i]);
            // }
        }
        this.UpdateBackpackList(GameBagEquipMgr.Instance.MyBagDataAy,0,this.allItem);
        // this.UpdateBackpackList(this.daoju_array,1,this.daojuItem);
        this.UpdateBackpackList(this.zhuangshi_array,1,this.zhuangshiItem);
    },
    UpdateBackpackList:function (data,type,itemList) {
        this.listview_array[type].removeAllChildren();
        var count = Math.ceil(data.length/4);
        var idx = 0;
        for(var i=0;i<count;i++)
        {
            var cellView = this.mRankCellClone.clone();
            for(var j=0;j<4;j++)
            {
                var CKBox_cell = ccui.helper.seekWidgetByName(cellView, "panel_cell"+j);
                var info = data[idx];
                if(info && util.getBackpackData()[info['id']])
                {
                    itemList[info.id] = CKBox_cell;
                    CKBox_cell.setVisible(true);
                    CKBox_cell.setTouchEnabled(true);
                    var panel_cover = ccui.helper.seekWidgetByName(CKBox_cell, "panel_cover");
                    var node_cell = ccui.helper.seekWidgetByName(CKBox_cell, "node_cell");
                    CKBox_cell._cover = panel_cover;
                    CKBox_cell._info = info;
                    CKBox_cell.addClickEventListener(this.CKBox_cellEvent.bind(this));
                    var text_name = ccui.helper.seekWidgetByName(CKBox_cell, "text_name");
                    var image_use = ccui.helper.seekWidgetByName(CKBox_cell, "image_use");
                    var img_icon = ccui.helper.seekWidgetByName(CKBox_cell, "img_icon");
                    var text_time = ccui.helper.seekWidgetByName(CKBox_cell, "text_time");
                    var text_num = ccui.helper.seekWidgetByName(CKBox_cell, "text_num");
                    text_time.setColor(cc.color(255,246,135));
                    text_time.enableOutline(cc.color(119,58,0),2);
                    text_num.setColor(cc.color(255,246,135));
                    text_num.enableOutline(cc.color(119,58,0),2);
                    var img_bg = ccui.helper.seekWidgetByName(CKBox_cell, "img_bg");
                    img_bg.setVisible(false);
                    var btn_use = ccui.helper.seekWidgetByName(CKBox_cell, "btn_use");
                    btn_use._Id = info.id;
                    btn_use._info = info;
                    btn_use.addClickEventListener(this.onUseEvent.bind(this));
                    CKBox_cell._btn_use = btn_use;
                    CKBox_cell._image_use = image_use;
                    if(GameBagEquipMgr.Instance.MyUseItemData['head'] == info.id || GameBagEquipMgr.Instance.MyUseItemData['back'] == info.id)
                    {
                        btn_use.setVisible(false);
                        image_use.setVisible(true);
                    }
                    else
                    {
                        btn_use.setVisible(true);
                        image_use.setVisible(false);
                    }

                    if(info.type == 'head' || info.type == 'back')
                    {
                        text_time.setVisible(true);
                        text_num.setVisible(false);
                        if(info['validTime'] == 0)
                        {
                            text_time.setString('永久');
                        }
                        else
                        {
                            text_time.setString('有效期:'+info.remainTime+'天');
                        }
                        if(info.type == 'head')
                        {
                            img_bg.setVisible(true);
                        }
                        this.loadHead(img_icon , Backpack_small[backpackCfg[info.id].attrId]);
                    }
                    else if(info['type'] == 'gem' || info['type'] == 'score' || info['type'] == 'gold')
                    {
                        text_time.setVisible(false);
                        text_num.setVisible(true);
                        text_num.setString('x' + info.count);
                        this.loadHead(img_icon , Item_cfg[info['type']]);
                    }
                    else if(info['type'] == 'money' || info['type'] == 'cost')
                    {
                        text_time.setVisible(true);
                        text_time.setString(info['sum'] || "");
                        text_num.setVisible(false);
                        text_num.setString('x' + info.count);
                        this.loadHead(img_icon , Item_cfg[info['type']]);
                    }
                    text_name.setString(info.name);
                }
                else
                {
                    CKBox_cell.setVisible(false);
                }
                idx++;
            }
            var layer = new ccui.Layout();
            layer.setContentSize(cellView.getContentSize());
            cellView.x = 0;
            cellView.y = 0;
            cellView.setVisible(true);
            layer.addChild(cellView);
            this.listview_array[type].pushBackCustomItem(layer);
        }
    },
    onUseEvent:function (sender) {
        var itemId = sender._Id;
        var info = sender._info;
        hall.net.sendPlayerEquip(itemId,function (data,req) {
            if(data.code == 200)
            {
                if(info.type == 'gold' || info.type == 'gem' || info.type == 'score')
                {
                    var bar = new QDTipBar();
                    bar.show("获得" + info.rewardNum + backpack_type[info.type], 0.8);
                    if(info.type == 'gold' || info.type == 'gem')
                    {
                        var tip = {'gold':{x:310,y:670},'gem':{x:500,y:670}}
                        util.showReceiveGold(tip[info.type],backpack_icon[info.type]);
                    }
                }
                else
                {
                    var tipStr = '使用成功';
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(tipStr);
                    dialog.showDialog();
                }
            }
            else
            {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data.msg || data.error || data.err);
                dialog.showDialog();
            }
        });
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
    onSwitchItem: function (sender) {
        for (var i = 0; i < this.btn_array.length; i++) {
            var btn = this.btn_array[i];
            btn.setBright(btn.name != sender.name);
            btn.setTouchEnabled(btn.name != sender.name);
            this.listview_array[i].setVisible(btn.name == sender.name);
        }
    },
    CKBox_cellEvent:function (sender, type) {
        var dialog = new GameItemDialog(sender._info,2);
        dialog.showPanel();
    },
    hallUpdateEquipSwitch:function (data) {
        console.log('hallUpdateEquipSwitch' + JSON.stringify(data));
        var head = data.head;
        var back = data.back;
        for(var key in this.allItem)
        {
            if(key == head || key == back)
            {
                this.allItem[key]._btn_use.setVisible(false);
                this.allItem[key]._image_use.setVisible(true);
            }
            else
            {
                this.allItem[key]._btn_use.setVisible(true);
                this.allItem[key]._image_use.setVisible(false);
            }
        }
        for(var key in this.zhuangshiItem)
        {
            if(key == head || key == back)
            {
                this.zhuangshiItem[key]._btn_use.setVisible(false);
                this.zhuangshiItem[key]._image_use.setVisible(true);
            }
            else
            {
                this.zhuangshiItem[key]._btn_use.setVisible(true);
                this.zhuangshiItem[key]._image_use.setVisible(false);
            }
        }
    },
    hallUpdateBagSwitch:function (data) {
        console.log('hallUpdateBagSwitch' + JSON.stringify(data));
        // this.daoju_array = new Array();
        this.zhuangshi_array = new Array();
        for(var i=0;i<data.length;i++)
        {
            if(data[i]['type'] == 'head' || data[i]['type'] == 'back')
            {
                this.zhuangshi_array.push(data[i]);
            }
            // else
            // {
            //     this.daoju_array.push(data[i]);
            // }
        }
        this.allItem = {};
        this.daojuItem = {};
        this.zhuangshiItem = {};
        this.UpdateBackpackList(data,0,this.allItem);
        // this.UpdateBackpackList(this.daoju_array,1,this.daojuItem);
        this.UpdateBackpackList(this.zhuangshi_array,1,this.zhuangshiItem);
    },
    onEnter: function () {
        this._super();
        qp.event.listen(this, 'hallUpdateEquip', this.hallUpdateEquipSwitch.bind(this));
        qp.event.listen(this, 'hallUpdateBag', this.hallUpdateBagSwitch.bind(this));
    },
    onExit:function () {
        this._super();
        this.alreadyClose = true;
        qp.event.stop(this, 'hallUpdateEquip');
        qp.event.stop(this, 'hallUpdateBag');
    },
    showPanel: function () {
        if(this.panel)
        {
            this.panel.setScale(0.3)
            this.panel.runAction(cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1, 1)))
        }
        cc.director.getRunningScene().addChild(this);
    },
});


