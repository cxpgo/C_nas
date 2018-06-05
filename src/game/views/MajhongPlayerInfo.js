var GamePlayerInfoDialog = JJDialog.extend({
    sprite_head: null,
    playerData: null,
    enableThrow: null,
    ctor: function (data) {
        this._super();
        this.playerData = data;
        var root = util.LoadUI(GameRes.PlayerInfoDialog).node;
        this.addChild(root);
        var panel = ccui.helper.seekWidgetByName(root, "panel");
        var panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        panel.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        panel_root.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        this.enableThrow = data.enableThrow;
        this.sprite_head = ccui.helper.seekWidgetByName(panel_root, "sprite_head");
        util.ChangeloadHead(panel_root,this.playerData['equip']);
        var image_sex_icon = ccui.helper.seekWidgetByName(panel_root, "image_sex_icon");
        var text_name = ccui.helper.seekWidgetByName(panel_root, "text_name");
        var text_id = ccui.helper.seekWidgetByName(panel_root, "text_id");
        var text_ip = ccui.helper.seekWidgetByName(panel_root, "text_ip");
        var text_times = ccui.helper.seekWidgetByName(panel_root, "text_times");
        // var image_new = ccui.helper.seekWidgetByName(panel_root, "image_new");
        // image_new.setVisible(false);
        var id = data['uid'];

        if (hall.getPlayingGame().table.uidOfInfo(data["uid"]) != null) {
            var name = data['nickName'];

            if (data['playedTime'] < 50)
                //image_new.setVisible(true);

            if (data['playedTime'] > 2000)
                text_times.setString("2000+");
            else
                text_times.setString(data['playedTime']);
            text_name.setString(name);
            text_id.setString('ID:' + id);
            var ip = data['ip'];
            text_ip.setString('IP:' + ip);
            if (data['userSex'] != 2 && data['userSex'] != 1) {
                data['userSex'] = 1;
            }
            var headStr = SexInfo[data['userSex']];
            image_sex_icon.loadTexture(headStr['icon'], ccui.Widget.PLIST_TEXTURE);
        }
        if(hall.songshen == 1){
            ccui.helper.seekWidgetByName(panel_root, "text_player0").setString("");
            return;
        }

        if (hall.getPlayingGame().table.seatArray != null) {
            var nav = null;
            for (var i = 0; i < hall.getPlayingGame().table.seatArray.length; i++) {
                var info = hall.getPlayingGame().table.seatArray[i];
                if (info == null || info == undefined) continue;
                var uid = info["uid"];
                if (uid > 999999) continue;
                if (id == uid && info["nav"] != null) {
                    nav = info["nav"];
                    break;
                }
            }
            if (nav == null) {
                ccui.helper.seekWidgetByName(panel_root, "text_player0").setString("该玩家没有开启定位");
            }
            else {
                var index = 0;
                for (var i = 0; i < hall.getPlayingGame().table.seatArray.length; i++) {
                    var info = hall.getPlayingGame().table.seatArray[i];
                    if (info == null || info == undefined) continue;
                    var uid = info["uid"];
                    if (uid > 999999) continue;
                    if (id != uid && info["nav"] != null) {
                        var dis = util.getDistance(nav.longitude, nav.latitude, info["nav"].longitude, info["nav"].latitude);
                        var str = "与【";
                        str += uid == hall.user.uid ? "您" : cutStringLenght(info['nickName']);
                        str += "】相距" + dis + "米";
                        ccui.helper.seekWidgetByName(panel_root, "text_player" + index.toString()).setString(str);
                        index++;
                    }
                }
            }
        }
        for (var i = 1; i < 6; i++) {
            var btn_throw = ccui.helper.seekWidgetByName(panel_root, "btn_" + i);
            btn_throw.addClickEventListener(function (sender) {

                if (this.enableThrow) {
                    this.enableThrow = false;
                    var index = sender.name.substring(4);

                    XYGLogic.Instance.throw({
                        "uid": data['uid']
                        , 'type': index
                    }, function (data) {

                    });

                    this.removeFromParent();
                }
                else {
                    this.removeFromParent();
                    var bar = new QDTipBar();
                    bar.show("您的发言过于频繁，请稍后再试！", 0.8);
                }

            }.bind(this));
            if (data['uid'] == hall.user.uid) {
                btn_throw.setVisible(false);
            }
        }
    },


    onEnter: function () {
        this._super();
        this.loadHead();

    },

    loadHead: function () {

        if (this.playerData != null && this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
            util.LoadHead(this.sprite_head, this.playerData.headUrl);
        }
    },

    onExit: function () {
        this._super();
        this.releaseAllItem();
    },

    releaseAllItem: function () {
        this.sprite_head = null;
    },


});