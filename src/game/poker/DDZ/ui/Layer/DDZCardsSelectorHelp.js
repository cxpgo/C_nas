
var DDZCardsSelectorHelp = cc.Layer.extend({
    panel_players:null,
    checkBox_players:null,
    player_cards:null,
    player_select:0,
    cardsCount:{},
    ctor:function()
    {
        this._super();
        var root = util.LoadUI(DDZPokerJson.CardsSelector).node;
        this.addChild(root);
        this.panel_players = new Array();
        this.player_cards = new Array();
        this.checkBox_players = new Array();
        var panel_button = ccui.helper.seekWidgetByName(root, "panel_button");
        for (var i=0; i < panel_button.childrenCount; i++) {
            var children = panel_button.children[i];
            var pai = new DDZPokerPai(children.name);
            var png = pai.colorImageOfPai();
            children.setContentSize(cc.size(155, 216));
            children.setScaleX(72/155);
            children.setScaleY(105/216);
            panel_button.children[i].loadTextures(png,png,png, ccui.Widget.PLIST_TEXTURE);
        }
        for(var i=1;i<14;i++)
        {
            var cardspade = ccui.helper.seekWidgetByName(root,"4"+i);
            cardspade.addClickEventListener(this.onAddCard.bind(this));
            var cardheart = ccui.helper.seekWidgetByName(root,"3"+i);
            cardheart.addClickEventListener(this.onAddCard.bind(this));
            var cardclub = ccui.helper.seekWidgetByName(root,"2"+i);
            cardclub.addClickEventListener(this.onAddCard.bind(this));
            var carddiamond = ccui.helper.seekWidgetByName(root,"1"+i);
            carddiamond.addClickEventListener(this.onAddCard.bind(this));
            this.cardsCount["4"+i] = 1;
            this.cardsCount["3"+i] = 1;
            this.cardsCount["2"+i] = 1;
            this.cardsCount["1"+i] = 1;

            var kinglet = ccui.helper.seekWidgetByName(root,"514");
            kinglet.addClickEventListener(this.onAddCard.bind(this));
            var king = ccui.helper.seekWidgetByName(root,"515");
            king.addClickEventListener(this.onAddCard.bind(this));
            this.cardsCount["514"] = 1;
            this.cardsCount["515"] = 1;
        }
        for(var i=0;i<4;i++)
        {
            var cards = new Array();
            this.player_cards.push(cards);
            var panel_player = ccui.helper.seekWidgetByName(root,"player"+i);
            this.panel_players.push(panel_player);
            var checkBox = ccui.helper.seekWidgetByName(root,"checkBox_"+i);
            checkBox._index = i;
            checkBox.addClickEventListener(this.onSwitchPlayer.bind(this));
            this.checkBox_players.push(checkBox);
            var btn_cancel = ccui.helper.seekWidgetByName(root,"btn_cancel"+i);
            btn_cancel._index = i;
            btn_cancel.addClickEventListener(this.onCancelPlayer.bind(this));
        }
        var btn_ok = ccui.helper.seekWidgetByName(root,"btn_ok");
        btn_ok.addClickEventListener(this.onConfirm.bind(this));
        var btn_close = ccui.helper.seekWidgetByName(root,"btn_close");
        btn_close.addClickEventListener(this.onRemoveExit.bind(this));
        this.parseCacheCsOp();
    },
    onRemoveExit:function () {
        this.removeFromParent();
    },
    parseCacheCsOp : function () {
        var caceCSOPStr = util.getCacheItem("DDZ_P_" + hall.user.uid) || "";
        caceCSOPStr = caceCSOPStr.replace("4fp ", "");
        var playersCsOp = caceCSOPStr.split("|");
        var tempSelect = this.player_select;
        playersCsOp.forEach(function(playerCsOpStr , _index) {
            var playerCsOps = playerCsOpStr.split(',');
            this.player_select = _index;
            playerCsOps.forEach(function(paiName) {
                this.onAddCard({name : paiName});
            }, this);
        }, this);


        this.player_select = tempSelect;
    },

    onConfirm:function () {
        var laizi = "lz ";
        var laiziCards = this.player_cards[3];
        laizi = laizi + laiziCards.toString();
        var str = "4fp ";
        for(var i = 0;i<this.player_cards.length;i++)
        {
            str += this.player_cards[i].toString();

            if(i <this.player_cards.length -1)
                str += "|";
        }
        util.setCacheItem('DDZ_P_' + hall.user.uid, str);
        XYGLogic.net.GMOp(hall.user.uid, str, function (data) {
            JJLog.print("=====GMOp=====" + JSON.stringify(data));
        });
        XYGLogic.net.GMOp(hall.user.uid, laizi, function (data) {
            JJLog.print("=====GMOp Laizi=====" + JSON.stringify(data));
        });

        this.removeFromParent();
    },

    onSwitchPlayer:function (sender) {
        this.player_select = -1;
        for(var i = 0;i<this.checkBox_players.length;i++)
        {
            if(i != sender._index){
                this.checkBox_players[i].setSelected(false);
            }else{
                this.player_select = sender._index;
            }

        }
        // if(sender.isSelected())
        //     this.player_select = sender._index;
        // else
        //     this.player_select = -1;

    },

    onCancelPlayer:function (sender) {
        this.panel_players[sender._index].removeAllChildren();
        for(var i =0;i < this.player_cards[sender._index].length;i++)
        {
            var card = this.player_cards[sender._index][i];
            this.cardsCount[card]++;
        }
        this.player_cards[sender._index] = [];
    },

    onAddCard:function (sender) {
        JJLog.print("[CardsSelectorHelp]  onAddCard this.player_select :" + this.player_select);

        if(this.player_select > -1 && (this.cardsCount[sender.name] > 0 || this.player_select == 3))
        {
            // if((this.player_select == 0 && this.player_cards[this.player_select].length  == 17) || (this.player_select > 0 && this.player_cards[this.player_select].length ==13))
            //     return;
            if(this.player_cards[this.player_select].length >= 17)
                return;
            if (this.player_select == 3) {
                if(this.player_cards[this.player_select].length >= 1)
                    return;
            }
            if (this.player_select != 3) {
                this.cardsCount[sender.name]--;
            }

            this.pai = new DDZPokerPai(sender.name);
            this.key = this.pai.key;
            this.value = this.pai.value;
            this.type = this.pai.type;

            var png = this.pai.colorImageOfPai();
            var image = new ccui.ImageView(png,ccui.Widget.PLIST_TEXTURE);
            image.setAnchorPoint(cc.p(0,0));
            image.setPosition(42*this.player_cards[this.player_select].length,0);
            image.setContentSize(image.width*0.5,image.height*0.5);
            this.panel_players[this.player_select].addChild(image);
            this.player_cards[this.player_select].push(sender.name);
        }

    },

    showHelp:function()
    {
        cc.director.getRunningScene().addChild(this);
    },

});