var MJUpSeat2D = function () {
    var _MyCard = MJCardUpStand;
    var _CarShowUp = MJCardUpShow;
    var Seat = MJUpSeatBase.extend({
        gap_panel: 113,
        gap_moCard: 0.5,
        ctor: function (data) {
            this._super(MJBaseResV2D.PlayerUp, data);
            this.deskType = DeskType.UP;
        },

        onEnter: function () {

            this.moCardGap = 10;
            this.gap_stand = 38;
            if (MajhongInfo.MajhongNumber > 14) {
                this.gap_stand = this.gap_stand * CommonParam.Other17CardStandScale;
            }
            this._super();
        },

        addCardIn: function (cardObj) {
            var card = _MyCard.create2D();
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);

        },

        addCardOut: function (cardObj) {

            var card = _CarShowUp.create2D(cardObj, CARD_SITE.HAND_OUT);;

            var index = this.cardOutArray.length;
            // index = 100 - index;

            this.panel_cardOut.addChild(card, index);
            this.cardOutArray.push(card);
            var pos = this.posIndexOfOutCard();
            card.setPosition(pos);
            card.setLocalZOrder( (pos.Order + 1) * 1000 - index ) ;
            return card;
        },

        setHandCardsBack: function () {
            this.gap_stand = 33;
            var panelLength = this.getShowPanelCount();
            var length = this.cardInArray.length;
            for (var i = 0; i < this.cardInArray.length; i++) {
                this.cardInArray[i].removeFromParent();
            }
            this.cardInArray.splice(0, this.cardInArray.length);

            for (var i = 0; i < length; i++) {
                var card;
                var d = {};
                d['type'] = 'H';
                d['value'] = 1;
                if (panelLength * 3 + i + 1 == MajhongInfo.MajhongNumber) {
                    card = this.standClass.create2D();
                } else {
                    card = _CarShowUp.create2D(d, 0);
                    card.SetBack();
                }
                this.panel_cardIn.addChild(card, i);
                this.cardInArray.push(card);
            }
        },

        posIndexOfOutCard: function () {
            this._super();
            var num = this.cardOutArray.length;
            var width = 0;
            var height = 0;
            if (num > 0) {
                var card = this.cardOutArray[0];
                width = card.getContentSize().width * CommonParam.UpCardGap;
                height = card.getContentSize().height * CommonParam.UpCardHeightGap;
            }

            num--;
            var lineCount = 10;
            if (MajhongInfo.MajhongNumber > 14) {
                lineCount = 9;
            }
            var index = num % lineCount;
            var floor = Math.floor(num / lineCount);
            
            var rPos = cc.p(index * width - lineCount / 2 * width, 0);
            var df = floor % 2;
            var ord = Math.floor(floor / 2);

            rPos.y = height * (floor % 2) + (ord * 10);
            rPos.Order = ord;//skyshan 这是扩张参数
            return rPos
        },

        setCardPosOfPengPanel: function (card, index) {
            card.setPosition(this.pengPanel.getChildByName("node" + index).getPosition());
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
            var panelLength = this.getShowPanelCount();
            var huHands = this.getHuCards(msg);
            var handCardLen = this.cardInArray.length;

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

            for (var i = 0; i < huHands.length; i++) {
                var cardShow = _CarShowUp.create2D(huHands[i], panelLength * 3 + handCardLen + i, CARD_SITE.RECORD);
                cardShow.setPosition(this.posMoOfPanel());
                this.panel_cardIn.addChild(cardShow, card_indexs[GetCardDifferentIndex(panelLength * 3 + handCardLen + i)]);
                if (msg.ypdxOrder == 1) {
                    cardShow.showGray();
                }
            }
        },

        appendCardToPengPanel: function (pengPanel, cardObj , index, isLast) {
            pengPanel.InitCICT = pengPanel.InitCICT || 3; // 初始化 pengPanel 可容纳节点的个数

            var offPos = this.pengPanel.getChildByName("node_offPos").getPosition();
            
            index = index == undefined ? pengPanel.getChildrenCount() : index;
            var card = _CarShowUp.create2D(cardObj, index);
            var width = card.getContentSize().width;
            var pos = cc.p(offPos.x * index, offPos.y * index);

            var InitCICT = pengPanel.InitCICT;
            if (index >= InitCICT && pengPanel.isSizeAdd) { //有四张牌组成是 要扩大size
                var size = pengPanel.getContentSize();
                if(pengPanel.isSizeAddScale){ //在被初始化时的panel 增加size 不需要scale
                    size.width += offPos.x * pengPanel.getScale();
                }else{
                    size.width += offPos.x ;
                }
                pengPanel.setContentSize(size);
            }
            if(isLast && index < (InitCICT - 1) ){ //小于初始容纳张牌 要减小size
                var size = pengPanel.getContentSize();
                if(pengPanel.isSizeAddScale){ 
                    size.width -= offPos.x * pengPanel.getScale() * (3 - (index + 1));
                }else{
                    size.width -= offPos.x * (3 - (index + 1));
                }
                pengPanel.setContentSize(size);
                pengPanel.InitCICT = index + 1;
            }
            card.setPosition(pos);
            pengPanel.addChild(card, 40 - index, index);

            return card;
        },
    });

    Seat = MJDeskSeatAddCmp(Seat, MJCmpOutCardAni2D);
    return Seat;
}();