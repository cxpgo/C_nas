/**
 * Created by atom on 2016/11/6.
 */

var MJDaAnRecordLogic = function () {
    var logic = MJGameRecordBase.extend({
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
            if (this.aaGem == 1) {
                desc += "AA付费 "
            } else {
                desc += "房主付费 "
            }
            return desc;
        },

        initSeatInfo: function (data) {
            this._super(data);
            MajhongInfo.MajhongNumber = data['mjNumber'] || 17;
            this.mode = data['mode'];
            this.recordId = data['num'];
            this.posArr = data['position'];
            this.stepsArr = data['step'];
            this.stepAll = this.stepsArr.length;
            this.roundTotal = data['roundsTotal'];
            this.person = data['person'];
            this.roomId = data['fangHao'];
            this.aaGem = data['aaGem'];
            this.isGold = data['isGold']; //是否是金币场
            this.initDirArr(data);
            this.initPlayerInfo(data);
            this.initHandCards(data);
        },

        runToRecord: function () {
            var game = new MJDaAn.GameScene();
            game.runToRecord();
        },
    });

    return XYInstanceClass(logic);
}();