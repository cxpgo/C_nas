/**
 * Created by atom on 2016/7/24.
 */
var PDKGameDeskRecord = PDKGameDesk.extend({
    ctor: function () {
        this._super();
        if(MajhongInfo.GameMode == GameMode.RECORD)
        {
            var selfseat = new PaoSelfSeatRecord(XYGLogic.record.selfHandCards);
            this.panel_player.addChild(selfseat,100);

            var rightSeat = new PaoRightSeatRecord(XYGLogic.record.rightHandCards);
            this.panel_right.addChild(rightSeat,99);

            if (XYGLogic.record.leftHandCards.length > 0) {
                var leftSeat = new PaoLeftSeatRecord(XYGLogic.record.leftHandCards);
                this.panel_left.addChild(leftSeat,98);
            }

        }
    },

    onEnter: function () {
        this._super();
    },
});