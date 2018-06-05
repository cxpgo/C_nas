MJDaAn.RoundResult = cc.Layer.extend({

    listview_result: null,
    btn_start: null,
    panel_cell: null,
    room: null,
    img_result_title: null,
    btn_end_report: null,
    ctor: function (data) {
        this._super();

        var root = util.LoadUI(MJDaAn.RES.RoundResult).node;
        this.mLogic = XYGLogic.table;
        if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.mLogic = XYGLogic.record;
        }

        this.addChild(root);
        this.m_root = root;
        this.img_result_title = ccui.helper.seekWidgetByName(root, "img_result_title");
        this.listview_result = ccui.helper.seekWidgetByName(root, "listview_result");
        this.panel_cell = ccui.helper.seekWidgetByName(root, "panel_cell");
        this.panel_cell.setVisible(false);
        this.btn_start = ccui.helper.seekWidgetByName(root, "btn_start");

        this.panel_baopai = ccui.helper.seekWidgetByName(root, "panel_baopai");

        this.btn_start.addClickEventListener(function () {
            // this.room.showReady();
            XYGLogic.table.ready(function (data) {
                //_this.btn_ready.setVisible(false);
            });
            this.removeFromParent();
        }.bind(this));
        var btn_share = ccui.helper.seekWidgetByName(root, "btn_share");
        btn_share.addClickEventListener(function () {
            hall.net.wxShareScreen(0);
        });

        this.btn_show = ccui.helper.seekWidgetByName(root,"btn_show");
        var act1 = cc.sequence(
            cc.moveBy(1, cc.p(25, 0)), // 1s 时间 x 右移 240 ，y 不变
            cc.moveBy(1, cc.p(-25, 0))
        );
        var act2 = act1.repeatForever();
        this.btn_show.runAction(act2);
        this.btn_hide = ccui.helper.seekWidgetByName(root,"btn_hide");

        var act3 = cc.sequence(
            cc.moveBy(1, cc.p(25, 0)), // 1s 时间 x 右移 240 ，y 不变
            cc.moveBy(1, cc.p(-25, 0))
        );
        var act4 = act3.repeatForever();
        this.btn_hide.runAction(act4);
        this.btn_show.addClickEventListener(this.showRoundResult.bind(this));
        this.btn_hide.addClickEventListener(this.hideRoundResult.bind(this));
        this.btn_show.setVisible(false);

        this.btn_end_report = ccui.helper.seekWidgetByName(root, "btn_end_report");
        this.btn_end_report.addClickEventListener(function () {
            this.removeFromParent();

            var endReport = new MJChangChun.EndResult();
            var scene = new cc.Scene();
            scene.addChild(endReport);
            if (cc.sys.isNative) {
                cc.director.replaceScene(scene);
            } else {
                cc.director.runScene(scene);
            }
        }.bind(this));

        if (data['isOver'] == 0) {
            this.btn_start.setVisible(true);
            this.btn_end_report.setVisible(false);
        } else if (data['isOver'] == 1) {
            this.btn_start.setVisible(false);
            this.btn_end_report.setVisible(true);
        }

        this.isLiuJu = false;
        if (data['roundResult'] == 0) {
            this.isLiuJu = true;
            sound.playMusic('res/audio/effect/audio_liuju.mp3');
        }
        if (MajhongInfo.GameMode == GameMode.RECORD) {
            util.ForeverVisibleNode(this.btn_end_report, false);
            util.ForeverVisibleNode(this.btn_start, false);

            this.btnBack = ccui.helper.seekWidgetByName(root, "btn_back");
            this.btnBack.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));
            this.btnBack.setVisible(true);
        }

        var baoPai = data['baoPai']
        if (baoPai != undefined) {
            if (baoPai['type']) {
                this.baoPaiKey = baoPai['type'] + baoPai['value'];
                this.addShowBaoPai(baoPai);
            } else {
                this.addShowBaoPai();
            }
        }
        this.initList(data);

        if (hall.songshen == 1) {
			util.NodesForeverVibleForParent(
                root, 
                [
                    "btn_share",
                ], 
                false
            );
		}
    },

    showRoundResult: function () {
        var root = ccui.helper.seekWidgetByName(this.m_root,"panel_root");
        root.setVisible(true);
        this.btn_show.setVisible(false);
    },
    hideRoundResult: function () {
        var root = ccui.helper.seekWidgetByName(this.m_root,"panel_root");
        root.setVisible(false);
        this.btn_show.setVisible(true);
    },

    addShowBaoPai: function (cardObj) {
        this.panel_baopai.removeAllChildren();
        if(cardObj){
            var card = MJCardTip.create3D(cardObj);
        }else{
            var card = MJCardTip.create3D();
            card.SetBack();
        }

        // card.setScale(0.78);
        this.panel_baopai.addChild(card);
        card.x = 0;
        card.y = 0;
        this.panel_baopai.parent.setVisible(true);
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'mjReadyStatus', this.onReadyStatus.bind(this));
    },
    onExit: function () {
        qp.event.stop(this, 'mjReadyStatus');
        this._super();

    },

    onReadyStatus: function (data) {
        var status = data['readyStatus'];//0,1
        var uid = data['uid'];

        if (uid === hall.user.uid) {
            this.removeFromParent();
        }
    },

    initList: function (data) {
        JJLog.print("结算=" + JSON.stringify(data));
        var players = data['players'];
        for (var i = 0; i < players.length; i++) {
            var info = players[i];
            if (hall.songshen == 1) {
                info.nickName = info.uid;
            }
            if (data['roundResult'] != 0 && hall.user.uid == info['uid']) {
                if (info['winScore'] >= 0) {
                    sound.playMusic('res/audio/effect/audio_win.mp3');
                } else {
                    sound.playMusic('res/audio/effect/audio_lose.mp3');
                }
            }

            var cell = this.panel_cell.clone();
            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());

            this._drawCellWithInfo(cell, info , data);

            cell.x = 0;
            cell.y = 0;
            layout.addChild(cell);
            cell.setVisible(true);
            if (info["isHu"] > 0) {
                this.listview_result.insertCustomItem(layout, 0);
            } else {
                this.listview_result.pushBackCustomItem(layout);
            }
        }
    },

    _drawCellWithInfo: function (cell, info , orgData) {
        var bankerId = orgData['oldBanker'];
        var bankerCount = orgData['bankerCount'];

        var img_fangzhu = ccui.helper.seekWidgetByName(cell, "img_fangzhu");
        if(orgData['fangZhu'] == info['uid'])
        {
            img_fangzhu.setVisible(true);
        }
        else
        {
            img_fangzhu.setVisible(false);
        }
        img_fangzhu.setVisible(false);
        var img_my_bg = ccui.helper.seekWidgetByName(cell, "img_my_bg");
        var img_he_bg = ccui.helper.seekWidgetByName(cell, "img_he_bg");
        if(info['uid'] == hall.user.uid)
        {
            img_my_bg.setVisible(true);
            img_he_bg.setVisible(false);
        }
        else
        {
            img_my_bg.setVisible(false);
            img_he_bg.setVisible(true);
        }
        var pos = [];
        for(var idx =0;idx<4;idx++)
        {
            var image_position = ccui.helper.seekWidgetByName(cell, "image_position_" + idx);
            image_position.setVisible(false);
            pos.push(image_position);
        }
        if(info.hasOwnProperty('position'))
            pos[info.position].setVisible(true);

        var img_bankerCount = ccui.helper.seekWidgetByName(cell, "img_bankerCount");
        img_bankerCount.setVisible(false);
        var Atlas_bankerCount = ccui.helper.seekWidgetByName(cell, "Atlas_bankerCount");
        var image_bank = ccui.helper.seekWidgetByName(cell, "image_bank");
        var sprite_bankerCount = ccui.helper.seekWidgetByName(cell, "sprite_bankerCount");
        sprite_bankerCount.setVisible(false);
        var text_bankerCount = ccui.helper.seekWidgetByName(cell, "text_bankerCount");
        var image_liuju = ccui.helper.seekWidgetByName(cell, "image_liuju");
        image_liuju.setVisible(this.isLiuJu);

        if (info['uid'] == bankerId) {
            image_bank.setVisible(true);
            if (bankerCount > 1) {
                // sprite_bankerCount.setVisible(true);
                img_bankerCount.setVisible(true);
                text_bankerCount.setString(bankerCount-1);
                Atlas_bankerCount.setString(bankerCount-1);
            } else {
                // sprite_bankerCount.setVisible(false);
                img_bankerCount.setVisible(false);
                text_bankerCount.setString("");
                Atlas_bankerCount.setString("");
            }
        } else {
            image_bank.setVisible(false);
        }
        var text_id = ccui.helper.seekWidgetByName(cell, "text_id");
        var text_name = ccui.helper.seekWidgetByName(cell, "text_name");
        var name = util.ShortName(info['nickName'], 4);
        text_name.setString(name);
        text_id.setString(info['uid']);

        var panel_card = ccui.helper.seekWidgetByName(cell, "panel_card");
        panel_card.setScale(0.89);

        var panel_f = ccui.helper.seekWidgetByName(cell, "panel_peng");
        panel_f.setVisible(false);

        var text_score = ccui.helper.seekWidgetByName(cell, "text_score");

        if (info.winScore >= 0) {
            text_score.setString("+" + info.winScore);
            text_score.setTextColor(cc.color(29, 153, 0, 255));
        } else {
            text_score.setString(info.winScore);
            text_score.setTextColor(cc.color(255, 0, 0, 255));
        }

        var text_fan = ccui.helper.seekWidgetByName(cell, "text_fan");
        // text_fan.string = (info.bigScore || 0) + "番";

        var text_gang = ccui.helper.seekWidgetByName(cell, "text_gang");
        // text_gang.string = info.dan + "杠";

        if(info.gangScore >= 0){
            text_gang.setString( '杠分' + "+" + info.gangScore );
        }else{
            text_gang.setString( '杠分' + info.gangScore );
        }
        text_gang.setTextColor(cc.color(197, 96, 35, 255));
        if(info.huScore >= 0){
            text_fan.setString( '胡分' + "+" + info.huScore );
        }else{
            text_fan.setString( '胡分' + info.huScore );
        }
        text_fan.setTextColor(cc.color(197, 96, 35, 255));

        var text_win_type = ccui.helper.seekWidgetByName(cell, "text_win_type");
        text_win_type.setString("");

        //胡牌
        var huStr = "";
        if (info["isHu"] > 0) {
            if(info.isZimo == 1){
                huStr += "自摸 ";
            }else if(info.isZimo == 0) {

            }

            var huArr = new Array();
            if (info['huType'].length > 0) {
                for (var b = 0; b < info['huType'].length; b++) {
                    huStr += (MJDaAnHuWord[info['huType'][b]['type']]) + " ";
                }
            }
        }else{//未胡牌
            if(info.isTing){
                huStr = "听牌 ";
            }
        }

        if(info.isFangPao){
            huStr += "点炮 ";
        }

        MJDrawHuLineCardTip(info, panel_f, panel_card);

        if (huStr.length > 0) {
            text_win_type.setString(huStr);
            text_win_type.setVisible(true);
        }

        var sprite_head = ccui.helper.seekWidgetByName(cell, "sprite_head");
        util.ChangeloadHead(cell,info['equip']);
        util.LoadHead(sprite_head, info.headUrl);
    },

    showResult: function () {
        this.setVisible(false);
        cc.director.getRunningScene().addChild(this, 900);
        this.runAction(cc.sequence(cc.delayTime(1.0), cc.show()));
    },
});
