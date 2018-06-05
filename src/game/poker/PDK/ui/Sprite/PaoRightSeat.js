/**
 * Created by atom on 2016/8/21.
 */
var PaoRightSeat = PaoDeskSeat.extend({
    ctor: function (data) {
      this._super(data, 'rightseat');
      this.root = util.LoadUI(PDKPokerJson.PDKRightPanel).node;
      this.addChild(this.root);
      this.gap_stand = 27;
    },

    onEnter: function () {
      this._super();
      if(MajhongInfo.GameMode == GameMode.PLAY)
      {
        this.checkOffline();
        this.panel_cardOut.setScale(0.5);
      }else if(MajhongInfo.GameMode == GameMode.RECORD)
      {
          this.panel_cardOut.setScale(0.5);
          this.panel_cardIn.setScale(0.4);
      }
    },

    // 发牌
    // setHandCards: function (data) {
    //     // todo
    //     for (var p in data) {
    //         this.cardInArray.push(p);
    //     }
    // },

    initRecordHandCards: function () {
        // var cards = PDKPoker.record.rightHandCards;
        // this.panel_cardIn.removeAllChildren();
        // for (var i = 0;i<cards.length;i++) {
        //     var card = new MyPokerCard(this, cards[i]);
        //     this.cardInArray.push(card);
        //     this.panel_cardIn.addChild(card);
        // }
        // this.recordResetPanelInChild();
    },

    recordResetPanelInChild:function () {
        // for(var i = this.cardInArray.length-1;i>=0;i--)
        // {
        //     var card = this.cardInArray[i];
        //     card.setPosition(cc.p(-CommonParam.pokerGap*i-50,0));
        //     this.panel_cardOut.reorderChild(card,50-i);
        // }
    },

    // 同步出牌
    addCardOut:function(data) {
        this.panel_cardOut.removeAllChildren();
        this.cardOutArray.splice(0,this.cardOutArray.length );
        for(var i = 0;i<data.length;i++)
        {
            var cardObj = data[i];
            var card = new MyPokerCard(this,cardObj,false);
            var pos = cc.p(0,0);
            card.setPosition(pos);

            this.panel_cardOut.addChild(card, 20 - i);
            this.cardOutArray.push(card);
        }
        this.resetOutPanelInChild();
    },

    // 计算出牌的位置
    resetOutPanelInChild: function () {
        var posXNext = -this.cardOutArray.length*CommonParam.pokerGap/2-CommonParam.pokerGap;
        for (var i = 0; i < this.cardOutArray.length; i++) {
            var card = this.cardOutArray[i];
            card.x = posXNext + CommonParam.pokerGap * i;
            card.y = -70;
            this.panel_cardOut.reorderChild(card,i);
        }
    },
  });
