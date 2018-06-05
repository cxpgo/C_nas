/**
 * Created by atom on 2016/8/21.
 */
//                    0  A  2  3  4  5  6  7  8  9  10 J  Q  K
var compare =       [0, 12, 13,1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,14];
//用于还原大小的数组
var uncompare=      [0, 3, 4, 5, 6, 7, 8, 9,10,11,12,13, 1, 2];

var PISACOUNT = 16;									//每个玩家的牌数

var PaoDeskSeat = cc.Layer.extend({
    root: null,
    panel_root: null,
    panel_cardIn: null,             // 显示玩家手中的牌
    panel_cardOut: null,            // 显示玩家打出去的牌
    cardInArray: null,              // 玩家手中的牌
    cardOutArray: null,             // 玩家打出去的牌
    lastOpPai:{"cards":[],'type':PuKeType.CT_ERROR},
    image_tip:null,
    uid: 0,                         // 玩家的ID
    cardInList: null,//xianshi
    deskType: DeskType.Other,
    info: '',                       // 标识哪个位置的玩家
    sexType: 2,
    b_first:true,
    isA3Bomb: 1,		// 3a是否是炸弹

    ctor: function (data, info) {
        this._super();
        this.info = info;
        this.uid = data["uid"];
        if (MajhongInfo.GameMode == GameMode.PLAY)
        {
            this.sexType = data['userSex'];
        }
        else if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.sexType = 1;
        }

        this.cardOutArray = new Array();
        this.cardInArray = new Array();
        this.cardInList = new Array();
    },

    initUI:function()
    {
        this.panel_root = ccui.helper.seekWidgetByName(this.root, "panel_root");
        this.panel_cardIn = ccui.helper.seekWidgetByName(this.panel_root, "panel_card_show");
        if (MajhongInfo.GameMode == GameMode.RECORD) {
            this.panel_cardIn = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardIn");
        }
        this.panel_cardOut = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardOut");
        this.image_tip = ccui.helper.seekWidgetByName(this.panel_root, "Image_tip");

        this.txt_cardNum = ccui.helper.seekWidgetByName(this.panel_root, "txt_cardNum");
        this.resetCardNum();

        this.panelHead = ccui.helper.seekWidgetByName(this.root, "panel_head");
        this.mDeskHead = new PDKDeskHead(XYGLogic.Instance.uidOfInfo(this.uid));
        this.panelHead.addChild(this.mDeskHead, 1, 1);

        // var img_zb = ccui.helper.seekWidgetByName(this.mRoot, "img_zb");
        // img_zb.setVisible(true);
        // this.getReadyState();
        // var frame = ccui.helper.seekWidgetByName(this.panelHead, "image_frame");
        // frame.setVisible(false);

        var clockView = ccui.helper.seekWidgetByName(this.panelHead, "image0");
        this.mClockCtrl = new ClockCtrl(clockView);
        this.addChild(this.mClockCtrl);//只用于内存管理
    },

    onEnter: function () {
        this._super();
        this.initUI();
        if (MajhongInfo.GameMode == GameMode.PLAY)
        {
            this.registerAllEvents();
            this.panel_cardOut.setScale(0.5);
        }
        else if (MajhongInfo.GameMode == GameMode.RECORD)
        {
            this.initRecordHandCards();
            this.registerRecordEvent();
            this.panel_cardOut.setScale(0.5);
        }
    },

    getSpriteHeadPos: function () {
        return this.panelHead.getPosition();
    },

    onExit: function () {
        this._super();
        if (MajhongInfo.GameMode == GameMode.PLAY)
        {
            this.removeAllEvents();
        }
        else if (MajhongInfo.GameMode == GameMode.RECORD)
        {
            this.removeRecordEvent();
            this.removeAllParam();
        }
    },

    getSelfReady: function () {

    },

    getReadyState: function () {
        this.panelWait.setVisible(true);
        var img_zb = ccui.helper.seekWidgetByName(this.mRoot, "img_zb");
        if (XYGLogic.Instance.getReady[this.uid]) {
            img_zb.setVisible(true);
        }
        else {
            img_zb.setVisible(false);
        }
    },
    setReadyState: function (data) {
        var status = data['readyStatus'];//0,1
        if (status == 1) {
            this.panelWait.setVisible(true);
            var img_zb = ccui.helper.seekWidgetByName(this.mRoot, "img_zb");
            img_zb.setVisible(true);
        } else {
            this.panelWait.setVisible(false);
        }
        XYGLogic.Instance.getReady[data.uid] = data.readyStatus;
    },

    removeAllParam: function () {
        this.cardInArray.splice(0,this.cardInArray.length);
        this.cardInArray = null;
        this.cardOutArray.splice(0,this.cardOutArray.length );
        this.cardOutArray = null;
    },

    // 注册事件
    registerAllEvents: function () {
        // 发牌
        qp.event.listen(this, 'mjSendHandCards', this.onSendHandCards.bind(this));
        // 通知出牌
        qp.event.listen(this, 'mjNotifyDelCards', this.onNotifyDelCards.bind(this));
        // 同步出牌
        qp.event.listen(this, 'mjSyncDelCards', this.onSyncDelCards.bind(this));
    },

    // 移除事件
    removeAllEvents: function () {
        qp.event.stop(this, 'mjSendHandCards');
        qp.event.stop(this, 'mjNotifyDelCards');
        qp.event.stop(this, 'mjSyncDelCards');
    },

    // 检验消息是否是自己的
    checkMsg: function (data) {
        if (data["uid"] == this.uid) {
            return true;
        }
        return false;
    },

    // 发牌
    onSendHandCards: function (data) {
        this.b_first = true;
        this.setHandCards(data);
    },

    setHandCards: function (cards) {
        // todo

        this.panel_cardIn.removeAllChildren();
        this.cardInArray = [];
        // if (!!XYGLogic.Instance && XYGLogic.Instance.showNum == 1) {
        //     var length = cards.length;
        // } else {
        //     var length = XYGLogic.Instance.mode;
        // }
        for (var p = 0; p < cards.length; p++) {
            var card = new MyPokerCard(this, { type: 0x00, value: 0x00 } , this.uid === hall.user.uid);
            card.setBackData(this.uid);
            card.setVisible(false);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
        }
        this.resetPanelInChild();
        this.runCardsAnimation();
    },
    runCardsAnimation: function (){
        var delTime = 0.05;
        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            var minLength = Math.min(3,this.cardInArray.length);
            var revertTime =  minLength* delTime + delTime * (minLength - 1 - i);
            card.runAction(cc.sequence(cc.delayTime(revertTime), cc.show(), cc.fadeIn(delTime)));
        }
    },

    onNotifyDelCards: function (data) {
        JJLog.print("DeskSeat onNotifyDelCards");
        if (data['uid'] != this.uid) return;
        // 轮到我出牌了
        // 清除上次出的牌
        this.mClockCtrl.countDown("GiveCards" , 9);
        this.image_tip.setVisible(false);
        this.panel_cardOut.removeAllChildren();
        this.cardOutArray.splice(0,this.cardOutArray.length );
    },

    // 同步出牌
    onSyncDelCards: function (data) {
        JJLog.print("onSyncDelCards="+JSON.stringify(data));
        this.b_first = false;
        if (this.checkMsg(data)) {
            this.mClockCtrl.stop("GiveCards");
            this.cardInList.push(data['msg']);
            this.addCardOut(data['msg']);
            this.removePutOutCard(data['msg']);
            this.resetPanelInChild();

            if(data['msg'].length == 0)
                this.image_tip.setVisible(true);

            var cardSound = {sex:this.sexType,cardsType:data.opCardType,cards:data['msg']};
            sound.playPokerCard2(cardSound, data.uid == XYGLogic.Instance.lastOpUid);

            if(data['msg'].length > 0)
            {
                XYGLogic.Instance.lastOpUid = data.uid;
            }

            qp.event.send('playerPainum',{uid:data['uid'],painum:this.cardInArray.length});
            this.resetCardNum();
            if(this.cardInArray.length == 1 && data['msg'].length > 0)
            {
                var soundData = {};
                soundData['userSex'] = this.sexType;
                soundData['index'] = 11;
                sound.playPokerMsg(soundData);
            }
        }
        else
        {
            if(data['msg'].length > 0)
            {
                this.lastOpPai.cards = data['msg'];
                this.lastOpPai.type = data['opCardType'];
            }
        }
    },

    // 获取剩余的牌数量
    getHandCardsCount:function () {
        return this.cardInArray.length;
    },

    forceDisconnect:function () {
        cc.setTimeout(function() {
            var pomelo = window.pomelo;
            if (pomelo.connectState != 'disconnected') {
                pomelo.disconnect();
            }
        }, 100);
    },

    addHu: function (opCard) {

    },

    removeOutCard: function (msg) {
        var cardValue = msg["type"] + msg["value"];
        for (var i = this.cardOutArray.length - 1; i >= 0; i--) {
            var tmpCard = this.cardOutArray[i];
            if (cardValue == tmpCard.paiOfCard().keyOfPai()) {
                this.cardOutArray.splice(i, 1);
                tmpCard.removeFromParent();
                break;
            }
        }
    },

    putOutCard: function (data) {
        //todo

    },

    removePutOutCard: function (pais) {
        for(var i =0;i<pais.length;i++)
        {
            var last = this.cardInArray.length - 1;
            var card = this.cardInArray[last];
            if (card != null && card != undefined) {
                this.cardInArray.splice(last, 1);
            }
        }
    },

    resetPanelInChild: function () {
        //todo
        var posXNext = 40;
        var posIntel = 20;  //牌间隔
        var maxShowCount = 3;
        this.maxCardLength = Math.min(maxShowCount , this.cardInArray.length);
        // 起始位置的计算，保证剩余的牌都在正中间
        posXNext += (- 1) * (posIntel / 2);

        for (var i = 0; i < this.cardInArray.length; i++) {
            var card = this.cardInArray[i];
            var cardSize = card.getContentSize();
            card.x = 0;

            var zorder = 100 - i;
            var offX = i;
            if(i >= maxShowCount){
                zorder = i-maxShowCount+1 ;
                offX = maxShowCount;

            }
            card.y = posXNext + posIntel * offX;
            card.setLocalZOrder(zorder);
        }
        this.resetCardNum();
    },

    recordResetPanelInChild: function () {

    },

    sortCardList: function (cardA, cardB) {
        return cardB.paiOfCard().numOfPai() - cardA.paiOfCard().numOfPai();
    },
    //
    getCardsFromData: function (data) {
        var pais = data['paiQi'];
        var arr = new Array();
        if (this.deskType == DeskType.Other) {
            for (var i = 0; i < data['paiQi']['num']; i++) {
                // arr.push('0');
                arr.push({ type: 0x00, value: 0x00 });
            }
            return arr;
        } else {

            for (var tag in pais) {
                var infoArray = pais[tag];
                arr.push(infoArray);
            }
            return arr;
        }
    },
    resetCardNum: function () {
        if (this.txt_cardNum) {
            if(!!XYGLogic.Instance && XYGLogic.Instance.showNum == 1)
            {
                if(this.getHandCardsCount() > 0){
                    this.txt_cardNum.setVisible(true);
                    this.txt_cardNum.string = this.getHandCardsCount();
                }else{
                    this.txt_cardNum.setVisible(false);
                }
            }
            else
            {
                this.txt_cardNum.setVisible(false);
            }
        }
    },

    checkOffline: function () {
        if (XYGLogic.Instance.isOffline) {
            this.initLastCards();
        }
    },

    initLastCards: function () {
        var info = XYGLogic.Instance.getCardByPlayer(this.uid);
        if (!info) return;
        var lastOpData = XYGLogic.Instance.offLineInfo['lastOP'];
        var nextChuPai = XYGLogic.Instance.offLineInfo['nextChuPai']

        var paiChu = info['paiChu'];
        this.cardInList = paiChu;
        this.b_first = info["first"] == 1;
        if(paiChu.length > 0 && nextChuPai != this.uid)
        {
            var cardOuts = paiChu[paiChu.length-1];
            this.addCardOut(cardOuts);
            this.image_tip.setVisible(cardOuts.length == 0);
        }

        if(lastOpData != null) {
            this.lastOpPai.cards = lastOpData.opCard;
            this.lastOpPai.type = lastOpData.opCardType;
        }

        var cardArray = this.getCardsFromData(info);
        this.setHandCards(cardArray);
        this.resetPanelInChild();
    },

    addCardIn: function (cardObj) {
        this.cardInArray.push(cardObj);
    },

    addCardOut: function (cardObj) {

    },

    cardOfString: function (cardObj) {
        return cardObj['type'] + cardObj['value'];
    },

    getHuCards:function(msg)
    {
        var cards = new Array();
        for(var i=0;i<msg['cards'].length;i++)
        {
            var data = msg['cards'][i];
            var data2 = data['pais'];
            for(var j=0;j< data2.length;j++)
            {
                var obj = data2[j];
                var isContains = false;
                for (var k = 0; k < cards.length;k++)
                {
                    if (this.cardOfString(obj) == this.cardOfString(cards[k]))
                    {
                        isContains = true;
                        break;
                    }
                }
                if(!isContains)
                {
                    cards.push(obj);
                }
            }
        }
        return cards;
    },

    getHandCards:function(msg)
    {
        var info = msg['selfPaiQi'];
        var huCards = this.getHuCards(msg);

        var cards = new Array();
        for(var typeTag in info)
        {
            var data = info[typeTag];
            for(var i=0;i<data.length;i++)
            {
                var cardObj = data[i];
                var cardStr = this.cardOfString(data[i]);
                var isAdd = true;
                if(isAdd) cards.push(cardObj);
            }
        }

        return cards;
    },

    //记录=======================
    removeOutHandCard: function (pais) {
        for(var i = 0 ;i<pais.length;i++)
        {
            for (var j =0;j<this.cardInArray.length;j++)
            {
                var tmpCard = this.cardInArray[j];
                if(tmpCard.key == pais[i].type+""+pais[i].value)
                {
                    this.cardInArray.splice(j, 1);
                    tmpCard.removeFromParent();
                    break;
                }
            }
        }
        this.recordResetPanelInChild();
        this.postNextStep();
    },

    postNextStep: function () {
        var dtime = 0.5;
        this.schedule(this.delayStep, dtime);
    },

    delayStep: function (dt) {
        this.unschedule(this.delayStep);
        PDKPoker.record.postNextStep();
    },

    //出牌判断
    SearchOutCard : function(Cards,OutCardResult)
    {
        var bCardCount = Cards.length;
        //设置结果
        OutCardResult.cbResultCard = [];
        OutCardResult.cbCardCount = 0;
        if ( bCardCount == 0) return false;

        var playerCards = [];
        for (var i = bCardCount-1 ; i>=0;i-- )
        {
            playerCards.push({type:Cards[i].type,value:Cards[i].value});
        }

        if(bCardCount > 4 )
        {
            //找顺子
            for (var i=0;i<bCardCount;i++)
            {
                //获取数值
                var bHandLogicValue=compare[playerCards[i].value];
                //构造判断
                if (bHandLogicValue>=12) break;
                //搜索连牌
                var bLineCount=0;
                for (var j=i;j<bCardCount;j++)
                {
                    if (compare[playerCards[j].value]>=13) break;
                    if ((compare[playerCards[j].value]-bLineCount)==bHandLogicValue)
                    {
                        //增加连数
                        OutCardResult.cbResultCard[bLineCount++]=playerCards[j];
                        OutCardResult.cbCardCount=bLineCount;
                    }
                }
                if(bLineCount > 4)
                {
                    return true;
                }
            }
            OutCardResult.cbResultCard = [];
        }

        if(bCardCount>2)
        {
            //搜索三同  三代一 三代二 飞机
            for (var i=0;i<bCardCount;i++)
            {
                //获取数值
                var bHandLogicValue=compare[playerCards[i].value];
                if (bHandLogicValue>=13) break;

                //搜索连牌
                var bLineCount=0;
                for (var j=i;j<(bCardCount-2);j++)
                {
                    //三牌判断
                    if ((compare[playerCards[j].value]-bLineCount)!=bHandLogicValue) continue;
                    if ((compare[playerCards[j+1].value]-bLineCount)!=bHandLogicValue) continue;
                    if ((compare[playerCards[j+2].value]-bLineCount)!=bHandLogicValue) continue;
                    //增加连数
                    OutCardResult.cbResultCard[bLineCount*3]=playerCards[j];
                    OutCardResult.cbResultCard[bLineCount*3+1]=playerCards[j+1];
                    OutCardResult.cbResultCard[(bLineCount++)*3+2]=playerCards[j+2];
                }

                if(bLineCount > 0)
                {
                    var temp = [];
                    playerCards.forEach(function (el) {
                        temp.push({type:el.type,value:el.value})
                    });

                    for(var k=0;k<OutCardResult.cbResultCard.length;k+=3)
                    {
                        for (var l =0;l<temp.length;l++)
                        {
                            if(temp[l].type == OutCardResult.cbResultCard[k].type && temp[l].value == OutCardResult.cbResultCard[k].value)
                            {
                                temp.splice(l,3);
                                break;
                            }
                        }
                    }

                    var singleRet = [];
                    var leftCount = bLineCount*2;
                    if(leftCount > temp.length)
                    {
                        for (var l=0;l<temp.length;l++)
                        {
                            OutCardResult.cbResultCard.push(temp[l])
                        }
                        OutCardResult.cbCardCount= bLineCount*3+temp.length;
                        return true;
                    }
                    else if(this._selectSingle(0,temp,singleRet,leftCount))
                    {
                        OutCardResult.cbCardCount= bLineCount*5;
                        for(var l=0;l<singleRet.length;l++)
                        {
                            OutCardResult.cbResultCard.push(singleRet[l][0]);
                        }
                        return true;
                    }
                }
            }
            OutCardResult.cbResultCard = [];
        }

        //找 对子 连对
        for (var i=0;i<bCardCount;i++)
        {
            //获取数值
            var bHandLogicValue= compare[playerCards[i].value];
            if (bHandLogicValue>=13) break;

            //搜索连牌
            var bLineCount=0;
            for (var j=i;j<(bCardCount-1);j++)
            {
                if (((compare[playerCards[j].value]-bLineCount)==bHandLogicValue)
                    &&((compare[playerCards[j+1].value]-bLineCount)==bHandLogicValue))
                {
                    //增加连数
                    OutCardResult.cbResultCard[bLineCount*2]=playerCards[j];
                    OutCardResult.cbResultCard[(bLineCount++)*2+1]=playerCards[j+1];
                }
            }
            //完成判断
            if (bLineCount > 0)
            {
                OutCardResult.cbCardCount=bLineCount*2;
                return true;
            }
        }
        OutCardResult.cbResultCard = [];

        //找单
        if(bCardCount > 0)
        {
            OutCardResult.cbResultCard[0] = playerCards[0];
            OutCardResult.cbCardCount = 1;
            return true;
        }
        return false;
    },

    //判断牌中是否为连对，返回的PisaCount是最大牌值
    IsContinue2 : function(pisa,PisaPoint){
        //必须要2对以上
        if (pisa.length<4) return false;
        if (!this.IsContinue(pisa,PisaPoint,2)) return false;
        for(var i=0;i<pisa.length;i++)
        {
            //2不能出现在连对上
            if (pisa[i].value==2) return false;
        }
        return true;
    },

    Is3ABomb: function (pisa,PisaPoint) {
        if (this.isA3Bomb != 1) return false;
        if (pisa.length != 3) return false;
        var aVal = 1;
        var maxline=pisa[0].type;
        for(var i=0;i < pisa.length;i++)
        {
            if (pisa[i].value != aVal)
                return false;
            if (pisa[i].type > maxline)
                maxline=pisa[i].type;
        }
        PisaPoint.count= pisa.length;
        PisaPoint.type = maxline;
        PisaPoint.value = aVal;
        return true;
    },
    //判断牌中是否为炸弹，返回的Count是张数，PisaPoint
    IsBomb : function(pisa,PisaPoint){
        if (pisa.length == 3) {
            return this.Is3ABomb(pisa,PisaPoint);
        }
        else if (pisa.length == 4) {
            var row= pisa[0].value;
            var maxline=pisa[0].type;
            for(var i=1;i < pisa.length;i++)
            {
                if (pisa[i].value != row)
                    return false;
                if (pisa[i].type > maxline)
                    maxline=pisa[i].type;
            }
            PisaPoint.count=pisa.length;
            PisaPoint.type = maxline;
            PisaPoint.value = row;
            return true;
        }
        else {
            return false;
        }
    },

