MJEndResultBase = cc.Layer.extend({
	
	ctor: function (data , resFile) {
		this._super( data );
		this.data = XYGLogic.table.report;

		JJLog.print('End Result:' + JSON.stringify(this.data));

		this.root = util.LoadUI(resFile || MJBaseRes.EndResult).node;
		this.addChild(this.root);

		var image_title_word = ccui.helper.seekWidgetByName(this.root, "image_title_word");
		var image_title_bg = ccui.helper.seekWidgetByName(this.root, "image_title_bg");
		var btn_back = ccui.helper.seekWidgetByName(this.root, "btn_back");
		btn_back.addClickEventListener( this.onleaveRoomEvent.bind(this) );
		var btn_share = ccui.helper.seekWidgetByName(this.root, "btn_share");
		btn_share.addClickEventListener(function () {
			hall.net.wxShareScreen(0);
		});
		if (hall.songshen == 1) {
			btn_share.setVisible(false);
		}
		var text_room_id = ccui.helper.seekWidgetByName(this.root, "text_room_id");
		var text_fangzhu_id = ccui.helper.seekWidgetByName(this.root, "text_fangzhu_id");

		var text_room_time = ccui.helper.seekWidgetByName(this.root, "text_room_time");
		var text_forbidden = ccui.helper.seekWidgetByName(this.root, "text_forbidden");

		var text_version = ccui.helper.seekWidgetByName(this.root, "text_version");
		text_version.setString("Version: " + hall.curVersion);

		this.listview_result = ccui.helper.seekWidgetByName(this.root, "listview_result");

		this.panel_text = ccui.helper.seekWidgetByName(this.root, "panel_text");
		this.panel_cell = ccui.helper.seekWidgetByName(this.root, "panel_cell");
		this.panel_cell.setVisible(false);

		text_room_id.setString('房间号:' + XYGLogic.table.roomId);
		text_room_id.setVisible(true);

		// text_fangzhu_id.string = "房主ID:"+this.data.fangZhu;
		// text_fangzhu_id.setVisible(true);

		var timeH = this.data.gameEndTime || Date.now();
		if( String(Date.now()).length == (String(timeH).length + 3) ){
			timeH = timeH * 1000;
		}
		text_room_time.setString(util.FormatDate(new Date(timeH)));
		text_room_time.setVisible(true);

		var text_room_info = ccui.helper.seekWidgetByName(this.root, "text_room_info");
        var str = XYGLogic.table.getTableDes();
		text_room_info.setString(str);
	},

	initList: function () {

		var data = this.data;
		JJLog.print(JSON.stringify(data));

		this.listview_result.removeAllChildren();
		var playerArray = data['players'];
		JJLog.print(playerArray.length);

		var winner_id = -1;
		var paoer_id = -1;
		var owner_id = -1;
		if (data['bigWiner'] != undefined) winner_id = data['bigWiner'];
		if (data['fangZhu'] != undefined) owner_id = data['fangZhu'];
		if (data['paoShou'] != undefined) paoer_id = data['paoShou'];

		for (var i = 0; i < playerArray.length; i++) {
			var info = playerArray[i];
			var id = info['uid'];
			var cell = this.panel_cell.clone();
			var layout = new ccui.Layout();
			layout.setContentSize(cell.getContentSize());
			layout.addChild(cell);
			var text_name = ccui.helper.seekWidgetByName(cell, "text_name");
			var name = base64.decode(info['nickName']);
			text_name.setString(util.ShortName(name, 5));

			var sprite_head = ccui.helper.seekWidgetByName(cell, "image_head");
            util.ChangeloadHead(cell,info['equip']);
			if (info.headUrl != undefined && info.headUrl.length > 0) {
				if (info.headUrl.substring(info.headUrl.length - 1, info.headUrl.length) == "0") {
					info.headUrl = info.headUrl.substring(0, info.headUrl.length - 1) + "96";
				}
				util.LoadHead(sprite_head , info.headUrl);
			}

			var text_id = ccui.helper.seekWidgetByName(cell, "text_id");
			text_id.setString('ID:' + info['uid']);

            var img_my_bg = ccui.helper.seekWidgetByName(cell, "img_my_bg");
            var img_he_bg = ccui.helper.seekWidgetByName(cell, "img_he_bg");
            if(info['uid'] == hall.user.uid)
            {
                img_my_bg.setVisible(true);
                img_he_bg.setVisible(false);
                text_name.setTextColor(cc.color(202, 107, 0, 255));
                text_id.setTextColor(cc.color(202, 107, 0, 255));
            }
            else
            {
                img_my_bg.setVisible(false);
                img_he_bg.setVisible(true);
                text_name.setTextColor(cc.color(142, 96, 43, 255));
                text_id.setTextColor(cc.color(142, 96, 43, 255));
            }

			var text_score = ccui.helper.seekWidgetByName(cell, "text_score");
			var scoreStr = info['coinNum'];
			if(info['coinNum'] >= 0){
                text_score.setTextColor(cc.color(29, 153, 0, 255));
				scoreStr = "+" + scoreStr;
                text_score.setString(scoreStr);
			}
			else
			{
                text_score.setString( scoreStr );
                text_score.setTextColor(cc.color(255, 0, 0, 255));
			}

            this.drawCellEndInfo(cell , info)

			var image_paoer = ccui.helper.seekWidgetByName(cell, "image_paoer");
			image_paoer.setVisible(false);
			var image_winner = ccui.helper.seekWidgetByName(cell, "image_winner");
			image_winner.setVisible(false);
			var image_owner = ccui.helper.seekWidgetByName(cell, "image_owner");
			image_owner.setVisible(false);
			// if (id == paoer_id) image_paoer.setVisible(true);
			if (id == owner_id) image_owner.setVisible(true);
			if (id == winner_id) image_winner.setVisible(true);


            image_owner.setVisible(false);
			if (playerArray.length == 2) {
				cell.x = 295;
				cell.y = 0;

			} else {
				cell.x = 0;
				cell.y = 0;
			}

			cell.setVisible(true);
			if (id == owner_id) {
				this.listview_result.insertCustomItem(layout, 0);
			} else {
				this.listview_result.pushBackCustomItem(layout);
			}
			if(XYGLogic.table.isGold != 1) {
				var cellnorVisibleChilds = [
					"image_owner",
				];
				util.NodesForeverVibleForParent(cell , cellnorVisibleChilds , false);	
			}
		}

		XYGLogic.table.report = {};
	},

	drawCellEndInfo: function (cell , info) {
		//加载结算配置
		var ListView_1 = ccui.helper.seekWidgetByName(cell, "ListView_1");
		var cfg = this.getEndResultCfg(info);
		var _Lheight = ListView_1.height;
		var _height = _Lheight/cfg.length;
		for(var j=0;j<cfg.length;j++)
		{
			var clone = this.panel_text.clone();
			clone.setPosition(0,0);
			var text_name = ccui.helper.seekWidgetByName(clone, "text_name");
			var text_value = ccui.helper.seekWidgetByName(clone, "text_value");
			text_name.setString(cfg[j][0]);
			text_value.setString(cfg[j][1]);
			var text_layout = new ccui.Layout();
			text_layout.setContentSize(clone.getContentSize().width,_height);
			text_layout.addChild(clone);
			text_layout.setPosition(0,0);
			ListView_1.pushBackCustomItem(text_layout)
		}
	},

	onEnter: function () {
		this._super();
		this.initList();
		sound.stopBgSound();
		sound.stopEffect();
	},

	onExit: function () {
		this._super();
		this.image_head_deinit = true;
	},

	showGameResult: function () {
		cc.director.getRunningScene().addChild(this, 900);
        this.runAction(cc.sequence(cc.delayTime(1.0), cc.show()));
	},
	onleaveRoomEvent: function () {
        XYGLogic.Instance.leavePrivateTable(1, function (data) {
			JJLog.print('End report leave table resp');
			var majHall = new MajhongHall();
			majHall.showHall();
		});
	},

	//==========
	getEndResultCfg: function () {},
});
