//客户端自动打牌操作
/**
 * 为了兼容之前自动打牌
 */
// var MJSelfSeatAuto2D = null;
var MJSelfSeat2D = function () {
    var _MyCard = MJMyCard;
    var _CarShowUp = MJCardShowUp;
    var Seat = MJSelfSeatBase.extend({

        ctor: function (data) {
            this._super(MJBaseResV2D.PlayerSelf, data, 'selfseat');

            this.gap_stand = 73;
            this.gap_moCard = 0.3;
            this.moCardGap = 18;
        },

        setCardPosOfPengPanel: function (card, index) {
            card.y = 0;
            if (index > 2) {
                card.y = card.getContentSize().height * 0.25;
                card.x = card.getContentSize().width * CommonParam.UpCardGap;
            } else {
                card.x = card.getContentSize().width * CommonParam.UpCardGap * index;
            }
        },

        addCardIn: function (cardObj) {
            var card = _MyCard.create2D(this, cardObj);
            if (hall.getPlayingGame().table.JinPaiId == card.paiOfCard().keyOfPai()) {
                card.setJin();
            }
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
            return card;
        },

        posIndexOfOutCard: function () {
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

            rPos.y = -height * (floor % 2) + (ord * 10);
            
            return rPos
        },

        addCardOut: function (cardObj) {
            // var card = _CarShowUp.create2D(cardObj, CARD_SITE.HAND_OUT);;
            var card = MJCardUpShow.create2D(cardObj, CARD_SITE.HAND_OUT);

            var index = this.cardOutArray.length;
            if (this.deskType == DeskType.RIGHT || this.deskType == DeskType.UP) {
                index = 100 - index;
            }
            this.panel_cardOut.addChild(card, index);
            this.cardOutArray.push(card);
            var pos = this.posIndexOfOutCard();
            card.setPosition(pos);
            return card;
        },

        addMoCard: function (data) {
            this.resetPanelInChild();
            var moPos = this.posMoOfPanel();
            
            var card = _MyCard.create2D(this, data);
            this.moCard = card;
            
            var length = this.cardInArray.length;
            card.setPosition(moPos);
            this.moCard.setCardPosition(moPos);
            var currGame = XYGLogic.table;
            if (MajhongInfo.GameMode == GameMode.PLAY && currGame.isQueCard && currGame.isQueCard(card)) {
                card.xuezhanShowGray();
            }
            this.panel_cardIn.addChild(card, length);
            this.onShowMoPaiTingChoice(card);
        },

        opEvent: function (event) {
            var data = event.getUserData();
            JJLog.print("触摸=" + JSON.stringify(data));
            this.isAction = data;
            if (this.isAction) {
                this.setCardInTouchEnable(false);
            }
        },

        removeHuaPaiCards: function (event) {
            var data = event.getUserData();
            JJLog.print(JSON.stringify(data) + "##################");
            if (!!data.pai) {
                var huapai = data["pai"];
                var spliceCount = 0;
                for (var i = 0; i < huapai.length; i++) {
                    for (var j = this.cardInArray.length - 1; j >= 0; j--) {
                        var card = this.cardInArray[j];
                        if (card.paiOfCard().isHuaPai()) {
                            this.cardInArray.splice(j, 1);
                            card.removeFromParent();
                            spliceCount += 1;
                            break
                        }
                    }
                }

                if (hall.getPlayingGame().table.JinPaiId == null) //起手补花
                {
                    if (this.moCard != null && this.moCard.paiOfCard().isHuaPai() && spliceCount != huapai.length) {
                        var first = huapai.shift();
                        this.moCard.removeFromParent();
                        this.moCard = null;
                        this.addMoCard(first);
                    }

                    for (var i = 0; i < huapai.length; i++) {
                        var card = _MyCard.create2D(this, huapai[i]);
                        card.setPosition((card, i + this.cardInArray.length), 0);
                        this.cardInArray.push(card);
                        this.panel_cardIn.addChild(card);
                    }
                    if (huapai.length > 0) {
                        this.cardInArray = this.cardInArray.sort(this.sortCardList);
                        this.resetPanelInChild();
                    }
                } else //游戏中单张补花
                {
                    if (this.moCard != null && this.moCard.paiOfCard().isHuaPai()) {
                        this.moCard.removeFromParent();
                        this.moCard = null;
                        this.addMoCard(huapai[0]);
                    } else {
                        //  JJLog.print(JSON.stringify(this.cardInArray)+"~~~~~~~~~~~~~~~~~~~");
                        for (var i = 0; i < huapai.length; i++) {
                            var card = _MyCard.create2D(this, huapai[i]);
                            card.setPosition((card, i + this.cardInArray.length), 0);
                            this.cardInArray.push(card);
                            this.panel_cardIn.addChild(card);
                        }
                        this.cardInArray = this.cardInArray.sort(this.sortCardList);
                        this.resetPanelInChild();
                    }
                }
            }
        },
        removeOutHandCard: function (card) {

            for (var i = 0; i < this.cardInArray.length; i++) {
                var tmpCard = this.cardInArray[i];
                if (tmpCard == card) {
                    this.cardInArray.splice(i, 1);
                    card.removeFromParent();
                    // this.resetPanelInChild();
                    break;
                }
            }
        },

        appendCardToPengPanel: function (pengPanel, cardObj , index, isLast) {
            pengPanel.InitCICT = pengPanel.InitCICT || 3; // 初始化 pengPanel 可容纳节点的个数

            index = index == undefined ? pengPanel.getChildrenCount() : index;
            var card = _CarShowUp.create2D(cardObj);
            var width = card.getContentSize().width;
            var wid = (width - 3) 
            card.x = wid* index;
            card.y = 10;

            var InitCICT = pengPanel.InitCICT;
            if (index >= InitCICT && pengPanel.isSizeAdd) { //有四张牌组成是 要扩大size
                var size = pengPanel.getContentSize();
                if(pengPanel.isSizeAddScale){ //在被初始化时的panel 增加size 不需要scale
                    size.width += wid * pengPanel.getScale();
                }else{
                    size.width += wid;
                }
                pengPanel.setContentSize(size);
            }
            if(isLast && index < (InitCICT - 1) ){ //小于初始容纳张牌 要减小size
                var size = pengPanel.getContentSize();
                if(pengPanel.isSizeAddScale){ 
                    size.width -= wid * pengPanel.getScale() * (3 - (index + 1));
                }else{
                    size.width -= wid * (3 - (index + 1));
                }
                pengPanel.setContentSize(size);
                pengPanel.InitCICT = index + 1;
            }
            pengPanel.addChild(card, index, index);
            return card;
        },
    
        addHu: function (msg) {

            for (var i = 0; i < this.cardInArray.length; i++) {
                this.cardInArray[i].removeFromParent();
            }
            this.cardInArray.splice(0, this.cardInArray.length);

            var handCards = this.getHandCards(msg);
            var huHands = this.getHuCards(msg);

            for (var i = 0; i < handCards.length; i++) {
                var cardShow = _CarShowUp.create2D(handCards[i], CARD_SITE.HAND_HU);
                if (MajhongInfo.MajhongNumber > 14) {
                    cardShow.setScale(CommonParam.My17CardStandScale);
                }
                this.panel_cardIn.addChild(cardShow, i);
                this.cardInArray.push(cardShow);
            }
            this.cardInArray = this.cardInArray.sort(this.sortCardList);
            this.resetPanelInChild();

            for (var i = 0; i < huHands.length; i++) {
                var cardShow = _CarShowUp.create2D(huHands[i], CARD_SITE.HAND_HU);
                if (MajhongInfo.MajhongNumber > 14) {
                    cardShow.setScale(CommonParam.My17CardStandScale);
                }
                cardShow.setPosition(this.posMoOfPanel());
                this.panel_cardIn.addChild(cardShow, i + 20);
                this.cardInArray.push(cardShow);
                if (msg.ypdxOrder == 1) {
                    cardShow.showGray();
                }
            }
        },

        getMoCardInsetPos: function (moCard) {
            // var panelLength = this.getShowPanelCount();
            var posXNext = 0;

            var result = {};
            for (var i = 0; i < this.cardInArray.length; i++) {
                var card = this.cardInArray[i];
                if (card == moCard) {
                    var pos = cc.p(posXNext + this.gap_stand * i, 0);

                    if (this.getShowPanelCardCount() + i + 1 == MajhongInfo.MajhongNumber) {
                        card.x += this.gap_stand * this.gap_moCard;
                    }
                    result['pos'] = pos;
                    result['moveLength'] = this.cardInArray.length - i - 1;
                    return result;
                }
            }
            return result;
        },

        playMoPaiInsertCardAnimation: function (moCard) {
            var result = this.getMoCardInsetPos(moCard);
            JJLog.print("result", result);
            if (!result.pos) return;
            var pos = result["pos"];
            var moveLength = result["moveLength"];
            var time = CommonParam.cardMoveTime_0;
            if (moveLength < 5) {
                time = CommonParam.cardMoveTime_0;
            } else if (moveLength < 10) {
                time = CommonParam.cardMoveTime_1;
            } else {
                time = CommonParam.cardMoveTime_2;
            }
            var moveUp = cc.moveBy(CommonParam.cardUpTime, 0, moCard.pos.y + CommonParam.cardUpHeight);
            var moveLeft = cc.moveTo(time, pos.x, moCard.pos.y + CommonParam.cardUpHeight);
            var moveDown = cc.moveTo(CommonParam.cardDownTime, pos.x, this.posYHandInCard);
            var moveDownLeft = cc.moveTo(CommonParam.cardMoveTime_MoCard, pos.x, this.posYHandInCard);
            if (moveLength == 0) {
                moCard.runAction(moveDownLeft);
            } else {
                moCard.runAction(cc.sequence(moveUp, moveLeft, moveDown));
            }
        },

        putOutCardAnimation: function (card) {
            var pai = card.paiOfCard().keyOfPai();
            var newOutCard = this.addCardOut(pai);
            newOutCard.setVisible(false);
            if (this.gangMode == 1) {
                newOutCard.showBlue();
            }
            var outCard = _CarShowUp.create2D(pai, true);
            outCard.setScale(1.2);
            var pos = card.posOfPanel();
            var outPos = this.panel_cardOut.convertToNodeSpace(pos);
            outCard.setPosition(this.posCenterCardOut);
            outCard.setVisible(true);
            this.panel_cardOut.addChild(outCard, 100);

            var length = this.cardOutArray.length;
            var order = this.panel_cardOut.getLocalZOrder();
            this.panel_cardOut.getParent().reorderChild(this.panel_cardOut, order + 10);
            this.panel_cardOut.runAction(cc.sequence(
                cc.delayTime(1.0),
                cc.callFunc(function () {
                    this.panel_cardOut.getParent().reorderChild(this.panel_cardOut, -1);
                }.bind(this))
            ));

            outCard.runAction(cc.sequence(cc.delayTime(CommonParam.ShowDelayTime),
                cc.callFunc(function () {
                    sound.playCardDown();
                }),
                cc.delayTime(0.1),
                cc.callFunc(function () {
                    this.getParent().reorderChild(this, 20 - length);
                    newOutCard.setVisible(true);
                    newOutCard.runIndicator();
                }.bind(outCard)),
                cc.callFunc(function () {
                    outCard.removeFromParent();
                })
            ));
            this.putOutCardEnd(card);
            // this.resetPanelInChild();

        },

    });

    Seat = MJDeskSeatAddCmp(Seat, MJCmpOutCardAni2D);
    return Seat;
}();
