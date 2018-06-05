var MJDahuAniBase = cc.Layer.extend({
	sprite_hu_word: null,
	panel_root: null,
	huType: 1,
	delayTime: 0,
	showTime: 0.5,
	userSex: 2,
	ziMo: false,
	ctor: function (huData , _DaHuResCfg) {
		this._super();
		
		XYGLogic.Instance.addSpriteFrames('res/Animation/xiaohutexiao.plist');
		_DaHuResCfg = _DaHuResCfg || XYGLogic.Instance.getMJCommon("HuRes");

		this.huType = huData['huType'];
		this.userSex = huData['userSex'];
		if (this.userSex != 2) {
			this.userSex = 1;
		}
		this.ziMo = huData['ziMo'];
        if(this.ziMo == 1)
        {
            this.sprite_hu_word = new ccui.ImageView('dahu_zimo.png', ccui.Widget.PLIST_TEXTURE);
        }
        else
		{
            if (_DaHuResCfg && typeof(_DaHuResCfg) == "object") {
                var huResPath = _DaHuResCfg[this.huType] || _DaHuResCfg[0];
                this.sprite_hu_word = new cc.Sprite('#' + huResPath);
            }
		}
		if(this.sprite_hu_word)
		{
            var size = this.sprite_hu_word.getContentSize();
            this.setContentSize(size);
            this.sprite_hu_word.setPosition(size.width * 0.5, size.height * 0.5);
            this.addChild(this.sprite_hu_word);
            this.setVisible(false);
		}
	},

	initUI: function () {
		var dt = 0.1;
		var size = cc.size(0,0);
		if(this.sprite_hu_word){
			size = this.sprite_hu_word.getContentSize();
		
			this.sprite_hu_word.setOpacity(20);
			this.sprite_hu_word.setScale(2.8);
			this.sprite_hu_word.runAction(cc.sequence(
				cc.spawn(cc.scaleTo(dt, 1.2), cc.fadeIn(0.1)),
				cc.moveBy(0.05, 3, 3),
				cc.moveBy(0.05, 3, -3),
				cc.moveBy(0.05, -3, 3),
				cc.moveBy(0.05, 3, -3)
			));
		}
		

		dt += 0.4;
		var sp_ani1 = new cc.Sprite('#' + 'cuan01.png');
		var size1 = sp_ani1.getContentSize();
		this.addChild(sp_ani1, 1);
		sp_ani1.setPosition(size.width - size1.width * 0.5, size.height * 0.5);

		var animFrames = [];
		var str = "";
		var frame;
		for (var i = 1; i < 18; i++) {
			str = "cuan" + (i < 10 ? ("0" + i) : i) + ".png";
			frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}
		var anim = new cc.Animation(animFrames, 0.05);
		sp_ani1.setScale(1.5);
		sp_ani1.runAction(cc.sequence(cc.delayTime(0.2), cc.animate(anim), cc.removeSelf()));

		var sp_ani2 = new cc.Sprite('#' + 'quan01.png');
		var size2 = sp_ani2.getContentSize();
		this.addChild(sp_ani2, 2);
		sp_ani2.setVisible(false);
		sp_ani2.setPosition(size.width - size2.width * 0.25, size.height * 0.5);

		var animFrames2 = [];
		for (i = 1; i < 13; i++) {
			str = "quan" + (i < 10 ? ("0" + i) : i) + ".png";
			frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames2.push(frame);
		}
		var anim2 = new cc.Animation(animFrames2, 0.05);
		sp_ani2.setScale(2.0);
		sp_ani2.runAction(cc.sequence(cc.delayTime(0.6), cc.show(), cc.animate(anim2), cc.removeSelf()));
		dt += 0.5;
		var num = Math.ceil(size.width / 80);
		for (var i = 0; i < num; i++) {
			var emitter = new cc.ParticleSystem("res/Animation/shanxing.plist");
			this.addChild(emitter);
			emitter.setPosition(40 + 80 * i, 0);
			emitter.setVisible(false);
			emitter.runAction(cc.sequence(cc.delayTime(0.2), cc.show()));
		}

		dt += this.showTime;
		this.delayTime = dt;

		var soundData = {};
		soundData['userSex'] = this.userSex;
		if (this.userSex != 2) {
			this.userSex = 1;
		}
		soundData['huType'] = this.huType;
		soundData['ziMo'] = this.ziMo;
		// sound.playHuTypeSound(soundData);
	},

	onEnter: function () {
		this._super();

	},

	runHuAnimation: function (dt) {
		this.runAction(cc.sequence(
			cc.delayTime(dt),
			cc.callFunc(this.initUI.bind(this)),
			cc.show(),
			cc.delayTime(MjTime.HU_SHOW_TIME),
			cc.callFunc(this.postResultIndex), cc.removeSelf()
		));
	},

	postResultIndex: function () {
		var event = new cc.EventCustom(CommonEvent.EVT_DESK_RESULT_INDEX);
		event.setUserData(ResultTag.DAHU);
		cc.eventManager.dispatchEvent(event);
	},

});

var MJDaHuAni = function () {
	var DaHuAniClass = null;

	var setClass = function (cls) {
		DaHuAniClass = cls;
	};
	var create = function (huData) {
		if (DaHuAniClass) {
			return new DaHuAniClass(huData);
		}
	};
	var ins = {
		register: setClass,
		create: create,
	}
	return ins;
}();

