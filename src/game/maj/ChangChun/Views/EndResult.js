MJChangChun.EndResult = MJEndResultBase.extend({

	ctor: function (data) {
		this._super(data);
	},

	getEndResultCfg: function (info) {
		var valueArray = [];

		valueArray.push(['连庄次数', info.bankerCount || 0]);
		valueArray.push(['胡牌次数', (info.zimoCount || 0) + (info.jiePaoCount)]);
		valueArray.push(['点炮次数', info.dianPao || 0]);
		valueArray.push(['摸宝次数', info.baoCount || 0]);
		
		return valueArray;
	},
});
