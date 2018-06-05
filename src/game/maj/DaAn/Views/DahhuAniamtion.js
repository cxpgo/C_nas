MJDaAn.DahuAnim = MJDahuAniBase.extend({
	ctor: function (huData) {
		XYGLogic.Instance.addSpriteFrames(MJDaAn.RES.DaHu_PL);
		this._super(huData, MJDaAnDaHuRes);
	},
});


