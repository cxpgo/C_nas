/**
 * Created by atom on 2016/8/1.
 */
var PDKDeskHead = cc.Layer.extend({
    playerData: null,
    text_name: null,
    text_score: null,
    panel_root: null,
    sprite_face: null,
    text_msg_left: null,
    text_msg_right: null,
    uid: null,
    sprite_banker: null,
    img_offline: null,
    sprite_speaker: null,
    isRight: false,
    text_msg: null,
    text_painum: null,
    sprite_head: null,
    sprite_msg_right: null,
    sprite_msg_left: null,
    sprite_msg: null,
    sprite_one: null,
    text_bankerCount: null,
    enableThrow:null,
    enableVibrate:true,
    ctor: function (data) {
        this._super();
        this.playerData = data;
        this.uid = data["uid"];
        var root = util.LoadUI(PDKPokerJson.PDKHead).node;
        this.addChild(root);

        this.enableThrow = true;
        this.enableVibrate = true;
        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        if (MajhongInfo.GameMode == GameMode.PLAY)
            this.panel_root.setTouchEnabled(true);
        this.panel_root.addClickEventListener(function () {
            data.enableThrow = this.enableThrow;
            this.enableThrow = false;
            var dialog = new GamePlayerInfoDialog(data);
            dialog.showDialog();
        }.bind(this));
        this.setContentSize(this.panel_root.getContentSize());
        this.text_score = ccui.helper.seekWidgetByName(root, "text_score");
        this.img_offline = ccui.helper.seekWidgetByName(root, "img_offline");
        this.sprite_speaker = ccui.helper.seekWidgetByName(root, "sprite_speaker");
        this.sprite_speaker.setVisible(false);
        var status = data['isOffLine'];
        this.img_offline.setVisible(status == 1);
        this.text_score.setString(this.playerData["coinNum"]);
        this.text_name = ccui.helper.seekWidgetByName(root, "text_name");

        this.text_name.setString(base64.decode(this.playerData["nickName"]));
        this.sprite_head = ccui.helper.seekWidgetByName(root, "sprite_head");
        util.ChangeloadHead(root,this.playerData['equip']);

        var _this = this;
        if (this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
            util.LoadHead(this.sprite_head, this.playerData.headUrl);
        } else {

        }


        this.sprite_banker = ccui.helper.seekWidgetByName(root, "sprite_banker");
        this.sprite_banker.setVisible(this.uid == XYGLogic.Instance.fangZhu);
        this.sprite_face = ccui.helper.seekWidgetByName(root, "sprite_face");
        this.sprite_face.setVisible(false);
        this.text_msg_left = ccui.helper.seekWidgetByName(root, "text_msg_left");
        this.text_msg_right = ccui.helper.seekWidgetByName(root, "text_msg_right");
        this.sprite_msg_left = ccui.helper.seekWidgetByName(root, "sprite_msg_left");
        this.sprite_msg_right = ccui.helper.seekWidgetByName(root, "sprite_msg_right");
        this.sprite_one = ccui.helper.seekWidgetByName(root, "img_one");
        this.text_painum = ccui.helper.seekWidgetByName(root, "text_painum");
        this.text_painum.setVisible(false);

        this.sprite_msg_left.setVisible(false);
        this.sprite_msg_right.setVisible(false);
        this.text_msg_right.setVisible(false);
        this.text_msg_left.setVisible(false);
        this.text_msg = this.text_msg_left;
        this.sprite_msg = this.sprite_msg_left;
        this.schedule(this.updateThrowSattus, 5);
    },
    updateThrowSattus: function () {
        if (this.enableThrow == false) {
            this.enableThrow = true;
        }

        if (this.enableVibrate == false) {
            this.enableVibrate = true;
        }
    },

    getSpriteHeadPos: function () {
        return this.sprite_head.getPosition();
    },

    onEnter: function () {
        this._super();
        this.registerAllEvents();

        var pos = this.panel_root.convertToWorldSpace(this.sprite_speaker.getPosition());

        var size = cc.director.getWinSize();
        if (pos.x < size.width * 0.5) {
            size = this.panel_root.getContentSize();
            this.sprite_speaker.x = size.width + this.sprite_speaker.getContentSize().width * 0.5 - 15;
            this.sprite_speaker.setFlippedX(true);
            // this.sprite_head.setFlippedX(true);
            this.isRight = true;
            this.text_msg = this.text_msg_right;
            this.sprite_face.x = size.width + 34;
            this.sprite_msg = this.sprite_msg_right;
        }
    },

    onExit: function () {
        this.removeAllEvents();
        this.releaseAllItem();
        this._super();
        this.unschedule(this.updateThrowSattus);
    },

    registerAllEvents: function () {
        // 游戏开始
        qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
        // 游戏结束
        qp.event.listen(this, 'mjGameResult', this.onGameResult.bind(this));
        // 玩家离线
        qp.event.listen(this, 'mjPlayerOffLine', this.onLine.bind(this));
        // 玩家语音
        qp.event.listen(this, 'imPlayVoice', this.onPlaySpeak.bind(this));
        // 玩家牌数变化
        qp.event.listen(this, 'playerPainum', this.onPlayerPaiNum.bind(this));
    },

    onLine: function (data) {
        if (data['uid'] == this.uid) {
            JJLog.print(JSON.stringify(data));
            var status = data['status'];
            this.img_offline.setVisible(status == 1);
        }

    },

    onPlayerPaiNum: function (data) {
        if (data['uid'] == this.uid) {
            JJLog.print(JSON.stringify(data));
            this.setRemainPaiNum(data['painum']);
        }
    },

    onPlaySpeak: function (data) {
        JJLog.print('on play speak imPlayVoice');//{speaker: xxx, state: 0} 0: start 1: end -1: error
        JJLog.print(JSON.stringify(data));
        if (!this.sprite_speaker || this.sprite_speaker == undefined || this.sprite_speaker == null) {
            return;
        }
        if (0 == data['state']) {
            if (!!data['speaker'] && data['speaker'] == hall.AppNameID + this.uid) {
                this.sprite_speaker.setVisible(true);
            } else {
                this.sprite_speaker.setVisible(false);
            }
        } else {
            this.sprite_speaker.setVisible(false);
        }

    },

    removeAllEvents: function () {
        qp.event.stop(this, 'playerPainum');
        qp.event.stop(this, 'mjGameStart');
        qp.event.stop(this, 'mjGameResult');
        qp.event.stop(this, 'mjPlayerOffLine');
        qp.event.stop(this, 'imPlayVoice');
    },

    onGameStart: function (data) {
        this.setRemainPaiNum(XYGLogic.Instance.mode);
    },

    onGameResult: function (data) {
        var players = data['players'];
        for (var i = 0; i < players.length; i++) {
            var info = players[i];
            if (this.uid == info['uid']) {
                this.text_score.setString(info["coinNum"]);
                break;
            }
        }
    },

    setBanker: function (isBanker) {
        this.sprite_banker.setVisible(isBanker);
    },

    setOffline: function (isOffline) {
        this.img_offline.setVisible(isOffline);
    },
    // 设置剩余牌数
    setRemainPaiNum: function (paiNum) {
        if (paiNum < 0) {
            // this.text_painum.setVisible(false);
            this.sprite_one.setVisible(false);
            return;
        }
        // this.text_painum.setString(paiNum+"张");
        // if((!!XYGLogic.Instance && XYGLogic.Instance.showNum == 1) || (!!poker.record && PDKPoker.record.showNum == 1))
        // {
        //     this.text_painum.setVisible(true);
        // }else
        // {
        //     this.text_painum.setVisible(false);
        // }

        this.sprite_one.setVisible(paiNum == 1);
    },

    showFace: function (index) {
        if (index > 0 && index < 19) {

            XYGLogic.Instance.addSpriteFrames("res/Common/emoji.plist");
            var len = [0, 2, 9, 8, 2, 2, 8, 6, 9, 3, 4, 2, 9, 7, 14, 5, 2, 3, 2];
            var face = new cc.Sprite('#' + "emoji_" + index + "-obj-1.png");
            face.setVisible(true);

            var posText = this.sprite_face.getParent().convertToWorldSpace(this.sprite_face.getPosition());
            var scene = cc.director.getRunningScene();
            face.setPosition(posText);
            if (scene.getChildByTag(1003) != null) scene.removeChildByTag(1003, true);
            if (scene.getChildByTag(998) != null) scene.removeChildByTag(998, true);
            scene.addChild(face, 1002, 1003);
            face.stopAllActions();

            var animFrames = [];
            var str = "";
            var frame;
            for (var i = 1; i <= len[index]; i++) {
                str = "emoji_" + index + "-obj-" + i + ".png";
                frame = cc.spriteFrameCache.getSpriteFrame(str);
                animFrames.push(frame);
            }
            var anim = new cc.Animation(animFrames, 0.2);
            var times = len[index] > 4 ? 1 : 3;
            face.runAction(cc.sequence(cc.animate(anim).repeat(times), cc.removeSelf()));
        }
    },

    showMsg: function (index, content) {
        var str = null;
        var sexType = this.playerData.userSex;
        if (sexType == undefined || sexType == null || sexType == 2) {
            sexType = 2;
        } else {
            sexType = 1;
        }
        var chat_cfg = hall.getPlayingGame().getChatCfg()[sexType];
        if (content) {
            str = content;
        }
        else {
            if (chat_cfg[index]) {
                str = chat_cfg[index];
                var soundData = {};
                soundData['userSex'] = sexType;
                soundData['index'] = index + 1;
                sound.playDBPokerMsg(soundData);
            }
        }
        if (str) {

            this.text_msg.setString(str);
            this.text_msg.stopAllActions();
            this.text_msg.setVisible(false);
            this.text_msg.setOpacity(255);
            //this.text_msg.runAction(cc.sequence(cc.delayTime(4),cc.fadeOut(0.5)));
            var size = this.text_msg.getAutoRenderSize().width < this.text_msg.getContentSize().width ? this.text_msg.getAutoRenderSize().width + 55 : this.text_msg.getContentSize().width + 45;
            // this.text_msg.ignoreContentAdaptWithSize(true);
            this.sprite_msg.setContentSize(cc.size(size, this.sprite_msg.getContentSize().height));
            this.sprite_msg.stopAllActions();
            this.sprite_msg.setVisible(false);
            this.sprite_msg.setOpacity(255);
            this.sprite_msg.setScale(1.0);
            //this.sprite_msg.runAction(cc.sequence(cc.delayTime(4),cc.fadeOut(0.5)));


            var text = this.text_msg.clone();
            text.setVisible(true);
            var posText = this.text_msg.getParent().convertToWorldSpace(this.text_msg);
            var image_msg = this.sprite_msg.clone();
            image_msg.setVisible(true);
            var posImage = this.sprite_msg.getParent().convertToWorldSpace(this.sprite_msg);
            var scene = cc.director.getRunningScene();

            if (scene.getChildByTag(1003) != null) scene.removeChildByTag(1003, true);
            if (scene.getChildByTag(998) != null) scene.removeChildByTag(998, true);

            scene.addChild(text, 1002, 1003);
            text.setPosition(posText);
            scene.addChild(image_msg, 999, 998);
            image_msg.setPosition(posImage);


            text.setString(str);
            text.stopAllActions();
            text.setVisible(true);
            text.setOpacity(255);
            text.runAction(cc.sequence(cc.delayTime(4), cc.fadeOut(0.5), cc.removeSelf()));
            var size = text.getAutoRenderSize().width < this.text_msg.getContentSize().width ? this.text_msg.getAutoRenderSize().width + 55 : this.text_msg.getContentSize().width + 45;
            // this.text_msg.ignoreContentAdaptWithSize(true);
            image_msg.setContentSize(cc.size(size, this.sprite_msg.getContentSize().height));
            image_msg.stopAllActions();
            image_msg.setVisible(true);
            image_msg.setOpacity(255);
            image_msg.setScale(1.0);
            image_msg.runAction(cc.sequence(cc.delayTime(4), cc.fadeOut(0.5), cc.removeSelf()));


        }
    },

    releaseAllItem: function () {
        this.playerData = null;
        this.text_name = null;
        this.text_score = null;
        this.panel_root = null;
        this.text_msg_left = null;
        this.text_msg_right = null;
        this.uid = null;
        this.sprite_banker = null;
        this.img_offline = null;
        this.sprite_head = null;
        this.sprite_msg_right = null;
        this.sprite_msg_left = null;
        this.sprite_msg = null;
        this.text_msg = null;
        this.sprite_face = null;
        this.playerData = null;
        this.playerData = null;
        this.playerData = null;
        this.playerData = null;
        this.text_painum = null;
    },

});