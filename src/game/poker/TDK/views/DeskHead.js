
var TDKDeskHead = cc.Layer.extend({
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
    img_chipin: null,
    text_chipin: null,
    isPutout: false,
    image_watch: null,
    enableThrow:null,
    enableVibrate:true,
    ctor: function (data) {
        this._super();
        this.playerData = data;
        this.uid = data["uid"];
        var root = util.LoadUI(TDKJson.Head).node;
        this.addChild(root);
        this.enableThrow = true;
        this.enableVibrate = true;
        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");

        this.panel_root.addClickEventListener(function () {
            data.enableThrow = this.enableThrow;
            this.enableThrow = false;
            var dialog = new GamePlayerInfoDialog(data);
            dialog.showDialog();
        }.bind(this));

        this.setContentSize(this.panel_root.getContentSize());
        this.text_score = ccui.helper.seekWidgetByName(root, "text_score");
        
        this.sprite_speaker = ccui.helper.seekWidgetByName(root, "sprite_speaker");
        this.sprite_speaker.setVisible(false);
        
        // this.img_offline = ccui.helper.seekWidgetByName(root, "img_offline");
        // var status = data['isOffLine'];
        // this.img_offline.setVisible(status == 1);

        this.showScore(this.playerData["coinNum"])

        this.text_name = ccui.helper.seekWidgetByName(root, "text_name");
        var str = this.playerData["nickName"];
        if (str.length > 15) {
            str = str.slice(0, 15);
        }
        var name = cutStringLenght(this.playerData['nickName']);
        this.text_name.setString(name);
        this.sprite_head = ccui.helper.seekWidgetByName(root, "sprite_head");
        // this.image_watch = ccui.helper.seekWidgetByName(root, "image_watch");
        // this.image_watch.setVisible(false);
        // var image_new = ccui.helper.seekWidgetByName(root, "image_new");
        // if (data['playedTime'] < 50) {
        //     image_new.setVisible(true);
        //     image_new.runAction(cc.sequence(cc.scaleTo(0.3, 0.7), cc.scaleTo(0.3, 0.9)).repeatForever());
        // }

        util.ChangeloadHead(root,this.playerData['equip']);
        if (this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
            util.LoadHead(this.sprite_head, this.playerData.headUrl);
        }
        
        // this.sprite_banker = ccui.helper.seekWidgetByName(root, "sprite_banker");
        // this.sprite_banker.setVisible(false);

        this.sprite_face = ccui.helper.seekWidgetByName(root, "sprite_face");
        this.sprite_face.setVisible(false);
        this.text_msg_left = ccui.helper.seekWidgetByName(root, "text_msg_left");
        this.text_msg_right = ccui.helper.seekWidgetByName(root, "text_msg_right");
        this.sprite_msg_left = ccui.helper.seekWidgetByName(root, "sprite_msg_left");
        this.sprite_msg_right = ccui.helper.seekWidgetByName(root, "sprite_msg_right");

        this.sprite_msg_left.setVisible(false);
        this.sprite_msg_right.setVisible(false);
        this.text_msg_right.setVisible(false);
        this.text_msg_left.setVisible(false);
        this.text_msg = this.text_msg_left;
        this.sprite_msg = this.sprite_msg_left;

        this.img_chipin = ccui.helper.seekWidgetByName(root, "img_chipin");
        this.text_chipin = ccui.helper.seekWidgetByName(root, "text_chipin");
        this.img_chipin.setVisible(false);

        if (this.uid > 999999 && SSSPoker.table.shuangJiang == 1)
            this.panel_root.setTouchEnabled(false);

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
            this.sprite_speaker.setFlippedX(true);
            // this.sprite_head.setFlippedX(true);

            // this.sprite_banker.x = size.width - 15;

            // this.btn_throw.x = size.width + 43;
            // this.img_offline.x = 30;
            
            this.isRight = true;
            this.text_msg = this.text_msg_right;
            // this.sprite_face.x = size.width + 34;
            this.sprite_msg = this.sprite_msg_right;

        }
        //this.sprite_speaker.setVisible(true);
    },

    onExit: function () {
        this.removeAllEvents();
        this.releaseAllItem();
        this._super();
        this.unschedule(this.updateThrowSattus);
    },

    cancelWatch: function () {
        this.image_watch.setVisible(false);
    },


    registerAllEvents: function () {
        //qp.event.listen(this, 'mjBankerResult', this.onBankerResult);
        qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
        qp.event.listen(this, 'mjGameResult', this.onGameResult.bind(this));
        qp.event.listen(this, 'mjPlayerOffLine', this.onLine.bind(this));
        qp.event.listen(this, 'imPlayVoice', this.onPlaySpeak.bind(this));
        qp.event.listen(this, 'mjThrowStatus', this.onGamethorw.bind(this));
        qp.event.listen(this, 'pkChipInStatus', this.onPkChipInStatus.bind(this));   //同步每个人下注信息
        //mjPlayerOffLine
    },
    removeAllEvents: function () {
        //qp.event.stop(this, 'mjBankerResult');
        qp.event.stop(this, 'mjGameStart');
        qp.event.stop(this, 'mjGameResult');
        qp.event.stop(this, 'mjPlayerOffLine');
        qp.event.stop(this, 'imPlayVoice');
        qp.event.stop(this, 'mjThrowStatus');
        qp.event.stop(this, 'pkChipInStatus');
    },

    onLine: function (data) {
        if (data['uid'] == this.uid) {
            JJLog.print(JSON.stringify(data));
            var status = data['status'];
            // this.img_offline.setVisible(status == 1);
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
            if (!!data['speaker'] && data['speaker'] == hall.AppNameID + this.uid) {
                this.sprite_speaker.setVisible(true);
            } else {
                this.sprite_speaker.setVisible(false);
            }
        } else {
            this.sprite_speaker.setVisible(false);
        }

    },

    onGameStart: function (data) {
        JJLog.print(JSON.stringify(data));
        this.onBankerResult(data);
    },

    onGameResult: function (data) {
        var players = data['players'];
        this.isPutout = false;
        var delay = 1.5;

        this.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.callFunc(function () {
                for (var i = 0; i < players.length; i++) {

                    var info = players[i];
                    if (this.uid == info['uid']) {
                        //  this.text_score.setString(info["coinNum"]);
                        this.showScore(info['coinNum']);
                        break;
                    }
                }

            }.bind(this))
        ));

    },

    showScore: function (num) {
        this.text_score.setString(util.convertScore(num));
    },

    onGamethorw: function (data) {
        if (data['targetUid'] == this.uid) {
            var throwType = data['throwType'];
            if (throwType == 0) {
                if (this.uid == hall.user.uid) {
                    if (cc.sys.isNative) {
                        cc.Device.vibrate(0.4);
                    }
                }
            }
        }
    },
    onPkChipInStatus: function (data) {
        JJLog.print('通知每个人下注信息=' + JSON.stringify(data));
        if (data['uid'] == this.uid) {
            this.img_chipin.setVisible(true);
            this.text_chipin.setString(data['bei']);
        }
    },

    showPkChipInStatus: function (isshow) {
        this.img_chipin.setVisible(isshow);
    },

    setBanker: function (isBanker) {
        // this.sprite_banker.setVisible(isBanker);
    },

    setBankerCount: function (data) {
        //var count = data["bankerCount"];
        //if(count > 1)
        //{
        //    this.sprite_bankerCount.setVisible(this.uid == data['banker']);
        //    this.text_bankerCount.setString(count);
        //}
    },

    setchipinCount: function (count) {
        if (count > 0) {
            this.img_chipin.setVisible(true);
            this.text_chipin.setString(count);
        }
    },
    setOffline: function (isOffline) {
        // this.img_offline.setVisible(isOffline);
    },

    onBankerResult: function (data) {
        // if (data["banker"] == this.uid) {
        //     this.sprite_banker.setVisible(true);
        // } else {
        //     this.sprite_banker.setVisible(false);
        // }
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

    // showFace:function(index)
    // {
    //     if(index>0 && index < 64)
    //     {
    //         // this.sprite_face.loadTexture("im"+index+".png",ccui.Widget.PLIST_TEXTURE);
    //         // this.sprite_face.stopAllActions();
    //         // this.sprite_face.setVisible(false);
    //         // this.sprite_face.setOpacity(255);
    //         // this.sprite_face.setScale(1.0);
    //
    //         var emojiPath = EMOJIRES[index];
    //         var faceAni = util.playTimeLineAnimation(emojiPath,false);//this.sprite_face.clone();
    //
    //         var duration = faceAni.time/60;
    //         faceAni.setVisible(true);
    //         var posText = this.sprite_face.getParent().convertToWorldSpace(this.sprite_face.getPosition());
    //         var scene = cc.director.getRunningScene();
    //         faceAni.setPosition(posText);
    //         if(scene.getChildByTag(1003) != null) scene.removeChildByTag(1003,true);
    //         if(scene.getChildByTag(998) != null) scene.removeChildByTag(998,true);
    //
    //         scene.addChild(faceAni,1002,1003);
    //        // face.stopAllActions();
    //         faceAni.setOpacity(255);
    //         // face.setScale(1.0);
    //         // face.runAction(cc.sequence(
    //         //     cc.scaleTo(0.15,1.3),cc.scaleTo(0.1,1.1),cc.scaleTo(0.15,1.2),cc.scaleTo(0.1,1.0),
    //         //     cc.delayTime(2),cc.fadeOut(0.5)
    //         //     ,cc.removeSelf()
    //         // ));
    //
    //         faceAni.runAction(cc.sequence(
    //             cc.delayTime(duration),cc.fadeOut(0.5)
    //             ,cc.removeSelf()
    //         ));
    //
    //     }
    // },

    showMsg: function (index, content) {
        var str = null;
        var sexType = this.playerData.userSex;
        if (sexType == undefined || sexType == 2) {
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

    setGoldCount: function (num) {
        // this.text_score.setString(num);
        this.showScore(num);
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
