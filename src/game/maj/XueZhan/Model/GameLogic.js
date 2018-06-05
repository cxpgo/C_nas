var MJXueZhanLogic = function () {
    var logic = MJGameLogicBase.extend({
        playerQue: null,   //定缺牌
        offLineInfo: {},     //断线重回操作
        ctor: function () {
            this._super(XueZhanGameStatus);
        },
        initSeatInfo: function (data) {
            this.SeatPlayerInfo = {};
            this.currentRound = data['tableStatus']['currRounds'];

            this.offLineInfo['currOp'] = data["tableStatus"]['currOp'];
            this.offLineInfo['nextChuPai'] = data["tableStatus"]['nextChuPai'];

            this.parseConfig(data);
            this.isGold = data["tableStatus"]['isGold']; //是否是金币场
            this._super(data);
        },

        isQueCard: function (card) {
            if (!this.playerQue || this.playerQue.length <= 0 || !card) return false;
            return card.paiOfCard().keyOfPai().indexOf(this.playerQue) >= 0
        },

        showRoundResult: function () {
			var result = new XueZhanRoundResult(this.result, this);
			result.showResult();
		},

		showEndResult: function () {
			var endReport = new XueZhanEndResult();
			endReport.showGameResult();
        },
        //------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        parseConfig: function (data) {
            this.mode = data["tableStatus"]['mode'];
            this.roomId = data["tableStatus"]['tableId'];
            this.roundTotal = data["tableStatus"]['roundsTotal'];
            this.aaGem = data["tableStatus"]['aaGem'];
            this.op1 = data["tableStatus"]['paiChuTime'];
            this.op2 = data["tableStatus"]['fengDing'];
            this.op3 = data["tableStatus"]['wanFa1'];
            this.op6 = data["tableStatus"]['wanFa2'];
            this.op4 = data["tableStatus"]['huanSan'];
            this.op5 = data["tableStatus"]['tianDi'];
            this.person = data["tableStatus"]['person'];
            this.op7 = data["tableStatus"]['one9'];
            this.op8 = data["tableStatus"]['dianPao'];
            this.op9 = data["tableStatus"]['menQing'];
            this.op10 = data["tableStatus"]['pphTwoFan'];
            this.op11 = data["tableStatus"]['isSameIp'];
            this.op12 = data["tableStatus"]['dianPaoPingHu'];
            this.op13 = data["tableStatus"]['jiaWuXin'];
        },
        getTableDes: function () {
            var desc = "血战麻将 ";
            if (this.mode == 1) {
                desc = "推到胡 ";
            } else if (this.mode == 2) {
                desc = "三人三房 ";
            } else if (this.mode == 3) {
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

            if (this.op12 == 1)
                desc += '点炮平胡 ';

            if (this.op13 == 1)
                desc += '夹五心 ';

            if (this.isGold != 1) {
                if (this.aaGem == 1)
                    desc += 'AA收费 ';
                else
                    desc += '房主付费 ';
            }
            return desc;
        },
        getGameLogo:function () {
            if(XZGame_Logo.XZLogo)
                return XZGame_Logo.XZLogo;
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
