/**
 * Created by atom on 2016/11/5.
 */
var XueZhanRecordControll = cc.Layer.extend({
	panel_control: null,
	btn_play: null,
	btn_pause: null,
	btn_backward: null,
	btn_forward: null,
	btn_exit: null,
	text_process: null,
	btn_share: null,
	ctor: function () {
		this._super();
		var root = util.LoadUI(XueZhanMajhongJson.RecordControll).node;
		this.addChild(root);
		this.panel_control = ccui.helper.seekWidgetByName(root, "panel_control");
		this.btn_play = ccui.helper.seekWidgetByName(root, "btn_play");
		this.btn_play.setVisible(false);
		this.btn_play.addClickEventListener(this.onPlay.bind(this));

		this.btn_pause = ccui.helper.seekWidgetByName(root, "btn_pause");
		this.btn_pause.addClickEventListener(this.onPause.bind(this));
		this.btn_backward = ccui.helper.seekWidgetByName(root, "btn_backward");
		this.btn_forward = ccui.helper.seekWidgetByName(root, "btn_forward");
		this.btn_exit = ccui.helper.seekWidgetByName(root, "btn_exit");
		this.btn_exit.addClickEventListener(function () {
			var hall2 = new MajhongHall();
			hall2.showHall();
		});

		this.btn_share = ccui.helper.seekWidgetByName(root, "btn_share");
		if(hall.songshen == 1){
			util.ForeverVisibleNode(this.btn_share , false);
		}
		this.btn_share.addClickEventListener(function () {
			var recordId = hall.getPlayingGame().record.recordId;
			JJLog.print("分享=" + recordId + "wanjian=" + base64.decode(hall.user.nickName));
			hall.net.wxShareURL("血战麻将回放码" + "\n[" + recordId + "]", '玩家[' + base64.decode(hall.user.nickName) + ']分享了一个回放码:' + recordId + '在大厅点击进入录像页面然后点击查看他人回放输入回放码.', 0);
		});

		this.text_process = ccui.helper.seekWidgetByName(root, "text_process");
		this.updateProcess();
	},

	updateProcess: function () {
		this.text_process.setString('进度:' + hall.getPlayingGame().record.stepNow + '/' + hall.getPlayingGame().record.stepAll);
	},

	onPlay: function () {
		this.btn_play.setVisible(false);
		this.btn_pause.setVisible(true);
		hall.getPlayingGame().record.setPlayStatus(RecordStatus.PLAY);
	},

	onPause: function () {
		this.btn_play.setVisible(true);
		this.btn_pause.setVisible(false);
		hall.getPlayingGame().record.setPlayStatus(RecordStatus.PAUSE);
	},

	registerRecordEvent: function () {
		var _this = this;
		var ls = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: CommonEvent.EVT_RECORD_NEXT_STEP,
			callback: function (event) {
				var step = event.getUserData();
				JJLog.print('call record event');
				_this.playNextStep();
				_this.updateProcess();
			}
		});
		_this._Listener = cc.eventManager.addListener(ls, this);
	},

	removeRecordEvent: function () {
		cc.eventManager.removeListener(this._Listener);
	},

	onEnter: function () {
		this._super();
		this.registerRecordEvent();
		this.playNextStep();

		MajhongLoading.dismiss();
	},

	onExit: function () {
		this._super();
		this.panel_control = null;
		this.btn_backward = null;
		this.btn_exit = null;
		this.btn_forward = null;
		this.btn_pause = null;
		this.btn_play = null;

		this.removeRecordEvent();

		hall.getPlayingGame().record = null;


	},

	playNextStep: function () {
		JJLog.print('recordcontroll playnextstep');
		this.schedule(this.playStep, 0.5);
	},

	playStep: function (dt) {
		this.unschedule(this.playStep);
		hall.getPlayingGame().record.postStep();
	},
});