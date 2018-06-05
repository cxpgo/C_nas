var MJDaAnLogic = function () {
    var logic = MJGameLogicBase.extend({
        playerQue: null,   //定缺牌
        offLineInfo: {},     //断线重回操作
        ctor: function () {
            this._super(MJDaAn.Common.GameStatus);
            this.config = {};
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
            var result = new MJDaAn.RoundResult(this.result);
            result.showResult();
        },

        showEndResult: function () {
            var endReport = new MJDaAn.EndResult();
            endReport.showGameResult();
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
            this.config['aaGem'] = data["tableStatus"]['aaGem'];

        },
        getTableDes: function () {

            var desc = "大安麻将 ";
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
            return desc;
        },

        getGameLogo:function () {
            if(DAGame_Logo.DALogo)
                return DAGame_Logo.DALogo;
        },

        getGameType:function () {
            return false;
        },

        IsChangeGameBg:function () {
            return false;
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
