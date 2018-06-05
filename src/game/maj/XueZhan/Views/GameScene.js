
var XueZhanGameScene = function () {
	var _GameStatus = XueZhanGameStatus;
	var _GameDesk = MJGameDesk;
	var _RecordControll = XueZhanRecordControll;
	var _DeskHead = DeskHead;

	var GameRoom = MJGameRoomBase.extend({

		imgDingqueArray: [],
		headDingqueArray: [],
		setOption: function () {
			this.UIFile = MJBaseRes.Room;
			this.UIPlugIns = [
				{
					V2D: MJBaseResV2D.WGRoom,
					V3D: MJBaseResV3D.WGRoom,
				},
				{
					V2D: XueZhanMajhongJson.WGRoomDingQue,
					V3D: XueZhanMajhongJson.WGRoomDingQue,
				},
			];
		},
		ctor: function () {
			this._super();

			MJDaHuAni.register(XueZhanDahuAnim);
			MJGameDesk.registCfg(XueZhanDeskCfg);
			var root = this.mRoot;
			var _this = this;

			TableComponent.addComponent(root);


			this.panel_dingque = ccui.helper.seekWidgetByName(root, "panel_dingque");

			this.mCurGameStatus = _GameStatus.SEATING;

			this.clockOptTime = Times.OPERATETIME;


			this.panel_desk.removeAllChildren();
			var desk = _GameDesk.create();
			desk.setDelegate(this);
			this.mGameDesk = desk;
			this.panel_desk.addChild(desk);
		},

		baseReadyInfo: function (data) {
			if (!cc.sys.isObjectValid(this)) {
				return;
			}
			this._super(data);

			var selfInfo = XYGLogic.table.getCardByPlayer(hall.user.uid)

			if (XYGLogic.table.status == XueZhanGameStatus.HUANSAN && selfInfo["huan3Pai"].length == 0) {
				qp.event.send('mjHuan3Start', {});
			}
			if (XYGLogic.table.status == XueZhanGameStatus.DINGQUE && selfInfo['dingQue'] == "") {
				qp.event.send('mjDingQueStart', {});
			}
		},

		resetImageReady: function () {

			for (var i = 0; i < this.imgDingqueArray.length; i++) {
				if (cc.sys.isObjectValid(this.imgDingqueArray[i])) {
					this.imgDingqueArray[i].setVisible(false);
				}
			}
			this._super();
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
			} else if (opType == OPERATIONNAME.BUZHANG) {
				if (msg["origin"] == OPER_GANG_TYPE.GANG_AN) {
					XYGLogic.Instance.addSpriteFrames(XueZhanMajhongJson.RainPlist);
					var img = new cc.Sprite('#' + 'xzrain_0.png');
					img.setScale(2);
					var animFrames = [];
					for (var i = 0; i < 58; i++) {
						var str = "xzrain_" + i + ".png";
						var frame = cc.spriteFrameCache.getSpriteFrame(str);
						animFrames.push(frame);
					}
					var anim = new cc.Animation(animFrames, 0.05);
					img.runAction(cc.sequence(cc.animate(anim), cc.removeSelf()));
					this.panel_desk.addChild(img, 1000, 1234);
					img.setPosition(cc.p(640, 360));
				} else {
					XYGLogic.Instance.addSpriteFrames(XueZhanMajhongJson.WindPlist);
					var img = new cc.Sprite('#' + 'xzwind_0.png');
					img.setScale(2);
					var animFrames = [];
					for (var i = 0; i < 59; i++) {
						var str = "xzwind_" + i + ".png";
						var frame = cc.spriteFrameCache.getSpriteFrame(str);
						animFrames.push(frame);
					}
					var anim = new cc.Animation(animFrames, 0.05);
					img.runAction(cc.sequence(cc.animate(anim), cc.removeSelf()));
					this.panel_desk.addChild(img, 1000, 1234);
					img.setPosition(cc.p(640, 360));
				}
			}

			if (this.turnUid == -1 || this.turnUid == uid || opType == OPERATIONNAME.HU) return;
			this.optTurnLightByUID(uid);
		},


		onEnter: function () {
			this._super();

			if (MajhongInfo.GameMode == GameMode.RECORD) {

				var recordPanel = new _RecordControll();
				this.addChild(recordPanel);
				recordPanel.x = 0;
				recordPanel.y = 0;

				this.initRecordInfo();


				var _this = this;
				var ls4 = cc.EventListener.create({
					event: cc.EventListener.CUSTOM,
					eventName: CommonEvent.EVT_RECORD,
					callback: function (event) {
						var userData = event.getUserData();
						if (userData == null) return;
						var evtId = userData['type'];
						if (evtId == RecordType.Zhen7Jia8) {
							var que = userData['que'];
							_this.onDingQueEnd(que);
							XueZhanMajhong.record.postNextStep();
						}
					}
				});
				var listener = cc.eventManager.addListener(ls4, this);
				this._Listeners.push(listener);

				var bankerId = XueZhanMajhong.record.banker;
				for (var i = 0; i < this.deskArray.length; i++) {
					if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
					this.deskArray[i].setBanker(this.deskArray[i].uid == bankerId);
				}
			}


		},

		onExit: function () {
			XueZhanMajhong.record = null;
			this._super();

		},

		registerAllEvents: function () {

			qp.event.listen(this, 'mjHuan3Start', this.onHuan3Start.bind(this));
			qp.event.listen(this, 'mjHuan3Status', this.onHuan3Status.bind(this));
			qp.event.listen(this, 'mjHuan3End', this.onHuan3End.bind(this));
			qp.event.listen(this, 'mjDingQueStart', this.onDingQueStart.bind(this));
			qp.event.listen(this, 'mjDingQueEnd', this.onDingQueEnd.bind(this));

			this._super()
		},

		removeAllEvents: function () {

			qp.event.stop(this, 'mjHuan3Start');
			qp.event.stop(this, 'mjHuan3Status');
			qp.event.stop(this, 'mjHuan3End');
			qp.event.stop(this, 'mjDingQueStart');
			qp.event.stop(this, 'mjDingQueEnd');
			this._super()
		},

		onGameStart: function (data) {
			if (XYGLogic.table) XYGLogic.table.status = _GameStatus.PLAYING;

			this._super(data);
		},

		onGameOver: function (data) {
			this.removeAllEvents();
			XYGLogic.table.status = _GameStatus.GAMERESULT;
			this._super(data);
		},
		onHuan3Start: function (data) {

			if (XYGLogic.table) XYGLogic.table.status = _GameStatus.HUANSAN;
			this.optTurnLightByUID(hall.user.uid);
			JJLog.print("[GameScene] onHuan3Start");

		},
		onHuan3Status: function (data) {
			JJLog.print("[GameScene] onHuan3Status");
		},
		onHuan3End: function (data) {
			if (data.uid !== hall.user.uid + "") {
				return;
			}

			var node = new cc.Node();
			node.setPosition(cc.p(640, 376));
			this.panel_desk.addChild(node, 100);

			if (data.dir == 3) { //上下替换
				//箭头
				var dir = { 1: "xuanzhuan", 2: "xuanzhuan", 3: "shangxia" };
				var jianTou = new sp.SkeletonAnimation(MJBaseRes.Huan3Json, MJBaseRes.Huan3Atlas);
				jianTou.setAnimation(0, dir[data.dir], true);
				node.addChild(jianTou);
			} else {
				var imgJTDT = new cc.Sprite(MJBaseRes.P_Room_H3_JT);
				if (data.dir == 2) imgJTDT.setScaleX(-1);
				node.addChild(imgJTDT);

				//牌旋转
				var cardXuanzhuan = new sp.SkeletonAnimation(MJBaseRes.Huan3PxzJson, MJBaseRes.Huan3PxzAtlas);
				cardXuanzhuan.setAnimation(0, "animation", false);
				cardXuanzhuan.y = -40;
				if (data.dir == 2) cardXuanzhuan.setScaleX(-1);
				node.addChild(cardXuanzhuan);
			}

			if (this.__RM_H3_JT_CMD__) {
				this.__RM_H3_JT_CMD__();
			}

			this.__RM_H3_JT_CMD__ = function (node) {
				if (node) node.removeFromParent();
				this.__RM_H3_JT_CMD__ = null;
			}.bind(this, node);

			cc.setTimeout(function () {
				if (this.__RM_H3_JT_CMD__) this.__RM_H3_JT_CMD__();
			}.bind(this), 2000);

		},
		onDingQueStart: function (data) {
			if (XYGLogic.table) XYGLogic.table.status = _GameStatus.DINGQUE;

			this.optTurnLightByUID(hall.user.uid);

			this.panel_dingque.setVisible(true);
			XYGLogic.Instance.addSpriteFrames(XueZhanMajhongJson.PointPlist);
			this.imgDingqueArray.forEach(function (node) {
				var point = new cc.Sprite('#' + 'xuezhan_point0.png');
				point.setAnchorPoint(cc.p(0, 0.5));
				var newanimFrames = [];
				for (var j = 0; j < 3; j++) {
					var str = "xuezhan_point" + j + ".png";
					var frame = cc.spriteFrameCache.getSpriteFrame(str);
					newanimFrames.push(frame);
				}
				var fenghuang = new cc.Animation(newanimFrames, 0.5);
				point.runAction(cc.animate(fenghuang).repeatForever());
				node.addChild(point);
				point.setPosition(node.getContentSize().width, node.getContentSize().height * 0.5);
				node.setVisible(true);

			}, this);
		},
		onDingQueEnd: function (data) {
			this.imgDingqueArray.forEach(function (node) {
				node.setVisible(false);
				node.removeAllChildren();
			}, this);
			this.panel_dingque.setVisible(false);

			for (var i = 0; i < data.length; i++) {
				var uid = data[i].uid;
				var que = data[i].que;
				if (uid == hall.user.uid && MajhongInfo.GameMode == GameMode.PLAY)
					XYGLogic.table.playerQue = que;
				this.showQueByUID(uid, que);
			}
		},

		showQueByUID: function (uid, que) {
			if (!uid || !que || que.length == 0) return;
			for (var j = 0; j < this.deskArray.length; j++) {

				if (this.deskArray[j] == undefined || this.deskArray[j] == null) continue;

				if (uid == this.deskArray[j].uid) {
					var position = this.deskArray[j].playerData.position;
					var img = this.headDingqueArray[position]
					img.loadTexture(this.getQueSmallByPQ(que), ccui.Widget.LOCAL_TEXTURE);
					img.setVisible(true);
					img.setLocalZOrder(2550);
					break;
				}
			}
		},
		showPanelStatus: function (data) {
			switch (XYGLogic.table.status) {
				case _GameStatus.SEATING:
					{
						this.panel_option_waiting.setVisible(true);
						this.panel_status.setVisible(false);

						this.panel_ready.setVisible(true);
						this.btn_ready.setVisible(false);
						this.resetImageReady();
					}
					break;
				case _GameStatus.WATING:
					{
						this.panel_option_waiting.setVisible(false);
						if (XYGLogic.table.currentRound == 1) {
							this.panel_option_waiting.setVisible(true);
						}
						this.panel_status.setVisible(false);

						this.panel_ready.setVisible(true);
						this.btn_ready.setVisible(false);
						this.resetImageReady();
					}
					break;
				case XueZhanGameStatus.HUANSAN:
				case XueZhanGameStatus.DINGQUE:
				case _GameStatus.PLAYING:
					{
						this.panel_status.setVisible(true);
						this.text_clock.setString('20');
						if (data['havePai'] != undefined) {
							this.text_count.setString('' + data['havePai']);
						}

						if (data['isOffline'] == 1) {
							this.text_round.setString(data['currRounds'] + '/' + data['roundsTotal']);
						} else {
							this.text_round.setString(data['currRounds'] + '/' + this.totalRound);
						}

						this.panel_option_waiting.setVisible(false);

						this.panel_ready.setVisible(false);
						this.btn_ready.setVisible(true);
						this.resetImageReady();
						this.showBuhuaPanel();
					}
					break;
			}
			this._super(data);
		},

		addSelfDesk: function () {
			var info = XYGLogic.table.selfSeatInfo();
			this.seat_self.setVisible(true);
			this.deskArray[info.position] = new DeskHead(info, this);
            XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.selfSeatInfo().uid] = this.seat_self;
			this.seat_self.addChild(this.deskArray[info.position], -1, 1);

			this.imgDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_self");
			this.headDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_self");
			this._super();
		},

		addRightDesk: function () {
			var info = XYGLogic.table.rightSeatInfo();
			if (info != null) {
				this.seat_right.setVisible(true);

				this.seat_right.removeChildByTag(1, true);
				this.deskArray[info.position] = new DeskHead(info, this);
                XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.rightSeatInfo().uid] = this.seat_right;
				this.seat_right.addChild(this.deskArray[info.position], -1, 1);

				this.imgDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_right");
				this.headDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_right");
			}
			this._super();
		},

		addUpDesk: function () {
			var info = XYGLogic.table.upSeatInfo();
			if (info != null) {
				this.seat_up.setVisible(true);

				this.upDesk = null;
				this.seat_up.removeChildByTag(1, true);

				this.deskArray[info.position] = new DeskHead(info, this);
                XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.upSeatInfo().uid] = this.seat_up;
				this.seat_up.addChild(this.deskArray[info.position], -1, 1);

				this.imgDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_up");
				this.headDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_up");
			}
			this._super();
		},

		addLeftDesk: function () {
			var info = XYGLogic.table.leftSeatInfo();
			if (info != null) {
				this.seat_left.setVisible(true);

				this.leftDesk = null;
				this.seat_left.removeChildByTag(1, true);
				this.deskArray[info.position] = new DeskHead(info, this);
                XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.leftSeatInfo().uid] = this.seat_left;
				this.seat_left.addChild(this.deskArray[info.position], -1, 1);

				this.imgDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_left");
				this.headDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_left");
			}
			this._super();
		},

		checkGameStatus: function (data) {
			if (data['tableStatus']['isOffline'] == 1) {
				var players = data["tableStatus"]['players'];
				if (data['tableStatus']['tableStatus'] >= XueZhanGameStatus.HUANSAN) {
					if (data['tableStatus']['tableStatus'] == XueZhanGameStatus.DINGQUE) {
						this.onDingQueStart();
					}
					for (var j = 0; j < this.deskArray.length; j++) {
						for (var i = 0; i < players.length; i++) {
							var player = players[i];
							if (player.uid == this.deskArray[j].uid) {
								var huType = player['huType'];
								var huapais = player['huaPai'];

								if (data['tableStatus']['tableStatus'] == XueZhanGameStatus.PLAYING) {
									if (player.uid == hall.user.uid)
										XYGLogic.table.playerQue = player["dingQue"];
									var img = this.headDingqueArray[player.position];
									img.loadTexture(this.getQueSmallByPQ(player["dingQue"]), ccui.Widget.LOCAL_TEXTURE);
									img.setVisible(true);
								}
								break
							}
						}
					}
				}
			}
			this._super(data);
		},

		//============================ record history function ===============================================================
		initRecordInfo: function () {
			this.initRecordHead();
			this.initRecordDesk();
		},

		initRecordHead: function () {
			for (var i = 0; i < XueZhanMajhong.record.playerInfoArr.length; i++) {
				var data = XueZhanMajhong.record.playerInfoArr[i];
				if (data != undefined && data != null) {
					this.deskArray[i] = new DeskHead(data, this);
					this.seatHeads[i].addChild(this.deskArray[i], 1, 1);
				}
			}
		},

		initRecordDesk: function () {
            if (XYGLogic.record.person == 2) {
                this.listviewHuapaiArray[0] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_self");
                this.listviewHuapaiArray[1] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_up");
                this.listviewHuapaiArray[3] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_right");
                this.listviewHuapaiArray[4] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_left");
                this.listviewHuapaiArray[3].setVisible(false);
                this.listviewHuapaiArray[4].setVisible(false);

                this.imgHuaPaiArray[0] = ccui.helper.seekWidgetByName(this.mRoot, "img_buhua_self");
				this.imgHuaPaiArray[1] = ccui.helper.seekWidgetByName(this.mRoot, "img_buhua_up");
				

				this.imgDingqueArray[0] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_self");
				this.headDingqueArray[0] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_self");

				this.imgDingqueArray[1] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_up");
				this.headDingqueArray[1] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_up");

            }
            else if (XYGLogic.record.person == 3){
                this.listviewHuapaiArray[0] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_self");
                this.listviewHuapaiArray[1] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_right");
                this.listviewHuapaiArray[2] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_left");
                this.listviewHuapaiArray[3] = ccui.helper.seekWidgetByName(this.mRoot, "listview_huapai_up");
                this.listviewHuapaiArray[3].setVisible(false);

                this.imgHuaPaiArray[0] = ccui.helper.seekWidgetByName(this.mRoot, "img_buhua_self");
                this.imgHuaPaiArray[1] = ccui.helper.seekWidgetByName(this.mRoot, "img_buhua_right");
				this.imgHuaPaiArray[2] = ccui.helper.seekWidgetByName(this.mRoot, "img_buhua_left");
				

				this.imgDingqueArray[0] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_self");
				this.headDingqueArray[0] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_self");

				this.imgDingqueArray[1] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_right");
				this.headDingqueArray[1] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_right");

				this.imgDingqueArray[2] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_left");
				this.headDingqueArray[2] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_left");

            }else{
				this.imgDingqueArray[0] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_self");
				this.headDingqueArray[0] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_self");

				this.imgDingqueArray[1] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_right");
				this.headDingqueArray[1] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_right");

				this.imgDingqueArray[2] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_up");
				this.headDingqueArray[2] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_up");

				this.imgDingqueArray[3] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_left");
				this.headDingqueArray[3] = ccui.helper.seekWidgetByName(this.panel_dingque, "image_que_left");
			}
			var desc = XueZhanMajhong.record.getTableDes();
			this.text_msg.setString(desc);
			this.text_msg.setVisible(true);

			this.showBuhuaPanel();
			this.mGameDesk.update();
			this._super();
		},

		reset: function () {
			this._super();
			for (var i = 0; i < this.headDingqueArray.length; i++) {
				var img_que = this.headDingqueArray[i];
				img_que.setVisible(false);
			}
		},
	});
	return GameRoom;
}()