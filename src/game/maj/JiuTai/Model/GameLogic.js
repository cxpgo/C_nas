var MJJiuTaiLogic = function () {
    var logic = MJGameLogicBase.extend({
        playerQue: null,   //定缺牌
        offLineInfo: {},     //断线重回操作
        ctor: function () {
            this._super(MJJiuTaiGameStatus);
            this.config = {};
        },

        getMJOptTipRes: function () {
            return MJJiuTaiTipRes;
        },

        initSeatInfo: function (data) {
            this.SeatPlayerInfo = {};
            this.currentRound = data['tableStatus']['currRounds'];

            this.offLineInfo['currOp'] = data["tableStatus"]['currOp'];
            this.offLineInfo['nextChuPai'] = data["tableStatus"]['nextChuPai'];

            this.roomId = data["tableStatus"]['tableId'];
            this.roundTotal = data["tableStatus"]['roundsTotal'];

            this.parseConfig(data);
            this.isGold = data["tableStatus"]['isGold']; //是否是金币场
            this._super(data);
        },

        showRoundResult: function () {
            var result = new MJJiuTai.RoundResult(this.result);
            result.showResult();
        },

        showEndResult: function () {
            var endReport = new MJJiuTai.EndResult();
            endReport.showGameResult();
        },
        parseConfig: function (data) {

            this.config['tongBaoFan'] = data["tableStatus"].tongBaoFan;
            this.config['zhuangGangFan'] = data["tableStatus"].zhuangGangFan;
            this.config['gangHuFan'] = data["tableStatus"].gangHuFan;
            this.config['rounds'] = data["tableStatus"].rounds;
            this.config['wuYaoJiu'] = data["tableStatus"].wuYaoJiu;
            this.config['aaGem'] = data["tableStatus"]['aaGem'];

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
            if (this.config.aaGem == 1) {
                desc += "AA付费 "
            } else {
                desc += "房主付费 "
            }
            if (this.config.tongBaoFan == 1)
                desc += '通宝翻番 ';
            if (this.config.zhuangGangFan == 1)
                desc += '庄杠输赢翻倍 ';
            if (this.config.gangHuFan == 1)
                desc += '杠开杠后炮翻番 ';
            if (this.config.wuYaoJiu == 1)
                desc += '飘胡、七对不限幺九 ';
            return desc;
        },
        getGameLogo:function () {
            if(JTGame_Logo.JTLogo)
                return JTGame_Logo.JTLogo;
        },

        getGameType:function () {
            return false;
        },

        IsChangeGameBg:function () {
            return false;
        },

        getMJHuTWorld: function () {
            return MJJiuTaiHuWord;
        },
        getMJHuTSound: function () {
            return MJJiuTaiHuSound;
        },

        getSeatHeadStartPos:function (uid) {
            var startPos = this.SeatPlayerInfo[uid].getPosition();
            return startPos;
        },

        getSeatHeadEndPos:function (targetUid) {
            var endPos = cc.p(this.SeatPlayerInfo[targetUid].getPosition().x, this.SeatPlayerInfo[targetUid].getPosition().y);
            return endPos;
        },
    });

    return XYInstanceClass(logic);
}();
