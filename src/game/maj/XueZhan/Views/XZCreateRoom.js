var _CR_ROOM_CFG = [
    'CreateRoomLayout_xz',
    'CreateRoomLayout_td',
    'CreateRoomLayout_ss',
    'CreateRoomLayout_sl',
];

var BaseCreateRoomLayout = cc.Layer.extend({
    mCacheTag : "config_xz_",
    score:0,
    ctor: function (root) {
        this._super();

        this.mRoot = root;

        var roomData = {};
        roomData['tableName'] = "xuezhan";
        roomData['uid'] = hall.user.uid;
        roomData['rounds'] = 10;
        roomData['aaGem'] = 0;
        roomData['person'] = 4;
        roomData['mode'] = 0;
        roomData['diScore'] = 1;
        roomData['paiChuTime'] = 0;
        roomData['fengDing'] = 2;
        roomData['wanFa1'] = 0;
        roomData['wanFa2'] = 0;
        roomData['huanSan'] = 0;
        roomData['tianDi'] = 0;
        roomData['one9'] = 0;
        roomData['menQing'] = 0;
        roomData['isDingQue'] = 0;
        roomData['duiHu'] = 0;
        roomData['dianPaoPingHu'] = 0;
        roomData['pphTwoFan'] = 0;
        roomData['jiaWuXin'] = 0;
        roomData['serverType'] = 'xuezhan';

        this.mRoomData = roomData;

        this.panel_xuezhan = ccui.helper.seekWidgetByName(root, "panel_xuezhan");
        this.panel_common = ccui.helper.seekWidgetByName(root, "panel_common");
        this.setContentSize(root.getContentSize());
        this.addChild(root);

        this.difenArray = [1, 2, 3, 5];
        this.btn_Array = new Array();

        this.optView();
        this.optTimeView();
        this.optSelectsWanFaView();
        this.optRoundsView();

    },

    optView: function () {

        var btn_add = ccui.helper.seekWidgetByName(this.panel_common, "btn_score1");
        var btn_earse = ccui.helper.seekWidgetByName(this.panel_common, "btn_score0");
        if(btn_add) btn_add.addClickEventListener(this.addScore.bind(this));
        if(btn_earse) btn_earse.addClickEventListener(this.earseScore.bind(this));

        this.text_score = ccui.helper.seekWidgetByName(this.panel_common, "text_score");
        if(this.text_score){
            var saveOp = util.getCacheItem(this.mCacheTag + 'score') || 1;
            if (saveOp != null && saveOp != undefined)
                this.mRoomData["score"] = saveOp;

            this.text_score.setString(this.mRoomData["score"]);
        }

        

        var panel_fufei = new Array();
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_xuezhan, "panel_fufei" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_xuezhan, "checkbox_fufei" + i);
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

        var panel_ding = new Array();
        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_xuezhan, "panel_ding" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_xuezhan, "checkbox_ding" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            var saveOp = util.getCacheItem(this.mCacheTag + 'fengDing');
            if (saveOp === '2' || saveOp === '3' || saveOp === '4') {
                this.mRoomData["fengDing"] = parseInt( saveOp );
            }
            var bl = this.mRoomData["fengDing"] === (i + 2);
            checkbox.setSelected(bl);
            panel.setTouchEnabled(!bl);
            panel_ding.push(panel);

            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = i + 2;
            clickData['index'] = i;
            clickData['array'] = panel_ding;
            clickData['itemKey'] = "fengDing";
            panel.addClickEventListener(this.onToggle.bind(clickData));
        }


        var panel_wanFa1 = new Array();
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_xuezhan, "panel_wanfa1" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_xuezhan, "checkbox_wanfa1" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            var saveOp = util.getCacheItem(this.mCacheTag + 'wanFa1');

            if (saveOp === "0" || saveOp === "1") {
                this.mRoomData["wanFa1"] = parseInt(saveOp);
            }
            var bl = this.mRoomData["wanFa1"] === i;
            checkbox.setSelected(bl);
            panel.setTouchEnabled(!bl);
            panel_wanFa1.push(panel);

            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = i;
            clickData['index'] = i;
            clickData['array'] = panel_wanFa1;
            clickData['itemKey'] = "wanFa1";
            panel.addClickEventListener(this.onToggle.bind(clickData));
        }


        var panel_wanFa2 = new Array();
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_xuezhan, "panel_wanfa2" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_xuezhan, "checkbox_wanfa2" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            var saveOp = util.getCacheItem(this.mCacheTag + 'wanFa2');
            if (saveOp === "0" || saveOp === "1") {
                this.mRoomData["wanFa2"] = parseInt(saveOp);
            }
            var bl = this.mRoomData["wanFa2"] === i;
            checkbox.setSelected(bl);
            panel.setTouchEnabled(!bl);
            panel_wanFa2.push(panel);

            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = i;
            clickData['index'] = i;
            clickData['array'] = panel_wanFa2;
            clickData['itemKey'] = "wanFa2";
            panel.addClickEventListener(this.onToggle.bind(clickData));
        }
    },

    optSelectsWanFaView: function (opKeys) {

        for (var i = 0; i < opKeys.length; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_xuezhan, "panel_op" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_xuezhan, "checkbox_op" + i);
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

    optRoundsView: function (ffTitleCfg) {
        //处理选择不同步类型开局，所消耗的房卡标示不相同
        var self = this;
        var _refreshFFTitleFunc = function (select) {
            var textAA = ccui.helper.seekWidgetByName(self.panel_xuezhan, "text_aa");
            var textBanker = ccui.helper.seekWidgetByName(self.panel_xuezhan, "text_banker");

            if (textAA) {
                textAA.string = ffTitleCfg[select][0];
                textBanker.string = ffTitleCfg[select][1];
            }
        }

        var roundCfgValues = [4, 8, 2];
        var saveOp = parseInt(util.getCacheItem(this.mCacheTag + 'rounds')) || 4;
        if (roundCfgValues.indexOf(saveOp) >= 0) {
            this.mRoomData["rounds"] = saveOp;
        }
        this.panel_rounds = new Array();
        var bl = false;
        var optRdLen = Object.keys(ffTitleCfg).length - 1;
        var breakRound = false;
        for (var i = 0; i <= optRdLen; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_common, "panel_" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_common, "checkbox_" + i);
            checkbox.setTouchEnabled(false);
            var img = ccui.helper.seekWidgetByName(this.panel_common, "img_" + i);
            var num = ccui.helper.seekWidgetByName(img, "num");
            panel._checkBox = checkbox;
            panel._labelNum = num;

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

    optTimeView: function () {
        var panel_out = new Array();
        var outTime = [30, 60, -1];
        for (var i = 0; i < outTime.length; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_xuezhan, "panel_out" + i);
            if(!panel){
                continue;
            }
            var checkbox = ccui.helper.seekWidgetByName(this.panel_xuezhan, "checkbox_out" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            var saveOp = util.getCacheItem(this.mCacheTag + 'paiChuTime');
            if (saveOp === '-1' || saveOp === '30' || saveOp === '60') {
                this.mRoomData["paiChuTime"] = parseInt(saveOp);
            }
            var bl = this.mRoomData["paiChuTime"] === outTime[i];
            checkbox.setSelected(bl);
            panel.setTouchEnabled(!bl);
            panel_out.push(panel);

            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = outTime[i];
            clickData['index'] = i;
            clickData['array'] = panel_out;
            clickData['itemKey'] = "paiChuTime";
            panel.addClickEventListener(this.onToggle.bind(clickData));
        }
    },

    addScore: function () {
        this.score++;
        if (this.score >= this.difenArray.length) this.score = this.difenArray.length - 1;
        this.text_score.setString(this.difenArray[this.score]);
        this.mRoomData['score'] = this.difenArray[this.score];
    },

    earseScore: function () {
        this.score--;
        if (this.score < 0) this.score = 0;
        this.text_score.setString(this.difenArray[this.score]);
        this.mRoomData['score'] = this.difenArray[this.score];
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

    onSwitch: function () {
        var index = this['index'];
        var _this = this['this'];
        var array = this['array'];
        var key = this['itemKey'];
        var value = this['itemValue'];
        for (var i = 0; i < array.length; i++) {
            if (i == index) {
                array[i]._checkBox.setSelected(!array[i]._checkBox.isSelected());
                _this.mRoomData[key] = array[i]._checkBox.isSelected() ? value : 0;
            } else {
                array[i]._checkBox.setSelected(false);
            }
        }
        if (key == "fufei") {
            var cost = { "2": 13, "3": 18, "4": 25, "5": 32, "6": 40 }
            var aa = 8;
            for (var i = 0; i < _this.panel_rounds.length; i++) {
                if (_this.mRoomData.fufei == 1) {
                    _this.panel_rounds[i]._labelNum.setString(aa * (i + 1));
                } else {
                    _this.panel_rounds[i]._labelNum.setString(cost[_this.mRoomData.person] * (i + 1));
                }
                _this.panel_rounds[i]._labelNum.setContentSize(_this.panel_rounds[i]._labelNum.getVirtualRendererSize());
            }
        }
    },

    onSwitchSelect: function () {
        var _this = this['this'];
        var checkBox = this['checkBox'];
        var key = this['itemKey'];
        checkBox.setSelected(!checkBox.isSelected());
        _this.mRoomData[key] = checkBox.isSelected() ? 1 : 0;
    },

    getCreateData: function () {

        return this.mRoomData;
    },

    getCreateRoomData:function () {
        var roomData = {};
        roomData['appId'] = XueZhanMajhong.appId;
        roomData['data'] = this.mRoomData;
        return roomData;
    },

    recordNewConfig: function () {
        for (var key in this.mRoomData) {
            util.setCacheItem(this.mCacheTag + key, this.mRoomData[key]);
        }
    },

});

var CreateRoomLayout_sl = BaseCreateRoomLayout.extend({
    mCacheTag : "config_xz_3_",
    ctor: function () {
        var root = util.LoadUI(XueZhanMajhongJson.CreateRoom_sl).node;
        this._super(root);

        this.mRoomData['mode'] = 3;
        this.mRoomData['person'] = 3;
        this.mRoomData['isDingQue'] = 0; //强制不定却
    },
    optSelectsWanFaView: function () {
        var opKeys = ["dianPaoPingHu", "one9", "menQing", "tianDi" , "pphTwoFan" , "jiaWuXin"];
        this._super(opKeys);
    },

    optRoundsView: function () {
        var ffTitleCfg = {
            0: ["AA支付(3房卡)", "房主支付(8房卡)"],
            1: ["AA支付(6房卡)", "房主支付(15房卡)"],
            // 2: ["AA支付(1房卡)", "房主支付(5房卡)"]
        };
        this._super(ffTitleCfg);
    },

});

var CreateRoomLayout_ss = BaseCreateRoomLayout.extend({
    mCacheTag : "config_xz_2_",
    ctor: function () {
        var root = util.LoadUI(XueZhanMajhongJson.CreateRoom_ss).node;
        this._super(root);
        this.mRoomData['mode'] = 2;
        this.mRoomData['person'] = 3;
        this.mRoomData['isDingQue'] = 1;
    },
    optSelectsWanFaView: function () {
        var opKeys = ["dianPaoPingHu", "one9", "menQing", "tianDi", "pphTwoFan" ];
        this._super(opKeys);
    },

    optRoundsView: function () {
        var ffTitleCfg = {
            0: ["AA支付(3房卡)", "房主支付(8房卡)"],
            1: ["AA支付(6房卡)", "房主支付(15房卡)"],
        };
        this._super(ffTitleCfg);
    },
});

var CreateRoomLayout_td = BaseCreateRoomLayout.extend({
    mCacheTag : "config_xz_1_",
    ctor: function () {
        var root = util.LoadUI(XueZhanMajhongJson.CreateRoom_td).node;
        this._super(root);

        this.mRoomData['mode'] = 1;
        this.mRoomData['person'] = 4;
        this.mRoomData['isDingQue'] = 0; //默认
    },

    optSelectsWanFaView: function () {
        var opKeys = ["huanSan", "one9", "menQing", "tianDi" , "isDingQue"];
        this._super(opKeys);
    },

    optRoundsView: function () {
        var ffTitleCfg = {
            0: ["AA支付(3房卡)", "房主支付(10房卡)"],
            1: ["AA支付(6房卡)", "房主支付(20房卡)"],
            2: ["AA支付(2房卡)", "房主支付(6房卡)"]
        };
        this._super(ffTitleCfg);
    },
});

var CreateRoomLayout_xz = BaseCreateRoomLayout.extend({
    mCacheTag : "config_xz_0_",
    ctor: function () {
        var root = util.LoadUI(XueZhanMajhongJson.CreateRoom_xz).node;
        this._super(root);


        this.mRoomData['mode'] = 0;
        this.mRoomData['person'] = 4;
        this.mRoomData['isDingQue'] = 1;
    },

    optSelectsWanFaView: function () {
        var opKeys = ["huanSan", "one9", "menQing", "tianDi"];
        this._super(opKeys);
    },

    optRoundsView: function () {
        var ffTitleCfg = {
            0: ["AA支付(3钻石)", "房主支付(10钻石)"],
            1: ["AA支付(6钻石)", "房主支付(20钻石)"],
            // 2: ["AA支付(1房卡)", "房主支付(5房卡)"]
        };
        this._super(ffTitleCfg);
    },

});
