
MJChangChun.GameScene = function () {
	var _GameStatus = MJChangChunGameStatus;
	var _GameDesk = MJGameDesk;
	var _RecordControll = MJChangChun.RecordControll;
	var _DeskHead = DeskHead;

	var GameRoom = MJGameRoomBase.extend({
		setOption: function () {
			this.UIFile = MJBaseRes.Room;
			this.UIPlugIns = [
				{
					V2D: MJBaseResV2D.WGRoom,
					V3D: MJBaseResV3D.WGRoom,
				},
				{
					V2D: MJChangChun.RES.WGRoomBaoPai,
					V3D: MJChangChun.RES.WGRoomBaoPai3D,
				},
			];
		},
		ctor: function () {
			this._super();

			MJDaHuAni.register(MJChangChun.DahuAnim);
			MJGameDesk.registCfg(MJChangChun.DeskCfg);
			var root = this.mRoot;
			var _this = this;

			TableComponent.addComponent(root);
			XYGLogic.Instance.addSpriteFrames('res/Animation/shaizi.plist');

			this.mCurGameStatus = _GameStatus.SEATING;

			this.clockOptTime = Times.OPERATETIME;
			this.baoPaiKey = null;

			this.panel_baopai = ccui.helper.seekWidgetByName(root, "panel_baopai");


			this.panel_desk.removeAllChildren();
			var desk = _GameDesk.create();
			desk.setDelegate(this);
			this.mGameDesk = desk;
			this.panel_desk.addChild(desk);
		},

		onEnter: function () {
			this._super();
			MJSoundMgr.RegistMJAudioPath(MJChangChun.RESPath+"Resoures/audio/");
			if (MajhongInfo.GameMode == GameMode.RECORD) {
				var recordPanel = new _RecordControll();
				this.addChild(recordPanel);
				recordPanel.x = 0;
				recordPanel.y = 0;

				this.initRecordInfo();

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


		registerAllEvents: function () {
			qp.event.listen(this, 'mjBaoPai', this.onBaoPai);
			this._super();
		},

		removeAllEvents: function () {
			qp.event.stop(this, 'mjBaoPai');
			this._super();

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
			this.mGameDesk.update();
			this._super();
		},

		addSelfDesk: function () {
			var info = XYGLogic.table.selfSeatInfo();
			this.seat_self.setVisible(true);
			this.deskArray[info.position] = new _DeskHead(info, this);
            XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.selfSeatInfo().uid] = this.seat_self;
			this.seat_self.addChild(this.deskArray[info.position], -1, 1);

			this._super();
		},


		addRightDesk: function () {
			var info = XYGLogic.table.rightSeatInfo();
			if (info != null) {
				this.seat_right.setVisible(true);

				this.seat_right.removeChildByTag(1, true);
				this.deskArray[info.position] = new _DeskHead(info, this);
                XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.rightSeatInfo().uid] = this.seat_right;
				this.seat_right.addChild(this.deskArray[info.position], -1, 1);
			}
			this._super();
		},

		addUpDesk: function () {
			var info = XYGLogic.table.upSeatInfo();
			if (info != null) {
				this.seat_up.setVisible(true);

				this.upDesk = null;
				this.seat_up.removeChildByTag(1, true);

				this.deskArray[info.position] = new _DeskHead(info, this);
                XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.upSeatInfo().uid] = this.seat_up;
				this.seat_up.addChild(this.deskArray[info.position], -1, 1);
			}
			this._super();
		},

		addLeftDesk: function () {
			var info = XYGLogic.table.leftSeatInfo();
			if (info != null) {
				this.seat_left.setVisible(true);
				this.leftDesk = null;
				this.seat_left.removeChildByTag(1, true);
				this.deskArray[info.position] = new _DeskHead(info, this);
                XYGLogic.Instance.SeatPlayerInfo[XYGLogic.Instance.leftSeatInfo().uid] = this.seat_left;
				this.seat_left.addChild(this.deskArray[info.position], -1, 1);

			}
			this._super();
		},

		onGameStart: function (data) {
			if (XYGLogic.table) XYGLogic.table.status = _GameStatus.PLAYING;

			this._super(data);
		},

		addShowBaoPai: function (cardObj) {
			this.panel_baopai.removeAllChildren();
			if(cardObj){
				var card = MJCardTip.create3D(cardObj);
			}else{
				var card = MJCardTip.create3D();
				card.SetBack();
			}
			
			// card.setScale(0.78);
			this.panel_baopai.addChild(card);
			card.x = 0;
			card.y = 0;
			this.panel_baopai.parent.setVisible(true);
		},

		onBaoPai: function (data) {
			if (!!data.pai && data.pai != undefined) {
				if (!!data['pai']['type'] && data['pai']['type'] != undefined) {
					var key = data['pai']['type'] + data['pai']['value'];
					if (this.baoPaiKey == "nil") {
						this.baoPaiKey = key;
						this.addShowBaoPai(data['pai']);
					} else if (key != this.baoPaiKey) {
						var sp_ani1 = new cc.Sprite();
						sp_ani1.setScale(2);
						sp_ani1.setVisible(false);
						this.panel_effect_root.addChild(sp_ani1, 100);
						var size = this.panel_effect_root.getContentSize();
						sp_ani1.setPosition(size.width * 0.5, size.height * 0.5);
						var newanimFrames = [];
						for (var j = 1; j < 11; j++) {
							var str = "shaizi_anmi" + j + ".png";
							var frame = cc.spriteFrameCache.getSpriteFrame(str);
							newanimFrames.push(frame);
						}
						var anim = new cc.Animation(newanimFrames, 0.08);
						var animaArray = new Array();
						animaArray.push(cc.show());
						animaArray.push(cc.animate(anim));

						qp.event.send("appPauseAutoOutCard" , {});
						animaArray.push(cc.callFunc(function () {
							this.panel_baopai.removeAllChildren();
							this.baoPaiKey = key;
							this.addShowBaoPai(data['pai']);
							qp.event.send("appResumeAutoOutCard" , {});
						}.bind(this)));

						animaArray.push(cc.removeSelf());
						var seq = cc.sequence(animaArray);
						sp_ani1.runAction(seq);
					}
				}
				else if (this.baoPaiKey == null) {
					this.baoPaiKey = "nil";
					var sp_ani1 = new cc.Sprite();
					sp_ani1.setScale(2);
					sp_ani1.setVisible(false);
					this.panel_effect_root.addChild(sp_ani1, 100);
					var size = this.panel_effect_root.getContentSize();
					sp_ani1.setPosition(size.width * 0.5, size.height * 0.5);
					var newanimFrames = [];
					for (var j = 1; j < 11; j++) {
						var str = "shaizi_anmi" + j + ".png";
						var frame = cc.spriteFrameCache.getSpriteFrame(str);
						newanimFrames.push(frame);
					}
					var anim = new cc.Animation(newanimFrames, 0.08);
					var animaArray = new Array();
					animaArray.push(cc.show());
					animaArray.push(cc.animate(anim));

					qp.event.send("appPauseAutoOutCard" , {});
					animaArray.push(cc.callFunc(function () {
						this.addShowBaoPai();
						qp.event.send("appResumeAutoOutCard" , {});
					}.bind(this)));

					animaArray.push(cc.removeSelf());
					var seq = cc.sequence(animaArray);
					sp_ani1.runAction(seq);
				}
				else if (this.baoPaiKey == "nil" && !!data['rpBao'] && data['rpBao'] == 1) {
					var sp_ani1 = new cc.Sprite();
					sp_ani1.setScale(2);
					sp_ani1.setVisible(false);
					this.panel_effect_root.addChild(sp_ani1, 100);
					var size = this.panel_effect_root.getContentSize();
					sp_ani1.setPosition(size.width * 0.5, size.height * 0.5);
					var newanimFrames = [];
					for (var j = 1; j < 11; j++) {
						var str = "shaizi_anmi" + j + ".png";
						var frame = cc.spriteFrameCache.getSpriteFrame(str);
						newanimFrames.push(frame);
					}
					var anim = new cc.Animation(newanimFrames, 0.08);
					var animaArray = new Array();
					animaArray.push(cc.show());
					animaArray.push(cc.animate(anim));
					animaArray.push(cc.removeSelf());
					var seq = cc.sequence(animaArray);
					sp_ani1.runAction(seq);
				}
			}
		},
		checkGameStatus: function (data) {
			this._super(data);
			if (data['tableStatus']['isOffline'] == 1) {
				//桌子被初始化后才能做这些处理
				if(XYGLogic.table.status >= _GameStatus.INITTABLE){
					this.reBuildBaoPai(data);
				}	
			}
		},

		reBuildBaoPai: function (data) {
			if (!!data['tableStatus']['bao'] && data['tableStatus']['bao'] != undefined) {
				if (data['tableStatus']['bao']['type']) {
					this.baoPaiKey = data['tableStatus']['bao']['type'] + data['tableStatus']['bao']['value'];
					this.addShowBaoPai(data['tableStatus']['bao']);
				} else {
					this.addShowBaoPai();
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

		reset: function () {
			this._super();
			this.baoPaiKey = null;
			this.panel_baopai.parent.setVisible(false);
			this.panel_baopai.removeAllChildren();
			XYGLogic.Instance.Data.bao = null;
		},
	});

	return GameRoom;
}()

