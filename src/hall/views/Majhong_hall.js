
var MajhongHall = cc.Layer.extend({
    text_name: null,
    text_id: null,
    text_fangka: null,
    text_gold:null,
    image_head: null,
    panel_fangka: null,

    btn_help: null,
    btn_setup: null,
    btn_zhanji: null,
    btn_share: null,
    sprite_head: null,
    image_frame: null,
    btn_wanfa: null,
    btn_bindCode: null,
    img_arrow: null,
    panel_gold:null,
    panel_fk:null,
    gameIndex:0,
    alreadyClose:false,
    img_sssfree:null,
    img_mjfree:null,
    btn_match:null,
    ctor: function () {
        this._super();
        this.mRoot = util.LoadUI(GameHallJson.Hall).node;
        this.addChild(this.mRoot);
        var root = this.mRoot;
        this.Root = root;
        this.alreadyClose = false;
        
        this.text_name = ccui.helper.seekWidgetByName(root, "text_name");
        this.text_id = ccui.helper.seekWidgetByName(root, "text_id");

        this.image_frame = ccui.helper.seekWidgetByName(root, "panel_head");
        this.image_frame.setTouchEnabled(true);
        this.image_frame.addClickEventListener(this.onPlayerInfo.bind(this));
        this.sprite_head = ccui.helper.seekWidgetByName(root, "sprite_head");

        this.panel_fangka = ccui.helper.seekWidgetByName(root, "panel_fangka");
        this.panel_fangka.addClickEventListener(this.onAddFangka.bind(this));
        this.text_fangka = ccui.helper.seekWidgetByName(this.panel_fangka, "text_fangka");
        this.text_fangka.setString(hall.user.gemNum);

        var panel_jifen = ccui.helper.seekWidgetByName(root, "panel_jifen");
        this.text_gold = ccui.helper.seekWidgetByName(panel_jifen, "text_fangka");
        this.text_gold.setString(util.convertScore(hall.user.goldNum));

        this.btn_help = ccui.helper.seekWidgetByName(root, "btn_help");
        this.btn_help.addClickEventListener(this.onwanfa.bind(this));
        var btn_huodong = ccui.helper.seekWidgetByName(root, "btn_huodong");
        btn_huodong.addClickEventListener(this.onHuodong.bind(this));
        this.btn_setup = ccui.helper.seekWidgetByName(root, "btn_setup");
        this.btn_setup.addClickEventListener(this.onSetup.bind(this));
        this.btn_zhanji = ccui.helper.seekWidgetByName(root, "btn_zhanji");
        this.btn_zhanji.addClickEventListener(this.onZhanji.bind(this));
        this.btn_wanfa = ccui.helper.seekWidgetByName(root, "btn_wanfa");
        this.btn_wanfa.addClickEventListener(this.onHelp.bind(this));

        this.btn_share = ccui.helper.seekWidgetByName(root, "btn_share");
        var node_anim = util.playTimeLineAnimation(GameHallJson.FX,true);
        node_anim.setPosition(cc.p(this.btn_share.getContentSize().width/2,this.btn_share.getContentSize().height/2));
        this.btn_share.addChild(node_anim, 100);
        this.btn_share.addClickEventListener(this.onShare.bind(this));

        this.btn_bindCode = ccui.helper.seekWidgetByName(root, "btn_bindcode");
        var node_anim = util.playTimeLineAnimation(GameHallJson.BD,true);
        node_anim.setPosition(cc.p(this.btn_bindCode.getContentSize().width/2,this.btn_bindCode.getContentSize().height/2));
        this.btn_bindCode.addChild(node_anim, 100);
        this.btn_bindCode.addClickEventListener(this.onBindCode.bind(this));

        this.btn_turnTable = ccui.helper.seekWidgetByName(root, "btn_turnTable");
        var node_anim = util.playTimeLineAnimation(GameHallJson.DZP,true);
        node_anim.setPosition(cc.p(this.btn_turnTable.getContentSize().width/2,this.btn_turnTable.getContentSize().height/2));
        this.btn_turnTable.addChild(node_anim, 100);
        this.btn_turnTable.addClickEventListener(this.onBigZhuanPan.bind(this));

        this.btn_exchange = ccui.helper.seekWidgetByName(root, "btn_exchange");
        var node_anim = util.playTimeLineAnimation(GameHallJson.DH,true);
        node_anim.setPosition(cc.p(this.btn_exchange.getContentSize().width/2,this.btn_exchange.getContentSize().height/2));
        this.btn_exchange.addChild(node_anim, 100);
        this.btn_exchange.addClickEventListener(this.onExchange.bind(this));
        //
        this.btn_back = ccui.helper.seekWidgetByName(root, "btn_back");
        // this.btn_back.setVisible(false);
        this.btn_back.addClickEventListener(this.onBackpack.bind(this));

        this.panel_gold = ccui.helper.seekWidgetByName(root, "panel_gold");

        this.panel_fk = ccui.helper.seekWidgetByName(root, "panel_fk");
        this.panel_gold.setVisible(false);

        var panel_bottom = ccui.helper.seekWidgetByName(root, "panel_bottom");

        //创建房间
        var btn_create = ccui.helper.seekWidgetByName(root, "btn_create");
        btn_create.addClickEventListener(this.onCreateGame.bind(this));
        btn_create.addTouchEventListener(util.btnTouchEvent);

        //更多游戏
        var btn_moreGame = ccui.helper.seekWidgetByName(root, "btn_moreGame");
        btn_moreGame.addClickEventListener(this.onMoreGame.bind(this));
        btn_moreGame.addTouchEventListener(util.btnTouchEvent);

        //亲友圈
        var btn_club = ccui.helper.seekWidgetByName(root, "btn_club");
        btn_club.addClickEventListener(this.onClub.bind(this));
        btn_club.addTouchEventListener(util.btnTouchEvent);
        var node_anim = util.playTimeLineAnimation(GameHallJson.JLB,true);
        node_anim.setPosition(cc.p(btn_club.getContentSize().width/2,btn_club.getContentSize().height/2));
        btn_club.addChild(node_anim, 100);

        //金币场
        var btn_gold = ccui.helper.seekWidgetByName(root, "btn_bisai");
        btn_gold.addTouchEventListener(util.btnTouchEvent);
        btn_gold.addClickEventListener(function(){
            MajhongLoading.show('加载中...');
            hall.net.joinGoldTable("doudizhu",1, 1, function(data){
                console.log("data", data)
                var index = 1;
                MajhongLoading.dismiss();
                if (data.code == 200) {
                    hall.enter(DDZPoker.appId, -1);
                } else if(data.needGold == 1)
                {

                    var times =  hall.dayLogin.activeData.dayGold;
                    if(times < 4 && index == 1)
                    {
                        util.getDayGoldTip(data.rewardNum,times+1);
                    }else
                    {
                        //var dialog = new JJMajhongDecideDialog();
                        //dialog.setDes(data['error']);
                        //dialog.setCallback(function () {
                        //    util.showLessGoldDialog();
                        //});
                        //dialog.showDialog();
                        hall.net.getShopConfig(function (data) {
                            if (data.code == 200) {
                                var recharge = new GameShop(data["data"]);
                                recharge.showPanel();
                            } else {
                                var dialog = new JJConfirmDialog();
                                dialog.setDes(data['msg']);
                                dialog.showDialog();
                            }
                        });
                    }
                }else
                {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data['error']);
                    dialog.showDialog();
                }
            })
            return;
            var tips = '敬请期待';
            var dialog = new JJConfirmDialog();
            dialog.setDes(tips);
            dialog.showDialog();
            return;
            //金币场界面提出来
            var GoldField = new MajhongGoldField();
            GoldField.showPanel();
        }.bind(this));

        //加入游戏
        var btn_join = ccui.helper.seekWidgetByName(root, "btn_join");
        btn_join.addClickEventListener(this.onJoinGame.bind(this));
        var btn_join_anim = ccs.load("res/Animation/effect/ef_saoguang_0001.json");
        var node1 = btn_join_anim.node;
        node1.setPosition(btn_join.getContentSize().width / 2, btn_join.getContentSize().height / 2);
        var action1 = btn_join_anim.action;
        node1.runAction(action1);
        action1.gotoFrameAndPlay(0);
        btn_join.addChild(node1, 100);

        //摇摇乐
        // var btn_game = ccui.helper.seekWidgetByName(root, "btn_game");
        // var node_anim = util.playTimeLineAnimation(GameHallJson.YYL,true);
        // node_anim.setPosition(cc.p(btn_game.getContentSize().width/2,btn_game.getContentSize().height/2));
        // btn_game.addChild(node_anim, 100);
        // btn_game.addClickEventListener(this.onOpenGame.bind(this));

        //背景人物
        var bg_background = ccui.helper.seekWidgetByName(root, "bg_background");
        var Panel_1 = ccui.helper.seekWidgetByName(root, "Panel_1");
        var node_anim = util.playTimeLineAnimation(GameHallJson.RW,true);
        node_anim.setPosition(cc.p(Panel_1.getContentSize().width/2,Panel_1.getContentSize().height/2));
        Panel_1.addChild(node_anim, 100);
        var flower = new cc.ParticleSystem("res/Animation/particle_texture.plist");
        bg_background.addChild(flower,100);
        flower.setPosition(640,360);

        var img_light = ccui.helper.seekWidgetByName(root, "img_light");
        img_light.runAction(cc.sequence(cc.fadeIn(3),cc.fadeOut(2)).repeatForever());

        var btn_shop = ccui.helper.seekWidgetByName(root, "btn_kefu");
        btn_shop.addClickEventListener(this.onAddFangka.bind(this));

        this.img_arrow = ccui.helper.seekWidgetByName(root, "image_arrow");
        if (hall.user['agentCode'] == '0' || hall.user['agentCode'] == undefined || hall.user['agentCode'] == '') {
            this.img_arrow.runAction(cc.sequence(cc.moveBy(0.6, cc.p(30, 0)), cc.moveBy(0.7, cc.p(-30, 0))).repeatForever());
            var star0 = ccui.helper.seekWidgetByName(this.img_arrow, "star0");
            var star1 = ccui.helper.seekWidgetByName(this.img_arrow, "star1");
            star0.runAction(cc.sequence(cc.fadeIn(0.6), cc.fadeOut(0.7)).repeatForever());
            star1.runAction(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.6)).repeatForever());

        } else {
            // todo for test 暂时去掉
            this.img_arrow.setVisible(false);
            this.btn_bindCode.setVisible(false);
        }


        this.showMatch = function(){
            var match = new MatchMainLayer(function () {
                this.panel_fk.setVisible(true);
                panel_bottom.setVisible(true);
            }.bind(this));
            match.showPanel();
            this.panel_fk.setVisible(false);
            panel_bottom.setVisible(false);
        }.bind(this);

        var btn_match = ccui.helper.seekWidgetByName(root, "btn_match");
        btn_match.addTouchEventListener(util.btnTouchEvent);
        btn_match.addClickEventListener(this.showMatch);
        btn_match.setVisible(false);
        
        var back_fk = ccui.helper.seekWidgetByName(this.panel_gold, "btn_backfk");
        back_fk.addClickEventListener(function(){
            this.panel_fk.setVisible(true);
            this.panel_gold.setVisible(false);
        }.bind(this));

        for(var i = 0;i<3;i++)
        {
            var btn = ccui.helper.seekWidgetByName(this.panel_gold, "btn_create_"+i);
            btn.setTag(i);
            btn.addClickEventListener(function (sender) {
                this.gameIndex = sender.getTag();
                this.panel_fk.setVisible(false);
                this.panel_gold.setVisible(false);
            }.bind(this))
        }
    },


    onSwitchGame: function () {
        var index = this['index'];
        var _this = this['this'];
        _this.SSSGameIndex = index;


        for (var i = 0; i < _this.btn_Array.length; i++) {
            if (i == index) {
                _this.btn_Array[i].setBright(false);
                _this.btn_Array[i].setTouchEnabled(false);
            } else {
                _this.btn_Array[i].setBright(true);
                _this.btn_Array[i].setTouchEnabled(true);
            }
        }
    },

    onClickpersonSound: function () {
        sound.stopEffect();
        var bgStr = 'res/audio/effect/audio_girl.mp3';
        sound.playSound(bgStr);
    },

    onHideBindCode: function () {
        if(hall.gameInfo != null)
        {
            hall.gameInfo.allowChange = 0;
        }
        this.btn_bindCode.setVisible(false);
        this.img_arrow.setVisible(false);
    },

    onEnter: function () {
        this._super();
        sound.playBgSound();
        sound.stopEffect();

        this.updateInfo();
        this.registerAllEvents();
        var _this = this;
        // cc.setTimeout(function () {
        //     _this._touchListener = util.createScreenTouchEvent();
        //     GameMatch.checkMatchStatus();
        // }, 500);

        if(hall.agentWeChat.length == 0)
        {
            hall.net.getWeChatId(function (data) {
                if (data.code == 200) {
                    hall.agentWeChat = data.data;
                }
                else {

                }
            }.bind(this));
        }

        if (hall.songshen != 1) {
            var notice = new MajhongNotice();
            notice.y -= 10;
            notice.setVisible(false);
            this.addChild(notice);
        } else {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                this.panel_fangka.setVisible(false);
            }
            //设置某些节点永远不显示
            util.NodesForeverVibleForParent(
                this.Root, 
                [
                    "btn_bindcode",
                    "btn_exchange",
                    "btn_turnTable",
                    "btn_share",
                    "btn_game",
                    "btn_match",
                    "btn_moreGame",
                    "btn_club",
                ], 
                false
            );
        };

        if (hall.mustUpdate) {
            MajhongLoading.dismiss();
            var dialog = new JJMustUpdateDialog();
            dialog.setDes('发现新版本，前去下载更新！');
            dialog.setCallback(function () {
                cc.sys.openURL(hall.updateUrl);
            });
            this.addChild(dialog, 100);
        }
        else {
            if (hall.wxEnterRoom > 0) {
                 this.getTableServerType();
            }
        }
        hall.bLogined = true;
        util.ChangeloadHead(this.Root,hall.MyUseItemData);
    },

    getTableServerType:function () {
        hall.net.getTableServerType(parseInt(hall.wxEnterRoom), function (data) {
            if (data.code == 200) {
                var appId = GAMETYPES[data.serverType];
                JJLog.print("进入游戏=>", GAMENAMES[data.serverType]);
                this.joinPrivate(appId);
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data['error']);
                dialog.showDialog();
            }
        });
    },

    joinPrivate:function (appId) {
        hall.joinPrivate(appId, hall.wxEnterRoom, function (data) {
            if (data["code"] == 200) {
                hall.enter(appId);
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data['error']);
                dialog.showDialog();
            }
        });
    },


    onExit: function () {
        this._super();
        this.removeAllEvents();
        this.releaseAllItem();
        if(this._touchListener != null && this._touchListener!= undefined)
        {
            cc.eventManager.removeListener(this._touchListener);
        }
    },

    releaseAllItem: function () {
        this.text_name = null;
        this.text_id = null;
        this.text_fangka = null;
        this.panel_fangka = null;
        this.btn_help = null;
        this.btn_setup = null;
        this.btn_share = null;
        this.sprite_head = null;
        this.image_frame = null;
        this.text_name = null;
        this.alreadyClose = true;
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
        qp.event.listen(this, 'packNotifyJoinGame', this.onShowRoomInfo.bind(this));
        qp.event.listen(this, 'hallDayLoginMsg', this.onHallDayLogin.bind(this));
        qp.event.listen(this, 'hallUpdateEquip', this.hallUpdateEquipSwitch.bind(this));
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'hallUpdatePlayerAttr');
        qp.event.stop(this, 'packNotifyJoinGame');
        qp.event.stop(this, 'hallDayLoginMsg');
        qp.event.stop(this, 'hallUpdateEquip');
    },

    hallUpdateEquipSwitch:function (data) {
        util.ChangeloadHead(this.Root,data);
    },

    onUpdatePlayerAttr: function (data) {
        JJLog.print('hall onUpdatePlayerAttr');
        JJLog.print(data);

        if (data['gemNum'] != null || data['gemNum'] != undefined) {
            this.text_fangka.setString(data['gemNum']);
        }

        if(data['goldNum'] != null || data['goldNum'] != undefined)
        {
            this.text_gold.setString(util.convertScore(data['goldNum']));
        }

    },

    showHall: function () {
        hall.inRoom = false;
        var scene = new cc.Scene();
        scene.addChild(this);
        if (cc.sys.isNative) {
            cc.director.replaceScene(scene);
        } else {
            cc.director.runScene(scene);
        }

        club.gameBackClub();
    },

    updateInfo: function () {
        this.updateHead();
        this.updateName();
    },

    updateName: function () {
        var nickName = hall.user["nickName"];
        if(nickName.length > 8){
            nickName = nickName.substr(0,8) + "...";
        }

        if (hall.user["nickName"].length > 0) {
            if (cc.sys.isNative) {
                //var nickName = hall.user["nickName"];
                this.text_name.setString(nickName);
            } else {
                this.text_name.setString(nickName);
            }
        } else {
            this.text_name.setString(nickName);
        }
        this.text_id.setString('ID: ' + hall.user['uid']);
    },

    updateHead: function () {
        var _this = this;
        if (hall.user.headUrl != undefined && hall.user.headUrl.length > 0) {
            util.LoadHead(_this.sprite_head,hall.user.headUrl);
        }
    },

    onPlayerInfo: function () {
        var dialog = new PlayerInfoDialog(hall.user);
        dialog.showDialog();
    },

    onCreateGame: function () {
        sound.playBtnSound();
       var room = new CreateRoomView();
       room.showPanel();
    },

    onMoreGame: function () {
        sound.playBtnSound();
        var tips = '敬请期待';
        var dialog = new JJConfirmDialog();
        dialog.setDes(tips);
        dialog.showDialog();
    },

    onOpenGame: function () {
        sound.playBtnSound();
        return;
        var panel = new MajhongGame();
        panel.showPanel();
    },

    onJoinGame: function () {
        sound.playBtnSound();
        var panel = new InputRoomPanel();
        panel.showPanel();
    },

    onFeedBack: function () {

    },

    onFangka: function () {
        var dialog = new JJGiveRoomCard();
        dialog.showDialog();
    },

    onAddFangka: function () {
        sound.playBtnSound();
        //console.log("onAddFangka:",this);
        //nebPay.call(nebulasConfig.config.contractAddr,"0",nebulasConfig.config.getGameList,JSON.stringify([-1,-1]),nebulasConfig.config.defaultOptions);

        if (hall.songshen == 1 || (hall.gameInfo !=null && hall.gameInfo.iOS_Pay == 1)) {
            var panel = new  GameSongShenRecharge();
            panel.showPanel();
        } else {
            //if (hall.user['agentCode'] == '0' || hall.user['agentCode'] == null || hall.user['agentCode'] == undefined ||
            //    hall.user['agentCode'] == '') {
            //    var bindCodePanel = new MajhongBindCode(this);
            //    bindCodePanel.showBindCode();
            //}
            //else {
                hall.net.getShopConfig(function (data) {
                    if (data.code == 200) {
                        var recharge = new GameShop(data["data"]);
                        recharge.showPanel();
                    } else {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(data['msg']);
                        dialog.showDialog();
                    }
                });
//            }
        }
    },

    onMatch:function () {
        cc.setTimeout(function () {
            if(this.showMatch)
            {
                this.showMatch();
            }
        }.bind(this),100)
    },

    onwanfa: function () {
        var dialog = new AddFKDialog();
        dialog.showDialog();
    },

    onHuodong: function () {
        var dialog = new MajhongAnnounce();
        dialog.showPanel();
    },

    onHelp: function () {
        sound.playBtnSound();
        var msg = new HallHelpView();
        msg.showHelp();
    },

    onBindCode: function () {
        sound.playBtnSound();
        var bindCodePanel = new MajhongBindCode(this);
        bindCodePanel.showBindCode();
    },

    onBackpack: function () {
        var c = new Majhong_Backpack();
        c.showPanel();
    },

    onBigZhuanPan: function () {
        var dialog = new MajhongBigZhuanPan();
        dialog.showPanel();
    },

    onExchange:function () {
        sound.playBtnSound();
        MajhongLoading.show('加载中...');
        hall.net.goodlist(0,100,function (listData) {
            if(listData.code == 200)
            {
                MajhongLoading.dismiss();
                console.log("goodlist:",JSON.stringify(listData));
                var recharge = new GameExchange(listData);
                recharge.showPanel();
            }
            else
            {
                var dialog = new JJConfirmDialog();
                dialog.setDes(listData['error']);
                dialog.showDialog();
            }
        }.bind(this));
    },

    onSetup: function () {
        sound.playBtnSound();
        var set = new SetupDialog(0);
        set.showDialog();
    },

    onMsg: function () {
        sound.playBtnSound();
        var msg = new MajhongHallMessage();
        msg.showMsg();
    },

    onZhanji: function () {
        sound.playBtnSound();
        var history = new MajhongHistory();
        history.showHistory();
    },

    onShare: function () {
        sound.playBtnSound();
        this.btn_share.setTouchEnabled(false);
        hall.net.getPlayerInfo(function (data) {
            this.btn_share.setTouchEnabled(true);
            var dialog = new JJShareDialog(data);
            dialog.showDialog();
        }.bind(this));
    },

    onHallDayLogin: function (data) {
        // hall.dayLogin.activeData = data.activeData;
        // if (data && data.activeData.dayGold === 1) {
        //     this.btn_getCoin.setVisible(false);
        // }
    },

    onClub: function () {
        sound.playBtnSound();
        hall.club.enter();
    },

    onShowRoomInfo: function (data) {
        if(hall.inRoom == true) return;
        club.getClubInviteInstance(data);
    }
});


