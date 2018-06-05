var DDZWG_speak = cc.Node.extend({

	autoSendRecord: false,
	intervalTouchSpeak: 0,
	beginSpeak: false,
	talkRecordTime: 0,

	ctor: function () {
		this._super();
		var root = util.LoadUI(DDZPokerJson.WG_Speak).node;
		this.addChild(root);

		this.btn_speak = ccui.helper.seekWidgetByName(root, "btn_speak");
		this.btn_speak.addTouchEventListener(this.touchEvent, this);
	},

	startRecordSpeaker: function () {
		this.schedule(this.recordTime, 1);
	},
	
	touchEvent: function (sender, type) {
		switch (type) {
			case ccui.Widget.TOUCH_BEGAN:
				{
					JJLog.print('SPEAKER TOUCH_BEGAN 1======' + this.talkRecordTime);
					//          this.intervalTouchSpeak = curTime;
					this.autoSendRecord = false;
					this.beginSpeak = true;
					JJLog.print('SPEAKER TOUCH_BEGAN 2======' + this.talkRecordTime);
					this.startRecordSpeaker();
					this.speakTip = new SpeakTip();
					this.speakTip.showTip();
					DDZPoker.net.talk("", "", "");
					break;
				}
			case ccui.Widget.TOUCH_MOVED:
				{
					//JJLog.print('SPAEKER TOUCH_MOVED ======');
				}
				break;

			case ccui.Widget.TOUCH_ENDED:
				{
					JJLog.print('SPEAKER TOUCH_ENDED   1=========' + this.talkRecordTime);
					if (!this.autoSendRecord) {
						this.autoSendRecord = false;
						JJLog.print('SPEAKER TOUCH_ENDED   2=========' + this.talkRecordTime);
						DDZPoker.net.send();
						this.resetRecordTime();
					}
				}
				break;

			case ccui.Widget.TOUCH_CANCELED:
				{
					JJLog.print('SPAEKER TOUCH_CANCELED   1=========' + this.talkRecordTime);
					if (!this.autoSendRecord) {
						// JJLog.print('SPAEKER TOUCH_CANCELED   2=========' + this.talkRecordTime);
						DDZPoker.net.send();
						this.resetRecordTime();
					}
				}
				break;

			default:
				break;
		}
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
			DDZPoker.net.send();
		}
	},

});