var MJLeftSeatRe = function () {
    var Seat = MJLeftSeat.extend({
        onEnter: function () {
            this._super();
            this.initRecordHandCards();
            this.registerRecordEvent();
        },

        // 记录=====================
        playRecordMoCard: function (data) {
            var card = MJCardLeftShow.create3D(data, CARD_SITE.RECORD);
            var length = this.cardInArray.length;
            card.setScale(this.cardInArray[length - 1].getScale() - 0.05);
            card.setPosition(this.recordMoCardPos());
            this.panel_cardIn.addChild(card, 20);
            this.cardInArray.push(card);
            card.x = card.x + 30;
            card.runAction(cc.sequence(cc.moveTo(0.15, cc.p(card.x - 30, card.y))
                , cc.callFunc(this.postNextStep.bind(this))
            ));
        },

        recordMoCardPos: function () {
            var card = this.cardInArray[this.cardInArray.length - 1];
            return cc.p(card.x - card.getContentSize().width * card.getScaleX() * 0.2, card.y - card.getContentSize().height * card.getScaleY() * 0.6);
        },

        playRecordSend: function (cardObj) {
            var str = this.cardOfString(cardObj);
            var card = null;

            if (this.moCard != null && this.moCard.paiOfCard().keyOfPai() == str) {
                card = this.moCard;
            }

            if (card == null) {
                for (var i = 0; i < this.cardInArray.length; i++) {
                    var tmp = this.cardInArray[i];
                    if (tmp.paiOfCard().keyOfPai() == str) {
                        card = this.cardInArray[i];
                        break;
                    }
                }
            }

            if (card != null) {
                this.playRecordSendAction(card);
            }
        },

        playRecordSendAction: function (card) {
            var cardObj = card.paiOfCard().objectOfPai();
            card.runAction(cc.sequence(cc.moveBy(0.15, cc.p(30, 0)), cc.callFunc(this.removeOutHandCard.bind(this), card)
                , cc.callFunc(this.resetPanelInChild.bind(this))
            ));


            var outCard = MJMyCard.create3D(this, cardObj, true);
            var pos = this.posOfPanel();
            var outPos = this.panel_cardOut.convertToNodeSpace(pos);
            this.panel_cardOut.addChild(outCard, 500);
            outCard.setPosition(outPos);

            var soundData = {};
            soundData['cardType'] = this.cardOfString(cardObj);
            soundData['userSex'] = this.sexType;
            sound.playCard(soundData);

            var outCardRight = this.addCardOut(cardObj);
            var posTarget = outCardRight.getPosition();
            outCardRight.setPosition(this.posCenterCardOut);
            outCardRight.setVisible(false);

            var order = this.panel_cardOut.getLocalZOrder();
            this.panel_cardOut.getParent().reorderChild(this.panel_cardOut, order + 10);
            this.panel_cardOut.runAction(cc.sequence(
                cc.delayTime(1.0),
                cc.callFunc(function () {
                    this.panel_cardOut.getParent().reorderChild(this.panel_cardOut, -1);
                }.bind(this))
            ));
            var spawnShow = cc.spawn(cc.moveTo(CommonParam.PutOut1stTime, this.posCenterCardOut),
                cc.scaleTo(CommonParam.PutOut1stTime, CommonParam.PutOutScale)
            );

            outCard.runAction(cc.sequence(spawnShow, cc.delayTime(CommonParam.ShowDelayTime),//cc.removeSelf()
                cc.callFunc(function () {
                    this.removeFromParent();
                }.bind(outCard))));

            var delay = cc.delayTime(CommonParam.PutOut1stTime + CommonParam.ShowDelayTime);
            var spawnOut = cc.spawn(
                cc.moveTo(CommonParam.PutOut2ndTime, posTarget));
            outCardRight.runAction(cc.sequence(delay,
                cc.callFunc(function () { sound.playCardDown(); }),
                cc.delayTime(0.1), cc.show(), spawnOut,
                cc.callFunc(function () {
                    this.runIndicator();
                }.bind(outCardRight)),
                cc.callFunc(this.postNextStep.bind(this))
            ));
        },

        runRecordBuhuaOpAction: function (data) {
            var huapai = data["pai"];
            for (var i = 0; i < huapai.length; i++) {
                for (var j = this.cardInArray.length - 1; j >= 0; j--) {
                    var card = this.cardInArray[j];
                    if (card.paiOfCard().isQuanZhouHuaPai()) {
                        this.cardInArray.splice(j, 1);
                        card.removeFromParent();
                        break
                    }
                }
            }
            var hua = null;
            if (this.moCard != null && this.moCard.paiOfCard().isQuanZhouHuaPai()) {
                hua = huapai.shift();
                this.moCard.removeFromParent();
                this.moCard = null;
            }
            for (var i = 0; i < huapai.length; i++) {
                var card = MJCardLeftShow.create3D(huapai[i], CARD_SITE.RECORD);
                if (MajhongInfo.MajhongNumber > 14) {
                    card.setScale(CommonParam.Other17CardRecordScale);
                }
                this.cardInArray.push(card);
                this.panel_cardIn.addChild(card);
            }
            this.cardInArray = this.cardInArray.sort(this.sortCardList);
            this.resetPanelInChild();
            if (hua != null) {
                this.playRecordMoCard(hua);
            } else {
                this.postNextStep(0.2);
            }
        },

        initRecordHandCards: function () {
            var cards = hall.getPlayingGame().record.leftHandCards;
            this.panel_cardIn.removeAllChildren();
            var allCards = new Array();
            for (var p in cards) {
                var arr = cards[p];
                for (var i = 0; i < arr.length; i++) {
                    var card = MJCardLeftShow.create3D(arr[i], CARD_SITE.RECORD);
                    if (hall.getPlayingGame().record.JinPaiId == card.paiOfCard().keyOfPai()) {
                        card.setJin();
                    }
                    allCards.push(card);
                }
            }
            allCards = allCards.sort(this.sortCardList);
            for (var i = 0; i < allCards.length; i++) {
                var card = allCards[i];
                var order = 20 - i;
                this.panel_cardIn.addChild(card, order);
                this.cardInArray.push(card);
            }
            this.resetPanelInChild();
        },
    });
    return Seat;
}();
