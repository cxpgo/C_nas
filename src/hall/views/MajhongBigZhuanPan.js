var testCommon = {
    "speedMid": 720,
    "speedMidTime": 1,
    "speedStart": 90,
    "speedStartTime": 2,
    // "speedEnd": 90,
    // "speedEndTime": 4,
    "speedEnd": 120,
    "speedEndTime": 3,
};
var BigZhuanPanRewardPic = {
    0: "res/Common/item_icon/img_zhuanshi2.png",
    1: "res/Common/item_icon/head_small_10401.png",
    2: "res/Common/item_icon/img_jinbi1.png",
    3: "res/Common/item_icon/back_small_10915.png",
    4: "res/Common/item_icon/img_jinbi2.png",
    5: "res/Common/item_icon/img_zhuanshi1.png",
    6: "res/Common/item_icon/head_small_10401.png",
    7: "res/Common/item_icon/img_jinbi4.png",
    8: "res/Common/item_icon/img_zhuanshi0.png",
    9: "res/Common/item_icon/head_small_10501.png",
    10: "res/Common/item_icon/img_jinbi3.png",
    11: "res/Common/item_icon/img_jinbi0.png",
}
var MajhongBigZhuanPan = cc.Layer.extend({
    btn_xuanzhuan: false,
    img_zhuanpai: false,
    img_hight_array: null,
    turn_index: null,
    img_blink_array: null,
    panel_reward: null,
    panel_blink: null,
    node_ani: null,
    action_ani: null,
    panel_right: null,
    text_gold: null,
    text_num: null,
    img_reward: null,
    text_reward: null,
    isAction: null,

    ctor: function () {
        this._super();
        var jsonres = ccs.load(GameHallJson.BigZhuanPan)
        var root = jsonres.node;
        this.addChild(root);
        this.isAction = false;

        this.btn_start = ccui.helper.seekWidgetByName(root, "btn_start");
        this.btn_start.addClickEventListener(function () {
            this.btn_start.setTouchEnabled(false);
            this.isAction = true;
            this.getTurnInfo();
        }.bind(this));
        // this.btn_start.setScale(0.95);
        // this.btn_start.runAction(cc.sequence(cc.scaleTo(1.5, 1, 1).easing(cc.easeBackOut()), cc.scaleTo(0.75, 0.95, 0.95)).repeatForever());

        this.text_gold = ccui.helper.seekWidgetByName(this.btn_start, "text_gold");
        this.text_num = ccui.helper.seekWidgetByName(this.btn_start, "text_num");
        // var img_hight = ccui.helper.seekWidgetByName(root, "bg_hight");
        this.img_hight_array = new Array();
        for (var i = 0; i < 12; i++) {
            var temp = ccui.helper.seekWidgetByName(root, "bg_hight_" + i);
            temp.setVisible(false);
            // temp.setRotation(30*i);
            this.img_hight_array.push(temp)
        }
        // img.setVisible(false);
        this.panel_cur = ccui.helper.seekWidgetByName(root, "panel_cur");
        this.panel_blink = ccui.helper.seekWidgetByName(root, "panel_blink");
        this.panel_blink.setVisible(false);

        var panel_pro = ccui.helper.seekWidgetByName(root, "panel_pro");
        panel_pro.addClickEventListener(function () {
            var prob = new GameProb();
            prob.showPanel();
        }.bind(this));
        var btn_pro = ccui.helper.seekWidgetByName(root, "btn_pro");
        btn_pro.addClickEventListener(function () {
            var prob = new GameProb();
            prob.showPanel();
        }.bind(this));

        var img_bg_blink = ccui.helper.seekWidgetByName(root, "img_bg_blink");
        img_bg_blink.runAction(cc.sequence(cc.blink(2, 1), cc.blink(2, 2), cc.delayTime(1)).repeatForever())
        // this.img_shard = ccui.helper.seekWidgetByName(this.panel_cur, "img_shard");
        // this.img_shard.setVisible(false);
        this.img_blink_array = new Array();
        for (var i = 0; i < 3; i++) {
            var temp = ccui.helper.seekWidgetByName(this.panel_blink, "img_blink_" + i);
            this.img_blink_array.push(temp);
        }
        this.panel_reward = ccui.helper.seekWidgetByName(root, "panel_reward");
        this.img_reward = ccui.helper.seekWidgetByName(this.panel_reward, "img_reward");
        this.text_reward = ccui.helper.seekWidgetByName(this.panel_reward, "text_reward");
        this.panel_reward.setVisible(false);
        this.panel_reward.addClickEventListener(function () {
            this.schedule(this.showEffect, 1);
            this.panel_cur.setRotation(0);
            this.isAction = false;
            this.panel_reward.setVisible(false);
        }.bind(this));


        this.panel_right = ccui.helper.seekWidgetByName(root, "panel_right");
        var panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        panel_root.addClickEventListener(function () {
            if (this.isAction) return;
            this.removeFromParent();
        }.bind(this));
        this.schedule(this.showEffect, 1);
    },
    showEffect: function (dt) {
        this.btn_start.runAction(cc.sequence(cc.scaleTo(0.5, 1.1), cc.scaleTo(0.5, 1)));
    },
    onEnter: function () {
        this._super();
        this.getInitTurnInfo();
    },
    onExit: function () {
        this._super();
        this.unschedule(this.showEffect);
    },
    onStart: function (data) {
        // this.btn_xuanzhuan.setTouchEnabled(false);
        var rewardInfo = data['msg']['rewardInfo'];
        // var randRox = Math.random()*30 -15 + 30 * rewardInfo['type'];
        var randRox = 30 * rewardInfo['type'];
        this.panel_cur.runAction(cc.sequence(
            cc.callFunc(function () {
                // this.img_shard.setVisible(true);
                this.panel_cur.setRotation(0);
                this.schedule(this.updateShard.bind(this), 0.05);
                this.initRewardInfo(rewardInfo);
            }.bind(this)),
            // cc.rotateBy(testCommon.speedStartTime, testCommon.speedStart*testCommon.speedStartTime).easing(cc.easeExponentialIn()),
            cc.rotateBy(testCommon.speedMidTime, testCommon.speedMid * testCommon.speedMidTime + randRox),
            cc.rotateBy(testCommon.speedEndTime, testCommon.speedEnd * testCommon.speedEndTime).easing(cc.easeExponentialOut()),
            cc.callFunc(function () {
                this.unscheduleAllCallbacks();
                this.onEndAction();
                this.onRewardAction(rewardInfo);
                this.initTextTip(data);
            }.bind(this))));
    },
    updateShard: function () {
        var rotation = (this.panel_cur.getRotation() + 15) % 360;
        var temp_index = Math.floor(rotation / 30);
        if (this.turn_index == temp_index) return;
        this.img_hight_array[temp_index].runAction(cc.sequence(cc.show(), cc.fadeIn(0.1)));
        if (this.turn_index != null) {
            this.img_hight_array[this.turn_index].runAction(cc.sequence(cc.fadeOut(0.2), cc.hide()));
        }
        this.turn_index = temp_index;
    },
    onEndAction: function () {
        this.panel_blink.setRotation(30 * this.turn_index);
        this.panel_blink.runAction(cc.sequence(cc.show(), cc.delayTime(1), cc.hide()));
        var start_index = this.turn_index + 6;
        for (var i = start_index, k = 0; k < 7; i--, k++) {
            var _index = i % 12;
            this.img_hight_array[_index].runAction(cc.sequence(cc.delayTime(k * 0.1), cc.show(), cc.fadeIn(0.1), cc.fadeOut(0.2), cc.hide()));
        }
        for (var j = start_index, m = 0; m < 7; j++, m++) {
            var _index = j % 12;
            this.img_hight_array[_index].runAction(cc.sequence(cc.delayTime(m * 0.1), cc.show(), cc.fadeIn(0.1), cc.fadeOut(0.2), cc.hide()));
        }

        //闪烁效果
        for (var i = 0; i < 3; i++) {
            if (i == 0) {
                this.img_blink_array[i].runAction(cc.sequence(cc.show(), cc.delayTime(3), cc.hide()));
            } else {
                this.img_blink_array[i].runAction(cc.sequence(cc.show(), cc.blink(3, 5), cc.hide()));
            }
        }
    },
    onRewardAction: function () {
        this.panel_reward.setTouchEnabled(false);
        this.panel_reward.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            this.panel_reward.setVisible(true);
            this.panel_reward.setScale(0);
            // if (!this.node_ani) {
            //     this.node_ani = util.playTimeLineAnimation(GameHallJson.EfTurnReward, false);
            //     // this.node_ani.setPosition(this.panel_reward.getContentSize().width/2, this.panel_reward.getContentSize().height/2);
            //     this.node_ani.setPosition(cc.p(0, 0));
            //     var node_boom = ccui.helper.seekWidgetByName(this.panel_reward, "node_boom");
            //     node_boom.addChild(this.node_ani);
            // }
            // this.node_ani.action.play("reward", false);
        }.bind(this)), cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()), cc.callFunc(function () {
            this.panel_reward.setTouchEnabled(true);
            this.btn_start.setTouchEnabled(true);
            if (this.ef_yumao) return;
            this.ef_yumao = new cc.ParticleSystem("res/GameHall/Resoures/turnTable/guizu02.plist");
            this.ef_yumao.setVisible(true);
            this.ef_yumao.x = this.panel_reward.getContentSize().width / 2;
            this.ef_yumao.y = this.panel_reward.getContentSize().height / 2;
            this.panel_reward.addChild(this.ef_yumao, 100);
        }.bind(this))))
    },
    getInitTurnInfo: function () {
        hall.net.nextGacheInfo(function (data) {
            JJLog.print("getInitTurnInfo=>" + JSON.stringify(data));
            if (data.code == 200) {
                this.initTextTip(data);
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data.msg || data.error || data.err);
                dialog.showDialog();
                this.removeFromParent();
            }
        }.bind(this));
    },
    getTurnInfo: function () {
        hall.net.gache(function (data) {
            JJLog.print("getTurn=>" + JSON.stringify(data));
            if (data.code == 200) {
                this.unschedule(this.showEffect);
                this.onStart(data);
            } else if (data.code == CodeCommon.NO_GOLD.CODE) {
                var dialog = new JJMajhongDecideDialog();
                dialog.setDes(CodeCommon.NO_GOLD.ERROR);
                dialog.setCallback(function () {
                    util.showLessGoldDialog();
                });
                dialog.showDialog();
                this.btn_start.setTouchEnabled(true);
                this.isAction = false;
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data.msg || data.error);
                dialog.showDialog();
                this.btn_start.setTouchEnabled(true);
                this.isAction = false;
            }
        }.bind(this));
    },
    initTextTip: function (data) {
        var msg = data.msg;
        if (msg['canGacha'] != null) {
            this.text_gold.setString(msg['canGacha']);
            this.btn_start.setTouchEnabled(false);
            this.unschedule(this.showEffect);
        } else {
            this.text_gold.setString(msg['cost'] ? msg['cost'] + "金币" : "本次免费")
        }
        this.text_num.setString(msg['curNum'] + '/' + msg['totalNum']);
    },
    initRewardInfo: function (data) {
        this.img_reward.loadTexture(BigZhuanPanRewardPic[data.type] || BigZhuanPanRewardPic[0]);
        this.text_reward.setString(data.des || "");
    },

    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    },
});
