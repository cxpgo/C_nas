
    var MajhongBindCode = cc.Layer.extend({
        textArray:null,
        btnArray:null,
        btnConfirm:null,
        gameHall:null,
        panel:null,
        ctor:function(hall){
            this._super();
            this.gameHall = hall;
            var root = util.LoadUI(GameHallJson.BindCode).node;
            this.addChild(root);
            this.btnArray = new Array();
            for(var i = 0;i < 10;i++)
            {
                var str = "btn_"+i;
                var btn = ccui.helper.seekWidgetByName(root,str);
                btn.setTag(i);
                var data = {};
                data['root'] = this;
                data['tag'] = i;
                btn.addClickEventListener(this.onNum.bind(data));
                btn.addTouchEventListener(util.btnTouchEvent);
                this.btnArray.push(btn);
            }

            this.textArray = new Array();
            for(var i = 0 ;i<6;i++)
            {
                var str = "text"+i;
                var text = ccui.helper.seekWidgetByName(root,str);
                text.setString('');
                this.textArray.push(text);
            }

            var btn_del = ccui.helper.seekWidgetByName(root,"btn_del");
            btn_del.addClickEventListener(this.onDel.bind(this));
            btn_del.addTouchEventListener(util.btnTouchEvent);

            var btn_reset = ccui.helper.seekWidgetByName(root,"btn_reset");
            btn_reset.addClickEventListener(this.onRest.bind(this));
            btn_reset.addTouchEventListener(util.btnTouchEvent);

            var btn_close = ccui.helper.seekWidgetByName(root,"btn_close");
            btn_close.addClickEventListener(function(){
                this.removeFromParent();
            }.bind(this));
            btn_close.addTouchEventListener(util.btnTouchEvent);

            this.btnConfirm = ccui.helper.seekWidgetByName(root,"btn_confirm");
            this.btnConfirm.addClickEventListener(this.onBind.bind(this));
            this.btnConfirm.addTouchEventListener(util.btnTouchEvent);
            this.panel = ccui.helper.seekWidgetByName(root,"panel_room");
        },

        onNum:function()
        {
            var root = this['root'];
            if ( root.textArray[root.textArray.length-1].length > 0)
                return;
            var num = this['tag'];
            for(var i = 0 ;  i < root.textArray.length;i++)
            {
                var text = root.textArray[i];
                if(text.getString().length  <= 0)
                {
                    text.setString(num);
                    break;
                }
            }
            var roomId = '';
            for(var i = 0 ;  i < root.textArray.length;i++)
            {
                var text = root.textArray[i];
                roomId += text.getString();
                if(text.getString().length  <= 0)
                {
                    return;
                }
            }
        },

        onBind:function()
        {
            if ( this.textArray[this.textArray.length-1].length == 0)
                return;

            var code = '';
            for(var i = 0 ;  i < this.textArray.length;i++)
            {
                var text = this.textArray[i];
                code += text.getString();
                if(text.getString().length  <= 0)
                {
                    return;
                }
            }
            this.btnConfirm.setTouchEnabled(false);

            this.bindCodeFun();
        },

        bindCodeFun:function () {
            hall.net.bindCode({'uid':hall.user.uid ,'inviteCode':code,'serverType':GAMENAME},function(data)
            {
                this.btnConfirm.setTouchEnabled(true);
                JJLog.print('绑定回调=' + JSON.stringify(data));
                if(data['code'] == 200)
                {
                    hall.user['agentCode'] = '1';
                    this.btnConfirm.setVisible(false);
                    this.gameHall.onHideBindCode();
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("绑定成功");
                    dialog.showDialog();
                }else
                {
                    if(data['msg'] != undefined && data['msg'] != null)
                    {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(data['msg']);
                        dialog.showDialog();
                    }
                }
            }.bind(this))
        },

        showErr: function (data) {
            this.onRest();
            var dialog = new JJConfirmDialog();
            dialog.setDes(data['error']);
            dialog.showDialog();
        },

        onRest: function () {
            for(var i = 0; i < this.textArray.length;i++)
            {
                var text = this.textArray[i];
                text.setString('');

            }
        },

        onDel: function () {

            for(var i = this.textArray.length;i>0;i--)
            {
                var text = this.textArray[i-1];
                if(text.getString().length > 0)
                {
                    text.setString('');
                    break;
                }
            }
        },

        onEnter: function(){
            this._super();

        },

        showBindCode: function () {
            if(this.panel)
            {
                this.panel.setScale(0.3)
                this.panel.runAction(cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1, 1)))
            }
            cc.director.getRunningScene().addChild(this);
        },

    });

