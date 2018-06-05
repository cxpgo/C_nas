/**
 * Created by atom on 2016/9/11.
 */

var DDZSelfSeat = DDZDeskSeat.extend({
    TishiIdx: 0,
    TishiArray: [],
    chupai: null,
    img_rule: null,
    img_big: null,
    ctor: function (data) {
        this._super(data, 'selfseat');
        JJLog.print("!!!!!!!!!!!!!!!!!!!!!!! selfseat", data);
        this.mRoot = util.LoadUI(DDZPokerJson.PlayerPanel).node;
        this.addChild(this.mRoot);
        this.mHint = true;
        this.deskType = DeskType.Player;
        this.chupai = [];
        this.TishiIdx = 0;
        this.TishiArray = [];
        this.startPos = cc.p(640, 0);
        this.endPos = cc.p(640, 260);
        this.initSelfUI();
    },

    onEnter: function () {
        this._super();
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.checkOffline();
            this.registerSelfEvent();
        }
        else if (MajhongInfo.GameMode == GameMode.RECORD) {

        }
    },

    onExit: function () {
        this._super();
    },

    // 初始化
    initSelfUI: function () {
        this.img_rule = ccui.helper.seekWidgetByName(this.mRoot, "Image_rule");

        this.panelStatusWaiting = ccui.helper.seekWidgetByName(this.mRoot, "panel_status_waiting");
        this.panelStatusBeneath = ccui.helper.seekWidgetByName(this.mRoot, "panel_status_beneath");
        this.panelStatusPlaying = ccui.helper.seekWidgetByName(this.mRoot, "panel_status_playing");
        this.panelCallPoints = ccui.helper.seekWidgetByName(this.mRoot, "panel_call_points");
        this.panelStatusDouble = ccui.helper.seekWidgetByName(this.mRoot, "panel_status_double");
        this.panel_handCard = ccui.helper.seekWidgetByName(this.mRoot, "panel_handCard");

        this.panel_label_tip1 = ccui.helper.seekWidgetByName(this.mRoot, "panel_label_tip1");
        this.panel_label_tip1.setVisible(false);

        this.panelStatusWaiting.setVisible(true);
        this.panelStatusBeneath.setVisible(false);
        this.panelStatusPlaying.setVisible(false);
        this.panelCallPoints.setVisible(false);
        this.panelStatusDouble.setVisible(false);

        this.btn_guo = ccui.helper.seekWidgetByName(this.panelStatusPlaying, "btn_guo");
        this.btn_guo.addClickEventListener(this.onGuo.bind(this));

        this.btn_chu = ccui.helper.seekWidgetByName(this.panelStatusPlaying, "btn_chu");
        this.btn_chu.addClickEventListener(this.onChuPai.bind(this));

        this.btn_tishi = ccui.helper.seekWidgetByName(this.panelStatusPlaying, "btn_tishi");
        this.btn_tishi.addClickEventListener(this.onTiShi.bind(this));

        this.btn_ready = ccui.helper.seekWidgetByName(this.panelStatusWaiting, "btn_ready");
        this.btn_ready.addClickEventListener(this.readyStatus.bind(this));
        this.img_zb = ccui.helper.seekWidgetByName(this.mRoot, "img_zb");
        this.img_zb.setVisible(false);

        this.getSelfReady();
    },

    registerSelfEvent: function () {
        var ls1 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEventAction.KAIJIN_EVT,
            callback: this.kaijinEvent.bind(this)
        });
        cc.eventManager.addListener(ls1, this);
    },

    getSelfReady: function () {
        this.panelStatusWaiting.setVisible(true);
        var show = true;
        for (var key in XYGLogic.Instance.getReady) {
            if (key == hall.user.uid && XYGLogic.Instance.getReady[key]) {
                show = false;
            }
        }
        this.btn_ready.setVisible(show);
    },

    readyStatus: function () {
        var _this = this;
        XYGLogic.Instance.ready(function (data) {

        });
    },

    setReadyState: function (data) {
        this._super(data);
        var status = data['readyStatus'];//0,1
        if (status == 1) {
            this.btn_ready.setVisible(false);
        } else {
            this.btn_ready.setVisible(true);
        }
    },
    //hxx
    initRecordHandCards: function () {

    },

    recordResetPanelInChild: function () {

    },
    operationLord: function (data) {
        JJLog.print("!!!!!!!!!!!!!!!!!!!!data", this.panelStatusBeneath)
        this.panelStatusBeneath.setVisible(true);
        var btn_jiaodizhu = ccui.helper.seekWidgetByName(this.panelStatusBeneath, "btn_jiaodizhu");
        var btn_bujiao = ccui.helper.seekWidgetByName(this.panelStatusBeneath, "btn_bujiao");
        var sendLord = function (isLord) {
            sound.playBtnSound();
            var data = {'isLord': isLord};
            XYGLogic.net.sendDoLord(data)

        };
        btn_bujiao.addClickEventListener(sendLord.bind(this, 0));
        btn_jiaodizhu.addClickEventListener(sendLord.bind(this, 1));

        this.setoperationLordState(btn_jiaodizhu, btn_bujiao);
    },
    operationcallpoints: function (data) {
        JJLog.print("!!!!!!!!!!!!!!!!!!!!data", this.panelStatusBeneath)
        this.panelCallPoints.setVisible(true);
        var btn_yifen = ccui.helper.seekWidgetByName(this.panelCallPoints, "btn_yifen");
        var btn_erfen = ccui.helper.seekWidgetByName(this.panelCallPoints, "btn_erfen");
        var btn_sanfen = ccui.helper.seekWidgetByName(this.panelCallPoints, "btn_sanfen");
        var btn_bujiao = ccui.helper.seekWidgetByName(this.panelCallPoints, "btn_bujiao");
        var sendLord = function (isLord) {
            var data = {'isLord': isLord};
            XYGLogic.net.sendDoLord(data)
        };
        btn_bujiao.addClickEventListener(sendLord.bind(this, 0));
        btn_yifen.addClickEventListener(sendLord.bind(this, 1));
        btn_erfen.addClickEventListener(sendLord.bind(this, 2));
        btn_sanfen.addClickEventListener(sendLord.bind(this, 3));

        var name = [btn_yifen, btn_erfen, btn_sanfen];
        this.setoperationcallpointsState(name);
    },

    setoperationLordState: function (btn_jiaodizhu, btn_bujiao) {

        var cardscount = XYGLogic.Instance.getMulityValue();
        if (cardscount < 2) {
            btn_jiaodizhu.loadTextureNormal(DDZPokerPic.Call_LandlordPng, ccui.Widget.LOCAL_TEXTURE);
            btn_bujiao.loadTextureNormal(DDZPokerPic.No_CallPng, ccui.Widget.LOCAL_TEXTURE);
        }
        else {
            btn_jiaodizhu.loadTextureNormal(DDZPokerPic.Rob_LandlordPng, ccui.Widget.LOCAL_TEXTURE);
            btn_bujiao.loadTextureNormal(DDZPokerPic.NoRobPng, ccui.Widget.LOCAL_TEXTURE);
        }
    },
    setoperationcallpointsState: function (name) {
        var cardlord = XYGLogic.Instance.getMulityLord();
        for (var i = 0; i < name.length; i++) {
            if (cardlord >= i + 1) {
                name[i].setTouchEnabled(false);
                name[i].setBright(false);
            }
            else {
                name[i].setTouchEnabled(true);
                name[i].setBright(true);
            }
        }
    },
    operationcallpointsEnd: function (data) {
        this.panelCallPoints.setVisible(false);
    },
    operationLordEnd: function (data) {
        this.panelStatusBeneath.setVisible(false);
    },

    //加倍
    operationDouble: function (data) {
        this.panelStatusDouble.setVisible(true);
        var btn_jiabei = ccui.helper.seekWidgetByName(this.panelStatusDouble, "btn_jiabei");
        var btn_bujiabei = ccui.helper.seekWidgetByName(this.panelStatusDouble, "btn_bujiabei");
        var sendDouble = function (isDouble) {
            sound.playBtnSound();
            var data = {'isDouble': isDouble, opType: POKERDDZOPTYPE.DOUBLE};
            XYGLogic.net.updatePlayerOp(data);
        };
        btn_jiabei.addClickEventListener(sendDouble.bind(this, 1));
        btn_bujiabei.addClickEventListener(sendDouble.bind(this, 0));

    },
    operationDoubleEnd: function () {
        this.panelStatusDouble.setVisible(false);
    },

    // 控制出牌操作
    operationGiveCards: function (data, ani) {
        JJLog.print("operationGiveCards uid :" + JSON.stringify(data));
        if (data['uid'] != this.uid) return;

        this.mHint = true;
        var btn_guo = this.btn_guo;
        var btn_chu = this.btn_chu;
        var btn_tishi = this.btn_tishi;

        this.fnt_label_tip.setVisible(false);

        this.panelStatusPlaying.setVisible(true);
        // this.panelStatusPlaying.runAction(cc.sequence(cc.delayTime(this.cardInArray.length * 2 * 0.05), cc.show()));

        btn_guo.setVisible(false);
        btn_chu.setVisible(false);
        btn_tishi.setVisible(false);


        // 清除上次出的牌
        this.panel_cardOut.removeAllChildren();
        // this.chupai = [];
        // this.ResetCardInAnimation();
        this.cardOutArray.splice(0, this.cardOutArray.length);

        if (data['uid'] == data['opUid'] || data['opUid'] == null || data['opUid'] == undefined) {
            XYGLogic.Instance.LastOpPai = null;
            btn_chu.setVisible(true);
            btn_tishi.setVisible(true);

            var outCardTips = [];
            this.selectHint(this.cardInArray, outCardTips, XYGLogic.Instance.LastOpPai)

            this.autoSendCards(outCardTips);
        }
        else {
            var outCardTips = [];
            if (this.selectHint(this.cardInArray, outCardTips, XYGLogic.Instance.LastOpPai)) {
                btn_guo.setVisible(!(this.cardInArray.length === 20));
                btn_chu.setVisible(true);
                btn_tishi.setVisible(true);

                this.autoSendCards(outCardTips);
            } else {
                btn_chu.setVisible(false);
                btn_tishi.setVisible(false);
                btn_guo.setVisible(true);
                this.optNoticeTips1('meiyoudaguo');
                // var self = this;
                // this.mClockCtrl.countDown("Guo", 9, function () {
                //     // self.onGuo();
                // });
            }
        }
        if (btn_guo.isVisible()) {
            if (!btn_tishi.isVisible()) {
                this.panelStatusPlaying.x = 640 + 235;
            } else {
                this.panelStatusPlaying.x = 640;
            }
        } else {
            this.panelStatusPlaying.x = 640 - 125;
        }
    },

    autoSendCards: function (outCardTips) {
        JJLog.print("outCardTips", outCardTips)
        if (outCardTips.length <= 0) return false;

        var checkNum = this.uid != XYGLogic.Instance.whoIsBanker() ? XYGLogic.Instance.checkNum : 0;
        var nLength = this.cardInArray.length - checkNum;
        var tempCards = [];
        outCardTips.forEach(function (el) {
            if (el.length >= nLength) {
                tempCards.push(el);
            }
        })
        JJLog.print("################tempCards =>", tempCards);
        if (tempCards.length == 0) {
            return false;
        }
        var autoArr = [];
        DDZCard_Hinter.autoSendHint(this.cardInArray, XYGLogic.Instance.LastOpPai.cards, XYGLogic.Instance.LastOpPai.type, tempCards, nLength, autoArr);
        JJLog.print("################autoArr =>", autoArr);

        if (autoArr.length == 1) {
            var outCardsArr = [];
            DDZCard_Rule.checkAndCompareCards(autoArr[0], XYGLogic.Instance.LastOpPai.cards, XYGLogic.Instance.LastOpPai.type, outCardsArr);
            if (outCardsArr.length == 1) {
                var cardType = outCardsArr[0].getCardsTypeInfo();
                var chupai = outCardsArr[0].getCards();
                JJLog.print("###################### cardType=>", cardType);
                JJLog.print("###################### chupai=>", chupai);
                this.panelStatusPlaying.setVisible(false);
                var _this = this;
                XYGLogic.Instance.updatePlayerDelCard(chupai, cardType, function (data) {
                    JJLog.print(JSON.stringify(data));
                    if (data.code != 200) {
                        _this.TishiIdx = 0;
                        _this.panelStatusPlaying.setVisible(true);
                        XYGLogic.Instance.LastOpPai = null;
                    } else {
                        _this.img_rule.setVisible(false);
                        _this.TishiIdx = 0;
                        _this.TishiArray = [];
                    }
                });
            }
        }

        //todo 自动出牌情景分析 1.不考虑让牌 只计算牌出完的情况
    },

    //hxx  清除选牌
    ResetCardInAnimation: function () {
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            if (card.isSelected() && card.getTag() == 0) {
                card.playResetAnimation();
            }
        }
    },
    ClearCardInAnimation: function () {
        this.chupai = [];
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            card.ResetAnimation();
        }
    },
    TipCards: function (card) {
        card.SelectedAnimation();
    },
    initLastCards: function () {
        JJLog.print("initLastCards");
        this._super();
        this.TishiArray = [];
    },
    runFaPaiAction: function (cardTip) {
        var tipCard = cardTip.card;
        if (cardTip.lordUid == this.uid) {
            var index = 2 * cardTip.index;
        } else {
            var index = 2 * cardTip.index + 1;
        }
        index = 33 - index;

        var card = new DDZPokerCard(this, {type: 0, value: 0}, false);
        var cardSize = card.getContentSize();
        var cardInLength = this.panel_cardIn.getContentSize().width;
        var posXNext = 700;
        var length = 33;
        // var posIntel = 53;  //牌间隔
        var posIntel = (cardInLength - cardSize.width) / 33;
        var delTime = DDZCommonParam.FaPaisHideTime;
        for (var i = 0; i < 34; i++) {
            if (i == index) {
                var card = new DDZPokerCard(this, tipCard, false);
            } else {
                var card = new DDZPokerCard(this, {type: 0, value: 0}, false);
            }
            this.panel_handCard.addChild(card);
            this.panel_handCard.reorderChild(card, i);
            card.x = posXNext + posIntel * i;
            card.y = 0;
            var resveTime = (33 - i) * delTime;
            card.runAction(cc.sequence(cc.delayTime(resveTime), cc.hide(), cc.removeSelf()));
        }

    },

    resetPanelInChildWithOutSort: function (cardTip) {
        if (this.cardInArray.length == 0) {
            return;
        }
        var tipCard = {};
        if (cardTip) {
            tipCard = cardTip.card;
        }
        var maxShowCount = 17;
        this.maxCardLength = Math.max(maxShowCount, this.maxCardLength, this.cardInArray.length);
        var cardInLength = this.panel_cardIn.getContentSize().width;
        var cardSize = this.cardInArray[0].getContentSize();
        var posXNext = 0;
        // var posIntel = 53;  //牌间隔
        var posIntel = (cardInLength - cardSize.width) / (this.maxCardLength - 1);
        this.maxCardLength = Math.max(maxShowCount, this.maxCardLength, this.cardInArray.length);
        // 起始位置的计算，保证剩余的牌都在正中间
        posXNext += ((this.maxCardLength - this.cardInArray.length)) * (posIntel / 2);

        var index_center = Math.floor(this.cardInArray.length/2);
        var c_pos = cc.p(0, 0);
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            this.panel_cardIn.reorderChild(card, i);
            card.stopAllActions();
            // card.setVisible(true);
            card.setPokerTouchEnable(false);
            card.x = posXNext + posIntel * i;
            card.y = 0;
            if (tipCard.type == card.type && tipCard.value == card.value) {
                card.showFirstTip(true);
            }
            if (index_center == i) {
                c_pos.x = card.x;
                c_pos.y = card.y;
            }
        }
        return c_pos;
    },
    runCardsAnimation: function (cardTip) {
        this.resetPanelInChild();
        // var delTime = DDZCommonParam.HandCardShowTime;

        // var tCards = [].concat(this.cardInArray);
        // this.cardInArray = [];
        // var resetIndexF = null;
        // resetIndexF = function (){
        //     var card = tCards.shift();
        //     if(!card) return;
        //     card.setVisible(true);
        //     this.cardInArray.push(card);
        //     this.resetPanelInChild(false , false , resetIndexF);
        // }.bind(this);
        // resetIndexF();

        var delTime = DDZCommonParam.HandCardShowTime;

        var tCards = [].concat(this.cardInArray);
        this.cardInArray = [];
        for (var i = 0; i < tCards.length; i++) {
            var card = tCards[i];
            var revertTime = delTime * (i + 1);
            card.runAction(cc.sequence(
                cc.delayTime(revertTime),
                cc.show(),
                cc.callFunc(function (card) {
                    this.cardInArray.push(card);
                    this.resetPanelInChild();
                }.bind(this, card)),
                cc.fadeIn(delTime)
            ));
        }
    },
    
    addCardIn: function (cardObj) {
        var card = new DDZPokerCard(this, cardObj);
        card.setVisible(false);
        this.cardInArray.push(card);
        this.panel_cardIn.addChild(card);
    },

    addCardOut: function (data, bAct) {
        JJLog.print("!!!!!!!!!!!addCardOut", data);
        this.panel_cardOut.removeAllChildren();
        this.cardOutArray.splice(0, this.cardOutArray.length);
        // data = DDZCard_Rule.sortCards(data);
        for (var i = 0; i < data.length; i++) {
            var cardObj = data[i];
            var card = new DDZPokerCard(this, cardObj, false);
            if (i == data.length - 1) {
                card.showLordTip(true);
            }

            var length = this.cardOutArray.length;
            this.panel_cardOut.addChild(card, 20 - length);
            this.cardOutArray.push(card);
        }
        this.resetOutPanelInChild(bAct);
    },

    // 计算出牌的位置
    resetOutPanelInChild: function (bAct) {
        if (this.cardOutArray.length == 0) return;
        // 起始位置的计算，保证剩余的牌都在正中间
        var posXNext = -this.cardOutArray.length * CommonParam.pokerGap / 2 - CommonParam.pokerGap;

        for (var i = 0; i < this.cardOutArray.length; i++) {
            var card = this.cardOutArray[i];
            card.x = posXNext + CommonParam.pokerGap * i;
            card.y = 0;
            // card.runAction(cc.scaleTo(DDZCommonParam.CardOutScaleTime, 1));
            this.panel_cardOut.reorderChild(card, i);
        }
        if (bAct) {
            this.panel_cardOut.setPosition(this.startPos.x - posXNext, this.startPos.y);
            this.panel_cardOut.setScale(1);
            // this.panel_cardOut.runAction(cc.fadeIn(0.1));
            this.panel_cardOut.runAction(cc.moveTo(0.15, this.endPos.x, this.endPos.y));
            this.panel_cardOut.runAction(cc.scaleTo(0.1, DDZCommonParam.panelCardOutScale));
        }
    },
    rectContainsXPoint: function (rect, point) {
        return point.x >= cc.rectGetMinX(rect) && point.x <= cc.rectGetMaxX(rect);
    },
    //滑动选牌 直接当前的手指的X坐标为标准计算 避免出现滑动过快中间漏掉牌
    slipping: function (startPos, pos) {
        var start_index = -1;
        var end_index = -1;
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            if (start_index == -1 && this.rectContainsXPoint(card.getBoundingBox(), startPos)) {
                start_index = i;
            }
            if (end_index == -1 && this.rectContainsXPoint(card.getBoundingBox(), pos)) {
                end_index = i;
            }
        }

        if (start_index == -1 || end_index == -1) {
            return;
        }
        if (startPos.x >= pos.x) {
            for (var i = end_index; i <= start_index; i++) {
                var card = this.cardInArray[i];
                card.setTag(1);
                card.showGray();
            }
            for (var i = 0; i < end_index; i++) {
                var card = this.cardInArray[i];
                if (card.getTag() == 1) {
                    card.showWhite();
                    card.setTag(0);
                }
            }
        } else if (startPos.x < pos.x) {
            for (var i = start_index; i <= end_index; i++) {
                var card = this.cardInArray[i];
                card.setTag(1);
                card.showGray();
            }
            for (var i = this.cardInArray.length - 1; i > end_index; i--) {
                var card = this.cardInArray[i];
                if (card.getTag() == 1) {
                    card.showWhite();
                    card.setTag(0);
                }
            }
        }
    },
    //滑动选牌结束
    slippingEnd: function () {
        var tempCards = [];
        var bHint = false;
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            if (card.getTag() == 1) {
                tempCards.push(card);
                if (!card.isSelected()) {
                    bHint = true;
                }
            }
        }
        JJLog.print("!!!!!!!!!! mHint", this.mHint)
        if (bHint) {
            var outCardsArr = DDZCard_Hinter.autoHint(tempCards, XYGLogic.Instance.LastOpPai.cards, XYGLogic.Instance.LastOpPai.type);
            JJLog.print("!!!!!!!!!!!!!!!!!!!!!!!选牌提示", bHint, tempCards, outCardsArr);
            if (outCardsArr.length > 0) {
                this.mHint = false;
                var outCards = outCardsArr[0];
                for (var i = 0; i < outCards.length; i++) {
                    var card = outCards[i];
                    card.playSelectedAnimation();
                    card.setTag(3);
                }
                for (var i = this.cardInArray.length - 1; i >= 0; i--) {
                    var card = this.cardInArray[i];
                    if (card.isSelected() && card.getTag() != 3) {
                        card.playResetAnimation();
                    }
                    card.setTag(0);
                    card.showWhite();
                }
            } else {
                for (var i = this.cardInArray.length - 1; i >= 0; i--) {
                    var card = this.cardInArray[i];
                    if (card.getTag() == 1) {
                        tempCards.push(card);
                    }

                    if (!card.isSelected() && card.getTag() == 1) {
                        card.playSelectedAnimation();
                    }
                    else if (card.isSelected() && card.getTag() == 1) {
                        card.playResetAnimation();
                    }
                    card.setTag(0);
                    card.showWhite();
                }
            }
        } else {
            for (var i = this.cardInArray.length - 1; i >= 0; i--) {
                var card = this.cardInArray[i];
                if (card.getTag() == 1) {
                    tempCards.push(card);
                }

                if (!card.isSelected() && card.getTag() == 1) {
                    card.playSelectedAnimation();
                }
                else if (card.isSelected() && card.getTag() == 1) {
                    card.playResetAnimation();
                }
                card.setTag(0);
                card.showWhite();
            }
        }
        sound.playCardClick();
    },

    removePutOutCard: function (pais) {
        var pos = 0;
        for (var i = 0; i < pais.length; i++) {
            for (var j = 0; j < this.cardInArray.length; j++) {
                var tmpCard = this.cardInArray[j];
                if (tmpCard.key == pais[i].type + "" + pais[i].value) {
                    if (pos == 0) {
                        pos = tmpCard.x;
                    } else {
                        pos = Math.min(tmpCard.x, pos);
                    }
                    this.cardInArray.splice(j, 1);
                    tmpCard.removeFromParent();
                    break;
                }
            }
        }
        if (pais.length > 0) {
            this.startPos = cc.p(pos, CommonParam.cardUpHeight)
            console.error("!!!!!!!!!!!", pos, pais.length);
        }

        JJLog.print(this.chupai.length + "@@@@@@@@@@@@@@@@@" + pais.length);
        if (this.chupai.length >= pais.length) {
            this.chupai.splice(0, pais.length);
            JJLog.print("this.chupai :" + JSON.stringify(this.chupai));
        } else {
            this.chupai = [];
        }
        this.resetPanelInChild(true);
    },

    autoPutOutCard: function () {
        if (this.moCard != null) {
            var paiData = this.moCard.paiOfCard().objectOfPai();


            this.runAction(cc.sequence(cc.delayTime(1),
                cc.callFunc(this.autoSelect.bind(this)),
                cc.delayTime(1.0),
                cc.callFunc(this.autoPutOut.bind(this)),
                cc.delayTime(0.5),
                cc.callFunc(this.autoDelCard.bind(paiData))
            ));
        }
    },

    autoSelect: function () {

    },

    autoPutOut: function () {

    },

    autoDelCard: function () {
        XYGLogic.Instance.updatePlayerDelCard(this, function (data) {

        }.bind(this));

    },

    // 计算牌的位置
    resetPanelInChild: function (moveAct, startAct , resetCall) {
        if (this.cardInArray.length == 0) {
            return;
        }
        var maxShowCount = 17;//this.uid == XYGLogic.Instance.whoIsBanker() ? 20 : 17;
        this.maxCardLength = Math.max(maxShowCount, this.maxCardLength, this.cardInArray.length);
        var cardInLength = this.panel_cardIn.getContentSize().width;
        var cardSize = this.cardInArray[0].getContentSize();
        var posXNext = 0;
        // var posIntel = 53;  //牌间隔
        var posIntel = (cardInLength - cardSize.width) / (this.maxCardLength - 1);
        JJLog.print("!!!!!!!!!!!!!!cardInLength", cardInLength, cardSize, posIntel)
        this.cardInArray = this.cardInArray.sort(this.sortCardList);
        this.maxCardLength = Math.max(maxShowCount, this.maxCardLength, this.cardInArray.length);
        // 起始位置的计算，保证剩余的牌都在正中间
        posXNext += ((this.maxCardLength - this.cardInArray.length)) * (posIntel / 2);
        if (this.cardInArray.length - 1 > 0) {
            var _posXNext = posXNext + Math.floor(this.cardInArray.length / 2) * posIntel;
            var end_posX = posXNext + posIntel * (this.cardInArray.length - 1);
            var _posIntel = (end_posX - _posXNext) / (this.cardInArray.length - 1);  //初始发牌时间隔
        } else {
            var _posXNext = end_posX = _posIntel = 0;
        }
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            var cardSize = card.getContentSize();
            this.panel_cardIn.reorderChild(card, i);
            if (i == this.cardInArray.length - 1) {
                card.showLordTip(true);
            } else {
                card.showLordTip(false);
            }
            if (moveAct) {
                card.setPokerTouchEnable(false);
                var x = posXNext + posIntel * i;
                var dlT = 0;
                // if(resetCall && i == this.cardInArray.length - 1){
                //     card.x  = posXNext + posIntel * (i + 1);
                //     dlT = 1/30;
                // }
                card.runAction(cc.sequence(
                    
                    cc.moveTo(DDZCommonParam.MoveSideTime, cc.p(x, 0)), 
                    cc.callFunc(function (card , isLast) {
                        card.setPokerTouchEnable(true);
                        if(isLast && resetCall){
                            resetCall();
                        }
                    }.bind(this , card , i == this.cardInArray.length - 1))
                ));
            } else {
                if (startAct) {
                    card.x = _posXNext + i * _posIntel;
                    card.y = 0;
                } else {
                    card.stopAllActions();
                    // card.setVisible(true);
                    card.setPokerTouchEnable(true);
                    card.x = posXNext + posIntel * i;
                    card.y = 0;
                }
                if(i == this.cardInArray.length - 1 && resetCall){
                    card.runAction(cc.sequence(
                        cc.delayTime(DDZCommonParam.MoveSideTime), 
                        cc.callFunc(function () {
                            if(resetCall){
                                resetCall();
                            }
                        }.bind(this))
                    ));
                }
            }
        }
    },

    resetPanelInChildByTishi: function () {

        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            card.y = 0;
        }
    },

    // 点击提示
    onTiShi: function () {
        sound.playBtnSound();
        this.resetPanelInChildByTishi();
        var outCard = [];

        if (this.TishiIdx > 0) {
            this.TishiIdx = (this.TishiIdx + 1) % this.TishiArray.length;
            if (this.TishiIdx == 0)
                this.TishiIdx = this.TishiArray.length;
            outCard = this.TishiArray[this.TishiIdx - 1];
            //hxx
            for (var idx = 0; idx < this.TishiArray.length; idx++) {
                if (this.cardInArray.length == this.TishiArray[idx].length) {
                    outCard = this.TishiArray[idx];
                }
            }
            for (var i = 0; i < this.cardInArray.length; i++) {
                if (this.hasPai(this.cardInArray[i], outCard)) {
                    this.cardInArray[i].playSelectedAnimation();
                    this.cardInArray[i].setTag(0);
                }
                else {
                    this.cardInArray[i].playResetAnimation();
                }
            }
        }
        else {
            if (this.TishiArray.length > 0) {
                this.TishiIdx = 1;
                outCard = this.TishiArray[0];
                //hxx
                for (var idx = 0; idx < this.TishiArray.length; idx++) {
                    if (this.cardInArray.length == this.TishiArray[idx].length) {
                        outCard = this.TishiArray[idx];
                    }
                }
                for (var i = 0; i < this.cardInArray.length; i++) {
                    if (this.hasPai(this.cardInArray[i], outCard)) {
                        this.cardInArray[i].playSelectedAnimation();
                        this.cardInArray[i].setTag(0);
                    }
                    else {
                        this.cardInArray[i].playResetAnimation();
                    }
                }
            } else {
                this.TishiArray = [];
                if (this.selectHint(this.cardInArray, this.TishiArray, XYGLogic.Instance.LastOpPai)) {
                    this.TishiIdx = 1;
                    outCard = this.TishiArray[0];
                    //hxx
                    for (var idx = 0; idx < this.TishiArray.length; idx++) {
                        if (this.cardInArray.length == this.TishiArray[idx].length) {
                            outCard = this.TishiArray[idx];
                        }
                    }
                    for (var i = 0; i < this.cardInArray.length; i++) {
                        if (this.hasPai(this.cardInArray[i], outCard)) {
                            this.cardInArray[i].playSelectedAnimation();
                            this.cardInArray[i].setTag(0);
                        }
                        else {
                            this.cardInArray[i].playResetAnimation();
                        }
                    }
                }
            }
        }
    },

    // 数组中是否启有某张牌
    hasPai: function (checkPai, checkArray) {
        for (var i = 0; i < checkArray.length; i++) {
            if ((checkPai.value == checkArray[i].value) && (checkPai.type == checkArray[i].type)) {
                return true;
            }
        }
        return false;
    },

    // 点击要不起
    onGuo: function () {
        JJLog.print("on guo");
        sound.playBtnSound();
        this.ResetCardInAnimation();
        var data = [];
        var _this = this;
        this.NoticeTipStop();
        this.panelStatusPlaying.setVisible(false);
        XYGLogic.Instance.updatePlayerDelCard(data, 0, function (data) {
            JJLog.print(JSON.stringify(data));
            if (data.code != 200) {
                // _this.panelStatusPlaying.setVisible(true);
            } else {
                _this.img_rule.setVisible(false);
                _this.TishiIdx = 0;
                _this.TishiArray = [];
                _this.mClockCtrl.stop();
            }
        });
    },

    optNoticeTips1: function (txt) {
        // this.fnt_label_tip.setString(txt);
        var str = "Img_" + txt;
        this.panel_label_tip1.setVisible(true);
        this.panel_label_tip1.removeAllChildren();
        var image = new ccui.ImageView(DDZPokerPic[str]);
        image.setAnchorPoint(cc.p(0.5, 0.5));
        image.setPosition(cc.p(this.panel_label_tip1.width/2, this.panel_label_tip1.height/2));
        this.panel_label_tip1.addChild(image);
        this.panel_label_tip1.stopAllActions();
        this.panel_label_tip1.runAction(
            cc.sequence(
                cc.fadeIn(0),
                cc.delayTime(2),
                cc.fadeOut(0.1),
                cc.callFunc(
                    function () {

                    }.bind(this)
                )
            )
        );
    },
    NoticeTipStop:function () {
        if(this.panel_label_tip1)
            this.panel_label_tip1.setVisible(false);
    },


    // 点击出牌
    onChuPai: function () {
        sound.playBtnSound();
        var _this = this;
        this.chupai.sort(function (cardA, cardB) {
            if ((cardA.value != cardB.value) || (cardA.value == cardB.value && cardA.type != cardB.type)) {
                return DDZ_compare[cardA.value] - DDZ_compare[cardB.value];
            }
        });

        var outCardsArr = [];
        if (this.chupai.length == 0 || !DDZCard_Rule.checkAndCompareCards(this.chupai, XYGLogic.Instance.LastOpPai.cards, XYGLogic.Instance.LastOpPai.type, outCardsArr)) {
            this.img_rule.stopAllActions();
            this.img_rule.setVisible(true);
            this.img_rule.runAction(cc.sequence(cc.delayTime(1), cc.hide()));
            return false;
        }
        //todo
        JJLog.print("@@@@@@@@@@@@@@@ outCardsArr=>", outCardsArr)

        if (outCardsArr.length > 1) {
            this.selectType = new DDZTypeSelect(outCardsArr, this);
            this.selectType.showPanel();

            this.selectType.setCallback(function (cardSet) {
                _this.panelStatusPlaying.setVisible(false);
                var chupai = cardSet.getCards();
                var cardType = cardSet.getCardsTypeInfo();
                JJLog.print("@@@@@@@@@@@@@@@2222222 obCards=>", cardType);
                JJLog.print("@@@@@@@@@@@@@@@2222222 chupai=>", chupai);
                XYGLogic.Instance.updatePlayerDelCard(chupai, cardType, function (data) {
                    JJLog.print(JSON.stringify(data));
                    if (data.code != 200) {
                        _this.TishiIdx = 0;
                        // _this.panelStatusPlaying.setVisible(true);
                        // XYGLogic.Instance.LastOpPai = null;
                    } else {
                        _this.img_rule.setVisible(false);
                        _this.TishiIdx = 0;
                        _this.TishiArray = [];
                    }
                });
            })
        } else {
            var cardType = outCardsArr[0].getCardsTypeInfo();
            var chupai = outCardsArr[0].getCards();
            JJLog.print("@@@@@@@@@@@@@@@11111111 obCards=>", cardType);
            JJLog.print("@@@@@@@@@@@@@@@11111111 chupai=>", chupai);
            this.panelStatusPlaying.setVisible(false);
            XYGLogic.Instance.updatePlayerDelCard(chupai, cardType, function (data) {
                JJLog.print(JSON.stringify(data));
                if (data.code != 200) {
                    _this.TishiIdx = 0;
                    // _this.panelStatusPlaying.setVisible(true);
                    // XYGLogic.Instance.LastOpPai = null;
                } else {
                    _this.img_rule.setVisible(false);
                    _this.TishiIdx = 0;
                    _this.TishiArray = [];
                }
            });
        }
    },

    getHandMaxSingleCard: function () {
        if (this.chupai.length != 1)
            return false;
        var bLogicValue = compare[this.chupai[0].value];
        for (var i = 0; i < this.cardInArray.length; i++) {
            var value = compare[this.cardInArray[i].value];
            if (value > bLogicValue)
                return true;
        }
        return false;
    },

    // 点击取消托管
    onCancelTuo: function () {

    },

    addPai: function (card) {
        // 不要重复加牌
        for (var i = 0; i < this.chupai.length; i++) {
            if (this.chupai[i].type + "" + this.chupai[i].value == card.key) {
                return;
            }
        }
        this.chupai.push(card.paiOfCard().object);
        JJLog.print("addPai this.chupai" + JSON.stringify(this.chupai));
    },

    delPai: function (card) {
        for (var i = 0; i < this.chupai.length; i++) {
            if (this.chupai[i].type + "" + this.chupai[i].value == card.key) {
                this.chupai.splice(i, 1);
            }
        }
        JJLog.print("delPai this.chupai" + JSON.stringify(this.chupai));
    },

    kaijinEvent: function (event) {
        var data = event.getUserData();
        // var value = data["value"];
        this.cardInArray = this.cardInArray.sort(this.sortCardList);
        this.cardInArray.forEach(function (el) {
            el.refreshCard();
        });
        this.resetPanelInChild(false, false);
    },

    autoHosting: function (type) {
        JJLog.print("托管操作", type, XYGLogic.Instance.isGold)
        if (XYGLogic.Instance.isGold != 1) {
            return;
        }
        switch (type) {
            case POKERDDZOPTYPE.SEND:
                this.autoDaPai();
                break;
            case POKERDDZOPTYPE.LORD:
                var data = {'isLord': 0};
                XYGLogic.net.sendDoLord(data)
                break;
            case POKERDDZOPTYPE.DOUBLE:
                var data = {'isDouble': 0, opType: POKERDDZOPTYPE.DOUBLE};
                XYGLogic.net.updatePlayerOp(data);
                break;
        }
    },

    autoDaPai: function () {
        var outCardTips = [];
        this.selectHint(this.cardInArray, outCardTips, XYGLogic.Instance.LastOpPai)

        var sendCards = [];
        if (outCardTips.length > 0) {
            sendCards = outCardTips[0];
        } else {
            this.onGuo();
            return;
        }
        var outCardsArr = [];
        DDZCard_Rule.checkAndCompareCards(sendCards, XYGLogic.Instance.LastOpPai.cards, XYGLogic.Instance.LastOpPai.type, outCardsArr);
        if (outCardsArr.length > 0) {
            var cardType = outCardsArr[0].getCardsTypeInfo();
            var chupai = outCardsArr[0].getCards();
            JJLog.print("###################### cardType=>", cardType);
            JJLog.print("###################### chupai=>", chupai);
            this.panelStatusPlaying.setVisible(false);
            var _this = this;
            XYGLogic.Instance.updatePlayerDelCard(chupai, cardType, function (data) {
                JJLog.print(JSON.stringify(data));
                if (data.code != 200) {
                    _this.TishiIdx = 0;
                    // _this.panelStatusPlaying.setVisible(true);
                    // XYGLogic.Instance.LastOpPai = null;
                } else {
                    _this.img_rule.setVisible(false);
                    _this.TishiIdx = 0;
                    _this.TishiArray = [];
                }
            });
        } else {
            this.onGuo();
        }
    },

    oprationRemoveCards: function (data) {
        this._super(data);
        this.panelStatusPlaying.setVisible(false);
        this.cleanSelectType();

    },
    cleanSelectType: function () {
        if (this.selectType) {
            this.selectType.removeFromParent();
            this.selectType = null;
        }
    }
    

});

