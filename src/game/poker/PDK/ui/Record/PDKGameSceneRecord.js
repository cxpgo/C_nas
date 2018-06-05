/**
 * Created by atom on 2016/7/25.
 */
var PDKGameSceneRecord = PDKGameScene.extend({
    ctor: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        if (MajhongInfo.GameMode == GameMode.RECORD) {
            qp.event.send('appRecordRoomInfo', {});
            this.panel_ready.setVisible(false);
            this.panel_option_waiting.setVisible(false);
            this.panel_option_playing.setVisible(false);
            //this.btn_speak.setVisible(false);
            this.panel_option_waiting.setVisible(false);

            var recordPanel = new PDKRecordControll();
            this.addChild(recordPanel);
            recordPanel.x = 0;
            recordPanel.y = 0;

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
        }
    },

    onExit: function () {
        this._super();
    },

    initRecordInfo: function () {
        // this.initRecordHead();
        this.initRecordDesk();
    },

    initRecordHead: function () {
        for (var i = 0; i < XYGLogic.record.playerInfoArr.length; i++) {
            var data = XYGLogic.record.playerInfoArr[i];
            this.deskArray[i] = new PDKDeskHead(data);
            this.seatHeads[i].addChild(this.deskArray[i], 1, 1);
            var frame = ccui.helper.seekWidgetByName(this.seatHeads[i], "image_frame");
            frame.setVisible(false);
        }
    },

    initRecordDesk: function () {
        var desc = XYGLogic.record.getTableDes();

        this.text_round.setString(XYGLogic.record.currentRound + '/' + XYGLogic.record.roundTotal);
        this.text_msg.setString(desc);
        this.text_msg.setVisible(true);

        this.mGameDesk = new PDKGameDeskRecord();
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