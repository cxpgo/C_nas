/**
 * Created by atom on 2016/8/1.
 */
var DeskHead = cc.Layer.extend({
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
    sprite_head: null,
    sprite_msg_right: null,
    sprite_msg_left: null,
    sprite_msg: null,
    sprite_bankerCount: null,
    text_bankerCount: null,
    enableThrow:null,
    enableVibrate:true,
    ctor: function (data) {
        this._super();
        this.playerData = data;
        this.uid = data["uid"];
        var root = util.LoadUI(MJBaseRes.Head).node;
        this.addChild(root);

        cc.spriteFrameCache.addSpriteFrames('res/Game/Maj/Base/Resoures/head_light.plist');
        this.enableThrow = true;
        this.enableVibrate = true;
        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        this.sprite_headlight = ccui.helper.seekWidgetByName(root, "sprite_headlight");
        if (MajhongInfo.GameMode == GameMode.PLAY)
            this.panel_root.setTouchEnabled(true);
        this.panel_root.addClickEventListener(function () {
            data.enableThrow = this.enableThrow;
            this.enableThrow = false;
            var dialog = new GamePlayerInfoDialog(data);
            dialog.showDialog();
        }.bind(this));
        this.setContentSize(this.panel_root.getContentSize());
        this.img_fangzhu = ccui.helper.seekWidgetByName(root, "img_fangzhu");
        if(data['uid'] == XYGLogic.Instance.Data['fangZhu'])
        {
            this.img_fangzhu.setVisible(true);
        }
        else
        {
            this.img_fangzhu.setVisible(false);
        }
        this.img_fangzhu.setVisible(false);
        this.text_score = ccui.helper.seekWidgetByName(root, "text_score");
        this.img_offline = ccui.helper.seekWidgetByName(root, "img_offline");
        this.sprite_speaker = ccui.helper.seekWidgetByName(root, "sprite_speaker");
        this.sprite_speaker.setVisible(false);
        var status = data['isOffLine'];
        this.img_offline.setVisible(status == 1);
        this.text_score.setString(this.playerData["coinNum"]);
        this.text_name = ccui.helper.seekWidgetByName(root, "text_name");

        var _name = base64.decode(this.playerData["nickName"]);
        _name = cutStringLenght(_name);
        this.text_name.setString(_name);
        this.sprite_head = ccui.helper.seekWidgetByName(root, "sprite_head");
        util.ChangeloadHead(root,this.playerData['equip']);
        var _this = this;
        if (this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
            util.LoadHead(this.sprite_head,this.playerData.headUrl);
        }

        this.img_bankerCount = ccui.helper.seekWidgetByName(root, "img_bankerCount");
        this.img_bankerCount.setVisible(false);
        this.Atlas_bankerCount = ccui.helper.seekWidgetByName(this.img_bankerCount, "Atlas_bankerCount");

        this.sprite_banker = ccui.helper.seekWidgetByName(root, "sprite_banker");
        this.sprite_banker.setVisible(false);
        this.sprite_bankerCount = ccui.helper.seekWidgetByName(this.sprite_banker, "sprite_bankerCount");
        this.sprite_bankerCount.setVisible(false);
        this.text_bankerCount = ccui.helper.seekWidgetByName(this.sprite_bankerCount, "text_bankerCount");
        this.sprite_face = ccui.helper.seekWidgetByName(root, "sprite_face");
        this.sprite_face.setVisible(false);
        this.text_msg_left = ccui.helper.seekWidgetByName(root, "text_msg_left");
        this.text_msg_right = ccui.helper.seekWidgetByName(root, "text_msg_right");
        this.sprite_msg_left = ccui.helper.seekWidgetByName(root, "sprite_msg_left");
        this.sprite_msg_right = ccui.helper.seekWidgetByName(root, "sprite_msg_right");
        this.img_ting = ccui.helper.seekWidgetByName(root, "img_ting");
        this.img_ting.setVisible(false);

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

    onEnter: function () {
        this._super();
        this.registerAllEvents();

        var pos = this.panel_root.convertToWorldSpace(this.sprite_speaker.getPosition());

        var size = cc.director.getWinSize();
        if (pos.x < size.width * 0.5) {
            size = this.panel_root.getContentSize();
            this.sprite_speaker.x = size.width + this.sprite_speaker.getContentSize().width * 0.5 - 15;
            this.sprite_speaker.setFlippedY(true);
            this.sprite_head.setFlippedX(true);

            this.sprite_banker.x = size.width - 25;
            // this.img_ting.x = size.width - 199;
            this.img_offline.x = 35;
            this.isRight = true;
            this.text_msg = this.text_msg_right;
            this.sprite_face.x = size.width + 34;
            this.sprite_msg = this.sprite_msg_right;
        }
        else
        {
            this.img_ting.x = this.img_ting.x - 99;
        }
        //this.sprite_speaker.setVisible(true);
    },

    onExit: function () {
        this.removeAllEvents();
        this.releaseAllItem();
        this._super();

    },


    registerAllEvents: function () {
        qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
        qp.event.listen(this, 'mjGameResult', this.onGameResult.bind(this));
        qp.event.listen(this, 'mjPlayerOffLine', this.onLine.bind(this));
        qp.event.listen(this, 'imPlayVoice', this.onPlaySpeak.bind(this));
        qp.event.listen(this, 'mjSyncParams', this.onUpdateScore.bind(this));
        qp.event.listen(this, 'mjThrowStatus', this.onGamethorw.bind(this));
    },

    setHeadTingState:function (state) {
        this.img_ting.setVisible(state);
    },

    onUpdateScore: function (data) {
        JJLog.print("onUpdateScore" + JSON.stringify(data));
        if (data.coinNum != null && data.coinNum != undefined) {
            for (var i = 0; i < data.coinNum.length; i++) {
                if (data.coinNum[i].uid == this.uid) {
                    this.text_score.setString(data.coinNum[i].coinNum);
                    break;
                }
            }
        }
    },

    onGamethorw: function (data)
    {
        if(data['targetUid'] == this.uid)
        {
            var throwType = data['throwType'];
            if(throwType == 0)
            {
                if(this.uid ==hall.user.uid)
                {
                    if (cc.sys.isNative)
                    {
                        cc.Device.vibrate(0.4);
                    }
                }
            }
        }
    },

    Mocards_headlight:function (data) {
        if(cc.sys.isObjectValid(this.sp_ani1))
        {
            this.sp_ani1.removeFromParent();
        }
        this.runAnimation();
    },
    DelCards_headlight:function (data) {
        if(cc.sys.isObjectValid(this.sp_ani1))
            this.sp_ani1.removeFromParent();
    },
    runAnimation: function () {
        this.sp_ani1 = new cc.Sprite('#'+'01.png');
        this.sp_ani1.setAnchorPoint(0.5,0.5);
        this.sp_ani1.setScale(0.8);
        this.sp_ani1.setPosition(cc.p(60,60));
        this.sprite_headlight.addChild(this.sp_ani1);
        var animFrames = [];
        var str = "";
        var frame;
        for (var i = 1; i <= 15; i++) {
            if(i<10)
                str = "0" + i + ".png";
            else
                str =  i + ".png";
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var anim = new cc.Animation(animFrames, 0.1);
        this.sp_ani1.runAction(cc.repeatForever(cc.sequence(cc.animate(anim),cc.show())));
    },


    onLine: function (data) {
        if (data['uid'] == this.uid) {
            JJLog.print(JSON.stringify(data));
            var status = data['status'];
            this.img_offline.setVisible(status == 1);
        }

    },

    onPlaySpeak: function (data) {
        JJLog.print('on play speak imPlayVoice');//{speaker: xxx, state: 0} 0: start 1: end -1: error
        JJLog.print(JSON.stringify(data));
        if (!this.sprite_speaker || this.sprite_speaker == undefined || this.sprite_speaker == null) {
            //console.error("onPlaySpeak this.sprite_speaker = null??");
            return;
        }
        if (0 == data['state']) {
            if (!!data['speaker'] && data['speaker'] == hall.mainAPPName +GAMENAME + this.uid) {
                this.sprite_speaker.setVisible(true);
            } else {
                this.sprite_speaker.setVisible(false);
            }
        } else {
            this.sprite_speaker.setVisible(false);
        }

    },

    removeAllEvents: function () {
        qp.event.stop(this, 'mjGameStart');
        qp.event.stop(this, 'mjGameResult');
        qp.event.stop(this, 'mjPlayerOffLine');
        qp.event.stop(this, 'imPlayVoice');
        qp.event.stop(this, 'mySyncParams');
        qp.event.stop(this, 'mjThrowStatus');
    },

    onGameStart: function (data) {
        JJLog.print(JSON.stringify(data));
        this.onBankerResult(data);
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

    setBankerCount: function (data) {
        var count = data["bankerCount"];
        if (count > 1) {
            // this.sprite_bankerCount.setVisible(this.uid == data['banker']);
            this.img_bankerCount.setVisible(this.uid == data['banker']);
            // this.text_bankerCount.setString(count-1);
            this.Atlas_bankerCount.setVisible(true);
            this.Atlas_bankerCount.setString(count-1);
        }
    },

    setOffline: function (isOffline) {
        this.img_offline.setVisible(isOffline);
    },

    onBankerResult: function (data) {
        if (data["banker"] == this.uid) {
            this.sprite_banker.setVisible(true);
            var count = data["bankerCount"];
            if (count > 1) {
                // this.sprite_bankerCount.setVisible(true);
                this.img_bankerCount.setVisible(true);
                // this.text_bankerCount.setString(count-1);
                this.Atlas_bankerCount.setVisible(true);
                this.Atlas_bankerCount.setString(count-1);
            }
        } else {
            this.sprite_banker.setVisible(false);
            this.img_bankerCount.setVisible(false);
            // this.sprite_bankerCount.setVisible(false);
            this.Atlas_bankerCount.setVisible(false);
        }
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
                sound.playMsg(soundData);
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
    },

});