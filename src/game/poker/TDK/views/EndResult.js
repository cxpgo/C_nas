var TDKEndResult = cc.Layer.extend({
	root: null,
	panel_cell: null,
	listview_result: null,
	image_head_deinit: false,
	data: null,
	
	ctor: function (data) {
		this._super(data);
        this.data = XYGLogic.Instance.report;
		this.root = util.LoadUI(TDKJson.EndResult).node;
		this.addChild(this.root);
		var image_title_word = ccui.helper.seekWidgetByName(this.root, "image_title_word");
		var image_title_bg = ccui.helper.seekWidgetByName(this.root, "image_title_bg");
		var btn_back = ccui.helper.seekWidgetByName(this.root, "btn_back");
		btn_back.addClickEventListener(function () {
			// 	hall.getPlayingGame().leavePrivateTable(1, function (data) {
			// 	JJLog.print('End report leave table resp');
			// 	if (data.code == 200) {
					var majHall = new MajhongHall();
					majHall.showHall();
				// }
			// });
		});
		var btn_share = ccui.helper.seekWidgetByName(this.root, "btn_share");
		btn_share.addClickEventListener(function () {
			hall.net.wxShareScreen(0);
		});
		if (hall.songshen == 1) {
			btn_share.setVisible(false);
		}
		var text_room_id = ccui.helper.seekWidgetByName(this.root, "text_room_id");
		var text_room_info = ccui.helper.seekWidgetByName(this.root, "text_room_info");
		var text_room_time = ccui.helper.seekWidgetByName(this.root, "text_room_time");
		var text_forbidden = ccui.helper.seekWidgetByName(this.root, "text_forbidden");
		var text_version = ccui.helper.seekWidgetByName(this.root, "text_version");
		text_version.setString("Version: " + hall.curVersion);

		this.listview_result = ccui.helper.seekWidgetByName(this.root, "listview_result");

		this.panel_cell = ccui.helper.seekWidgetByName(this.root, "panel_cell");
		this.panel_cell.setVisible(false);

		text_room_id.setString('房间号:' + XYGLogic.Instance.Data.tableId);
		text_room_id.setVisible(true);
        text_room_info.setString('局数:' + (XYGLogic.Instance.Data.currRounds - 1));
		text_room_info.setVisible(true);

		var date = new Date();
		var timeStr = '';
		var month = date.getMonth();
		month += 1;
		timeStr += month < 10 ? '0' + month + '-' : month + '-';
		var day = date.getDate();
		timeStr += day < 10 ? '0' + day + ' ' : day + ' ';
		var hour = date.getHours();
		timeStr += hour < 10 ? '0' + hour + ':' : hour + ':';
		var minute = date.getMinutes();
		timeStr += minute < 10 ? '0' + minute + ':' : minute + ':';
		var sec = date.getSeconds();
		timeStr += sec < 10 ? '0' + sec : sec
			;
		text_room_time.setString(timeStr);
		text_room_time.setVisible(true);

	},

	initList: function () {

		var data = this.data;
		JJLog.print(JSON.stringify(data));

		var personList = {2:90,3:265,4:155,5:15};

		this.listview_result.removeAllChildren();
		var playerArray = data['players'];
		JJLog.print(playerArray.length);
        this.listview_result.x = personList[playerArray.length];
		var winner_id = -1;
		var fangzhu_id = -1;
		if (data['bigWiner'] != undefined) winner_id = data['bigWiner'];
		if (data['fangZhu'] != undefined) fangzhu_id = data['fangZhu'];

		var colors = {
			name: cc.color(161, 95, 15),
			id: cc.color(169, 169, 169),
			result: cc.color(196, 17, 47),
		}

		for (var i = 0; i < playerArray.length; i++) {
			var info = playerArray[i];
			var id = info['uid'];
			var cell = this.panel_cell.clone();
			var layout = new ccui.Layout();
			layout.setContentSize(cell.getContentSize());
			layout.addChild(cell);
			var text_name = ccui.helper.seekWidgetByName(cell, "text_name");
			var name = info['nickName'];
			name = cutStringLenght(name);
			text_name.setString(name);
			text_name.setTextColor(colors.name);
			JJLog.print(info['nickName']);

			var sprite_head = ccui.helper.seekWidgetByName(cell, "image_head");
            var playerData = XYGLogic.Instance.uidOfInfo(info['uid']);
            util.ChangeloadHead(cell,playerData['equip']);
			if (info.headUrl != undefined && info.headUrl.length > 0) {
				util.LoadHead(sprite_head, info.headUrl);
			}

			var text_id = ccui.helper.seekWidgetByName(cell, "text_id");
			text_id.setString('ID:' + info['uid']);
			text_id.setTextColor(colors.id);

			var text_tg_c = ccui.helper.seekWidgetByName(cell, "text_tg_c");
            text_tg_c.setString('托管次数   ' + info['bombCount']);
            text_tg_c.setTextColor(colors.name);
			var text_fail_c = ccui.helper.seekWidgetByName(cell, "text_fail_c");
            text_fail_c.setString('输的次数   ' + info['loseCount']);
            text_fail_c.setTextColor(colors.name);
			var text_succ_c = ccui.helper.seekWidgetByName(cell, "text_succ_c");
            text_succ_c.setString('赢的次数   ' + info['winCount']);
            text_succ_c.setTextColor(colors.name);

			var text_score = ccui.helper.seekWidgetByName(cell, "text_score");
			//        text_score.setTextColor(color);
			//         text_score.setString(info['coinNum']);
			//           text_score.setTextColor(colors.result);
			if (info.coinNum > 0) {
				// todo 绿色
				text_score.setString("+" + info['coinNum']);
				text_score.setTextColor(CommonParam.greenColor)
			} else if (info.coinNum <= 0) {
				//todo 红色
				text_score.setString(info['coinNum']);
				text_score.setTextColor(CommonParam.redColor)
			}
			var image_me = ccui.helper.seekWidgetByName(cell, "image_me");
			var image_he = ccui.helper.seekWidgetByName(cell, "image_he");
            if (id == hall.user.uid)
			{
                image_me.setVisible(true);
                image_he.setVisible(false);
                text_name.setTextColor(cc.color(202, 107, 0, 255));
                text_id.setTextColor(cc.color(202, 107, 0, 255));
			}
			else
			{
                image_me.setVisible(false);
                image_he.setVisible(true);
                text_name.setTextColor(cc.color(142, 96, 43, 255));
                text_id.setTextColor(cc.color(142, 96, 43, 255));
			}
			var image_winner = ccui.helper.seekWidgetByName(cell, "image_winner");
			image_winner.setVisible(false);
			var image_fz = ccui.helper.seekWidgetByName(cell, "image_fz");
            image_fz.setVisible(false);
			if (id == winner_id) image_winner.setVisible(true);
			if (id == fangzhu_id) image_fz.setVisible(true);

			if (playerArray.length == 2) {
				cell.x = 295;
				cell.y = 0;

			} else {
				cell.x = 0;
				cell.y = 0;
			}

			cell.setVisible(true);
			if (id == hall.user.uid) {
				this.listview_result.insertCustomItem(layout, 0);
			} else {
				this.listview_result.pushBackCustomItem(layout);
			}


		}
        TDKPoker.table.report = {};
	},

	onEnter: function () {
		this._super();
		this.initList();
		// sound.stopBgSound();
		// sound.stopEffect();
	},

	onExit: function () {
		this._super();
		this.image_head_deinit = true;
	},

	showGameResult: function () {
		var scene = new cc.Scene();
		scene.addChild(this);
		if (cc.sys.isNative) {
			cc.director.replaceScene(scene);
		} else {
			cc.director.runScene(scene);
		}
	}
});
