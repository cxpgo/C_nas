/**
 * Created by atom on 2016/11/6.
 */

var MJJiuTaiRecordLogic = function () {
    var logic = MJGameRecordBase.extend({

        initSeatInfo: function (data) {
            this._super(data);
            this.roundTotal = data['roundsTotal'];
            this.aaGem = data['aaGem'];
            this.person = data['person'];
            this.tongBaoFan = data['tongBaoFan'];
            this.zhuangGangFan = data['zhuangGangFan'];
            this.gangHuFan = data['gangHuFan'];
            this.wuYaoJiu = data['wuYaoJiu'];
            this.isGold = data['isGold']; //是否是金币
        },

        getTableDes: function () {
            var desc = "九台麻将 ";
            if(this.person == 2)
            {
                desc += this.roundTotal + '局 ';
            }
            else
            {
                desc += this.roundTotal + '圈 ';
            }
            desc += this.person + "人 ";
            if (this.aaGem == 1) {
                desc += "AA付费 "
            } else {
                desc += "房主付费 "
            }
            if (this.tongBaoFan == 1)
                desc += '通宝翻番 ';
            if (this.zhuangGangFan == 1)
                desc += '庄杠输赢翻倍 ';
            if (this.gangHuFan == 1)
                desc += '杠开杠后炮翻番 ';
            if (this.wuYaoJiu == 1)
                desc += '飘胡、七对不限幺九 ';
            return desc;
        },
    });

    return XYInstanceClass(logic);
}();