/**
 * Created by atom on 2016/7/25.
 */
var DDZGameSceneRecord = DDZGameScene.extend({
    ctor: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        if (MajhongInfo.GameMode == GameMode.RECORD) {
            qp.event.send('appGameRecord', {});
            qp.event.send('appRecordRoomInfo', {});
            // this.panel_ready.setVisible(false);
            this.panel_option_waiting.setVisible(false);
            this.panel_option_playing.setVisible(true);
            //this.btn_msg.setVisible(false);
            //this.btn_rule.setVisible(false);
            // this.btn_speak.setVisible(false);
            this.panel_option_waiting.setVisible(false);

            var recordPanel = new recordControll();
            this.addChild(recordPanel);
            recordPanel.x = 0;
            recordPanel.y = 0;

            this.registerAllEvents();

            XYGLogic.Instance.RecordSeatInfo(XYGLogic.record.playerInfoArr);
            this.initRecordInfo();
            for (var i = 0; i < XYGLogic.record.playerInfoArr.length; i++) {
                var data = XYGLogic.record.playerInfoArr[i];
                data["position"] = i;
                XYGLogic.Instance.setSeatPosInfo(data);
            }
            for (var i = 0; i < XYGLogic.record.playerInfoArr.length; i++) {
                var data = XYGLogic.record.playerInfoArr[i];
                this.mGameDesk.onPlayerEnter([i, data]);
            }

            if (XYGLogic.record.person == 2) {
                this.beneathCardPanel.setPositionX(90);
                this.beneathCardPanel.setPositionY(690);
                this.panel_gameInfo.setPositionY(480);
            }
            this.setBeneathCards(XYGLogic.record.bankerCards);
            this.showChangeValue(XYGLogic.record.changeValue);
            this.setCheckNum(true);
        }
    },

    onExit: function () {
        this._super();
        if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.removeAllEvents();
            XYGLogic.release();
        }
    },

    initRecordInfo: function () {
        this.initRecordDesk();
    },

    initRecordDesk: function () {
        var desc = XYGLogic.record.DDZgetTableDes();
        //this.panel_status.setVisible(true);
        this.text_round.setString(XYGLogic.record.currentRound + '/' + XYGLogic.record.roundTotal);
        this.txtMulityValue.string = "x" + XYGLogic.record.finalRate;

        this.mGameDesk = new DDZGameDeskRecord();
        this.panel_desk.addChild(this.mGameDesk);
    },

    setCheckNum: function (bool) {
        if (MajhongInfo.GameMode == GameMode.RECORD) {
            if (XYGLogic.record.person == 2) {
                if (bool) {
                    this.img_checkNum.setVisible(true);
                    this.text_checkNum.setString(XYGLogic.record.checkNum);
                } else {
                    this.img_checkNum.setVisible(false);
                }
            }
        }
    },
});