//判断牌中是否为连三同张，返回的PisaCount是最大牌值
    IsContinue3 : function(pisa,PisaPoint){
        //必须要3个连三同张以上 AAA3334445   AA3334445 33334445  A333444
        if (pisa.length<6) return false;
        var begin = 0;
        var end = 0;
        for(var i=0;i<pisa.length-3;i++) {
            if(pisa[i].value == pisa[i+1].value && pisa[i].value == pisa[i+2].value && this.IsNeighbor(pisa[i].value,pisa[i+3].value))
            {
                begin = i;
                break;
            }
        }

        for(var i=pisa.length - 1;i > 2;i--) {
            if(pisa[i].value == pisa[i-1].value && pisa[i].value == pisa[i-2].value && this.IsNeighbor(pisa[i-3].value,pisa[i].value))
            {
                end = i;
                break;
            }
        }
        var temp = pisa.slice(begin,end+1);
        if (temp.length<6) return false;
        JJLog.print("飞机原型%j",JSON.stringify(temp));
        if (this.IsContinue(temp,PisaPoint,3) && temp.length/3*2 >= (pisa.length - temp.length))
        {
            PisaPoint.count = temp.length/3;
            return true;
        }
        JJLog.print("不是飞机,牌出问题了",JSON.stringify(pisa));
        return false;
    },

    //判断牌中是否为顺子，返回的PisaCount是最大牌值，bSameColor表示是否为同花顺
    IsStraight : function(pisa,PisaPoint){
        //顺子必须5张以上
        if (pisa.length<5) return false;
        if (!this.IsContinue(pisa,PisaPoint,1)) return false;
        for(var i=0;i<pisa.length;i++)
        {
            //2不能出现在顺子上
            if (pisa[i].value==2) return false;
        }
        var line =pisa[0].type;
        var bSameColor = true;
        for(i=1;i<pisa.length;i++)
        {
            if (pisa[i].type!=line)
            {
                bSameColor=false;
                break;
            }
        }
        PisaPoint.bSameColor = bSameColor;
        return true;
    },

    //判断牌中是否为三连二，返回的PisaCount是最大牌值
    Is3And2 : function(pisa,PisaPoint){
        //三连二必须是5张
        if (pisa.length != 5 )  return false;
        //开始两张或结尾两张必须一样 AAAQK QAAAK QKAAA
        if(pisa[0].value == pisa[2].value || pisa[1].value==pisa[3].value || pisa[2].value==pisa[4].value)
        {
            PisaPoint.type = pisa[2].type;
            PisaPoint.value = pisa[2].value;
            return true;
        }
        return false;
    },

