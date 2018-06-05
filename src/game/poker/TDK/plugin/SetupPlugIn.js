var TDKSetupPlugIn = cc.Layer.extend({

    ctor: function (context,arg) {
        this._super();
        this.mContext = context;
        var root = util.LoadUI(TDKJson.SetupPlugIn).node;
        this.addChild(root);

        this.setContentSize(root.getContentSize());
        this.mRoot = root;

        var pArray = new Array();
        var cacheKey = "TDK_XZ_TYPE";
        var cacheVs = [TDK_XZ_TYPE.CLICK_T , TDK_XZ_TYPE.TOUCH_T];
		for (var i = 0; i < 2; i++) {
			var panel = ccui.helper.seekWidgetByName(this.mRoot, "panel_music" + i);
			var checkbox = ccui.helper.seekWidgetByName(this.mRoot, "checkbox_music" + i);
			checkbox.setTouchEnabled(false);
			panel._checkBox = checkbox;
			var cahceV = parseInt(util.getCacheItem(cacheKey) || 1 );
			
			var bl = cahceV === cacheVs[i];
			checkbox.setSelected(bl);
			panel.setTouchEnabled(!bl);
			pArray.push(panel);

			var clickData = {};
			clickData['this'] = this;
			clickData['cacheValue'] = cacheVs[i];
			clickData['index'] = i;
			clickData['array'] = pArray;
			clickData['cacheKey'] = cacheKey;
			panel.addClickEventListener(this.onToggle.bind(clickData));
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
		var array = this['array'];
		var key = this['cacheKey'];
		var value = this['cacheValue'];
        var callBack = this['callBack'];

        util.setCacheItem(key , value);

		for (var i = 0; i < array.length; i++) {
			array[i].setTouchEnabled(i != index);
			array[i]._checkBox.setSelected(i == index);
		}
		if (callBack) callBack(index);
	},

});