//客户端自动打牌操作
/**
 * 为了兼容之前自动打牌
 */
// var MJSelfSeatAuto = null;
var MJSelfSeat = function () {
    var Seat = MJSelfSeatBase.extend({
        ctor: function (data) {
            this._super(MJBaseResV3D.Player, data, 'selfseat');

            this.ViewType3D = true;

            this.moCardGap = 18;
            this.gap_stand = 89;
            this.gap_moCard = 0.2;
            this.posXHandInCard = 0;
            this.posYHandInCard = 0;
        },

        addCardIn: function (cardObj) {
            JJLog.print("[selfseat] addChild" , JSON.stringify(cardObj) );
            var card = MJMyCard.create3D(this, cardObj);
            if (hall.getPlayingGame().table.JinPaiId == card.paiOfCard().keyOfPai()) {
                card.setJin();
            }
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
            return card;
        },

        addCardOut: function (cardObj) {
            var length = this.cardOutArray.length;
            var index = length % CommonParam.DeskOneNum;
            var floor = Math.floor(length / CommonParam.DeskOneNum);
            var card = MJCardDownDesk.create3D(cardObj, index);
            if (floor % 2 == 0) {
                card.setScaleX(0.91);
                card.setScaleY(0.93);
                card.y = 0;
                var ceng = floor / 2;
                card.y = 18 * ceng;
                floor = 0;
                var offx = card.getContentSize().width * 0.9 * CommonParam.DownCardGap * index - 3;
                if (index > 4) offx -= 2 * CommonParam.DownCardGap;
                card.x = offx - floor * card.getContentSize().width * 0.08 - floor;
            } else {
                card.setScaleX(0.99);
                var ceng = Math.floor(floor / 2);
                card.y = -50 + 18 * ceng;
                floor = 1;
                var offx = card.getContentSize().width * card.getScaleX() * CommonParam.DownCardGap * index - 3 - 7 * floor - 2.7 * floor * CommonParam.DownCardGap * index;
                if (index > 4) offx -= 2 * CommonParam.DownCardGap;
                card.x = offx - floor * card.getContentSize().width * 0.08;
            }
            var order = [4, 5, 6, 7, 8, 9, 3, 2, 1, 0];
            var ting = cardObj['ting'];
            if (ting != undefined && ting != null) {
                if (ting == 1) {
                    card.showBlue();
                }
            }
            this.panel_cardOut.addChild(card, order[index] + floor * 10);
            this.cardOutArray.push(card);
            return card;
        },

        addMoCard: function (data) {
            this.resetPanelInChild();
            var moPos = this.posMoOfPanel();
            var card = MJMyCard.create3D(this, data);
            card.setPosition(moPos);
            this.moCard = card;
            this.moCard.playEnterInAnimation();
            var currGame = hall.getPlayingGame().table;
            if (MajhongInfo.GameMode == GameMode.PLAY && currGame.isQueCard && currGame.isQueCard(card)) {
                card.xuezhanShowGray();
            }
            this.panel_cardIn.addChild(card);
            this.onShowMoPaiTingChoice(card);

            //大安麻将，别人听牌，你摸到不能打的牌逻辑
            qp.event.send("appOnDelMoCard" , card);
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
                        if (card.paiOfCard().isQuanZhouHuaPai()) {
                            this.cardInArray.splice(j, 1);
                            card.removeFromParent();
                            spliceCount += 1;
                            break
                        }
                    }
                }

                if (hall.getPlayingGame().table.JinPaiId == null) //起手补花
                {
                    if (this.moCard != null && this.moCard.paiOfCard().isQuanZhouHuaPai() && spliceCount != huapai.length) {
                        var first = huapai.shift();
                        this.moCard.removeFromParent();
                        this.moCard = null;
                        this.addMoCard(first);
                    }

                    for (var i = 0; i < huapai.length; i++) {
                        var card = MJMyCard.create3D(this, huapai[i]);
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
                    JJLog.print("=====================moCard", this.moCard, this.cardInArray)
                    if (this.moCard != null && this.moCard.paiOfCard().isQuanZhouHuaPai()) {
                        this.moCard.removeFromParent();
                        this.moCard = null;
                        this.addMoCard(huapai[0]);
                    } else {
                        //  JJLog.print(JSON.stringify(this.cardInArray)+"~~~~~~~~~~~~~~~~~~~");
                        for (var i = 0; i < huapai.length; i++) {
                            var card = MJMyCard.create3D(this, huapai[i]);
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

        appendCardToPengPanel: function (pengPanel, cardObj , index, isLast) {

            pengPanel.InitCICT = pengPanel.InitCICT || 3; // 初始化 pengPanel 可容纳节点的个数

            var nodeInx = index == undefined ? pengPanel.getChildrenCount() : index;
            var card = MJCardShowUp.create3D(cardObj);
            var width = card.getContentSize().width;
            var wid = (width - 3) 
            card.x = wid* nodeInx;
            card.y = 10;

            var InitCICT = pengPanel.InitCICT;
            
            if (nodeInx >= InitCICT && pengPanel.isSizeAdd) { //有四张牌组成是 要扩大size
                var size = pengPanel.getContentSize();
                 
                if(pengPanel.isSizeAddScale){ //在被初始化时的panel 增加size 不需要scale
                    size.width += wid * pengPanel.getScale();
                }else{
                    size.width += wid ;
                }  
                pengPanel.setContentSize(size);
            }
            pengPanel.addChild(card, 40 - nodeInx, nodeInx);

            if(isLast && nodeInx < (InitCICT - 1) ){ //小于三张牌 要减小size
                var size = pengPanel.getContentSize();
                if(pengPanel.isSizeAddScale){ 
                    size.width -= wid * pengPanel.getScale() * (3 - (nodeInx + 1));
                }else{
                    size.width -= wid * (3 - (nodeInx + 1));
                }
                pengPanel.setContentSize(size);
                pengPanel.InitCICT = nodeInx + 1;
            }

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
                var cardShow = MJCardShowUp.create3D(handCards[i], CARD_SITE.HAND_HU);
                if (MajhongInfo.MajhongNumber > 14) {
                    cardShow.setScale(CommonParam.My17CardStandScale);
                }
                this.panel_cardIn.addChild(cardShow, i);
                this.cardInArray.push(cardShow);
            }
            this.cardInArray = this.cardInArray.sort(this.sortCardList);
            this.resetPanelInChild();
            
            for (var i = 0; i < huHands.length; i++) {
                var cardShow = MJCardShowUp.create3D(huHands[i], CARD_SITE.HAND_HU);
                if (MajhongInfo.MajhongNumber > 14) {
                    cardShow.setScale(CommonParam.My17CardStandScale);
                }
                cardShow.setPosition(this.posMoOfPanel());
                this.panel_cardIn.addChild(cardShow, i + 20);
                this.cardInArray.push(cardShow);
            }
        },

        getMoCardInsetPos: function (moCard) {
            // var panelLength = this.getShowPanelCount();
            var posXNext = 0;
        
            var result = {};
            for (var i = 0; i < this.cardInArray.length; i++) {
                var card = this.cardInArray[i];
                if (card == moCard) {
                    var pos = cc.p(posXNext + this.gap_stand * i - this.gap_cardStand * i, 0);
                    if (this.getShowPanelCardCount() + i + 1 == MajhongInfo.MajhongNumber) {
                        pos.x += this.moCardGap;
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
            var moveDown = cc.moveTo(CommonParam.cardDownTime, pos.x, 0);
            var moveDownLeft = cc.moveTo(CommonParam.cardMoveTime_MoCard, pos.x, 0);
            if (moveLength == 0) {
                moCard.runAction(moveDownLeft);
            } else {
                moCard.runAction(cc.sequence(moveUp, moveLeft, moveDown));
            }
        },

        putOutCardAnimation: function (card) {
            var pai = card.paiOfCard().keyOfPai();
            var newOutCard = this.addCardOut(pai);
            var move_end_pos = newOutCard.getPosition();
            newOutCard.setVisible(false);
            if (this.gangMode == 1) {
                newOutCard.showBlue();
            }
            var moveCard = newOutCard.panel_card.clone();
            card.end_pos = card.end_pos || card.getPosition();

            var pos = card.parent.convertToWorldSpace(card.end_pos);
            var s_pos = this.panel_cardOut.convertToNodeSpace(pos);
            moveCard.setPosition(s_pos);
            this.panel_cardOut.addChild(moveCard, 100);

            var length = this.cardOutArray.length;
            var order = this.panel_cardOut.getLocalZOrder();
            this.panel_cardOut.getParent().reorderChild(this.panel_cardOut, order + 10);
            this.panel_cardOut.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.callFunc(function () {
                    this.panel_cardOut.getParent().reorderChild(this.panel_cardOut, -1);
                }.bind(this))
            ));

            moveCard.runAction(cc.sequence(cc.moveTo(0.1, move_end_pos.x, move_end_pos.y),
                cc.callFunc(function () {
                    this.getParent().reorderChild(this, 20 - length);
                    this.removeFromParent();
                    newOutCard.setVisible(true);
                    newOutCard.runIndicator();
                    sound.playCardDown();
                    if (MajhongInfo.GameMode == GameMode.RECORD) {
                        hall.getPlayingGame().record.postNextStep();
                    }
                }.bind(moveCard))
            ));
            this.putOutCardEnd(card);
        },
    });
    return Seat;
}();