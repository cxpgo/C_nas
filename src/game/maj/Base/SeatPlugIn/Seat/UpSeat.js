var MJUpSeatBase = MJDeskSeat.extend({

    ctor: function (resFile, data) {
        this._super(data);
        this.root = util.LoadUI(resFile).node;
        this.addChild(this.root);
        this.moCardGap = 10;
        this.gap_stand = 35;

        this.posXHandInCard = 0;
        this.posYHandInCard = 0;
    },

    onEnter: function () {
        this._super();
        this.initSelfUI();
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.checkOffline();
        }
    },

    initSelfUI: function () {
        this.panel_card_seat = ccui.helper.seekWidgetByName(this.root, "panel_card_seat");//ListView
        this.pengPanel.setFlippedX(true);
        this.panel_card_seat.setFlippedX(true);
        this.reset();
    },

    setHandCards: function (data) {
        this._super();
        this.panel_cardIn.removeAllChildren();
        for (var i = 0; i < MajhongInfo.MajhongNumber - 1; i++) {
            this.addCardIn();
        }

        this.resetPanelInChild();
        if (XYGLogic.table.bankerId == this.uid) {
            this.addMoCard();
        }
    },

    resetPanelInChild: function () {
        var panelLength = this.getShowPanelCount();
        var posXNext = this.posXHandInCard;
        //手牌位置
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            card.y = this.posYHandInCard;
            card.x = -this.gap_stand * i;
            this.panel_cardIn.reorderChild(card, 100 - i);
            if (this.getShowPanelCardCount() + i + 1 == MajhongInfo.MajhongNumber) {
                card.x -= this.gap_stand * this.gap_moCard;
            }
        }
        if (!!this.moCard) {
            this.moCard.setPosition(this.posMoOfPanel());
        }
    },

    //摸牌位置
    posMoOfPanel: function () {
        var card = this.getHandLastCard();
        if(card){
            return cc.p(card.x - this.gap_stand - this.gap_stand * this.gap_moCard, card.y);
        }
        return cc.p(-this.gap_stand * 0 , this.posYHandInCard)
    },

    putOutCard: function (data) {
        this._super();
        var soundData = {};
        soundData['cardType'] = this.cardOfString(data["msg"]);
        soundData['userSex'] = this.sexType;
        sound.playCard(soundData);
        var card = this.addCardOut(data["msg"]);
        card.setVisible(false);
        var move_end_pos = card.getPosition();
        var outCard = card.panel_card.clone();
        outCard.setScale(CommonParam.cardOutScale);
        var s_pos = this.panel_cardIn.convertToWorldSpace(this.posMoOfPanel());
        var s_pos_1 = this.panel_cardOut.convertToNodeSpace(s_pos);
        outCard.setPosition(s_pos_1);
        var order = this.panel_cardOut.getLocalZOrder();
        this.panel_cardOut.getParent().reorderChild(this.panel_cardOut, order + 10);
        this.panel_cardOut.addChild(outCard, 200);
        var _this = this;
        outCard.runAction(cc.sequence(cc.moveTo(CommonParam.cardOutTime, move_end_pos.x, move_end_pos.y),
            cc.callFunc(function () {
                _this.panel_cardOut.getParent().reorderChild(_this.panel_cardOut, -1);
                this.removeFromParent();
                card.setVisible(true);
                card.runIndicator();
                sound.playCardDown();
            }.bind(outCard))));
        return;

    },

    addBuzhangCardsPanel: function (cardObjs, gang_type, sourceChair) {
        var TData = {
            numPanel: this.getShowPanelCount(),
        };

        var panelPeng = null;
        switch (gang_type) {
            case OPER_GANG_TYPE.GANG_AN:
            case OPER_GANG_TYPE.GANG_OTHER:
            case OPER_GANG_TYPE.GANG_MING: {
                var cards = [].concat(cardObjs);
                for (var i = 0; i < cards.length; i++) {
                    var cardObj = cards[i];
                    var key = cardObj['type'] + cardObj['value'];
                    this.removePengCardSetByKey(key, TData);
                }
                panelPeng = this.createPengCardSetForGang(cards[0], gang_type, sourceChair);

            }
                break;
            case OPER_GANG_TYPE.GANG_JTF:
            case OPER_GANG_TYPE.GANG_J1:
            case OPER_GANG_TYPE.GANG_T1:
            case OPER_GANG_TYPE.GANG_T9:
            case OPER_GANG_TYPE.GANG_F1:
            case OPER_GANG_TYPE.GANG_BU: {
                var cards = [].concat(cardObjs);

                var cards = SetGangCardNums(cards);

                if (cards.length == 1) { //添加蛋牌
                    this.appendCardDanForPengCardSet(cards[0], gang_type, sourceChair);
                } else {
                    panelPeng = this.createPengCardSetForDan(cards, gang_type, sourceChair);
                }
            }
                break;
        }
        if (panelPeng) {
            var numPanel = TData.numPanel;
            panelPeng.index = numPanel;
            panelPeng.gang_type = gang_type;

            panelPeng.setVisible(true);

            panelPeng.width *= panelPeng.getScale();
            panelPeng.height *= panelPeng.getScale();

            this.buzhangArray.push(cardObjs);
            this.buzhangPanelArray.push(panelPeng);

            // this.panel_card_seat.insertCustomItem(panelPeng, numPanel);
            this._insertPanelCardSeat(panelPeng, numPanel);

        }
        this.panel_card_seat.updateSizeAndPosition();
        return panelPeng;
    },


    addChiCardsPanel: function (cardArray) {
        var numPanel = this.getShowPanelCount();
        var panelPeng = this.createCardSetPanelForChi(cardArray);
        if (panelPeng) {
            panelPeng.index = numPanel;


            panelPeng.setVisible(true);
            panelPeng.width *= panelPeng.getScale();
            panelPeng.height *= panelPeng.getScale();

            this.chiPanelArray.push(panelPeng);
            this.chiArray.push(cardArray);

            // this.panel_card_seat.insertCustomItem(panelPeng, numPanel);
            this._insertPanelCardSeat(panelPeng, numPanel);
            // this.playPengAction(panelPeng);

        }

        this.panel_card_seat.updateSizeAndPosition();
    },

    addPengCardsPanel: function (cardObj, sourceChair, robbedShow) {
        var numPanel = this.getShowPanelCount();
        var panelPeng = this.createCardSetPanelForPeng(cardObj, sourceChair, robbedShow);
        if (panelPeng) {
            panelPeng.index = numPanel;

            panelPeng.setVisible(true);
            panelPeng.width *= panelPeng.getScale();
            panelPeng.height *= panelPeng.getScale();
            this.pengArray.push(cardObj);
            this.pengPanelArray.push(panelPeng);

            // this.panel_card_seat.insertCustomItem(panelPeng, numPanel);
            this._insertPanelCardSeat(panelPeng, numPanel);
            // this.playPengAction(panelPeng);
        }
        this.panel_card_seat.updateSizeAndPosition();
    },

    pengPanelAddTo: function (arrMgr, panelPeng, addIndex) {
        this._insertPanelCardSeat(panelPeng, addIndex);
        panelPeng.setVisible(true);
        panelPeng.width *= panelPeng.getScale();
        panelPeng.height *= panelPeng.getScale();
        arrMgr.push(panelPeng);
    },

    //处理杠时的牌行
    createPengCardSetForGang: function (cardObj, gang_type, sourceChair) {
        var panelPeng = this.pengPanel.clone();

        for (var i = 0; i < 4; i++) {
            var card = this.appendCardToPengPanel(panelPeng, cardObj, i)
            if (gang_type == OPER_GANG_TYPE.GANG_AN) {
                card.SetBack();
            }
            if (i == 3) {
                var centerCard = panelPeng.getChildByTag(1);
                card.x = centerCard.x;
                card.y = centerCard.y + 15;
                card.setLocalZOrder(centerCard.getLocalZOrder() + 10);
            }
            if (gang_type == OPER_GANG_TYPE.GANG_OTHER) {
                if (i == 3) {
                    if (sourceChair == 1) {
                        card.showBlue();
                    }
                } else {
                    if (i == 0 || i == 2) {
                        if (sourceChair == i) {
                            card.showBlue();
                        }
                    }
                }
            }
        }
        return panelPeng;
    },
    /**
     * 创建蛋牌
     */
    createPengCardSetForDan: function (cards, gang_type, sourceChair) {
        var pengPanel = this.pengPanel.clone();
        pengPanel.isSizeAdd = true;
        var len = cards.length;
        for (var i = 0; i < len; i++) {
            this.appendCardToPengPanel(pengPanel, cards[i], i, i == (cards.length - 1));
        }
        pengPanel.isSizeAddScale = true;
        return pengPanel;
    },

    createCardSetPanelForChi: function (cards) {
        var panelCell = this.pengPanel.clone();
        var numPanel = this.getShowPanelCount();
        for (var i = 0; i < cards.length; i++) {
            var card = this.appendCardToPengPanel(panelCell, cards[i], i)
            if (i == 1) {
                card.showBlue();
            }
        }
        return panelCell;
    },

    createCardSetPanelForPeng: function (cardObj, sourceChair) {

        var panelCell = this.pengPanel.clone();
        for (var i = 0; i < 3; i++) {
            var card = this.appendCardToPengPanel(panelCell, cardObj, i)
            if (sourceChair != undefined && sourceChair != null && sourceChair == i) {
                card.showBlue();
            }
        }
        return panelCell;
    },

    reset: function () {
        this._super();
        this.panel_card_seat.removeAllChildren();
        var tempCardIn = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardIn")
        tempCardIn.setVisible(false);
        this.panel_cardIn = tempCardIn.clone();
        this.panel_cardIn.setVisible(true);
        // this.panel_card_seat.pushBackCustomItem(this.panel_cardIn);
        this._insertPanelCardSeat(this.panel_cardIn , 19);
        this.panel_cardIn.setFlippedX(true);
    },

    _insertPanelCardSeat : function (node , index) {
        var tI = this.panel_card_seat.getIndex(this.panel_cardIn);
        if(tI <= 0){
            tI = 0;
        }
        // else{
        //     tI -= 1;
        // }
        this.panel_card_seat.insertCustomItem(node, tI);
    }
});
