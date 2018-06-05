var MJGameRecordBase = cc.Class.extend({
    recordId: 0,
    handCardsArr: [],
    playerInfoArr: [],
    chairArr: [],
    posArr: [],
    stepsArr: [],
    dirArr: {},
    SELF: 'self',
    RIGHT: 'right',
    UP: 'up',
    LEFT: 'left',
    selfHandCards: null,
    rightHandCards: null,
    upHandCards: null,
    leftHandCards: null,
    totalrounds: 8,
    roomId: 0,
    person: 0,
    stepNow: 1,
    stepAll: 1,
    playStatus: 1,
    banker: "",
    ctor: function (data) {

    },

    initSeatInfo: function (data) {
        this.playerInfoArr = [];
        this.imgHuaPaiArray = [];
        this.textHuaPaiArray = [];
        this.listviewHuapaiArray = [];
        MajhongInfo.MajhongNumber = data['mjNumber'] || 17;
        this.mode = data['mode'];
        this.recordId = data['num'];
        this.posArr = data['position'];
        this.stepsArr = data['step'];
        this.stepAll = this.stepsArr.length;
        this.totalrounds = data['roundsTotal'];
        this.person = data['person'];
        this.roomId = data['fangHao'];
        this.initDirArr(data);
        this.initPlayerInfo(data);
        this.initHandCards(data);
    },

    getTableDes: function () {
        return "";
    },

    initDirArr: function (data) {
        var owerID = data['fangZhu'];
        for (var i = 0; i < this.posArr.length; i++) {
            var uid = this.posArr[i];
            if (uid == owerID) {
                this.dirArr[this.SELF] = i;
            }
        }
        if (this.person == 2) {
            this.dirArr[this.UP] = this.dirArr[this.SELF] == 0 ? 1 : 0;
        } else {
            this.dirArr[this.RIGHT] = this.dirArr[this.SELF] < 3 ? this.dirArr[this.SELF] + 1 : 0;
            this.dirArr[this.UP] = this.dirArr[this.SELF] < 2 ? this.dirArr[this.SELF] + 2 : this.dirArr[this.SELF] - 2;
            this.dirArr[this.LEFT] = this.dirArr[this.SELF] > 0 ? this.dirArr[this.SELF] - 1 : 3;
        }

    },

    initPlayerInfo: function (data) {
        for (var j = 0; j < data['players'].length; j++) {
            var uid = Number(data['players'][j]['uid']);
            data['players'][j].position = j;

            switch (uid) {
                case this.posArr[this.dirArr[this.SELF]]:
                    {
                        this.playerInfoArr[0] = data['players'][j];
                    }
                    break;
                case this.posArr[this.dirArr[this.RIGHT]]:
                    {
                        this.playerInfoArr[1] = data['players'][j];
                    }
                    break;
                case this.posArr[this.dirArr[this.UP]]:
                    {
                        if (this.person == 2) {
                            this.playerInfoArr[1] = data['players'][j];
                        } else {
                            this.playerInfoArr[2] = data['players'][j];
                        }
                    }
                    break;
                case this.posArr[this.dirArr[this.LEFT]]:
                    {
                        this.playerInfoArr[3] = data['players'][j];
                    }
                    break;
                default:
                    break;
            }
        }
    },

    initHandCards: function (data) {
        var cards = data['playerPai'];
        for (var i = 0; i < cards.length; i++) {
            var uid = cards[i]['uid'];
            cards[i]['paiQi']['uid'] = uid;
            switch (uid) {
                case this.posArr[this.dirArr[this.SELF]]:
                    {
                        this.selfHandCards = cards[i]['paiQi'];
                    }
                    break;
                case this.posArr[this.dirArr[this.RIGHT]]:
                    {
                        this.rightHandCards = cards[i]['paiQi'];
                    }
                    break;
                case this.posArr[this.dirArr[this.UP]]:
                    {
                        this.upHandCards = cards[i]['paiQi'];
                    }
                    break;
                case this.posArr[this.dirArr[this.LEFT]]:
                    {
                        this.leftHandCards = cards[i]['paiQi'];
                    }
                    break;
                default:
                    break;
            }
        }
    },

    indexOfStep: function () {
        return this.stepsArr[this.stepNow];
    },

    postStep: function () {
        if (this.playStatus == RecordStatus.PAUSE || this.stepNow >= this.stepsArr.length) return;
        var event = new cc.EventCustom(CommonEvent.EVT_RECORD);
        var data = this.indexOfStep();
        JJLog.print('step = ' + this.stepNow);
        JJLog.print(JSON.stringify(data));
        // if (data.type == 12 && data.result) {
        //     JJLog.print("========================");
        //     var result = new MJChangChun.RoundResult(data.result, this);
        //     result.showResult();
        //     return;
        // }
        event.setUserData(data);
        cc.eventManager.dispatchEvent(event);
    },

    setPlayStatus: function (status) {
        this.playStatus = status;
        if (this.playStatus == RecordStatus.PLAY) {
            this.postStep();
        }
    },

    postNextStep: function () {
        this.stepNow++;
        var event = new cc.EventCustom(CommonEvent.EVT_RECORD_NEXT_STEP);
        //var data = this.indexOfStep();
        event.setUserData(this.stepNow);
        cc.eventManager.dispatchEvent(event);
    },

    release: function () {

    },
});

