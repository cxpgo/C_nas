
var JJDialog = cc.Layer.extend({
    btn_close: null,
    panel: null,
    ctor: function () {
        this._super();
    },

    initUI: function () {

        this.btn_close = ccui.helper.seekWidgetByName(this.root, "btn_close");
        if (this.btn_close != null && this.btn_close != undefined) {
            this.btn_close.addClickEventListener(this.dismissDialog.bind(this));
            this.btn_close.setVisible(true);
        }

    },
    onEnter: function () {
        this._super();
    },


    showDialog: function () {
        if(this.panel)
        {
            this.panel.setScale(0.3)
            this.panel.runAction(cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()))
        }
        cc.director.getRunningScene().addChild(this, 999);
    },

    dismissDialog: function () {
        this.removeFromParent();
    },


});

// /// 百搭用 打出百搭牌的时候提示
// var JJMajhongDecideDialog2 = JJDialog.extend({
//     text_des: null,
//     btn_baida: null,
//     btn_da: null,
//     btn_cancel: null,
//     confirmCb: null,
//     cancelCb: null,
//     daCb: null,
//     ctor: function () {
//         this._super();
//         var root = util.LoadUI(BDMajhongJson.Decide).node;
//         this.addChild(root);
//         this.text_des = ccui.helper.seekWidgetByName(root, "text_des");
//         this.btn_baida = ccui.helper.seekWidgetByName(root, "btn_baida");
//         this.btn_da = ccui.helper.seekWidgetByName(root, "btn_da");
//         this.btn_cancel = ccui.helper.seekWidgetByName(root, "btn_cancel");
//         this.btn_cancel.addClickEventListener(this.dismissDialog.bind(this));
//         var _this = this;
//         this.btn_baida.addClickEventListener(function () {
//             _this.removeFromParent();
//             if (_this.confirmCb != null)
//                 _this.confirmCb();
//         });
//
//         this.btn_da.addClickEventListener(function () {
//             _this.removeFromParent();
//             if (_this.daCb != null)
//                 _this.daCb();
//         });
//     },
//
//     dismissDialog: function () {
//         this._super();
//         if (this.cancelCb != null)
//             this.cancelCb();
//     },
//
//     setCancelCal: function (cb) {
//         this.cancelCb = cb;
//     },
//
//     setCallback: function (confirmCb) {
//         this.confirmCb = confirmCb;
//     },
//
//     setCallback2: function (daCb) {
//         this.daCb = daCb;
//     },
//
//     setDes: function (text) {
//         if(text == undefined || text == null) text = "";
//         this.text_des.setString(text);
//     },
//
// });




