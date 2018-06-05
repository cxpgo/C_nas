var SetupPlugInScene = cc.Layer.extend({

    ctor: function (context,cb) {
        this._super();
        this.mContext = context;
        this.mCallback = cb;
        var root = util.LoadUI(GameRes.SetupPlugInScene).node;
        this.addChild(root);

        this.setContentSize(root.getContentSize());
        this.mRoot = root;

        var pArray = new Array();
        var cacheKey = MJGVCacheKey;
        var cacheVs = [MJGVType.V2D , MJGVType.V3D];
        this.Btn_Ay = new Array();
        this.Img_Ay = new Array();
        this.Use_Ay = new Array();
        var btn_2D = ccui.helper.seekWidgetByName(this.mRoot, "btn_2D");
        var btn_3D = ccui.helper.seekWidgetByName(this.mRoot, "btn_3D");
        this.Btn_Ay.push(btn_2D);
        this.Btn_Ay.push(btn_3D);
        var img_2D = ccui.helper.seekWidgetByName(this.mRoot, "img_2D");
        var img_3D = ccui.helper.seekWidgetByName(this.mRoot, "img_3D");
        this.Img_Ay.push(img_2D);
        this.Img_Ay.push(img_3D);
        var img_use2D = ccui.helper.seekWidgetByName(this.mRoot, "img_use2D");
        var img_use3D = ccui.helper.seekWidgetByName(this.mRoot, "img_use3D");
        this.Use_Ay.push(img_use2D);
        this.Use_Ay.push(img_use3D);
        for(var i=0;i<2;i++)
		{
            var cahceV = parseInt(util.getCacheItem(cacheKey) || 0 );
            var bl = cahceV === cacheVs[i];
            this.Btn_Ay[i].setTouchEnabled(!bl);
            this.Img_Ay[i].setVisible(bl);
            this.Img_Ay[i].setBright(bl);
            this.Use_Ay[i].setVisible(bl);
            this.Use_Ay[i].setBright(bl);
            var clickData = {};
            clickData['this'] = this;
            clickData['cacheValue'] = cacheVs[i];
            clickData['index'] = i;
            clickData['Btn_Ay'] = this.Btn_Ay;
            clickData['Img_Ay'] = this.Img_Ay;
            clickData['Use_Ay'] = this.Use_Ay;
            clickData['cacheKey'] = cacheKey;
            clickData['callBack'] = this.mCallback;
            this.Btn_Ay[i].addClickEventListener(this.onToggle.bind(clickData));
		}
    },
    
    onEnter: function () {
        this._super();

    },
    
    onExit: function () {
        this._super();

    },

    onToggle: function () {
		var index = this['index'];
		var _this = this['this'];
		var Btn_Ay = this['Btn_Ay'];
		var Img_Ay = this['Img_Ay'];
		var Use_Ay = this['Use_Ay'];
		var key = this['cacheKey'];
		var value = this['cacheValue'];
        var callBack = this['callBack'];

        util.setCacheItem(key , value);

		for (var i = 0; i < 2; i++) {
            Btn_Ay[i].setTouchEnabled(i != index);
            Img_Ay[i].setVisible(i == index);
            Img_Ay[i].setBright(i == index);
            Use_Ay[i].setVisible(i == index);
            Use_Ay[i].setBright(i == index);
		}
		if (callBack) callBack(index);
	},

});