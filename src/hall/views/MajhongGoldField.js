
var MajhongGoldField = cc.Layer.extend({
    ctor: function (data) {
        this._super();
        var root = util.LoadUI(GameHallJson.GoldField).node;
        this.addChild(root);
        var self = this;

        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        this.panel_lv = ccui.helper.seekWidgetByName(root, "panel_lv");

        this.goldbtns = [];
        var panel_quick = ccui.helper.seekWidgetByName(this.panel_lv, "panel_quick");
        this.goldbtns.push(panel_quick);
        panel_quick.addClickEventListener(this.GoldquickJoin.bind(this));

        var node_anim = util.playTimeLineAnimation(GameHallJson.GOLD,true);
        node_anim.setPosition(cc.p(panel_quick.getContentSize().width/2,panel_quick.getContentSize().height/2));
        panel_quick.addChild(node_anim, 100);

        var btn_backgold = ccui.helper.seekWidgetByName(this.panel_lv, "btn_backgold");
        btn_backgold.addClickEventListener(function(){
            this.removeFromParent();
        }.bind(this));
        this.ResetRoomInfo();

        this.panel_lv.x = this.panel_lv.width;
        this.onOpenEvent();
    },

    onOpenEvent: function () {
        this.panel_lv.stopAllActions();
        var openAction = cc.sequence(
            cc.moveTo(0.3, cc.p(0, 0)),
            cc.callFunc(function () {

            }.bind(this))
        );
        this.panel_lv.runAction(openAction);
    },

    enable:function (able) {
        for(var j=0;j<this.goldbtns.length;j++)
        {
            var btn = this.goldbtns[j];
            btn.setTouchEnabled(able);
        }
    },

    ResetRoomInfo:function () {
        var limit = ["入场：1千~1万","入场：8千~3万","入场：3万以上"];
        var difen = ["底注：50","底注：200","底注：1000"];
        var renshu = ["新手场2-5人","中级场4-6人","高级场6-8人"];
        for(var i = 0;i<3;i++)
        {
            var btn = ccui.helper.seekWidgetByName(this.panel_lv, "btn_lv"+i);
            this.goldbtns.push(btn);
            btn.setTag(i+1);
            btn.addClickEventListener(this.GoldBtn_lv.bind(this,0));

            var text_limit = ccui.helper.seekWidgetByName(btn, "text_limit");
            var text_difen = ccui.helper.seekWidgetByName(btn, "text_difen");
            var text_renshu = ccui.helper.seekWidgetByName(btn,"text_renshu");
            text_limit.setString(limit[i]);
            text_difen.setString(difen[i]);
            text_renshu.setString(renshu[i]);
        }

        for(var i = 0;i<3;i++)
        {
            var btn = ccui.helper.seekWidgetByName(this.panel_lv, "bbbtn_lv"+i);
            btn.setTag(i+1);
            this.goldbtns.push(btn);
            btn.addClickEventListener(this.GoldBtn_lv.bind(this,1));

            var text_limit = ccui.helper.seekWidgetByName(btn, "text_limit");
            var text_difen = ccui.helper.seekWidgetByName(btn, "text_difen");
            var text_renshu = ccui.helper.seekWidgetByName(btn,"text_renshu");
            text_limit.setString(limit[i]);
            text_difen.setString(difen[i]);
            text_renshu.setString(renshu[i]);
        }
    },

    GoldBtn_lv:function (type,sender) {
        this.enable(false);
        var index = sender.getTag();
        hall.net.joinGoldTable("shisanshui",index,type,function(cbData){
            if(cbData.code == 200)
            {
                hall.enter(SSSPoker.appId);
            }else if(cbData.needGold == 1)
            {

                var times =  hall.dayLogin.activeData.dayGold;
                if(times < 4 && index == 1)
                {
                    util.getDayGoldTip(cbData.rewardNum,times+1);
                }else
                {
                    var dialog = new JJMajhongDecideDialog();
                    dialog.setDes(cbData['error']);
                    dialog.setCallback(function () {

                        hall.net.getShopConfig(function (data) {
                            if (data.code == 200) {

                                var panel = new  GameGoldShop(data["data"]);
                                panel.showPanel();
                            } else {
                                var dialog = new JJConfirmDialog();
                                dialog.setDes(data['msg']);
                                dialog.showDialog();
                            }
                        });
                    });
                    dialog.showDialog();
                }
            }else
            {
                var dialog = new JJConfirmDialog();
                dialog.setDes(cbData['error']);
                dialog.showDialog();
            }
            this.enable(true);
        }.bind(this));
    },

    GoldquickJoin:function () {
        this.enable(false);
        var type = Math.random();
        type = Math.ceil(type*2) == 2?0:1;
        hall.net.joinGoldTable("shisanshui",0,type,function(cbData){
            if(cbData.code == 200)
            {
                hall.enter(SSSPoker.appId);
            }else if(cbData.needGold == 1)
            {

                var times =  hall.dayLogin.activeData.dayGold;
                if(times <4)
                {
                    util.getDayGoldTip(cbData.rewardNum,times+1);
                }else
                {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(cbData['error']);
                    dialog.showDialog();
                }
            }else
            {
                var dialog = new JJConfirmDialog();
                dialog.setDes(cbData['error']);
                dialog.showDialog();
            }
            this.enable(true);
        }.bind(this));
    },

    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    }

});