//判断牌中是否为三连一，返回的PisaCount是最大牌值
    Is3And1 : function(pisa,PisaPoint){
        //三连二必须是4张
        if ( pisa.length!=4) return false;
        //开始两张或结尾两张必须一样 AAAK KAAA
        if(pisa[0].value == pisa[2].value || pisa[1].value == pisa[3].value)
        {
            PisaPoint.type = pisa[2].type;
            PisaPoint.value = pisa[2].value;
            return true;
        }
        return false;
    },

//判断牌中是否为四连三，返回的PisaCount是最大牌值
    Is4And3 : function(pisa,PisaPoint){
        //三连二必须是5张或4张
        if (pisa.length < 5 || pisa.length > 7) return false;
        //开始两张或结尾两张必须一样 JQKAAAA JQAAAAK JAAAAQK AAAAJQK
        if (this.GetPisaCount(pisa,pisa[3].value) == 4)
        {
            PisaPoint.type = pisa[3].type;
            PisaPoint.value = pisa[3].value;
            return true;
        }
        return false;
    },

//判断牌中是否为蝴蝶牌型，返回的PisaCount是最大牌值
    IsButterfly : function(pisa,PisaPoint){
        //蝴蝶必须是15张
        if (pisa.length!=15) return false;
        var  p1 = {};
        var  p2 = {};
        var  Pisa = {};
        var  Pisa1 = {};
        //假设是三张的在前
        // p1.nCount=9;
        // p2.nCount=6;
        for(var i=0;i<15;i++)
        {
            if (i<9)
                p1[i]=pisa[i];
            else
                p2[i-9]=pisa[i];
        }
        if (this.IsContinue(p1,Pisa,3) && this.IsContinue(p2,Pisa1,2))
        {
            //是蝴蝶牌型
            PisaPoint.type = Pisa.type;
            PisaPoint.value = Pisa.value;
            return true;
        }
        //假设是三张的在后
        // p1.nCount=6;
        // p2.nCount=9;
        for(var i=0;i<15;i++)
        {
            if (i<6)
                p1[i]=pisa[i];
            else
                p2[i-6]=pisa[i];
        }
        if (this.IsContinue(p1,Pisa,2) && this.IsContinue(p2,Pisa1,3))
        {
            //是蝴蝶牌型
            PisaPoint.type = Pisa1.type;
            PisaPoint.value = Pisa1.value;
            return true;
        }
        return false;
    },

