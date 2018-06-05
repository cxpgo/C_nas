/**
 * Created by atom on 2016/11/6.
 */
XueZhanMajhong.Record = function(){
    var logic = MJGameRecordBase.extend({

        initSeatInfo: function (data) {
            this._super(data);
            MajhongInfo.MajhongNumber = data['mjNumber'] || 17;
            this.mode = data['mode'];
            this.recordId = data['num'];
            this.posArr = data['position'];
            this.stepsArr = data['step'];
            this.stepAll = this.stepsArr.length;
            this.totalrounds = data['roundsTotal'];
            this.person = data['person'];
            this.roomId = data['fangHao'];
            this.aaGem = data['aaGem'];
            this.op1 = data['paiChuTime'];
            this.op2 = data['fengDing'];
            this.op3 = data['wanFa1'];
            this.op6 = data['wanFa2'];
            this.op4 = data['huanSan'];
            this.op5 = data['tianDi'];
            this.op7 = data['one9'];
            this.op9 = data['menQing'];
            this.op10 = data['pphTwoFan'];
            this.op11 = data['isSameIp'];
            this.op12 = data['dianPaoPingHu'];
            this.op13 = data['jiaWuXin'];
            this.isGold = data['isGold']; //是否是金币场
            this.initDirArr(data);
            this.initPlayerInfo(data);
            this.initHandCards(data);
        },

        getTableDes: function () {
            var desc = "血战麻将 ";

            if(this.mode == 1){
                desc = "推到胡 ";
            }else if(this.mode == 2){
                desc = "三人三房 ";
            }else if(this.mode == 3){
                desc = "三人两房 ";
            }


            desc += this.roundTotal + '局 ';
            desc += this.person + "人 " + this.op2 + "番封顶 ";

            if (this.op1 == -1) {
                desc += "出牌无限制 "
            } else {
                desc += this.op1 + "秒出牌 "
            }

            if (this.op3 == 0)
                desc += '自摸加底 ';
            else
                desc += '自摸加番 ';

            if (this.op6 == 0)
                desc += '点杠花(自摸) ';
            else
                desc += '点杠花(点炮) ';

            if (this.op4 == 1)
                desc += '换三张 ';
            if (this.op7 == 1)
                desc += '幺九将对 ';
            if (this.op9 == 1)
                desc += '门清中张 ';
            if (this.op5 == 1)
                desc += '天地胡 ';
            if (this.op8 == 1)
                desc += '点炮可平胡 ';

            if (this.op10 == 1)
                desc += '对对胡两番 ';

            if(this.op12 == 1)
                desc += '点炮平胡 ';

            if(this.op13 == 1)
                desc += '夹五心 ';

            if (this.isGold != 1) {
                if (this.aaGem == 1)
                    desc += 'AA收费 ';
                else
                    desc += '房主付费 ';
            }

            // if (this.op10 == 1)
            // 	desc += '防作弊 ';

            return desc;
        },
    });

    return XYInstanceClass(logic);
}();