var TDKDeskSeat = cc.Layer.extend({
    root: null,
    panel_root: null,
    gap_cardStand: 45,
    ctor: function(data, optTipsNode) {
        this._super();
        this.m_Data = data;
        this.uid = data["uid"];
        this.mOptTipsNode = optTipsNode;
        this.mDeskHead = null;

        this.mCardSetSocre = 0;

        this.mOptTipsNode.setVisible(false);

    },

    initUI: function() {
        var panel_head = ccui.helper.seekWidgetByName(this.root, "panel_head");
        var head = new TDKDeskHead(this.m_Data.player);
        panel_head.addChild(head);

        this.mPanelHead = panel_head;
        this.mDeskHead = head;

        //本轮下注
        this.text_cur_pour = ccui.helper.seekWidgetByName(this.root, "text_cur_pour");
        //已下注
        this.text_end_pour = ccui.helper.seekWidgetByName(this.root, "text_end_pour");
        //提示显示
        this.img_tips = ccui.helper.seekWidgetByName(this.root, "img_tips");

        this.text_pour_score1 = ccui.helper.seekWidgetByName(this.root, "text_pour_score1");
        this.text_pour_score2 = ccui.helper.seekWidgetByName(this.root, "text_pour_score2");
        this.panel_cardIn = ccui.helper.seekWidgetByName(this.root, "panel_cardIn");

        this.mImgBest = ccui.helper.seekWidgetByName(this.root, "img_best");
        this.mImgBest.setVisible(false);

        this.mPanelCardIn = ccui.helper.seekWidgetByName(this.root, "panel_cardIn");

        this.mImgReady = ccui.helper.seekWidgetByName(this.root, "img_ready");
        this.mImgReady.setVisible(false);

        this.mPanelTotalChipIn = ccui.helper.seekWidgetByName(this.root, "panel_cp_pour");
        this.mPanelTotalChipIn.setVisible(false);

        this.mTxtTotalChipIn = ccui.helper.seekWidgetByName(this.mPanelTotalChipIn, "txt_cp_v");

        this.mTextResult = ccui.helper.seekWidgetByName(this.root, "text_result");

        this.mCountDown = ccui.helper.seekWidgetByName(this.root, "count_down");
        var actions = [];
        actions.push(
            cc.fadeTo(0.5, 255 * 0.5)
        );
        actions.push(
            cc.fadeTo(0.5, 255)
        );

        this.mCountDown.runAction(
            cc.repeatForever(
                cc.sequence(actions)
            )
        );
        this.mCountDown.setVisible(false);


        this.reset();

        this.mMoCards = [];
        this.mDPaiQiCards = [];


        if (XYGLogic.Instance.Data.isOffline) {
            this.reBuildOffLine();
        }
    },
    /**
     * 断线重回后的操作
     * 区分不同的状态
     */
    reBuildOffLine: function() {
        var tableStatus = XYGLogic.Instance.Data.tableStatus;
        var playerData = this.m_Data;

        switch (tableStatus) {
            case TDK_TABLESTATUS.INITTABLE:
            case TDK_TABLESTATUS.PLAYING:
            case TDK_TABLESTATUS.GAMERESULT:
                var isAni = false;
                if (playerData.paiQi) {
                    if (playerData.paiQi.num) {
                        var nPaiQis = [];
                        nPaiQis.length = 2;
                        this.addPaiQiCard(nPaiQis, isAni);
                    } else {
                        this.addPaiQiCard(playerData.paiQi, isAni);
                    }
                }

                if (playerData.paiMo) {
                    for (var index = 0; index < playerData.paiMo.length; index++) {
                        this.addMoCard(playerData.paiMo[index], isAni);
                    }
                }

                if (playerData.isOver) {
                    this.showOptTips(TDK_COP_TYPE.OVER);
                }
                break;
            default:
                break;
        }
    },

    onEnter: function() {
        this._super();
        this.registerAllEvents();
    },

    onExit: function() {
        this._super();
        this.isAlreadyTing = 0;
        this.removeAllEvents();
        this.mOptTipsNode.setVisible(false);
    },

    registerAllEvents: function() {
        qp.event.listen(this, 'appDisPEnd', this.checkHandCardSetScore);
        qp.event.listen(this, 'mjChatStatus', this.onReciveChat.bind(this));

    },

    removeAllEvents: function() {
        qp.event.stop(this, 'appDisPEnd');
        qp.event.stop(this, 'mjChatStatus');
    },

    // 检验消息是否是自己的
    checkMsg: function (data) {
        if (data["uid"] == this.uid) {
            return true;
        }
        return false;
    },

    onReciveChat: function (data) {
        JJLog.print(JSON.stringify(data));
        var uid = data['uid'];
        var type = data['data']['type'];
        var index = data['data']['index'];
        var content = data['data']['content'];

        if (uid == this.uid) {
            if (type == CHAT_TYPE.Usual) {
                this.mDeskHead.showMsg(index, content);
            } else {
                this.mDeskHead.showFace(index);
            }
        }
    },

    //获取下注时候  起始位置 世界坐标
    getChipInSWPos: function() {
        var pos = this.mDeskHead.getPosition();
        pos.x += 60;
        pos.y += 100;
        return this.mDeskHead.parent.convertToWorldSpace(pos);
    },

    getCardSetScore: function() {
        return TianDaKeng.Instance.CalScore(this.mMoCards);
    },

    /**、
     * 添加底牌操作
     * paiQis    牌数据
     * isAni     是否显示发牌动画
     */
    addPaiQiCard: function(paiQis, isAni) {
        isAni = isAni == false ? false : true;
        
        for (var i = 0; i < paiQis.length; i++) {
            var pos = cc.p(0, 0);
            var cardIndex = this.mPanelCardIn.getChildrenCount();

            var card = PCardBoxMgr.Instance.createCard(
                this.mPanelCardIn, 
                paiQis[i] || {type: 0,value: 0}, 
                pos, 
                false, 
                isAni,
                this.uid
            );

            var size = card.getContentSize();

            card.x = this.gap_cardStand * cardIndex + size.width / 2;
            card.y = size.height / 2;

            this.mDPaiQiCards.push(card);
        }
    },
    /**、
     * 添加摸到的牌
     * paiQis    牌数据
     * isAni     是否显示发牌动画
     */
    addMoCard: function(paiQi, isAni) {
        isAni = isAni == false ? false : true;

        var cardIndex = this.mPanelCardIn.getChildrenCount();

        var card = PCardBoxMgr.Instance.createCard(
            this.mPanelCardIn, 
            paiQi || {type: 0,value: 0}, 
            cc.p(0, 0), 
            true, 
            isAni
        );
        // RTTag 用于记录 是否为共张的牌
        if (paiQi.isGZ) {
            var nodeTag = card.loadTextureRTTag("res/Game/Poker/TDK/Resoures/large/img_gongzhang.png");
            card.setRTType(true);
            nodeTag.x -= 5;
            nodeTag.y -= 4;
        } else {
            card.setRTType(false);
        }
        var size = card.getContentSize();
        card.x = this.gap_cardStand * cardIndex + size.width / 2;
        card.y = size.height / 2;

        this.mMoCards.push(card);
        
    },
    

    BuildShowOpt: function(optTypes, customData) {

    },

    hideOptTips: function() {
        var actions = [];
        // actions.push(cc.delayTime(1.5));
        actions.push(cc.fadeOut(0.5));
        actions.push(cc.hide());

        this.mOptTipsNode.runAction(
            cc.sequence(actions)
        );
    },
    /**
     * 显示同步玩家操作类型
     */
    showOptTips: function(optData) {
        var optType = optData.cOpType;
        var count = optData.tCount;
        var txtCount = ccui.helper.seekWidgetByName(this.mOptTipsNode, "txt_count");
        txtCount.setVisible(false);
        var tipImgPath = null;
        var isMan = this.m_Data.player.userSex == 1 ? true : false;
        if (optType == TDK_COP_TYPE.TI) {
            tipImgPath = "res/Game/Poker/TDK/Resoures/large/img_qijiao.png";
            sound.playConfigSound("QiJiao", isMan);
        } else if (optType == TDK_COP_TYPE.FT) {
            tipImgPath = "res/Game/Poker/TDK/Resoures/large/img_fanti.png";
            sound.playConfigSound("FanTi", isMan);
            if (count >= 2) {
                txtCount.setVisible(true);
                txtCount.string = "x" + count;
            }
        } else if (optType == TDK_COP_TYPE.PASS) {
            tipImgPath = "res/Game/Poker/TDK/Resoures/large/img_buti.png";
            sound.playConfigSound("BuTi", isMan);
        } else if (optType == TDK_COP_TYPE.CALL) {
            tipImgPath = "res/Game/Poker/TDK/Resoures/large/img_xiazhu.png";
            sound.playConfigSound("JiaZhu", isMan);
        } else if (optType == TDK_COP_TYPE.GZ) {
            tipImgPath = "res/Game/Poker/TDK/Resoures/large/img_genle.png";
            sound.playConfigSound("Gen", isMan);
        } else if (optType == TDK_COP_TYPE.OVER) {
            this.img_tips.setVisible(true);
            this.setHandCardType(false);
            // tipImgPath = "res/Game/Poker/TDK/Resoures/large/img_koule.png";
            sound.playConfigSound("KouP", isMan);
        } else if (optType == TDK_COP_TYPE.SHOW) {
            tipImgPath = "res/Game/Poker/TDK/Resoures/large/img_kanle.png";
            sound.playConfigSound("KaiP", isMan);
        }
        if (tipImgPath && this.mOptTipsNode) {
            this.mOptTipsNode.loadTexture(tipImgPath);

            var actions = [];
            actions.push(cc.fadeIn(0.02));
            actions.push(cc.show());

            // if (optType !== TDK_COP_TYPE.OVER) {
            //     actions.push(cc.delayTime(1.5));
            //     actions.push(cc.fadeOut(0.5));
            //     actions.push(cc.hide());
            // }
            this.mOptTipsNode.stopAllActions();
            this.mOptTipsNode.runAction(
                cc.sequence(actions)
            );
        }

    },
    setHandCardType: function(isOp) {
        var cardFuncKey = undefined;
        if (isOp) {
            cardFuncKey = "showWhite";
        } else {
            cardFuncKey = "showGray";
        }
        this.mDPaiQiCards.forEach(function(card, index) {
            card[cardFuncKey]();
        }, this);
        this.mMoCards.forEach(function(card, index) {
            card[cardFuncKey]();
        }, this);

    },
    /**
     * 检测设置玩家准备状态
     */
    checkReadyStatus: function() {
        var playerData = this.m_Data;
        this.setReadyStatus(playerData.isReady);
    },

    setReadyStatus: function(isReady) {
        this.mImgReady.setVisible(isReady ? true : false);
        this.m_Data.isReady = isReady;
    },

    //当前玩家操作，显示灯光亮
    setOptCurShowLight: function(flag) {
        this.mCountDown.setVisible(flag);
    },

    /**
     * 同步玩家操作   
     * 刷新分数显示
     * 刷新已经下注的筹码显示
     */
    synPlayerOp: function(data) {
        if (data.uid == this.uid) {
            this.showOptTips(data.msg);
        }

        this.setOptCurShowLight(false);

        if (data.msg.coinNum != undefined) {
            this.m_Data.player.coinNum = data.msg.coinNum;
        }

        this.mDeskHead.showScore(this.m_Data.player.coinNum);

        if (data.msg.tableCoins && data.msg.tableCoins.coin) {
            var ownerCoins = data.msg.tableCoins.coin[this.uid] || {};
            var total = 0;
            for (var pourV in ownerCoins) {
                var pourN = ownerCoins[pourV];
                total += parseInt(pourV) * parseInt(pourN);
            }
            this.setTotalPourValue(total);
        }
    },

    /**
     * 设置下注总量
     */
    setTotalPourValue: function(pourV) {
        if (!pourV) return;
        this.mPanelTotalChipIn.setVisible(true);
        this.mTxtTotalChipIn.string = pourV;
    },
    /**
     * 对手牌的分数计算显示
     */
    checkHandCardSetScore: function() {
        this.mCardSetSocre = TianDaKeng.Instance.CalScore(this.mMoCards);
        this.text_pour_score1.string = this.mCardSetSocre;
        this.text_pour_score1.setVisible(true);
    },
    /**
     * 设置同步和最大玩家的分数差值 
     * 以及自己是否是最高的那位
     */
    setDiffHandCardScore: function(score, isBest) {

        if (isBest) {
            this.mImgBest.setVisible(true);
            this.text_pour_score2.setVisible(false);
        } else {
            this.text_pour_score2.string = "(-"+score+")";
            this.mImgBest.setVisible(false);
            this.text_pour_score2.setVisible(true);
        }
    },
    /**
     * 开牌玩家的操作
     */
    showDPaiQi: function(paiQis) {
        if (paiQis instanceof Array) {
            for (var i = 0; i < paiQis.length; i++) {
                var paiQi = paiQis[i];
                var card = this.mDPaiQiCards[i];
                if (card) {
                    card.setCardData(paiQi);
                    card.setCardState(true, true);
                }
            }

            var socre = TianDaKeng.Instance.CalScore([].concat(this.mMoCards, this.mDPaiQiCards));
            this.text_pour_score1.string = socre;
        }
    },

    showResultInfo: function(info) {
        this.showDPaiQi(info.paiQi);
        var changeScore = info.roundCoinNum;
        if(info.winner != 1){ 
            changeScore *= -1;
        }
        this._showWinScore(changeScore);

        this.mPanelTotalChipIn.setVisible(false);
        this.mOptTipsNode.setVisible(false);

        this.text_pour_score2.setVisible(false);
        this.mImgBest.setVisible(false);
    },

    _showWinScore: function(score) {
        this.mTextResult.setVisible(true);

        if (score >= 0) {
            this.mTextResult.string = "+" + score;
            this.mTextResult.setFntFile("res/font/HYDHJAD.fnt");
        } else {
            this.mTextResult.string = score;
            this.mTextResult.setFntFile("res/font/HYDHJ.fnt");
        }

        var actions = [];
        this.mTextResult.setScale(0);
        this.mTextResult.setVisible(true);
        actions.push(
            cc.scaleTo(0.5, 1)
        );

        this.mTextResult.runAction(
            cc.sequence(
                actions
            )
        );
    },

    /**
     * 显示胜利者动画
     */
    showWinnerEffect: function() {
        this.mShenLiAni = util.playSeqFrameAnimation(
            this.mPanelHead,
            cc.p(this.mPanelHead.width / 2 + 4, this.mPanelHead.height / 2),
            TDKPlist.YINGLE_PLIST,
            "ef_yingle",
            cc.size(148, 168),
            8,
            0.15,
            true
        );
    },

    /**
     * 冲锋A动画
     */
    showAPaoEffect: function() {
        util.playSeqFrameAnimation(
            this.mPanelCardIn,
            cc.p(this.mPanelCardIn.width / 2, this.mPanelCardIn.height / 2),
            TDKPlist.APAO_PLIST,
            "apao",
            cc.size(593, 240),
            15,
            0.15,
            false,
            function(target) {
                target.removeFromParent();
            }
        );
    },

    reset: function() {
        this.mPanelCardIn.removeAllChildren();
        
        this.mMoCards = [];
        this.mDPaiQiCards = [];
        this.mPanelTotalChipIn.setVisible(false);
        this.mCardSetSocre = 0;

        this.text_pour_score1.setVisible(false);
        this.text_pour_score2.setVisible(false);

        this.mImgBest.setVisible(false);
        this.mCountDown.setVisible(false);
        this.mOptTipsNode.setVisible(false);

        this.img_tips.setVisible(false);

        if (this.mShenLiAni) {
            this.mShenLiAni.stopAllActions();
            this.mShenLiAni.removeFromParent();
            this.mShenLiAni = null;
        }

        this.mTextResult.setVisible(false);
    },
});