//公用函数
    IsContinue : function(pisa,PisaPoint,offest){
        //牌数不能整除offest
        if (pisa.length%offest!=0)
        {
            JJLog.print("连续牌比较函数：牌数不能整除",pisa.length,offest);
            return false;
        }
        //检查其中的值是否合法
        var NotNeighborCount=0;
        for(var i=0;i<pisa.length;i+=offest)
        {
            //如果是对或者三连张的，检查相邻的牌是否同样
            if (offest>1)
            {
                for(var j =i+1;j <i+offest;j++)
                    if (pisa[i].value != pisa[j].value)
                    {
                        JJLog.print("连续牌比较函数：相邻牌不同样！",i+"#####",pisa[i].value,+"######"+j+"######",pisa[j].value);
                        return false;
                    }
            }
            //检查相间的牌是否是连续的
            if (i!=0)
                if (!this.IsNeighbor(pisa[i].value,pisa[i-1].value))
                {
                    NotNeighborCount++;
                    JJLog.print("连续牌比较函数：发现%d次不是相邻："+pisa[i-1].value,"#####"+i,"######"+pisa[i].value);
                    //如果断层是由于连续牌造成的，应该退出
                    if (pisa[i].value==pisa[i-1].value)
                        return false;
                }
        }
        var bEnd = false;
        //比较最后一张牌和第一张牌是否连续,只出现在A和K之间的情况
        if (!this.IsNeighbor(pisa[0].value,pisa[pisa.length-1].value))
        {
            JJLog.print("连续牌比较函数：发现最后的牌和第一张牌不相邻");
            NotNeighborCount++;
        }
        else
            bEnd=true;
        //由于连续是可以允许回环的,所以这里判断如果不连续的情况出现两次，就说明出错牌了
        if (NotNeighborCount>=2)
        {
            JJLog.print("连续牌比较函数：牌面不连续，出现%d次不相邻！",NotNeighborCount);
            return false;
        }
        if (bEnd)
        {
            //说明是有头尾连接的，因为需要判断是否含有K和3
            if (this.IsBothHave3AndK(pisa))
            {
                JJLog.print("连续牌比较函数：牌面有头尾连接，而且含有K和3！\n");
                return false;
            }
        }
        this.GetMaxPoint(pisa,PisaPoint);
        return true;
    },

//是否同时含有3和K
    IsBothHave3AndK : function(pisa) {
        var bFound3=false;
        var bFoundK=false;
        for(var i=0;i<pisa.length;i++)
        {
            if (pisa[i].value==3)
                bFound3=true;
            else if (pisa[i].value==13)
                bFoundK=true;
        }
        return (bFound3 && bFoundK);
    },

//获取最大的牌面值，bEnd表示是否通过最后回环的
    GetMaxPoint : function(pisa,PisaPoint) {
        var Max = {"type":0,"value":0};//最大值
        var No12Max = {"type":0,"value":0};//没有A、2的最大值
        var bFound3=false;
        for(var i=0;i<pisa.length;i++)
        {
            var value = compare[pisa[i].value];
            // if (pisa[i].value==3)
            //     bFound3=true;
            if (value<12 && compare[No12Max.value]<value)
            {
                No12Max = pisa[i];
            }
            if (compare[Max.value]<value)
            {
                Max = pisa[i];
            }
        }
        if (bFound3)
        {
            PisaPoint.type = No12Max.type;
            PisaPoint.value = No12Max.value;
        }
        else
        {
            PisaPoint.type = Max.type;
            PisaPoint.value = Max.value;
        }
    },

//判断两个值是否相邻
    IsNeighbor : function(index,index2) {
        index = parseInt(index);
        index2 = parseInt(index2);
        if (index>index2 && index-index2==1) return true;
        if (index<index2 && index2-index==1) return true;
        if ((index==13 && index2==1) ||
            (index==1 && index2==13)) return true;
        return false;
    },

