/**
 * Created by atom on 2016/9/24.
 */
var XueZhanEndResult = MJEndResultBase.extend({
	ctor: function (data) {
		this._super(data);
	},

    getEndResultCfg: function (info) {
        var valueArray = [];
        var zimoCount = (info['zimoBigCount'] || 0) + (info['zimoSmallCount'] || 0);;
        var dianPaoCount = (info['dahuPao'] || 0) + (info['xiaoHuPao'] || 0);
        var jiePaoCount = (info['jiePaoNum'] || 0);
        var anGangCount = (info['anGang'] || 0);
        var mingGangCount = (info['mingGang'] || 0);
        var maxHeighScore = (info['maxHeighScore'] || 0);
        valueArray.push(['自摸次数', zimoCount]);
        valueArray.push(['点炮次数', dianPaoCount])
        valueArray.push(['暗杠次数', anGangCount]);
        valueArray.push(['明杠次数', mingGangCount])
        valueArray.push(['单局最高分', maxHeighScore]);
        return valueArray;
    },
});
