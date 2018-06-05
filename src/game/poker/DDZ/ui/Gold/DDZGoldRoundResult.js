/**
 * Created by atom on 2016/8/21.
 */
var DDZGoldRoundResult = cc.Layer.extend({
    listview_result:null,
    btn_start:null,
    panel_cell:null,
    room:null,
    img_result_win:null,
    img_result_lose:null,
    text_bird:null,
    btn_share:null,
    btn_change:null,
    btn_show:null,
    btn_hide:null,
    node_root:null,
    panel_root:null,
    ctor: function (data,jRoom) {
        this._super();
        this.room = jRoom;
        var root = util.LoadUI(DDZPokerJson.GoldRoundResult).node;
        this.addChild(root);
        this.node_root = root;
        this.text_bird = ccui.helper.seekWidgetByName(root,"text_bird");
        this.img_result_win = ccui.helper.seekWidgetByName(root,"img_win_bg");
        this.img_result_lose = ccui.helper.seekWidgetByName(root,"img_lose_bg");

        this.img_result_lose.setVisible(false);
        this.img_result_win.setVisible(false);
        this.listview_result = ccui.helper.seekWidgetByName(root,"listview_result");
        this.panel_cell = ccui.helper.seekWidgetByName(root,"panel_cell");
        this.panel_cell.setVisible(false);
        this.btn_start = ccui.helper.seekWidgetByName(root,"btn_start");
        this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
        this.btn_change = ccui.helper.seekWidgetByName(root,"btn_change");
        this.btn_show = ccui.helper.seekWidgetByName(root,"btn_show");
        this.btn_hide = ccui.helper.seekWidgetByName(root,"btn_hide");
        this.btn_share.addClickEventListener(function () {
            hall.net.wxShareScreen(0);
        }.bind(this));
        this.btn_change.addClickEventListener(this.onChangeEvent.bind(this));
        //hxx
        this.btn_show.addClickEventListener(this.showRoundResult.bind(this));
        this.btn_hide.addClickEventListener(this.hideRoundResult.bind(this));
        this.btn_show.setVisible(false);
        this.btn_hide.setVisible(false);

        this.btn_start.addClickEventListener(function () {
            if(data['isOver'] == 0)
            {
                this.room.reStart();
                XYGLogic.Instance.inited = true;
                XYGLogic.Instance.ready(function (data) {
                });
                this.removeFromParent();
            }else
            {
                this.removeFromParent();
                var endReport = new DDZEndResult();

                endReport.showGameResult();
            }

        }.bind(this));

        this.panel_root = ccui.helper.seekWidgetByName(this.node_root,"panel_root");
        this.panel_root.setVisible(false);

        this.time_tip = ccui.helper.seekWidgetByName(this.node_root, "time_tip");
        this.time_tip.setString(10);
        this.initList(data);
        this.runShowAction();

    },

    initList: function (data) {
        JJLog.print("结算="+JSON.stringify(data));
        var newBanker = data['newBanker'];
        // this.text_bird.setString("房间号:"+ XYGLogic.Instance.tableId +"  "+"第"+ data['roundResult']+"局");
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

            var img_me = ccui.helper.seekWidgetByName(cell,"img_me");
            var img_he = ccui.helper.seekWidgetByName(cell,"img_he");
            var image_fangZhu = ccui.helper.seekWidgetByName(cell,"image_bank");
            image_fangZhu.setVisible(info['uid'] == newBanker);
            var text_name = ccui.helper.seekWidgetByName(cell,"text_name");
            var name = base64.decode(info['nickName']);

            if(info.uid == hall.user.uid)
            {
                img_me.setVisible(true);
                img_he.setVisible(false);
            }
            else
            {
                img_me.setVisible(false);
                img_he.setVisible(true);
            }

            cell.x = 0;
            cell.y = 0;
            text_name.setString(cutStringLenght(name));

            var paiChu = info["paiChu"];
            var paiQi = info["paiQi"];

            var text_score = ccui.helper.seekWidgetByName(cell,"text_score");
            text_score.setString(info['winScore']+"金币");
            text_score.setVisible(true);
            layout.addChild(cell);
            cell.setVisible(true);
            // var beishu = XYGLogic.Instance.getMulityValue();
            var beishu = info['base'];
            if(info["isHu"] > 0)
            {
                this.listview_result.insertCustomItem(layout,0);

            }else
            {
                this.listview_result.pushBackCustomItem(layout);
            }
            //hxx
            var text_zhadan = ccui.helper.seekWidgetByName(cell,"text_zhadan");

            text_zhadan.setString(beishu);



        }
    },
    showRoundResult: function () {

        this.panel_root.setVisible(true);
        this.btn_show.setVisible(false);
        this.btn_hide.setVisible(true);
    },
    hideRoundResult: function () {
        this.panel_root.setVisible(false);
        this.btn_show.setVisible(true);
        this.btn_hide.setVisible(false);
    },
    showResult: function () {
        cc.director.getRunningScene().addChild(this,900);
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
                this.runTimeAction();
            }.bind(this))));
        this.panel_root.setVisible(true);
    },
    onChangeEvent: function () {
        this.btn_change.setTouchEnabled(false);
        hall.net.changeGoldTable("doudizhu",XYGLogic.table.tableId,1,1,
            function (cbData) {

                if(cbData.code == 200)
                {
                    this.removeFromParent();
                    hall.enter(DDZPoker.appId, -1);
                }else if(cbData.code == 400)
                {
                    this.btn_change.setTouchEnabled(true);
                    this.room.onSelfLeave(false);
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(cbData['error']);
                    dialog.showDialog();
                    dialog.setCallback(function () {
                        this.room.onSelfLeave(true);
                        hall.net.changeGoldTable("doudizhu",XYGLogic.table.tableId,0,1,
                            function (cbD) {
                                if(cbD.code == 200)
                                {
                                    this.removeFromParent();
                                    hall.enter(DDZPoker.appId, -1);
                                }else
                                {
                                    this.room.onSelfLeave(false);
                                    var dialog = new JJConfirmDialog();
                                    dialog.setDes(cbD['error']);
                                    dialog.showDialog();
                                }
                            }.bind(this));
                    }.bind(this));

                }else if (cbData.code == 510) {
                    var majHall = new MajhongHall();
                    majHall.showHall();
                }
                else if(cbData.needGold == 1)
                {
                    this.btn_change.setTouchEnabled(true);
                    this.room.onSelfLeave(false);
                    var times =  hall.dayLogin.activeData.dayGold;
                    if(times < 4 && XYGLogic.table.goldLevel == 1)
                    {
                        util.getDayGoldTip(cbData.rewardNum,times+1);
                    }else
                    {
                        var dialog = new JJMajhongDecideDialog();
                        dialog.setDes(cbData['error']);
                        dialog.setCallback(function () {
                            util.showLessGoldDialog();
                        });
                        dialog.setCancelCal(function () {
                            XYGLogic.net.leavePrivateTable(0, function (data) {
                                if(data.code == 200)
                                {
                                    var majHall = new MajhongHall();
                                    majHall.showHall();
                                }
                            });
                        });
                        dialog.showDialog();
                    }
                }else
                {
                    this.btn_change.setTouchEnabled(true);
                    this.room.onSelfLeave(false);
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(cbData['error']);
                    dialog.showDialog();
                }

            }.bind(this));
    },
    runTimeAction: function () {
        var time = 10;
        var time_tip = this.time_tip;
        time_tip.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            time--;
            if (time == 0) {
                this.exitGame();
            }
            time_tip.setString(time);
        }.bind(this))).repeat(10))
    },
    exitGame: function () {
        XYGLogic.net.leavePrivateTable(0, function (data) {
            var majHall = new MajhongHall();
            majHall.showHall();
        });
    }
});
