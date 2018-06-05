
var TDKCreateRoomItem = ccui.Widget.extend({
    root: null,
    panel_root: null,
    ctor: function () {
        this._super();
        var node = util.LoadUI(TDKJson.Create).node;
        this.root = ccui.helper.seekWidgetByName(node, "panel_root").clone();
        this.addChild(this.root);
        this.setContentSize(this.root.getContentSize());

        this.person_Start = [10,9,11,2];
        this.person_Num = [5,5,4,5];

        this.tdkitem_ops = {
            round: 5,
            personIndex: 0,
            fufei: 1,
            start: 10,
            person: 5,
            king: 0,
            kingBomb: 0,
            gzBomb:0,
            xifen : 1,
            tMode:0,
            isSameIp:0,
            difen:1,
        };

        this.initUI();
    },

    initUI: function () {
        this.tdk_panel_round = ccui.helper.seekWidgetByName(this.root, "panel_round");
        this.tdk_panel_renshu = ccui.helper.seekWidgetByName(this.root, "panel_renshu");
        this.tdk_panel_fufei = ccui.helper.seekWidgetByName(this.root, "panel_fufei");
        this.tdk_panel_xifen = ccui.helper.seekWidgetByName(this.root, "panel_xifen");
        this.tdk_panel_qita = ccui.helper.seekWidgetByName(this.root, "panel_qita");
        this.tdk_panel_fanzuobi = ccui.helper.seekWidgetByName(this.root, "panel_fanzuobi");

        this.panel_rounds = new Array();
        var round_value = [1, 5, 10];
        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(this.tdk_panel_round, "panel_" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.tdk_panel_round, "checkbox_" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_tdk_round');
            if (saveOp == 1 || saveOp == 5 || saveOp == 10) {
                this.tdkitem_ops["round"] = saveOp;
            }
            var bl = this.tdkitem_ops["round"] == round_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            this.panel_rounds.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = round_value[i];
            clickData['index'] = i;
            clickData['array'] = this.panel_rounds;
            clickData['itemKey'] = "round";
            panel.addClickEventListener(this.onToggleTDK.bind(clickData));
        }

        this.panel_persons = new Array();
        for (var i = 0; i < 4; i++) {
            var panel = ccui.helper.seekWidgetByName(this.tdk_panel_renshu, "panel_ren" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.tdk_panel_renshu, "checkbox_ren" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_tdk_personIndex');
            if (saveOp == 0 || saveOp == 1 || saveOp == 2 || saveOp == 3) {
                this.tdkitem_ops["personIndex"] = saveOp;
                this.tdkitem_ops["start"] = this.person_Start[saveOp];
                this.tdkitem_ops["person"] = this.person_Num[saveOp];
            }
            var bl = this.tdkitem_ops["personIndex"] == i;
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            this.panel_persons.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = i;
            clickData['index'] = i;
            clickData['array'] = this.panel_persons;
            clickData['itemKey'] = "personIndex";
            panel.addClickEventListener(this.onToggleTDK.bind(clickData));
        }

        var panel_fufei = new Array();
        var fufei_value = [0, 1, 2];
        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(this.tdk_panel_fufei, "panel_fufei" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.tdk_panel_fufei, "checkbox_fufei" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_tdk_fufei');
            if (saveOp === '0' || saveOp == 1 || saveOp == 2) {
                this.tdkitem_ops["fufei"] = saveOp;
            }
            var bl = this.tdkitem_ops["fufei"] == fufei_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_fufei.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = fufei_value[i];
            clickData['index'] = i;
            clickData['array'] = panel_fufei;
            clickData['itemKey'] = "fufei";
            panel.addClickEventListener(this.onToggleTDK.bind(clickData));
        }

        var panel_xifen = new Array();
        var xifen_value = [1, 2, 5];
        for (var i = 0; i < 3; i++) {
            var panel = ccui.helper.seekWidgetByName(this.tdk_panel_xifen, "panel_xifen" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.tdk_panel_xifen, "checkbox_xifen" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_tdk_xifen');
            if (saveOp == 1 || saveOp == 2 || saveOp == 5) {
                this.tdkitem_ops["xifen"] = saveOp;
            }
            var bl = this.tdkitem_ops["xifen"] == xifen_value[i];
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_xifen.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = xifen_value[i];
            clickData['index'] = i;
            clickData['array'] = panel_xifen;
            clickData['itemKey'] = "xifen";
            panel.addClickEventListener(this.onToggleTDK.bind(clickData));
        }

        var fangkas = {
            "z4": [14, 28, 56],  //4人房主
            "z3": [10, 21, 42],  //3人房主
            "z2": [8, 16, 32],     //2人房主
            "z5": [4, 8, 16],    //AA
        };

        if (this.tdkitem_ops["fufei"] == 0 || this.tdkitem_ops["fufei"] == 2)  //房主付费 or 大赢家付费
        {
            var keyValue = "z" + this.tdkitem_ops["person"];
            var fangka = fangkas[keyValue];
        }
        else if (this.tdkitem_ops["fufei"] == 1) //AA付费
        {
            var fangka = fangkas['z5'];
        }

        var juNums = [1, 5, 10];
        for (var i = 0; i < this.panel_rounds.length; i++) {
            var jushu = juNums[i] + "局(钻石X" + fangka[i] + ")";
            this.panel_rounds[i]._labelNum.setString(jushu);
        }

        //是否带王
        var king_value = 1;
        var panel = ccui.helper.seekWidgetByName(this.tdk_panel_qita, "panel_king");
        var checkbox = ccui.helper.seekWidgetByName(this.tdk_panel_qita, "checkbox_king");
        checkbox.setTouchEnabled(false);
        panel._checkBox = checkbox;
        panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
        var saveOp = util.getCacheItem('config_tdk_king');
        if (saveOp == 1 || saveOp === '0') {
            this.tdkitem_ops["king"] = saveOp;
        }
        var bl = this.tdkitem_ops["king"] == 1;
        checkbox.setSelected(bl);
        var clickData = {};
        clickData['this'] = this;
        clickData['array'] = panel;
        clickData['itemKey'] = "king";
        panel.addClickEventListener(this.onToggle.bind(clickData));

        //是否带王中炮
        this.kingBomb_Ay = new Array();
        var kingBomb_value = 1;
        var panel = ccui.helper.seekWidgetByName(this.tdk_panel_qita, "panel_kingBomb");
        var checkbox = ccui.helper.seekWidgetByName(this.tdk_panel_qita, "checkbox_kingBomb");
        checkbox.setTouchEnabled(false);
        panel._checkBox = checkbox;
        panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
        var saveOp = util.getCacheItem('config_tdk_kingBomb');
        if (saveOp == 1 || saveOp === '0') {
            this.tdkitem_ops["kingBomb"] = saveOp;
        }
        var bl = this.tdkitem_ops["kingBomb"] == 1;
        checkbox.setSelected(bl);
        this.kingBomb_Ay.push(panel);
        var clickData = {};
        clickData['this'] = this;
        clickData['array'] = panel;
        clickData['itemKey'] = "kingBomb";
        panel.addClickEventListener(this.onToggle.bind(clickData));

        //0:末踢 1:把踢
        var panel_tMode = new Array();
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.tdk_panel_qita, "panel_tMode" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.tdk_panel_qita, "checkbox_tMode" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_tdk_tMode');
            if (saveOp == 1 || saveOp === '0') {
                this.tdkitem_ops["tMode"] = saveOp;
            }
            var bl = this.tdkitem_ops["tMode"] == i;
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_tMode.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = i;
            clickData['index'] = i;
            clickData['array'] = panel_tMode;
            clickData['itemKey'] = "tMode";
            panel.addClickEventListener(this.onToggleTDK.bind(clickData));
        }

        //1:共张随豹 0 共张随点
        var panel_gzBomb = new Array();
        for (var i = 0; i < 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.tdk_panel_qita, "panel_gzBomb" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.tdk_panel_qita, "checkbox_gzBomb" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
            var saveOp = util.getCacheItem('config_tdk_gzBomb');
            if (saveOp == 1 || saveOp === '0') {
                this.tdkitem_ops["gzBomb"] = saveOp;
            }
            var bl = this.tdkitem_ops["gzBomb"] == i;
            checkbox.setSelected(bl);
            if (checkbox.isSelected())
                panel._labelNum.setTextColor(CommonParam.selectColor);
            panel_gzBomb.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['itemValue'] = i;
            clickData['index'] = i;
            clickData['array'] = panel_gzBomb;
            clickData['itemKey'] = "gzBomb";
            panel.addClickEventListener(this.onToggleTDK.bind(clickData));
        }

        var panel_ops = new Array();
        this.tdk_array_qitas = [1,1,1,1,1,1];
        for (var i = 0; i < 6; i++) {
            var panel = ccui.helper.seekWidgetByName(this.tdk_panel_qita, "panel_qita" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.tdk_panel_qita, "checkbox_qita" + i);
            checkbox.setTouchEnabled(false);
            panel._checkBox = checkbox;
            var saveOp = util.getCacheItem('config_tdk_qita' + i);
            if (saveOp === '0' || saveOp == 1) {
                this.tdk_array_qitas[i] = saveOp;
            }
            var bl = this.tdk_array_qitas[i] == 1;
            checkbox.setSelected(bl);
            panel_ops.push(panel);
            var clickData = {};
            clickData['this'] = this;
            clickData['index'] = i;
            clickData['array'] = panel_ops;
            clickData['itemKey'] = "tdkqita";
            panel.addClickEventListener(this.onClickTDKQITA.bind(clickData));
        }

        var fanzuobi_value = 1;
        var panel = ccui.helper.seekWidgetByName(this.tdk_panel_fanzuobi, "panel_fanzuobi");
        var checkbox = ccui.helper.seekWidgetByName(this.tdk_panel_fanzuobi, "checkbox_fanzuobi");
        checkbox.setTouchEnabled(false);
        panel._checkBox = checkbox;
        panel._labelNum = ccui.helper.seekWidgetByName(checkbox, "content");
        var saveOp = util.getCacheItem('config_tdk_isSameIp');
        if (saveOp == 1 || saveOp === '0') {
            this.tdkitem_ops["isSameIp"] = saveOp;
        }
        var bl = this.tdkitem_ops["isSameIp"] == 1;
        checkbox.setSelected(bl);
        var clickData = {};
        clickData['this'] = this;
        clickData['array'] = panel;
        clickData['itemKey'] = "isSameIp";
        panel.addClickEventListener(this.onToggle.bind(clickData));
    },

    getLayerChild:function () {
        return this.listViewCell;
    },

    onToggle: function () {
        var _this = this['this'];
        var panel = this['array'];
        var key = this['itemKey'];
        var value = parseInt(_this.tdkitem_ops[key]);

        if(key == 'kingBomb')
        {
            if(parseInt(_this.tdkitem_ops['king']))
            {
                panel._checkBox.setSelected(!value);
                _this.tdkitem_ops[key] = panel._checkBox.isSelected() ? 1 : 0;
                if(value)
                {
                    panel._labelNum.setTextColor(CommonParam.selectColor);
                }
                else
                {
                    panel._labelNum.setTextColor(CommonParam.unselectColor);
                }
            }
        }
        else
        {
            if(key == 'king')
            {
                if(value)
                {
                    _this.kingBomb_Ay[0]._checkBox.setSelected(!value);
                    _this.tdkitem_ops['kingBomb'] = !value;
                }
            }
            panel._checkBox.setSelected(!value);
            _this.tdkitem_ops[key] = panel._checkBox.isSelected() ? 1 : 0;
            if(value)
            {
                panel._labelNum.setTextColor(CommonParam.selectColor);
            }
            else
            {
                panel._labelNum.setTextColor(CommonParam.unselectColor);
            }
        }
    },

    onToggleTDK: function () {
        var index = this['index'];
        var _this = this['this'];
        var array = this['array'];
        var key = this['itemKey'];
        var value = this['itemValue'];

        if (key == "personIndex")
        {
            _this.tdkitem_ops['personIndex'] = index;
            _this.tdkitem_ops['start'] = _this.person_Start[index];
            _this.tdkitem_ops['person'] = _this.person_Num[index];
        }
        else
        {
            _this.tdkitem_ops[key] = value;
        }

        if(key == 'xifen')
        {
            if(array[index]._checkBox.isSelected())
            {
                array[index]._checkBox.setSelected(false);
                _this.tdkitem_ops['xifen'] = 0;
            }
            else
            {
                for (var i = 0; i < array.length; i++) {
                    array[i]._checkBox.setSelected(i == index);
                    if (i == index) {
                        array[i]._labelNum.setTextColor(CommonParam.selectColor);
                    } else {
                        array[i]._labelNum.setTextColor(CommonParam.unselectColor);
                    }
                }
            }
        }
        else
        {
            for (var i = 0; i < array.length; i++) {
                array[i].setTouchEnabled(i != index);
                array[i]._checkBox.setSelected(i == index);
                if (i == index) {
                    array[i]._labelNum.setTextColor(CommonParam.selectColor);
                } else {
                    array[i]._labelNum.setTextColor(CommonParam.unselectColor);
                }
            }
        }

        if (key == "personIndex" || key == "fufei") {
            var fangkas = {
                "z4": [14, 28, 56],  //4人房主
                "z3": [10, 21, 42],  //3人房主
                "z2": [8, 16, 32],     //2人房主
                "z5": [4, 8, 16],    //AA
            };

            if (_this.tdkitem_ops["fufei"] == 0 || _this.tdkitem_ops["fufei"] == 2)  //房主付费 or 大赢家付费
            {
                var keyValue = "z" + _this.tdkitem_ops["person"];
                var fangka = fangkas[keyValue];
            }
            else if (_this.tdkitem_ops["fufei"] == 1) //AA付费
            {
                var fangka = fangkas['z5'];
            }

            var juNums = [1, 5, 10];
            for (var i = 0; i < _this.tdk_panel_round.length; i++) {
                var jushu = juNums[i] + "局(钻石X" + fangka[i] + ")";
                _this.tdk_panel_round[i]._labelNum.setString(jushu);
            }
        }
    },

    onClickTDKQITA: function () {
        var _this = this["this"];
        var index = this["index"];
        var array = this['array'];
        var checkBox = array[index]._checkBox;
        JJLog.print("select", index, this);
        checkBox.setSelected(!checkBox.isSelected());
        _this.tdk_array_qitas[index] = checkBox.isSelected() ? 1 : 0;
    },

    recordNewConfig: function () {
        util.setCacheItem('config_gameindex', this.gameIndex);
        for (var key in this.tdkitem_ops) {
            util.setCacheItem('config_tdk_' + key, this.tdkitem_ops[key]);
        }
        for (var i = 0; i < this.tdk_array_qitas.length; i++) {
            util.setCacheItem('config_tdk_qita' + i, this.tdk_array_qitas[i]);
        }
    },

    getCreateRoomData:function () {
        var roomData = {};
        var data = {};
        var appId;
        data['uid'] = hall.user.uid;
        data['person'] = this.tdkitem_ops["person"];
        data['rounds'] = this.tdkitem_ops["round"];
        data['aaGem'] = this.tdkitem_ops["fufei"];
        data['xifen'] = this.tdkitem_ops["xifen"];
        data['start'] = this.tdkitem_ops["start"];

        data['king'] = this.tdkitem_ops["king"];
        data['kingBomb'] = this.tdkitem_ops["kingBomb"];
        data['tMode'] = this.tdkitem_ops["tMode"];
        data['gzBomb'] = this.tdkitem_ops["gzBomb"];
        data['isSameIp'] = this.tdkitem_ops["isSameIp"];

        data['jinyan'] = this.tdk_array_qitas[0];
        data['languo'] = this.tdk_array_qitas[1];
        data['lastT'] = this.tdk_array_qitas[2];
        data['showCard'] = this.tdk_array_qitas[3];
        data['ABig'] = this.tdk_array_qitas[4];
        data['auto'] = this.tdk_array_qitas[5];
        data['difen'] = this.tdkitem_ops["difen"];
        data['tableName'] = "tiandakeng";
        data['serverType'] = 'tiandakeng';

        JJLog.print('创建=' + JSON.stringify(data));
        roomData['appId'] = TDKPoker.appId;
        roomData['data'] = data;
        return roomData;
    },

    onEnter: function () {
        this._super();
        this.registerAllEvents();
    },

    onExit: function () {
        this._super();
        this.removeAllEvents();
    },

    registerAllEvents: function () {

    },

    removeAllEvents: function () {

    },
});