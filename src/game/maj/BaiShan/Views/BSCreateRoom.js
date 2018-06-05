MJBaiShan.WGCreateRoom = ccui.Layout.extend({
    mCacheTag : "config_baishan_",
    ctor: function () {
        var root = util.LoadUI(MJBaiShan.RES.WGCRoom).node;
        this._super(root);

        this.mRoomData = {};
        this.mRoomData['uid'] = hall.user.uid;
        this.mRoomData['aaGem'] = 0;
        this.mRoomData['rounds'] = 4;
        this.mRoomData['person'] = 4;
        this.mRoomData['fengDing'] = 16;//封顶
        this.mRoomData['baoSanJia'] = 0;//包三家
        this.mRoomData['tableName'] = 'baishan';
        this.mRoomData['serverType'] = 'baishan';

        this.panel_round = ccui.helper.seekWidgetByName(root, "panel_round");
        this.panel_person = ccui.helper.seekWidgetByName(root, "panel_person");
        this.panel_fufei = ccui.helper.seekWidgetByName(root, "panel_fufei");
        this.panel_fengding = ccui.helper.seekWidgetByName(root, "panel_fengding");
        this.panel_wanfa = ccui.helper.seekWidgetByName(root, "panel_wanfa");
        this.setContentSize(root.getContentSize());
        this.addChild(root);

        this.optView();

        this.optSelectsFengDingView();
    },

    optView: function () {
        this.optPersonsView();

        var panel_fufei = new Array();
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_fufei, "panel_fufei" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_fufei, "checkbox_fufei" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            this.mRoomData["aaGem"] = parseInt(util.getCacheItem(this.mCacheTag + 'aaGem') || this.mRoomData["aaGem"] );

            var bl = this.mRoomData["aaGem"] === i;
            checkbox.setSelected(bl);
            panel.setTouchEnabled(!bl);
            panel_fufei.push(panel);

            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = i;
            clickData['index'] = i;
            clickData['array'] = panel_fufei;
            clickData['itemKey'] = "aaGem";
            panel.addClickEventListener(this.onToggle.bind(clickData));
        }

        var opKeys = ["baoSanJia"];
        var baoSanJiaCfgVs = [1];
        for (var i = 0; i < opKeys.length; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_wanfa, "panel_wanfa" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_wanfa, "checkbox_wanfa" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            var saveOp = util.getCacheItem(this.mCacheTag + 'baoSanJia');

            if (saveOp === "0" || saveOp === 1) {
                this.mRoomData["baoSanJia"] = parseInt(saveOp);
            }
            var bl = this.mRoomData["baoSanJia"] === baoSanJiaCfgVs[i];
            checkbox.setSelected(bl);

            var clickData = {};
            clickData['this'] = this;
            clickData['checkBox'] = checkbox;
            clickData['itemKey'] = opKeys[i];
            panel.addClickEventListener(this.onSwitchSelect.bind(clickData));
        }
    },

    optPersonsView:function () {
        var self = this;

        var psForRdCfg = {
            2:[[8 ,16 , 32] , "局"],
            3:[[2 ,4  , 8] , "圈"],
            4:[[2 ,4  , 8] , "圈"],
        }

        var _changeRoundShow = function (index) {
            var pk = personKey[index]
            if(pk){
                var cfgs = psForRdCfg[pk];
                self.optRoundsView(cfgs[0] , cfgs[1]);
            }
        };

        var panel_person = new Array();
        var personKey = [2,3,4];
        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_person, "panel_person" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_person, "checkbox_person" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            this.mRoomData["person"] = parseInt(util.getCacheItem(this.mCacheTag + 'person') || this.mRoomData["person"] );

            var bl = this.mRoomData["person"] === personKey[i];
            checkbox.setSelected(bl);
            panel.setTouchEnabled(!bl);
            if(bl){
                _changeRoundShow(i);
            }
            panel_person.push(panel);

            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = personKey[i];
            clickData['index'] = i;
            clickData['array'] = panel_person;
            clickData['itemKey'] = "person";
            clickData['callBack'] = _changeRoundShow;
            panel.addClickEventListener(this.onToggle.bind(clickData));
        }
    },

    optSelectsFengDingView: function () {
        var fengDingCfgVs = [16 , 32];
        var panel_fengDing = new Array();
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_fengding, "panel_ding" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_fengding, "checkbox_ding" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            var saveOp = util.getCacheItem(this.mCacheTag + 'fengDing');
            if (saveOp === '16' || saveOp === '32') {
                this.mRoomData['fengDing'] = parseInt(saveOp);
            }
            var bl = this.mRoomData['fengDing'] === fengDingCfgVs[i];
            panel.setTouchEnabled(!bl);
            panel_fengDing.push(panel);
            checkbox.setSelected(bl);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = fengDingCfgVs[i];
            clickData['index'] = i;
            clickData['array'] = panel_fengDing;
            clickData['itemKey'] = 'fengDing';
            panel.addClickEventListener(this.onToggle.bind(clickData));
        }
    },

    optRoundsView: function (roundCfgValues , roundTitleN) {
        var ffTitleCfg = {
            0: ["AA支付(3钻石)", "房主支付(10钻石)"],
            1: ["AA支付(6钻石)", "房主支付(20钻石)"],
            2: ["AA支付(9钻石)", "房主支付(30钻石)"],
        };
        roundCfgValues = roundCfgValues || [2, 4, 8];
        roundTitleN = roundTitleN || "局";
        //处理选择不同步类型开局，所消耗的房卡标示不相同
        var self = this;
        var _refreshFFTitleFunc = function (select) {
            var textAA = ccui.helper.seekWidgetByName(self.panel_fufei, "text_aa");
            var textBanker = ccui.helper.seekWidgetByName(self.panel_fufei, "text_banker");

            if (textAA) {
                textAA.string = ffTitleCfg[select][0];
                textBanker.string = ffTitleCfg[select][1];
            }
        }

        var saveOp = parseInt(util.getCacheItem(this.mCacheTag + 'rounds')) || roundCfgValues[0];
        if (roundCfgValues.indexOf(saveOp) >= 0) {
            this.mRoomData["rounds"] = saveOp;
        }
        this.panel_rounds = new Array();
        var bl = false;
        var optRdLen = Object.keys(ffTitleCfg).length - 1;
        var breakRound = false;
        for (var i = 0; i <= optRdLen; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_round, "panel_" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_round, "checkbox_" + i);
            checkbox.setTouchEnabled(false);
            var num = ccui.helper.seekWidgetByName(checkbox, "content");
            panel._checkBox = checkbox;
            panel._labelNum = num;
            num.string = roundCfgValues[i] + roundTitleN;
            if (!bl)
                bl = this.mRoomData["rounds"] === roundCfgValues[i];

            if (!bl && i === optRdLen )
                bl = true;

            if (bl && !breakRound) {
                this.mRoomData["rounds"] = roundCfgValues[i];
                _refreshFFTitleFunc(i);
                breakRound = true;
                checkbox.setSelected(bl);
                panel.setTouchEnabled(!bl);

            } else {
                checkbox.setSelected(false);
                panel.setTouchEnabled(true);
            }

            this.panel_rounds.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = roundCfgValues[i];
            clickData['index'] = i;
            clickData['array'] = this.panel_rounds;
            clickData['itemKey'] = "rounds";
            clickData['callBack'] = _refreshFFTitleFunc;
            panel.addClickEventListener(this.onToggle.bind(clickData));
            // panel._ToggleSelect = this.onToggle.bind(clickData);
        }
    },

    onToggle: function () {
        var index = this['index'];
        var _this = this['this'];
        var array = this['array'];
        var key = this['itemKey'];
        var value = this['itemValue'];
        var callBack = this['callBack'];

        _this.mRoomData[key] = value;
        for (var i = 0; i < array.length; i++) {
            array[i].setTouchEnabled(i != index);
            array[i]._checkBox.setSelected(i == index);
        }
        if (callBack) callBack(index);
    },

    onSwitchSelect: function () {
        var _this = this['this'];
        var checkBox = this['checkBox'];
        var key = this['itemKey'];
        checkBox.setSelected(!checkBox.isSelected());
        _this.mRoomData[key] = checkBox.isSelected() ? 1 : 0;
    },

    recordNewConfig: function () {
        for (var key in this.mRoomData) {
            util.setCacheItem(this.mCacheTag + key, this.mRoomData[key]);
        }
    },

    getCreateRoomData:function () {
        var roomData = {};
        roomData['appId'] = MJBaiShan.Game.appId;
        roomData['data'] = this.mRoomData;
        return roomData;
    },

});
