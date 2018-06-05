MJDaAn.EndResult = MJEndResultBase.extend({

	ctor: function (data) {
		this._super(data);
	},

	getEndResultCfg: function (info) {
		var valueArray = [];
		var zimoCount = (info['zimoNum'] || 0) + (info['zimoNum'] || 0);
		var dianPaoCount = (info['dianPaoNum'] || 0) + (info['dianPaoNum'] || 0);
		var jiePaoCount = (info['jiePaoNum'] || 0);
		var anGangCount = (info['anGangNum'] || 0);
		var mingGangCount = (info['mingGangNum'] || 0);
		valueArray.push(['自摸次数', zimoCount]);
		valueArray.push(['点炮次数', dianPaoCount]);
		valueArray.push(['接炮次数', jiePaoCount]);
		valueArray.push(['暗杠次数', anGangCount]);
		valueArray.push(['明杠次数', mingGangCount]);
		return valueArray;
	},
});
