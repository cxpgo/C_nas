/**
 * Created by atom on 2016/8/21.
 */
var XueZhanRoundResult = cc.Layer.extend({

    listview_result: null,
    btn_start: null,
    panel_cell: null,
    img_result_title: null,
    btn_end_report: null,
    ctor: function (data) {
        this._super();

        var root = util.LoadUI(MJBaseRes.RoundResult).node;
        this.mLogic = XYGLogic.table;
        if(MajhongInfo.GameMode == GameMode.RECORD){
            this.mLogic = XYGLogic.record;
        }

        this.addChild(root);
        this.img_result_title = ccui.helper.seekWidgetByName(root, "img_result_title");
        this.listview_result = ccui.helper.seekWidgetByName(root, "listview_result");
        this.panel_cell = ccui.helper.seekWidgetByName(root, "panel_cell_xuezhan");
        var panel_cell_other = ccui.helper.seekWidgetByName(root, "panel_cell");
        panel_cell_other.setVisible(false);
        this.panel_cell.setVisible(false);
        this.btn_start = ccui.helper.seekWidgetByName(root, "btn_start");

        this.btn_start.addClickEventListener(function () {
            // this.room.showReady();
            
            this.removeFromParent();
            XYGLogic.table.ready(function (data) {
                //_this.btn_ready.setVisible(false);
            });
        }.bind(this));

        var btn_share = ccui.helper.seekWidgetByName(root, "btn_share");
        btn_share.addClickEventListener(function () {
            hall.net.wxShareScreen(0);
        });

        this.btn_end_report = ccui.helper.seekWidgetByName(root, "btn_end_report");
        this.btn_end_report.addClickEventListener(function () {
            this.removeFromParent();

            var endReport = new XueZhanEndResult();
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
            // this.img_result_title.loadTexture('res/Game/Maj/XueZhan/Resoures/table/result_12.png', ccui.Widget.LOCAL_TEXTURE);
            this.isLiuJu = true;
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

    onReadyStatus: function (data) {
		var status = data['readyStatus'];//0,1
        var uid = data['uid'];
        
        if(uid === hall.user.uid){
            // this.room.showReady();
            this.removeFromParent();
            XYGLogic.table.ready(function (data) {
                //_this.btn_ready.setVisible(false);
            });
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

            var img_fangzhu = ccui.helper.seekWidgetByName(cell, "img_fangzhu");
            if(data['fangZhu'] == info['uid'])
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
                var bankerCount = data['bankerCount'];
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
            var text_name = ccui.helper.seekWidgetByName(cell, "text_name");
            var name = base64.decode(info['nickName']);
            if (name.length > 4) {
                name = name.slice(0, 4);
                name += '..';
            }
            cell.x = 0;
            cell.y = 0;
            text_name.setString(name);


            var panel_card = ccui.helper.seekWidgetByName(cell, "panel_card");
            panel_card.setScale(0.89);

            var text_fan = ccui.helper.seekWidgetByName(cell, "text_fan");
            text_fan.setVisible(false);

            var panel_f = ccui.helper.seekWidgetByName(cell, "panel_peng");
            panel_f.setVisible(false);

            var text_score = ccui.helper.seekWidgetByName(cell, "text_score");
            var scoreTitle = "积分";
            
            if(this.mLogic && this.mLogic.isGold === 1){
                scoreTitle = "金币";
            }
            if(info.winScore >= 0){
                text_score.setString( scoreTitle + "+" + info.winScore );
                text_score.setTextColor(cc.color(29, 153, 0, 255));
            }else{
                text_score.setString( scoreTitle + info.winScore );
                text_score.setTextColor(cc.color(255, 0, 0, 255));
            }
            
            var text_hu = ccui.helper.seekWidgetByName(cell, "text_hu");
            text_hu.setVisible(false);

            var text_win_type = ccui.helper.seekWidgetByName(cell, "text_win_type");
            text_win_type.setString("");
            if (info['isHu'] > 0) {
                text_fan.setString(info['fanScore'] + "番");
                text_fan.setVisible(true);
                text_hu.setString(info['huOrder'] + "胡");
                text_hu.setVisible(true);
            }
            else {

            }

            var posNextX = 0;

            var qiangGangPais = info['qiangGangPai'] || [];
            var _searchQGCard = function (cardData) {
                for (var index = 0; index < qiangGangPais.length; index++) {
                    var e = qiangGangPais[index];
                    if (e.type == cardData.type && e.value === cardData.value) {
                        return true;
                    }
                }
                return false;
            }
            //吃碰杠
            var funcArr = info['paiDest']
            for (var k = 0; k < funcArr.length; k++) {
                var funcInfo = funcArr[k];
                var funcType = funcInfo['type'];

                var panelC = panel_f.clone();
                panelC.setVisible(true);
                switch (funcType) {
                    case OPERATIONNAME.GANG:
                        {
                            var cardObj = funcInfo['pai'];
                            for (var a = 0; a < 4; a++) {
                                var card = MJCardTip.create3D(cardObj);
                                var width = card.getContentSize().width;
                                card.x = (width - 3) * a;
                                if (a == 3) {
                                    card.x = (width - 3) * 1;
                                    card.y = 10;
                                } else {
                                    if (funcInfo.origin == OPER_GANG_TYPE.GANG_AN) card.SetBack();
                                    card.x = (width - 3) * a;
                                    card.y = 0;
                                }
                                panelC.addChild(card, a);
                            }
                        }
                        break;
                    case OPERATIONNAME.BUZHANG:
                        {
                            var cardObj = funcInfo['pai'];
                            for (var a = 0; a < 4; a++) {
                                var card = MJCardTip.create3D(cardObj);
                                var width = card.getContentSize().width;
                                card.x = (width - 3) * a;
                                if (a == 3) {
                                    card.x = (width - 3) * 1;
                                    card.y = 22;
                                } else {
                                    card.x = (width - 3) * a;
                                    card.y = 0;
                                }
                                panelC.addChild(card, a);
                            }
                        }
                        break;
                    case OPERATIONNAME.PENG:
                        {
                            var cardObj = funcInfo['pai'];
                            for (var a = 0; a < 3; a++) {
                                var card = MJCardTip.create3D(cardObj);
                                var width = card.getContentSize().width;
                                card.x = (width - 3) * a;
                                card.y = 0;
                                panelC.addChild(card, a);
                            }
                            if( _searchQGCard(cardObj) ){
                                var card = MJCardTip.create3D(cardObj);
                                card.x = (width - 3) * 1;
                                card.y = 12;
                                card.showGray();
                                panelC.addChild(card, 3);
                            }
                        }
                        break;
                    case OPERATIONNAME.CHI:
                        {
                            var cardArr = funcInfo['pai'];
                            for (var a = 0; a < cardArr.length; a++) {
                                var card = MJCardTip.create3D(cardArr[a]);
                                var width = card.getContentSize().width;
                                card.x = (width - 3) * a;
                                card.y = 0;
                                panelC.addChild(card, a);
                            }
                        }
                        break;
                }
                panelC.setScale(XueZhanCommonParam.ResultCardScale);
                panelC.x = posNextX;
                panelC.y = 0;
                panel_card.addChild(panelC, 0);
                posNextX = posNextX + panelC.getContentSize().width * panel_card.getScale();
            }

            var index = 0;
            //手牌
            for (var typeTag in info['qiPai']) {
                var arr = info['qiPai'][typeTag];
                for (var j = 0; j < arr.length; j++) {
                    var obj = arr[j];
                    var cardShow = MJCardTip.create3D(obj);
                    cardShow.setScale(XueZhanCommonParam.ResultCardScale);
                    cardShow.setAnchorPoint(0, 0);
                    var width = cardShow.getContentSize().width;
                    cardShow.setPosition(posNextX, 0);
                    posNextX = width * XueZhanCommonParam.ResultCardScale + posNextX;
                    panel_card.addChild(cardShow, index);
                    index++;
                }
            }


            //胡牌
            posNextX += 10;
            var huStr = "";
            if(info.isHuaZhu){
                huStr += "花猪 ";
            }

            if(info.beiChaJiao){
                huStr += "被查叫 ";
            }

            if(info.jieGang){
                huStr += "接杠*" + info.jieGang + " " ;
            }

            if(info.dianGang){
                huStr += "点杠*" + info.dianGang + " ";
            }

            if(info.tuiShui){
                huStr += "退税 ";
            }

            if(info.isHjzj){
                huStr += "呼叫转移 ";
            }

            if(info.chaJiao ){
                huStr += "有叫 ";
                if(typeof(info.youJiaoMaxType) != "undefined" && info.youJiaoMaxType != null ){
                    huStr += XueZhanHuWord[info.youJiaoMaxType] + " ";
                    text_fan.setString(info['fanScore'] + "番");
                    text_fan.setVisible(true);
                }
            }
            
            if (info["isHu"] > 0) {
                if(info.isZimo == 1){
                    huStr += "自摸 ";
                }else if(info.isZimo == 0) {

                }
                var huArr = new Array();
                if (info['huType'].length > 0) {
                    for (var b = 0; b < info['huType'].length; b++) {
                        huStr += (XueZhanHuWord[info['huType'][b]['type']]) + " ";
                        var paiInfoB = info['huType'][b]['pais'];
                        for (var c = 0; c < paiInfoB.length; c++) {
                            var added = false;
                            for (var d = 0; d < huArr.length; d++) {
                                var parS = paiInfoB[c];
                                var strS = parS['type'] + parS['value'];

                                var parT = huArr[d];
                                var strT = parT['type'] + parT['value'];
                                if (strS == strT) {
                                    added = true;
                                    break;
                                }
                            }
                            if (added) continue;

                            huArr.push(paiInfoB[c]);
                            var cardShow = MJCardTip.create3D(paiInfoB[c]);
                            cardShow.setScale(XueZhanCommonParam.ResultCardScale);
                            cardShow.setAnchorPoint(0, 0);
                            var width = cardShow.getContentSize().width;
                            cardShow.setPosition(posNextX, 0);
                            panel_card.addChild(cardShow, index);
                            posNextX = width * XueZhanCommonParam.ResultCardScale + posNextX;
                            var size3 = cardShow.getContentSize();
                            var huImg = new ccui.ImageView('hudejiaobiao1.png', ccui.Widget.PLIST_TEXTURE);
                            cardShow.addChild(huImg);
                            huImg.setPosition(size3.width - huImg.getContentSize().width * 0.5,
                                size3.height - huImg.getContentSize().height * 0.5);

                            index++;
                        }
                    }
                }
            }

            
            if(info.isFangPao){
                huStr += "点炮 ";
            }

            if(info.fangPaoToOrder && info.fangPaoToOrder.length > 0) {
                info.fangPaoToOrder.forEach(function(huOD) {
                    huStr += "点" + huOD + "胡 ";
                }, this);
            }

            if (huStr.length > 0) {
                text_win_type.setString(huStr);
                text_win_type.setVisible(true);
            }

            layout.addChild(cell);
            cell.setVisible(true);
            if (info["isHu"] > 0) {
                this.listview_result.insertCustomItem(layout, 0);

            } else {
                this.listview_result.pushBackCustomItem(layout);
            }

            // var Image_bg = ccui.helper.seekWidgetByName(cell, "Image_bg");
            // var bgImgPath = "res/Game/Maj/XueZhan/Resoures/table/"/*+xx.png*/;
            // if(info['uid'] === hall.user.uid){
            //     bgImgPath += "result_10.png";
            // }else{
            //     bgImgPath += "result_9.png";
            // }
            // if(Image_bg) Image_bg.loadTexture(bgImgPath, ccui.Widget.LOCAL_TEXTURE);
            var sprite_head =  ccui.helper.seekWidgetByName(cell, "sprite_head");
            util.ChangeloadHead(cell,info['equip']);
            util.LoadHead(sprite_head , info.headUrl);
        }
    },

    showResult: function () {
        this.setVisible(false);
        cc.director.getRunningScene().addChild(this, 900);
        this.runAction(cc.sequence(cc.delayTime(1.0), cc.show()));
    },


});
