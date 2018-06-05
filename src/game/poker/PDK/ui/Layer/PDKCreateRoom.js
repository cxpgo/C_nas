var PDKCreateRoomLayout = cc.Layer.extend({
    mCacheTag: "config_pdk_",
    score: 0,
    panel_ops:null,
    mRoomData:null,
    panel_wanfa:null,
    ctor: function () {
        this._super();

        var root = util.LoadUI(PDKPokerJson.PDKCreateRoom).node;
        this.mRoot = root;
        this.setContentSize(root.getContentSize());
        this.addChild(root);

        var roomData = {};
        roomData['tableName'] = 'paodekuai';
        roomData['serverType'] = 'paodekuai';
        roomData['uid'] = hall.user.uid;
        roomData['rounds'] = 10;
        roomData['aaGem'] = 0;
        roomData['isSameIp'] = 0;
        roomData['mustContain'] = 0;
        roomData['showNum'] = 0;
        roomData['mode'] = 16;
        roomData['person'] = 3;
        roomData['firstMode'] = 0;
        roomData['a3Bomb'] = 1;
        roomData['bombScore'] = 1;


        this.mRoomData = roomData;

        this.panel_pdk = ccui.helper.seekWidgetByName(root, "panel_pdk");
        this.pdkitem_ops = {round: 10, aaGem: 0, showNum: 0, person: 3, mode: 0}

        var panel_rounds = new Array();
        var round_value = [10, 20, 30];
        var cost = {"10": 4, "20": 8, "30": 12}
        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_pdk, "panel_" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_pdk, "checkbox_" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            panel._labelNum.setString(round_value[i] + "局(钻石X" + cost[round_value[i]] + ")")
            var saveOp = util.getCacheItem(this.mCacheTag + 'rounds');
            if (saveOp == 10 || saveOp === 20 || saveOp == 30) {
                this.mRoomData["rounds"] = saveOp;
            }
            var bl = this.mRoomData["rounds"] == round_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_rounds.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = round_value[i];
            clickData['index'] = i;
            clickData['array'] = panel_rounds;
            clickData['itemKey'] = "rounds";
            panel.addClickEventListener(this.onTogglePDK.bind(clickData));
        }

        var panel_person = new Array();
        var person_value = [3, 2];
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_pdk, "panel_person" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_pdk, "checkbox_person" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem(this.mCacheTag + 'person');
            if (saveOp == 3 || saveOp == 2) {
                this.mRoomData["person"] = saveOp;
            }
            var bl = this.mRoomData["person"] == person_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_person.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = person_value[i];
            clickData['index'] = i;
            clickData['array'] = panel_person;
            clickData['itemKey'] = "person";
            panel.addClickEventListener(this.onTogglePDK.bind(clickData));
        }

        var panel_mode = new Array();
        var mode_value = [16, 15];
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_pdk, "panel_shoupai_" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_pdk, "checkbox_shoupai_" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem(this.mCacheTag + 'mode');
            if (saveOp == 16 || saveOp == 15) {
                this.mRoomData["mode"] = saveOp;
            }
            var bl = this.mRoomData["mode"] == mode_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_mode.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = mode_value[i];
            clickData['index'] = i;
            clickData['array'] = panel_mode;
            clickData['itemKey'] = "mode";
            panel.addClickEventListener(this.onTogglePDK.bind(clickData));
        }

        var panel_fufei = new Array();
        var fufei_value = [0, 1, 2];
        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_pdk, "panel_fufei" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_pdk, "checkbox_fufei" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem(this.mCacheTag + 'aaGem');
            if (saveOp === '0' || saveOp == 1 || saveOp == 2) {
                this.mRoomData["aaGem"] = saveOp;
            }
            var bl = this.mRoomData["aaGem"] == fufei_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_fufei.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = fufei_value[i];
            clickData['index'] = i;
            clickData['array'] = panel_fufei;
            clickData['itemKey'] = "aaGem";
            panel.addClickEventListener(this.onTogglePDK.bind(clickData));
        }

        var panel_showNum = new Array();
        var showNum_value = [1, 0];
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_pdk, "panel_shengyu_" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_pdk, "checkbox_shengyu_" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem(this.mCacheTag + 'showNum');
            if (saveOp == 1 || saveOp === '0') {
                this.mRoomData["showNum"] = saveOp;
            }
            var bl = this.mRoomData["showNum"] == showNum_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_showNum.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = showNum_value[i];
            clickData['index'] = i;
            clickData['array'] = panel_showNum;
            clickData['itemKey'] = "showNum";
            panel.addClickEventListener(this.onTogglePDK.bind(clickData));
        }

        this.panel_wanfa = new Array();
        var wanfa_value = [1, 0];
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_pdk, "panel_wanfa_" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_pdk, "checkbox_wanfa_" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem(this.mCacheTag + 'firstMode');
            if (saveOp == 1 || saveOp === '0') {
                this.mRoomData["firstMode"] = saveOp;
            }
            var bl = this.mRoomData["firstMode"] == wanfa_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            this.panel_wanfa.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = wanfa_value[i];
            clickData['index'] = i;
            clickData['array'] = this.panel_wanfa;
            clickData['itemKey'] = "firstMode";
            panel.addClickEventListener(this.onTogglePDK.bind(clickData));
        }

        this.panel_ops = new Array();
        var panel = ccui.helper.seekWidgetByName(this.panel_pdk, "panel_wanfa_2");
        var checkbox = ccui.helper.seekWidgetByName(this.panel_pdk, "checkbox_wanfa_2");
        checkbox.setTouchEnabled(false);
        panel._checkBox = checkbox;
        panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
        var saveOp = util.getCacheItem(this.mCacheTag + 'mustContain');
        if (saveOp == 1 || saveOp === '0') {
            this.mRoomData["mustContain"] = saveOp;
        }
        var bl = this.mRoomData["mustContain"] == 1;
        checkbox.setSelected(bl);
        this.panel_ops.push(panel);
        var clickData = {};
        clickData['this'] = this;
        clickData['index'] = 0;
        clickData['checkBox'] = checkbox;
        // clickData['array'] = this.panel_ops;
        clickData['itemKey'] = "mustContain";
        panel.addClickEventListener(this.onClickPDKOp.bind(clickData));

        var panel = ccui.helper.seekWidgetByName(this.panel_pdk, "panel_boom");
        var checkbox = ccui.helper.seekWidgetByName(this.panel_pdk, "checkbox_boom");
        checkbox.setTouchEnabled(false);
        panel._checkBox = checkbox;
        panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
        var saveOp = util.getCacheItem(this.mCacheTag + 'bombScore');
        if (saveOp == 1 || saveOp === '0') {
            this.mRoomData["bombScore"] = saveOp;
        }
        var bl = this.mRoomData["bombScore"] == 1;
        checkbox.setSelected(bl);
        var clickData = {};
        clickData['this'] = this;
        clickData['index'] = 0;
        clickData['checkBox'] = checkbox;
        clickData['itemKey'] = "bombScore";
        panel.addClickEventListener(this.onClickPDKOp.bind(clickData));


        if (this.mRoomData["person"] == 2) {
          this.panel_ops[0]._checkBox.setSelected(false);
          this.panel_ops[0]._labelNum.setTextColor(cc.color.GRAY);
          this.panel_ops[0].setTouchEnabled(false);

          this.panel_wanfa[0]._checkBox.setSelected(true);
          this.panel_wanfa[1]._checkBox.setSelected(false);
          this.panel_wanfa[1]._labelNum.setTextColor(cc.color.GRAY);
          this.panel_wanfa[1].setTouchEnabled(false);
          this.panel_wanfa[0].setTouchEnabled(false);

          this.mRoomData['firstMode'] = 1;
        }
        if (this.mRoomData["firstMode"] == 1) {
            this.panel_ops[0]._checkBox.setSelected(false);
            this.panel_ops[0]._labelNum.setTextColor(cc.color.GRAY);
            this.panel_ops[0].setTouchEnabled(false);
        } else {
            this.panel_ops[0]._labelNum.setTextColor(CommonParam.unselectColor);
            this.panel_ops[0].setTouchEnabled(true);
        }
    },

    onTogglePDK: function () {
        var index = this['index'];
        var _this = this['this'];
        var array = this['array'];
        var key = this['itemKey'];
        var value = this['itemValue'];
        JJLog.print("!!!!!!!!!!!", key, value)
        _this.mRoomData[key] = value;
        if (key == "person") {
            if (value == 2) {
                _this.panel_ops[0]._checkBox.setSelected(false);
                _this.panel_ops[0]._labelNum.setTextColor(cc.color.GRAY);
                _this.panel_ops[0].setTouchEnabled(false);

                _this.panel_wanfa[0]._checkBox.setSelected(true);
                _this.panel_wanfa[0]._labelNum.setTextColor(CommonParam.selectColor);
                _this.panel_wanfa[1]._checkBox.setSelected(false);
                _this.panel_wanfa[1]._labelNum.setTextColor(cc.color.GRAY);
                _this.panel_wanfa[1].setTouchEnabled(false);
                _this.panel_wanfa[0].setTouchEnabled(false);

                _this.mRoomData['firstMode'] = 1;
                _this.mRoomData['mustContain'] = 0;
            } else {
                _this.panel_ops[0]._labelNum.setTextColor(CommonParam.unselectColor);
                _this.panel_wanfa[1]._labelNum.setTextColor(CommonParam.unselectColor);
                _this.panel_ops[0].setTouchEnabled(false);
                _this.panel_wanfa[1].setTouchEnabled(true);
                _this.panel_wanfa[0].setTouchEnabled(true);
            }
        }
        if (key == "firstMode") {
            if (value == 1) {
                _this.panel_ops[0]._checkBox.setSelected(false);
                _this.panel_ops[0]._labelNum.setTextColor(cc.color.GRAY);
                _this.panel_ops[0].setTouchEnabled(false);
                _this.mRoomData['mustContain'] = 0;
            } else {
                _this.panel_ops[0]._labelNum.setTextColor(CommonParam.unselectColor);
                _this.panel_ops[0].setTouchEnabled(true);
            }
        }
        for (var i = 0; i < array.length; i++) {
            array[i].setTouchEnabled(i != index);
            array[i]._checkBox.setSelected(i == index);
            if (i == index) {
                array[i]._labelNum.setTextColor(CommonParam.selectColor);
            } else {
                array[i]._labelNum.setTextColor(CommonParam.unselectColor);
            }
        }
    },
    onClickPDKOp: function () {
        var _this = this["this"];
        var index = this["index"];
        var checkBox = this["checkBox"];
        var itemKey = this["itemKey"];
        // var array = this['array'];
        // var checkBox = array[index]._checkBox;
        JJLog.print("select", index, this);
        checkBox.setSelected(!checkBox.isSelected());
        _this.mRoomData[itemKey] = checkBox.isSelected() ? 1 : 0;
    },

    getCreateData: function () {

        return this.mRoomData;
    },

    getCreateRoomData: function () {
        var roomData = {};
        roomData['appId'] = PDKPoker.appId;
        roomData['data'] = this.mRoomData;
        return roomData;
    },

    recordNewConfig: function () {
        for (var key in this.mRoomData) {
            util.setCacheItem(this.mCacheTag + key, this.mRoomData[key]);
        }
    },

});