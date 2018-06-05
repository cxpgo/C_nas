MJBaiShan.DahuAnim = MJDahuAniBase.extend({
	ctor: function (huData) {
		XYGLogic.Instance.addSpriteFrames(MJBaiShan.RES.DaHu_PL);
		this._super(huData , MJBaiShanDaHuRes);
	},
});


