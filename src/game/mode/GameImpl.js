var GameImpl = cc.Class.extend({
	appId: 'com.qp.hall.*',

	ctor: function () {
		var chatCfg = null;
		Object.defineProperties(this, {
			"CHAT_USUALMSG": {
				get: function () {
					if (chatCfg) {
						chatCfg = this.getChatCfg();
					}
					return chatCfg;
				}
			},
		});
	},

	exit: function (reason, cb) {
		XYGLogic.release();
		if (XYGLogic.table.private) {
			this.net.leavePrivateTable(function (data) {
				hall.wxInvite = { inviteUid: 0, areaId: 0, tableId: 0, baseChip: 0, vip: 0, password: 0 };
				cb(data);
			});
		} else {
			this.net.exit(hall.user.uid, function (data) {
				hall.wxInvite = { inviteUid: 0, areaId: 0, tableId: 0, baseChip: 0, vip: 0, password: 0 };
				cb(data);
			});
		}
	},

	runGame: function (mLogic, mGameRoom) {
		//清理之前scene上的节点
		var curScene = cc.director.getRunningScene();
		if (curScene) curScene.removeAllChildren(true);

		MajhongInfo.GameMode = GameMode.PLAY;
		XYGLogic.initialize(mLogic);
		

		var newScene = new XYGameScene();

		if (cc.sys.isNative) {
			cc.director.replaceScene(newScene);
		} else {
			cc.director.runScene(newScene);
		}

		newScene.scheduleOnce(function () {
			var game = new (mGameRoom)();
			newScene.addChild(game);
		} , 0);

	},
	runReGame: function (mLogic , mReLogic , mGameRoom , data) {
		//清理之前scene上的节点
		var curScene = cc.director.getRunningScene();
		if (curScene) curScene.removeAllChildren(true);

		MajhongInfo.GameMode = GameMode.RECORD;
		XYGLogic.initialize(mLogic);
		XYGLogic._initialize(mReLogic);
		mReLogic.Instance.initSeatInfo(data);
		
		var newScene = new XYGameScene();

		if (cc.sys.isNative) {
			cc.director.replaceScene(newScene);
		} else {
			cc.director.runScene(newScene);
		}
		newScene.scheduleOnce(function () {
			var game = new (mGameRoom)();
			newScene.addChild(game);
		} , 0);
	},

	leavePrivateTable: function (status, cb) {
		qp.event.stop(qp, 'imPlayVoice');
		this.net.leavePrivateTable(status, function (data) {
			if (data["code"] == 200) { };
			cb(data)
		});
	},

	createPrivate: function (name, cb) {

		this.net.createPrivateTable(
			name,
			function (data) {
				if (data["code"] == 200) {

				}
				cb(data);
			}
		);
	},

	throw: function (data, cb) {
		this.net.throw(
			{
				"uid": data['uid']
				, type: data['type']
			},
			function (data) {
				cb();
			}
		);
	},

	joinPrivate: function (tableId, cb) {
		MajhongLoading.show('');
		qp.event.listen(qp, 'imPlayVoice', qp.onPlayVoice);
		var _cb = cb;
		var self = this;
		self.net.joinPrivateTable(
			tableId,
			function (data) {
				MajhongLoading.dismiss();
				JJLog.print(data);
				if (_cb) _cb(data);
			}
		);
	},

	/**
	 * 房间分享 调用
	 */
	wxShareURL: function () {
		var data = XYGLogic.table.Data;
		var desc = XYGLogic.table.getTableDes();
		hall.wxEnterRoom = data.tableId;
		hall.net.wxShareURL(this.GameValue + ',房号:' + data.tableId, desc, 0);
	},

	//override
	getChatCfg: function () {

	},
});