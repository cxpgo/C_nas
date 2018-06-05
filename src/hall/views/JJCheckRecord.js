var JJCheckRecord = JJDialog.extend({
    panel_root: null,
    textfield_input: null,
    btn_confirm: null,
    btn_cancel: null,
    ctor: function () {
        this._super();
        var root = util.LoadUI(GameHallJson.CheckRecord).node;
        this.addChild(root);

        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        this.textfield_input = ccui.helper.seekWidgetByName(root, "textfield_input");
        this.textfield_input.setPlaceHolderColor(cc.color.GRAY);
        this.textfield_input.setTextColor(cc.color.BLACK);


        this.btn_confirm = ccui.helper.seekWidgetByName(root, "btn_confirm");
        this.btn_confirm.addClickEventListener(this.onCheckRecord.bind(this));
        this.btn_cancel = ccui.helper.seekWidgetByName(root, "btn_cancel");
        this.btn_cancel.addClickEventListener(this.dismissDialog.bind(this));


    },

    onEnter: function () {
        this._super();
    },


    onExit: function () {
        this._super();
    },


    onCheckRecord: function () {
        if (this.checkInput()) {
            var recordId = this.textfield_input.getString();
            MajhongLoading.show('加载中...');
            hall.net.getHuiFangInfo(recordId, function (data) {
                if (data['code'] == 200) {
                    hall.enterRecord(GAMETYPES[data['serverType']], data['record']);
                } else if (data['code'] == 500) {
                    MajhongLoading.dismiss();
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data['err']);
                    dialog.showDialog();
                }
            });
        }

    },

    checkInput: function () {
        var stdId = this.textfield_input.getString();
        if (stdId.length < 6) {
            var dialog = new JJConfirmDialog();
            dialog.setDes('录像ID长度少于6');
            dialog.showDialog();
            return false;
        }

        var re = /^[1-9]+[0-9]*]*$/;

        if (!re.test(stdId)) {
            var dialog = new JJConfirmDialog();
            dialog.setDes('录像ID必须为数字');
            dialog.showDialog();
            return false;
        }


        if (!re.test(stdId)) {
            var dialog = new JJConfirmDialog();
            dialog.setDes('录像ID必须为整数');
            dialog.showDialog();
            return false;
        }
        return true;
    },


});