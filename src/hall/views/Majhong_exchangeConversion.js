var GameExchangeConversion = cc.Layer.extend({
    panel_cell:null,
    panel_select:null,
    ListView_1:null,
    text_num:null,
    btn_copy:null,
    pageId:0,
    pageSize:100,
    ConverObj:{},
    ctor:function(data)
    {
        this._super();
        var root = ccs.load(GameHallJson.ExchangeConversion).node;
        this.addChild(root);
        this.panel_cell = ccui.helper.seekWidgetByName(root, "panel_cell");
        this.panel_select = ccui.helper.seekWidgetByName(root, "panel_select");
        this.panel_select.setVisible(false);
        this.Image_shixiao = ccui.helper.seekWidgetByName(root, "Image_shixiao");
        this.Image_duihuama = ccui.helper.seekWidgetByName(root, "Image_duihuama");
        this.Text_1 = ccui.helper.seekWidgetByName(root, "Text_1");
        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        this.ShiwuList = new Array();
        this.XvniList = new Array();
        this.listview_array = new Array();
        this.ConverObj = {};
        for(var i = 0;i<data.length;i++)
        {
            if(data[i].type == 1)
            {
                this.ShiwuList.push(data[i]);
            }
            else if(data[i].type == 0)
            {
                this.XvniList.push(data[i]);
            }
        }
        this.ConverObj[0] = this.XvniList;
        this.ConverObj[1] = this.ShiwuList;
        //玩法
        this.panel_selects = new Array();
        this.select_array_ops = 0;
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_select, "panel_op" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_select, "checkbox_op" + i);
            var ListView = ccui.helper.seekWidgetByName(root, "ListView" + i);
            this.listview_array.push(ListView);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var bl = this.select_array_ops == i;
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
            {
                panel._labelNum.setTextColor({r: 255, g: 233, b: 189,a:255});
                this.UpdateOrderList(this.ConverObj[i],i);
                ListView.setVisible(true);
            }
            else
            {
                ListView.setVisible(false);
            }
            panel.setTouchEnabled(!bl);
            this.panel_selects.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['index'] = i;
            clickData['array'] = this.panel_selects;
            clickData['itemKey'] = "config_SelectOption";
            panel.addClickEventListener(this.onClickSelectOption.bind(clickData));
        }
    },
    onClickSelectOption: function () {
        var _this = this["this"];
        var index = this["index"];
        var array = this['array'];
        console.log("select", index, this);
        for (var i = 0; i < array.length; i++) {
            array[i].setTouchEnabled(i != index);
            array[i]._checkBox.setSelected(i == index);
            _this.listview_array[i].setVisible(i == index);
            if (i == index) {
                array[i]._labelNum.setTextColor({r: 255, g: 233, b: 189,a:255});
            } else {
                array[i]._labelNum.setTextColor({r: 90, g: 59, b: 28,a:255});
            }
        }
        _this.UpdateOrderList(_this.ConverObj[index],index);
    },
    onCopyLabel: function (sender) {
        var weChatId = null;
        switch (sender) {
            case sender:
                var text = ccui.helper.seekWidgetByName(sender.parent,"text_weixin")
                weChatId = text.getString();
                break;
            default:
                break;
        }
        util.copyLabel(weChatId);
        var bar = new QDTipBar()
        bar.show("复制成功！",1);
    },
    UpdateOrderList:function(data,index)
    {
        this.listview_array[index].removeAllChildren();
        if(index == 0)
        {
            this.Image_shixiao.setVisible(true);
            this.Image_duihuama.setVisible(false);
            this.Text_1.setVisible(false);
        }
        else
        {
            this.Image_shixiao.setVisible(false);
            this.Image_duihuama.setVisible(true);
            this.Text_1.setVisible(true);
        }
        for(var i = 0;i<data.length;i++)
        {
            var cell = this.panel_cell.clone();
            var text_wuping = ccui.helper.seekWidgetByName(cell, "text_wuping");
            var text_shuliang = ccui.helper.seekWidgetByName(cell, "text_shuliang");
            var text_duihuanma = ccui.helper.seekWidgetByName(cell, "text_duihuanma");
            var text_xiaohao = ccui.helper.seekWidgetByName(cell, "text_xiaohao");
            var text_shijian = ccui.helper.seekWidgetByName(cell, "text_shijian");
            var btn_copy = ccui.helper.seekWidgetByName(cell,"btn_copy");
            btn_copy.addClickEventListener(this.onCopyLabel.bind(this));
            text_wuping.setString(data[i].goodName);
            text_xiaohao.setString(data[i].scoreNum + ExchangeType[data[i].deductionType]);
            if(data[i].type == 0)
            {
                btn_copy.setVisible(false);
                if(data[i].validTime == 0)
                {
                    text_duihuanma.setString('永久');
                }
                else
                {
                    text_duihuanma.setString(data[i].validTime + '天');
                }
            }
            else
            {
                btn_copy.setVisible(true);
                text_duihuanma.setString(data[i].goodCode);
            }
            text_shijian.setString(CTimeMgr.Instance.numberToFormat(new Date(data[i].createTime).getTime()/1000));
            text_shuliang.setString(data[i].goodNum + '件');
            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());
            cell.x = 0;
            cell.y = 0;
            cell.setVisible(true);
            layout.addChild(cell);
            this.listview_array[index].pushBackCustomItem(layout);
        }
    },
    showPanel:function()
    {
        cc.director.getRunningScene().addChild(this);
    }
});