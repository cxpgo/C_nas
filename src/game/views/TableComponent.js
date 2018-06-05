/**
 * 干什么呢
 * 
 * 核心主要是方便在创建桌子的时候 ，将桌子视图上所有通用的操作提出来，公共处理
 * 例如：
 *      1.设置
 *      2.房间号
 *      3.语音条田
 *      ......
 */
var TableComponent = function () {
    /**
     * 用cc.Node 只是方便内存管理
     */
    var XYComment = cc.Node.extend({
        _Listeners: [],
        ctor: function (root) {
            this._super();
            this._Listeners = [];

            //设置
            this.btn_setting = this.findNodeMoreC(root, ["btn_setting"]);
            if (this.btn_setting) {
                this.btn_setting.addClickEventListener(this.onSetting.bind(this));
            }

            //聊天
            this.btn_msg = this.findNodeMoreC(root, ["btn_msg"]);
            if (this.btn_msg) {
                this.enableSendMsg = 1;
                this.btn_msg.addClickEventListener(this.sendMsg.bind(this));
                this.schedule(this.updataSendMsgStatus, 5);
            }


            //语音聊天
            this.btn_speak = this.findNodeMoreC(root, ["btn_speak"]);
            if (this.btn_speak) {
                SpeakCtrl.Ctrl(this.btn_speak);
            }

            //add游戏logo
            this.img_logo = this.findNodeMoreC(root, ["img_logo"]);
            if (this.img_logo && XYGLogic.Instance.getGameLogo()) {
                this.img_logo.loadTexture(XYGLogic.Instance.getGameLogo(), ccui.Widget.LOCAL_TEXTURE);
            }


            //游戏背景图
            this.image_bg = this.findNodeMoreC(root, ["image_bg"]);
            if (this.image_bg && XYGLogic.Instance.IsChangeGameBg()) {
                var cahceV = parseInt(util.getCacheItem(PokerBgGCCacheKey) || 1);
                this.image_bg.loadTexture(Setting_BgCfg[cahceV - 1]);

                if (this.img_logo) {
                    this.img_logo.setVisible(cahceV == 1 || cahceV == 2)
                }
            }


            //界面信息
            this.panel_infomation = this.findNodeMoreC(root, ["panel_infomation"]);
            this.panel_option_waiting = this.findNodeMoreC(root, ["panel_option_waiting"]);
            this.text_room_id = this.findNodeMoreC(this.panel_infomation, ["text_room_id"]);
            this.text_time = this.findNodeMoreC(this.panel_infomation, ["text_time"]);

            //微信邀请
            this.btn_invite_wechat = this.findNodeMoreC(this.panel_option_waiting, ["btn_invite_wechat"]);
            if (this.btn_invite_wechat) {
                this.btn_invite_wechat.addClickEventListener(this.onInviteWeChat.bind(this));
                if (hall.songshen == 1) {
                    this.btn_invite_wechat.setVisible(false);
                }
            }


            //规则
            this.panel_rule = this.findNodeMoreC(root, ["panel_ddz_rule", "panel_pdk_rule"]);
            if (this.panel_rule) {
                this.panel_rule.setVisible(false);
                this.panel_rule.addClickEventListener(function () {
                    this.panel_rule.runAction((cc.moveBy(0.2, 0, 720)))
                }.bind(this));
            }
            this.btn_rule = this.findNodeMoreC(root, ["btn_rule"]);
            if (this.btn_rule) {
                this.btn_rule.addClickEventListener(function () {
                    // todo
                    this.panel_rule.setVisible(true);
                    this.btn_rule.setTouchEnabled(false);
                    this.panel_rule.runAction(cc.sequence(cc.moveBy(0.4, 0, -720), cc.callFunc(function () {
                        this.btn_rule.setTouchEnabled(true);
                    }.bind(this))))
                }.bind(this));
            }

            //配牌器
            this.btnCardsSelector = this.findNodeMoreC(root, ["cards_selector"]);

            if (this.btnCardsSelector) {
                this.btnCardsSelector.setVisible(true);
                this.btnCardsSelector.addClickEventListener(function () {
                    XYGLogic.Instance.CardsSelectorHelp();
                }.bind(this));
                if(cc.sys.isNative){
                    this.btnCardsSelector.setVisible(false);
                }
            }



            if (this.text_time) {
                this.schedule(this.updateTime, 1);
            }

        },

        onSetting: function () {
            sound.playBtnSound();
            var set = new SetupDialog(1);
            set.registerDissolveEvent(this.exitGame.bind(this));
            set.showDialog();
        },

        exitGame: function () {
            XYGLogic.Instance.exitGame();
        },

        onInviteWeChat: function () {
            sound.playBtnSound();
            JJLog.print('click invite wechat');
            hall.getPlayingGame().wxShareURL();
        },

        removeCustomEvt: function () {
            for (var i = 0; i < this._Listeners.length; i++) {
                cc.eventManager.removeListener(this._Listeners[i]);
            }
            this._Listeners.splice(0, this._Listeners.length);
        },

        /**
         * 多种途径 获取child
         * names  可以是数组
         * tag    尚未支持
         */
        findNodeMoreC: function (parent, names, tag) {
            names = [].concat(names);
            for (var index = 0; index < names.length; index++) {
                var name = names[index];
                var node = ccui.helper.seekWidgetByName(parent, name);
                if (node) {
                    return node;
                }
            }
        },

        sendMsg: function () {
            sound.playBtnSound();
            var chat = new PDKChat();
            chat.showPanel();
        },

        updataSendMsgStatus: function (dt) {
            if (hall.enableSendMsg == 0) {
                hall.enableSendMsg = 1;
            }
        },

        updateTime: function (dt) {
            var date = new Date();
            var hour = date.getHours();
            var timeStr = '';
            if (hour < 10) {
                timeStr = '0' + hour + ':';
            } else {
                timeStr = hour + ':';
            }
            var minute = date.getMinutes();
            if (minute < 10) {
                timeStr = timeStr + '0' + minute + ':';
            } else {
                timeStr = timeStr + minute + ':';
            }
            var sec = date.getSeconds();
            if (sec < 10) {
                timeStr = timeStr + '0' + sec;
            } else {
                timeStr = timeStr + sec;
            }
            this.text_time.setString(timeStr);
        },

        onEnter: function () {
            this._super();
            qp.event.listen(this, 'appGameBaseInfo', this.baseReadyInfo.bind(this));
            qp.event.listen(this, 'appGameRoomInfo', this._updateRoomInfo.bind(this));
            qp.event.listen(this, 'appRecordRoomInfo', this._updateRecordRoomInfo.bind(this));
            qp.event.listen(this, 'appGameRecord', this._resetRecord.bind(this));
            qp.event.listen(this, 'appGameBackground', this._resetBackground.bind(this));
            //切换桌面背景事件
            if (this.image_bg) {
                // var appId = hall.inTableId;
                // if(hall.gameEntries.hasOwnProperty(appId))
                // {
                //     var url = hall.gameEntries[appId].getGameBackground();
                //     if(url)
                //         this.image_bg.loadTexture(url, ccui.Widget.LOCAL_TEXTURE);
                // }
            }
        },

        onExit: function () {
            this._super();
            qp.event.stop(this, 'appGameBaseInfo');
            qp.event.stop(this, 'appGameRoomInfo');
            qp.event.stop(this, 'appRecordRoomInfo');
            qp.event.stop(this, 'appGameRecord');
            qp.event.stop(this, 'appGameBackground');
            this.removeCustomEvt();
        },

        baseReadyInfo: function () {
            if(hall.songshen == 1){
                for (var index = 0; index < 10; index++) {
                    cc.setTimeout(function(){
                        XYGLogic.net.addRobot(1, function (data) {
                            JJLog.print('add rebot resp');
                        });
                    }, Math.random() * (8000 - 1000) + 1000);
                }
            }
        },
        
        _resetBackground: function () {
            if (this.image_bg && XYGLogic.Instance.IsChangeGameBg()) {
                var cahceV = parseInt(util.getCacheItem(PokerBgGCCacheKey) || 1);
                this.image_bg.loadTexture(Setting_BgCfg[cahceV - 1]);

                if (this.img_logo) {
                    this.img_logo.setVisible(cahceV == 1 || cahceV == 2)
                }

            }
        },

        _updateRoomInfo: function () {
            var table = hall.getPlayingGame().table;
            var data = table.Data;
            var config = table.config;
            var desc = table.getTableDes();
            if (this.text_room_id) {
                this.text_room_id.setString(data['tableId']);
            }
            this.initInvite();
        },

        _updateRecordRoomInfo: function () {
            var table = hall.getPlayingGame().record;
            if (this.text_room_id) {
                this.text_room_id.setString(table['roomId']);
            }
        },

        initInvite: function () {
            var data = hall.getPlayingGame().table.Data;
            if (data.pid > 0) {
                club.gamePackId = data.pid;
                this.btn_invite_pack = new clubInviteButton(data.pid, data.tableId);
                this.btn_invite_pack.show(this.panel_option_waiting);
            }
        },

        _resetRecord: function () {
            if (this.panel_ready)
                this.panel_ready.setVisible(false);
            if (this.panel_option_waiting)
                this.panel_option_waiting.setVisible(false);
            if (this.btn_msg)
                this.btn_msg.setVisible(false);
            if (this.btn_rule)
                this.btn_rule.setVisible(false);
            if (this.btn_speak)
                this.btn_speak.setVisible(false);
        },
    });

    //=======================================
    var addComponent = function (tableView) {
        var comp = new XYComment(tableView);
        tableView.addChild(comp);
        return comp;
    };

    var ins = {};
    var ins = {
        addComponent: addComponent,
    };

    return ins;
}();