//获取牌数量
    GetPisaCount :function(pisa,value) {
        var count = 0
        for (var i =0; i<pisa.length;i++)
        {
            if(pisa[i].value == value)
            {
                count+=1;
            }else if(count>0)
            {
                return count;
            }
        }
        return count;
    },

    IsFound3 : function(pisa) {
        //如果是第一次出牌，需要检查是不是含有黑桃3
        for(var i=0;i<pisa.length;i++){
            if (pisa[i].value==3 && pisa[i].type==4)//黑桃3
            {
                return true;
            }
        }
        return false;
    },

    //当前牌是否比最后出的牌要大
    IsPDKBiggerThanLastCard:function(pisa,m_LastPisa,m_bFirst,playerHandPaiLength) {
        //判断出牌是否合符要求
        if (!this.IsRegular(pisa,{},playerHandPaiLength))
            return false;
        if (m_bFirst == true)
        {
            m_LastPisa = [];
        }
        //存在最后一次出牌记录
        if (m_LastPisa.length !=0)
        {
            var PisaPoint = {};
            var PisaPoint1 = {};
            var bIsBomb=this.IsBomb(pisa,PisaPoint);
            var bIsBomb1=this.IsBomb(m_LastPisa,PisaPoint1);
            var Count  = PisaPoint.count;
            var Count1 = PisaPoint1.count;
            //如果玩家出的是炸弹，而且上家出的不是炸弹，直接返回TRUE
            if (bIsBomb && !bIsBomb1)
                return true;
            //如果玩家出的不是炸弹，而且上家出的是炸弹，直接返回TRUE
            if (!bIsBomb && bIsBomb1)
                return false;
            //如果两个玩家都是炸弹
            if (bIsBomb && bIsBomb1)
            {
                //玩家出的是天王炸弹
                if (PisaPoint.value==14) return true;
                //上家出的是天王炸弹
                if (PisaPoint1.value==14) return false;
                //玩家出的是3A炸弹
                if (PisaPoint.value==1) return true;
                //上家出的是3A炸弹
                if (PisaPoint1.value==1) return false;
                //张数较多
                if (Count>Count1)
                    return true;
                //点数较大
                else if (Count==Count1 && compare[PisaPoint.value]>compare[PisaPoint1.value])
                    return true;
                return false;
            }
            //判断出牌数是否相同
            if (pisa.length==m_LastPisa.length && pisa.length<=PISACOUNT)
            {
                if(pisa.length==1)
                {
                    //点数较大
                    if (compare[pisa[0].value] > compare[m_LastPisa[0].value])
                        return true;
                    JJLog.print("单张牌比较完毕\n");
                }
                else if (pisa.length ==2)
                {
                    //点数较大
                    if (compare[pisa[0].value] > compare[m_LastPisa[0].value])
                        return true;
                    JJLog.print("2张牌比较完毕\n");
                }
                else if (pisa.length==3)
                {
                    //点数较大
                    if (compare[pisa[0].value] > compare[m_LastPisa[0].value])
                        return true;
                    JJLog.print("3张牌比较完毕\n");
                }
                else
                {
                    //连飞机，连对，顺子都必须张数相同，所以只需要判断点数就可以了
                    if (this.IsContinue3(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是三同张！\n");
                        //如果是连三同张
                        if (this.IsContinue3(m_LastPisa,PisaPoint1))
                        {
                            JJLog.print("玩家三同张最大牌："+PisaPoint.type+PisaPoint.value +"上家最大牌："+PisaPoint1.type+PisaPoint1.value);
                            //点数较大
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value] && PisaPoint.count == PisaPoint1.count)
                                return true;
                        }
                        else
                            JJLog.print("您出的牌是三同张，但是上家出的不是三同张！");
                    }
                    if (this.IsContinue2(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是连对！\n");
                        //如果是连对
                        if (this.IsContinue2(m_LastPisa,PisaPoint1))
                        {
                            JJLog.print("玩家连对最大牌："+PisaPoint.type+PisaPoint.value +"上家最大牌："+PisaPoint1.type+PisaPoint1.value);
                            //点数较大
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                            //花色较大
                            // else if (PisaPoint.value == PisaPoint1.value && PisaPoint.type > PisaPoint1.type)
                            //   return true;
                        }
                        else
                            JJLog.print("您出的牌是连对，但是上家出的不是连对！");
                    }
                    if (this.IsStraight(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是顺子！\n");
                        //如果是顺子
                        if (this.IsStraight(m_LastPisa,PisaPoint1))
                        {
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                        }
                        else
                            JJLog.print("您出的牌是顺子，但是上家出的不是顺子！");
                    }
                    //如果出牌是三连一
                    if (this.Is3And1(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是三连一！\n");
                        //如果是三连二
                        if (this.Is3And1(m_LastPisa,PisaPoint1))
                        {
                            JJLog.print("玩家三连一最大牌："+PisaPoint.type+PisaPoint.value +"上家最大牌："+PisaPoint1.type+PisaPoint1.value);
                            //点数较大
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                        }
                        else
                            JJLog.print("您出的牌是三连一，但是上家出的不是三连一！");
                    }
                    //如果出牌是四连三
                    if (this.Is4And3(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是四连三！\n");
                        //如果是三连二
                        if (this.Is4And3(m_LastPisa,PisaPoint1))
                        {
                            JJLog.print("玩家四连三最大牌："+PisaPoint.type+PisaPoint.value +"上家最大牌："+PisaPoint1.type+PisaPoint1.value);
                            //点数较大
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                        }
                        else
                            JJLog.print("您出的牌是四连三，但是上家出的不是四连三！");
                    }
                    //如果出牌是三连二
                    if (this.Is3And2(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是三连二！\n");
                        //如果是三连二
                        if (this.Is3And2(m_LastPisa,PisaPoint1))
                        {
                            JJLog.print("玩家三连二最大牌："+PisaPoint.type+PisaPoint.value +"上家最大牌："+PisaPoint1.type+PisaPoint1.value);
                            //点数较大
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                        }
                        else
                            JJLog.print("您出的牌是三连二，但是上家出的不是三连二！");
                    }
                }
            }
            else
            {
                if(playerHandPaiLength != pisa.length)
                    return false;
                if (this.Is3And1(m_LastPisa,PisaPoint1) || this.Is3And2(m_LastPisa,PisaPoint1))
                {
                    if(playerHandPaiLength < m_LastPisa.length )
                    {
                        if(pisa.length == 3)
                        {
                            if (compare[pisa[0].value] > compare[PisaPoint1.value])
                                return true;
                        }else if (this.Is3And1(pisa,PisaPoint))
                        {
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                        }
                    }
                }else if(this.Is4And3(m_LastPisa,PisaPoint1) && this.Is4And3(pisa,PisaPoint))
                {
                    if (playerHandPaiLength < m_LastPisa.length && compare[PisaPoint.value] > compare[PisaPoint1.value])
                        return true;
                }else if(this.IsContinue3(m_LastPisa,PisaPoint1) && this.IsContinue3(pisa,PisaPoint))
                {
                    if(m_LastPisa.length > playerHandPaiLength && PisaPoint1.count == PisaPoint.count && compare[PisaPoint.value] > compare[PisaPoint1.value])
                    {
                        return true;
                    }
                }
            }
        }
        else//没有出牌记录，当前出牌通过
            return true;
        return false;
    },

//当前牌是否比最后出的牌要大
    IsBiggerThanLastCard : function(pisa,m_LastPisa,m_bFirst) {
        //判断出牌是否合符要求
        if (!this.IsRegular(pisa,{}))
            return false;
        if (m_bFirst == true)
        {
            m_LastPisa = [];
        }
        //存在最后一次出牌记录
        if (m_LastPisa.length !=0)
        {
            var PisaPoint = {};
            var PisaPoint1 = {};
            var bIsBomb=this.IsBomb(pisa,PisaPoint);
            var bIsBomb1=this.IsBomb(m_LastPisa,PisaPoint1);
            var Count  = PisaPoint.count;
            var Count1 = PisaPoint1.count;
            //如果玩家出的是炸弹，而且上家出的不是炸弹，直接返回TRUE
            if (bIsBomb && !bIsBomb1)
                return true;
            //如果玩家出的不是炸弹，而且上家出的是炸弹，直接返回TRUE
            if (!bIsBomb && bIsBomb1)
                return false;
            //如果两个玩家都是炸弹
            if (bIsBomb && bIsBomb1)
            {
                //玩家出的是天王炸弹
                if (PisaPoint.value==14) return true;
                //上家出的是天王炸弹
                if (PisaPoint1.value==14) return false;
                //玩家出的是3A炸弹
                if (PisaPoint.value==1) return true;
                //上家出的是3A炸弹
                if (PisaPoint1.value==1) return false;
                //张数较多
                if (Count>Count1)
                    return true;
                //点数较大
                else if (Count==Count1 && compare[PisaPoint.value]>compare[PisaPoint1.value])
                    return true;
                //花式较大
                // else if (Count==Count1 && PisaPoint.value==PisaPoint1.value && PisaPoint.type>PisaPoint1.type)
                //   return true;
                return false;
            }
            //判断出牌数是否相同
            if (pisa.length==m_LastPisa.length && pisa.length<=PISACOUNT)
            {
                if(pisa.length==1)
                {
                    //点数较大
                    if (compare[pisa[0].value] > compare[m_LastPisa[0].value])
                        return true;
                    //花色较大
                    // else if (pisa[0].value == m_LastPisa.value &&
                    //     pisa[0].type > m_LastPisa[0].type)
                    //   return true;
                    JJLog.print("单张牌比较完毕\n");
                }
                else if (pisa.length ==2)
                {
                    //点数较大
                    if (compare[pisa[0].value] > compare[m_LastPisa[0].value])
                        return true;
                    //花色较大
                    // else if (pisa[0].value == m_LastPisa.value &&
                    //     max(pisa[0].type,pisa[1].type) > max(m_LastPisa[0].type,m_LastPisa[1].type))
                    //   return true;
                    JJLog.print("2张牌比较完毕\n");
                }
                else if (pisa.length==3)
                {
                    //点数较大
                    if (compare[pisa[0].value] > compare[m_LastPisa[0].value])
                        return true;
                    //花色较大
                    // else if (pisa[0].value == m_LastPisa[0].value &&
                    //     (max(pisa[0].type,max(pisa[1].type,pisa[2].type)) >
                    //     max(m_LastPisa[0].type,max(m_LastPisa[1].type,m_LastPisa[2].type))))
                    //   return true;
                    JJLog.print("3张牌比较完毕\n");
                }
                else
                {
                    //连飞机，连对，顺子都必须张数相同，所以只需要判断点数就可以了
                    if (this.IsContinue3(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是三同张！\n");
                        //如果是连三同张
                        if (this.IsContinue3(m_LastPisa,PisaPoint1))
                        {
                            JJLog.print("玩家三同张最大牌："+PisaPoint.type+PisaPoint.value +"上家最大牌："+PisaPoint1.type+PisaPoint1.value);
                            //点数较大
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value] && PisaPoint.count == PisaPoint1.count)
                                return true;
                            //花色较大
                            // else if (PisaPoint.value == PisaPoint1.value && PisaPoint.type > PisaPoint1.type)
                            //   return true;
                        }
                        else
                            JJLog.print("您出的牌是三同张，但是上家出的不是三同张！");
                    }
                    if (this.IsContinue2(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是连对！",PisaPoint.value);
                        //如果是连对
                        if (this.IsContinue2(m_LastPisa,PisaPoint1))
                        {
                            JJLog.print("玩家连对最大牌："+PisaPoint.type+""+PisaPoint.value +"上家最大牌："+PisaPoint1.type+""+PisaPoint1.value);
                            //点数较大
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                            //花色较大
                            // else if (PisaPoint.value == PisaPoint1.value && PisaPoint.type > PisaPoint1.type)
                            //   return true;
                        }
                        else
                            JJLog.print("您出的牌是连对，但是上家出的不是连对！");
                    }
                    if (this.IsStraight(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是顺子！\n");
                        //如果是顺子
                        if (this.IsStraight(m_LastPisa,PisaPoint1))
                        {
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                        }
                        else
                            JJLog.print("您出的牌是顺子，但是上家出的不是顺子！");
                    }
                    //如果出牌是三连一
                    if (this.Is3And1(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是三连一！\n");
                        //如果是三连二
                        if (this.Is3And1(m_LastPisa,PisaPoint1))
                        {
                            JJLog.print("玩家三连一最大牌："+PisaPoint.type+PisaPoint.value +"上家最大牌："+PisaPoint1.type+PisaPoint1.value);
                            //点数较大
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                        }
                        else
                            JJLog.print("您出的牌是三连一，但是上家出的不是三连一！");
                    }
                    //如果出牌是四连三
                    if (this.Is4And3(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是四连三！\n");
                        //如果是三连二
                        if (this.Is4And3(m_LastPisa,PisaPoint1))
                        {
                            JJLog.print("玩家四连三最大牌："+PisaPoint.type+PisaPoint.value +"上家最大牌："+PisaPoint1.type+PisaPoint1.value);
                            //点数较大
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                            //花色较大
                            // else if (PisaPoint.value == PisaPoint1.value && PisaPoint.type > PisaPoint1.type)
                            //   return true;
                        }
                        else
                            JJLog.print("您出的牌是四连三，但是上家出的不是四连三！");
                    }
                    //如果出牌是三连二
                    if (this.Is3And2(pisa,PisaPoint))
                    {
                        JJLog.print("玩家出的是三连二！\n");
                        //如果是三连二
                        if (this.Is3And2(m_LastPisa,PisaPoint1))
                        {
                            JJLog.print("玩家三连二最大牌："+PisaPoint.type+PisaPoint.value +"上家最大牌："+PisaPoint1.type+PisaPoint1.value);
                            //点数较大
                            if (compare[PisaPoint.value] > compare[PisaPoint1.value])
                                return true;
                            //花色较大
                            // else if (PisaPoint.value == PisaPoint1.value && PisaPoint.type > PisaPoint1.type)
                            //   return true;
                        }
                        else
                            JJLog.print("您出的牌是三连二，但是上家出的不是三连二！");
                    }
                }
            }
            else
            {
                /*			//如果出牌数不同，需要比较是不是炸弹
                 if (IsBomb(pisa,&Count,&PisaPoint) && IsBomb(&m_LastPisa,&Count1,&PisaPoint1))
                 {
                 }
                 else*/
                {
                    JJLog.print("您出的牌数量与上家不同，而且不是炸弹！");
                }
            }
        }
        else//没有出牌记录，当前出牌通过
            return true;
        return false;
    },

//当前牌是否合符出牌规则
    IsRegular : function(pisa,pisaType,playerHandPaiLength) {
        if (pisa.length==1)
        {
            pisaType.type = PuKeType.CT_SINGLE;
            return true;
        }
        else if (pisa.length == 2)
        {
            //是否为对
            if (pisa[0].value == pisa[1].value)
            {
                pisaType.type = PuKeType.CT_DOUBLE;
                return true;
            }
            else
                JJLog.print("您出的牌不是对子！");
        }
        else if (pisa.length==3 && playerHandPaiLength == 3)
        {
            //是否为三同张
            if (pisa[0].value == pisa[1].value && pisa[0].value == pisa[2].value)
            {
                if (pisa[0].value == 1 && this.isA3Bomb == 1)
                    pisaType.type = PuKeType.CT_BOMB;
                else
                    pisaType.type = PuKeType.CT_THREE;
                return true;
            }
            else
                JJLog.print("您出的牌不是三同张！")
        }
        else
        {
            var PisaPoint = {};
            //如果出牌是炸弹
            if (this.IsBomb(pisa,PisaPoint))
            {
                pisaType.type = PuKeType.CT_BOMB;
                JJLog.print("符合炸弹规则！");
                return true;
            }
            //如果出牌是飞机
            if (this.IsContinue3(pisa,PisaPoint))
            {
                if((PisaPoint.count*5 <= playerHandPaiLength && pisa.length == PisaPoint.count*5) || (PisaPoint.count*5 > playerHandPaiLength && pisa.length == playerHandPaiLength))
                {
                    pisaType.type = PuKeType.CT_SIX_LINE_TAKE_FORE;
                    JJLog.print("符合飞机规则！\n");
                    return true;
                }

            }
            //如果出牌是连对
            if (this.IsContinue2(pisa,PisaPoint))
            {
                pisaType.type = PuKeType.CT_DOUBLE_LINE;
                JJLog.print("符合连对规则！\n");
                return true;
            }
            //如果出牌是顺子
            if (this.IsStraight(pisa,PisaPoint))
            {
                pisaType.type = PuKeType.CT_SINGLE_LINE;
                JJLog.print("符合顺子规则！\n");
                return true;
            }

            //如果出牌是四连三
            if (this.Is4And3(pisa,PisaPoint))
            {
                if((7 <= playerHandPaiLength && pisa.length == 7) || (7 > playerHandPaiLength && pisa.length == playerHandPaiLength))
                {
                    pisaType.type = PuKeType.CT_FORE_LINE_TAKE_THREE;
                    JJLog.print("符合四连三规则！\n");
                    return true;
                }

            }

            //如果出牌是三连二
            if (this.Is3And2(pisa,PisaPoint))
            {
                pisaType.type = PuKeType.CT_THREE_LINE_TAKE_TWO;
                JJLog.print("符合三连二规则！\n");
                return true;
            }

            //如果出牌是三连一
            if (playerHandPaiLength == 4 && this.Is3And1(pisa,PisaPoint))
            {
                pisaType.type = PuKeType.CT_THREE_LINE_TAKE_ONE;
                JJLog.print("符合三连一规则！\n");
                return true;
            }
        }
        JJLog.print("您出的牌不合符规则!");
        pisaType.type = PuKeType.CT_ERROR;
        return false;
    },

    initRecordHandCards:function () {

    },

    registerRecordEvent: function () {
        var _this = this;
        var ls = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.EVT_RECORD,
            callback: function (event) {
                var userData = event.getUserData();
                if(userData == null ) return;
                var evtId = userData['type'];
                switch (evtId) {
                    case RecordType.SEND:
                    {
                        var uid = userData['uid'];
                        if (_this.uid == uid) {
                            _this.playRecordSend(userData);
                        }
                    }
                        break;
                }
            }
        });
        _this._Listener = cc.eventManager.addListener(ls, this);
    },

    playRecordSend: function (data) {
        this.addCardOut(data['pai']);
        this.removeOutHandCard(data['pai']);
        this.image_tip.setVisible(data['pai'].length == 0);
        var cardSound = {sex:this.sexType,cardsType:data.opCardType,cards:data['pai']};
        sound.playPokerCard2(cardSound);
        qp.event.send('playerPainum',{uid:data['uid'],painum:this.cardInArray.length});
    },

    removeRecordEvent: function () {
        cc.eventManager.removeListener(this._Listener);
    },

    selectHint:function (cardsLast, handCard, outCardsArr) {
        var cardsInHand = [];
        handCard.forEach(function (el) {
            cardsInHand.splice(0,0,{type:el.type,value:el.value});
        });
        var bRes = false;
        switch (cardsLast.opCardType) {
            case  PuKeType.CT_SINGLE:
                bRes = this._findSingle(cardsLast, cardsInHand, outCardsArr);
                break;
            case  PuKeType.CT_DOUBLE:
                bRes = this._findDoubleOrThree(cardsLast, cardsInHand, outCardsArr);
                break;
            case  PuKeType.CT_DOUBLE_LINE:
                bRes = this._findDoubleLine(cardsLast, cardsInHand, outCardsArr);
                break;
            case  PuKeType.CT_SINGLE_LINE:
                bRes = this._findSingleLine(cardsLast, cardsInHand, outCardsArr);
                break;
            case  PuKeType.CT_THREE:
            case  PuKeType.CT_THREE_LINE_TAKE_ONE:
            case  PuKeType.CT_THREE_LINE_TAKE_TWO:
            case  PuKeType.CT_SIX_LINE_TAKE_FORE:
                bRes = this._findThreeLine(cardsLast, cardsInHand , outCardsArr);
                break;
            case  PuKeType.CT_FORE_LINE_TAKE_THREE:
                bRes = this._findForeLine(cardsLast, cardsInHand , outCardsArr);
                break;
            case  PuKeType.CT_BOMB:
                bRes = this._findBomb(cardsLast, cardsInHand , outCardsArr);
                break;
        }

        if(cardsLast.opCardType != PuKeType.CT_BOMB && this._findBomb(0, cardsInHand , outCardsArr))
            bRes = true;


        return bRes;
    },

    // 创建最后出牌的牌型 outCard.value : compare
    createLastOp:function(lastOpPai,outCard)
    {
        outCard.opCard = lastOpPai.cards;
        outCard.opCardType = lastOpPai.type;
        outCard.count = 1;
        switch (outCard.opCardType)
        {
            case PuKeType.CT_SINGLE:
                outCard.value = outCard.opCard[0].value;
                break;
            case PuKeType.CT_DOUBLE:
                outCard.value = outCard.opCard[0].value;
                break;
            case PuKeType.CT_THREE:
                outCard.value = outCard.opCard[0].value;
                break;
            case PuKeType.CT_BOMB:
                outCard.value = outCard.opCard[0].value;
                break;
            case PuKeType.CT_SIX_LINE_TAKE_FORE:
                this.IsContinue3(outCard.opCard,outCard)
                break;
            case PuKeType.CT_DOUBLE_LINE:
                this.IsContinue2(outCard.opCard,outCard)
                break;
            case PuKeType.CT_SINGLE_LINE:
                this.IsStraight(outCard.opCard,outCard)
                break;
            case PuKeType.CT_FORE_LINE_TAKE_THREE:
                this.Is4And3(outCard.opCard,outCard);
                break;
            case PuKeType.CT_THREE_LINE_TAKE_TWO:
                this.Is3And2(outCard.opCard,outCard);
                break;
            case PuKeType.CT_THREE_LINE_TAKE_ONE:
                this.Is3And1(outCard.opCard,outCard)
                break;
        }
    },

    getCardCount:function (inputArray) {
        var outArray = [];
        for(var i=0;i<15;i++)
        {
            outArray[i] = 0;
        }
        inputArray.forEach(function (el) {
            outArray[compare[el.value]]++;
        });
        return outArray;
    },
    //找单
    _findSingle : function (lastCards, CardsInHand, vecHintCards) {
        return this._selectSingle(lastCards.value, CardsInHand, vecHintCards, 0);
    },

    _selectSingle: function (nLastLevel, CardsInHand, vecHintCards, nNumber) {
        var bRes = false;
        var nLastCardsLevel = compare[nLastLevel];
        if(nLastCardsLevel == 13 && nNumber == 0) //单牌中2最大
            return false;
        var cLevelNumber = this.getCardCount(CardsInHand);
        var nLevel = 0;
        var nNumberType = 0;
        var bGetEnough = false;

        for (var i = 0; i < CardsInHand.length; i++) {
            nLevel = compare[CardsInHand[i].value];
            if (nLevel > nLastCardsLevel &&
                cLevelNumber[nLevel] == 1) { // 找不需要拆牌的非癞子
                vecHintCards && vecHintCards.push([CardsInHand[i]]);
                nNumberType++;
                if (nNumberType >= nNumber) {
                    bRes = true;
                    if (nNumber > 0) {
                        return true;
                        bGetEnough = true;
                    }
                }
            }
        }
        if (nNumber == 0) {
            for (var i = 0; i < CardsInHand.length; i++) {
                // 第二遍，找需要拆牌的
                nLevel = compare[CardsInHand[i].value];
                if (nLevel > nLastCardsLevel && cLevelNumber[nLevel] > 1) {
                    vecHintCards && vecHintCards.push([CardsInHand[i]]);
                    nNumberType++;
                    i += cLevelNumber[nLevel] - 1;
                    bRes = true;
                }

            }
        }else if(nNumberType < nNumber)
        {
            for (var i = 0; i < CardsInHand.length && !bGetEnough; i++) {
                // 第二遍，找需要拆牌的
                nLevel = compare[CardsInHand[i].value];
                if (nLevel > nLastCardsLevel && cLevelNumber[nLevel] > 1) {
                    vecHintCards && vecHintCards.push([CardsInHand[i]]);
                    nNumberType++;
                    if (nNumberType >= nNumber) {
                        bRes = true;
                        return true;
                        if (nNumber > 0) {
                            break;
                        }
                    }
                }
            }
        }
        return bRes;
    },

    //找对
    _findDoubleOrThree : function (lastCards, CardsInHand, vecHintCards) {
        var len = lastCards.opCard.length;
        var nLastCardsLevel = compare[lastCards.value];
        if (len > CardsInHand.length || nLastCardsLevel == 12)
            return false;

        var bRes = false;
        var cLevelNumber = this.getCardCount(CardsInHand);
        var bHandLogicValue = 0;

        for (var i = 0; i < CardsInHand.length; i++) {
            bHandLogicValue = compare[CardsInHand[i].value];
            if (bHandLogicValue > nLastCardsLevel && cLevelNumber[bHandLogicValue]  ==  len) { // 找不需要拆牌的
                var retCards = [];
                for(var j = i;j<i+len && j < CardsInHand.length;j++)
                {
                    retCards.push(CardsInHand[j])
                }
                bRes = true;
                vecHintCards && vecHintCards.push(retCards);
                i += cLevelNumber[bHandLogicValue] - 1;
            }
        }

        for (var i = 0; i < CardsInHand.length; i++) {
            // 第二遍，找需要拆牌的
            bHandLogicValue = compare[CardsInHand[i].value];
            if (bHandLogicValue > nLastCardsLevel && cLevelNumber[bHandLogicValue] > len) {
                var retCards = [];
                for(var j = i;j<i+len && j < CardsInHand.length;j++)
                {
                    retCards.push(CardsInHand[j])
                }
                bRes = true;
                vecHintCards && vecHintCards.push(retCards);
                i += cLevelNumber[bHandLogicValue] - 1;
            }
        }

        return bRes;
    },

    //找顺子
    _findSingleLine : function (lastCards, CardsInHand, vecHintCards) {
        var len = lastCards.opCard.length;
        var nLastCardsLevel = compare[lastCards.value];
        if (len > CardsInHand.length || nLastCardsLevel == 12 )//顺子中带A已经最大
            return false;

        var bRes = false;
        var bHandLogicValue = 0;
        var bFirstLogicValue = 0;

        for (var i = 0; i < CardsInHand.length; i++) {
            bHandLogicValue = compare[CardsInHand[i].value];
            if(bHandLogicValue <= nLastCardsLevel-len + 1 || bHandLogicValue <= bFirstLogicValue) continue;
            if (bHandLogicValue>=9) break; //J开始没有顺子
            var bLineCount=0;
            var retCards = [];
            for (var j=i;j < CardsInHand.length;j++)
            {
                if(compare[CardsInHand[j].value] > 12) break;
                if ((compare[CardsInHand[j].value]-bLineCount) == bHandLogicValue)
                {
                    //增加连数
                    retCards[bLineCount++] = CardsInHand[j];
                    //完成判断
                    if (bLineCount == len)
                    {
                        bFirstLogicValue = bHandLogicValue;
                        vecHintCards.push(retCards);
                        bRes = true;
                        break;
                    }
                }
            }
        }
        return bRes;
    },

    //找连对
    _findDoubleLine : function (lastCards, CardsInHand, vecHintCards) {

        var len = lastCards.opCard.length;
        if (len > CardsInHand.length || compare[lastCards.value] == 12) //连对中带A已经最大
            return false;

        var bRes = false;
        var bHandLogicValue = 0;
        //var cLevelNumber = this.getCardCount(CardsInHand);
        var bFirstLogicValue = 0;
        var bLogicValue= compare[lastCards.opCard[0].value];

        //搜索连牌
        for (var i=0;i<CardsInHand.length;i++)
        {
            //获取数值
            bHandLogicValue = compare[CardsInHand[i].value];
            if (bHandLogicValue<=bLogicValue || bHandLogicValue <= bFirstLogicValue) continue;
            if (bHandLogicValue>=12 && len > 2) break; //A开始没有连对

            //搜索连牌
            var bLineCount=0;
            var retCards = [];
            for (var j=i;j< (CardsInHand.length-1);j++)
            {
                if (((compare[CardsInHand[j].value]-bLineCount)==bHandLogicValue)
                    &&((compare[CardsInHand[j+1].value]-bLineCount)==bHandLogicValue))
                {
                    //增加连数
                    retCards[bLineCount*2]=CardsInHand[j];
                    retCards[(bLineCount++)*2+1]=CardsInHand[j+1];

                    //完成判断
                    if (bLineCount*2==len)
                    {
                        vecHintCards.push(retCards);
                        bFirstLogicValue = bHandLogicValue;
                        bRes = true;
                        break;
                    }
                }
            }
        }
        return bRes;
    },

    //找三同
    _findThreeLine : function (lastCards, CardsInHand, vecHintCards) {
        if (3 > CardsInHand.length || compare[lastCards.value] == 12) //三同中带A已经最大
            return false;

        var bRes = false;
        var len = lastCards.opCard.length;
        var count = lastCards.count;
        var bFirstLogicValue = 0;
        var bLogicValue= count > 1 ? compare[lastCards.value]- count + 1:compare[lastCards.value];

        //搜索连牌
        for (var i=0;i<CardsInHand.length;i++)
        {
            //获取数值
            var bHandLogicValue = compare[CardsInHand[i].value];
            //构造判断
            if (bHandLogicValue <= bLogicValue || bHandLogicValue <= bFirstLogicValue) continue;
            if (bHandLogicValue > 12) break;

            //搜索连牌
            var bLineCount=0;
            var retCards = [];
            for (var j=i;j<(CardsInHand.length-2);j++)
            {
                //三牌判断
                if ((compare[CardsInHand[j].value]-bLineCount)!=bHandLogicValue) continue;
                if ((compare[CardsInHand[j+1].value]-bLineCount)!=bHandLogicValue) continue;
                if ((compare[CardsInHand[j+2].value]-bLineCount)!=bHandLogicValue) continue;
                //增加连数
                retCards[bLineCount*3]=CardsInHand[j];
                retCards[bLineCount*3+1]=CardsInHand[j+1];
                retCards[(bLineCount++)*3+2]=CardsInHand[j+2];
                i+=2;
                //完成判断
                if (bLineCount==count)
                {
                    var temp = [];
                    CardsInHand.forEach(function (el) {
                        temp.push({type:el.type,value:el.value})
                    });

                    for(var k=0;k<retCards.length;k+=3)
                    {
                        for (var l =0;l<temp.length;l++)
                        {
                            if(temp[l].type == retCards[k].type && temp[l].value == retCards[k].value)
                            {
                                temp.splice(l,3);
                                break;
                            }
                        }
                    }
                    var singleRet = [];
                    var leftCount = len-count*3;
                    if(leftCount == 1 )
                    {
                        this._selectSingle(0,temp,singleRet,1);
                        singleRet.forEach(function(el){
                            if(el[0].value != retCards[0].value || leftCount == 2)
                            {
                                vecHintCards.push(retCards.concat(el));
                                bRes = true;
                            }
                        });
                    }
                    else
                    {
                        if(leftCount > temp.length)
                            leftCount = temp.length;
                        if(leftCount != 0)
                        {
                            this._selectSingle(0,temp,singleRet,leftCount);
                        }
                        if(singleRet.length == 0)
                        {
                            vecHintCards.push(retCards);
                        }else
                        {
                            for(var l = 0;l<singleRet.length-leftCount + 1;l++)
                            {
                                var last = retCards.concat(singleRet[l]);
                                for(var a = l + 1; a < l + leftCount-1 && a < singleRet.length-leftCount + 1;a++)
                                {
                                    last = last.concat(singleRet[a]);
                                }
                                for(var a = l+leftCount - 1;a < singleRet.length;a++)
                                {
                                    var ori = last;
                                    ori = ori.concat(singleRet[a]);
                                    vecHintCards.push(ori);
                                }
                            }
                        }
                        bRes = true;
                    }
                    bFirstLogicValue = bHandLogicValue;
                    break;
                }
            }
        }
        return bRes;
    },

    //找四同
    _findForeLine : function (lastCards, CardsInHand, vecHintCards) {
        if (4 > CardsInHand.length || compare[lastCards.value] == 11) //四同中带K已经最大
            return false;

        var bRes = false;
        var len = lastCards.opCard.length;
        var bFirstLogicValue = 0;
        var bLogicValue= compare[lastCards.value];

        //搜索连牌
        for (var i=0;i<CardsInHand.length;i++)
        {
            //获取数值
            var bHandLogicValue = compare[CardsInHand[i].value];
            //构造判断
            if (bHandLogicValue <= bLogicValue || bHandLogicValue <= bFirstLogicValue) continue;
            if (bHandLogicValue > 12) break;

            //搜索连牌
            var bLineCount=0;
            var retCards = [];
            for (var j=i;j<(CardsInHand.length-3);j++)
            {
                //四牌判断
                if ((compare[CardsInHand[j].value]-bLineCount)!=bHandLogicValue) continue;
                if ((compare[CardsInHand[j+1].value]-bLineCount)!=bHandLogicValue) continue;
                if ((compare[CardsInHand[j+2].value]-bLineCount)!=bHandLogicValue) continue;
                if ((compare[CardsInHand[j+3].value]-bLineCount)!=bHandLogicValue) continue;
                //增加连数
                retCards[bLineCount*3]=CardsInHand[j];
                retCards[bLineCount*3+1]=CardsInHand[j+1];
                retCards[bLineCount*3+2]=CardsInHand[j+2];
                retCards[(bLineCount++)*3+3]=CardsInHand[j+3];
                //完成判断
                var temp = [];
                CardsInHand.forEach(function (el) {
                    temp.push({type:el.type,value:el.value})
                });

                for(var k=0;k<retCards.length;k+=3)
                {
                    for (var l =0;l<temp.length;l++)
                    {
                        if(temp[l].type == retCards[k].type && temp[l].value == retCards[k].value)
                        {
                            temp.splice(l,4);
                            break;
                        }
                    }
                }
                var singleRet = [];
                var leftCount = len-4;
                this._selectSingle(0,temp,singleRet,leftCount);
                for(var l = 0;l<singleRet.length-leftCount + 1;l++)
                {
                    var last = retCards.concat(singleRet[l]);
                    for(var a = l + 1; a < l + leftCount-1 && a < singleRet.length-leftCount + 1;a++)
                    {
                        last = last.concat(singleRet[a]);
                    }
                    for(var a = l+leftCount - 1;a < singleRet.length;a++)
                    {
                        var ori = last;
                        ori = ori.concat(singleRet[a]);
                        bRes = true;
                        vecHintCards.push(ori);
                    }
                }
                bFirstLogicValue = bHandLogicValue;
                break;
            }
        }
        return bRes;
    },

    //炸弹
    _findBomb : function (lastCards, CardsInHand, vecHintCards) {
        var bLogicValue = compare[lastCards.value];

        // 找3a炸弹
        var has3ABomb = this.isA3Bomb == 1 ? this._find3ABomb(lastCards, CardsInHand, vecHintCards) : false;

        if (4 > CardsInHand.length || bLogicValue == 11)
            return has3ABomb;

        var bRes = false;
        var bCardCount = CardsInHand.length;

        for (var i=3;i<bCardCount;i++)
        {
            //获取数值
            var bHandLogicValue=compare[CardsInHand[i].value];

            //构造判断
            if (bHandLogicValue<=bLogicValue) continue;

            //炸弹判断
            var bTempLogicValue=compare[CardsInHand[i].value];
            for (var j=1;j<4;j++)
            {
                if (compare[CardsInHand[i-j].value]!=bTempLogicValue) break;
            }
            if (j!=4) continue;

            var retCards = [];
            //完成处理
            retCards[0]=CardsInHand[i-3];
            retCards[1]=CardsInHand[i-2];
            retCards[2]=CardsInHand[i-1];
            retCards[3]=CardsInHand[i];
            vecHintCards.push(retCards);
            i += 3;
            bRes = true;
        }

        return has3ABomb || bRes;
    },

    _find3ABomb: function (lastCards, CardsInHand, vecHintCards) {
        var bLogicValue = compare[1];
        var bLogicValue2 = compare[lastCards.value];

        if (bLogicValue == bLogicValue2) return false;
        var bRes = false;
        var bCardCount = CardsInHand.length;
        for (var i=2;i<bCardCount;i++)
        {
            //获取数值
            var bHandLogicValue=compare[CardsInHand[i].value];

            //构造判断
            if (bHandLogicValue!=bLogicValue) continue;

            //炸弹判断
            var bTempLogicValue=compare[CardsInHand[i].value];
            for (var j=1;j<3;j++)
            {
                if (compare[CardsInHand[i-j].value]!=bTempLogicValue) break;
            }
            if (j!=3) continue;

            var retCards = [];
            //完成处理
            retCards[0]=CardsInHand[i-2];
            retCards[1]=CardsInHand[i-1];
            retCards[2]=CardsInHand[i];
            vecHintCards.push(retCards);
            i += 2;
            bRes = true;
        }

        return bRes;
    },

    reStart: function () {
        this.panel_cardIn.removeAllChildren();
        this.panel_cardOut.removeAllChildren();
        this.image_tip.setVisible(false);
        this.chupai = [];
        this.cardInArray = [];
        this.cardOutArray = [];
        this.maxCardLength = -1;
        this.resetCardNum();
    },
});