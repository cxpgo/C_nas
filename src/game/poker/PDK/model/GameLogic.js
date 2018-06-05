
var PDKGameLogic = function () {
    var logic = GameLogicBase.extend({
        ctor: function () {
            this._super(GameStatus);
        },

        initSeatInfo: function (data) {
            this.SeatPlayerInfo = {};
            this._mTableData = data.tableStatus;
            var playerDataArray = data["tableStatus"]["players"];
            this.bankerId = data["tableStatus"]["banker"];
            this.fangZhu = data["tableStatus"]["fangZhu"];
            this.roomId = data["tableStatus"]['tableId'];
            this.roundTotal = data["tableStatus"]['roundsTotal'];
            this.isSameIp = data["tableStatus"]['isSameIp'];
            this.aaGem = data["tableStatus"]['aaGem'];
            this.showNum = data["tableStatus"]['showNum'];
            this.mode = data["tableStatus"]['mode'];
            this.person = data["tableStatus"]['person'];
            this.firstMode = data["tableStatus"]['firstMode'];
            this.mustContain = data["tableStatus"]['mustContain'];
            this.bombScore = data["tableStatus"]['bombScore'];
            this.isRePrivateTable = data["tableStatus"]['isRePrivateTable'];
            this._super(data);
        },

        uidofPos: function (uid) {
            var posArray = [0, 1, 2];
            for (var p in this.seatArray) {
                if (uid == this.seatArray[p]['uid']) {
                    var position = this.seatArray[p]['position'];
                    if (position < this.selfPos) {
                        return posArray[posArray.length - this.selfPos + position];
                    } else {
                        return posArray[position - this.selfPos];
                    }
                }
            }
            return null;

        },

        rightSeatInfo: function () {
            var pos = this.selfPos < 2 ? this.selfPos + 1 : 0;
            if (this.person == 2) {
                pos = this.selfPos == 0 ? 1 : 0;
            }
            return this.seatPosInfo(pos);
        },

        leftSeatInfo: function () {
            var pos = this.selfPos > 0 ? this.selfPos - 1 : 2;
            if (this.person == 2) {
                return null;
            }
            return this.seatPosInfo(pos);
        },

        RecordSeatInfo: function (data) {
            for (var i = 0; i < data.length; i++) {
                var info = data[i];
                var id = info["uid"];
                var pos = i;
                this.seatArray[pos] = info;
                if (id == hall.user.uid) {
                    this.selfPos = pos;
                    this.selfInfo = this.seatArray[pos];
                }
            }
        },

        updatePlayerDelCard: function (card, cb) {
            PDKPoker.net.updatePlayerDelCard(card, cb);
        },

        updatePlayerOp: function (data, cb) {
            PDKPoker.net.updatePlayerOp(data, cb);
        },

        getTableDes: function () {
            var desc = this.mode + '张,' + this.person + "人场,";
            if (this.aaGem == 1)
                desc += "AA制收费,";
            else if (this.aaGem == 0)
                desc += "房主付费,";
            else if (this.aaGem == 2)
                desc += "大赢家付费,";
            if (this.firstMode == 1) {
                desc += "赢家先出,";
            }
            else {
                desc += "黑桃3先出,";
                if (this.mustContain == 1) desc += "第一手牌必须包含黑桃3,";
            }

            if (this.showNum == 1)
                desc += "显示剩余手牌张数,";
            else
                desc += "不显示剩余手牌张数,";

            if (this.bombScore == 1) {
                desc += "炸弹算分";
            } else {
                desc += "炸弹不算分"
            }

            if (this.isSameIp == 1) desc += "防作弊,"
            desc += this.roundTotal + "局";
            return desc;
        },

        runToPlay: function () {
            var game = new PDKGameScene();
            game.runToPlay();
        },

        showRoundResult: function () {
			var result = new PDKRoundResult(this.result, this);
			result.showResult();
		},

		showEndResult: function () {
			var endReport = new PDKEndResult();
			endReport.showGameResult();
        },

        CardsSelectorHelp:function () {
            var UICardsSelector = new DDZCardsSelectorHelp();
            UICardsSelector.showHelp();
        },

        getSeatHeadStartPos:function (uid) {
            var startPos = this.SeatPlayerInfo[uid].getSpriteHeadPos();
            return startPos;
        },

        getSeatHeadEndPos:function (targetUid) {
            var endPos = this.SeatPlayerInfo[targetUid].getSpriteHeadPos();
            return endPos;
        },

        getGameLogo:function () {
            if(false)
                return BSGame_Logo.BSLogo;
            return false;
        },

        getGameType:function () {
            return true;
        },

        IsChangeGameBg:function () {
            return true;
        },
    });
    /**
         * 创建
         * 释放
         * 实例访问
         */
    var instance = null;
    var create = function () {
        if (!instance) {
            instance = new logic();
        }
        return instance;
    };

    var release = function () {
        if (instance) {
            instance.release();
            instance = null;
        }
    };

    /**
     * 导出接口
     * 每个单例对象都要到处三个接口
     * 一个create、一个release、一个Instance
     */
    var reLogic = {
        create: create,
        release: release
    };

    Object.defineProperty(reLogic, "Instance", {
        get: function () {
            create();
            return instance;
        }
    });

    return reLogic;
}();
