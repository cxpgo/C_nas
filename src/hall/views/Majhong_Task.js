var GameTask = cc.Layer.extend({
    listview_task:null,
    panel_banner:null,
    panel_reward:null,
    image_content:null,
    ctor:function(data)
    {
        this._super();
        var root = ccs.load(GameHallJson.GameTask).node;
        this.addChild(root);
        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        this.listview_task = ccui.helper.seekWidgetByName(root, "listview_task");
        this.panel_banner = ccui.helper.seekWidgetByName(root, "panel_banner");
        this.panel_banner.setVisible(false);

        this.text_1 = ccui.helper.seekWidgetByName(root, "text_1");
        this.text_2 = ccui.helper.seekWidgetByName(root, "text_2");
        var text_notask = ccui.helper.seekWidgetByName(root, "text_notask");
        text_notask.setVisible(false);

        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));

        hall.net.getTaskInfoList(function (listData) {
            console.log("getTaskInfoList:" + JSON.stringify(listData));
            if(listData["code"] == 200)
            {
                if(listData.data.length == 0)
                {
                    text_notask.setVisible(true);
                    this.text_1.setVisible(false);
                    this.text_2.setVisible(false);
                }
                else
                {
                    this.updateInfo(listData);
                    this.text_1.setVisible(true);
                    this.text_2.setVisible(true);
                }
            }
            else
            {
                var dialog = new JJConfirmDialog();
                dialog.setDes(listData.msg || listData.error || listData.err);
                dialog.showDialog();
            }
        }.bind(this));
    },

    updateInfo:function (data) {
        var panels = new Array();
        var contents = {};
        var data = data.data;
        var idx = 0;
        var score = 0;
        for(var j = 0;j<data.length;j++)
        {
            if(parseInt(data[j].progress) >= parseInt(data[j].taskVal))
            {
                data[j].over = 1;
            }
            else
            {
                data[j].over = 0;
            }
        }
        data.sort(function (a,b) {
            return a.over - b.over;
        });
        for(var i = 0;i<data.length;i++)
        {
            var banner_cell = this.panel_banner.clone();
            banner_cell.setVisible(true);

            var img_compelete = ccui.helper.seekWidgetByName(banner_cell, "img_compelete");
            var text_name = ccui.helper.seekWidgetByName(banner_cell, "text_name");

            this.task_slider = ccui.helper.seekWidgetByName(banner_cell, "task_slider");
            var text_progress = ccui.helper.seekWidgetByName(this.task_slider, "text_progress");
            var text_des = ccui.helper.seekWidgetByName(banner_cell, "text_des");
            text_name.setString(data[i].taskName);
            this.task_slider.setPercent(parseInt(data[i].progress) * 100.0/(parseInt(data[i].taskVal)));
            text_progress.setString(data[i].progress + '/' + data[i].taskVal);
            text_des.setString(data[i].taskDesc);
            var reward_cell = ccui.helper.seekWidgetByName(banner_cell, "cell_reward0");
            reward_cell.setVisible(true);
            var img_reward_icon = ccui.helper.seekWidgetByName(reward_cell, "img_reward_icon");
            var text_reward = ccui.helper.seekWidgetByName(reward_cell, "text_reward");
            var info = data[i];
            if(info.rewardType =='scoreNum')
            {
                text_reward.setString(info.rewardVal);
            }
            else if(info.rewardType =='goldNum')
            {
                text_reward.setString(info.rewardVal);
            }
            else if(info.rewardType =='gemNum')
            {
                text_reward.setString(info.rewardVal);
            }

            if(parseInt(data[i].progress) >= parseInt(data[i].taskVal))
            {
                img_compelete.setVisible(true);
                idx = idx+1;
                score = score + parseInt(info.rewardVal);
            }
            else
            {
                img_compelete.setVisible(false);
            }
            this.listview_task.pushBackCustomItem(banner_cell);
        }
        this.text_1.setString('已完成任务:'+idx);
        this.text_2.setString('已获得积分:'+score);
    },
    showPanel:function()
    {
        if(this.panel_root)
        {
            this.panel_root.setScale(0.3)
            this.panel_root.runAction(cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1, 1)))
        }
        cc.director.getRunningScene().addChild(this);
    }

});