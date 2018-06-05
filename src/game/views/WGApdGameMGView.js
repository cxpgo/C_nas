var WGApdGameMGView = cc.Layer.extend({

    ctor: function () {
        this._super();
        var root = util.LoadUI(GameRes.WGApdGameMGView).node;
        this.setContentSize(root.getContentSize());
        this.addChild(root);
        this.mItemClone = ccui.helper.seekWidgetByName(root , "panel_item_clone");
        this.mListView = ccui.helper.seekWidgetByName(root , "ListView");
        this.drawAllGames();
        this.mItemClone.setVisible(false);
    },

    drawAllGames: function () {
        var tempLayout = null;
		var cellCount = 4;
		var cellOffWidth = 5;
        var cellOffHeight = 0;
        var dIndex = 0
        // hall.gameEntries
        var mgrGames = PackageMgr.getGamesForMg();
        _.forEach(mgrGames , function (game) {
            var cell = this.mItemClone.clone();

			var layout = ((dIndex % cellCount) === 0 || !tempLayout) ? new ccui.Layout() : tempLayout;
			if (tempLayout != layout) {
				layout.height = cell.getContentSize().height + cellOffHeight;
				layout.width = cell.getContentSize().width * cellCount + cellOffWidth * (cellCount);
				
				tempLayout = layout;
                // panelTip.addChild(layout);	
                this.mListView.pushBackCustomItem(layout);
			}

            var checkbox = ccui.helper.seekWidgetByName(cell, "checkbox");
            checkbox.setTouchEnabled(false);

            var text = ccui.helper.seekWidgetByName(cell, "text");
            text.string = game.GameValue;

            var clickData = {};
            clickData['this'] = this;
            clickData['checkBox'] = checkbox;
            clickData['itemValue'] = game.appId;
            var bl = PackageMgr.isUsed(game.appId);
            checkbox.setSelected(bl);
            cell.addClickEventListener(this.onSwitchSelect.bind(clickData));

			cell.x = cell.getContentSize().width * (dIndex % cellCount) + cellOffWidth * (dIndex % cellCount);
            cell.y = 0;
            cell.setVisible(true);
            layout.addChild(cell);
            dIndex ++;
        }.bind(this));
        
    },

    onSwitchSelect: function () {
        var _this = this['this'];
        var checkBox = this['checkBox'];
        var key = this['itemKey'];
        var value = this['itemValue'];
        checkBox.setSelected(!checkBox.isSelected());
        if(checkBox.isSelected()){
            PackageMgr.appendUsedGameID(value);
        }else{
            PackageMgr.removeUsedGameID(value);
        }
    },
});