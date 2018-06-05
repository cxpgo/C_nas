var PlayerInfoDialog = JJDialog.extend({
    sprite_head: null,
    playerData: null,
    ctor: function (data) {
        this._super();
        this.playerData = data;
        var root = util.LoadUI(GameHallJson.PlayerInfo).node;
        this.addChild(root);
        var panel = ccui.helper.seekWidgetByName(root, "panel");
        var panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        panel.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        panel_root.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        this.sprite_head = ccui.helper.seekWidgetByName(panel_root, "sprite_head");
        util.ChangeloadHead(panel_root,hall.MyUseItemData);
        var image_sex_icon = ccui.helper.seekWidgetByName(panel_root, "image_sex_icon");
        var text_name = ccui.helper.seekWidgetByName(panel_root, "text_name");
        var text_id = ccui.helper.seekWidgetByName(panel_root, "text_id");
        var text_ip = ccui.helper.seekWidgetByName(panel_root, "text_ip");
        var text_gem = ccui.helper.seekWidgetByName(panel_root, "text_gem");
        var id = data['uid'];
        if (id == hall.user.uid) {
            text_name.setString(hall.user["nickName"]);
            text_id.setString(hall.user['uid']);
            text_gem.setString(hall.user['gemNum']);
            text_ip.setString(hall.user['ip']);
            JJLog.print("userSex:" + hall.user['userSex']);
            if (hall.user['userSex'] == undefined || hall.user['userSex'] == 0) {
                hall.user['userSex'] = 1;
            }
            image_sex_icon.loadTexture(SexInfo[hall.user['userSex']]['icon'], ccui.Widget.PLIST_TEXTURE);
        } else {
            if (hall.getPlayingGame().table.uidOfInfo(data["uid"]) != null) {
                var name = data['nickName'];

                text_gem.setString(data['gemNum']);
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
        }
        text_name.setContentSize(text_name.getVirtualRendererSize());
        this.loadHead();
    },

    onEnter: function () {
        this._super();
        this.loadHead();

    },

    loadHead: function () {

        if (this.playerData != null && this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
            util.LoadHead(this.sprite_head,this.playerData.headUrl);
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