var ClubRoomInfo = cc.Layer.extend(
    {
        text_room:null,
        text_name:null,
        text_jushu:null,
        text_renshu:null,
        text_wanfa:null,
        text_qunname:null,
        text_qunid:null,
        btn_join:null,

        room_info:null,
        room_id:null,
        state:null,
        pack_info:null,

        ctor: function (data, packInfo) {
            this._super();
            var root = util.LoadUI(ClubJson.RoomInfo).node;
            this.addChild(root);

            var btn_back = ccui.helper.seekWidgetByName(root, "btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));
            btn_back.addTouchEventListener(util.btnTouchEvent);
            this.btn_join = ccui.helper.seekWidgetByName(root, "btn_join");
            this.btn_join.addClickEventListener(function () {
                this.joinRoom();
            }.bind(this));
            this.btn_join.addTouchEventListener(util.btnTouchEvent);

            this.room_info = data.conf;
            this.state = data.state;
            this.pack_info = packInfo;

            this.text_room = ccui.helper.seekWidgetByName(root, "text_room");
            this.text_name = ccui.helper.seekWidgetByName(root, "text_name");
            this.text_jushu = ccui.helper.seekWidgetByName(root, "text_jushu");
            this.text_renshu = ccui.helper.seekWidgetByName(root, "text_renshu");
            this.text_wanfa = ccui.helper.seekWidgetByName(root, "text_wanfa");
            this.text_qunname = ccui.helper.seekWidgetByName(root, "text_qunname");
            this.text_qunid = ccui.helper.seekWidgetByName(root, "text_qunid");


        },

        onEnter: function () {
            this._super();
            this.updateRoomInfo();
        },
        
        showInfo: function () {
            cc.director.getRunningScene().addChild(this);
        },
        joinRoom: function () {
            var roomId = this.state.tableId;
            var appId = GAMETYPES[this.state.tableType];
            var self = this;
            // if (GAMENAME.indexOf("jiangshu" != -1)) {
            if (parseInt(roomId) > 0) {
                hall.joinPrivate(appId, roomId, function (data) {
                    if (data["code"] == 200) {
                        hall.enter(appId);
                    } else {
                        self.showErr(data);
                    }
                });
            }
            // }
        },
        showErr: function (data) {
            var dialog = new JJConfirmDialog();
            dialog.setDes(data['error']);
            dialog.showDialog();
        },
        updateRoomInfo: function () {
            var data = this.room_info;
            var config = data.roomConfig;
            var state = this.state;
            var pack_info = this.pack_info;
            if (state.tableType == "shisanshui" && state.playerUids && state.playerUids.length < state.maxPerson) {
                this.btn_join.setVisible(true);
            } else if (state.gameState > 0) {
                this.btn_join.setVisible(false);
            }
            var roomName = GAMENAMES[config.tableName];
            this.text_room.setString(state.tableId);
            this.text_name.setString(roomName);
            this.text_name.setContentSize(this.text_name.getVirtualRendererSize());
            this.text_qunname.setString(pack_info.name);
            this.text_qunname.setContentSize(this.text_qunname.getVirtualRendererSize());
            this.text_qunid.setString(pack_info.packNum);
            this.text_qunid.setContentSize(this.text_qunid.getVirtualRendererSize());
            this.text_jushu.setString(config.rounds + "局");
            this.text_jushu.setContentSize(this.text_jushu.getVirtualRendererSize());
            this.text_renshu.setString(config.person || 4 + "人");
            this.text_renshu.setContentSize(this.text_renshu.getVirtualRendererSize());

            var wanfa = club.common.getWanfaDesc(config);
            this.text_wanfa.setString(wanfa);
            // var size = this.text_wanfa.getVirtualRendererSize();
            // size = this.resize(size);
            // this.text_wanfa.setContentSize(size);
        },
        resize: function (size) {
            var _size = cc.size(size.width, size.height);
            var width = size.width;
            var height = size.height;
            if (width > 700) {
                _size.width = 700;
                while (width > 700) {
                    width = width - 700;
                    _size.height += height;
                }
            }
            return _size;
        },
    }
);

var ClubInviteRoomInfo = cc.Layer.extend(
    {
        text_room:null,
        text_name:null,
        text_jushu:null,
        text_renshu:null,
        text_wanfa:null,
        text_qunname:null,
        text_qunid:null,
        btn_join:null,

        room_info:null,
        room_id:null,
        state:null,

        ctor: function (data) {
            this._super();
            var root = util.LoadUI(ClubJson.InviteRoomInfo).node;
            this.addChild(root);

            var btn_back = ccui.helper.seekWidgetByName(root, "btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));
            btn_back.addTouchEventListener(util.btnTouchEvent);
            var btn_reject = ccui.helper.seekWidgetByName(root, "btn_reject");
            btn_reject.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));
            btn_reject.addTouchEventListener(util.btnTouchEvent);
            this.btn_join = ccui.helper.seekWidgetByName(root, "btn_join");
            this.btn_join.addClickEventListener(function () {
                this.joinRoom();
            }.bind(this));
            this.btn_join.addTouchEventListener(util.btnTouchEvent);

            this.room_info = data;
            // this.state = data.state;

            this.text_room = ccui.helper.seekWidgetByName(root, "text_room");
            this.text_name = ccui.helper.seekWidgetByName(root, "text_name");
            this.text_jushu = ccui.helper.seekWidgetByName(root, "text_jushu");
            this.text_renshu = ccui.helper.seekWidgetByName(root, "text_renshu");
            this.text_wanfa = ccui.helper.seekWidgetByName(root, "text_wanfa");
            this.text_qunname = ccui.helper.seekWidgetByName(root, "text_qunname");
            this.text_qunid = ccui.helper.seekWidgetByName(root, "text_qunid");


        },

        onEnter: function () {
            this._super();
            this.updateRoomInfo();
        },

        show: function () {
            cc.director.getRunningScene().addChild(this);
        },

        joinRoom: function () {
            var roomId = this.room_info.tableId;
            var appId = GAMETYPES[this.room_info.serverType];
            var self = this;
            // if (GAMENAME.indexOf("jiangshu" != -1)) {
            if (parseInt(roomId) > 0) {
                hall.joinPrivate(appId, roomId, function (data) {
                    if (data["code"] == 200) {
                        hall.enter(appId);
                        self.removeFromParent();
                    } else {
                        self.showErr(data);
                        self.removeFromParent();
                    }
                });
            }
            // }
        },

        showErr: function (data) {
            var dialog = new JJConfirmDialog();
            dialog.setDes(data['error']);
            dialog.showDialog();
        },

        updateRoomInfo: function () {
            var data = this.room_info;
            var config = data.config;
            config.tableName = data.serverType;
            var roomName = GAMENAMES[data.serverType];
            this.text_room.setString(data.tableId);
            this.text_name.setString(roomName);
            // this.text_name.setContentSize(this.text_name.getVirtualRendererSize());
            this.text_qunname.setString(data.packName || "亲友圈");
            // this.text_qunname.setContentSize(this.text_qunname.getVirtualRendererSize());
            this.text_qunid.setString(data.packNum || "");
            // this.text_qunid.setContentSize(this.text_qunid.getVirtualRendererSize());
            this.text_jushu.setString(config.rounds + "局");
            // this.text_jushu.setContentSize(this.text_jushu.getVirtualRendererSize());
            this.text_renshu.setString((config.person || 4) + "人");
            // this.text_renshu.setContentSize(this.text_renshu.getVirtualRendererSize());
            var wanfa = club.common.getWanfaDesc(config);
            this.text_wanfa.setString(wanfa);
            // var _strText = new ccui.Text(wanfa, "DFYuanW7-GB2312", 24);
            // var size = _strText.getVirtualRendererSize();
            // var size =  this.text_wanfa.getVirtualRendererSize();
            // size = this.resize(size);
            // this.text_wanfa.setContentSize(size);
        },

        setRoomInfo: function (data) {
            this.room_info = data;
            this.updateRoomInfo();
        },
        resize: function (size) {
            var _size = cc.size(size.width, size.height);
            var width = size.width;
            var height = size.height;
            if (width > 700) {
                _size.width = 700;
                while (width > 700) {
                    width = width - 700;
                    _size.height += height;
                }
            }
            return _size;
        },

        onExit: function () {
            this._super();
            club.cleanClubInviteInstance();
        }
    }
);
