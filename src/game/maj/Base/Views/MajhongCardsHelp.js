var MajhongCardsHelp = cc.Layer.extend({
    panel_players: null,
    checkBox_players: null,
    player_cards: null,
    player_select: 0,
    cardsCount: {},
    ctor: function () {
        this._super();
        var root = util.LoadUI(MJBaseRes.CardsSelectorHelp).node;
        this.addChild(root);
        this.panel_players = new Array();
        this.player_cards = new Array();
        this.checkBox_players = new Array();
        for (var i = 1; i < 10; i++) {
            var cardW = ccui.helper.seekWidgetByName(root, "W" + i);
            cardW.addClickEventListener(this.onAddCard.bind(this));
            var cardT = ccui.helper.seekWidgetByName(root, "T" + i);
            cardT.addClickEventListener(this.onAddCard.bind(this));
            var cardB = ccui.helper.seekWidgetByName(root, "B" + i);
            cardB.addClickEventListener(this.onAddCard.bind(this));
            this.cardsCount["W" + i] = 4;
            this.cardsCount["B" + i] = 4;
            this.cardsCount["T" + i] = 4;
            if (i < 4) {
                var cardH = ccui.helper.seekWidgetByName(root, "J" + i);
                cardH.addClickEventListener(this.onAddCard.bind(this));
                this.cardsCount["J" + i] = 4;
            }
            if (i < 5) {
                var cardF = ccui.helper.seekWidgetByName(root, "F" + i);
                cardF.addClickEventListener(this.onAddCard.bind(this));
                this.cardsCount["F" + i] = 4;
            }
        }

        for (var i = 0; i < 6; i++) {
            var cards = new Array();
            this.player_cards.push(cards);
            var panel_player = ccui.helper.seekWidgetByName(root, "player" + i);
            this.panel_players.push(panel_player);
            var checkBox = ccui.helper.seekWidgetByName(root, "checkBox_" + i);
            checkBox._index = i;
            checkBox.addClickEventListener(this.onSwitchPlayer.bind(this));
            this.checkBox_players.push(checkBox);
            var btn_cancel = ccui.helper.seekWidgetByName(root, "btn_cancel" + i);
            btn_cancel._index = i;
            btn_cancel.addClickEventListener(this.onCancelPlayer.bind(this));
        }
        var btn_ok = ccui.helper.seekWidgetByName(root, "btn_ok");
        btn_ok.addClickEventListener(this.onConfirm.bind(this));
        this.parseCacheCsOp();
    },

    parseCacheCsOp : function () {
        var caceCSOPStr = util.getCacheItem("XZ_P_" + hall.user.uid) || "";
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

        var playerCsMoStr = util.getCacheItem("XZ_MO_" + hall.user.uid) || "";
        var playerCsMos = playerCsMoStr.split(',');
        this.player_select = 4;
        playerCsMos.forEach(function(paiName) {
            this.onAddCard({name : paiName});
        }, this);

        this.player_select = tempSelect;
    },

    onConfirm: function () {
        var moStr = "qps ";
        var moCards = this.player_cards[4];
        moStr += moCards.toString();
        var laizi = "lz ";
        var laiziCards = this.player_cards[5];
        laizi += laiziCards.toString();
        this.player_cards.splice(4, 2);

        var str = "4fp ";
        for (var i = 0; i < this.player_cards.length; i++) {
            str += this.player_cards[i].toString();

            if (i < this.player_cards.length - 1)
                str += "|";
        }
        util.setCacheItem('XZ_P_' + hall.user.uid, str);
        util.setCacheItem("XZ_MO_" + hall.user.uid , moStr);
        XYGLogic.net.GMOp(hall.user.uid, str, function (data) {

        });
        XYGLogic.net.GMOp(hall.user.uid, moStr, function (data) {

        });
        JJLog.print("mostr=====",moStr);
        XYGLogic.net.GMOp(hall.user.uid, laizi, function (data) {

        });
        this.removeFromParent();
    },

    onSwitchPlayer: function (sender) {

        for (var i = 0; i < this.checkBox_players.length; i++) {
            if (i != sender._index)
                this.checkBox_players[i].setSelected(false);
        }
        if (!sender.isSelected())
            this.player_select = sender._index;
        else
            this.player_select = -1;

    },

    onCancelPlayer: function (sender) {
        this.panel_players[sender._index].removeAllChildren();
        for (var i = 0; i < this.player_cards[sender._index].length; i++) {
            var card = this.player_cards[sender._index][i];
            this.cardsCount[card]++;
        }
        this.player_cards[sender._index] = [];
    },

    onAddCard: function (sender) {
        if (this.player_select > -1 && this.cardsCount[sender.name] > 0) {
            if ((this.player_select == 0 && this.player_cards[this.player_select].length == 14) || (this.player_select > 0 && this.player_cards[this.player_select].length == 13))
                return;
            this.cardsCount[sender.name]--;
            var key = XYMJ.PaiFace[sender.name];
            var png = XYMJ.PaiFace[key]["show_other"];
            if(png){
                var image = new ccui.ImageView(png, ccui.Widget.PLIST_TEXTURE);
                image.setAnchorPoint(cc.p(0, 0));
                image.setPosition(42 * this.player_cards[this.player_select].length, 0);
                this.panel_players[this.player_select].addChild(image);
            }else{
                console.error("[CardsHelp] png -> key :" + key);
            }
            
            this.player_cards[this.player_select].push(sender.name);
        }

    },

    showHelp: function () {
        cc.director.getRunningScene().addChild(this);
    }

});

