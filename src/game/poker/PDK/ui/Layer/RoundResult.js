/**
 * Created by atom on 2016/8/21.
 */
var PDKRoundResult = cc.Layer.extend({
    listview_result:null,
    btn_start:null,
    panel_cell:null,
    room:null,
    img_result_title:null,
    btn_share:null,
    ctor: function (data,jRoom) {
        this._super();
        this.room = jRoom;
        var root = util.LoadUI(PDKPokerJson.PDKRoundResult).node;
        this.addChild(root);
        this.node_root = root;
        this.text_bird = ccui.helper.seekWidgetByName(root,"text_bird");
        this.img_result_win = ccui.helper.seekWidgetByName(root,"img_win_bg");
        this.img_result_lose = ccui.helper.seekWidgetByName(root,"img_lose_bg");
        // this.img_result_title = ccui.helper.seekWidgetByName(root,"img_result_title");

        this.img_result_lose.setVisible(false);
        this.img_result_win.setVisible(false);
        this.listview_result = ccui.helper.seekWidgetByName(root,"listview_result");
        this.panel_cell = ccui.helper.seekWidgetByName(root,"panel_cell");
        this.panel_cell.setVisible(false);
        this.btn_start = ccui.helper.seekWidgetByName(root,"btn_start");
        this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
        this.btn_show = ccui.helper.seekWidgetByName(root,"btn_show");
        this.btn_hide = ccui.helper.seekWidgetByName(root,"btn_hide");
        this.btn_share.addClickEventListener(function () {
            hall.net.wxShareScreen(0);
        }.bind(this));
        //hxx
        this.btn_show.addClickEventListener(this.showRoundResult.bind(this));
        this.btn_hide.addClickEventListener(this.hideRoundResult.bind(this));
        this.btn_show.setVisible(false);

        if (hall.songshen == 1) {
            this.btn_share.setVisible(false);
            this.btn_start.setPositionX(600)
        }
        this.btn_start.addClickEventListener(function () {
            if(data['isOver'] == 0)
            {
                this.room.showReady();
                this.removeFromParent();
            }else
            {
                this.removeFromParent();
                var endReport = new PDKEndResult();
                // if(cc.sys.isNative)
                // {
                //     var scene = new cc.Scene();
                //     scene.addChild(endReport);
                //     cc.director.replaceScene(scene);
                // }else
                // {
                //     // cc.director.runScene(scene);
                //     endReport.showGameResult();
                // }
                endReport.showGameResult();
            }

        }.bind(this));

        this.panel_root = ccui.helper.seekWidgetByName(this.node_root,"panel_root");
        this.panel_root.setVisible(false);
        this.initList(data);
        this.runShowAction();
        this.room.setResultCards(data);
    },

    initList: function (data) {
        JJLog.print("结算="+JSON.stringify(data));
        var fangZhu = data['fangZhu'];
        // this.text_bird.setString("房间号:"+ GameLogic.Instance.tableId +"  "+"第"+ data['roundResult']+"局");
        var players = data['players'];
        for(var i = 0; i < players.length;i++)
        {
            var info = players[i];
            if(hall.user.uid == info['uid'])
            {
                if(info['winScore'] > 0)
                {
                    // this.img_result_title.setVisible(true);
                    this.img_result_win.setVisible(true);
                    sound.playRoundMusic(true);
                }else
                {
                    sound.playRoundMusic(false);
                    // this.img_result_title.loadTexture(DDZPokerPic.Img_loseMedPng,ccui.Widget.LOCAL_TEXTURE);
                    this.img_result_lose.setVisible(true);
                }
            }

            var cell = this.panel_cell.clone();
            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());

            var image_fangZhu = ccui.helper.seekWidgetByName(cell,"image_bank");
            image_fangZhu.setVisible(info['uid'] == fangZhu);
            var text_name = ccui.helper.seekWidgetByName(cell,"text_name");
            var name = base64.decode(info['nickName']);

            // if(name.length > 4)
            // {
            //   name = name.slice(0,4);
            //     name += '..';
            // }
            cell.x = 0;
            cell.y = 0;
            text_name.setString(cutStringLenght(name));

            var paiChu = info["paiChu"];
            var paiQi = info["paiQi"];
            // var panel_card = ccui.helper.seekWidgetByName(cell,"panel_card");
            // var posx = 0;
            // var innerWidth = 0;
            // for(var k =0;k<paiChu.length;k++)
            // {
            //     var cards = paiChu[k];
            //      for(var j =0;j<cards.length;j++)
            //      {
            //          var card = new DDZPokerCard(this, cards[j],false);
            //          card.setScale(0.5);
            //          card.setAnchorPoint(cc.p(0,0));
            //          if(j==0 && posx > 0)
            //              card.showInsert();
            //          card.x = posx;
            //          card.y = 0;
            //          posx += 30
            //
            //          panel_card.addChild(card);
            //      }
            //      if(cards.length > 0)
            //          posx += 40;
            // }

            // for(var k =0;k<paiQi.length;k++)
            // {
            //     var card = new DDZPokerCard(this, paiQi[k],false);
            //     card.setScale(0.5);
            //     card.showGray();
            //     if(posx >0 && k ==0 )
            //         card.showInsert();
            //     card.setAnchorPoint(cc.p(0,0));
            //     card.x = posx;
            //     card.y = 0;
            //     posx += 30
            //
            //     panel_card.addChild(card);
            // }
            // innerWidth = posx + 60;

            // panel_card.setInnerContainerSize(cc.size(innerWidth , panel_card.height));
            var text_score = ccui.helper.seekWidgetByName(cell,"text_score");
            text_score.setString(info['winScore']+"分");
            text_score.setVisible(true);
            layout.addChild(cell);
            cell.setVisible(true);
            if(info["isHu"] > 0)
            {
                this.listview_result.insertCustomItem(layout,0);

            }else
            {
                this.listview_result.pushBackCustomItem(layout);
            }
            var text_shengpai = ccui.helper.seekWidgetByName(cell,"text_shengpai");
            text_shengpai.setString(paiQi.length+"张牌");
            // var text_shengpai = ccui.helper.seekWidgetByName(cell,"text_shengpai");
            // var idx = 0;
            // for(var x =0;x<paiChu.length;x++)
            // {
            //     var cards = paiChu[x];
            //     if(cards.length == 2 && cards[0].type == 5 && cards[1].type == 5)
            //     {
            //         idx = idx+1;
            //     }
            //     else if(cards.length == 4 && cards[0].value == cards[1].value && cards[1].value == cards[2].value && cards[2].value == cards[3].value)
            //     {
            //         idx = idx+1;
            //     }
            // }


            // text_shengpai.setString(paiQi.length);
        }
    },

    showRoundResult: function () {
        // var root = ccui.helper.seekWidgetByName(this.node_root,"panel_root");
        this.panel_root.setVisible(true);
        this.btn_show.setVisible(false);
        this.btn_hide.setVisible(true);
    },
    hideRoundResult: function () {
        // var root = ccui.helper.seekWidgetByName(this.node_root,"panel_root");
        this.panel_root.setVisible(false);
        this.btn_show.setVisible(true);
        this.btn_hide.setVisible(false);
    },

    showResult: function () {
//        this.setVisible(false);
        cc.director.getRunningScene().addChild(this,900);
//        this.runAction(cc.sequence(cc.delayTime(1.0),cc.show()));
    },
    runShowAction: function () {
        this.panel_root.setPositionY(720);

        if (this.img_result_win.isVisible()) {
            var img_title = ccui.helper.seekWidgetByName(this.img_result_win, "img_title_win");
        } else {
            var img_title = ccui.helper.seekWidgetByName(this.img_result_lose, "img_title_lose");
        }
        img_title.setVisible(false);
        img_title.setScale(2);

        this.panel_root.runAction(cc.sequence(cc.moveBy(DDZCommonParam.RoundResultMoveTime, 0, -720).easing(cc.easeBackOut()),
            cc.callFunc(function () {
                img_title.setVisible(true);
                img_title.runAction(cc.scaleTo(DDZCommonParam.RoundTitleScaleTime, 1, 1).easing(cc.easeBackOut()));
                img_title.runAction(cc.fadeIn(DDZCommonParam.RoundTitleScaleTime));
            }.bind(this))));
        this.panel_root.setVisible(true);
    }
});
