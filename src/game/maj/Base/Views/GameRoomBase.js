var _TunDirCfg_ = [
	"image_east",
	"image_south",
	"image_west",
	"image_north",
];

var MJGameRoomBase = cc.Layer.extend({
	initParam: function () {
		this.panel_head = null;
		this.seatHeads = [];
		this.seat_left = null;
		this.seat_right = null;
		this.seat_up = null;
		this.seat_self = null;
		this.panel_status = null;
		this.image_dirc = null;
		this.turnImgArr = [];
		this.text_clock = null;
		this.text_remain = null;
		this.text_round = null;
		this.panel_player = null;
		this.panel_ready = null;
		this.btn_ready = null;
		this.imgReadyArray = null;
		this.panel_desk = null;
		this.btn_add = null;
		this.panel_cover = null;
		this.panel_option_waiting = null;
		this.panel_option_playing = null;
		this.bird = null;
		this.panel_infomation = null;
		this.text_room_name = null;
		this.text_msg = null;
		this.deskArray = null;
		this.idArray = null;
		this.selfDesk = null;
		this.rightDesk = null;
		this.upDesk = null;
		this.leftDesk = null;
		this.text_count = null;
		this.imgReadyArray = [];
		this.speakTip = null;
		this.totalIndex = 0;
		this.nowIndex = 0;
		this._Listeners = [];
		this.resultData = null;
		this.totalRound = 0;
		this.autoSendRecord = false;
		this.intervalTouchSpeak = 0;
		this.beginSpeak = false;
		this.talkRecordTime = 0;
		this.gameMode = GameMode.PLAY;
		this.turnUid = 0;//谁出牌
		this.panel_huapai = null;
		this.img_kaijin = null;
		this.imgHuaPaiArray = [];
		this.textHuaPaiArray = [];
		this.listviewHuapaiArray = [];
		this.imgHuaArray = [];
		this.actionsHuaPai = null;
		this.actionsJinPai = null;
		this.jinpaiPos = null;
		this.jinpaiCard = null;
		this.img_jinIcon = null;
		this.isDoHuaPaiAction = false;
		this.isDoKaiJinAction = false;
		this.panel_youjinAct = null;
		this.node_youzi = null;
		this.node_youjin = null;
		this.image_Bg = null;
		this.roomInfo = null;
		this.clockOptTime = 0;
		this.mGameDesk = null;
		this.mCurGameStatus = 0;
		this.mRotation = [];
	},
	ctor: function () {
		this.initParam();
		
		MJSoundMgr.create();

		this._super();
		this.setOption();

		var root = util.LoadUI(this.UIFile).node;
		this.mRoot = root;
		this.addChild(root);
		var self = this;
		if (this.UIPlugIns && this.UIPlugIns instanceof Array) {
			_.forEach(this.UIPlugIns, function (plugInCfg) {
				self._loadPluginView(plugInCfg);
			});
		}
		this._initView();
	},

	_loadPluginView: function (plugInCfg) {
		var plugInViewFile = GetMJGVCacheV() == MJGVType.V2D ? plugInCfg.V2D : plugInCfg.V3D;
		var node = util.LoadUI(plugInViewFile).node;
		if (!node) return;
		//取 @plugin@ 层  这是规定
		var pluginNode = ccui.helper.seekWidgetByName(node, "@plugin@");
		if (!pluginNode) return;
		var child,
			children = pluginNode.getChildren(),
			length = children.length;
		for (var i = 0; i < length; i++) {
			child = children[i];
			var childName = child.getName();
			var parentNode = ccui.helper.seekWidgetByName(this.mRoot, childName);
			if (parentNode) {
				var nn = child.clone();
				parentNode.addChild(nn);
			}
		}

	},

	_initView: function () {
		var root = this.mRoot;

		this.img_logo = ccui.helper.seekWidgetByName(root, "img_logo");
		this.panel_head = ccui.helper.seekWidgetByName(root, "panel_head");
		this.seat_left = ccui.helper.seekWidgetByName(this.panel_head, "seat_left");
		this.seat_right = ccui.helper.seekWidgetByName(this.panel_head, "seat_right");
		this.seat_up = ccui.helper.seekWidgetByName(this.panel_head, "seat_up");
		this.seat_self = ccui.helper.seekWidgetByName(this.panel_head, "seat_self");

		this.seatHeads[0] = this.seat_self;
		this.seatHeads[1] = this.seat_right;
		this.seatHeads[2] = this.seat_up;
		this.seatHeads[3] = this.seat_left;

		this.seatHeads[0].setVisible(false);
		this.seatHeads[1].setVisible(false);
		this.seatHeads[2].setVisible(false);
		this.seatHeads[3].setVisible(false);

		this.panel_status = ccui.helper.seekWidgetByName(root, "panel_status");
		this.image_dirc = ccui.helper.seekWidgetByName(this.panel_status, "image_dirc");

		this.text_clock = ccui.helper.seekWidgetByName(this.panel_status, "text_clock");
		this.text_remain = ccui.helper.seekWidgetByName(this.panel_status, "text_remain");
		this.text_round = ccui.helper.seekWidgetByName(this.panel_status, "text_round");
		this.text_count = ccui.helper.seekWidgetByName(this.panel_status, "text_count");
		this.text_count.setString('-');
		this.panel_status.setVisible(false);

		this.panel_player = ccui.helper.seekWidgetByName(root, "panel_player");

		this.panel_ready = ccui.helper.seekWidgetByName(root, "panel_ready");
		this.btn_ready = ccui.helper.seekWidgetByName(this.panel_ready, "btn_ready");
		this.imgReadyArray[0] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_self");
		this.imgReadyArray[1] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_right");
		this.imgReadyArray[2] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_up");
		this.imgReadyArray[3] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_left");
		this.imgReadyArray[0].setVisible(false);
		this.imgReadyArray[1].setVisible(false);
		this.imgReadyArray[2].setVisible(false);
		this.imgReadyArray[3].setVisible(false);

		this.btn_ready.addClickEventListener(function (data) {
			sound.playBtnSound();
			XYGLogic.table.ready(function (data) {
				_this.btn_ready.setVisible(false);
			});
		});
		this.panel_ready.setVisible(false);

		this.panel_desk = ccui.helper.seekWidgetByName(root, "panel_desk");

		this.panel_cover = ccui.helper.seekWidgetByName(root, "panel_cover");
		this.panel_cover.setVisible(false);

		this.panel_option_waiting = ccui.helper.seekWidgetByName(root, "panel_option_waiting");

		this.panel_option_waiting.setVisible(false);


		this.panel_option_playing = ccui.helper.seekWidgetByName(root, "panel_option_playing");
		this.bird = ccui.helper.seekWidgetByName(root, "image_bird");

		this.panel_infomation = ccui.helper.seekWidgetByName(root, "panel_infomation");
		this.panel_effect_root = ccui.helper.seekWidgetByName(root, "panel_effect_root");

		this.text_msg = ccui.helper.seekWidgetByName(this.panel_infomation, "text_msg");
		this.text_msg.setVisible(false);


		this.deskArray = new Array();
		this.idArray = new Array();

		this.btn_add = ccui.helper.seekWidgetByName(root, "btn_add");
		if (!cc.sys.isNative) {
			this.btn_add.addClickEventListener(function () {
				XYGLogic.Instance.addRobot(1, function (data) {
					JJLog.print('add rebot resp');
				});
			});
		} else {
			// this.btn_add.setVisible(false);
			util.ForeverVisibleNode(this.btn_add, false);
		}
		//花牌 显示数量UI 动画UI
		this.panel_huapai = ccui.helper.seekWidgetByName(root, "panel_huapai");
		this.imgHuaPaiArray[0] = ccui.helper.seekWidgetByName(this.panel_huapai, "img_buhua_self");
		this.imgHuaPaiArray[1] = ccui.helper.seekWidgetByName(this.panel_huapai, "img_buhua_right");
		this.imgHuaPaiArray[2] = ccui.helper.seekWidgetByName(this.panel_huapai, "img_buhua_up");
		this.imgHuaPaiArray[3] = ccui.helper.seekWidgetByName(this.panel_huapai, "img_buhua_left");


		this.textHuaPaiArray[0] = ccui.helper.seekWidgetByName(this.mRoot, "text_huapai_self");
		this.textHuaPaiArray[1] = ccui.helper.seekWidgetByName(this.mRoot, "text_huapai_right");
		this.textHuaPaiArray[2] = ccui.helper.seekWidgetByName(this.mRoot, "text_huapai_up");
		this.textHuaPaiArray[3] = ccui.helper.seekWidgetByName(this.mRoot, "text_huapai_left");

		this.listviewHuapaiArray[0] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_self");
		this.listviewHuapaiArray[1] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_right");
		this.listviewHuapaiArray[2] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_up");
		this.listviewHuapaiArray[3] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_left");

		this.imgHuaArray[0] = ccui.helper.seekWidgetByName(this.mRoot, "img_huapai_self");
		this.imgHuaArray[1] = ccui.helper.seekWidgetByName(this.mRoot, "img_huapai_right");
		this.imgHuaArray[2] = ccui.helper.seekWidgetByName(this.mRoot, "img_huapai_up");
		this.imgHuaArray[3] = ccui.helper.seekWidgetByName(this.mRoot, "img_huapai_left");

		this.img_kaijin = ccui.helper.seekWidgetByName(this.panel_huapai, "img_kaijin");
		this.jinpaiPos = ccui.helper.seekWidgetByName(this.panel_huapai, "jinpaiPos");
		this.img_jinIcon = ccui.helper.seekWidgetByName(this.panel_huapai, "img_jinIcon");
		this.actionsHuaPai = new Array();
		this.actionsJinPai = new Array();

		this.panel_youjinAct = ccui.helper.seekWidgetByName(root, "panel_youjinAct");
		this.panel_youjinAct.setVisible(false);

		this.node_youzi = ccui.helper.seekWidgetByName(this.panel_youjinAct, "node_youzi");
		this.node_youjin = ccui.helper.seekWidgetByName(this.panel_youjinAct, "node_youjin");
	},
	checkMsg: function (data) {
		if (data["code"] == NetErr.OK) {
			return true;
		}
		return false;
	},
	initTable: function () {
		var _this = this;
		this.btn_ready.setVisible(false);
		XYGLogic.table.reqBaseInfo();

	},

	baseReadyInfo: function (data) {
		if (!cc.sys.isObjectValid(this)) {
			return;
		}
		if (this.checkMsg(data)) {
			this.mCurGameStatus = data['tableStatus']['tableStatus'];

			var nextChuPai = data['tableStatus']['lastOP']['nextUid'] || hall.user.uid;
			if (data['tableStatus']["paiChuTime"] && data['tableStatus']["paiChuTime"] > 0) {
				this.clockOptTime = data['tableStatus']["paiChuTime"];
			}
			this.showTableInfo(data['tableStatus']);
			this.showPanelPlayer(data['tableStatus']);
			this.checkGameStatus(data);
			var infoPlayers = data['tableStatus']['players'];
			for (var i = 0; i < infoPlayers.length; i++) {
				var ready = infoPlayers[i]['isReady'];
				var uid = infoPlayers[i]['uid'];

				if (infoPlayers[i]['isGang'] > 0 && uid == hall.user.uid) {
					this.panel_cover.setVisible(true);
					var tingChoice = infoPlayers[i]['tingChoice'];
					var event = new cc.EventCustom(CommonEvent.TINGChOICE);
					event.setUserData(tingChoice);
					cc.eventManager.dispatchEvent(event);
				}

				// //大安麻将断线重连，别人听牌，你不能打的牌
				// if (uid == hall.user.uid) {
				// 	if(infoPlayers[i].hasOwnProperty('noDelPai'))
				// 	{
				//         var noDelPai = infoPlayers[i]['noDelPai'];
				//         qp.event.send("appOnDelCard" , noDelPai);
				// 	}
				// }

				// if(infoPlayers[i].hasOwnProperty('showCards'))
				// {
				//     var showCards = infoPlayers[i]['showCards'];
				//     qp.event.send("appOnShowCards" , showCards);
				// }

				if (uid == hall.user.uid) {
					if (ready == 0) {
						XYGLogic.table.ready(function (data) {
						});
					}
					break;
				}
			}
		}
	},
	startRecordSpeaker: function () {
		this.schedule(this.recordTime, 1);
	},

	stopRecordSpeaker: function () {
		this.unschedule(this.recordTime);
	},

	resetRecordTime: function () {
		this.talkRecordTime = 0;
		this.beginSpeak = false;
		this.stopRecordSpeaker();
		JJLog.print('resetRecordTime ======' + this.speakTip != null);
		if (this.speakTip || !!this.speakTip || this.speakTip != null) {
			this.speakTip.dismiss();
			this.speakTip = null;
		}
	},

	recordTime: function (dt) {
		this.talkRecordTime++;
		if (this.talkRecordTime > 10) {
			this.autoSendRecord = true;
			this.resetRecordTime();
			XYGLogic.net.send();
		}
	},

	resetImageReady: function () {
		// for (var i = 0; i < this.imgReadyArray.length; i++) {
		// 	this.imgReadyArray[i].setVisible(false);
		// }
		this.imgReadyArray.forEach(function (imgReady) {
			imgReady.setVisible(false);
		}.bind(this));
	},


	setDirectionIndicator: function () {
		if (GetMJGVCacheV() == MJGVType.V2D) {
			this._setDirectionIndicator2D();
		} else {
			this._setDirectionIndicator3D();
		}
	},

	_setDirectionIndicator2D: function () {
		var pos = 0;
		for (var i = 0; i < this.idArray.length; i++) {
			if (this.idArray[i] == hall.user.uid) {
				pos = i;
				break;
			}
		}
		//东 南 西 北
		var rotation = [0, 1, 2, 3];
		for (var i = 0; i < 4; i++) {
			var rot = rotation[i];
			var imageDir = this.image_dirc.getChildByName("image_dir" + i)
			imageDir.setName(_TunDirCfg_[rot]);
			imageDir.setVisible(false);
		}

		var du = 0;
		if (XYGLogic.Instance.person == 2) {
			du = pos * 180
		} else {
			du = pos * 90;
		}

		this.image_dirc.runAction(cc.rotateTo(0.05, du));

		this.image_dirc.setVisible(true);
	},

	getMRotation: function () {
		if (XYGLogic.Instance.person == 2) {
			this.mRotation = [[0, 1, 2, 3], [2, 3, 0, 1]]
		} else {
			this.mRotation = [[0, 1, 2, 3], [1, 2, 3, 0], [2, 3, 0, 1], [3, 0, 1, 2]];
		}
	},

	_setDirectionIndicator3D: function () {
		var pos = 0;
		for (var i = 0; i < this.idArray.length; i++) {
			if (this.idArray[i] == hall.user.uid) {
				pos = i;
				break;
			}
		}
		//东 南 西 北

		this.getMRotation();
		var rotation = this.mRotation;
		// var rotation = [0, 1, 2, 3];
		for (var i = 0; i < 4; i++) {
			var rot = rotation[pos][i];
			this.image_dirc.getChildByName("image_" + i).loadTexture("mahjong_play_table_info_" + rot + "_2.png", ccui.Widget.PLIST_TEXTURE);
			var imageDir = this.image_dirc.getChildByName("image_dir" + i)
			imageDir.setName(_TunDirCfg_[rot]);
			imageDir.setVisible(false);
		}

		this.image_dirc.setVisible(true);
	},

	getTunPos: function (index) {
		var pos = 0;
		for (var i = 0; i < this.idArray.length; i++) {
			if (this.idArray[i] == hall.user.uid) {
				pos = i;
				break;
			}
		}
		//东 南 西 北
		this.getMRotation();
		var rotation = this.mRotation;

		return rotation[pos][index];


	},

	getQueSmallByPQ: function (pq) {
		var pF = "";
		switch (pq) {
			case "T":
				pF = "res/Game/Maj/Base/Resoures/dingque/xzmj_T.png";
				break;
			case "B":
				pF = "res/Game/Maj/Base/Resoures/dingque/xzmj_B.png";
				break;
			case "W":
				pF = "res/Game/Maj/Base/Resoures/dingque/xzmj_W.png";
				break;
		}

		return pF;
	},


	onEnter: function () {
		this._super();

		AppCtrl.inGameFirst = false;
		JJLog.print("hall.songshen:", hall.songshen);
		this.registerAllEvents();
		this.registerCustomEvt();
		if (MajhongInfo.GameMode == GameMode.PLAY) {
			this.initTable();
			hall.wxEnterRoom = 0;
		} else if (MajhongInfo.GameMode == GameMode.RECORD) {
			this.panel_ready.setVisible(false);
			this.btn_add.setVisible(false);
			this.panel_option_waiting.setVisible(false);
			this.panel_option_playing.setVisible(false);
			this.panel_cover.setVisible(false);
			this.panel_option_waiting.setVisible(false);

			this.seatHeads[0].setVisible(true);
			this.seatHeads[1].setVisible(true);
			this.seatHeads[2].setVisible(true);
			this.seatHeads[3].setVisible(true);
			qp.event.send('appRecordRoomInfo', {});
		}
	},

	onExit: function () {
		MJSoundMgr.release();

		this.removeAllEvents();
		this.removeCustomEvt();
		if (MajhongInfo.GameMode == GameMode.PLAY) {

			XYGLogic.release();

		} else if (MajhongInfo.GameMode == GameMode.PLAY) {

		}
		this._super();

	},

	registerAllEvents: function () {
		qp.event.listen(this, 'mjReadyStatus', this.onReadyStatus.bind(this));
		qp.event.listen(this, 'mjReadyStart', this.onReadyStart.bind(this));
		qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
		qp.event.listen(this, 'mjPlayerEnter', this.onPlayerEnter.bind(this));
		qp.event.listen(this, 'mjGameResult', this.onGameResult);
		// qp.event.listen(this, 'mjGameOver', this.onGameOver);
		// qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);

		qp.event.listen(this, 'mjSyncParams', this.onSyncParams);
		qp.event.listen(this, 'mjSyncPlayerMocards', this.onSyncPlayerMocards.bind(this));
		qp.event.listen(this, 'mjNotifyDelCards', this.onNotifyDelCards.bind(this));
		qp.event.listen(this, 'mjSyncDelCards', this.onSyncDelCards.bind(this));
		qp.event.listen(this, 'mjSyncPlayerOP', this.onSyncPlayerOP.bind(this));
		qp.event.listen(this, 'mjChatStatus', this.onReciveChat);
		qp.event.listen(this, 'mjPlayerLeave', this.onPlayerLeave);
		qp.event.listen(this, 'mjHuaPai', this.onHuaPai);
		qp.event.listen(this, 'mjSyncHuaPai', this.onSynHuaPai);
		qp.event.listen(this, 'mjJinPai', this.onJinPai);
		qp.event.listen(this, 'mjNotifyDaHu', this.onNotifyDaHu);
		qp.event.listen(this, 'mjNotifyPlayerOP', this.onNotifyPlayerOP.bind(this));
		qp.event.listen(this, 'appGameBaseInfo', this.baseReadyInfo.bind(this));
		qp.event.listen(this, 'appGameHeadTing', this.GameHeadTing.bind(this));
	},

	removeAllEvents: function () {
		qp.event.stop(this, 'mjReadyStatus');
		qp.event.stop(this, 'mjReadyStart');
		qp.event.stop(this, 'mjGameStart');
		qp.event.stop(this, 'mjGameResult');
		qp.event.stop(this, 'mjPlayerEnter');
		qp.event.stop(this, 'mjTableStatus');
		qp.event.stop(this, 'mjSyncParams');
		qp.event.stop(this, 'mjSyncPlayerMocards');
		qp.event.stop(this, 'mjNotifyDelCards');
		qp.event.stop(this, 'mjNotifyAutoDelCards');
		qp.event.stop(this, 'mjSyncDelCards');
		qp.event.stop(this, 'mjSyncPlayerOP');
		qp.event.stop(this, 'mjChatStatus');
		qp.event.stop(this, 'mjPlayerLeave');
		qp.event.stop(this, 'mjHuaPai');
		qp.event.stop(this, 'mjSyncHuaPai');
		qp.event.stop(this, 'mjJinPai');
		qp.event.stop(this, 'mjNotifyDaHu');

		qp.event.stop(this, 'mjNotifyPlayerOP');

		qp.event.stop(this, 'appGameBaseInfo');
		qp.event.stop(this, 'appGameHeadTing');
	},

	GameHeadTing: function (data) {
		var uid = data['uid'];
		for (var i = 0; i < this.deskArray.length; i++) {
			if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
			if (uid == this.deskArray[i].uid) {
				this.deskArray[i].setHeadTingState(true);
				break;
			}
		}
	},

	onHuaPai: function (data) {
		if (data["uid"] == undefined || !data["uid"]) {
			data.uid = hall.user.uid;
		}
		var event = new cc.EventCustom(CommonEventAction.PLAYEROP_EVT);
		event.setUserData(true);
		cc.eventManager.dispatchEvent(event);
		this.actionsHuaPai.push(data);
	},

	onSynHuaPai: function (data) {
		JJLog.print(JSON.stringify(data));
		if (!!data.uid && data.uid != hall.user.uid) {
			this.actionsHuaPai.push(data);
		}
	},

	onJinPai: function (data) {
		var event = new cc.EventCustom(CommonEventAction.PLAYEROP_EVT);
		event.setUserData(true);
		cc.eventManager.dispatchEvent(event);
		this.actionsJinPai.push(data);
	},
	onNotifyDaHu: function (data) {
		// data.huType 1游金 2双游 3 三游 4三金倒  data.uid
		var huType = data['huType'];
		var uid = data['uid'];

		for (var i = 0; i < this.deskArray.length; i++) {
			if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
			if (uid == this.deskArray[i].uid) {
				var position = this.deskArray[i].playerData.position;
				var img = ccui.helper.seekWidgetByName(this.seatHeads[position], "image_tip");
				if (img && huType < 4) {
					img.stopAllActions();
					img.loadTexture("roving" + huType + ".png", ccui.Widget.PLIST_TEXTURE)
					img.setVisible(true);
					img.setOpacity(0);
					var fadeIn0 = cc.fadeIn(1);
					var fadeOut0 = cc.fadeOut(1);
					img.runAction(cc.repeatForever(cc.sequence(fadeIn0, fadeOut0)));
				}
				break;
			}
		}

		var imgStr = '';
		if (huType == 2) {
			imgStr = 'QZMJ_sy_txt_2.png';
		} else if (huType == 3) {
			imgStr = 'QZMJ_sy_txt_3.png';
		}
		var _this = this;
		_this.panel_youjinAct.setVisible(true);

		var img1 = new ccui.ImageView(imgStr, ccui.Widget.PLIST_TEXTURE);
		img1.setScale(5);
		var scale1 = cc.scaleTo(0.1, 1);
		var fadeIn1 = cc.fadeIn(0.1);
		img1.runAction(cc.sequence(
			cc.spawn(scale1, fadeIn1),
			cc.delayTime(0.1),
			cc.callFunc(function () {
				var img2 = new ccui.ImageView('QZMJ_sy_txt_you.png', ccui.Widget.PLIST_TEXTURE);
				img2.setScale(5);
				var scale2 = cc.scaleTo(0.1, 1);
				var fadeIn2 = cc.fadeIn(0.1);
				img2.runAction(cc.sequence(
					cc.spawn(scale2, fadeIn2),
					cc.delayTime(1),
					cc.callFunc(function () {
						_this.panel_youjinAct.setVisible(false);
					}),
					cc.removeSelf()
				));
				_this.node_youzi.addChild(img2, 200);
			}),
			cc.delayTime(2),
			cc.removeSelf()
		));

		_this.node_youjin.addChild(img1, 200);

	},

	showBuhuaPanel: function () {
		for (var i = 0; i < this.textHuaPaiArray.length; i++) {
			this.textHuaPaiArray[i].setString("0");
		}

		for (var i = 0; i < this.imgHuaArray.length; i++) {
			this.imgHuaArray[i].setVisible(false);
		}

		for (var i = 0; i < this.listviewHuapaiArray.length; i++) {
			this.listviewHuapaiArray[i].removeAllChildren();
		}
		this.img_kaijin.setVisible(false);
		this.img_kaijin.setOpacity(255);
	},

	onReadyStart: function (data) {

	},



	onReadyStatus: function (data) {
		var status = data['readyStatus'];//0,1
		var uid = data['uid'];

		var pIndex = XYGLogic.Instance.uidofPos(uid);

		this.btn_ready.setVisible(false);
		if (this.imgReadyArray[pIndex]) {
			if (status == 1) {
				this.imgReadyArray[pIndex].setVisible(true);
				if (uid == hall.user.uid) {
					this.btn_ready.setVisible(false);
				}
			} else {
				this.imgReadyArray[pIndex].setVisible(false);
			}
		}
	},

	onSyncPlayerMocards: function (data) {
		JJLog.print('onSyncPlayerMocards');
		JJLog.print(data);
		this.optTurnLightByUID(data['uid']);
	},

	onNotifyDelCards: function (data) {
		var uid = data['uid'];
		this.optTurnLightByUID(uid);
	},

    onSyncDelCards:function (data) {
        var uid = data['uid'];
        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            if (this.deskArray[i].uid == uid) {
                this.deskArray[i].DelCards_headlight(data);
                break;
            }
        }
    },

	onReciveChat: function (data) {
		JJLog.print(JSON.stringify(data));
		var uid = data['uid'];
		var type = data['data']['type'];
		var index = data['data']['index'];
		var content = data['data']['content'];
		for (var i = 0; i < this.deskArray.length; i++) {
			if (uid == this.deskArray[i].uid) {
				if (type == CHAT_TYPE.Usual) {
					this.deskArray[i].showMsg(index, content);
				} else {
					this.deskArray[i].showFace(index);
				}
				break;
			}
		}
	},

	registerCustomEvt: function () {
		var _this = this;

		var ls = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: CommonEvent.EVT_DESK_MODE,
			callback: this.updateDeskMode.bind(this)
		});
		var listener = cc.eventManager.addListener(ls, this);
		this._Listeners.push(listener);

		var ls2 = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: CommonEvent.EVT_DESK_RESULT_INDEX,
			callback: this.indexCallback.bind(this)
		});
		listener = cc.eventManager.addListener(ls2, this);
		this._Listeners.push(listener);

		var ls3 = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: CommonEvent.EVT_GAMING,
			callback: function (data) {
				JJLog.print(data);
				var dialog = new JJConfirmDialog();
				dialog.setCallback(function () {
					_this.removeAllEvents();
					var hall2 = new MajhongHall();
					hall2.showHall();
				});
				dialog.setDes('房间已经解散了！');
				dialog.showDialog();
			}
		});
		listener = cc.eventManager.addListener(ls3, this);
		this._Listeners.push(listener);

	},

	removeCustomEvt: function () {
		for (var i = 0; i < this._Listeners.length; i++) {
			cc.eventManager.removeListener(this._Listeners[i]);
		}
		this._Listeners.splice(0, this._Listeners.length);
	},

	//胡牌动画播放完后 回调并淡出结算界面
	indexCallback: function (event) {
		JJLog.print('index call back');
		JJLog.print(event);
		this.nowIndex++;
		JJLog.print('nowIndex = ' + this.nowIndex + ' allIndex = ' + this.totalIndex);

        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            this.deskArray[i].DelCards_headlight();
        }

		if (this.nowIndex == this.totalIndex && XYGLogic.Instance.result != null && XYGLogic.Instance.result['roundResult'] == 1) {
			XYGLogic.Instance.showRoundResult();
		}
	},

	onSyncParams: function (data) {
		JJLog.print('mySyncParams');
		JJLog.print(JSON.stringify(data));
		var num = data['havePai'];
		if (num != undefined) {
			this.text_count.setString(num);
		}
	},

	resetReady: function () {
		this.totalIndex = 0;
		this.panel_ready.setVisible(false);
		this.resetImageReady();
		this.btn_ready.setVisible(false);
	},

	showReady: function () {
		this.panel_ready.setVisible(true);
		this.btn_ready.setVisible(true);
		// this.readyStatus();
		XYGLogic.table.ready(function (data) { });
	},

	checkResp: function (data) {
		if (data["code"] == 200) {
			return true;
		}
		return false;
	},
	onSyncPlayerOP: function (data) {
		JJLog.print("onSyncPlayerOP" + JSON.stringify(data));
		var msg = data["msg"];
		var opType = msg["opType"];
		var uid = data['uid'];
		if (opType == OPERATIONNAME.HU) {
			var cards = data['msg']['cards'];
			for (var i = 0; i < cards.length; i++) {
				this.totalIndex++;
				JJLog.print('onSyncPlayerOP total index = ' + this.totalIndex);
			}
		}
		if (this.turnUid == -1 || this.turnUid == uid || opType == OPERATIONNAME.HU) return;
		this.optTurnLightByUID(uid);
	},

	onPlayerEnter: function (data) {
		if (!XYGLogic.table.inited) return;

		var userData = data["user"];
		var pos = userData["position"];
		XYGLogic.table.setSeatPosInfo(userData);
		if (XYGLogic.table.getTablePerson() == 2) {
			this.addUpDesk();
		} else {
			var selfp = XYGLogic.table.selfPos;
			if (pos > XYGLogic.table.selfPos) {
				var a = pos - selfp;
				switch (a) {
					case 1: this.addRightDesk(); break;
					case 2: this.addUpDesk(); break;
					case 3: this.addLeftDesk(); break;
					default: break;
				}
			} else {
				var a = selfp - pos;
				switch (a) {
					case 3: this.addRightDesk(); break;
					case 2: this.addUpDesk(); break;
					case 1: this.addLeftDesk(); break;
					default: break;
				}
			}
		}
	},


	reLoadDirectionIndicator: function (data) {
		var nextChupaiId = data['nextChuPai'];
		this.optTurnLightByUID(nextChupaiId);
	},

	updateDeskMode: function (event) {
		var evt = event.getUserData();
		if (evt == CommonEventAction.GANG_EVT) {
			this.panel_cover.setVisible(true);
		}
	},


	//============================ record history function ===============================================================
	initRecordInfo: function () {
		this.initRecordHead();
		this.initRecordDesk();
	},


	initRecordDesk: function () {
	},

	onNotifyPlayerOP: function (data) {

		if (data["uid"] != hall.user.uid) return;
		// this.startClock(this.clockOptTime);
		this.optTurnLightByUID(hall.user.uid);
	},

	//--------------------时间控制器-----------------
	optTurnLightByUID: function (uid, time) {
		if (!uid || uid < 0) return;
		this.startClock(time || this.clockOptTime);

        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            if (this.deskArray[i].uid == uid) {
                this.deskArray[i].Mocards_headlight();
                break;
            }
        }

		this.turnUid = uid
		var pos = XYGLogic.Instance.uidOfInfo(uid).position;

		if (pos >= 0) {
			this.setTurnLightOff();
			this.turnImgArr[pos].setVisible(true);
			this.turnImgArr[pos].runAction(cc.repeatForever(
				cc.sequence(
					cc.fadeTo(1.0, 100),
					cc.fadeTo(0.8, 255)
				)));
		}
	},

	setTurnLightOff: function () {
		this.turnImgArr.forEach(function (turnNode) {
			turnNode.setOpacity(255);
			turnNode.setVisible(false);
			turnNode.stopAllActions();
		}.bind(this));
	},

	startClock: function (sec) {
		this._setTextClock(sec);
		this.schedule(this.countDown, 1);
	},

	countDown: function (dt) {
		var sec = parseInt(this.text_clock.getString());
		if (sec == 6 && this.turnUid == hall.user.uid) {
			sound.playTimeUpAlarm();
		}
		this._setTextClock(sec);
	},

	_setTextClock: function (sec) {
		if (sec >= 1) {
			sec--;
			if (sec < 10) sec = '0' + sec;
		}
		else {
			sec = '00';
		}

		this.text_clock.setString(sec);
	},

	stopClock: function () {
		this.unschedule(this.countDown);
		this.turnUid = 0;
		sound.stopTimeUpAlarm();
	},

	showTableInfo: function (data) {
		if (!XYGLogic.table) return;

		JJLog.print("桌子=" + JSON.stringify(data));
		this.idArray = data['chairArr'];
		this.initInvite(data);
		this.setDirectionIndicator();

		this.addSelfDesk();
		this.addRightDesk();
		this.addUpDesk();
		this.addLeftDesk();

        for (var j = 0; j < this.deskArray.length; j++) {
            if(this.deskArray[j].uid == data.nextChuPai)
                this.deskArray[j].Mocards_headlight();
        }

		this.showPanelHead(data);
		this.showPanelInfomation(data);
		this.showPanelPlayer(data);
		this.showPanelStatus(data);

	},

	initInvite: function (data) {
		if (data.pid > 0) {
			club.gamePackId = data.pid;
			this.btn_invite_pack = new clubInviteButton(data.pid, data.tableId);
			this.btn_invite_pack.show(this.panel_option_waiting);
		}
	},



	showPanelInfomation: function (data) {
		this.panel_infomation.setVisible(true);
		this.totalRound = data['roundsTotal'];
		var desc = XYGLogic.table.getTableDes();
		this.text_msg.setString(desc);
		this.text_msg.setVisible(true);
	},

	showPanelHead: function (data) {
		this.panel_head.setVisible(true);
	},

	showPanelStatus: function (data) {
		//TODO
	},
	showPanelPlayer: function (data) {
		var infoPlayers = data['players'];
		for (var i = 0; i < infoPlayers.length; i++) {
			var ready = infoPlayers[i]['isReady'];
			var uid = infoPlayers[i]['uid'];

			for (var j = 0; j < this.deskArray.length; j++) {
				if (this.deskArray[j] && uid == this.deskArray[j].uid) {
					if (ready == 1) {
						this.imgReadyArray[j].setVisible(true);
					} else {
						this.imgReadyArray[j].setVisible(false);
						if (hall.user.uid == uid) {
							this.imgReadyArray[j].setVisible(true);
						}
					}
					break;
				}
			}
		}
	},

	addSelfDesk: function () {
		var info = XYGLogic.table.selfSeatInfo();

		var pos = this.getTunPos(XYGLogic.table.uidofPos(info.uid));

		var turnKey = _TunDirCfg_[pos];
		this.turnImgArr[info.position] = ccui.helper.seekWidgetByName(this.image_dirc, turnKey);
		this.seatHeads[info.position] = this.seat_self;
		this.imgReadyArray[info.position] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_self");

	},

	addRightDesk: function () {
		var info = XYGLogic.table.rightSeatInfo();
		if (info != null) {

			var pos = this.getTunPos(XYGLogic.table.uidofPos(info.uid));

			var turnKey = _TunDirCfg_[pos];
			this.turnImgArr[info.position] = ccui.helper.seekWidgetByName(this.image_dirc, turnKey);

			this.seatHeads[info.position] = this.seat_right;
			this.imgReadyArray[info.position] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_right");

		}
	},

	addUpDesk: function () {
		var info = XYGLogic.table.upSeatInfo();
		if (info != null) {
			var pos = this.getTunPos(XYGLogic.table.uidofPos(info.uid));
			var turnKey = _TunDirCfg_[pos];
			this.turnImgArr[info.position] = ccui.helper.seekWidgetByName(this.image_dirc, turnKey);
			this.seatHeads[info.position] = this.seat_up;
			this.imgReadyArray[info.position] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_up");
		}
	},

	addLeftDesk: function () {
		var info = XYGLogic.table.leftSeatInfo();
		if (info != null) {

			var pos = this.getTunPos(XYGLogic.table.uidofPos(info.uid));

			var turnKey = _TunDirCfg_[pos];
			this.turnImgArr[info.position] = ccui.helper.seekWidgetByName(this.image_dirc, turnKey);

			this.imgReadyArray[info.position] = ccui.helper.seekWidgetByName(this.panel_ready, "img_ready_left");
			this.seatHeads[info.position] = this.seat_left;
		}
	},

	checkGameStatus: function (data) {
		if (data['tableStatus']['isOffline'] == 1) {
			sound.playBgSound();
			var players = data["tableStatus"]['players'];

			if (XYGLogic.Instance.isTheStatus("INITTABLE", "PLAYING")) {
				this.btn_add.setVisible(false);
			}

			this.reLoadDirectionIndicator(data['tableStatus']);
			this.setBankerId(data['tableStatus']);
			this.mGameDesk.update();
		}
	},

	setBankerId: function (data) {
		var bankerId = data['banker'];
		XYGLogic.table.bankerId = bankerId;
		for (var i = 0; i < this.deskArray.length; i++) {
			if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
			this.deskArray[i].setBanker(this.deskArray[i].uid == bankerId);
			this.deskArray[i].setBankerCount(data);
		}
	},

	getDeskSeatWithUID: function (uid) {
		if (this.mGameDesk) return this.mGameDesk.getByUID(uid);
	},

	onPlayerLeave: function (data) {

		JJLog.print(JSON.stringify(data));
		if (XYGLogic.table.currentRound > 1)
			return true;
		var uid = data['uid'];
		var pIndex = XYGLogic.Instance.uidofPos(uid);
		if (this.deskArray[pIndex]) {
			var parentPanel = this.deskArray[pIndex].getParent();
			this.deskArray[pIndex].removeFromParent();
			this.deskArray[pIndex] = null;
			this.imgReadyArray[pIndex].setVisible(false);
		}

		if (hall.user.uid == data.uid) {
			this.stopAllActions();
			this.removeAllEvents();
		}
		return false;
	},

	onGameStart: function (data) {
		JJLog.print("start info=" + JSON.stringify(data));
		this.idArray = data['chairArr'];
		var bankerId = data["banker"];

		this.resetReady();
		this.showPanelStatus(data);
		this.btn_add.setVisible(false);

		XYGLogic.Instance.result = null;
		this.totalIndex = 0;
		this.nowIndex = 0;

		sound.playBgSound();

		this.turnUid = bankerId;
		this.startClock(this.clockOptTime);
		this.setTurnLightOff();

		this.optTurnLightByUID(bankerId);

		this.mGameDesk.update();
		this.mGameDesk.reset();
		this.reset();
	},
	onGameResult: function () {
		this.reset();
	},

	reset: function () {
		this.resetDeskMode();
		this.resetHeadTing();
	},

	resetHeadTing: function () {
		for (var i = 0; i < this.deskArray.length; i++) {
			if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
			this.deskArray[i].setHeadTingState(false);
		}
	},

	resetDeskMode: function () {
		this.seatHeads.forEach(function (seatHead) {
			var img = ccui.helper.seekWidgetByName(seatHead, "image_tip");
			img.setVisible(false);
		}.bind(this))

		this.panel_cover.setVisible(false);
		XYGLogic.table.isOffline = false;
		XYGLogic.table.offLineInfo = null;
		XYGLogic.table.playerQue = null;
		this.setTurnLightOff();
		this.stopClock();
	},

	//override
	setOption: function () { },
});