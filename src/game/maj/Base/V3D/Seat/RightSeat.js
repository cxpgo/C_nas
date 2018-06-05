/**
 * Created by atom on 2016/8/21.
 */
var MJRightSeat = function () {
    var Seat = MJRightSeatBase.extend({
        ctor: function (data) {
            this._super(MJBaseResV3D.Right, data, 'rightseat');
            this.ViewType3D = true;
            this.mHandPosOffR = -Math.tan(65 * Math.PI / 180);
        },

        initUI: function () {
            this._super();
            if (MajhongInfo.MajhongNumber > 14) {
                this.pengPanel.setScale(CommonParam.My17CardShowScale);
            } else {
                this.pengPanel.setScale(CommonParam.My14CardShowScale);
            }
            this.gap_panel = this.pengPanel.width * 0.1 * this.pengPanel.getScale(); //间距
        },

        addCardIn: function (cardObj) {
            var card = MJCardRightStand.create3D();
            var length = this.cardInArray.length;
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card, 20 - length);
        },

        addCardOut: function (cardObj) {
            var length = this.cardOutArray.length;
            var index = length % CommonParam.DeskOneNum;
            var floor = Math.floor(length / CommonParam.DeskOneNum);
            var card = MJCardRightDesk.create3D(cardObj, floor);
            var height = card.getContentSize().height;
            var off = 0;
            if (floor == 0 || floor == 2) {
                var y = (index - index * (index - 1) / 2 * 0.028) * height * 0.55;
                var x = y / -2.5;
                card.setScale(1 - 0.028 * index);
                if (floor == 2) {
                    card.x = x + 18;
                    card.y = y + 35;
                    off = 1;
                } else {
                    card.x = x + 15;
                    card.y = y + 10;
                }
            } else {
                var y = (index - index * (index - 1) / 2 * 0.028) * height * 0.55;
                var x = y / -2.2;
                card.setScale(1 - 0.028 * index);
                card.x = x + 65 + 15;
                card.y = y + 10;
            }
            var ting = cardObj['ting'];
            if (ting != undefined && ting != null) {
                if (ting == 1) {
                    card.showBlue();
                }
            }
            this.panel_cardOut.addChild(card, 40 - length + off * 50);
            this.cardOutArray.push(card);
            return card;
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
                    card = MJCardRightStand.create3D();
                } else {
                    var Date = {};
                    Date['type'] = 'H';
                    Date['value'] = 1;
                    card = MJCardRightShow.create3D(Date);
                    card.setRotationX(5);
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
                width = card.getContentSize().width * card.getScale() * CommonParam.LeftCardWidthGap;
                height = card.getContentSize().height * card.getScale() * CommonParam.LeftCardGap;
            }

            var num = this.cardOutArray.length;

            if (MajhongInfo.MajhongNumber > 14) {
                var index = num % 9;
                var floor = Math.floor(num / 9);
                return cc.p(40 - floor * width, height * index + 6);
            }
            else {
                var index = num % 10;
                var floor = Math.floor(num / 10);
                return cc.p(40 - floor * width, height * index + 6);
            }
        },

        addMoCard: function () {
            this._super();
            var length = this.cardInArray.length;
            var card = MJCardRightStand.create3D(this);

            var lastCard = this.cardInArray[length - 1];
            if(lastCard){
                card.setScale(lastCard.getScale() - 0.05);
            }

            this.moCard = card;
            card.setPosition(this.posMoOfPanel());
            this.panel_cardIn.addChild(card, 20 - length);
        },
        appendCardToPengPanel: function (pengPanel, cardObj, index, isLast) {
            
            pengPanel.InitCICT = pengPanel.InitCICT || 3; // 初始化 pengPanel 可容纳节点的个数

            var offPos = this.pengPanel.getChildByName("node_offPos").getPosition();

            index = index == undefined ? pengPanel.getChildrenCount() : index;
            var card = MJCardRightShow.create3D(cardObj);

            var InitCICT = pengPanel.InitCICT;

            var pos = cc.p(offPos.x * index, offPos.y * index);
            if (index >= InitCICT && pengPanel.isSizeAdd) { //有四张牌组成是 要扩大size
                var size = pengPanel.getContentSize();
                if (pengPanel.isSizeAddScale) { //在被初始化时的panel 增加size 不需要scale
                    size.height += offPos.y * pengPanel.getScale();
                } else {
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
            var k = -Math.tan(61 * Math.PI / 180);
            var zOrder = 100;
            for (var i = 0; i < showPengChilds.length; i++) {
                var panel = showPengChilds[i];
                panel.y = posYNext;
                panel.x = panel.y / k;// + panelOff;

                posYNext += panel.height;
                panel.setLocalZOrder(zOrder --);
            }
        },
        _getHandCardNextP: function () {
            var panelLength = this.getShowPanelCount();
            var panelHeight = this.pengPanel.getContentSize().height * this.pengPanel.getScale() * 0.98;

            var handPosY = panelHeight * this.getFinal(1, panelLength, -this.showOffScale) / 2;
            return handPosY;
        },
        resetPanelInChild: function () {
            this.updatePanelCardSeat([].concat(this.buzhangPanelArray).concat(this.pengPanelArray).concat(this.chiPanelArray));

            var kk = this.mHandPosOffR;
            var panelLength = this.getShowPanelCount();
            var handPosY = this._getHandCardNextP();

            var add = 1;
            var offwidth = 16;
            if (MajhongInfo.MajhongNumber > 14) {
                offwidth = 16 * CommonParam.Other17CardStandScale;
            }
            if (MajhongInfo.GameMode == GameMode.RECORD) {
                this.cardInArray = this.cardInArray.sort(this.sortCardList);
                if (this.cardInArray.length == MajhongInfo.MajhongNumber) add = 0;
            }
            for (var i = 0; i < this.cardInArray.length; i++) {
                var handPosX = handPosY / kk;
                var card = this.cardInArray[i];
                card.setScale(this.startScale + panelLength * 0.02 + (this.cardInArray.length - i + add) * (1 - this.startScale) / MajhongInfo.MajhongNumber);
                card.y = handPosY - 20;

                // if (this.isAlreadyTing > 0) {
                //     card.x = handPosX - i * 3.2 - 5;
                // } else {
                    card.x = handPosX - i * 2.2;
                // }
                handPosX -= offwidth * card.getScale() * 0.95;
                if (this.getShowPanelCardCount() + i + 1 == MajhongInfo.MajhongNumber) {
                    card.setScale(this.cardInArray[this.cardInArray.length - 2].getScale() - 0.05);
                    card.setPosition(this.posMoOfPanel())
                }

                handPosY = handPosX * kk;
                this.panel_cardIn.reorderChild(card, 40 - i);
            }
            if (!!this.moCard) {
                this.moCard.setPosition(this.posMoOfPanel());
            }
        },

        //摸牌位置
        posMoOfPanel: function () {
            var card = this.getHandLastCard();
            if(card){
                // if (this.isAlreadyTing > 0) {
                //     return cc.p(card.x - card.getContentSize().width * card.getScaleX() * 0.15, card.y + card.getContentSize().height * card.getScaleY() * 0.5);
                // } else {
                    return cc.p(card.x - card.getContentSize().width * card.getScaleX() * 0.36, card.y + card.getContentSize().height * card.getScaleY() * 0.5);
                // }
            }
            var handPosY = this._getHandCardNextP();
            var kk = this.mHandPosOffR;
            return cc.p(handPosY / kk , handPosY - 20);
        },

        addHu: function (msg) {

            this.isAlreadyTing = 1;
            for (var i =0;i<  this.cardInArray.length;i++)
            {
                this.cardInArray[i].removeFromParent();
            }
            this.cardInArray.splice(0,this.cardInArray.length);
            var huHands = this.getHuCards(msg);

            var handCards = this.getHandCards(msg);
            for(var i=0;i<handCards.length;i++)
            {
                var cardShow = new MJCardRightShow.create3D(handCards[i],CARD_SITE.RECORD);
                this.panel_cardIn.addChild(cardShow);
                this.cardInArray.push(cardShow);
            }
            this.cardInArray = this.cardInArray.sort(this.sortCardList);
            this.resetPanelInChild();

            var length = this.cardInArray.length;
            for (var i = 0; i < huHands.length && length > 0; i++) {
                var cardShow = MJCardRightShow.create3D(huHands[i], CARD_SITE.RECORD);
                cardShow.setRotationX(5);
                cardShow.setScale(this.cardInArray[length - 1].getScale() - 0.05);
                cardShow.setPosition(this.recordMoCardPos());
                this.panel_cardIn.addChild(cardShow, 40 - length - i);
                // cardShow.y = cardShow.y + 12;
                // cardShow.x = cardShow.x - 5;
                this.cardInArray.push(cardShow);
            }
        },

        recordMoCardPos:function(){
            var card = this.cardInArray[this.cardInArray.length-1];
            return cc.p(card.x-card.getContentSize().width*card.getScaleX()*0.22,card.y+card.getContentSize().height*card.getScaleY()*0.6);
        },
    });
    return Seat;
}();