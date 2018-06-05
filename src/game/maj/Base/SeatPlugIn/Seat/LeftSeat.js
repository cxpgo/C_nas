var MJLeftSeatBase = MJDeskSeat.extend({
    ctor: function (resFile, data) {
        this._super(data, 'leftseat');
        this.root = util.LoadUI(resFile).node;
        this.addChild(this.root);
        this.startScale = 0.64;
        this.showOffScale = 0.05;
    },

    onEnter: function () {
        this._super();

        this.panel_card_seat = ccui.helper.seekWidgetByName(this.root, "panel_card_seat");

        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.checkOffline();
        }
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
                for (var i = 0; i < cards.length; i++) {
                    var cardObj = cards[i];
                    panelPeng = this.createPengCardSetForGang(cardObj, gang_type, sourceChair);
                }
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
            // if (this.ViewType3D) {
            //     var scale = 1 - (MajhongInfo.MajhongNumber - 2) / 3 * this.showOffScale + (numPanel + 1) * this.showOffScale;
            //     panelPeng.setScale(scale * panelPeng.getScale());
            // }
            panelPeng.index = numPanel;
            panelPeng.gang_type = gang_type;
            panelPeng.setVisible(true);
            panelPeng.width *= panelPeng.getScale();
            panelPeng.height *= panelPeng.getScale();

            this.buzhangArray.push(cardObj);
            this.buzhangPanelArray.push(panelPeng);
            this.panel_card_seat.addChild(panelPeng, 100 - numPanel );
        } else {
            this.resetPanelInChild();
        }

    },

    addChiCardsPanel: function (cards) {
        var panelPeng = this.createCardSetPanelForChi(cards);
        var numPanel = this.getShowPanelCount();
        // if (this.ViewType3D) {
        //     var scale = 1 - (MajhongInfo.MajhongNumber - 2) / 3 * this.showOffScale + (numPanel + 1) * this.showOffScale;
        //     panelPeng.setScale(scale * panelPeng.getScale());
        // }

        if(panelPeng){
            panelPeng.index = numPanel;
            panelPeng.setVisible(true);
            this.chiPanelArray.push(panelPeng);
            panelPeng.width *= panelPeng.getScale();
            panelPeng.height *= panelPeng.getScale();

            this.panel_card_seat.addChild(panelPeng, 100 - numPanel);
        }
    },

    addPengCardsPanel: function (cardObj, sourceChair) {
        var panelPeng = this.createCardSetPanelForPeng(cardObj, sourceChair);
        var numPanel = this.getShowPanelCount();
        // if (this.ViewType3D) {
        //     var scale = 1 - (MajhongInfo.MajhongNumber - 2) / 3 * this.showOffScale + (numPanel + 1) * this.showOffScale;
        //     panelCell.setScale(scale * panelCell.getScale());
        // }
        if(panelPeng){
            panelPeng.setVisible(true);
            panelPeng.index = numPanel;
            this.pengPanelArray.push(panelPeng);
            this.pengArray.push(cardObj);
            panelPeng.width *= panelPeng.getScale();
            panelPeng.height *= panelPeng.getScale();

            this.panel_card_seat.addChild(panelPeng, 100 - numPanel);
        }
    },
    pengPanelAddTo: function (arrMgr, panelPeng, addIndex) {
        panelPeng.setVisible(true);
        panelPeng.width *= panelPeng.getScale();
        panelPeng.height *= panelPeng.getScale();
        arrMgr.push(panelPeng);

        this.panel_card_seat.addChild(panelPeng, 100 - addIndex);
    },
    //处理杠时的牌行
    createPengCardSetForGang: function (cardObj, gang_type, sourceChair) {
        var offPos = this.pengPanel.getChildByName("node_offPos").getPosition();

        var panelPeng = this.pengPanel.clone();
        for (var i = 0; i < 4; i++) {
            var card = this.appendCardToPengPanel(panelPeng , cardObj , i);
            if (i == 3) {
                card.y = offPos.y + offPos.y * 0.55;
                card.x = offPos.x - offPos.x * 0.15;
                card.setLocalZOrder(40 + i);
                if (gang_type == OPER_GANG_TYPE.GANG_OTHER && sourceChair == 1) {
                    card.showBlue();
                }
                if (gang_type == OPER_GANG_TYPE.GANG_AN) {
                    card.SetBack();
                }
            } else {
                if (gang_type == OPER_GANG_TYPE.GANG_AN) {
                    card.SetBack();
                }
                if (gang_type == OPER_GANG_TYPE.GANG_OTHER) {
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
            this.appendCardToPengPanel(pengPanel ,cards[i] , i , i == (cards.length - 1))
        }

        pengPanel.isSizeAddScale = true;
        return pengPanel;
    },

    createCardSetPanelForChi: function (cards) {
        var panelCell = this.pengPanel.clone();
        
        for (var i = 2; i >= 0; i--) {
            var card = this.appendCardToPengPanel(panelCell , cards[i] , i);
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
    },
});
