/**
 * Created by atom on 2016/7/24.
 */
var DDZGameDeskRecord = DDZGameDesk.extend({
    ctor: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
    },

    onPlayerEnter: function (data) {
        JJLog.print("!!!!!!!!!!!!!!!!!!", data);
        if (MajhongInfo.GameMode == GameMode.RECORD) {
            if(data[0] == 0)
            {
                playerSeat = new DDZSelfSeatRecord(data[1]);
                this.panel_player.addChild(playerSeat, 100);
                this.playerSeatAll[data[1].uid] = playerSeat;
            }
            else if(data[0] == 1)
            {
                if (XYGLogic.record.person == 2) {
                    playerSeat = new DDZUpSeatRecord(data[1]);
                    this.panel_player.addChild(playerSeat, 99);
                    this.playerSeatAll[data[1].uid] = playerSeat;
                    XYGLogic.Instance.nextPlayer = playerSeat;
                } else {
                    playerSeat = new DDZRightSeatRecord(data[1]);
                    this.panel_player.addChild(playerSeat, 99);
                    this.playerSeatAll[data[1].uid] = playerSeat;
                    XYGLogic.Instance.nextPlayer = playerSeat;
                }
            }
            else if(data[0] == 2)
            {
                playerSeat = new DDZLeftSeatRecord(data[1]);
                this.panel_player.addChild(playerSeat, 99);
                this.playerSeatAll[data[1].uid] = playerSeat;
            }
        }
    },
});