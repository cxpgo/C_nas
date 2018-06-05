/**
 * Created by atom on 2016/11/6.
 */

var PDKRecordLogic = function () {
    var logic = cc.Class.extend({
        recordId:0,
        handCardsArr:[],
        playerInfoArr:[],
        chairArr:[],
        posArr:[],
        stepsArr:[],
        dirArr:{},
        SELF:'self',
        RIGHT:'right',
        UP:'up',
        LEFT:'left',
        selfHandCards:[],
        rightHandCards:[],
        leftHandCards:[],
        totalrounds:10,
        currentRound:1,
        roomId:0,
        mustContain:0,
        aaGem:0,
        showNum:0,
        mode:0,
        person:0,
        firstMode:0,
        isSameIp:0,
        stepNow:1,
        stepAll:1,
        playStatus:1,
        finalRate:1,
        ctor: function (data) {

        },

        initSeatInfo: function (data) {
            this.recordId = data['num'];
            this.posArr = data['position'];
            this.stepsArr = data['step'];
            this.stepAll = this.stepsArr.length;
            this.fangZhu = data["fangZhu"];
            this.roomId = data['fangHao'];
            this.roundTotal = data['roundsTotal'];
            this.currentRound = data['currRounds'];
            this.isSameIp = data['isSameIp'];
            this.aaGem = data['aaGem'];
            this.showNum = data['showNum'];
            this.mode = data['mode'];
            this.person = data['person'];
            this.firstMode = data['firstMode'];
            this.mustContain = data['mustContain'];
            this.finalRate = data['finalRate'];
            this.initDirArr(data);
            this.initPlayerInfo(data);
            this.initHandCards(data);
        },

        getTableDes:function () {
            var desc = this.mode+'张,'+this.person+"人场,";
            if(this.aaGem == 1) desc+= "AA制收费,";
            if(this.firstMode == 1)
            {
                desc+= "赢家先出,";
            }
            else
            {
                desc+= "黑桃3先出,";
                if(this.mustContain == 1) desc+= "第一手牌必须包含黑桃3,";
            }

            if(this.showNum == 1)
                desc+= "显示剩余手牌张数,";
            else
                desc+= "不显示剩余手牌张数,";

            if(this.isSameIp == 1) desc+= "防作弊,"
            desc+= this.roundTotal+"局";
            return desc;
        },
        //hxx
        DDZgetTableDes: function () {
            var desc = DDZInfo.DDZNumber + '张,' + this.person + "人场,";
            if (this.aaGem == 1) desc += "AA制收费,";

            if (this.showNum == 1)
                desc += "显示剩余手牌张数,";
            else
                desc += "不显示剩余手牌张数,";

            if (this.isSameIp == 1) desc += "防作弊,"
            desc += this.roundTotal + "局";
            return desc;
        },


        initDirArr:function(data)
        {
            var owerID = data['fangZhu'];
            for(var i = 0;i < this.posArr.length;i++)
            {
                var uid = this.posArr[i];
                if(uid == owerID)
                {
                    this.dirArr[this.SELF] = i;
                }
            }

            this.dirArr[this.RIGHT] = this.dirArr[this.SELF] < 3 ? this.dirArr[this.SELF]+1 : 0;
            this.dirArr[this.LEFT] = this.dirArr[this.SELF] < 2 ? this.dirArr[this.SELF]+2 : this.dirArr[this.SELF]-2;
        },

        initPlayerInfo:function(data)
        {
            for(var j=0;j<data['players'].length;j++)
            {
                var uid = Number(data['players'][j]['uid']);

                switch (uid)
                {
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
                    case this.posArr[this.dirArr[this.LEFT]]:
                    {
                        this.playerInfoArr[2] = data['players'][j];
                    }
                        break;
                    default :
                        break;
                }
            }
        },

        initHandCards:function(data)
        {
            var cards = data['playerPai'];
            for(var i = 0;i < cards.length;i++)
            {
                var uid = cards[i]['uid'];
                cards[i]['paiQi']['uid'] = uid;
                switch (uid)
                {
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
                    case this.posArr[this.dirArr[this.LEFT]]:
                    {
                        this.leftHandCards = cards[i]['paiQi'];
                    }
                        break;
                    default :
                        break;
                }
            }
        },

        indexOfStep: function () {
            return this.stepsArr[this.stepNow];
        },



        postStep: function () {
            if(this.playStatus == RecordStatus.PAUSE || this.stepNow >= this.stepsArr.length) return;
            var event = new cc.EventCustom(CommonEvent.EVT_RECORD);
            var data = this.indexOfStep();
            JJLog.print('step = '+this.stepNow);
            JJLog.print(data);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
        },

        setPlayStatus: function (status) {
            this.playStatus = status;
            if(this.playStatus == RecordStatus.PLAY)
            {
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

        release:function () {

        },
    });

    return XYInstanceClass(logic);
}();