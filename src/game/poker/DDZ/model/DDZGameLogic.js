// nextPlayer: null, //玩家下家
//         rotateTime: 0,//旋转次数
//         fangZhu: 0,// 房主UID
//         tableInfo: null,
//         chairArr: [],
//         report: null,
//         roundTotal: 0,
//         currentRound: 1,
//         isRePrivateTable: 0,
//         roomId: 0,
//         mustContain: 0,
//         aaGem: 0,
//         showNum: 0,
//         firstMode: 0,
//         isSameIp: 0,

//         chuntian: null,
//         getReady:{},
//         result: null,
//         mulityData: {
//             lord: 0,
//             bomb: 1,
//             spring: 1,
//         },
//         lordCards: {
//             /**
//              * card 
//              * card 
//              * card
//              */
//         },
//         _lastOpPai: {
//             "cards": [],
//             'type': DouDiZhuType.CT_ERROR
//         },
//         lastOpUid:null,
//         CurOptLord: null,
//         changeValue:{},
//         checkNum:0,
//         playCardsNum:{},
var DDZGameLogic = function () {
    var logic = GameLogicBase.extend({
        ctor: function () {
            this._super(TABLESTATUS);
            var self = this;
            Object.defineProperties(this, {
                "LastOpPai": {
                    get: function () {
                        return self._lastOpPai;
                    },
                    set: function (data) {
                        if (data) {
                            if (data.cards || data.opCard) {
                                self._lastOpPai.cards = data.cards || data.opCard;
                            }
                            if (data.type || data.opCardType) {
                                self._lastOpPai.type = data.type || data.opCardType;
                            }
                        } else {
                            self._lastOpPai = {
                                "cards": [],
                                'type': DouDiZhuType.CT_ERROR
                            };
                        }
                    }
                },
            });
            this.reStart();
        },

        registerAllEvents: function () {
            qp.event.listen(this, 'pkSyncTableRate', this.onMulityChanged.bind(this));
            this._super();
        },

        removeAllEvents: function () {
            qp.event.stop(this, 'pkSyncTableRate');
            this._super();
        },

        reStart: function () {
            this.inited = false;
            this.nextPlayer = null;
            this.offLineInfo = {};
            this.mulityData = {
                lord: 0,
                bomb: 1,
                spring: 1,
                double: []
            };
            this.lordCards = {};
            this.LastOpPai = null;
            this.lastOpUid = null;
            this.changeValue = {};
            this.checkNum = 0;

            this.CurOptLord = null;
            this.bankerId = 0;

            this.playCardsNum = {};
        },

        initSeatInfo: function (data) {
            this.SeatPlayerInfo = {};
            var playerDataArray = data["tableStatus"]["players"];
            this.isGold = data["tableStatus"]["isGold"];
            this.bankerId = data["tableStatus"]["banker"];
            this.fangZhu = data["tableStatus"]["fangZhu"];
            this.roomId = data["tableStatus"]['tableId'];
            this.roundTotal = data["tableStatus"]['roundsTotal'];
            this.currentRound = data["tableStatus"]['currRounds'];
            this.isSameIp = data["tableStatus"]['isSameIp'];
            this.aaGem = data["tableStatus"]['aaGem'];
            this.showNum = data["tableStatus"]['showNum'];
            this.mode = data["tableStatus"]['mode'];
            this.maxBomb = data["tableStatus"]['maxBomb'];
            this.person = data["tableStatus"]['person'];
            this.changeValue = data["tableStatus"]['changeValue'];
            this.checkNum = data["tableStatus"]['checkNum'];
            this.firstMode = data["tableStatus"]['firstMode'];
            this.mustContain = data["tableStatus"]['mustContain'];
            this.isOffline = data["tableStatus"]['isOffline'];
            this.isRePrivateTable = data["tableStatus"]['isRePrivateTable'];


            this.offLineInfo['currOp'] = data["tableStatus"]['currOp'];
            this.offLineInfo['nextChuPai'] = data["tableStatus"]['nextChuPai'];
            this.offLineInfo['lastOP'] = data["tableStatus"]["lastOP"];

            this.lordCards = data["tableStatus"]["lordCards"];
            this.mulityData = data["tableStatus"]['rate'];

            if (this.offLineInfo['lastOP']) {
                this.LastOpPai = this.offLineInfo['lastOP'];
            }
            this.CurOptLord = data["tableStatus"]['nextLord'];

            this.tableInfo = data["tableStatus"]["players"];

            for (var i = 0; i < this.tableInfo.length; i++) {
                var info = this.tableInfo[i];
                if (info.uid != hall.user.uid) {
                    this.playCardsNum[info.uid] = info["paiQi"].num
                } else {
                    this.playCardsNum[info.uid] = info["paiQi"].length;
                }
            }


            this._super(data);
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


        leftSeatInfo: function () {
            var pos = this.selfPos > 0 ? this.selfPos - 1 : 2;
            if (this.person == 2) {
                return null;
            }
            return this.seatPosInfo(pos);
        },

        upSeatInfo: function () {
            if (this.person == 2) {
                var pos = this.selfPos > 0 ? 0 : 1;
                return this.seatPosInfo(pos);
            } else {
                return null;
            }
        },

        rightSeatInfo: function () {
            var pos = this.selfPos < 2 ? this.selfPos + 1 : 0;
            if (this.person == 2) {
                return null;
            }
            return this.seatPosInfo(pos);
        },
        updatePlayerDelCard: function (card, type, cb) {
            type = type || 0;
            XYGLogic.net.updatePlayerDelCard(card, type, cb);
        },

        updatePlayerOp: function (data, cb) {
            XYGLogic.net.updatePlayerOp(data, cb);
        },
        onMulityChanged: function (data) {
            JJLog.print("onMulityChanged=>", data)
            JJLog.print(JSON.stringify(data));
            var _mulityData = data;
            for (var key in _mulityData) {
                if (_mulityData.hasOwnProperty(key)) {
                    this.mulityData[key] = _mulityData[key];
                }
            }
            this.updateMulityValue();
        },
        updateMulityValue: function () {
            qp.event.send('mulityChange', this.getMulityValue());
        },
        getMulityLord: function () {
            return this.mulityData.lord;
        },
        getMulityValue: function () {
            var v = 1;
            for (var key in this.mulityData) {
                if (this.mulityData.hasOwnProperty(key)) {
                    if (key == "double") {
                        var doubleInfos = this.mulityData[key];
                        v *= this.comDoubleValue(doubleInfos);
                    } else {
                        v *= this.mulityData[key];
                    }
                }
            }
            return v == 0 ? 1 : v;
        },
        comDoubleValue: function (data) {
            var value = 1;
            var _this = this;
            var person = this.person
            if (person == 2) {
                if (data.length > 0) {
                    data.forEach(function (el) {
                        if (el.isDouble) {
                            value *= 2
                        }
                    })
                }
            } else if (person == 3) {
                if (hall.user.uid == this.bankerId) {
                    value *= 2;
                }
                var tempBase = 1;
                if (data.length > 0) {
                    data.forEach(function (el) {
                        if (el.isDouble) {
                            if (el.uid == _this.bankerId || el.uid == hall.user.uid) {
                                value *= 2
                            } else if (hall.user.uid == _this.bankerId) {
                                tempBase += 0.5
                            }
                        }
                    })
                }
                value *= tempBase;
            }
            JJLog.print("获得作用于自身的加倍倍数=>", value);
            return value;
        },

        whoIsBanker: function () {
            return this.bankerId;
        },

        whoIsFangzhu: function () {
            if (this.isGold == 1) return null;
            return this.fangZhu;
        },
        getTableDes: function () {
            var desc = this.person + "人场,";
            if (this.mode == 1)
                desc += "抢地主,";
            else if (this.mode == 2)
                desc += "叫分,";
            if (this.aaGem == 1)
                desc += "AA制收费,";
            else if (this.aaGem == 0)
                desc += "房主付费,";
            else if (this.aaGem == 2)
                desc += "大赢家付费,";
            if (this.isLaiZi == 1)
                desc += "带赖子玩法,";

            if (this.maxBomb > 0) {
                var str = this.maxBomb + "炸封顶"
                desc += str;
            }

            if (this.isSameIp == 1) desc += "防作弊,"
            desc += this.roundTotal + "局";
            return desc;
        },

        CardsSelectorHelp:function () {
            var UICardsSelector = new DDZCardsSelectorHelp();
            UICardsSelector.showHelp();
        },

        showRoundResult: function () {
			var result = new DDZRoundResult(this.result, this);
			result.showResult();
		},

		showEndResult: function () {
			var endReport = new DDZEndResult();
			endReport.showGameResult();
        },

        getSeatHeadStartPos:function (uid) {
            var startPos = this.SeatPlayerInfo[uid].getSpriteHeadPos();
            return startPos;
        },

        getSeatHeadEndPos:function (targetUid) {
            var endPos = this.SeatPlayerInfo[targetUid].getSpriteHeadPos();
            return endPos;
        },

        onTableStatus: function (jtable) {
            var status = {};
            status['tableStatus'] = jtable;
            this._super(status)

            if (jtable == TABLESTATUS.READY) {
                this.ResultData = null;
            }
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
    })

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


