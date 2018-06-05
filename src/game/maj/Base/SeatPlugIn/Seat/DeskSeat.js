var MJDeskSeatAddCmp = function (_class /*...*/) {

    var args = Array.prototype.slice.call(arguments, 1);
    var sups = [];
    _.forEach(args, function (s) {
        sups = sups.concat(s);
    });
    var nClass = _class;
    _.forEach(sups, function (_sup) {
        nClass = nClass.extend(_sup);
    });
    return nClass;

}

var MJDeskSeat = function () {
    var Seat = cc.Layer.extend({
        root: null,
        panel_root: null,
        panel_cardIn: null,
        panel_cardOut: null,
        panel_tip: null,
        pengPanel: null,
        node_show: null,
        node_pos_center: null,

        gap_stand: 0,
        gap_moCard: 0.5,
        posXHandInCard: 0,
        posCenterCardOut: cc.p(0, 0),
        posCenterPengShow: cc.p(0, 0),

        chiArray: null,
        chiPanelArray: null,
        pengPanelArray: null,
        pengArray: null,
        buzhangPanelArray: null,
        buzhangArray: null,
        ShowTingArray: null,
        ShowTingPanelArray: null,

        uid: 0,
        moCard: null,
        cardInArray: null,
        cardOutArray: null,

        cardInList: null,//xianshi
        node_tip: null,
        panel_tianhu: null,
        deskType: DeskType.Other,
        info: '',
        sexType: 2,
        mpPlugin_arr: [],
        //replay
        panel_replay: null,
        isAlreadyTing: 0,
        gap_card: 0,
        ctor: function (data, info) {
            this._super();
            this.info = info;
            this.uid = data["uid"];
            if (MajhongInfo.GameMode == GameMode.PLAY) {
                this.sexType = data['userSex'];
            }
            this.chiArray = new Array();
            this.chiPanelArray = new Array();
            this.pengPanelArray = new Array();
            this.pengArray = new Array();
            this.buzhangPanelArray = new Array();
            this.buzhangArray = new Array();
            this.cardOutArray = new Array();
            this.cardInArray = new Array();
            this.cardInList = new Array();
            this.mpPlugin_arr = new Array();
            this.ShowTingArray = new Array();
            this.ShowTingPanelArray = new Array();

            this.noDelPai_arr = new Array(); //保存别人听牌不能打的牌
        },

        initUI: function () {
            this.panel_root = ccui.helper.seekWidgetByName(this.root, "panel_root");
            this.pengPanel = ccui.helper.seekWidgetByName(this.panel_root, "panel_peng");
            this.panel_cardIn = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardIn");
            this.panel_cardOut = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardOut");
            this.node_show = ccui.helper.seekWidgetByName(this.panel_root, "node_show");
            this.node_tip = ccui.helper.seekWidgetByName(this.panel_root, "node_tip");
            this.node_tip.setLocalZOrder(20);
            this.node_pos_center = ccui.helper.seekWidgetByName(this.panel_root, "node_pos_center");
            this.posCenterCardOut = this.node_show.getPosition();
            if (this.node_pos_center) {
                this.posCenterPengShow = this.node_pos_center.getPosition();
            }

            this.panel_tianhu = ccui.helper.seekWidgetByName(this.panel_root, "panel_tianhu");
            if (this.panel_tianhu != undefined && this.panel_tianhu != null)
                this.panel_tianhu.setVisible(false);

            this.panel_replay = ccui.helper.seekWidgetByName(this.panel_root, "panel_replay");
            this.panel_replay.setVisible(false);
            this.panel_replay.getParent().reorderChild(this.panel_replay, 1000 + 10);

            this.panel_huan3_dipai = ccui.helper.seekWidgetByName(this.root, "panel_huan3_dipai");
            if (this.panel_huan3_dipai) this.panel_huan3_dipai.setVisible(false);

        },
        onEnter: function () {
            this._super();
            this.initUI();
            if (MajhongInfo.GameMode == GameMode.PLAY) {
                this.registerAllEvents();
            }

            // this.scheduleOnce(this.__cacseCard.bind(this) , 1);
        },

        //摆牌效果处理
         __cacseCard: function () {
            var cardPais = ["T6","T6","T6","T6","T6","T6","T6","T6","T6"];
            _.forEach(cardPais , function(paiV) {
                this.addCardOut(paiV)
            }.bind(this));
        },

        onExit: function () {
            this._super();
            this.isAlreadyTing = 0;
            if (MajhongInfo.GameMode == GameMode.PLAY) {
                this.removeAllEvents();
            }
        },

        removeAllParam: function () {
            this.cardInArray.splice(0, this.cardInArray.length);
            this.cardInArray = null;
            this.cardOutArray.splice(0, this.cardOutArray.length);
            this.cardOutArray = null;
            this.pengArray.splice(0, this.pengArray.length);
            this.pengArray = null;
            this.chiArray.splice(0, this.chiArray.length);
            this.chiArray = null;
            this.buzhangArray.splice(0, this.buzhangArray.length);
            this.buzhangArray = null;
            this.ShowTingArray.splice(0, this.ShowTingArray.length);
            this.ShowTingArray = null;
            this.moCard = null;
        },

        registerAllEvents: function () {
            qp.event.listen(this, 'mjSendHandCards', this.onSendHandCards.bind(this));
            qp.event.listen(this, 'mjSyncPlayerMocards', this.onSyncPlayerMocards.bind(this));
            qp.event.listen(this, 'mjNotifyDelCards', this.onNotifyDelCards.bind(this));
            qp.event.listen(this, 'mjSyncDelCards', this.onSyncDelCards.bind(this));
            qp.event.listen(this, 'mjSyncPlayerOP', this.onSyncPlayerOP.bind(this));
            qp.event.listen(this, 'mjNotifyAutoDelCards', this.onNotifyAutoDelCards.bind(this));
        },

        removeAllEvents: function () {
            qp.event.stop(this, 'mjSendHandCards');
            qp.event.stop(this, 'mjNotifyDelCards');
            qp.event.stop(this, 'mjSyncPlayerMocards');
            qp.event.stop(this, 'mjSyncDelCards');
            qp.event.stop(this, 'mjSyncPlayerOP');
            qp.event.stop(this, 'mjNotifyAutoDelCards');
        },

        checkMsg: function (data) {
            if (data["uid"] == this.uid) {
                return true;
            }
            return false;
        },

        onSendHandCards: function (data) {
            this.panel_cardIn.removeAllChildren();
            this.cardInArray = [];
            this.setHandCards(data);
        },

        onNotifyDelCards: function (data) {
            JJLog.print("DeskSeat onNotifyDelCards");
        },

        onSyncDelCards: function (data) {
            if (this.checkMsg(data)) {
                this.putOutCard(data);
                if (this.moCard != null) {
                    this.moCard.removeFromParent();
                    this.moCard = null;
                } else {
                    this.removePutOutCard(data['msg']);
                    this.resetPanelInChild();
                }
            }
        },

        onSyncPlayerOP: function (data) {
            JJLog.print("DeskSeat onSyncPlayerOP");
            this.synPlayerOp(data);
        },

        synPlayerOp: function (data) {
            var msg = data["msg"];
            var opType = msg["opType"];
            //opCard 有可能是一个数组
            //在处理特殊逻辑的时候   例如蛋牌
            var opCard = msg["opCard"];

            // add by zm begin
            var event = new cc.EventCustom(CommonEvent.ResetCardState);
            event.setUserData(this.pai);
            cc.eventManager.dispatchEvent(event);
            // end

            JJLog.print("!!!!!!!!!!!!!!!!!data =>", data);
            if (data["uid"] == this.uid) {

                //播放 胡 碰 杠 声音
                var soundData = {};
                soundData['userSex'] = this.sexType;
                soundData['optionType'] = opType;
                sound.playOption(soundData);
                this.playTipAnimation(opType);

                switch (opType) {
                    case OPERATIONNAME.CHI: {
                        var cards = msg["cards"];

                        for (var i = cards.length - 1; i >= 0; i--) {
                            var opCardKey = opCard['type'] + opCard['value'];
                            var cardKey = cards[i]['type'] + cards[i]['value'];
                            if (opCardKey == cardKey) {
                                cards.splice(i, 1);
                                break;
                            }
                        }
                        cards.splice(1, 0, opCard);
                        this.removeChiCards(data);
                        this.addChiCardsPanel(cards);
                        if (this.uid != hall.user.uid) {
                            this.resetPanelInChild();
                        }


                    }
                        break;
                    case OPERATIONNAME.PENG: {
                        var cards = msg["cards"];

                        var sourceChair = msg["sourceChair"];
                        this.addPengCardsPanel(opCard, sourceChair);
                        this.removePengCards(data);
                        if (this.uid != hall.user.uid) {
                            this.resetPanelInChild();
                        }
                    }
                        break;
                    case OPERATIONNAME.BUZHANG:
                    // {
                    //     var cards = msg["cards"];

                    //     var sourceChair = msg["sourceChair"];
                    //     this.removeBuzhangCards(data, newPengPanel);
                    //     var newPengPanel = this.addBuzhangCardsPanel(opCard, msg["origin"], sourceChair);

                    //     this.resetPanelInChild();
                    // }
                    //     break;
                    case OPERATIONNAME.GANG: {
                        // var cards = msg["cards"];

                        var sourceChair = msg["sourceChair"];
                        this.removeBuzhangCards(data, newPengPanel);

                        this._checkChangeGangType(msg);

                        var newPengPanel = this.addBuzhangCardsPanel(opCard, msg["origin"], sourceChair);

                        if (this.uid != hall.user.uid) {
                            this.resetPanelInChild();
                        }
                        this.addGangCards(data);
                    }
                        break;
                    case OPERATIONNAME.TING: {
                        var cards = msg["cards"];
                        this.isAlreadyTing = 1;
                        this.setHandCardsBack();
                        this.resetPanelInChild();
                        qp.event.send('appGameHeadTing', msg);
                    }
                        break;
                    case OPERATIONNAME.HU: {
                        var cards = msg["cards"];
                        if (this.moCard) {
                            this.moCard.removeFromParent();
                            this.moCard = null;
                        }
                        //this.initCardList(data);
                        // cc.setTimeout(function () {
                            this.addHu(msg);
                            JJLog.print(msg);
                            data['userSex'] = this.sexType;
                            this.playHuAniamtion(data);//播放胡牌动画和声音

                        // }.bind(this), 500);
                    }
                        break;

                }
            } else if (data["msg"]["sourceUid"] == this.uid) {
                if (opType != OPERATIONNAME.HU) {
                    this.removeOutCard(data["msg"]["opCard"]);
                }

                if (opType == OPERATIONNAME.PENG) {
                    if (data.msg.isQGang == 1) {
                        this.removeHandInCard(data["msg"]["opCard"]);
                        this.resetPanelInChild();
                    }
                }
            }
        },

        onNotifyAutoDelCards: function (data) {
            JJLog.print("[DeskSeat] onNotifyDelCards", JSON.stringify(data));
        },

        getCardCount: function () {
            // var numPanel = this.pengPanelArray.length + this.chiPanelArray.length + this.buzhangPanelArray.length ;
            var len = this.getShowPanelCardCount();
            len += this.cardInArray.length;
            return len;
        },

        getShowPanelCount: function () {
            return this.pengPanelArray.length + this.chiPanelArray.length + this.buzhangPanelArray.length;
        },
        /**
         * 获取吃碰杠 牌数  {不是牌节点数 ，是常识中麻将数 *3}
         */
        getShowPanelCardCount: function () {
            return this.getShowPanelCount() * 3;
        },

        forceDisconnect: function () {
            cc.setTimeout(function () {
                var pomelo = window.pomelo;
                if (pomelo.connectState != 'disconnected') {
                    pomelo.disconnect();
                }
            }, 100);
        },


        getFinal: function (a1, n, d) {
            return a1 * n + n * (n - 1) * d / 2;
        },

        playTipAnimation: function (type) {
            if (type == OPERATIONNAME.HU) return;
            XYGLogic.Instance.addSpriteFrames(MJBaseRes.PL_Word);
            var _TipRes = XYGLogic.Instance.TipRes;
            if (_TipRes[type][1]) {
                var img1 = new ccui.ImageView(_TipRes[type][1], ccui.Widget.PLIST_TEXTURE);
                img1.setScale(1.2);
                img1.setOpacity(50);
                var scale1 = cc.scaleTo(0.15, 0.8);
                var fadeIn1 = cc.fadeIn(0.2);
                img1.runAction(cc.sequence(
                    cc.spawn(scale1, fadeIn1),
                    cc.delayTime(0.1),
                    cc.fadeOut(0.2),
                    cc.removeSelf()
                ));

                this.node_tip.addChild(img1, 10);
            } else {
                JJLog.print("[DeskSeat 3D] TipRes[type] error:" + type);
            }

        },

        playHuAniamtion: function (data, test) {

            var cards = data['msg']['cards'];
            var delay = MjTime.HU_SHOW_TIME;
            var type = 1;
            var sexType = data['userSex'];

            var ziMo = false;
            if (data['msg']['sourceUid'] == data['uid']) {
                ziMo = true;
                var huData = {};
                huData['userSex'] = sexType;
                huData['ziMo'] = ziMo;
                sound.playzimo_hu(huData);
                var hu = MJDaHuAni.create(huData);
                if (hu) {
                    this.node_tip.addChild(hu, 10);
                    var size = hu.getContentSize();
                    hu.setPosition(-size.width * 0.5, -size.height * 0.5);
                    hu.runHuAnimation(delay);
                }
                delay += MjTime.HU_SHOW_TIME;
            }
            else
            {
                var huData = {};
                huData['userSex'] = sexType;
                huData['ziMo'] = ziMo;
                sound.playzimo_hu(huData);
            }
            for (var i = 0; i < cards.length; i++) { //只显示一次
                JJLog.print("胡牌信息=" + JSON.stringify(data));
                type = cards[i]['type'];
                var huData = {};
                huData['huType'] = type;
                huData['userSex'] = sexType;
                var hu = MJDaHuAni.create(huData);
                if (hu) {
                    this.node_tip.addChild(hu, 10);
                    var size = hu.getContentSize();
                    hu.setPosition(-size.width * 0.5, -size.height * 0.5);
                    hu.runHuAnimation(delay);
                }
                delay += MjTime.HU_SHOW_TIME;
            }
        },

        initCardList: function (data) {
            var cards = data['msg']['selfPaiQi'];
            for (var cardTag in cards) {
                var cardArray = cards[cardTag];
                for (var i = 0; i < cardArray.length; i++) {
                    var key = cardArray[i];
                    this.cardInList.push(key);
                }
            }

            var opCard = data['msg']['opCard'];
            this.cardInList.push(opCard);
        },

        removeOutCard: function (msg) {
            if (!msg) {
                cc.error("【DeskSet】 removeOutCard Error! msg is null!!");
                return;
            }
            var cardValue = msg["type"] + msg["value"];
            for (var i = this.cardOutArray.length - 1; i >= 0; i--) {
                var tmpCard = this.cardOutArray[i];
                if (cardValue == tmpCard.paiOfCard().keyOfPai()) {
                    this.cardOutArray.splice(i, 1);
                    tmpCard.removeFromParent();
                    break;
                }
            }
        },

        posOfPanel: function () {
            var pos = cc.p(0, 0);
            if (this.moCard == null) {
                pos = this.panel_cardIn.convertToWorldSpace(this.firstCard().getPosition());
            }
            else {
                pos = this.panel_cardIn.convertToWorldSpace(this.moCard.getPosition());
            }
            return pos;
        },

        firstCard: function () {
            var card = this.cardInArray[this.cardInArray.length - 1];
            return card;
        },

        onSyncPlayerMocards: function (data) {
            if (this.checkMsg(data)) {
                this.addMoCard();
            }
        },

        addMoCard: function () {

            if (this.moCard != null) {
                this.cardInArray.push(this.moCard);
                this.moCard = null;
                this.resetPanelInChild();
            }
        },

        removeChiCards: function () {
            this.removeHandInCard(2);

        },

        removePengCards: function () {
            this.removeHandInCard(2);
        },

        appendCardDanForPengCardSet: function (cardObj, gang_type, sourceChair) {
            var key = cardObj['type'] + cardObj['value'];

            for (var i = 0; i < this.buzhangPanelArray.length; i++) {
                var firstGang = null;
                var gangPanel = this.buzhangPanelArray[i];
                if (gang_type == gangPanel.gang_type || gang_type == OPER_GANG_TYPE.GANG_BU) {
                    var boolContains = false;
                    if (firstGang == null && gangPanel.gang_type > OPER_GANG_TYPE.GANG_MING) {
                        firstGang = this.buzhangPanelArray[i];
                    }
                    for (var j = 0; j < gangPanel.getChildrenCount(); j++) {
                        var card = gangPanel.getChildByTag(j);
                        if (!!card && card.paiOfCard().keyOfPai() == key) {
                            boolContains = true;
                            card.addCardNum();
                            break;
                        }
                    }
                    if (!boolContains && firstGang != null) {
                        this.appendCardToPengPanel(firstGang, cardObj);
                    }
                    break;
                }
            }
        },
        //add buzhang
        removeBuzhangCards: function (data) {

            if (this.moCard != null) {
                this.cardInArray.push(this.moCard);
                this.moCard = null;
            }

            var msg = data['msg'];
            var gang_type = msg.origin;
            var opCard = msg['opCard'];
            var opKey = opCard['type'] + opCard['value'];
            switch (gang_type) {
                case OPER_GANG_TYPE.GANG_AN: {
                    this.removeHandInCard(4);
                }
                    break;
                case OPER_GANG_TYPE.GANG_OTHER: {
                    this.removeHandInCard(3);
                }
                    break;
                case OPER_GANG_TYPE.GANG_MING: {
                    this.removeHandInCard(1);
                    for (var i = 0; i < this.pengArray.length; i++) {
                        var tmpCard = this.pengArray[i];
                        var tmpKey = tmpCard['type'] + tmpCard['value'];
                        if (opKey == tmpKey) {
                            this.pengArray.splice(i, 1);
                            var panel = this.pengPanelArray[i];
                            panel.removeFromParent();
                            this.pengPanelArray.splice(i, 1);
                            break;
                        }
                    }
                }
                    break;
                case OPER_GANG_TYPE.GANG_JTF:
                case OPER_GANG_TYPE.GANG_J1:
                case OPER_GANG_TYPE.GANG_T1:
                case OPER_GANG_TYPE.GANG_T9:
                case OPER_GANG_TYPE.GANG_F1:
                case OPER_GANG_TYPE.GANG_BU: {
                    this.removeHandInCard([].concat(opCard).length);
                }
                    break;
            }
        },

        

        removePutOutCard: function (card) {
            JJLog.print(this.panel_cardIn.getContentSize().height, 'panel_cardIn');
            JJLog.print(this.pengPanel.getContentSize().height, 'pengPanel');

            var last = this.cardInArray.length - 1;
            var card = this.cardInArray[last];
            if (card != null && card != undefined) {
                this.cardInArray.splice(last, 1);
                card.removeFromParent();
            }

            JJLog.print(this.panel_cardIn.getContentSize().height, 'panel_cardIn6');
            JJLog.print(this.pengPanel.getContentSize().height, 'pengPanel6');
        },

        removeHandInTargetCard: function (card) {
            var last = this.cardInArray.length - 1;
            var card = this.cardInArray[last];
            if (card != null && card != undefined) {
                this.cardInArray.splice(last, 1);
                card.removeFromParent();
            }
        },

        removeHandInCard: function (numOrDataObj) {
            var num = numOrDataObj;
            if (num instanceof Array) {
                num = num.length;
            } else if (typeof (num) == "object" && num.type != undefined && num.value != undefined) {
                num = 1;
            }
            var ori = this.cardInArray.length;
            for (var i = 0; i < num; i++) {
                var last = this.cardInArray.length - 1;
                var card = this.cardInArray[last];
                if (card != null && card != undefined) {
                    this.cardInArray.splice(last, 1);
                    card.removeFromParent();
                }
            }
            //JJLog.print("splice num：："+num+"ori:"+ori+"now"+this.cardInArray.length);
        },
        sortCardList: function (cardA, cardB) {

            var currGame = hall.getPlayingGame().table;
            if (MajhongInfo.GameMode == GameMode.PLAY && currGame && currGame.isQueCard) {
                if (currGame.isQueCard(cardA) || currGame.isQueCard(cardB)) {

                    if (currGame.isQueCard(cardA)) {
                        if (currGame.isQueCard(cardB)) {
                            return cardA.paiOfCard().numOfPai() - cardB.paiOfCard().numOfPai();
                        } else {
                            return 1;
                        }
                    } else {
                        return -1;
                    }
                } else {
                    return cardA.paiOfCard().numOfPai() - cardB.paiOfCard().numOfPai();
                }
            }
            else if (cardA.getCardJin && cardB.getCardJin && cardA.getCardJin() != cardB.getCardJin()) {
                return cardB.getCardJin() - cardA.getCardJin();
            }
            else {
                return cardA.paiOfCard().numOfPai() - cardB.paiOfCard().numOfPai();
            }
        },

        //
        getCardsFromData: function (data) {
            var pais = data['paiQi'];
            var arr = new Array();
            if (this.deskType !== DeskType.SELF) {
                for (var i = 0; i < data['paiQi']['num']; i++) {
                    arr.push('0');
                }
                return arr;
            } else {

                for (var tag in pais) {
                    var infoArray = pais[tag];
                    for (var i = 0; i < infoArray.length; i++) {
                        arr.push(infoArray[i]);
                    }
                }
                return arr;
            }
        },

        _checkChangeGangType: function (data) {
            var org_gang = data.origin;
            var gang_type = data.changeOrigin;

            if(data.changeOrigin){
                data.origin = data.changeOrigin;
            }
           
            for (var i = 0; i < this.buzhangPanelArray.length; i++) {
                var firstGang = null;
                var gangPanel = this.buzhangPanelArray[i];
                //原始杠类型为 GNAG_JTF   当前panel类型  是原始杠类型  要变更
                if (org_gang == gangPanel.gang_type && org_gang == OPER_GANG_TYPE.GANG_JTF) {
                    gangPanel.gang_type = gang_type;
                }
            }
        },

        checkOffline: function () {
            if (XYGLogic.table.isOffline) {
                this.initLastCards();
            }
        },

        initLastCards: function () {
            JJLog.print("[DeskSeat] initLastCards");
            var info = XYGLogic.table.getCardByPlayer(this.uid);

            var cardOuts = info['paiChu'];
            var length = cardOuts.length > 3 ? 3 : cardOuts.length;
            for (var i = 0; i < cardOuts.length; i++) {
                this.addCardOut(cardOuts[i]);
            }

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

            var funcArr = info['paiDest']
            for (var k = 0; k < funcArr.length; k++) {
                var funcInfo = funcArr[k];
                var funcType = funcInfo['type'];

                switch (funcType) {
                    case OPERATIONNAME.GANG:
                    // {
                    //     var cardObj = funcInfo['pai'];
                    //     this.addBuzhangCardsPanel(cardObj, funcInfo["origin"], funcInfo['sourceChair']);
                    // }
                    // break;
                    case OPERATIONNAME.BUZHANG:
                        {
                            var cardObj = funcInfo['pai'];
                            this.addBuzhangCardsPanel(cardObj, funcInfo["origin"], funcInfo['sourceChair']);
                        }
                        break;
                    case OPERATIONNAME.PENG:
                        {
                            var cardObj = funcInfo['pai'];
                            var sourceChair = funcInfo['sourceChair'];
                            var qgPai = _searchQGCard(cardObj);
                            if (qgPai) {
                                sourceChair = null;
                            }
                            this.addPengCardsPanel(cardObj, sourceChair, qgPai);
                        }
                        break;
                    case OPERATIONNAME.CHI:
                        {
                            var cardArr = funcInfo['pai'];
                            this.addChiCardsPanel(cardArr);
                        }
                        break;
                }
            }

            var cardArray = this.getCardsFromData(info);
            for (var i = 0; i < cardArray.length; i++) {
                this.addCardIn(cardArray[i]);
            }
            if(info['isGang'] > 1)
            {
                this.isAlreadyTing = 1;
                this.setHandCardsBack();
                qp.event.send('appGameHeadTing', info);
            }
            this.resetPanelInChild();

            if (1 == info.isHu) {
                this.addHu(
                    {
                        cards: [
                            {
                                pais: [info.isHuPai]
                            }
                        ],
                        selfPaiQi: info.paiQi,
                        ypdxOrder: info.ypdxOrder,
                    }
                );
            }

        },

        cardOfString: function (cardObj) {
            return cardObj['type'] + cardObj['value'];
        },

        getHuCards: function (msg) {
            var cards = new Array();
            for (var i = 0; i < msg['cards'].length; i++) {
                var data = msg['cards'][i];
                var data2 = data['pais'];
                for (var j = 0; j < data2.length; j++) {
                    var obj = data2[j];
                    var isContains = false;
                    for (var k = 0; k < cards.length; k++) {
                        if (this.cardOfString(obj) == this.cardOfString(cards[k])) {
                            isContains = true;
                            break;
                        }
                    }
                    if (!isContains) {
                        cards.push(obj);
                    }
                }
            }
            return cards;
        },

        getHandCards: function (msg) {
            var info = msg['selfPaiQi'];
            var huCards = this.getHuCards(msg);

            var cards = new Array();
            for (var typeTag in info) {
                var data = info[typeTag];
                for (var i = 0; i < data.length; i++) {
                    var cardObj = data[i];
                    var cardStr = this.cardOfString(data[i]);
                    var isAdd = true;

                    if (isAdd) cards.push(cardObj);
                }
            }

            return cards;
        },
        // 重置所有牌的状态
        resetHandCards: function () {
            if (this.moCard) {
                if (this.moCard.resetCard) this.moCard.resetCard();
            }

            // paiOfCard
            for (var index = 0; index < this.cardInArray.length; index++) {
                var card = this.cardInArray[index];
                if (card && card.resetCard) card.resetCard();
            }
        },

        getOneCardForHandCards: function (dataOrType, num/*num*/) {
            if (!this.cardInArray) return;

            var cardType = dataOrType;
            var cardvalue = num;
            if (typeof (dataOrType) == "object") {
                cardType = dataOrType.type;
                cardvalue = dataOrType.value;
            }

            if (this.moCard) {
                var pai = this.moCard.paiOfCard();
                if (pai.type === cardType && pai.value === cardvalue) {
                    return this.moCard;
                }
            }

            // paiOfCard
            for (var index = 0; index < this.cardInArray.length; index++) {
                var card = this.cardInArray[index];
                var pai = card.paiOfCard();
                if (pai && pai.type === cardType && pai.value === cardvalue) {
                    return card;
                }
            }
            return null;
        },

        deleteHandCardWithCard: function (card) {
            if (card === this.moCard) {
                this.moCard.removeFromParent();
                this.moCard = null;
                this.resetPanelInChild();
                return true;
            }
            for (var index = 0; index < this.cardInArray.length; index++) {
                var element = this.cardInArray[index];
                if (card === element) {
                    this.cardInArray.splice(index, 1);
                    card.removeFromParent();
                    this.resetPanelInChild();
                    return true;
                }
            }
        },

        removeOutHandCard: function (card) {
            for (var i = 0; i < this.cardInArray.length; i++) {
                var tmpCard = this.cardInArray[i];
                if (tmpCard == card) {
                    this.cardInArray.splice(i, 1);
                    card.removeFromParent();
                    break;
                }
            }
        },

        /**
         * 在处理杠牌行之前    要查询一下之前有没有被处理过
         * 如果查询到  就进行删除 
         */
        removePengCardSetByKey: function (key, TData) {
            for (var i = 0; i < this.pengArray.length; i++) {
                var tmp = this.pengArray[i];
                var tmpKey = null;
                if (tmp['type'] == undefined) tmpKey = tmp;
                else tmpKey = tmp['type'] + tmp['value'];

                if (tmpKey == key) {
                    this.pengArray.splice(i, 1);
                    var panel = this.pengPanelArray[i];
                    TData.numPanel = panel.index;
                    this.pengPanelArray.splice(i, 1);
                    panel.removeFromParent();
                    break;
                }
            }
        },

        getCardsForHandCards: function (dataOrType, num/*num*/) {
            var arr = [];

            var cardType = dataOrType;
            var cardvalue = num;
            if (typeof (dataOrType) == "object") {
                cardType = dataOrType.type;
                cardvalue = dataOrType.value;
            }

            if (this.moCard) {
                var pai = this.moCard.paiOfCard();
                if (pai.type === cardType && pai.value === cardvalue) {
                    arr.push(this.moCard);
                }
            }

            // paiOfCard
            for (var index = 0; index < this.cardInArray.length; index++) {
                var card = this.cardInArray[index];
                var pai = card.paiOfCard();
                if (pai.type === cardType && pai.value === cardvalue) {
                    arr.push(card);
                }
            }
            return arr;
        },

        getHandLastCard: function () {
            var card = this.cardInArray[this.cardInArray.length - 1];
            if (this.getCardCount() == MajhongInfo.MajhongNumber) {
                card = this.cardInArray[this.cardInArray.length - 2];
            }
            return card;
        },

        loadPlugIn: function (plugClass, resFile) {
            if (!plugClass) return;

            var plugin = new plugClass(this, resFile);
            this.addChild(plugin);
            this.mpPlugin_arr.push(plugin);
            return plugin;
        },

        reset: function () {
            JJLog.print("【DeskSeat】 reset!!");
            this.moCard = null;
            this.panel_cardIn.removeAllChildren();
            this.panel_cardOut.removeAllChildren();

            for (var i = 0; i < this.mpPlugin_arr.length; i++) {
                this.mpPlugin_arr[i].reset();
            }
            this.isAlreadyTing = 0;
            this.chiArray = new Array();
            this.chiPanelArray = new Array();
            this.pengPanelArray = new Array();
            this.pengArray = new Array();
            this.buzhangPanelArray = new Array();
            this.buzhangArray = new Array();
            this.cardOutArray = new Array();
            this.cardInArray = new Array();
            this.cardInList = new Array();
            this.noDelPai_arr = new Array();
            this.ShowTingArray = new Array();
            this.ShowTingPanelArray = new Array();
        },

        //======================================================================================================================================================================================
        //子类可以重新的方法
        //处理杠时的牌行
        createPengCardSetForGang: function (cardObj, gang_type, sourceChair) { },
        /**
         * 在碰牌行上添加牌
         * @param pengPanel  层节点
         * @param cardObj    创建Card Data
         * @param index      处于层节点位置
         * @param isLast     是否是最后一个添加的节点
         */
        appendCardToPengPanel: function (pengPanel, cardObj , index, isLast) { },
        /**
         * 创建蛋牌
         */
        createPengCardSetForDan: function (cards, gang_type, sourceChair) { },

        addBuzhangCardsPanel: function (cardObj) { },

        setHandCards: function (data) { },

        setHandCardsBack: function () { },

        addGangCards: function (data) { },


        addHu: function (opCard) { },

        putOutCard: function (data) { },

        posIndexOfOutCard: function () { },

        addChiCardsPanel: function (cards) { },

        addPengCardsPanel: function (cardObj, sourceChair) { },

        resetPanelInChild: function () { },

        posMoOfPanel: function () { },

        addCardIn: function (cardObj) { },

        addCardOut: function (cardObj) { },

        pengPanelAddTo: function (arrMgr, panelPeng, addIndex) {},
    });
    Seat = MJDeskSeatAddCmp(Seat, MJCmpDeskSeatRe);
    return Seat;
}();