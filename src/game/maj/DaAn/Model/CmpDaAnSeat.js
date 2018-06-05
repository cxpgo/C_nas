/**
 * 这个组件 仅仅为了处理大安听牌不能打牌、听牌显示的兼容处理
 */
var MJCmpDaAnSeat = {

    registerSelfEvent: function () {
        this._super();
        
        qp.event.listen(this, 'appOnDelMoCard', this.onDelMoCard.bind(this));
    },

    removeSelfEvent: function () {
        this._super();
        qp.event.stop(this, 'appOnDelMoCard');
    },

    registerAllEvents: function () {
        this._super();
        qp.event.listen(this, 'mjShowTing', this.onShowTing.bind(this));
    },

    removeAllEvents: function () {
        this._super();
        qp.event.stop(this, 'mjShowTing');
    },


    initLastCards: function () {
        this._super();
        this.initLastEnd = false;
        var moCard = this.moCard;
        var info = XYGLogic.table.getCardByPlayer(this.uid);
        if(info.showCards){
            this.onShowCards(info.showCards);
        }

        if(info.noDelPai){
            this.onDelCard(info.noDelPai);
        }
        this.moCard = moCard;
        this.initLastEnd = true;
    },
    /**
     * 获取吃碰杠 牌数  {不是牌节点数 ，是常识中麻将数 *3}
     */
    getShowPanelCardCount: function () {
        var len = this._super();
        if(this._mTingShowPanels){
            for (var index = 0; index < this._mTingShowPanels.length; index++) {
                var cs = this._mTingShowPanels[index];
                len += cs.getChildrenCount();
            }
        }
        return len;
    },

    //大安麻将，显示听牌操作
    onShowTing:function (data) {
        JJLog.print("[CmpDaAnSeat] onShowTing :" , JSON.stringify(data));
        //var data = {"showCards":{"showCards":[],"uid":100549,"noDelPai":[{"type":"T","value":5}]}};
        var noDelPai = data['noDelPai'];
        this.onDelCard(noDelPai);

        if(data.uid != this.uid) return;
        var showCards = data['showCards'];
        
        this.onShowCards(showCards);
        
    },

    onShowCards:function (showCards)
    {
        for (var i = 0; i < showCards.length; i++) {
            var tmpCard = showCards[i];
            this.removeHandInCard(tmpCard);
        }
        this.addTingShowCardsPanel(showCards);
        this.resetPanelInChild();
    },

    addTingShowCardsPanel: function (cardArray) {
        var numPanel = this.getShowPanelCount();
        var panelPeng = this.createTingShowCardPanel(cardArray);
        if (panelPeng) {
            panelPeng.index = numPanel;
            this._mTingShowPanels = [];
            this.pengPanelAddTo(this._mTingShowPanels , panelPeng);
        }
    },

    createTingShowCardPanel: function (cardArray) {
        var pengPanel = this.pengPanel.clone();
        pengPanel.isSizeAdd = true;
        var cardALen = cardArray.length
        for (var i = 0; i < cardALen; i++) {
            var card = this.appendCardToPengPanel(pengPanel, cardArray[i], i , i == cardALen - 1);
        }
        pengPanel.isSizeAddScale = true;
        return pengPanel;
    },

    //大安麻将听牌不能打,代码提取
    onDelCard:function (noDelPai) {
        for(var i=0;i<noDelPai.length;i++)
        {
            if(this.noDelPai_arr.length > 0)
            {
                for(var j=0;j<this.noDelPai_arr.length;j++)
                {
                    if(noDelPai[i].type == this.noDelPai_arr[j].type && noDelPai[i].value == this.noDelPai_arr[j].value)
                    {

                    }
                    else
                    {
                        this.noDelPai_arr.push(noDelPai[i]);
                        break;
                    }
                }
            }
            else
            {
                this.noDelPai_arr.push(noDelPai[i]);
            }
        }
        this.noDelPaiFun();
    },

    //大安麻将,别人听牌，你摸到的牌不能打
    onDelMoCard:function (card) {
        var key = card.paiOfCard().keyOfPai();
        for (var i = 0; i < this.noDelPai_arr.length; i++) {
            if (this.noDelPai_arr[i]['type'] + this.noDelPai_arr[i]['value'] == key) {
                card.showGray();
            }
        }
    },

    //大安麻将,别人听牌，你不能打的牌
    noDelPaiFun:function () {
        var cardArry = this.noDelPai_arr;
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            var key = card.paiOfCard().keyOfPai();
            for (var j = 0; j < cardArry.length; j++) {
                if (cardArry[j]['type'] + cardArry[j]['value'] == key) {
                    card.showGray();
                }
            }
        }
    },

    addHu: function (msg){
        if(this._mTingShowPanels){
            for (var index = 0; index < this._mTingShowPanels.length; index++) {
                var cs = this._mTingShowPanels[index];
                cs.removeFromParent();
            }
        }
        this._mTingShowPanels = null;
        this._super(msg);
    } ,

    updatePanelCardSeat: function (showPengChilds) {
        if(this._mTingShowPanels){
            showPengChilds = showPengChilds.concat(this._mTingShowPanels)
        }
        this._super(showPengChilds);
    },

    getPengInsertIndex : function () {
        var tI = this.panel_card_seat.getIndex(this.panel_cardIn);

        if(this._mTingShowPanels && this._mTingShowPanels.length > 0){
            tI = this.panel_card_seat.getIndex(this._mTingShowPanels[0]);
        }

        if (tI <= 0) {
            tI = 0;
        }

        return tI;
    },

    reset:function () {
        if(this._mTingShowPanels){
            for (var index = 0; index < this._mTingShowPanels.length; index++) {
                var cs = this._mTingShowPanels[index];
                cs.removeFromParent();
            }
        }
        this._super();
        this._mTingShowPanels = [];
    },
}