var DDZTypeSelect = cc.Layer.extend({
    btn_close: null,
    panel_cell: null,
    image_tips: null,
    callbackFunc: null,
    selfSeat:null,
    ctor: function (data, selfSeat) {
        this._super();
        var root = util.LoadUI(DDZPokerJson.TypeSelect).node;
        this.addChild(root);

        this.selfSeat = selfSeat;
        this.btn_close = ccui.helper.seekWidgetByName(root, "panel_root");
        this.btn_close.addClickEventListener(function () {
            this.selfSeat.cleanSelectType();
        }.bind(this));
        this.image_tips = ccui.helper.seekWidgetByName(root, "image_tips");
        this.image_tips.setVisible(true);
        this.initView(data);
    },
    initView: function (data) {
        if (data.length == 0) {
            return;
        }
        var card = new DDZPokerCard(this, {type: 0, value: 0}, false);
        var cardSize = card.getContentSize();

        var height = cardSize.height * 0.5 + 15;
        this.image_tips.removeAllChildren();
        var count = Math.ceil(data.length / 2);
        //todo 110 = 30*2 + 50；
        var length = ((data[0].cards.length - 1) * 30 + cardSize.width / 2 ) * 2 + 110;
        this.image_tips.setContentSize(length, count * height + 15);
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < 2; j++) {
                var index = i * 2 + j;
                if (data[index]) {
                    var cards = data[index].cards;
                    var posx = 0;
                    var layout = new ccui.Layout();
                    this.image_tips.addChild(layout);
                    var contentWidth = (cards.length - 1) * 30 + cardSize.width / 2;
                    if (j == 0) {
                        layout.setAnchorPoint(0, 0);
                        layout.setContentSize(contentWidth, height);
                        layout.setPosition(30, height * (count - i - 1) + 15);
                    } else {
                        layout.setAnchorPoint(1, 0);
                        layout.setContentSize(contentWidth, height);
                        layout.setPosition(length - 30, height * (count - i - 1) + 15);
                    }
                    layout.data = data[index];
                    layout.setTouchEnabled(true);
                    layout.addClickEventListener(function (sender) {
                        JJLog.print("data[index]", sender.data);
                        if (this.callbackFunc) {
                            this.callbackFunc(sender.data);
                        }
                        this.selfSeat.cleanSelectType();
                    }.bind(this))
                    for (var k = 0; k < cards.length; k++) {
                        var card = new DDZPokerCard(this, cards[k], false);
                        card.setScale(0.5);
                        card.setAnchorPoint(cc.p(0, 0));
                        if (k == 0 && posx > 0)
                            card.showInsert();
                        card.x = posx;
                        card.y = 0;
                        posx += 30;
                        layout.addChild(card);
                    }
                }
            }
        }
    },
    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    },
    setCallback: function (callback) {
        this.callbackFunc = callback;
    }
});
