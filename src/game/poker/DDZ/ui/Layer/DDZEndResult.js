
var DDZEndResult = cc.Layer.extend({
	root: null,
	panel_cell: null,
	listview_result: null,
	image_head_deinit: false,
	data: null,
	ctor: function (data) {
		this._super(data);
		this.data = XYGLogic.Instance.report;
		JJLog.print('End Result:' + JSON.stringify(this.data));
		this.root = util.LoadUI(DDZPokerJson.EndResult).node;
		this.addChild(this.root);
		var image_title_word = ccui.helper.seekWidgetByName(this.root, "image_title_word");
		var image_title_bg = ccui.helper.seekWidgetByName(this.root, "image_title_bg");
		var btn_back = ccui.helper.seekWidgetByName(this.root, "btn_back");
		btn_back.addClickEventListener(function () {
            DDZPoker.net.leavePrivateTable(1, function (data) {
				var majHall = new MajhongHall();
				majHall.showHall();
			});
		});
		var btn_share = ccui.helper.seekWidgetByName(this.root, "btn_share");
		btn_share.addClickEventListener(function () {
			hall.net.wxShareScreen(0);
		});
		if (hall.songshen == 1) {
			btn_share.setVisible(false);
			btn_back.setPositionX(600);
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

		text_room_id.setString('房号:' + XYGLogic.Instance.roomId);
		text_room_id.setVisible(true);
		text_room_info.setString('局数:' + XYGLogic.Instance.currentRound);
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
		timeStr += sec < 10 ? '0' + sec : sec;
		text_room_time.setString(timeStr);
		text_room_time.setVisible(true);
	},

	initList: function () {

		var data = this.data;
		JJLog.print(JSON.stringify(data));

		this.listview_result.removeAllChildren();
		var playerArray = data['players'];

		for (var i = 0; i < playerArray.length; i++) {
			var info = playerArray[i];
			var cell = this.panel_cell.clone();
			var layout = new ccui.Layout();
			layout.setContentSize(cell.getContentSize());
			layout.addChild(cell);
			var text_name = ccui.helper.seekWidgetByName(cell, "text_name");
			var name = base64.decode(info['nickName']);
			// if (name.length > 10) {
			// 	name = name.slice(0, 10);
            //
			// }
			name = cutStringLenght(name);
			text_name.setString(name);
			var sprite_head = ccui.helper.seekWidgetByName(cell, "image_head");
            var playerData = XYGLogic.Instance.uidOfInfo(info['uid']);
            util.ChangeloadHead(cell,playerData['equip']);
			if (info.headUrl != undefined && info.headUrl.length > 0) {
                util.LoadHead(sprite_head,info.headUrl);
			}

			var image_owner = ccui.helper.seekWidgetByName(cell, "image_owner");
			image_owner.setVisible(data['fangZhu'] == info['uid'])

			var text_id = ccui.helper.seekWidgetByName(cell, "text_id");
			text_id.setString(info['uid']);
			var text_winCount = ccui.helper.seekWidgetByName(cell, "text_winCount");
			text_winCount.setString(info['winCount']);
			var text_loseCount = ccui.helper.seekWidgetByName(cell, "text_loseCount");
			text_loseCount.setString(info['loseCount']);
			var text_bombCount = ccui.helper.seekWidgetByName(cell, "text_bombCount");
			text_bombCount.setString(info['bombCount']);
			var text_score = ccui.helper.seekWidgetByName(cell, "text_score");
			//hxx
			if(info['coinNum']>=0)
			{
                text_score.setTextColor(cc.color(24,172,0));
			}
			else
			{
                text_score.setTextColor(cc.color(216,0,0));
			}
            var Image_bg_brader = ccui.helper.seekWidgetByName(cell, "Image_bg_brader");
            // var image_head_brader = ccui.helper.seekWidgetByName(cell, "image_head_brader");
            if (info['uid'] == hall.user.uid) {
                Image_bg_brader.setVisible(true);
                // image_head_brader.loadTexture(DDZPokerPic.Me_TouxiangkuanPng,ccui.Widget.LOCAL_TEXTURE)
            }
            else
			{
                Image_bg_brader.setVisible(false);
                // image_head_brader.loadTexture(DDZPokerPic.He_TouxiangkuanPng,ccui.Widget.LOCAL_TEXTURE)
			}

			text_score.setString(info['coinNum']);
			var image_win = ccui.helper.seekWidgetByName(cell, "image_winner");
			image_win.setVisible(data['bigWiner'] == info['uid']);

			cell.x = 0;
			cell.y = 0;
			cell.setVisible(true);
			this.listview_result.pushBackCustomItem(layout);
		}
		XYGLogic.Instance.report = {};
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
		// var scene = new cc.Scene();
		// scene.addChild(this);
		// if (cc.sys.isNative) {
		// 	cc.director.pushScene(scene);
		// } else {
		// 	cc.director.pushScene(scene);
		// }
		cc.director.getRunningScene().addChild(this,1900);
	}
});
