
var MJSelfSeatRe = function () {
    var Seat = MJSelfSeat.extend({

        onEnter: function () {
            this._super();

            this.initRecordHandCards();
            this.registerRecordEvent();

        },
        //记录=============================
        runRecordBuhuaOpAction: function (data) {
            JJLog.print("@@@@@@@@@@@@@@@@@runRecordBuhuaOpAction", data);
            var huapai = data["pai"];
            var spliceCount = 0;
            for (var i = 0; i < huapai.length; i++) {
                for (var j = this.cardInArray.length - 1; j >= 0; j--) {
                    var card = this.cardInArray[j];
                    if (card.paiOfCard().isQuanZhouHuaPai()) {
                        this.cardInArray.splice(j, 1);
                        card.removeFromParent();
                        spliceCount += 1;
                        break;
                    }
                }
            }
            var hua = null;
            if (this.moCard != null && this.moCard.paiOfCard().isQuanZhouHuaPai() && spliceCount != huapai.length) {
                var hua = huapai.shift();
                this.moCard.removeFromParent();
                this.moCard = null;
            }
            for (var i = 0; i < huapai.length; i++) {
                var card = MJMyCard.create3D(this, huapai[i]);
                card.setPosition((card, i + this.cardInArray.length), 0);
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
            var cards = hall.getPlayingGame().record.selfHandCards;
            this.panel_cardIn.removeAllChildren();
            var allCards = new Array();
            for (var p in cards) {
                var arr = cards[p];
                for (var i = 0; i < arr.length; i++) {
                    var card = MJMyCard.create3D(this, arr[i]);
                    if (hall.getPlayingGame().record.JinPaiId == card.paiOfCard().keyOfPai()) {
                        card.setJin();
                    }
                    allCards.push(card);
                    this.panel_cardIn.addChild(card);
                }
            }

            allCards = allCards.sort(this.sortCardList);
            for (var i = 0; i < allCards.length; i++) {
                var card = allCards[i];
                var size = card.getContentSize();
                if (i == MajhongInfo.MajhongNumber - 1) {
                    card.setPosition(size.width * (MajhongInfo.MajhongNumber - 1) - this.gap_cardStand * i + this.moCardGap, 0);
                    this.moCard = card;
                } else {
                    this.cardInArray.push(card);
                }
            }
            this.resetPanelInChild();
            // this.cardInArray = this.cardInArray.sort(this.sortCardList);
            // for (var i = 0; i < this.cardInArray.length; i++) {
            //     var card = this.cardInArray[i];
            //     card.setPosition(this.getIndexPos(card, i));
            // }

        },
        getIndexPos: function (card, index) {
            var size = card.getContentSize();
            var x = size.width * index - this.gap_cardStand * index;
            return cc.p(x, 0);
        },

        playRecordMoCard: function (cardObj) {
            //var cardObj = data['pai'];
            var card = MJMyCard.create3D(this, cardObj);
            if (this.moCard != null) {
                this.cardInArray.push(this.moCard);
                this.moCard = null;
                this.resetPanelInChild();
            }
            // var xx = this.posXOfPanel() + this.moCardGap;
            card.setPosition(this.posMoOfPanel());
            
            this.moCard = card;
            this.moCard.setCardPosition(this.posMoOfPanel());
            this.moCard.playEnterInAnimation();
            this.panel_cardIn.addChild(card);

            this.postNextStep(0.2);


        },

        // posXOfPanel: function () {
        //     var panelWidth = this.pengPanel.getContentSize().width * this.pengPanel.getScale();
        //     var pos = 0;
        //     var numPanel = this.getShowPanelCount();
        //     if (numPanel > 0) {
        //         var length = numPanel * panelWidth;
        //         var gaps = numPanel * this.gap_panel;
        //         pos += length;
        //         pos += gaps;
        //     }

        //     var numCard = this.cardInArray.length;
        //     if (numCard > 0) {
        //         var card = this.cardInArray[0];
        //         var cardWidth = card.getContentSize().width * card.getScale();
        //         pos = pos + (cardWidth - this.gap_cardStand) * numCard;
        //     }

        //     return pos;
        // },

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
                card.end_pos = card.getPosition();
                this.putOutCardStart(card);
            }
        },
    });
    return Seat;
}();