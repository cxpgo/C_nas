var MJLeftSeat2D = function () {
    var _MyCard = MJCardLeftStand;
    var _CarShowUp = MJCardLeftShow;
    var Seat = MJLeftSeatBase.extend({
        ctor: function (data) {
            this._super(MJBaseResV2D.PlayerLeft, data, 'leftseat');
            this.deskType = DeskType.LEFT;
        },

        addCardIn: function () {
            var card = _MyCard.create2D();
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
        },

        addCardOut: function (cardObj) {

            var card = _CarShowUp.create2D(cardObj, CARD_SITE.HAND_OUT);;

            var index = this.cardOutArray.length;
            this.panel_cardOut.addChild(card, index);
            this.cardOutArray.push(card);
            var pos = this.posIndexOfOutCard();
            card.setPosition(pos);
            return card;
        },

        onEnter: function () {
            this.gap_stand = 27;
            this.gap_panel = 98;
            this.posXHandInCard = 0;
            this.posYHandInCard = 0;
            if (MajhongInfo.MajhongNumber > 14) {
                this.gap_stand = this.gap_stand * CommonParam.Other17CardStandScale;
            }

            this._super();
        },

        setHandCardsBack: function () {
            var panelLength = this.getShowPanelCount();
            var length = this.cardInArray.length;
            for (var i = 0; i < this.cardInArray.length; i++) {
                this.cardInArray[i].removeFromParent();
            }
            this.cardInArray.splice(0, this.cardInArray.length);

            for (var i = 0; i < length; i++) {
                var card;
                if (panelLength * 3 + i + 1 == MajhongInfo.MajhongNumber) {
                    card = _MyCard.create2D();
                } else {
                    var Date = {};
                    Date['type'] = 'H';
                    Date['value'] = 1;
                    card = _CarShowUp.create2D(Date);
                    card.SetBack();
                }
                this.panel_cardIn.addChild(card, i);
                this.cardInArray.push(card);
            }
        },

        posIndexOfOutCard: function () {
            var num = this.cardOutArray.length;
            var width = 0;
            var height = 0;
            if (num > 0) {
                var card = this.cardOutArray[0];
                width = card.getContentSize().width * CommonParam.LeftCardWidthGap;
                height = card.getContentSize().height * CommonParam.LeftCardGap;
            }
            num--;
            var lineCount = 10;
            if (MajhongInfo.MajhongNumber > 14) {
                lineCount = 9;
            }
            var index = num % lineCount;
            var floor = Math.floor(num / lineCount);
            // return cc.p(-floor * width - width, lineCount / 2 * height - height * index);


            var rPos = cc.p(0, 0);
            var df = floor % 2;
            var ord = Math.floor(floor / 2);

            rPos.x = -width * (floor % 2) - width;
            rPos.y = lineCount / 2 * height - height * index + (ord * 10)
            rPos.Order = ord;//skyshan 这是扩张参数

            return rPos;
        },
        setCardPosOfPengPanel: function (card, index) {
            card.x = 0;
            if (index < 3) {
                card.y = card.getContentSize().height * CommonParam.LeftCardGap * index;
            } else {
                card.y = card.getContentSize().height * 0.9;
            }
        },

        //摸牌位置
        posMoOfPanel: function () {
            var card = this.getHandLastCard();
            if(card){
                return cc.p(card.x, card.y - this.gap_stand - this.gap_stand * this.gap_moCard);
            }
            var posYNext = this._getHandCardNextP();
            return cc.p(this.posXHandInCard , posYNext - this.gap_stand * 0)
        },

        addMoCard: function () {
            this._super();
            var card = _MyCard.create2D();
            this.moCard = card;
            var length = this.cardInArray.length;
            card.setPosition(this.posMoOfPanel());
            if (this.deskType == DeskType.RIGHT)
                length = 20 - length;
            this.panel_cardIn.addChild(card, length);
        },


        addHu: function (msg) {
            this.isAlreadyTing = 1;
            for (var i =0;i<  this.cardInArray.length;i++)
            {
                this.cardInArray[i].removeFromParent();
            }
            this.cardInArray.splice(0,this.cardInArray.length);
            // this.setHandCardsBack();
            var handCards = this.getHandCards(msg);
            for(var i=0;i<handCards.length;i++)
            {
                var cardShow = _CarShowUp.create2D(handCards[i],CARD_SITE.RECORD);
                this.panel_cardIn.addChild(cardShow);
                this.cardInArray.push(cardShow);
            }
            this.cardInArray = this.cardInArray.sort(this.sortCardList);
            this.resetPanelInChild();
            var huHands = this.getHuCards(msg);
            for (var i = 0; i < huHands.length; i++) {
                var cardShow = _CarShowUp.create2D(huHands[i], CARD_SITE.RECORD);
                cardShow.setPosition(this.posMoOfPanel());
                cardShow.y = cardShow.y - 10
                this.panel_cardIn.addChild(cardShow, i + 20);
                if (msg.ypdxOrder == 1) {
                    cardShow.showGray();
                }
            }
        },

        appendCardToPengPanel: function (pengPanel, cardObj, index , isLast) {
            pengPanel.InitCICT = pengPanel.InitCICT || 3; // 初始化 pengPanel 可容纳节点的个数

            var offPos = this.pengPanel.getChildByName("node_offPos").getPosition();
            index = index == undefined ? pengPanel.getChildrenCount() : index;

            var card = _CarShowUp.create2D(cardObj);
            var width = card.getContentSize().width;
            var pos = cc.p(offPos.x * index, offPos.y * index);

            var InitCICT = pengPanel.InitCICT;
            if (index >= InitCICT && pengPanel.isSizeAdd) { //大于可初始容纳牌组成是 要扩大size
                var size = pengPanel.getContentSize();
                if(pengPanel.isSizeAddScale){ 
                    size.height += offPos.y * pengPanel.getScale();
                }else{
                    size.height += offPos.y;
                }
                pengPanel.setContentSize(size);
            }
            if(isLast && index < (InitCICT - 1) ){ //小于初始容纳张牌 要减小size
                var size = pengPanel.getContentSize();
                if(pengPanel.isSizeAddScale){ 
                    size.height -= offPos.y * pengPanel.getScale() * (3 - (index + 1));
                }else{
                    size.height -= offPos.y * (3 - (index + 1));
                }
                pengPanel.setContentSize(size);
                pengPanel.InitCICT = index + 1;
            }
            card.setPosition(pos);
            pengPanel.addChild(card, 40 - index, index);
            return card;
        },

        updatePanelCardSeat: function (showPengChilds) {
            var posYNext = 0;
            var offy = 5;
            var zOrder = 10;
            for (var i = 0; i < showPengChilds.length; i++) {
                var panel = showPengChilds[i];

                posYNext -= panel.height * panel.getScale() + offy;
                panel.y = posYNext;
                panel.x = this.posXHandInCard;
                panel.setLocalZOrder(zOrder ++);
            }

        },
        _getHandCardNextP : function () {
            var panelHeight = this.pengPanel.getContentSize().height * this.pengPanel.getScale() * 1.04;
            var panelLength = this.getShowPanelCount();
            
            var posYNext = -panelHeight * this.getFinal(1, panelLength, -this.showOffScale) / 2 - this.gap_stand * 2;
            return posYNext;
        },
        resetPanelInChild: function () {

            this.updatePanelCardSeat([].concat(this.buzhangPanelArray).concat(this.pengPanelArray).concat(this.chiPanelArray));

            var posYNext = this._getHandCardNextP();
            JJLog.print("this.cardInArray.length:", this.cardInArray.length);
            if (MajhongInfo.GameMode == GameMode.RECORD) {
                this.cardInArray = this.cardInArray.sort(this.sortCardList);
            }

            for (var i = 0; i < this.cardInArray.length; i++) {
                var card = this.cardInArray[i];
                card.x = this.posXHandInCard;
                card.y = posYNext - this.gap_stand * i;
                this.panel_cardIn.reorderChild(card, i);

                if (MajhongInfo.GameMode == GameMode.PLAY && this.getShowPanelCardCount() + i + 1 == MajhongInfo.MajhongNumber) {
                    card.y -= this.gap_stand * this.gap_moCard;
                }
            }
            if (!!this.moCard) {
                this.moCard.setPosition(this.posMoOfPanel());
            }

        },
    });

    Seat = MJDeskSeatAddCmp(Seat, MJCmpOutCardAni2D);
    return Seat;
}();
