var SetupPlugInPokerScene = cc.Layer.extend({

    ctor: function (context,cb) {
        this._super();
        this.mContext = context;
        this.mCallback = cb;
        var root = util.LoadUI(GameRes.SetupPlugInPokerScene).node;
        this.addChild(root);

        this.setContentSize(root.getContentSize());
        this.mRoot = root;


        this.panel_bg = ccui.helper.seekWidgetByName(this.mRoot, "panel_bg");
        this.panel_pakerback = ccui.helper.seekWidgetByName(this.mRoot, "panel_pakerback");
        this.panel_bg_cell = ccui.helper.seekWidgetByName(this.mRoot, "panel_bg_cell");
        this.panel_back_cell = ccui.helper.seekWidgetByName(this.mRoot, "panel_back_cell");
        this.img_down = ccui.helper.seekWidgetByName(this.mRoot, "img_down");
        this.img_dianArr = [];
        for(var i=0;i<4;i++)
        {
            var dian = ccui.helper.seekWidgetByName(this.panel_bg, "img_dian" + i);
            this.img_dianArr.push(dian);
        }
        this.panel_bg_cell.setVisible(false);
        this.panel_back_cell.setVisible(false);
        this.PageView_1 = ccui.helper.seekWidgetByName(this.mRoot, "PageView_1");
        this.ListView_1 = ccui.helper.seekWidgetByName(this.mRoot, "ListView_1");
        this.btn_pageup = ccui.helper.seekWidgetByName(this.mRoot, "btn_up");
        this.btn_pageup.addClickEventListener(this.Btn_pageup_click.bind(this));
        this.btn_pagedown = ccui.helper.seekWidgetByName(this.mRoot, "btn_down");
        this.btn_pagedown.addClickEventListener(this.Btn_pagedown_click.bind(this));

        this.Bg_sIndex = 1;
        var pArray = new Array();
        var Back_cacheKey = PokerBackGCCacheKey;
        var Back_cacheVs = [PokerBackGVType.V1 , PokerBackGVType.V2 , PokerBackGVType.V3 , PokerBackGVType.V4];
        var Bg_cacheKey = PokerBgGCCacheKey;
        var Bg_cacheVs = [PokerBgGVType.V1 , PokerBgGVType.V2 , PokerBgGVType.V3 , PokerBgGVType.V4];
        this.Bgimg_light = new Array();
        this.Backimg_light = new Array();
        for(var i=0;i<Setting_BgCfg.length;i++)
        {
            var cell = this.panel_bg_cell.clone();
            cell.setVisible(true);
            var img_bg = ccui.helper.seekWidgetByName(cell, "img_bg");
            var img_light = ccui.helper.seekWidgetByName(cell, "img_light");
            var cahceV = parseInt(util.getCacheItem(Bg_cacheKey) || 1 );
            var bl = cahceV === Bg_cacheVs[i];
            img_light.setVisible(bl);
            if(bl)
            {
                this.Bg_sIndex = cahceV;
                this.img_dianArr[i].setOpacity(255*0.7);
            }
            else
            {
                this.img_dianArr[i].setOpacity(255*0.3);
            }
            img_bg.loadTexture(Setting_BgCfg[i],ccui.Widget.LOCAL_TEXTURE);
            this.Bgimg_light.push(img_light);
            this.PageView_1.addPage(cell);
            var clickData = {};
            clickData['this'] = this;
            clickData['cacheValue'] = Bg_cacheVs[i];
            clickData['index'] = i;
            clickData['img_light'] = this.Bgimg_light;
            clickData['cacheKey'] = Bg_cacheKey;
            clickData['callBack'] = this.mCallback;
            // cell.addClickEventListener(this.onToggle_Bg.bind(clickData));
        }

        for(var i=0;i<Setting_BackCfg.length;i++)
        {
            var cell = this.panel_back_cell.clone();
            cell.setVisible(true);
            var img_poker = ccui.helper.seekWidgetByName(cell, "img_poker");
            var cahceV = parseInt(util.getCacheItem(Back_cacheKey) || 1 );
            var bl = cahceV === Back_cacheVs[i];
            img_poker.loadTexture(Setting_BackCfg[i],ccui.Widget.LOCAL_TEXTURE);

            var node_anim = util.playTimeLineAnimation(GameHallJson.PBXZ,true);
            node_anim.setAnchorPoint(0,0);
            node_anim.setPosition(cc.p(cell.getContentSize().width/2,cell.getContentSize().height/2));
            cell.addChild(node_anim, 100);
            node_anim.setVisible(bl);
            this.Backimg_light.push(node_anim);
            this.ListView_1.pushBackCustomItem(cell);
            var clickData = {};
            clickData['this'] = this;
            clickData['cacheValue'] = Back_cacheVs[i];
            clickData['index'] = i;
            clickData['img_light'] = this.Backimg_light;
            clickData['cacheKey'] = Back_cacheKey;
            clickData['callBack'] = this.mCallback;
            cell.addClickEventListener(this.onToggle_Back.bind(clickData));
        }

        this.updateButtons();
        this.UpdateCurrentPagefunc();
    },

    UpdateCurrentPagefunc:function () {
        this.PageView_1.scrollToPage(this.Bg_sIndex-1);
    },

    updateButtons:function () {
        var allPgLen = this.PageView_1.getPages().length;
        for(var i=0;i<allPgLen;i++)
        {
            if(i == this.Bg_sIndex-1)
            {
                this.img_dianArr[i].setOpacity(255*0.7);
            }
            else
            {
                this.img_dianArr[i].setOpacity(255*0.3);
            }
        }
        if(1 != this.Bg_sIndex)
        {
            this.btn_pageup.setColor(cc.color(3,177,92));
        }
        else
        {
            this.btn_pageup.setColor(cc.color(155,155,155));
        }
        if(4 > this.Bg_sIndex)
        {
            this.btn_pagedown.setColor(cc.color(3,177,92));
        }
        else
        {
            this.btn_pagedown.setColor(cc.color(155,155,155));
        }

        util.setCacheItem(PokerBgGCCacheKey , this.Bg_sIndex);
        qp.event.send('appGameBackground', {});
        for (var i = 0; i < Setting_BgCfg.length; i++) {
            this.Bgimg_light[i].setVisible(i == (this.Bg_sIndex-1));
        }
    },

    Btn_pageup_click:function()
    {
        if(this.Bg_sIndex>1)
        {
            this.Bg_sIndex--;
            this.UpdateCurrentPagefunc();
        }
        this.updateButtons();
    },
    Btn_pagedown_click:function()
    {
        if(this.Bg_sIndex<4)
        {
            this.Bg_sIndex++;
            this.UpdateCurrentPagefunc();
        }
        this.updateButtons();
    },

    onEnter: function () {
        this._super();

    },

    onExit: function () {
        this._super();

    },

    ChangeBg_Event:function () {

    },

    onToggle_Bg: function () {
        var index = this['index'];
        var _this = this['this'];
        var img_light = this['img_light'];
        var key = this['cacheKey'];
        var value = this['cacheValue'];
        var callBack = this['callBack'];

        util.setCacheItem(key , value);
        qp.event.send('appGameBackground', {});
        for (var i = 0; i < Setting_BgCfg.length; i++) {
            img_light[i].setVisible(i == index);
        }
        if (callBack) callBack(index);
    },

    onToggle_Back: function () {
        var index = this['index'];
        var _this = this['this'];
        var img_light = this['img_light'];
        var key = this['cacheKey'];
        var value = this['cacheValue'];
        var callBack = this['callBack'];

        util.setCacheItem(key , value);
        qp.event.send('appGameBack', {});
        for (var i = 0; i < Setting_BackCfg.length; i++) {
            img_light[i].setVisible(i == index);
        }
        if (callBack) callBack(index);
    },
});