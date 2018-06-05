var MJBaiShanLogic = function () {
    var logic = MJGameLogicBase.extend({
        playerQue: null,   //定缺牌
        offLineInfo: {},     //断线重回操作
        ctor: function () {
            this._super(MJBaiShan.Common.GameStatus);
        },
        initSeatInfo: function (data) {
            this.SeatPlayerInfo = {};
            this.currentRound = data['tableStatus']['currRounds'];

            this.offLineInfo['currOp'] = data["tableStatus"]['currOp'];
            this.offLineInfo['nextChuPai'] = data["tableStatus"]['nextChuPai'];

            this.roomId = data["tableStatus"]['tableId'];
            this.roundTotal = data["tableStatus"]['roundsTotal'];
            this.aaGem = data["tableStatus"]['aaGem'];
            this.paiChuTime = data["tableStatus"]['paiChuTime'];
            this.fengDing = data["tableStatus"]['fengDing'];
            this.baoSanJia = data["tableStatus"]['baoSanJia'];
            this.person = data["tableStatus"]['person'];

            this.isGold = data["tableStatus"]['isGold']; //是否是金币场
            this._super(data);
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
        isQueCard: function (card) {
            if (!this.playerQue || this.playerQue.length <= 0 || !card) return false;
            return card.paiOfCard().keyOfPai().indexOf(this.playerQue) >= 0
        },

        release:function () {
            this._super();
        },

        showRoundResult: function () {
            var result = new MJBaiShan.RoundResult(XYGLogic.Instance.result);
            result.showResult();
        },

        showEndResult: function () {
            var endReport = new MJBaiShan.EndResult();
            endReport.showGameResult();
        },

        getSeatHeadStartPos:function (uid) {
            var startPos = this.SeatPlayerInfo[uid].getPosition();
            return startPos;
        },

        getSeatHeadEndPos:function (targetUid) {
            var endPos = cc.p(this.SeatPlayerInfo[targetUid].getPosition().x, this.SeatPlayerInfo[targetUid].getPosition().y);
            return endPos;
        },

        GetEndResultCfg:function (info) {
            var valueArray = [];
            var zimoCount =  (info['zimoNum'] || 0) + (info['zimoNum'] || 0);
            var dianPaoCount =  (info['dianPaoNum'] || 0) + (info['dianPaoNum'] || 0);
            var jiePaoCount =  (info['jiePaoNum'] || 0);
            var anGangCount =  (info['anGangNum'] || 0);
            var mingGangCount =  (info['mingGangNum'] || 0);
            valueArray.push(['自摸次数',zimoCount]);
            valueArray.push(['点炮次数',dianPaoCount]);
            valueArray.push(['接炮次数',jiePaoCount]);
            valueArray.push(['暗杠次数',anGangCount]);
            valueArray.push(['明杠次数',mingGangCount]);
            return valueArray;
        },

        getGameLogo:function () {
            if(BSGame_Logo.BSLogo)
                return BSGame_Logo.BSLogo;
        },

        getGameType:function () {
            return false;
        },

        IsChangeGameBg:function () {
            return false;
        },

        getMJHuTWorld: function () {
            return MJBaiShanHuWord;
        },
        getMJHuTSound: function () {
            return MJBaiShanHuSound;
        },
    });
    return XYInstanceClass(logic);
}();
