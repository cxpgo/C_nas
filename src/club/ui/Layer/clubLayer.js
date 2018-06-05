var clubLayer = cc.Layer.extend(
    {
        item_player: null,
        list_player: null,

        list_room_cell: null,
        room_cell: null,

        text_num_wait: null,
        text_num_game: null,
        text_union_name: null,
        text_union_id: null,
        text_union_person: null,
        text_fangka: null,

        panel_list_room: null,
        pid: null,
        pack_info: null,
        packNum: null,
        ownerUid: null,

        old_room_select: null,
        room_select: null,

        select_room_id: null,
        config_pageIndex: null,
        config_pageSize: null,
        show_pageSize: null,
        show_pageIndex: null,
        showPlayerLength: null,
        players: null,
        isAutoLoad: null,
        table_list: null,
        tip_no_room: null,
        table_state: null,
        room_cell_size: null,
        img_tip:null,
        text_tip:null,
        pack_info:null,

        ctor: function (data) {
            this._super();
            var root = util.LoadUI(ClubJson.PlayerUnion).node;
            this.addChild(root);

            var btn_back = ccui.helper.seekWidgetByName(root, "btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));

            var btn_menu = ccui.helper.seekWidgetByName(root, "btn_menu");
            btn_menu.addClickEventListener(function () {
                var layer = new clubMainLayer(club.type.common);
                layer.enter();
            }.bind(this));

            var btn_create = ccui.helper.seekWidgetByName(root, "btn_create");
            btn_create.addClickEventListener(function () {
                this.createRoom();
            }.bind(this));
            btn_create.addTouchEventListener(util.btnTouchEvent);

            var btn_wanfa = ccui.helper.seekWidgetByName(root, "btn_wanfa");
            btn_wanfa.addClickEventListener(function () {
                var panel = new clubWanfa();
                panel.show();
            });

            var btn_share = ccui.helper.seekWidgetByName(root, "btn_share");
            btn_share.addClickEventListener(function () {
                this.onShare();
            }.bind(this));
            btn_share.addTouchEventListener(util.btnTouchEvent);

            var btn_zhanji = ccui.helper.seekWidgetByName(root, "btn_zhanji");
            btn_zhanji.addClickEventListener(function () {
                this.onZhanji();
            }.bind(this));
            // btn_zhanji.addTouchEventListener(util.btnTouchEvent);

            var btn_gonggao = ccui.helper.seekWidgetByName(root, "btn_gonggao");
            btn_gonggao.addClickEventListener(function () {
                this.onNotice();
            }.bind(this));
            // btn_gonggao.addTouchEventListener(util.btnTouchEvent);

            var btn_admin = ccui.helper.seekWidgetByName(root, "btn_admin");
            btn_admin.addClickEventListener(function () {
                this.adminPack();
            }.bind(this));
            // btn_admin.addTouchEventListener(util.btnTouchEvent);
            if (data.ownerUid == hall.user.uid) {
                btn_admin.setVisible(true);
            } else {
                btn_admin.setVisible(false);
            }

            this.img_tip = ccui.helper.seekWidgetByName(btn_admin, "tip_img");
            this.text_tip = ccui.helper.seekWidgetByName(this.img_tip, "text_tip_apply");
            this.img_tip.setVisible(false);

            var btn_tipFangka = ccui.helper.seekWidgetByName(root, "btn_kefu");
            btn_tipFangka.addClickEventListener(function () {
                var dialog = new JJConfirmDialog();
                dialog.setDes("亲友圈钻石: 创建亲友圈房间时使用亲友圈钻石, 每日使用上限由群主设置");
                dialog.showDialog();
            }.bind(this));

            var btn_auto_join = ccui.helper.seekWidgetByName(root, "btn_auto_join");
            btn_auto_join.addClickEventListener(function () {
                this.onAutoJoin();
            }.bind(this));
            btn_auto_join.addTouchEventListener(util.btnTouchEvent);

            this.pack_info = data;
            this.pid = data.pid;
            this.pack_info = data;
            this.ownerUid = data.ownerUid;
            this.packNum = data.packNum;

            this.table_list = new Array();

            this.text_union_name = ccui.helper.seekWidgetByName(root, "text_union_name");
            this.text_union_id = ccui.helper.seekWidgetByName(root, "text_union_id");
            this.text_union_person = ccui.helper.seekWidgetByName(root, "text_union_person");
            this.text_fangka = ccui.helper.seekWidgetByName(root, "text_fangka");

            this.list_player = ccui.helper.seekWidgetByName(root, "listView_player");
            this.list_player.setVisible(true);

            this.config_pageIndex = 1;
            this.config_pageSize = club.maxPerson;
            this.show_pageSize = 8;
            this.show_pageIndex = 1;
            this.showPlayerLength = 8;
            this.players = [];
            this.list_player.addCCSEventListener(function (sender, type) {
                this.selectedItemEvent(sender, type);
            }.bind(this));
            this.item_player = ccui.helper.seekWidgetByName(root, 'panel_player');
            this.item_player.setVisible(false);

            var panel_right = ccui.helper.seekWidgetByName(root, "panel_right");
            this.list_room_cell = ccui.helper.seekWidgetByName(panel_right, "list_room_cell");
            this.tip_no_room = ccui.helper.seekWidgetByName(panel_right, "tip_no_room");
            this.tip_no_room.setVisible(false);
            this.room_cell = ccui.helper.seekWidgetByName(panel_right, "room_cell");
            var panel_room_palyer = ccui.helper.seekWidgetByName(this.room_cell, "panel_room_palyer");
            panel_room_palyer.addClickEventListener(function (sender) {
                this.selectRoomItem(sender);
            }.bind(this));
            this.room_cell.addClickEventListener(function (sender) {
                this.selectRoomItem(sender);
            }.bind(this));
            this.panel_list_room = ccui.helper.seekWidgetByName(panel_right, "panel_list_room");

            this.text_num_game = ccui.helper.seekWidgetByName(panel_right, "text_num_game");
            this.text_num_wait = ccui.helper.seekWidgetByName(panel_right, "text_num_wait");

            this.room_cell_size = this.room_cell.getContentSize();

            club.state_player[this.pid] = false;
            this.table_state = false;
            this.schedule(function () {
                JJLog.print("***************更新群房间信息**********************");
                // this.getPackPlayer();
                // this.getPackTablesList();
                if (this.table_state) {
                    this.table_state = false;
                    this.updateRoomCount();
                    this.sortListRoom();
                    this.showListRoom();
                }
            }.bind(this), 5);
            this.schedule(function () {
                if (club.state_player[this.pid]) {
                    club.state_player[this.pid] = false;
                    this.uniqPlayers();
                    this.showListPlayer();
                }
            }.bind(this), 2);


        },
        onEnter: function () {
            this._super();
            this.registerListener();
            this.getPackApplyList();
            this.getPackPlayer();
            this.updateRoomInfo(this.pack_info);
            this.getPackTablesList();
            club.state_notice[this.pid] = false;
        },
        onExit: function () {
            this._super();
            this.removeAllListener();
        },
        registerListener: function () {
            // qp.event.listen(this, 'packNotifyPlayerEnter', this.playerState.bind(this));
            // qp.event.listen(this, 'packNotifyPlayerLeave', this.playerState.bind(this));
            // qp.event.listen(this, 'packNotifyOnlineList', this.playerState.bind(this));
            qp.event.listen(this, 'packNotifyTableState', this.tableState.bind(this));
            qp.event.listen(this, 'packNotifyTableAdd', this.tableAdd.bind(this));
            qp.event.listen(this, 'packNotifyTableClose', this.tableClose.bind(this));
        },
        removeAllListener: function () {
            // qp.event.stop(this, 'packNotifyPlayerEnter');
            // qp.event.stop(this, 'packNotifyPlayerLeave');
            // qp.event.stop(this, 'packNotifyOnlineList');
            qp.event.stop(this, 'packNotifyTableState');
            qp.event.stop(this, 'packNotifyTableAdd');
            qp.event.stop(this, 'packNotifyTableClose');
        },
        playerEnter: function (data) {

        },
        playerLeave: function (data) {

        },
        playerState: function (data) {

        },
        tableState: function (data) {
            if (data.pid != this.pid) return;

            _.forEach(this.table_list, function (item) {
                if (item.state.tableId == data.tableId) {
                    for (var key in data) {
                        item.state[key] = data[key];
                    }
                }
            });
            this.table_state = true;
        },
        tableAdd: function (data) {
            if (data.pid != this.pid) return;
            this.table_list.push(data.table);

            this.table_state = true;
        },
        tableClose: function (data) {
            if (data.pid != this.pid) return;
            var delete_index = null;
            _.forEach(this.table_list, function (item, index) {
                if (item.state.tableId == data.tableId) {
                    delete_index = index;
                }
            });
            if (delete_index != null) {
                this.table_list.splice(delete_index, 1);
            }
            this.table_state = true;
        },
        enter: function () {
            cc.director.getRunningScene().addChild(this);
        },
        getPackPlayer: function () {
            club.net.getPackMembers(this.pid, this.config_pageIndex, this.config_pageSize, function (data) {
                if (data.code == 200) {
                    if (data.data) {
                        data = data.data;
                        // if (data.length >= this.config_pageSize) {
                        //     this.config_pageIndex++;
                        //     this.isAutoLoad = true;
                        // } else {
                        //     this.isAutoLoad = false;
                        // }
                        if (data.length > this.show_pageSize) {
                            this.showPlayerLength = this.show_pageSize;
                            this.isAutoLoad = true;
                        } else {
                            this.showPlayerLength = data.length;
                            this.isAutoLoad = false;
                        }
                        this.players = this.players.concat(data);
                        this.uniqPlayers();
                        this.showListPlayer();
                    } else {

                    }
                } else {
                    this.showErr(data)
                }
            }.bind(this));
        },
        uniqPlayers: function () {
            var users = club.onlineList[this.pid];
            var ownerUid = this.ownerUid;
            var self_index = null;
            var owner_index = null;
            _.forEach(this.players, function (item, index) {
                item.online = 0;
                if (users && users[item.uid]) {
                    item.online = users[item.uid].online;
                    // item.playerName = users[item.uid].userName;
                }
                if (item.uid == hall.user.uid) {
                    self_index = index;
                }
                if (item.uid == ownerUid) {
                    owner_index = index;
                }
            });
            // var self_temp = this.players.splice(self_index, 1)[0];
            var self_temp = this.players[self_index];
            // var owner_temp = this.players.splice(owner_index, 1)[0];
            var owner_temp = this.players[owner_index];
            this.players = this.players.sort(function (a, b) {
                if (a.online == 0 && a.online < b.online) return 1;
                if (a.online == 1 && a.online != b.online) return -1;
                if (a.online == 2 && b.online == 0) return -1;
                return a.online - b.online;
            });

            self_temp.online = 1;
            if (club.state_notice[this.pid]) {
                self_temp.notice = club.notice[this.pid];
            }
            this.players.unshift(owner_temp);
            this.players.unshift(self_temp);
            this.players = _.uniqBy(this.players, function (item) {
                return item.uid;
            });
        },
        getPlayerItem: function (index) {
            if (this.list_player.childrenCount > index) {
                return this.list_player.children[index];
            }
            var cell = this.item_player.clone();
            this.list_player.pushBackCustomItem(cell);
            return cell;
        },
        shrinkPlayerList: function (num) {
            var content = this.list_player;
            while (content.childrenCount > num) {
                var lastItem = content.children[content.childrenCount - 1];
                content.removeChild(lastItem, true);
            }
        },
        showListPlayer: function () {
            var list = this.players;
            this.shrinkPlayerList(this.showPlayerLength);
            for (var i = 0; i < this.showPlayerLength; i++) {
                var cell = this.getPlayerItem(i);
                var item = list[i];
                // if (i == 0) {
                cell.addClickEventListener(function (sender) {
                    var clubInfo = new ClubPlayerInfoDialog(sender.clickData, this.pack_info);
                    clubInfo.showDialog();
                }.bind(this));
                // }

                var name = ccui.helper.seekWidgetByName(cell, "text_name");
                var online = ccui.helper.seekWidgetByName(cell, "text_online");
                var sprite_head = ccui.helper.seekWidgetByName(cell, "sprite_head");
                var img_qunzhu = ccui.helper.seekWidgetByName(cell, "img_qunzhu");

                img_qunzhu.setVisible(false);
                if (this.ownerUid == item.uid) {
                    img_qunzhu.setVisible(true);
                }
                util.ChangeloadHead(cell,typeof(item['equip']) == 'string' ? JSON.parse(item['equip']) : item['equip']);
                this.updateHead(sprite_head, item.headUrl);
                name.setString(item.nickName);
                name.setTextColor(cc.color(72, 93, 101));
                if (item.online == 1) {
                    online.setString("在线");
                    online.setTextColor(cc.color(25, 147, 22));
                } else if (item.online == 2) {
                    online.setString("游戏中");
                    online.setTextColor(cc.color(255, 12, 12));
                } else {
                    online.setString("离线");
                    online.setTextColor(cc.color(145, 149, 149));
                }
                cell.setVisible(true);
                cell.clickData = item;
            }
        },
        getPackTablesList: function () {
            club.net.getPackTablesList(this.pid, function (data) {
                if (data.tables) {
                    data = data.tables;
                    this.table_list = data;
                    this.updateRoomCount(data);
                    this.sortListRoom();
                    this.showListRoom();
                } else {

                }
            }.bind(this));
        },
        getRoomItem: function (index) {
            index = index + 1;
            var content = this.panel_list_room;
            var layoutCount = content.childrenCount;
            var size = this.room_cell_size;
            var indexLayout = Math.ceil(index / 2);
            var indexItem = index % 2;
            if (layoutCount >= indexLayout) {
                var layout_item = content.children[indexLayout - 1];
                if (indexItem == 0) {
                    return layout_item.children[1];
                }
                return layout_item.children[0];
            }
            var layout = new ccui.Layout();
            layout.setContentSize(cc.size(2 * size.width + 40, size.height + 20));
            var cell_left = this.room_cell.clone();
            var cell_right = this.room_cell.clone();
            cell_left.x = 0;
            cell_left.y = 0;
            cell_right.x = size.width + 40;
            cell_right.y = 0;
            cell_left.setVisible(false);
            cell_right.setVisible(false);
            layout.addChild(cell_left);
            layout.addChild(cell_right);
            this.panel_list_room.pushBackCustomItem(layout);
            return cell_left;
        },
        shrinkRoomList: function (num) {
            var content = this.panel_list_room;
            var indexLayout = Math.ceil(num / 2);
            var indexItem = num % 2;
            while (content.childrenCount > indexLayout) {
                var lastItem = content.children[content.childrenCount - 1];
                content.removeChild(lastItem, true);
            }
            if (content.childrenCount > 0 && content.childrenCount == indexLayout) {
                var layout_item = content.children[indexLayout - 1];
                if (indexItem == 1) {
                    layout_item.children[1].setVisible(false);
                }
            }
        },
        showListRoom: function () {
            var data = this.table_list;
            var length = data.length;
            this.shrinkRoomList(length);
            for (var i = 0; i < length; i++) {
                var cell = this.getRoomItem(i);
                this.updateRoomCell(data[i], cell);
            }

        },
        sortListRoom: function () {
            this.table_list = this.table_list.sort(function (a, b) {
                if (a.state.gameState > b.state.gameState) return 1;
                if (a.state.isAuto > b.state.isAuto) return -1;
                return 0;
                // return a.state.playerUids.length - b.state.playerUids.length;
            });
        },
        getPackInfo: function () {
            club.net.getPacks(function (data) {
                if (data.data) {
                    data = data.data;
                    this.updateRoomInfo(data);
                } else {

                }
            }.bind(this))
        },
        updateRoomInfo: function () {
            var data = this.pack_info;
            this.text_fangka.setString(data.gemNum);
            this.text_union_person.setString(data.num + "/" + club.maxPerson);
            this.text_union_name.setString(data.name);
            this.text_union_name.setContentSize(this.text_union_name.getVirtualRendererSize());
            this.text_union_id.setString(data.packNum);
        },
        updateRoomCell: function (data, cell) {
            var title = ccui.helper.seekWidgetByName(cell, "text_room_game");
            var tip_wait = ccui.helper.seekWidgetByName(cell, "room_tip_wait");
            var tip_gameing = ccui.helper.seekWidgetByName(cell, "room_tip_gameing");
            var tip_text = ccui.helper.seekWidgetByName(cell, "tip_text");
            var panel_room_palyer = ccui.helper.seekWidgetByName(cell, "panel_room_palyer");
            cell.clickData = data;
            panel_room_palyer.clickData = data;
            var playerList = data.state.playerUids;
            var max_person = data.state.maxPerson || 4;
            panel_room_palyer.jumpToLeft();
            if (max_person > 4) {
                panel_room_palyer.setTouchEnabled(true);
            } else {
                panel_room_palyer.setTouchEnabled(false);
            }
            for (var i = 0; i < max_person; i++) {
                var _player = ccui.helper.seekWidgetByName(cell, "player_" + i);
                var sprite_head = ccui.helper.seekWidgetByName(_player, "sprite_head");
                _player.setVisible(true);
                if (playerList && playerList[i]) {
                    sprite_head.setVisible(true);
                    var uid = '' + playerList[i];
                    if (uid.length > 6) {
                        sprite_head.setVisible(false);
                    } else {
                        var url = "";
                        if (club.onlineList[this.pid] && club.onlineList[this.pid][playerList[i]]) {
                            util.ChangeloadHead(_player,typeof(club.onlineList[this.pid][playerList[i]]['equip']) == 'string' ? JSON.parse(club.onlineList[this.pid][playerList[i]]['equip']) : club.onlineList[this.pid][playerList[i]]['equip']);
                            url = club.onlineList[this.pid][playerList[i]].headUrl;
                        }
                        this.updateHead(sprite_head, url);
                    }
                } else {
                    sprite_head.setVisible(false);
                }
                // playerArr.push(_player);
            }
            for (var i = max_person; i < 8; i++) {
                var _player = ccui.helper.seekWidgetByName(cell, "player_" + i);
                // cell.setVisible(false);
                _player.setVisible(false);
                // playerArr.push(_player);
            }
            if (data.state.gameState == 1) {
                tip_gameing.setVisible(true);
                tip_wait.setVisible(false);
            } else {
                tip_gameing.setVisible(false);
                tip_wait.setVisible(true);
            }
            title.setTextColor(cc.color(72, 93, 101));
            tip_text.setTextColor(cc.color(150, 101, 0));
            title.setString(GAMENAMES[data.state.tableType]);
            // title.setContentSize(title.getVirtualRendererSize());
            // if (this.select_room_id && this.select_room_id == data.state.tableId) {
            //     this.room_select = this.old_room_select = cell;
            //     var new_img = ccui.helper.seekWidgetByName(this.room_select, "img_select");
            //     new_img.setVisible(true);
            // }
            cell.setVisible(true);
        },
        selectRoomItem: function (sender) {
            // if (this.select_room_id && this.select_room_id == sender.clickData.state.tableId) {
            //     // this.joinRoom(this.select_room_id);
            // }
            // this.select_room_id = sender.clickData.state.tableId;
            //
            // if (this.old_room_select == null) {
            //     this.room_select = this.old_room_select = sender;
            // } else {
            //     this.old_room_select = this.room_select;
            //     this.room_select = sender;
            // }
            // var old_img = ccui.helper.seekWidgetByName(this.old_room_select, "img_select");
            // var new_img = ccui.helper.seekWidgetByName(this.room_select, "img_select");
            // old_img.setVisible(false);
            // new_img.setVisible(true);

            var roomInfo = new ClubRoomInfo(sender.clickData, this.pack_info);
            roomInfo.showInfo();
        },
        joinRoom: function (roomInfo) {
            var roomId = roomInfo.state.tableId;
            var appId = GAMETYPES[roomInfo.state.tableType];
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
        selectedItemEvent: function (sender, type) {
            switch (type) {
                case ccui.ScrollView.EVENT_BOUNCE_BOTTOM:
                    if (this.isAutoLoad) {
                        this.show_pageIndex++;
                        var length = this.show_pageSize * this.show_pageIndex;
                        this.isAutoLoad = length > this.players.length ? false : true;
                        this.showPlayerLength = length > this.players.length ? this.players.length : length;
                        this.uniqPlayers();
                        this.showListPlayer();
                    }
                    break;
            }
        },
        updateRoomCount: function () {
            var data = this.table_list;
            var _wait = 0;
            var _game = 0;

            if (this.table_list.length == 0) {
                this.tip_no_room.setVisible(true);
            } else {
                this.tip_no_room.setVisible(false);
            }
            _.forEach(data, function (item) {
                if (item.state.gameState > 0) {
                    _game++;
                } else {
                    _wait++;
                }
            });

            this.text_num_wait.setString(_wait);
            this.text_num_game.setString(_game);
        },
        createRoom: function () {
            var panel = new clubCreateRoomView(1, this.pid);
            panel.showPanel();
            return;
            var layer = new clubSelectGameType(this.pid);
            layer.showPanel();
        },
        onZhanji: function () {
            sound.playBtnSound();
            var history = new ClubHistory(this.pid);
            history.showHistory();
        },
        onAutoJoin: function () {
            JJLog.print("自动加入房间");
            club.net.quickJoinRoom(this.pid, function (data) {
                if (data.code == 200) {
                    data = data.data;
                    this.joinRoom(data);
                } else {
                    this.showErr(data);
                }
            }.bind(this))
        },
        updateHead: function (node, url) {
            if (url != undefined && url.length > 0) {
                util.LoadHead(node,url);
            } else {
                node.removeAllChildren();
            }
        },
        updatePackByNum: function (num) {
            club.net.getPackByNum(num, function (data) {
                if (data.code == 200) {
                    this.pack_info = data.data;
                    this.updateRoomInfo();
                } else {
                    this.showErr(data);
                }
            }.bind(this))
        },
        onNotice: function () {
            var layer = new clubPackNotice(this.pid, this.pack_info.notice);
            layer.show();
        },
        onShare: function () {
            var title = "亲友圈分享";
            var desc = "欢迎加入我的亲友圈" + this.pack_info.name + "群号" + this.pack_info.packNum;
            hall.net.wxShareURL(title, desc, 0);
        },
        getPackApplyList: function () {
            if (this.ownerUid == hall.user.uid) {
                club.net.packApplyList(this.pid, function (data) {
                    if (data.code == 200) {
                        if (data.data.length > 0) {
                            this.img_tip.setVisible(true);
                            this.text_tip.setString(data.data.length);
                        }
                    }
                }.bind(this))
            }
        },
        adminPack: function () {
            var data = this.pack_info;
            util.setCacheItem("default_pack", data.pid);
            club.default_pack = data.pid;
            club.joinAdminPack(data);
            // this.removeFromParent();
        },
    }
);

var ClubPlayerInfoDialog = JJDialog.extend({
    sprite_head: null,
    playerData: null,
    pack_info: null,
    ctor: function (data, pack_info) {
        this._super();
        this.playerData = data;
        var JsonRes = ClubJson.ClubSelfInfo;
        var root = util.LoadUI(JsonRes).node;
        this.addChild(root);
        var panel = ccui.helper.seekWidgetByName(root, "panel");
        var panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        panel.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        panel_root.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        this.pack_info = pack_info;
        this.sprite_head = ccui.helper.seekWidgetByName(panel_root, "sprite_head");
        util.ChangeloadHead(panel_root,typeof(data['equip']) == 'string' ? JSON.parse(data['equip']) : data['equip']);
        var image_sex_icon = ccui.helper.seekWidgetByName(panel_root, "image_sex_icon");
        image_sex_icon.setVisible(false);
        var text_name = ccui.helper.seekWidgetByName(panel_root, "text_name");
        var text_id = ccui.helper.seekWidgetByName(panel_root, "text_id");
        // var text_note = ccui.helper.seekWidgetByName(panel_root, "text_note");
        // var input_note = ccui.helper.seekWidgetByName(panel_root, "input_note");
        // var text_ip = ccui.helper.seekWidgetByName(panel_root,"text_ip");
        var btn_kick = ccui.helper.seekWidgetByName(panel_root, "btn_kick");
        btn_kick.setVisible(false);
        var btn_back = ccui.helper.seekWidgetByName(panel_root, "btn_back");
        btn_back.addClickEventListener(function () {
            club.quitPack(this.pack_info);
            this.dismissDialog();
        }.bind(this));
        btn_back.addTouchEventListener(util.btnTouchEvent);
        var btn_close = ccui.helper.seekWidgetByName(panel_root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));
        btn_close.addTouchEventListener(util.btnTouchEvent);
        // var btn_change = ccui.helper.seekWidgetByName(panel_root, "btn_change");
        // btn_change.addClickEventListener(function () {
        //     JJLog.print("this.pack_info", this.pack_info, input_note.getString());
        //     club.updateMemberNote(this.pack_info.pid, input_note.getString() || " ");
        //     this.dismissDialog();
        // }.bind(this));
        var id = data['uid'];
        text_name.setString(data["nickName"]);
        text_id.setString('ID: ' + data['uid']);
        // btn_change.setVisible(false);
        btn_back.setVisible(false);
        // text_note.setVisible(false);
        // input_note.setVisible(false);
        if (id == hall.user.uid) {
            // btn_change.setVisible(true);
            btn_back.setVisible(true);
            // input_note.setVisible(true);
            // input_note.setString(data.notice);
        }
        this.loadHead();
    },


    onEnter: function () {
        this._super();
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