/**
 * Created by atom on 2016/11/6.
 */

MJChangChun.RecordLogic = function () {
    var logic = MJGameRecordBase.extend({

        initSeatInfo: function (data) {
            this._super(data);
            
            this.config = {};

            this.roundTotal = data['roundsTotal'];
            this.person = data['person'];
            this.isGold = data['isGold']; //是否是金币

            this.parseConfig({"tableStatus":data});
        },

        parseConfig: function (data) {

            this.config['jiDan'] = data["tableStatus"].jiDan;
            this.config['sanFengDan'] = data["tableStatus"].sanFengDan;
            this.config['danZhanLi'] = data["tableStatus"].danZhanLi;
            this.config['rounds'] = data["tableStatus"].rounds;
            this.config['anBao'] = data["tableStatus"].anBao;
            this.config['queMen'] = data["tableStatus"].queMen;
            this.config['menQing'] = data["tableStatus"].menQing;
            this.config['daHuQue'] = data["tableStatus"].daHuQue;
            this.config['paoOne'] = data["tableStatus"].paoOne;
            this.config['cgfb'] = data["tableStatus"].cgfb;
            this.config['aaGem'] = data["tableStatus"].aaGem;

        },

        getTableDes: function () {

            var desc = "长春麻将 ";
            if(this.person == 2)
            {
                desc += this.roundTotal + '局 ';
            }
            else
            {
                desc += this.roundTotal + '圈 ';
            }
            desc += this.person + "人 ";
            if (this.config.aaGem == 1) {
                desc += "AA付费 "
            } else {
                desc += "房主付费 "
            }
            if (this.config.anBao == 1)
                desc += '暗宝 ';
            else
                desc += '明宝 ';

            if (this.config.paoOne == 1)
                desc += '点炮包三家 ';
            if (this.config.jiDan == 1)
                desc += '小鸡飞蛋 ';
            if (this.config.sanFengDan == 1)
                desc += '三风蛋 ';
            if (this.config.danZhanLi == 1)
                desc += '下蛋算站立 ';
            if (this.config.queMen == 1)
                desc += '带缺门 ';
            if (this.config.cgfb == 1)
                desc += '冲宝翻倍 ';
            if (this.config.daHuQue == 1)
                desc += '飘胡.七对不限三色和幺九 ';
            return desc;
        },
    });

    return XYInstanceClass(logic);
}();