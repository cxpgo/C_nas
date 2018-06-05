var MJPlugInHuan3 = SeatPlugInBase.extend({
    ctor: function (deskSeat){
        this._super();
        this.mDeskSeat = deskSeat;
        this.isHuan3Bool = false;
        this.node_huan3 = util.LoadUI(MJBaseRes.WGHuan3).node;
        this.addChild(this.node_huan3);
        this.node_huan3.setVisible(false);
        
        var btn_huan3 = ccui.helper.seekWidgetByName(this.node_huan3, "btn_huan3");
        btn_huan3.addClickEventListener(this.onPlayerHuan3.bind(this));
        
        Object.defineProperties(this, {
            "cardInArray": {
                get: function () {
                    return this.mDeskSeat.cardInArray;
                }
            },
        });

        var currGame = hall.getPlayingGame().table;
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'mjHuan3Start', this.onHuan3Start.bind(this));
        qp.event.listen(this, 'mjHuan3Status', this.onHuan3Status.bind(this));
        qp.event.listen(this, 'mjHuan3End', this.onHuan3End.bind(this));
    },

    onExit: function () {
        this._super();

        qp.event.stop(this, 'mjHuan3Start');
        qp.event.stop(this, 'mjHuan3Status');
        qp.event.stop(this, 'mjHuan3End');

    },


    onHuan3Start: function (data) {

        this.huan3CardArray = [];
        this.setAllCardTouchEnable(true);
        this.calHuanSanZhang();
        this.node_huan3.setVisible(true);
        this.mDeskSeat.setCardInTouchEnable(true);
    },
    onHuan3Status: function (data) {

        JJLog.print("onHuan3Status" + JSON.stringify(data));
        if (data.uid == this.mDeskSeat.uid) {
            this.mDeskSeat.setCardInTouchEnable(false);
            this.huan3CardArray = [];
            this.setAllCardTouchEnable(false);
            this.node_huan3.setVisible(false);
        }
    },
    onHuan3End: function (data) {
        if (data.uid == this.mDeskSeat.uid) {
            this.node_huan3.setVisible(false);
            this.setAllCardTouchEnable(false);
            this.huan3CardArray = [];
            this.mDeskSeat.setCardInTouchEnable(false);
            this.__Huan3WaitCmd__ = this.optInsertCardWithHuan3.bind(this, data);

            cc.setTimeout(function () {
                if (this.__Huan3WaitCmd__) {
                    this.__Huan3WaitCmd__();
                    this.__Huan3WaitCmd__ == null;
                }
            }.bind(this), 2000);
        }
    },

    onPlayerHuan3: function () {
        sound.playBtnSound();
        var isSame = true;
        var color = null;
        for (var i = 0; i < this.huan3CardArray.length; i++) {
            if (color == null)
                color = this.huan3CardArray[i].paiOfCard().type;
            if (color != this.huan3CardArray[i].paiOfCard().type) {
                isSame = false;
                break;
            }
        }
        if (!isSame || this.huan3CardArray.length != 3)
            return;
        
            this.mDeskSeat.setCardInTouchEnable(false);

        var sendData = {
            "pai": [],
        };

        this.huan3CardArray.forEach(function (element) {
            sendData.pai.push(element.paiOfCard());
        }, this);

        this.node_huan3.setVisible(false);
        this.huan3CardArray.forEach(function (card) {
            if (card) {
                this.mDeskSeat.deleteHandCardWithCard(card);
            }
        }, this);

        this.huan3CardArray = [];

        XYGLogic.net.huan3Pai(sendData, function (data) {
            if (data.code == 200) {
                this.isHuan3Bool = true;
            }
        }.bind(this));
    },


    optInsertCardWithHuan3: function (data) {
        var removeCards = data.del;
        var addCards = data.add;
        var removeLengh = 0;
        if (!this.isHuan3Bool) {
            for (var i = 0; i < removeCards.length; i++) {
                var key = removeCards[i]["type"] + "" + removeCards[i]["value"];
                for (var j = 0; j < this.cardInArray.length; j++) {
                    var card = this.cardInArray[j];
                    if (card.paiOfCard().key == key) {
                        removeLengh++;
                        card.removeFromParent();
                        this.cardInArray.splice(j, 1);
                        break;
                    }
                }
            }

            if (removeLengh < 3 && this.moCard != null) {
                this.mDeskSeat.moCard.removeFromParent();
                this.mDeskSeat.moCard = null;
            }
        }

        var arr = [];
        for (var i = 0; i < addCards.length; i++) {
            var card = this.mDeskSeat.addCardIn(addCards[i]);
            arr.push(card);
        }
        this.mDeskSeat.resetPanelInChild();
        if (this.cardInArray.length == MajhongInfo.MajhongNumber) {
            this.mDeskSeat.moCard = this.cardInArray[this.cardInArray.length - 1];
            this.cardInArray.splice(this.cardInArray.length - 1, 1);
        }

        arr.forEach(function (card) {
            card.playSelectedAnimation();
        }, this);

        cc.setTimeout(function () {
            arr.forEach(function (card) {
                card.playResetAnimation();
            }, this);
        }, 1500);

    },

    calHuanSanZhang: function () {
        //W T B
        var countW = 0;
        var countT = 0;
        var countB = 0;
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            if (card.paiOfCard().keyOfPai().indexOf("W") >= 0) {
                countW++
            } else if (card.paiOfCard().keyOfPai().indexOf("T") >= 0) {
                countT++;
            } else if (card.paiOfCard().keyOfPai().indexOf("B") >= 0) {
                countB++;
            }
        }
        var cardLength = this.cardInArray.length;
        if (this.mDeskSeat.moCard != null) {
            cardLength++;
            if (this.mDeskSeat.moCard.paiOfCard().keyOfPai().indexOf("W") >= 0) {
                countW++
            } else if (this.mDeskSeat.moCard.paiOfCard().keyOfPai().indexOf("T") >= 0) {
                countT++;
            } else if (this.mDeskSeat.moCard.paiOfCard().keyOfPai().indexOf("B") >= 0) {
                countB++;
            }
        }
        var min = Math.min(countW, countT, countB);
        var max = Math.max(countW, countT, countB);
        var mid = cardLength - min - max;
        var list = {"W": countW, "T": countT, "B": countB};
        var que = "W";
        for (var key in list) {
            if (min > 2) {
                if (min == list[key]) {
                    que = key;
                    break;
                }
            } else if (mid > 2) {
                if (mid == list[key]) {
                    que = key;
                    break;
                }
            } else {
                if (max == list[key]) {
                    que = key;
                    break;
                }
            }
        }

        var count = 0;

        this.firstHuan3CardArray = [];
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            if (card.paiOfCard().keyOfPai().indexOf(que) >= 0 && count < 3) {
                this.huan3CardArray.push(card);
                count++;
                card.playSelectedAnimation();
            }
            if (count == 3)
                break;
        }


        if (count == 2 && this.moCard != null) {
            this.mDeskSeat.moCard.playSelectedAnimation();
            this.huan3CardArray.push(this.mDeskSeat.moCard);
        }
    },

    setAllCardTouchEnable: function (bool){
        if(!this.cardInArray) return;
        
        if(bool == false) {
            for (var i = 0; i < this.cardInArray.length; i++) {
                var card = this.cardInArray[i];
                card.rInterceptTouchEvent();
            };
            return;
        };

        var eventCfg = {
            onTouchBegan: this.onCardTouchBegan.bind(this),
            onTouchMoved: this.onCardTouchMove.bind(this),
            onTouchEnded: this.onCardTouchEnd.bind(this)
        };

        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            card.iInterceptTouchEvent(eventCfg);
        };
    },

    onCardTouchBegan: function (card , touch, event) {
        return true;
    },

    onCardTouchMove: function (card , touch, event) {

        return true;
    },
    onCardTouchEnd: function (card , touch, event) {
        var target = card;
        var touchPoint = touch.getLocation();
        var pos = target.convertToNodeSpace(touchPoint);
        
        if (target.isSelected()) {
            this.delWaitHuan3Card(card);
            target.resetCard();
        } else {
            if (target.containsTouchBeginRect(pos)) {
                target.clearMoveCard();
                this.pushWaitHuan3Card(card);
                sound.playSelectCard();
                target.playSelectedAnimation();
            }
        }

        return true;
    },

    pushWaitHuan3Card: function (card) {
        if (!card) return;
        var paiData = card.paiOfCard();
        this.huan3CardArray = this.huan3CardArray || [];
        var curPaiType = null;
        if (this.huan3CardArray[0]) {
            curPaiType = this.huan3CardArray[0].paiOfCard().type;
        }

        if (paiData.type === curPaiType) { //相同牌色
            if (this.huan3CardArray.length === 3) {
                var delHSCard = this.huan3CardArray.shift();
                this.delWaitHuan3Card(delHSCard);
            }
        } else {
            this.mDeskSeat.resetHandCards();
            this.huan3CardArray = [];
        }

        this.huan3CardArray.push(card);
    },

    delWaitHuan3Card: function (card) {
        if (!card) return;

        if (card)
            card.resetCard();

        //移除数组中的牌
        var delIndex = -1;
        for (var index = 0; index < this.huan3CardArray.length; index++) {
            if (card === this.huan3CardArray[index]) {
                delIndex = index;
            }
        }
        if (delIndex >= 0) {
            this.huan3CardArray.splice(delIndex, 1);
        }
    },
});