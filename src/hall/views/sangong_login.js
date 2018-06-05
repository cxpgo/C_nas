var HallLoginLayer = cc.Layer.extend({
    textfield_account:null,
    textfield_pwd:null,
    btn_find_pwd:null,
    btn_login:null,
    btn_quick_reg:null,
    btn_weixin:null,
    text_tip:null,
    _this:null,
    checkbox_xieyi:null,
    panel_xieyi:null,
    agreexieyi:1,

    ctor: function () {
        this._super();

        var root = util.LoadUI(GameHallJson.GameLogin).node;
        this.addChild(root);
        this._this = this;

        this.textfield_account = ccui.helper.seekWidgetByName(root,"textfield_account");
        this.textfield_account.setPlaceHolderColor(cc.color.GRAY);
        this.textfield_account.setTextColor(cc.color.BLACK);

        this.textfield_pwd = ccui.helper.seekWidgetByName(root,"textfield_pwd");
        this.textfield_pwd.setPlaceHolderColor(cc.color.GRAY);
        this.textfield_pwd.setTextColor(cc.color.BLACK);

        this.btn_login = ccui.helper.seekWidgetByName(root,"btn_login");
        this.btn_login.addClickEventListener(this.onClickLogin.bind(this));

        this.text_tip = ccui.helper.seekWidgetByName(root,"text_tip");
        this.text_tip.setString("");
        this.text_tip.setVisible(false);

        this.checkbox_xieyi = ccui.helper.seekWidgetByName(root,"checkbox_xieyi");
        this.checkbox_xieyi.setSelected(true);
        this.checkbox_xieyi.addEventListener(this.onClickChooseXieyi,this);

        this.panel_xieyi =  ccui.helper.seekWidgetByName(root,"panel_xieyi");
        this.panel_xieyi.setTouchEnabled(true);
        this.panel_xieyi.addClickEventListener(this.onClickOpenXieyi);

        this.btn_weixin = ccui.helper.seekWidgetByName(root,"btn_weixin");
        this.btn_weixin.addClickEventListener(function () {
            if(this.agreexieyi <= 0)
            {
                var dialog = new JJConfirmDialog();
                dialog.setDes("请先阅读并同意《用户协议》");
                dialog.showDialog();
                return;
            }
            MajhongLoading.show('登录中');
            if (qp.net.state == 'init')
                this.checkVersion();
            else {
                this.WeixinLogin();
            }
        }.bind(this));

        if (cc.sys.isNative) {
            this.text_version = ccui.helper.seekWidgetByName(root,"text_version");
            this.text_version.string = "Version:"+AppCtrl.ResVersion+"_"+DeviceUtils.DeviceId;

            var account = ccui.helper.seekWidgetByName(root,"sprite_account");
            account.setVisible(false);
            var pwd = ccui.helper.seekWidgetByName(root,"sprite_pwd");
            pwd.setVisible(false);
            var install = util.getWXAppInstalled();
            this.btn_weixin.setVisible(install);
            this.btn_login.setVisible(!install);
            if(!install || hall.songshen == 1)
            {
                this.btn_login.setVisible(true);
                this.btn_weixin.setVisible(false);
                this.btn_login.setPositionX(220);
            }
        }
        //##YQGAMEDEBUG
        WGTestServer.addTo(ccui.helper.seekWidgetByName(root,"panel_testServer"));
        //YQGAMEDEBUG##
    },
    
    onClickOpenXieyi:function()
    {
        JJLog.print('打开协议界面')
        var msg = new MajhongXieyi();
        msg.showHelp();
    },
    onClickChooseXieyi:function (sender,type) {
        switch (type)
        {
            case ccui.CheckBox.EVENT_SELECTED:
                this.agreexieyi = 1;
                break;
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.agreexieyi = 0;
                break;
        }
        JJLog.print('协议='+ this.agreexieyi)
    },
    decToHex:function(str) {
        var res=[];
        for(var i=0;i < str.length;i++)
            res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
        return "\\u"+res.join("\\u");
    },
    hexToDec:function(str) {
        str=str.replace(/\\/g,"%");
        return unescape(str);
    },

    onClickLogin:function()
    {
        // GameMatch.showDialog(MatchDialogType.arenaResult,{isLast:false,isOver:0,rank:2,stage:{maxRank:512,members:[1024,512,256,128,4]}});
        //return;
        //if(cc.sys.isNative)
        //{
        //    MajhongLoading.show('登录中.....');
        //    hall.net.guestLogin(function(data) {
        //        MajhongLoading.dismiss();
        //    });
        //    return;
        //}
        //
        //if(this.checkInput())
        //{
        //    this.loginAccount();
        //}

        console.log("cc.sys.isNative",cc.sys.isNative);
        MajhongLoading.show('登录中.....');
        hall.net.guestLogin(function(data) {
            MajhongLoading.dismiss();
        });
        return;

    },

    checkVer_WeixinLogin:function () {
        hall.net.wxLogin(function(data) {
            JJLog.print("login response msg ->");
            JJLog.print(data);
            if(data['code'] == 500)
            {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("网络异常,请稍后再试！");
                dialog.showDialog();
            }else if (data.code == 1000) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("账号已被封停，请联系客服！");
                dialog.showDialog();
            } else if (data.code == 1001) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("服务器正在维护中，请稍后再登录游戏！");
                dialog.showDialog();
            } else if(data['code'] != 200) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("账号或者密码错误！");
                dialog.showDialog();
            } else {
                MajhongLoading.dismiss();
            }

        }.bind(this));
    },

    WeixinLogin:function () {
        hall.net.wxLogin(function(data) {
            JJLog.print("login response msg ->");
            JJLog.print(data);

            if(data['code'] == 500)
            {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("网络异常,请稍后再试！");
                dialog.showDialog();
            } else if (data.code == 410) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("取消登录！");
                dialog.showDialog();
            }else if (data.code == 1000) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("账号已被封停，请联系客服！");
                dialog.showDialog();
            } else if (data.code == 1001) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("服务器正在维护中，请稍后再登录游戏！");
                dialog.showDialog();
            } else if(data['code'] != 200) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("账号或者密码错误！");
                dialog.showDialog();
            } else {
                MajhongLoading.dismiss();
            }

        }.bind(this));
    },

    loginAccount:function()
    {
        MajhongLoading.show('登录中.....');
        hall.net.login("1",this.textfield_account.getString(), this.textfield_pwd.getString(), '', function(data) {
            // hall.net.guestLogin(function(data) {
            //hall.net.wxLogin(function(data) {

            if(typeof(data) != "object")
            {
                data = JSON.parse(data);
            }
            if(data['code'] == 500)
            {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("网络异常,请稍后再试！");
                dialog.showDialog();
            } else if (data.code == 410) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("取消登录！");
                dialog.showDialog();

            }  else if(data['code'] != 200) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("账号或者密码错误！");
                dialog.showDialog();
            }  else {
                MajhongLoading.dismiss();
            }
        }.bind(this));
    },


    onClickFindPwd:function()
    {
    },

    onClickQuickReg:function()
    {

    },

    checkInput:function()
    {
        var account = this.textfield_account.getString();
        this.text_tip.setVisible(false);
        if(account.length <= 0)
        {
            this.text_tip.setString("账户不能为空!");
            this.text_tip.setVisible(true);
            return false;
        }

        var pwd = this.textfield_pwd.getString();
        this.text_tip.setVisible(false);
        if(pwd.length <= 0)
        {
            this.text_tip.setString("密码不能为空!");
            this.text_tip.setVisible(true);
            return false;
        }

        return true;

    },

    onExit:function() {
        this._super();
    },

    checkVersion: function () {
        hall.net.checkVersion('', function() {
            var user = util.getCacheItem('wxUser');
            if (user != null && user != '') {
                var lastLogin = util.getCacheItem('wxLoginTime');
                if (lastLogin != null && lastLogin != '')
                    lastLogin = parseInt(lastLogin);
                else
                    lastLogin = 0;

                var now = new Date().getTime();
                JJLog.print(lastLogin);
                JJLog.print(now);
                JJLog.print(now - lastLogin);
                if (now - lastLogin > 3600*1000*24)
                    util.removeCacheItem('wxUser');

                var user = util.getCacheItem('wxUser');
                JJLog.print('user:', user);
                if (user != null && user != '') {
                    this.checkVer_WeixinLogin();
                } else
                    MajhongLoading.dismiss();
            } else
                MajhongLoading.dismiss();
        }.bind(this));
    },

    onEnter:function()
    {
        this._super();
        util.createScreenTouchEvent();
        if (util.getCacheItem('deviceId') == undefined || util.getCacheItem('deviceId') == "")
            util.setCacheItem('deviceId', util.uuid(16, 16));

        if (util.getCacheItem('audioInited') == undefined || util.getCacheItem('audioInited') == "") {
            util.setCacheItem('background_music', 1);
            util.setCacheItem('sound_effect', 1);
            util.setCacheItem('GameMusic', 1);
            util.setCacheItem('GameEffect', 1);
            util.setCacheItem('music_volume', 1);
            util.setCacheItem('effect_volume', 1);
            util.setCacheItem('audioInited', 1);
            util.setCacheItem('sss_model', 1);
        }

        var soundVolume =  util.getCacheItem('effect_volume');
        var musicVolume = util.getCacheItem('music_volume');

        if(musicVolume != null && musicVolume != "" && musicVolume != undefined)
        {
            cc.audioEngine.setMusicVolume(musicVolume);
        }

        if(soundVolume != null && soundVolume != "" && soundVolume != undefined)
        {
            cc.audioEngine.setEffectsVolume(soundVolume);
        }


        if (util.getCacheItem('userName') != undefined && util.getCacheItem('userPwd') != undefined) {
            this.textfield_account.setString(util.getCacheItem('userName') );
            this.textfield_pwd.setString(util.getCacheItem('userPwd') );
        }
        var node = new cc.Node();
        cc.director.setNotificationNode(node);
        MajhongLoading.show('连接中...');

        hall.net.init();
        this.checkVersion();
        club.initClub();
    }

});

