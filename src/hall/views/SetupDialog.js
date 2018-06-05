var SetupDialog = cc.Layer.extend({
    btn_close: null,
    slider_effect: null,
    slider_music: null,
    checkbox_effect: null,
    checkbox_music: null,
    panel_music1: null,
    panel_music2: null,
    panel_music3: null,
    panel_music4: null,
    panel_pt: null,
    panel_fy: null,
    panel_normal: null,
    panel_fast: null,
    panel_show: null,
    panel_notshow: null,
    panel_root:null,
    default_height:200,
    ctor: function (type) {
        this._super();
        var jsonRes = GameHallJson.DeskSetup;

        this.args = arguments;

        var root = util.LoadUI(jsonRes).node;
        this.addChild(root);
        this.default_height = 200;
        this.slider_effect = ccui.helper.seekWidgetByName(root, "slider_effect");
        this.slider_effect.addEventListener(this.sliderEvent, this);
        this.slider_music = ccui.helper.seekWidgetByName(root, "slider_music");
        this.slider_music.addEventListener(this.sliderEvent, this);

        this.checkbox_effect = ccui.helper.seekWidgetByName(root, "checkbox_effect");
        this.checkbox_effect.addEventListener(this.selectedStateEvent, this);
        this.checkbox_music = ccui.helper.seekWidgetByName(root, "checkbox_music");
        this.checkbox_music.addEventListener(this.selectedStateEvent, this);
        this.btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        this.btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        this.btn_close.addTouchEventListener(util.btnTouchEvent);
        var btn_exit = ccui.helper.seekWidgetByName(root, "btn_exit");
        btn_exit.addTouchEventListener(util.btnTouchEvent);
        btn_exit.addClickEventListener(this.onLoginOut.bind(this));

        var btn_openNav = ccui.helper.seekWidgetByName(root, "btn_openNav");
        btn_openNav.addClickEventListener(this.onOpenNav.bind(this));
        btn_openNav.addTouchEventListener(util.btnTouchEvent);

        var btn_jiesan = ccui.helper.seekWidgetByName(root, "btn_jiesan");
        btn_jiesan.addClickEventListener(this.onDissolve.bind(this));
        btn_jiesan.addTouchEventListener(util.btnTouchEvent);
        
        var checkbox_music1 = ccui.helper.seekWidgetByName(root, "checkbox_music0");
        var checkbox_music2 = ccui.helper.seekWidgetByName(root, "checkbox_music1");
        checkbox_music1.setTouchEnabled(false);
        checkbox_music2.setTouchEnabled(false);
        this.panel_music1 = ccui.helper.seekWidgetByName(root, "panel_music0");
        this.panel_music1._checkBox = checkbox_music1;
        this.panel_music2 = ccui.helper.seekWidgetByName(root, "panel_music1");
        this.panel_music2._checkBox = checkbox_music2;
        this.panel_music1.addClickEventListener(this.onClicMusickEvent.bind(this));
        this.panel_music2.addClickEventListener(this.onClicMusickEvent.bind(this));
        
        var bg = util.getCacheItem('backgroundmusic');
        if (bg == null || bg == undefined) {
            checkbox_music2.setSelected(false);
            checkbox_music1.setSelected(true);
        } else {
            checkbox_music2.setSelected(bg == 2);
            checkbox_music1.setSelected(bg == 1);
        }
        
        this.panel_root = ccui.helper.seekWidgetByName(root, "panel");

        this.panel_leftBtn = ccui.helper.seekWidgetByName(root, "panel_leftBtn");
        this.shengyin_btn = ccui.helper.seekWidgetByName(this.panel_leftBtn, "shengyin_btn");
        this.huamian_btn = ccui.helper.seekWidgetByName(this.panel_leftBtn, "huamian_btn");
        this.shengyin_btn.addClickEventListener(this.onClicSYEvent.bind(this));
        this.huamian_btn.addClickEventListener(this.onClicHMEvent.bind(this));


        this.panel_pub = ccui.helper.seekWidgetByName(root, "panel_pub");
        this.panel_btns = ccui.helper.seekWidgetByName(root, "panel_btns");
        this.panel_plugin = ccui.helper.seekWidgetByName(root, "panel_plugin");
        this.panel_PlugInScene = ccui.helper.seekWidgetByName(root, "panel_PlugInScene");
        this.img_bg = ccui.helper.seekWidgetByName(root, "img_bg");
        this.top = ccui.helper.seekWidgetByName(root, "top");

        this.hall_default_height();
        if(type == 1){
            btn_jiesan.setVisible(true);
            btn_exit.setVisible(false);
            this.pluginPanelView();
            this.panel_leftBtn.setVisible(true);
            if(XYGLogic.Instance.getGameType())
            {
                this.pluginPanelPokerSceneView();
            }
            else
            {
                this.pluginPanelSceneView();
            }
        }
        else if(type == 0)
        {
            this.panel_leftBtn.setVisible(false);
            btn_jiesan.setVisible(false);
            btn_exit.setVisible(true);
        }
        else
        {
            this.panel_leftBtn.setVisible(true);
            btn_jiesan.setVisible(true);
            btn_exit.setVisible(false);
            this.pluginPanelSceneView();
        }
        this.setStart_tag(true);
    },

    hall_default_height:function () {
        var size = {};
        size['width'] = 768;
        size['height'] = this.default_height;
        this.panel_plugin.setContentSize(size);
        size.height += this.panel_btns.getContentSize().height;
        size.height += this.panel_pub.getContentSize().height;
        this.panel_root.setContentSize(size);
        this.top.y = size.height;
        this.panel_pub.y = size.height;
        this.panel_leftBtn.y = this.panel_root.height/2;
        this.img_bg.y = size.height/2;
        this.img_bg.setContentSize(size);
    },

    setStart_tag:function (isbool) {
        this.shengyin_btn.setBright(!isbool);
        this.huamian_btn.setBright(isbool);
        this.panel_pub.setVisible(isbool);
        this.panel_plugin.setVisible(isbool);
        this.panel_PlugInScene.setVisible(!isbool);
    },

    onClicSYEvent:function () {
        this.setStart_tag(true);
    },

    onClicHMEvent:function () {
        this.setStart_tag(false);
    },

    pluginPanelView: function (){

       
        var pluginView = hall.getCurGameSetUpPlugin(this , this.args);

        
        if(!pluginView) return;

        this.panel_plugin.addChild(pluginView);
        var pgSize = pluginView.getContentSize();
        this.panel_plugin.setContentSize(pgSize);

        var nRSize = pgSize;
        if(nRSize.height < this.default_height)
        {
            this.panel_plugin.y = this.panel_plugin.y + this.default_height - nRSize.height;
            nRSize.height = this.default_height;
        }
        nRSize.height += this.panel_btns.getContentSize().height;
        nRSize.height += this.panel_pub.getContentSize().height;
        this.panel_root.setContentSize(nRSize);
        this.top.y = nRSize.height;
        this.panel_pub.y = nRSize.height;
        this.img_bg.y = nRSize.height/2;
        this.img_bg.setContentSize(nRSize);

    },

    pluginPanelSceneView: function (){


        var pluginView = new SetupPlugInScene(this,this.PlugInScene_back.bind(this));
        if(!pluginView) return;

        this.panel_PlugInScene.addChild(pluginView);
        var pgSize = pluginView.getContentSize();
        this.panel_PlugInScene.setContentSize(pgSize);

        this.panel_PlugInScene.y = this.panel_pub.y - 100;

    },

    PlugInScene_back:function () {
    },

    pluginPanelPokerSceneView: function (){


        var pluginView = new SetupPlugInPokerScene(this,this.PlugInScenePoker_back.bind(this));
        if(!pluginView) return;

        this.panel_PlugInScene.addChild(pluginView);
        var pgSize = pluginView.getContentSize();
        this.panel_PlugInScene.setContentSize(pgSize);

        var nRSize = pgSize;
        if(nRSize.height < this.default_height)
        {
            this.panel_plugin.y = this.panel_plugin.y + this.default_height - nRSize.height;
            nRSize.height = this.default_height;
        }
        nRSize.height += this.panel_btns.getContentSize().height;
        nRSize.height += this.top.getContentSize().height;
        this.panel_root.setContentSize(nRSize);
        this.top.y = nRSize.height;
        this.panel_pub.y = nRSize.height;
        this.panel_plugin.y = nRSize.height - this.panel_pub.height - 100;
        this.img_bg.y = nRSize.height/2;
        this.img_bg.setContentSize(nRSize);
        this.panel_PlugInScene.y = this.panel_pub.y - 100;
        this.panel_leftBtn.y = this.panel_root.height/2;
    },

    PlugInScenePoker_back:function () {
    },

    onClicMusickEvent: function (sender) {
        switch (sender) {
            case this.panel_music1:
                util.setCacheItem('backgroundmusic', 1);
                this.panel_music1._checkBox.setSelected(true);
                this.panel_music2._checkBox.setSelected(false);
                
                sound.playBgSound();
                break;
            case this.panel_music2:
                util.setCacheItem('backgroundmusic', 2);
                this.panel_music2._checkBox.setSelected(true);
                this.panel_music1._checkBox.setSelected(false);
                
                sound.playBgSound();
                break;
            case this.panel_music3:
                util.setCacheItem('backgroundmusic', 3);
                this.panel_music2._checkBox.setSelected(false);
                this.panel_music1._checkBox.setSelected(false);
                
                sound.playBgSound();
                break;
            case this.panel_music4:
                util.setCacheItem('backgroundmusic', 4);
                this.panel_music2._checkBox.setSelected(false);
                this.panel_music1._checkBox.setSelected(false);
                
                sound.playBgSound();
                break;
        }
    },
    onEnter: function () {
        this._super();
        var bgOn = util.getCacheItem('background_music');
        if (bgOn == 0) {
            this.checkbox_music.setSelected(true);
        } else {
            this.checkbox_music.setSelected(false);
        }

        var musicOn = util.getCacheItem('background_music');
        if (musicOn == 0) {
            this.checkbox_music.setSelected(true);
        } else {
            this.checkbox_music.setSelected(false);
        }

        var effectOn = util.getCacheItem('sound_effect');
        if (effectOn == 0) {
            this.checkbox_effect.setSelected(true);
        } else {
            this.checkbox_effect.setSelected(false);
        }


        var effectVolume = util.getCacheItem('effect_volume');//audioEngine.getMusicVolume();
        if (effectVolume == null) {
            this.slider_effect.setPercent(100);
        } else {
            this.slider_effect.setPercent(effectVolume * 100);
        }

        var soundVolume = util.getCacheItem('music_volume');
        if (soundVolume == null) {
            this.slider_music.setPercent(100);
        } else {
            this.slider_music.setPercent(soundVolume * 100);
        }

        if(this.panel_root)
        {
            this.panel_root.setScale(0.3)
            this.panel_root.runAction(cc.EaseBackOut.create(cc.ScaleTo.create(0.5, 1, 1)))
        }

    },

    registerDissolveEvent: function (func) {
        this._onDissolveEvent = func;
    },

    sliderEvent: function (sender, type) {
        switch (type) {
            case ccui.Slider.EVENT_PERCENT_CHANGED: {
                var percent = Math.ceil(sender.getPercent());
                var volume = percent / 100;
                if (sender == this.slider_effect) {
                    cc.audioEngine.setEffectsVolume(volume);
                    this.slider_effect.setPercent(percent);
                    util.setCacheItem('effect_volume', volume);
                } else if (sender == this.slider_music) {
                    cc.audioEngine.setMusicVolume(volume);
                    this.slider_music.setPercent(percent);
                    util.setCacheItem('music_volume', volume);
                }
                //var num = Math.floor(this.getMaxCoinChip() * percent/100);

            }
                break;
            default:
                break;
        }
    },

    onLoginOut: function () {
        JJLog.print('登出！');
        util.removeCacheItem('wxUser');
        //cc.director.runScene(new SangongLoginScene());
        //cc.director.end();
        qp.exit();
    },

    onDissolve: function () {
        if(this._onDissolveEvent) {
            this._onDissolveEvent();
            this.removeFromParent();
        }else
        {
            hall.getPlayingGame().net.dissolveSeat(1, function (data) {
                this.removeFromParent();
            }.bind(this));
        }
    },

    onOpenNav: function () {
        hall.net.openLocationSetting();
    },

    showDialog: function () {
        cc.director.getRunningScene().addChild(this);
    },

    selectedStateEvent: function (sender, type) {
        switch (type) {
            case ccui.CheckBox.EVENT_SELECTED: {
                if (sender == this.checkbox_effect) {
                    this.slider_effect.setEnabled(false);
                    util.setCacheItem('sound_effect', 0);
                    sound.stopEffect();

                } else if (sender == this.checkbox_music) {
                    this.slider_music.setEnabled(false);
                    util.setCacheItem('background_music', 0);
                    sound.stopBgSound();

                }
            }

                break;
            case ccui.CheckBox.EVENT_UNSELECTED: {
                if (sender == this.checkbox_effect) {
                    this.slider_effect.setEnabled(true);
                    util.setCacheItem('sound_effect', 1);
                } else if (sender == this.checkbox_music) {
                    this.slider_music.setEnabled(true);
                    util.setCacheItem('background_music', 1);
                    sound.playBgSound();
                }
            }
                break;
            default:
                break;
        }
    },
});