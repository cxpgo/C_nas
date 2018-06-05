var DDZCreateRoomLayout = cc.Layer.extend({
    mCacheTag: "config_ddz_",
    score: 0,
    panel_ops:null,
    mRoomData:null,
    panel_wanfa:null,
    mRoot:null,
    ctor: function () {
        this._super();
        var root = util.LoadUI(DDZPokerJson.DDZCreateRoom).node;
        this.mRoot = root;
        this.setContentSize(root.getContentSize());
        this.addChild(root);

        var roomData = {};
        roomData['uid'] = hall.user.uid;
        roomData['area'] = "doudizhu";
        roomData['person'] = 3;
        roomData['rounds'] = 4;
        roomData['aaGem'] = 0;
        roomData['isSameIp'] = 1;
        roomData['mustContain'] = 1;
        roomData['showNum'] = 1;
        roomData['mode'] = 1;
        roomData['maxBomb'] = 3;
        roomData['firstMode'] = 1;
        roomData['isLaiZi'] = 0;
        roomData['banker'] = 0;
        roomData['mustLord'] = 0;
        roomData['mustDouble'] = 1;
        roomData['tableName'] = 'doudizhu';
        roomData['serverType'] = 'doudizhu';

        this.mRoomData = roomData;

        this.initUI();
    },
    initUI: function () {
        var panel_ddz = ccui.helper.seekWidgetByName(this.mRoot, "panel_ddz");

        var panel_rounds = new Array();
        var round_value = [4, 6, 8];
        var cost = {"4": 24, "6": 36, "8": 45}
        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(panel_ddz, "panel_" + i);
            var checkbox = ccui.helper.seekWidgetByName(panel_ddz, "checkbox_" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            panel._labelNum.setString(round_value[i] + "局(钻石X" + cost[round_value[i]] + ")")
            var saveOp = util.getCacheItem('config_ddz_rounds');
            if (saveOp == 4 || saveOp == 6 || saveOp == 8) {
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
            panel.addClickEventListener(this.onToggleDDZ.bind(clickData));
        }

        var panel_fengding = new Array();
        var fengding_value = [3, 4, 5];
        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(panel_ddz, "panel_fengd" + i);
            var checkbox = ccui.helper.seekWidgetByName(panel_ddz, "checkbox_fengd" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_ddz_maxBomb');
            if (saveOp == 4 || saveOp == 3 || saveOp == 5) {
                this.mRoomData["maxBomb"] = saveOp;
            }
            var bl = this.mRoomData["maxBomb"] == fengding_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_fengding.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = fengding_value[i];
            clickData['index'] = i;
            clickData['array'] = panel_fengding;
            clickData['itemKey'] = "maxBomb";
            panel.addClickEventListener(this.onToggleDDZ.bind(clickData));
        }

        var panel_fufei = new Array();
        var fufei_value = [0, 1, 2];
        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(panel_ddz, "panel_fufei" + i);
            var checkbox = ccui.helper.seekWidgetByName(panel_ddz, "checkbox_fufei" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_ddz_aaGem');
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
            panel.addClickEventListener(this.onToggleDDZ.bind(clickData));
        }

        var panel_person = new Array();
        var person_value = [3, 2];
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(panel_ddz, "panel_ren" + i);
            var checkbox = ccui.helper.seekWidgetByName(panel_ddz, "checkbox_ren" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_ddz_person');
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
            panel.addClickEventListener(this.onToggleDDZ.bind(clickData));
        }

        this.panel_mode = new Array();
        var mode_value = [1, 2];
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(panel_ddz, "panel_wanfa_" + i);
            var checkbox = ccui.helper.seekWidgetByName(panel_ddz, "checkbox_wanfa_" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_ddz_mode');
            if (saveOp == 1 || saveOp == 2) {
                this.mRoomData["mode"] = saveOp;
            }
            var bl = this.mRoomData["mode"] == mode_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            this.panel_mode.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = mode_value[i];
            clickData['index'] = i;
            clickData['array'] = this.panel_mode;
            clickData['itemKey'] = "mode";
            panel.addClickEventListener(this.onToggleDDZ.bind(clickData));
        }

        for(var j = 0;j < 2; j++)
        {
            if(this.mRoomData["person"] == 3)
            {
                this.panel_mode[j].setVisible(true);
                this.panel_mode[j]._checkBox.setVisible(true);
            }
            else if(this.mRoomData["person"] == 2)
            {
                if(j == 0)
                {
                    this.panel_mode[j].setVisible(true);
                    this.panel_mode[j]._checkBox.setVisible(true);
                    this.panel_mode[j]._checkBox.setSelected(true);
                    this.mRoomData["mode"] = 1;
                }
                else
                {
                    this.panel_mode[j].setVisible(false);
                    this.panel_mode[j]._checkBox.setVisible(false);
                }
            }
        }

        var panel_showNum = new Array();
        var showNum_value = [1, 0];
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(panel_ddz, "panel_shengyu_" + i);
            var checkbox = ccui.helper.seekWidgetByName(panel_ddz, "checkbox_shengyu_" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_ddz_isLaiZi');
            if (saveOp == 1 || saveOp === '0') {
                this.mRoomData["isLaiZi"] = saveOp;
            }
            var bl = this.mRoomData["isLaiZi"] == showNum_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_showNum.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = showNum_value[i];
            clickData['index'] = i;
            clickData['array'] = panel_showNum;
            clickData['itemKey'] = "isLaiZi";
            panel.addClickEventListener(this.onToggleDDZ.bind(clickData));
        }
    },

    onToggleDDZ: function () {
        var index = this['index'];
        var _this = this['this'];
        var array = this['array'];
        var key = this['itemKey'];
        var value = this['itemValue'];
        _this.mRoomData[key] = value;
        for (var i = 0; i < array.length; i++) {
            array[i].setTouchEnabled(i != index);
            array[i]._checkBox.setSelected(i == index);
            if (i == index) {
                array[i]._labelNum.setTextColor(CommonParam.selectColor);
            } else {
                array[i]._labelNum.setTextColor(CommonParam.unselectColor);
            }
        }
        if(key == 'person')
        {
            for(var j = 0;j < 2; j++)
            {
                if(value == 3)
                {
                    _this.panel_mode[j].setVisible(true);
                    _this.panel_mode[j].setTouchEnabled(true);
                    _this.panel_mode[j]._checkBox.setVisible(true);

                }
                else if(value == 2)
                {
                    if(j == 0)

                    {
                        _this.panel_mode[j].setVisible(true);
                        _this.panel_mode[j]._checkBox.setVisible(true);
                        _this.panel_mode[j]._checkBox.setSelected(true);
                        _this.mRoomData["mode"] = 1;
                    }
                    else
                    {
                        _this.panel_mode[j].setVisible(false);
                        _this.panel_mode[j]._checkBox.setVisible(false);
                        _this.panel_mode[j]._checkBox.setSelected(false);
                    }
                }
            }
        }
    },

    getCreateRoomData: function () {
        var roomData = {};
        roomData['appId'] = DDZPoker.appId;
        roomData['data'] = this.mRoomData;
        return roomData;
    },

    recordNewConfig: function () {
        for (var key in this.mRoomData) {
            util.setCacheItem(this.mCacheTag + key, this.mRoomData[key]);
        }
    },

});