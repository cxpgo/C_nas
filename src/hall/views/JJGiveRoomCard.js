var JJGiveRoomCard = JJDialog.extend({
    panel_root: null,
    text_id: null,
    text_amount: null,
    textfield_id: null,
    textfield_amount: null,
    btn_give: null,
    btn_cancel: null,
    text_tip: null,
    ctor: function () {
        this._super();
        var root = util.LoadUI(GameHallJson.SendRoomCard).node;
        this.addChild(root);

        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        this.text_tip = ccui.helper.seekWidgetByName(root, "text_tip");
        this.text_tip.setVisible(false);
        this.text_id = ccui.helper.seekWidgetByName(root, "text_id");
        this.text_amount = ccui.helper.seekWidgetByName(root, "text_amount");
        this.textfield_id = ccui.helper.seekWidgetByName(root, "textfield_id");
        this.textfield_id.setPlaceHolderColor(cc.color.GRAY);
        this.textfield_id.setTextColor(cc.color.BLACK);

        this.textfield_amount = ccui.helper.seekWidgetByName(root, "textfield_amount");
        this.textfield_amount.setPlaceHolderColor(cc.color.GRAY);
        this.textfield_amount.setTextColor(cc.color.BLACK);
        this.btn_give = ccui.helper.seekWidgetByName(root, "btn_give");
        this.btn_give.addClickEventListener(this.onGive.bind(this));
        this.btn_cancel = ccui.helper.seekWidgetByName(root, "btn_cancel");
        this.btn_cancel.addClickEventListener(this.dismissDialog.bind(this));


    },

    onEnter: function () {
        this._super();
        this.updateInfo();
        this.registerAllEvents();
    },


    onExit: function () {
        this._super();
        this.removeAllEvents();
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
    },
    removeAllEvents: function () {
        qp.event.stop(this, 'hallUpdatePlayerAttr');

    },
    onUpdatePlayerAttr: function (data) {
        JJLog.print('hall onUpdatePlayerAttr');
        JJLog.print(data);

        if (data['gemNum'] != null || data['gemNum'] != undefined) {
            //this.text_amount.setString(data['gemNum']);
            this.text_amount.setString('钻石：' + data['gemNum']);
        }

    },

    resetInput: function () {
        this.textfield_amount.setString('');
        this.textfield_id.setString('');
    },

    updateInfo: function () {
        this.text_id.setString('ID：' + hall.user.uid);
        this.text_amount.setString('钻石：' + hall.user.gemNum);
    },

    onGive: function () {
        if (this.checkInput() || 1) {
            JJLog.print('赠送给:' + this.textfield_id.getString() + ' 赠送数量：' + this.textfield_amount.getString());
            var data = {};
            data['type'] = 1;
            data['gemNum'] = this.textfield_amount.getString();
            data['giveUid'] = this.textfield_id.getString();
            var str = '';
            str = '赠送ID:' + data['giveUid'] + ',' + data['gemNum'] + '钻石?';
            var dialog = new JJMajhongDecideDialog();
            dialog.setDes(str);
            dialog.setCallback(this.giveRoomCard.bind(this));
            dialog.showDialog();

        }

    },

    giveRoomCard: function () {
        JJLog.print('resp 赠送:' + this.textfield_id.getString() + ' 赠送数量：' + this.textfield_amount.getString());
        var data2 = {};
        data2['type'] = 1;
        data2['gemNum'] = this.textfield_amount.getString();
        data2['giveUid'] = this.textfield_id.getString();

        var tipStr = '赠送给玩家ID:' + this.textfield_id.getString() + ',' + this.textfield_amount.getString() + '钻石成功!';
        majhong.net.giveRoomCard(data2, function (data) {
            JJLog.print(data);
            if (data['code'] == 200) {
                var dialog = new JJConfirmDialog();
                dialog.setDes(tipStr);
                dialog.showDialog();
            } else if (data['code'] == 500) {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data['err']);
                dialog.showDialog();
            }

        });
    },

    checkInput: function () {
        this.text_tip.setVisible(false);

        var stdId = this.textfield_id.getString();
        if (stdId.length <= 0) {
            this.text_tip.setString("赠送ID不能为空!");
            this.text_tip.setVisible(true);
            return false;
        }

        var amount = this.textfield_amount.getString();

        if (amount.length <= 0) {
            this.text_tip.setString("赠送数量不能为空!");
            this.text_tip.setVisible(true);
            return false;
        }


        var re = /^[1-9]+[0-9]*]*$/;

        if (!re.test(stdId)) {
            this.text_tip.setString("赠送ID必须为数字!");
            this.text_tip.setVisible(true);
            return false;
        }


        if (!re.test(amount)) {
            this.text_tip.setString("赠送数量必须为整数!");
            this.text_tip.setVisible(true);
            return false;
        }

        if (amount > hall.user.gemNum) {
            this.text_tip.setString("赠送钻石数量超过当前账户数量!");
            this.text_tip.setVisible(true);
            return false;
        }


        return true;

    },


});