// var MajhongBindCode = cc.Layer.extend({
//     textfield_code:null,
//     btn_bind:null,
//     btn_close:null,
//     img_isbind:null,
//     ctor: function () {
//         this._super();
//         var root = util.LoadUI(GameHallJson.BindCode).node;
//         this.addChild(root);
//
//         this.textfield_code =ccui.helper.seekWidgetByName(root,"textfield_code");
//         this.textfield_code.setPlaceHolderColor(cc.color.GRAY);
//         this.textfield_code.setTextColor(cc.color.WHITE);
//
//         this.text_tip = ccui.helper.seekWidgetByName(root,"text_tip");
//         this.text_tip.setString("");
//         this.text_tip.setVisible(false);
//
//         this.btn_bind =ccui.helper.seekWidgetByName(root,"btn_bind");
//         this.btn_bind.addClickEventListener(this.onclickBindCode.bind(this));
//         this.btn_bind.setVisible(false);
//         this.btn_close =  ccui.helper.seekWidgetByName(root,"btn_close");
//         this.btn_close.addClickEventListener(this.onclickBtnClose.bind(this));
//
//         this.img_isbind = ccui.helper.seekWidgetByName(root,"img_isbind");
//         this.img_isbind.setVisible(false);
//
//         this.checkBing();
//     },
//
//     checkBing:function()
//     {
//         var _this = this;
//
//         if(hall.user['agentCode'] == '0' || hall.user['agentCode']== null ||hall.user['agentCode']== undefined ||
//             hall.user['agentCode']=='')
//         {
//             hall.net.checkBind(function(data) {
//                 JJLog.print('查询绑定回调=' + JSON.stringify(data));
//                 if(data['code'] == 200)
//                 {
//                     if(data['data']  == '0' || data['data'] == null ||data['data'] == undefined ||
//                         data['data'] =='')
//                     {
//                         _this.btn_bind.setVisible(true);
//                         _this.img_isbind.setVisible(false);
//                     }else
//                     {
//                         _this.btn_bind.setVisible(false);
//                         _this.img_isbind.setVisible(true);
//                     }
//                 }else
//                 {
//                     if(data['msg'] != undefined && data['msg'] != null)
//                     {
//                         var dialog = new JJConfirmDialog();
//                         dialog.setDes(data['msg']);
//                         dialog.showDialog();
//                     }
//                 }
//             });
//         }else
//         {
//             _this.btn_bind.setVisible(false);
//             _this.img_isbind.setVisible(true);
//         }
//     },
//
//     onclickBindCode:function()
//     {
//         var _this = this;
//         if(this.checkInput())
//         {
//             var code = _this.textfield_code.getString();
//             hall.net.bindCode({'uid':hall.user.uid ,'inviteCode':code,'serverType':GAMENAME},function(data)
//                 {
//                     JJLog.print('绑定回调=' + JSON.stringify(data));
//                     if(data['code'] == 200)
//                     {
//                         _this.btn_bind.setVisible(false);
//                         _this.img_isbind.setVisible(true);
//
//                     }else
//                     {
//                         if(data['msg'] != undefined && data['msg'] != null)
//                         {
//                             var dialog = new JJConfirmDialog();
//                             dialog.setDes(data['msg']);
//                             dialog.showDialog();
//                         }
//                     }
//
//                 }
//             )
//
//         }
//
//     },
//
//     onclickBtnClose:function()
//     {
//         this.removeFromParent();
//     },
//     checkInput:function()
//     {
//         var code = this.textfield_code.getString();
//         this.text_tip.setVisible(false);
//         if(code.length <= 0)
//         {
//             this.text_tip.setString("邀请码不能为空!");
//             this.text_tip.setVisible(true);
//             return false;
//         }
//
//         return true;
//     },
//
//     showBindCode: function () {
//         cc.director.getRunningScene().addChild(this);
//     },
//
//     onEnter:function()
//     {
//         this._super();
//     },
//     onExit: function ()
//     {
//         this._super();
//     },
//
// });




