var MJUpSeat = function () {
    var Seat = MJUpSeatBase.extend({
        ctor: function (data) {
            this._super(MJBaseResV3D.Up, data);
            this.ViewType3D = true;
        },

        initUI: function () {
            this._super();
            // if (MajhongInfo.MajhongNumber > 14) {
            //     this.pengPanel.setScale(CommonParam.My17CardShowScale);
            // } else {
            //     this.pengPanel.setScale(CommonParam.My14CardShowScale);
            // }
            this.gap_panel = this.pengPanel.width * 0.1 * this.pengPanel.getScale(); //间距
        },

        addCardIn: function (cardObj) {
            var card = MJCardUpStand.create3D();
            var length = this.cardInArray.length;
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card, 20 - length);
        },

        addCardOut: function (cardObj) {
            var length = this.cardOutArray.length;
            var index = length % CommonParam.DeskOneNum;
            var floor = Math.floor(length / CommonParam.DeskOneNum);
            var card = MJCardUpDesk.create3D(cardObj, index);

            if (floor % 2 == 1) {
                card.setScale(0.69);
                var ceng = Math.floor(floor / 2);
                card.y = 35 + 14 * ceng;
                floor = 1;
                var offx = -(card.getContentSize().width * card.getScaleX() * CommonParam.DownCardGap * index + 17 * floor - 1 * floor * CommonParam.DownCardGap * index) - 10;
                if (index > 4) offx += 2 * CommonParam.DownCardGap;
                card.x = offx + floor * card.getContentSize().width * 0.08;
            } else {
                card.setScaleX(0.72);
                card.setScaleY(0.76);
                var ceng = floor / 2;
                floor = 0;
                card.y = -3 + ceng * 14;
                var off = ceng;
                var offx = -(card.getContentSize().width * card.getScaleX() * CommonParam.DownCardGap * index) - 10;
                if (index > 4) offx += 2 * CommonParam.DownCardGap;
                card.x = offx + floor * card.getContentSize().width * 0.08 + off;
            }

            var order = [0, 1, 2, 3, 9, 8, 7, 6, 5, 4];

            var ting = cardObj['ting'];
            if (ting != undefined && ting != null) {
                if (ting == 1) {
                    card.showBlue();
                }
            }
            this.panel_cardOut.addChild(card, order[index] + (1 - floor) * 10);
            this.cardOutArray.push(card);
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
                var Date = {};
                Date['type'] = 'H';
                Date['value'] = 1;
                if (panelLength * 3 + i + 1 == MajhongInfo.MajhongNumber) {
                    card = MJCardUpStand.create3D();
                } else {
                    card = MJCardUpShow.create3D(Date, 0);
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
                width = card.getContentSize().width * card.getScale() * CommonParam.UpCardGap;
                height = card.getContentSize().height * card.getScale() * CommonParam.UpCardHeightGap;
            }

            var num = this.cardOutArray.length;
            var size = this.panel_cardOut.getContentSize();
            if (MajhongInfo.MajhongNumber > 14) {
                var index = num % 9;
                var floor = Math.floor(num / 9);
                return cc.p(0 - index * width + 13, 0 - height * floor);
            }
            else {
                var index = num % 10;
                var floor = Math.floor(num / 10);
                return cc.p(-index * width, -height * floor);
            }
        },

        addMoCard: function () {
            this._super();
            var card = MJCardUpStand.create3D();
            this.moCard = card;
            var length = this.cardInArray.length;
            card.setPosition(this.posMoOfPanel());
            this.panel_cardIn.addChild(card, 20 - length);
        },

        addHu: function (msg) {
            if (MajhongInfo.MajhongNumber > 14) {
                this.gap_stand = 33 * CommonParam.UP17ShowScale;
            }
            this.isAlreadyTing = 1;

            for (var i =0;i<  this.cardInArray.length;i++)
            {
                this.cardInArray[i].removeFromParent();
            }
            this.cardInArray.splice(0,this.cardInArray.length);

            var panelLength = this.getShowPanelCount();
            var huHands = this.getHuCards(msg);
            var handCards = this.getHandCards(msg);
            var handCardLen = this.cardInArray.length;

            for(var i=0;i<handCards.length;i++)
            {
                var cardShow = new MJCardUpShow.create3D(handCards[i],CARD_SITE.RECORD);
                this.panel_cardIn.addChild(cardShow);
                this.cardInArray.push(cardShow);
            }
            this.cardInArray = this.cardInArray.sort(this.sortCardList);
            // this.setHandCardsBack();
            this.resetPanelInChild();
            for (var i = 0; i < huHands.length; i++) {
                var cardShow = MJCardUpShow.create3D(huHands[i], panelLength * 3 + handCardLen + i, CARD_SITE.RECORD);
                cardShow.setPosition(this.posMoOfPanel());
                this.panel_cardIn.addChild(cardShow);
                this.cardInArray.push(cardShow);
            }
        },

        appendCardToPengPanel: function (pengPanel, cardObj, index, isLast) {

            pengPanel.InitCICT = pengPanel.InitCICT || 3; // 初始化 pengPanel 可容纳节点的个数

            var offPos = this.pengPanel.getChildByName("node_offPos").getPosition();
    
            index = index == undefined ? pengPanel.getChildrenCount() : index;
            var card = MJCardUpShow.create3D(cardObj, index);
            var width = card.getContentSize().width;
            var pos = cc.p(offPos.x * index, offPos.y * index);

            var InitCICT = pengPanel.InitCICT;
            if (index >= InitCICT && pengPanel.isSizeAdd) { //有多余初始容纳牌组成是 要扩大size
                var size = pengPanel.getContentSize();
                if(pengPanel.isSizeAddScale){ //在被初始化时的panel 增加size 不需要scale
                    size.width += offPos.x * pengPanel.getScale();
                }else{
                    size.width += offPos.x ;
                } 
                
                pengPanel.setContentSize(size);
            }
            card.setPosition(pos);
            pengPanel.addChild(card, 40 - index, index);

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
            return card;
        },
    });

    return Seat;
}();