var SangongLoginScene = cc.Scene.extend({
    onEnter:function(){
        cc.director.setAnimationInterval(1.0/60);
        this._super();
        if(hall.songshen == 1)
        {
            var loginmain = new HallAccountLoginLayer();
        }else
        {
            var loginmain = new HallLoginLayer();
        }
        this.addChild(loginmain);
    }
});

var HallAccountLoginLayer = cc.Layer.extend({
    textfield_account:null,
    textfield_pwd:null,
    btn_find_pwd:null,
    btn_login:null,
    btn_register:null,
    btn_quick_reg:null,
    btn_weixin:null,
    text_tip:null,
    _this:null,
    checkbox_xieyi:null,
    panel_xieyi:null,
    agreexieyi:1,
    agreexieyi1:1,
    btn_sure:1,
    panel_register:null,
    reg_nickName:null,
    reg_account:null,
    reg_pwd:null,
    reg_pwd_again:null,
    reg_sex:null,

    ctor: function () {
        this._super();
        var root = util.LoadUI(GameHallJson.AccountLogin).node;
        this.addChild(root);
        this._this = this;

        this.textfield_account = ccui.helper.seekWidgetByName(root,"textfield_account");
        this.textfield_account.setPlaceHolderColor(cc.color.GRAY);
        this.textfield_account.setTextColor(cc.color.BLACK);

        this.textfield_pwd = ccui.helper.seekWidgetByName(root,"textfield_pwd");
        this.textfield_pwd.setPlaceHolderColor(cc.color.GRAY);
        this.textfield_pwd.setTextColor(cc.color.BLACK);

        this.btn_login = ccui.helper.seekWidgetByName(root,"btn_login");
        this.btn_login.addClickEventListener(this.onClickLogin.bind(this));
        this.btn_register = ccui.helper.seekWidgetByName(root,"btn_register");
        this.btn_register.addClickEventListener(this.onClickRegister.bind(this));


        // var pannel = ccui.helper.seekWidgetByName(root,"pannel");
        // var node_anim = util.playTimeLineAnimation(GameHallJson.LOGO,false);
        // node_anim.setPosition(cc.p(640,380));
        // pannel.addChild(node_anim);
        //
        // var flower = new cc.ParticleSystem("res/Animation/leaf1.plist");
        // pannel.addChild(flower,100,1);
        // flower.setPosition(0,200);

        this.text_tip = ccui.helper.seekWidgetByName(root,"text_tip");
        this.text_tip.setString("");
        this.text_tip.setVisible(false);

        this.checkbox_xieyi = ccui.helper.seekWidgetByName(root,"checkbox_xieyi");
        this.checkbox_xieyi.setSelected(true);
        this.checkbox_xieyi.addEventListener(this.onClickChooseXieyi,this);

        this.checkbox_xieyi_1 = ccui.helper.seekWidgetByName(root,"checkbox_xieyi_1");
        this.checkbox_xieyi_1.setSelected(true);
        this.checkbox_xieyi_1.addEventListener(this.onClickRegChooseXieyi,this);

        this.panel_xieyi =  ccui.helper.seekWidgetByName(root,"panel_xieyi");
        this.panel_xieyi.setTouchEnabled(true);
        this.panel_xieyi.addClickEventListener(this.onClickOpenXieyi);
        this.panel_xieyi_1 =  ccui.helper.seekWidgetByName(root,"panel_xieyi_1");
        this.panel_xieyi_1.setTouchEnabled(true);
        this.panel_xieyi_1.addClickEventListener(this.onClickOpenXieyi);

        this.panel_register = ccui.helper.seekWidgetByName(root, "panel_register");
        this.panel_register.setVisible(false);
        this.btn_sure = ccui.helper.seekWidgetByName(this.panel_register, "btn_sure");
        this.btn_sure.addClickEventListener(this.onClickQuickReg.bind(this));
        this.reg_account = ccui.helper.seekWidgetByName(this.panel_register, "reg_account");
        this.reg_nickName = ccui.helper.seekWidgetByName(this.panel_register, "reg_nickName");
        this.reg_pwd = ccui.helper.seekWidgetByName(this.panel_register, "reg_pwd");
        this.reg_pwd_again = ccui.helper.seekWidgetByName(this.panel_register, "reg_pwd_again");
        var btn_back = ccui.helper.seekWidgetByName(this.panel_register, "btn_back");
        btn_back.addClickEventListener(function () {
            this.panel_register.setVisible(false);
        }.bind(this))

        var panel_sexs = new Array();
        for (var i=0; i< 2; i++) {
            var panel = ccui.helper.seekWidgetByName(this.panel_register, "panel_sex_" + i);
            var checkbox = ccui.helper.seekWidgetByName(this.panel_register, "checkbox_sex_" + i);
            panel._checkBox = checkbox;
            panel_sexs.push(panel);
            checkbox.setSelected(i == 0)

            var clickData = {};
            clickData['this'] = this;
            clickData['index'] = i;
            clickData['array'] = panel_sexs;
            panel.addClickEventListener(this.onChangeSex.bind(clickData))
        }


        if (cc.sys.isNative) {
            this.text_version = ccui.helper.seekWidgetByName(root,"text_version");
            this.text_version.string = "Version:"+AppCtrl.ResVersion+"_"+DeviceUtils.DeviceId;
        }
    },

    onClickOpenXieyi:function()
    {
        JJLog.print('打开协议界面')
        var msg = new MajhongXieyi();
        msg.showHelp();
    },
    onClickChooseXieyi:function (sender,type) {
        switch (type)
        {
            case ccui.CheckBox.EVENT_SELECTED:
                this.agreexieyi = 1;
                break;
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.agreexieyi = 0;
                break;
        }
        JJLog.print('协议='+ this.agreexieyi)
    },
    onClickRegChooseXieyi:function (sender,type) {
        switch (type)
        {
            case ccui.CheckBox.EVENT_SELECTED:
                this.agreexieyi1 = 1;
                break;
            case ccui.CheckBox.EVENT_UNSELECTED:
                this.agreexieyi1 = 0;
                break;
        }
        JJLog.print('协议='+ this.agreexieyi)
    },
    decToHex:function(str) {
        var res=[];
        for(var i=0;i < str.length;i++)
            res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
        return "\\u"+res.join("\\u");
    },
    hexToDec:function(str) {
        str=str.replace(/\\/g,"%");
        return unescape(str);
    },

    onClickLogin:function()
    {
        if(this.agreexieyi <= 0)
        {
            var dialog = new JJConfirmDialog();
            dialog.setDes("请先阅读并同意《用户协议》");
            dialog.showDialog();
            return;
        }
        if(this.checkInput())
        {
            this.loginAccount();
        }


    },

    loginAccount:function()
    {
        MajhongLoading.show('登录中.....');
        hall.net.login("1",this.textfield_account.getString(), this.textfield_pwd.getString(), '', function(data) {
            JJLog.print(data);
            if(data['code'] == 500)
            {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("网络异常,请稍后再试！");
                dialog.showDialog();
            } else if (data.code == 410) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("取消登录！");
                dialog.showDialog();

            }  else if(data['code'] != 200) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("账号或者密码错误！");
                dialog.showDialog();
            }  else {
                MajhongLoading.dismiss();
            }
        }.bind(this));
    },

    onClickRegister: function () {
        this.panel_register.setScale(0.5);
        this.panel_register.runAction(cc.sequence(cc.show(), cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut())));
    },


    onClickFindPwd:function()
    {
    },

    onClickQuickReg:function()
    {
        if (this.checkRegInput()) {
            hall.net.register("1", this.reg_account.getString(),
                this.reg_pwd.getString(),
                this.reg_nickName.getString(),
                '', '', '', '', this.reg_sex, function (data) {
                    console.log("!!!!!!!!!!!!!!!", data);
                    if (data.code == 200) {
                        this.loginReg();
                    } else {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(data.error || data.err);
                        dialog.showDialog();
                        this.panel_register.setVisible(false);
                    }
                    this.resetRegData();
                }.bind(this))
        }
    },
    resetRegData: function () {
        this.reg_account.setString("");
        this.reg_nickName.setString("");
        this.reg_pwd.setString("");
        this.reg_pwd_again.setString("");
    },
    loginReg: function () {
        MajhongLoading.show('登录中.....');
        hall.net.login("1",this.reg_account.getString(), this.reg_pwd.getString(), '', function(data) {
            // hall.net.guestLogin(function(data) {
            //hall.net.wxLogin(function(data) {
            JJLog.print(data);
            if(data['code'] == 500)
            {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("网络异常,请稍后再试！");
                dialog.showDialog();
            } else if (data.code == 410) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("取消登录！");
                dialog.showDialog();

            }  else if(data['code'] != 200) {
                MajhongLoading.dismiss();
                var dialog = new JJConfirmDialog();
                dialog.setDes("账号或者密码错误！");
                dialog.showDialog();
            }  else {
                MajhongLoading.dismiss();
            }
        }.bind(this));
    },
    checkRegInput:function()
    {
        var nickName = this.reg_nickName.getString();
        this.text_tip.setVisible(false);
        if(nickName.length <= 0)
        {
            var bar = new QDTipBar();
            bar.show("昵称不能为空！", 0.8);
            return false;
        }
        var account = this.reg_account.getString();
        this.text_tip.setVisible(false);
        if(account.length <= 0)
        {
            var bar = new QDTipBar();
            bar.show("账户不能为空！", 0.8);
            return false;
        }
        var pwd = this.reg_pwd.getString();
        this.text_tip.setVisible(false);
        if(pwd.length <= 0)
        {
            var bar = new QDTipBar();
            bar.show("密码不能为空！", 0.8);
            return false;
        }
        var pwd_gain = this.reg_pwd_again.getString();
        this.text_tip.setVisible(false);
        if(pwd_gain.length <= 0)
        {
            var bar = new QDTipBar();
            bar.show("密码不能为空！", 0.8);
            return false;
        }
        if (pwd != pwd_gain) {
            var bar = new QDTipBar();
            bar.show("两次输入的密码不相等, 请重新确认！", 0.8);
            return false;
        }
        if(this.agreexieyi1 <= 0)
        {
            var dialog = new JJConfirmDialog();
            dialog.setDes("请先阅读并同意《用户协议》");
            dialog.showDialog();
            return;
        }


        return true;

    },
    onChangeSex:function()
    {
        var index = this['index'];
        var _this = this['this'];
        var array = this['array'];
        _this.reg_sex = index;
        for (var i = 0; i < array.length; i++) {
            array[i].setTouchEnabled(i != index);
            array[i]._checkBox.setSelected(i == index);
        }

    },

    checkInput:function()
    {
        var account = this.textfield_account.getString();
        this.text_tip.setVisible(false);
        if(account.length <= 0)
        {
            this.text_tip.setString("账户不能为空!");
            this.text_tip.setVisible(true);
            return false;
        }

        var pwd = this.textfield_pwd.getString();
        this.text_tip.setVisible(false);
        if(pwd.length <= 0)
        {
            this.text_tip.setString("密码不能为空!");
            this.text_tip.setVisible(true);
            return false;
        }

        return true;

    },

    onExit:function() {
        this._super();
    },

    checkVersion: function () {
        hall.net.checkVersion('', function() {
            var user = util.getCacheItem('wxUser');
            if (user != null && user != '') {
                var lastLogin = util.getCacheItem('wxLoginTime');
                if (lastLogin != null && lastLogin != '')
                    lastLogin = parseInt(lastLogin);
                else
                    lastLogin = 0;

                var now = new Date().getTime();
                JJLog.print(lastLogin);
                JJLog.print(now);
                JJLog.print(now - lastLogin);
                if (now - lastLogin > 3600*1000*24)
                    util.removeCacheItem('wxUser');

                var user = util.getCacheItem('wxUser');
                JJLog.print('user:', user);
                if (user != null && user != '') {
                    hall.net.wxLogin(function(data) {
                        JJLog.print("login response msg ->");
                        JJLog.print(data);
                        if(data['code'] == 500)
                        {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("网络异常,请稍后再试！");
                            dialog.showDialog();
                        }else if (data.code == 1000) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("账号已被封停，请联系客服！");
                            dialog.showDialog();
                        } else if (data.code == 1001) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("服务器正在维护中，请稍后再登录游戏！");
                            dialog.showDialog();
                        } else if(data['code'] != 200) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("账号或者密码错误！");
                            dialog.showDialog();
                        } else {
                            MajhongLoading.dismiss();
                        }

                    }.bind(this));

                } else
                    MajhongLoading.dismiss();
            } else
                MajhongLoading.dismiss();
        }.bind(this));
    },

    onEnter:function()
    {
        this._super();
        util.createScreenTouchEvent();
        if (util.getCacheItem('deviceId') == undefined || util.getCacheItem('deviceId') == "")
            util.setCacheItem('deviceId', util.uuid(16, 16));

        if (util.getCacheItem('audioInited') == undefined || util.getCacheItem('audioInited') == "") {
            util.setCacheItem('background_music', 1);
            util.setCacheItem('sound_effect', 1);
            util.setCacheItem('GameMusic', 1);
            util.setCacheItem('GameEffect', 1);
            util.setCacheItem('music_volume', 1);
            util.setCacheItem('effect_volume', 1);
            util.setCacheItem('audioInited', 1);
            util.setCacheItem('sss_model', 1);
        }

        var soundVolume =  util.getCacheItem('effect_volume');
        var musicVolume = util.getCacheItem('music_volume');

        if(musicVolume != null && musicVolume != "" && musicVolume != undefined)
        {
            cc.audioEngine.setMusicVolume(musicVolume);
        }

        if(soundVolume != null && soundVolume != "" && soundVolume != undefined)
        {
            cc.audioEngine.setEffectsVolume(soundVolume);
        }


        if (util.getCacheItem('userName') != undefined && util.getCacheItem('userPwd') != undefined) {
            this.textfield_account.setString(util.getCacheItem('userName') );
            this.textfield_pwd.setString(util.getCacheItem('userPwd') );
        }
        var node = new cc.Node();
        cc.director.setNotificationNode(node);
        MajhongLoading.show('连接中...');

        hall.net.init();
        this.checkVersion();
        club.initClub();
    }

});


