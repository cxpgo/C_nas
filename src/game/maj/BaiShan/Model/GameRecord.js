var MJBaiShanRecordLogic = function () {
    var logic = MJGameRecordBase.extend({
        
        initSeatInfo: function (data) {
            this._super(data);
            this.aaGem = data['aaGem'];
            this.paiChuTime = data['paiChuTime'];
            this.fengDing = data['fengDing'];
            this.roundsTotal = data['roundsTotal'];
            this.baoSanJia = data['baoSanJia'];
            this.person = data['person'];
            this.isGold = data['isGold']; //是否是金币场
        },

        getTableDes: function () {
            JJLog.print("this.mode---------------:", this.mode);
            var desc = "白山麻将 ";

            if(this.person == 2)
            {
                desc += this.roundTotal + '局 ';
            }
            else
            {
                desc += this.roundTotal + '圈 ';
            }
            desc += this.person + "人 " + this.fengDing + "分封顶 ";

            if (this.baoSanJia == 1)
                desc += '点炮包三家 ';
            if (this.isGold != 1) {
                if (this.aaGem == 1)
                    desc += 'AA收费 ';
                else
                    desc += '房主付费 ';
            }

            // if(this.op10 == 1)
            //     desc += '防作弊 ';

            return desc;
        },

        runToRecord: function () {
            var game = new BaiShanGameScene();
            game.runToRecord();
        },
    });

    return XYInstanceClass(logic);
}();
