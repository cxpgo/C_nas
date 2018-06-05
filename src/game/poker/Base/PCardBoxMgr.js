/**
 * 发牌创建牌
 * 类似发牌器
 */
var PCardBoxMgr = function () {
    var logic = cc.Class.extend({
        ctor: function (flyCardPanel, mgPos) {
            this.mFlyCardPanel = flyCardPanel;
            this.mMgPos = mgPos;
            this.mWaitDisPCards = [];
            this.mWaitDisPNoAniCards = [];
            this._mCacheCards = [];

            this.mFlyCardPanel.schedule(this.onWaitDisPCard.bind(this), 1 / 30);
            this.mFlyCardPanel.schedule(this.onWaitDisPNoAniCard.bind(this), 1 / 30);

            this.mLockDisP = false;

            //创建 5张牌cache
            for (var i = 0; i < 5; i++) {
                var card = this.getCardForCache(true);
                this.cacheCard(card);
            }
        },

        release: function () {
            this.mFlyCardPanel.unschedule(this.onWaitDisPCard.bind(this));
            this.mFlyCardPanel.unschedule(this.onWaitDisPNoAniCard.bind(this));

        },

        setMgPos: function (mgPos) {
            this.mMgPos = mgPos;
        },

        createCard: function (parent, paiQi, pos, cardState, isAni,uid) {
            var card = new MPokerCard(paiQi, false);
            card.setBackData(uid);
            card.setCardState(cardState);

            card.setPosition(pos);
            parent.addChild(card);
            if (!isAni) {
                this.mWaitDisPNoAniCards.push(card);
            } else {
                card.setVisible(false);
                this.mWaitDisPCards.push(card);
            }
            return card;
        },

        onWaitDisPNoAniCard: function () {
            if (this.mLockDisP || this.mWaitDisPNoAniCards.length == 0) return;

            var card = this.mWaitDisPNoAniCards.shift();
            this.runDisPNoAniCard(card);
        },

        runDisPNoAniCard: function () {
            this.mLockDisP = true;

            if (this.mWaitDisPNoAniCards.length == 0) {
                qp.event.send("appDisPEnd", {});
            }

            this.mLockDisP = false;
        },

        onWaitDisPCard: function () {
            if (this.mLockDisP || this.mWaitDisPCards.length == 0) return;

            var card = this.mWaitDisPCards.shift();
            this.runDisPCardAni(card);
        },

        runDisPCardAni: function (card) {
            if (!card) return;
            this.mLockDisP = true;
            var flyPanel = this.mFlyCardPanel || cc.director.getRunningScene();
            var dt = 0.4;
            var dtFlip = 0.09;

            var flyCard = this.getCardForCache();


            var iPos = card.parent.convertToWorldSpace(card.getPosition());

            var cScale = 0.2;
            var iScale = 1;
            if (card.parent.getScale() != iScale) {
                iScale = card.parent.getScale();
            } else if (card.parent.parent.getScale() != iScale) {
                iScale = card.parent.parent.getScale();
            }

            var cPos = flyPanel.convertToNodeSpace(this.mMgPos);
            iPos = flyPanel.convertToNodeSpace(iPos);
            var size = flyCard.getContentSize();
            size.width *= iScale;
            size.height *= iScale;

            var offSetWidth = Math.abs(iPos.x - cPos.x);
            var offSetHeight = Math.abs(iPos.y - cPos.y);
            var offSet = Math.sqrt(Math.pow(offSetWidth, 2) + Math.pow(offSetHeight, 2));
            dt *= offSet / 890;

            var iRota = 45 * (offSet / 60);
            iRota = iRota - iRota % 45;

            iRota = iRota + 360 - iRota % 360;

            flyCard.setCardState(false);
            flyCard.setScale(cScale);

            var actions = [];

            var rtV = -1;
            var cBX = size.width * cScale;
            var cBY = -size.height * 0.2;

            // cPos.x += cBX;

            if (iPos.x < cPos.x) {
                rtV = 1;
            }

            flyCard.setRotation(iRota * rtV);
            flyCard.setPosition(cPos);


            if (sound.playDPCard) {
                sound.playDPCard();
            }

            actions.push(
                //先抽出牌
                cc.spawn(
                    cc.moveBy(0.05, 0, cBY)
                )
            );
            //debug
            // actions.push(
            //     cc.delayTime(2)
            // );
            actions.push(
                //再发牌
                cc.spawn(
                    cc.sequence(
                        cc.delayTime(dt / 4),
                        cc.callFunc(function (tCard) {
                            this.mLockDisP = false;
                            if (this.mWaitDisPCards.length == 0) {
                                qp.event.send("appDisPEnd", {});
                            }
                        }.bind(this, card))
                    ),
                    cc.moveTo(dt, iPos),
                    cc.scaleTo(dt, iScale),
                    cc.sequence(
                        cc.rotateTo(dt / 3, (-rtV) * (iRota - iRota * 1 / 3)),
                        cc.rotateTo(dt / 3, (-rtV) * (iRota - iRota * 2 / 3)),
                        cc.rotateTo(dt / 3, (-rtV) * (iRota - iRota * 3 / 3))
                    )
                )
            );

            if (card.key != "00" && card.getCardState()) {
                // actions.push(
                //     cc.scaleTo(dtFlip, 0 , iScale)
                // );
                // actions.push(
                //     cc.scaleTo(dtFlip, iScale , iScale)
                // );
            }
            actions.push(
                cc.callFunc(function (tCard) {
                    tCard.setVisible(true);
                }.bind(this, card))
            );

            actions.push(
                cc.callFunc(
                    function (card) {
                        this.cacheCard(card);
                    }.bind(this, flyCard)
                )
            );

            flyCard.runAction(cc.sequence(actions));


        },

        getCardForCache: function (forceN) {
            if (!forceN) {
                var card = this._mCacheCards.shift();
            }

            if (!card) {
                var tempParent = this.mFlyCardPanel;
                card = new MPokerCard({ type: 0, value: 0 }, false);
                tempParent.addChild(card, 1000);
            }
            card.setVisible(true);
            return card;
        },
        cacheCard: function (card) {
            card.setPosition(cc.p(10000, 10000));
            card.setVisible(false);
            if (this._mCacheCards.indexOf(card) < 0) {
                this._mCacheCards.push(card);
            }
        },

    });
    /**
     * 创建
     * 释放
     * 实例访问
     */
    var instance = null;
    /**
     * 
     * @param {cc.p} mgPos    告知发牌器的位置  世界坐标
     */
    var create = function (flyCardPanel, mgPos) {
        if (!instance) {
            instance = new logic(flyCardPanel, mgPos);
        }
        return instance;
    };

    var release = function () {
        if (instance) {
            instance.release();
            instance = null;
        }
    };

    /**
     * 导出接口
     * 每个单例对象都要到处三个接口
     * 一个create、一个release、一个Instance
     */
    var reLogic = {
        create: create,
        release: release
    };

    Object.defineProperty(reLogic, "Instance", {
        get: function () {
            create();
            return instance;
        }
    });

    return reLogic;
}();
