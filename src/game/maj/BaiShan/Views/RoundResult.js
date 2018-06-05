/**
 * Created by atom on 2016/8/21.
 */
MJBaiShan.RoundResult = cc.Layer.extend({

    listview_result: null,
    btn_start: null,
    panel_cell: null,
    room: null,
    img_result_title: null,
    btn_end_report: null,
    isLiuJu: false,
    ctor: function (data, jRoom) {
        this._super();
        this.room = jRoom;
        var root = util.LoadUI(MJBaiShan.RES.RoundResult).node;
        this.mLogic = XYGLogic.table;
        if(MajhongInfo.GameMode == GameMode.RECORD){
            this.mLogic = XYGLogic.record;
        }

        this.addChild(root);
        this.m_root = root;
        this.img_result_title = ccui.helper.seekWidgetByName(root, "img_result_title");
        this.listview_result = ccui.helper.seekWidgetByName(root, "listview_result");
        this.panel_cell = ccui.helper.seekWidgetByName(root, "panel_cell");
        this.panel_cell.setVisible(false);
        this.btn_start = ccui.helper.seekWidgetByName(root, "btn_start");

        this.btn_start.addClickEventListener(function () {
            // this.room.showReady();
            XYGLogic.table.ready(function (data) {

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

            var endReport = new MJBaiShan.EndResult();
            var scene = new cc.Scene();
            scene.addChild(endReport);
            if (cc.sys.isNative) {
                cc.director.replaceScene(scene);
            } else {
                cc.director.runScene(scene);
            }
        }.bind(this));

        this.isLiuJu = false;
        if (data['roundResult'] == 0) {
            this.isLiuJu = true;
            sound.playMusic('res/sound/common/audio_liuju.mp3');
        }

        if (data['isOver'] == 0) {
            this.btn_start.setVisible(true);
            this.btn_end_report.setVisible(false);
        } else if (data['isOver'] == 1) {
            this.btn_start.setVisible(false);
            this.btn_end_report.setVisible(true);
        }

        if (data['roundResult'] == 0) {
            // this.img_result_title.loadTexture('res/Game/Maj/XueZhan/Resoures/table/result_12.png', ccui.Widget.LOCAL_TEXTURE);
            sound.playMusic('res/audio/effect/audio_liuju.mp3');
        }

        // var text_bird = ccui.helper.seekWidgetByName(root, "text_bird");
        // var str = this.mLogic.getTableDes();

        // text_bird.setString(str);


        // var txt_round = ccui.helper.seekWidgetByName(root, "txt_round");
        // txt_round.string = (data.roundsNum || "") + "/" + (data.roundsTotal || "") + "局";

        if(MajhongInfo.GameMode == GameMode.RECORD){
            util.ForeverVisibleNode(this.btn_end_report , false);
            util.ForeverVisibleNode(this.btn_start , false);

            this.btnBack = ccui.helper.seekWidgetByName(root, "btn_back");
            this.btnBack.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));
            this.btnBack.setVisible(true);

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

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'mjReadyStatus', this.onReadyStatus.bind(this));
    },
    onExit: function () {
        qp.event.stop(this, 'mjReadyStatus');
        this._super();

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

    onReadyStatus: function (data) {
		var status = data['readyStatus'];//0,1
        var uid = data['uid'];
        
        if(uid === hall.user.uid){
            // this.room.showReady();
            this.removeFromParent();
        }
    },

    initList: function (data) {
        JJLog.print("结算=" + JSON.stringify(data));
        var bankerId = data['oldBanker'];

        var players = data['players'];
        for (var i = 0; i < players.length; i++) {
            var info = players[i];
            if(hall.songshen == 1){
                info.nickName = info.uid;
            }
            if (data['roundResult'] != 0 && hall.user.uid == info['uid']) {
                if (info['winScore'] >= 0 ) {
                    // this.img_result_title.loadTexture('res/Game/Maj/XueZhan/Resoures/table/result_6.png', ccui.Widget.LOCAL_TEXTURE);
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
            var sprite_head =  ccui.helper.seekWidgetByName(cell, "sprite_head");
            util.ChangeloadHead(cell,info['equip']);
            util.LoadHead(sprite_head , info.headUrl);
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
        var img_ting = ccui.helper.seekWidgetByName(cell, "img_ting");
        img_ting.setVisible(info['baoTing']);
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
        pos[info.position].setVisible(true);


        var img_bankerCount = ccui.helper.seekWidgetByName(cell, "img_bankerCount");
        img_bankerCount.setVisible(false);
        var Atlas_bankerCount = ccui.helper.seekWidgetByName(cell, "Atlas_bankerCount");

        var image_bank = ccui.helper.seekWidgetByName(cell, "image_bank");
        var sprite_bankerCount = ccui.helper.seekWidgetByName(cell, "sprite_bankerCount");
        sprite_bankerCount.setVisible(false);
        var text_bankerCount = ccui.helper.seekWidgetByName(cell, "text_bankerCount");
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

        var image_zimo = ccui.helper.seekWidgetByName(cell, "image_zimo");
        image_zimo.setVisible(false);
        var image_fangqiang = ccui.helper.seekWidgetByName(cell, "image_fangqiang");
        image_fangqiang.setVisible(false);
        var image_hu = ccui.helper.seekWidgetByName(cell, "image_hu");
        image_hu.setVisible(false);
        var image_liuju = ccui.helper.seekWidgetByName(cell, "image_liuju");
        image_liuju.setVisible(this.isLiuJu);

        var text_gang_score = ccui.helper.seekWidgetByName(cell, "text_gang_score");
        var text_hu_score = ccui.helper.seekWidgetByName(cell, "text_hu_score");
        var text_score = ccui.helper.seekWidgetByName(cell, "text_score");
        var scoreTitle = "积分";

        if(this.mLogic && this.mLogic.isGold === 1){
            scoreTitle = "金币";
        }
        if(info.winScore >= 0){
            text_score.setString( "+" + info.winScore );
            text_score.setTextColor(cc.color(29, 153, 0, 255));
        }else{
            text_score.setString( info.winScore );
            text_score.setTextColor(cc.color(255, 0, 0, 255));
        }


        if(info.gangScore >= 0){
            text_gang_score.setString( '杠分' + "+" + info.gangScore );
        }else{
            text_gang_score.setString( '杠分' + info.gangScore );
        }
        text_gang_score.setTextColor(cc.color(197, 96, 35, 255));
        if(info.huScore >= 0){
            text_hu_score.setString( '胡分' + "+" + info.huScore );
        }else{
            text_hu_score.setString( '胡分' + info.huScore );
        }
        text_hu_score.setTextColor(cc.color(197, 96, 35, 255));


        var text_win_type = ccui.helper.seekWidgetByName(cell, "text_win_type");
        text_win_type.setString("");

        //胡牌
        var huStr = "";
        if (info["isHu"] > 0) {
            if (info.isZimo == 1) {
                image_zimo.setVisible(true);
                image_hu.setVisible(false);
                huStr += "自摸 ";
            } else if (info.isZimo == 0) {
                image_zimo.setVisible(false);
                image_hu.setVisible(true);
            }
            var huArr = new Array();
            if (info['huType'].length > 0) {
                for (var b = 0; b < info['huType'].length; b++) {
                    huStr += (MJBaiShanHuWord[info['huType'][b]['type']]) + " ";
                }
            }
        }
        else {
            if (info['isFangPao'] > 0) {
                image_fangqiang.setVisible(true);
            }
        }

        MJDrawHuLineCardTip(info, panel_f, panel_card);

        if (huStr.length > 0) {
            text_win_type.setString(huStr);
            text_win_type.setVisible(true);
        }

        var sprite_head = ccui.helper.seekWidgetByName(cell, "sprite_head");
        util.LoadHead(sprite_head, info.headUrl);
    },

    showResult: function () {
        this.setVisible(false);
        cc.director.getRunningScene().addChild(this, 900);
        this.runAction(cc.sequence(cc.delayTime(1.0), cc.show()));
    },


});
