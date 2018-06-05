var SpeakCtrl = cc.Node.extend({
    autoSendRecord: false,
	intervalTouchSpeak: 0,
	beginSpeak: false,
    talkRecordTime: 0,
    
    ctor: function (ctrlRoot) {
        this._super();
        this.mCtrlRoot = ctrlRoot;
        ctrlRoot.addTouchEventListener(this.touchEvent, this);
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
                    hall.net.talk();
                    
                }
                break;
            case ccui.Widget.TOUCH_MOVED:
                {
                    //JJLog.print('SPAEKER TOUCH_MOVED ======');
                    var curPos = sender.getTouchMovePosition();
                    if(this.speakTip){
                        var flag = cc.rectContainsPoint( this.mCtrlRoot.getBoundingBox() , curPos);
                        this.speakTip.OptCancelTip( !flag );
                    }

                }
                break;

            case ccui.Widget.TOUCH_ENDED:
                {
                    JJLog.print('SPEAKER TOUCH_ENDED   1=========' + this.talkRecordTime);
                    if (!this.autoSendRecord) {
                        this.autoSendRecord = false;
                        JJLog.print('SPEAKER TOUCH_ENDED   2=========' + this.talkRecordTime);
                        hall.net.send();
                        this.resetRecordTime();
                    }
                }
                break;

            case ccui.Widget.TOUCH_CANCELED:
                {
                    JJLog.print('SPAEKER TOUCH_CANCELED   1=========' + this.talkRecordTime);
                    if (!this.autoSendRecord) {
                        JJLog.print('SPAEKER TOUCH_CANCELED   2=========' + this.talkRecordTime);
                        hall.net.send(true);
                        this.resetRecordTime();
                    }
                }
                break;

            default:
                break;
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
            hall.net.send();
        }
    },

});

SpeakCtrl.Ctrl = function (root) {
    var _ctrl = new SpeakCtrl(root);
    root.addChild(_ctrl);
    return _ctrl;
};

var SpeakTip = cc.Layer.extend({
    panel_root: null,
    sprite_op: null,
    action: null,
    root: null,
    ctor: function () {
        this._super();
        var json = util.LoadUI(GameRes.Speak);
        this.root = json.node;
        this.action = json.action;
        this.mSpeakShowPanel = ccui.helper.seekWidgetByName(this.root, "panel");
        this.mSpeakCancelPanel = ccui.helper.seekWidgetByName(this.root, "panel_cancel");
        this.mSpeakCancelPanel.setVisible(false);
        this.addChild(this.root);
    },

    onEnter: function () {
        this._super();
        this.root.runAction(this.action);
        this.action.play('speak', true);
    },

    showTip: function () {
        if (cc.director.getRunningScene().getChildByTag(GameTag.TAG_SPEAKER)) {
            cc.director.getRunningScene().removeChildByTag(GameTag.TAG_SPEAKER);
        }
        cc.director.getRunningScene().addChild(this, GameTag.TAG_SPEAKER, GameTag.TAG_SPEAKER);
    },

    OptCancelTip: function (isShow) {
        this.mSpeakCancelPanel.setVisible(isShow);
        this.mSpeakShowPanel.setVisible(!isShow);
    },

    dismiss: function () {
        this.removeFromParent(true);
    },
});