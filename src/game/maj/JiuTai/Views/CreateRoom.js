MJJiuTai.WGCreateRoom = ccui.Layout.extend({
    mCacheTag : "config_jiutai_",
    ctor: function () {
        var root = util.LoadUI(MJJiuTai.RES.WGCRoom).node;
        this._super(root);

        this.mRoomData = {};
        this.mRoomData['uid'] = hall.user.uid;
        this.mRoomData['aaGem'] = 0;
        this.mRoomData['person'] = 4;
        this.mRoomData['rounds'] = 4;
        this.mRoomData['tongBaoFan'] = 0; //通宝翻番
        this.mRoomData['wuYaoJiu'] = 0; //飘胡、七对不限幺九
        this.mRoomData['zhuangGangFan'] = 0; //庄杠输赢翻倍
        this.mRoomData['gangHuFan'] = 0; //杠开杠后炮翻番
        this.mRoomData['tableName'] = 'jiutai';
        this.mRoomData['serverType'] = 'jiutai';

        this.panel_round = ccui.helper.seekWidgetByName(root, "panel_round");
        this.panel_person = ccui.helper.seekWidgetByName(root, "panel_person");
        this.panel_fufei = ccui.helper.seekWidgetByName(root, "panel_fufei");
        this.panel_qita = ccui.helper.seekWidgetByName(root, "panel_qita");
        this.setContentSize(root.getContentSize());
        this.addChild(root);

        this.optView();

        this.optSelectsWanFaView();

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
    },

    optPersonsView: function () {
        var self = this;

        var psForRdCfg = {
            2:[[16 , 32, 8] , "局"],
            3:[[4  , 8 , 2] , "圈"],
            4:[[4  , 8 , 2] , "圈"],
        }
        var panel_person = new Array();
        var personKey = [2,3,4];

        var _changeRoundShow = function (index) {
            var pk = personKey[index]
            if(pk){
                var cfgs = psForRdCfg[pk];
                self.optRoundsView(cfgs[0] , cfgs[1]);
            }
        };

        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_person, "panel_person" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_person, "checkbox_person" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            this.mRoomData["person"] = parseInt(util.getCacheItem(this.mCacheTag + 'person') || this.mRoomData["person"]);

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

    optSelectsWanFaView: function () {
        var opKeys = ["tongBaoFan", "zhuangGangFan", "gangHuFan", "wuYaoJiu"];
        for (var i = 0; i < opKeys.length; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_qita, "panel_op" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_qita, "checkbox_op" + i);
            checkbox.setTouchEnabled(false);
            var saveOp = util.getCacheItem(this.mCacheTag + opKeys[i]);
            if (saveOp === '1') {
                this.mRoomData[opKeys[i]] = parseInt(saveOp);
            }
            var bl = this.mRoomData[opKeys[i]] === 1;
            checkbox.setSelected(bl);
            var clickData = {};
            clickData['this'] = this;
            clickData['checkBox'] = checkbox;
            clickData['itemKey'] = opKeys[i];
            panel.addClickEventListener(this.onSwitchSelect.bind(clickData));
        }
    },

    optRoundsView: function (roundCfgValues , roundTitleN) {
        var ffTitleCfg = {
            0: ["AA支付(3钻石)", "房主支付(10钻石)"],
            1: ["AA支付(6钻石)", "房主支付(20钻石)"],
            2: ["AA支付(1钻石)", "房主支付(5钻石)"],
        };
        roundCfgValues = roundCfgValues || [4, 8, 2];
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
            var checkbox = ccui.helper.seekWidgetByName(panel, "checkbox");
            checkbox.setTouchEnabled(false);

            var txt = ccui.helper.seekWidgetByName(panel, "txt");

            panel._checkBox = checkbox;

            txt.string = roundCfgValues[i] + roundTitleN;

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
        roomData['appId'] = MJJiuTai.Game.appId;
        roomData['data'] = this.mRoomData;
        return roomData;
    },

});
