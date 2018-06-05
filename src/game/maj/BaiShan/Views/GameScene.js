
var BaiShanGameScene = function () {
	var _GameStatus = MJBaiShanGameStatus;
	var _GameDesk = MJGameDesk;
	var _EndResult = MJBaiShan.EndResult;
	var _RoundResult = MJBaiShan.RoundResult;
	var _RecordControll = BaiShanRecordControll;
	var _DeskHead = DeskHead;

	var GameRoom = MJGameRoomBase.extend({

		imgDingqueArray: [],
		setOption: function () {
			this.UIFile = MJBaseRes.Room;
			this.UIPlugIns = [
				{
					V2D: MJBaseResV2D.WGRoom,
					V3D: MJBaseResV3D.WGRoom,
				},
			];
		},
		ctor: function () {
			this._super();

			MJDaHuAni.register(MJBaiShan.DahuAnim);
			MJGameDesk.registCfg(MJBaiShan.DeskCfg);
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

		
		resetImageReady: function () {
			
			for (var i = 0; i < this.imgDingqueArray.length; i++) {
				if (cc.sys.isObjectValid(this.imgDingqueArray[i])) {
					this.imgDingqueArray[i].setVisible(false);
				}
			}
			this._super();
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
                            XYGLogic.record.postNextStep();
						}
					}
				});
				var listener = cc.eventManager.addListener(ls4, this);
				this._Listeners.push(listener);

				var bankerId = XYGLogic.record.banker;
				for (var i = 0; i < this.deskArray.length; i++) {
					if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
					this.deskArray[i].setBanker(this.deskArray[i].uid == bankerId);
				}
			}
		},

		onExit: function () {
            XYGLogic.record = null;
			this._super();

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
				case MJBaiShanGameStatus.HUANSAN:
				case MJBaiShanGameStatus.DINGQUE:
				case _GameStatus.PLAYING:
					{
						this.panel_status.setVisible(true);
						this.text_clock.setString('20');
						if (data['havePai'] != undefined) {
							this.text_count.setString('' + data['havePai']);
						}
						var text_round_tit = ccui.helper.seekWidgetByName(this.text_round.parent, "text_round_tit");
						if(XYGLogic.Instance.getTablePerson() == 2){
							text_round_tit.string = "第     局";
						}else{
							text_round_tit.string = "第     圈";
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
			this.seat_self.addChild(this.deskArray[info.position], -1, 1);
            XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.selfSeatInfo().uid] = this.seat_self;
			this.imgDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_self");
			this._super();
		},

		addRightDesk: function () {
			var info = XYGLogic.table.rightSeatInfo();
			if (info != null) {
				this.seat_right.setVisible(true);

				this.seat_right.removeChildByTag(1, true);
				this.deskArray[info.position] = new DeskHead(info, this);
				this.seat_right.addChild(this.deskArray[info.position], -1, 1);
                XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.rightSeatInfo().uid] = this.seat_right;
				this.imgDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_right");
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
				this.seat_up.addChild(this.deskArray[info.position], -1, 1);
                XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.upSeatInfo().uid] = this.seat_up;
				this.imgDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_up");
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
				this.seat_left.addChild(this.deskArray[info.position], -1, 1);
                XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.leftSeatInfo().uid] = this.seat_left;
				this.imgDingqueArray[info.position] = ccui.helper.seekWidgetByName(this.panel_dingque, "img_dingque_left");
			}
			this._super();
		},

		checkGameStatus: function (data) {
			if (data['tableStatus']['isOffline'] == 1) {
				var players = data["tableStatus"]['players'];
				if (data['tableStatus']['tableStatus'] >= MJBaiShanGameStatus.HUANSAN) {
					if (data['tableStatus']['tableStatus'] == MJBaiShanGameStatus.DINGQUE) {
						this.onDingQueStart();
					}
					for (var j = 0; j < this.deskArray.length; j++) {
						for (var i = 0; i < players.length; i++) {
							var player = players[i];
							if (player.uid == this.deskArray[j].uid) {
								var huType = player['huType'];
								var huapais = player['huaPai'];

								if (data['tableStatus']['tableStatus'] == MJBaiShanGameStatus.PLAYING) {
									if (player.uid == hall.user.uid)
										XYGLogic.table.playerQue = player["dingQue"];
									var img = ccui.helper.seekWidgetByName(this.seatHeads[player.position], "image_que");
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
			for (var i = 0; i < XYGLogic.record.playerInfoArr.length; i++) {
				var data = XYGLogic.record.playerInfoArr[i];
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

            }


			var desc = XYGLogic.record.getTableDes();
			this.text_msg.setString(desc);
			this.text_msg.setVisible(true);

			this.showBuhuaPanel();
			this._super();
		},

		showRoundResult: function () {
			var result = new _RoundResult(XYGLogic.Instance.result, this);
			result.showResult();
		},

		showEndResult: function () {
			var endReport = new _EndResult();
			endReport.showGameResult();
		},
	});
	return GameRoom;
}()