var clubAdminLayer = cc.Layer.extend(
    {
        item_player: null,
        list_player: null,

        panel_right: null,
        apply_cell: null,
        listView_apply: null,
        apply_list: null,
        tip_no_apply: null,

        panel_right_auto: null,
        auto_cell: null,
        listView_auto: null,
        auto_list: null,
        tip_no_auto: null,
        btn_join_auto: null,

        panel_yaoqing: null,
        btn_yaoqing: null,
        btn_shenpi: null,
        btnArray: null,

        text_union_name: null,
        text_union_id: null,
        text_union_person: null,
        text_fangka: null,

        pid: null,
        pack_info: null,
        packNum: null,
        ownerUid: null,

        select_room_id: null,
        config_pageIndex: null,
        config_pageSize: null,
        show_pageSize: null,
        show_pageIndex: null,
        showPlayerLength: null,
        players: null,
        isAutoLoad: null,

        table_list: null,
        table_state: null,
        room_cell_size: null,
        input_invite_uid: null,
        pack_info: null,

        ctor: function (data) {
            this._super();
            var root = util.LoadUI(ClubJson.Admin).node;
            this.addChild(root);

            var btn_back = ccui.helper.seekWidgetByName(root, "btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));

            var btn_menu = ccui.helper.seekWidgetByName(root, "btn_menu");
            btn_menu.addClickEventListener(function () {
                var layer = new clubMainLayer(club.type.admin);
                layer.enter();
            }.bind(this));
            this.btn_yaoqing = ccui.helper.seekWidgetByName(root, "btn_yaoqing");
            this.btn_yaoqing.addClickEventListener(function () {
                this.onClickInvite();
            }.bind(this));
            this.btn_yaoqing.addTouchEventListener(util.btnTouchEvent);

            var btn_zhanji = ccui.helper.seekWidgetByName(root, "btn_zhanji");
            btn_zhanji.addClickEventListener(function () {
                this.onZhanji();
            }.bind(this));
            var btn_gonggao = ccui.helper.seekWidgetByName(root, "btn_gonggao");
            btn_gonggao.addClickEventListener(function () {
                this.onUpdateNotice();
            }.bind(this));

            var btn_recharge = ccui.helper.seekWidgetByName(root, "btn_kefu");
            btn_recharge.addClickEventListener(function () {
                this.onRecharge();
            }.bind(this));

            var btn_return = ccui.helper.seekWidgetByName(root, "btn_return");
            btn_return.addClickEventListener(function () {
                this.onReturnPack();
            }.bind(this));
            var btn_wanfa = ccui.helper.seekWidgetByName(root, "btn_wanfa");
            btn_wanfa.addClickEventListener(function () {
                var panel = new clubWanfa();
                panel.show();
            });

            this.btn_join_auto = ccui.helper.seekWidgetByName(root, "btn_join_auto");
            this.btn_join_auto.addClickEventListener(function () {
                this.onClickJoinAuto();
            }.bind(this));
            this.btn_join_auto.addTouchEventListener(util.btnTouchEvent);
            this.btn_join_auto.setVisible(true);
            this.pack_info = data;
            this.pid = data.pid;
            this.pack_info = data;
            this.packNum = data.packNum;
            this.ownerUid = data.ownerUid;

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

            this.panel_right = ccui.helper.seekWidgetByName(root, "panel_right");

            this.tip_no_apply = ccui.helper.seekWidgetByName(this.panel_right, "tip_no_apply");
            this.tip_no_apply.setVisible(false);
            this.apply_cell = ccui.helper.seekWidgetByName(this.panel_right, "panel_apply_cell");
            var btn_agree = ccui.helper.seekWidgetByName(this.apply_cell, "btn_agree");
            btn_agree.addClickEventListener(function (sender) {
                this.onClickAgreeApply(sender.clickData);
            }.bind(this));
            var btn_reject = ccui.helper.seekWidgetByName(this.apply_cell, "btn_reject");
            btn_reject.addClickEventListener(function (sender) {
                this.onClickRejectApply(sender.clickData);
            }.bind(this));
            this.listView_apply = ccui.helper.seekWidgetByName(this.panel_right, "listView_apply");

            this.panel_right_auto = ccui.helper.seekWidgetByName(root, "panel_right_auto");
            this.tip_no_auto = ccui.helper.seekWidgetByName(this.panel_right_auto, "tip_no_auto");
            this.tip_no_auto.setVisible(false);
            this.auto_cell = ccui.helper.seekWidgetByName(this.panel_right_auto, "panel_auto_cell");
            this.listView_auto = ccui.helper.seekWidgetByName(this.panel_right_auto, "listView_auto");
            var btn_delete_auto = ccui.helper.seekWidgetByName(this.auto_cell, "btn_delete_auto");
            btn_delete_auto.addClickEventListener(function (sender) {
                this.onDeleteAutoTable(sender.clickData);
            }.bind(this));

            var btn_create_auto = ccui.helper.seekWidgetByName(this.panel_right_auto, "btn_create_auto");
            btn_create_auto.addClickEventListener(function () {
                this.onCreateAutoRoom();
            }.bind(this));
            btn_create_auto.addTouchEventListener(util.btnTouchEvent);

            this.btn_shenpi = ccui.helper.seekWidgetByName(root, "btn_shenpi");
            this.btn_shenpi.addClickEventListener(function () {
                this.onClickShenpi();
            }.bind(this));
            this.btn_shenpi.addTouchEventListener(util.btnTouchEvent);

            this.panel_yaoqing = ccui.helper.seekWidgetByName(root, "panel_yaoqing");
            var panel_jianpan = ccui.helper.seekWidgetByName(this.panel_yaoqing, "panel_jianpan");
            var panel_kouling = ccui.helper.seekWidgetByName(this.panel_yaoqing, "panel_kouling");
            this.btnArray = new Array();
            for (var i = 0; i < 10; i++) {
                var str = "btn_" + i;
                var btn = ccui.helper.seekWidgetByName(panel_jianpan, str);
                btn.setTag(i);
                var data = {};
                data['root'] = this;
                data['tag'] = i;
                btn.addClickEventListener(this.onNum.bind(data));
                btn.addTouchEventListener(util.btnTouchEvent);
                this.btnArray.push(btn);
            }
            var btn_del = ccui.helper.seekWidgetByName(panel_jianpan, "btn_del");
            btn_del.addClickEventListener(this.onDel.bind(this));
            var btn_sure = ccui.helper.seekWidgetByName(panel_jianpan, "btn_sure");
            btn_sure.addClickEventListener(this.onInvite.bind(this));

            this.textArray = new Array();
            for (var i = 0; i < 6; i++) {
                var str = "Num_" + i;
                var text = ccui.helper.seekWidgetByName(panel_kouling, str);
                text.setString('');
                this.textArray.push(text);
            }

            this.panel_right.setVisible(true);
            this.panel_right_auto.setVisible(false);
            this.panel_yaoqing.setVisible(false);

            club.state_player[this.pid] = false;
            this.onClickShenpi();
            this.schedule(function () {
                // JJLog.print("***************更新用户信息**********************");
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
            this.getPackPlayer();
            this.updateRoomInfo();
            // this.getPackTablesList();
            this.getPackApplyList();
            this.getPackAutoList();
        },
        onExit: function () {
            this._super();
            this.removeAllListener();
        },
        registerListener: function () {
            // qp.event.listen(this, 'packNotifyPlayerEnter', this.playerState.bind(this));
            // qp.event.listen(this, 'packNotifyPlayerLeave', this.playerState.bind(this));
            // qp.event.listen(this, 'packNotifyOnlineList', this.playerState.bind(this));
            // qp.event.listen(this, 'packNotifyTableState', this.tableState.bind(this));
            // qp.event.listen(this, 'packNotifyTableAdd', this.tableAdd.bind(this));
            // qp.event.listen(this, 'packNotifyTableClose', this.tableClose.bind(this));
        },
        removeAllListener: function () {
            // qp.event.stop(this, 'packNotifyPlayerEnter');
            // qp.event.stop(this, 'packNotifyPlayerLeave');
            // qp.event.stop(this, 'packNotifyOnlineList');
            // qp.event.stop(this, 'packNotifyTableState');
            // qp.event.stop(this, 'packNotifyTableAdd');
            // qp.event.stop(this, 'packNotifyTableClose');
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
        deletePlyer: function (data) {
            var _index = null;
            _.forEach(this.players, function (item, index) {
                if (item.uid == data.uid) {
                    _index = index;
                }
            });
            this.players.splice(_index, 1);
            if (_index != null) {
                this.showPlayerLength--;
            }
        },
        addPlayer: function (data) {
            var name = data.nickName || data.playerName;
            data.nickName = name;
            this.players.push(data);
            this.showPlayerLength++;
        },
        uniqPlayers: function () {
            var users = club.onlineList[this.pid];
            var _index = null;
            _.forEach(this.players, function (item, index) {
                item.online = 0;
                if (users && users[item.uid]) {
                    item.online = users[item.uid].online;
                    item.playerName = users[item.uid].nickName;
                }
                if (item.uid == hall.user.uid) {
                    _index = index;
                }
            });
            var temp = this.players.splice(_index, 1)[0];
            this.players = this.players.sort(function (a, b) {
                if (a.online == 0 && a.online < b.online) return 1;
                if (a.online == 1 && a.online != b.online) return -1;
                if (a.online == 2 && b.online == 0) return -1;
                return a.online - b.online;
            });

            temp.online = 1;
            if (club.state_notice[this.pid]) {
                temp.notice = club.notice[this.pid];
            }
            this.players.unshift(temp);
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
                    var clubInfo = new ClubAdminInfoDialog(sender.clickData, this.pack_info, function (data) {
                        this.deletePlyer(data);
                        this.showListPlayer();
                    }.bind(this));
                    clubInfo.showDialog();
                }.bind(this));
                // }

                var name = ccui.helper.seekWidgetByName(cell, "text_name");
                var online = ccui.helper.seekWidgetByName(cell, "text_online");
                var sprite_head = ccui.helper.seekWidgetByName(cell, "sprite_head");
                util.ChangeloadHead(cell,typeof(item['equip']) == 'string' ? JSON.parse(item['equip']) : item['equip']);
                var img_qunzhu = ccui.helper.seekWidgetByName(cell, "img_qunzhu");

                img_qunzhu.setVisible(false);
                if (this.ownerUid == item.uid) {
                    img_qunzhu.setVisible(true);
                }

                this.updateHead(sprite_head, item.headUrl);
                name.setString(item.nickName);
                name.setTextColor(club.colors.user_name);
                if (item.online == 1) {
                    online.setString("在线");
                    online.setTextColor(club.colors.online);
                } else if (item.online == 2) {
                    online.setString("游戏中");
                    online.setTextColor(club.colors.game);
                } else {
                    online.setString("离线");
                    online.setTextColor(club.colors.offline);
                }
                cell.setVisible(true);
                cell.clickData = item;
            }
        },
        getPackApplyList: function () {
            club.net.packApplyList(this.pid, function (data) {
                if (data.code == 200) {
                    this.apply_list = data.data;
                    this.showPackApplyList();
                }
            }.bind(this))
        },
        showPackApplyList: function () {
            var data = this.apply_list;
            this.shrinkApplyList(data.length);
            if (data.length == 0) {
                this.tip_no_apply.setVisible(true);
                return;
            } else {
                this.tip_no_apply.setVisible(false);
            }
            for (var i = 0; i < data.length; i++) {
                var cell = this.getApplyItem(i);
                var item = data[i];

                var name = ccui.helper.seekWidgetByName(cell, "text_apply_name");
                var notice = ccui.helper.seekWidgetByName(cell, "text_apply_notice");
                var sprite_head = ccui.helper.seekWidgetByName(cell, "sprite_head");
                var btn_agree = ccui.helper.seekWidgetByName(cell, "btn_agree");
                var btn_reject = ccui.helper.seekWidgetByName(cell, "btn_reject");
                btn_agree.clickData = item;
                btn_reject.clickData = item;
                util.ChangeloadHead(cell,typeof(data[i]['equip']) == 'string' ? JSON.parse(data[i]['equip']) : data[i]['equip']);
                this.updateHead(sprite_head, item.headUrl);
                name.setString(item.nickName);
                name.setTextColor(club.colors.user_name);

                notice.setTextColor(club.colors.online);
            }

        },
        getApplyItem: function (index) {
            if (this.listView_apply.childrenCount > index) {
                return this.listView_apply.children[index];
            }
            var cell = this.apply_cell.clone();
            this.listView_apply.pushBackCustomItem(cell);
            return cell;
        },
        shrinkApplyList: function (num) {
            var content = this.listView_apply;
            while (content.childrenCount > num) {
                var lastItem = content.children[content.childrenCount - 1];
                content.removeChild(lastItem, true);
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
                // return 0;
                return a.state.playerUids.length - b.state.playerUids.length;
            });
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
            cell.clickData = data;

            var playerList = data.state.playerUids;
            for (var i = 0; i < 4; i++) {
                var _player = ccui.helper.seekWidgetByName(cell, "player_" + i);
                var sprite_head = ccui.helper.seekWidgetByName(_player, "sprite_head_0");
                if (playerList && playerList[i]) {
                    sprite_head.setVisible(true);
                    var url = "";
                    if (club.onlineList[this.pid] && club.onlineList[this.pid][playerList[i]]) {
                        util.ChangeloadHead(_player,typeof(club.onlineList[this.pid][playerList[i]]['equip']) == 'string' ? JSON.parse(club.onlineList[this.pid][playerList[i]]['equip']) : club.onlineList[this.pid][playerList[i]]['equip']);
                        url = club.onlineList[this.pid][playerList[i]].headUrl;
                    }
                    this.updateHead(sprite_head, url);
                } else {
                    sprite_head.setVisible(false);
                }
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
            title.setString(GAMENAMES[data.state.tableType]);
            title.setContentSize(title.getVirtualRendererSize());
            
            cell.setVisible(true);
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
        updateHead: function (node, url) {
            if (url != undefined && url.length > 0) {
                util.LoadHead(node,url);
            } else {
                node.removeAllChildren();
            }
        },
        invitePlayer: function () {
            var str = this.input_invite_uid.getString();
            if (str != "") {
                var applyId = parseInt(str);
                if (applyId == str) {
                    club.net.packInviteJoin(this.pid, applyId, function (data) {
                        if (data.code == 200) {
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("邀请成功");
                            dialog.showDialog();
                        } else {
                            this.showErr(data);
                        }
                    }.bind(this));
                } else {
                    var data = {error: "玩家id只能是数字哦"};
                    this.showErr(data);
                }

            } else {
                var data = {error: "请输入邀请玩家的id"};
                this.showErr(data);
            }

        },
        onClickAgreeApply: function (data) {
            var player = data;
            var DecideDialog = new JJMajhongDecideDialog();
            DecideDialog.setCallback(function () {
                club.net.packAuthApply(data.pid, data.uid, 1, function (data) {
                    if (data.code == 200) {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes("审核成功");
                        dialog.showDialog();
                        this.updateAdminInfo(player);
                    } else {
                        this.showErr(data);
                    }
                }.bind(this));
            }.bind(this));
            DecideDialog.setDes("确定同意玩家" + data.nickName + "的申请吗");
            DecideDialog.showDialog();
        },
        onClickRejectApply: function (data) {
            var DecideDialog = new JJMajhongDecideDialog();
            DecideDialog.setCallback(function () {
                club.net.packAuthApply(data.pid, data.uid, -1, function (data) {
                    if (data.code == 200) {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes("审核成功");
                        dialog.showDialog();
                        this.updateAdminInfo();
                    } else {
                        this.showErr(data);
                    }
                }.bind(this));
            }.bind(this));
            DecideDialog.setDes("确定拒绝玩家" + data.nickName + "的申请吗");
            DecideDialog.showDialog();
        },
        updateAdminInfo: function (data) {
            if (data) {
                this.addPlayer(data);
                this.uniqPlayers();
                this.showListPlayer();
            }
            this.updatePackByNum(this.packNum);
            this.getPackApplyList();
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
        onRecharge: function () {
            var layer = new clubRecharge(this.pid, function () {
                this.updatePackByNum(this.packNum);
            }.bind(this));
            layer.show();
        },
        onUpdateNotice: function () {
            var layer = new clubPackNotice(this.pid, this.pack_info.notice, club.type.admin, function () {
                this.updatePackByNum(this.packNum);
            }.bind(this));
            layer.show();
        },
        onDeleteAutoTable: function (data) {
            var DecideDialog = new JJMajhongDecideDialog();
            DecideDialog.setCallback(function () {
                club.net.delPackAutoTable(data.pid, data.id, function (data) {
                    if (data.code == 200) {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes("自动房间删除成功!");
                        dialog.showDialog();
                        this.getPackAutoList();
                    } else {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(data["error"]);
                        dialog.showDialog();
                    }
                }.bind(this));
            }.bind(this));
            DecideDialog.setDes("确定删除该自动房间吗");
            DecideDialog.showDialog();
        },
        onClickShenpi: function () {
            this.panel_right.setVisible(true);
            this.panel_right_auto.setVisible(false);
            this.panel_yaoqing.setVisible(false);
            this.btn_join_auto.setTouchEnabled(true);
            this.btn_join_auto.setBright(true);
            this.btn_yaoqing.setTouchEnabled(true);
            this.btn_yaoqing.setBright(true);
            this.btn_shenpi.setTouchEnabled(false);
            this.btn_shenpi.setBright(false);
            this.getPackApplyList();
        },
        onClickJoinAuto: function () {
            this.panel_right.setVisible(false);
            this.panel_right_auto.setVisible(true);
            this.panel_yaoqing.setVisible(false);
            this.btn_join_auto.setTouchEnabled(false);
            this.btn_join_auto.setBright(false);
            this.btn_yaoqing.setTouchEnabled(true);
            this.btn_yaoqing.setBright(true);
            this.btn_shenpi.setTouchEnabled(true);
            this.btn_shenpi.setBright(true);
            // this.getPackAutoList();
        },
        onClickInvite: function () {
            this.panel_right.setVisible(false);
            this.panel_right_auto.setVisible(false);
            this.panel_yaoqing.setVisible(true);
            this.btn_join_auto.setTouchEnabled(true);
            this.btn_join_auto.setBright(true);
            this.btn_yaoqing.setTouchEnabled(false);
            this.btn_yaoqing.setBright(false);
            this.btn_shenpi.setTouchEnabled(true);
            this.btn_shenpi.setBright(true);
            // this.getPackAutoList();
        },
        onCreateAutoRoom: function () {
            var panel = new clubCreateRoomView(1, this.pid, true, function () {
                this.getPackAutoList();
            }.bind(this));
            panel.showPanel();
            return;
            var layer = new clubSelectGameType(this.pid, true, function () {
                this.getPackAutoList();
            }.bind(this));
            layer.showPanel();
        },
        getPackAutoList: function () {
            club.net.getAutoTableSetting(this.pid, function (data) {
                if (data.code == 200) {
                    this.auto_list = data.data;
                    this.cleanPackAutoList();
                    this.showPackAutoList();
                }
            }.bind(this))
        },
        cleanPackAutoList: function () {
            var data = this.auto_list;
            var temp = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].bDisable == 0) {
                    temp.push(data[i]);
                }
            }
            this.auto_list = temp;
        },
        showPackAutoList: function () {
            var data = this.auto_list;
            this.shrinkAutoList(data.length);
            if (data.length == 0) {
                this.tip_no_auto.setVisible(true);
                return;
            } else {
                this.tip_no_auto.setVisible(false);
            }
            for (var i = 0; i < data.length; i++) {
                var cell = this.getAutoItem(i);
                var item = data[i];
                var text_name = ccui.helper.seekWidgetByName(cell, "text_room_name");
                var text_wanfa = ccui.helper.seekWidgetByName(cell, "text_room_wanfa");
                var btn_delete = ccui.helper.seekWidgetByName(cell, "btn_delete_auto");
                btn_delete.clickData = item;
                var config = JSON.parse(item.roomConfig);
                var wanfa = club.common.getWanfaDesc(config);
                text_name.setString(GAMENAMES[item.serverType]);
                text_wanfa.setString(wanfa);
                text_wanfa.setTextColor(cc.color(139, 99, 86));
                text_name.setTextColor(cc.color(90, 59, 68));
            }
        },
        getAutoItem: function (index) {
            if (this.listView_auto.childrenCount > index) {
                return this.listView_auto.children[index];
            }
            var cell = this.auto_cell.clone();
            this.listView_auto.pushBackCustomItem(cell);
            return cell;
        },
        shrinkAutoList: function (num) {
            var content = this.listView_auto;
            while (content.childrenCount > num) {
                var lastItem = content.children[content.childrenCount - 1];
                content.removeChild(lastItem, true);
            }
        },
        onNum: function () {
            var root = this['root'];
            if (root.textArray[root.textArray.length - 1].length > 0)
                return;
            var num = this['tag'];
            for (var i = 0; i < root.textArray.length; i++) {
                var text = root.textArray[i];
                if (text.getString().length <= 0) {
                    text.setString(num);
                    break;
                }
            }

        },
        onInvite: function () {
            var userId = '';
            for (var i = 0; i < this.textArray.length; i++) {
                var text = this.textArray[i];
                userId += text.getString();
                if (text.getString().length <= 0) {
                    var data = {error: "请正确输入邀请玩家的id"};
                    this.showErr(data);
                    return;
                }
            }
            this.onRest();
            var applyId = parseInt(userId);
            if (applyId == userId) {
                club.net.packInviteJoin(this.pid, applyId, function (data) {
                    if (data.code == 200) {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes("邀请成功");
                        dialog.showDialog();
                    } else {
                        this.showErr(data);
                    }
                }.bind(this));
            } else {
                var data = {error: "玩家id只能是数字哦"};
                this.showErr(data);
            }
        },
        onRest: function () {
            for (var i = 0; i < this.textArray.length; i++) {
                var text = this.textArray[i];
                text.setString('');

            }
        },
        onDel: function () {
            for (var i = this.textArray.length; i > 0; i--) {
                var text = this.textArray[i - 1];
                if (text.getString().length > 0) {
                    text.setString('');
                    break;
                }
            }
        },
        onReturnPack: function () {
            var data = this.pack_info;
            util.setCacheItem("default_pack", data.pid);
            club.default_pack = data.pid;
            club.joinPack(data);
            // this.removeFromParent();
        },
    }
);

var ClubAdminInfoDialog = JJDialog.extend({
    sprite_head: null,
    playerData: null,
    pack_info: null,
    callback: null,
    ctor: function (data, pack_info, cb) {
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

        this.callback = cb;
        this.pack_info = pack_info;
        this.sprite_head = ccui.helper.seekWidgetByName(panel_root, "sprite_head");
        util.ChangeloadHead(panel_root,typeof(data['equip']) == 'string' ? JSON.parse(data['equip']) : data['equip']);
        var image_sex_icon = ccui.helper.seekWidgetByName(panel_root, "image_sex_icon");
        image_sex_icon.setVisible(false);
        var text_name = ccui.helper.seekWidgetByName(panel_root, "text_name");
        var text_id = ccui.helper.seekWidgetByName(panel_root, "text_id");
        var text_note = ccui.helper.seekWidgetByName(panel_root, "text_note");
        var input_note = ccui.helper.seekWidgetByName(panel_root, "input_note");
        // var text_ip = ccui.helper.seekWidgetByName(panel_root,"text_ip");
        var btn_back = ccui.helper.seekWidgetByName(panel_root, "btn_back");
        btn_back.addClickEventListener(function () {
            club.quitPack(this.pack_info);
            this.dismissDialog();
        }.bind(this));
        // var btn_change = ccui.helper.seekWidgetByName(panel_root, "btn_change");
        // btn_change.addClickEventListener(function () {
        //     JJLog.print("this.pack_info", this.pack_info, input_note.getString());
        //     club.updateMemberNote(this.pack_info.pid, input_note.getString());
        //     this.dismissDialog();
        // }.bind(this));
        var btn_kick = ccui.helper.seekWidgetByName(panel_root, "btn_kick");
        btn_kick.addClickEventListener(function () {
            this.kickPlayer();
            this.dismissDialog();
        }.bind(this));

        var btn_close = ccui.helper.seekWidgetByName(panel_root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));
        btn_close.addTouchEventListener(util.btnTouchEvent);
        var id = data['uid'];
        text_name.setString(data["nickName"]);
        text_id.setString('ID: ' + data['uid']);
        // btn_change.setVisible(false);
        btn_back.setVisible(false);
        // text_note.setVisible(false);
        // input_note.setVisible(false);
        btn_kick.setVisible(true);
        if (id == hall.user.uid) {
            btn_kick.setVisible(false);
        }
        // text_note.setVisible(true);
        // text_note.setString(data.notice || "该玩家暂未填写个人信息哦!");
        this.loadHead();
    },


    kickPlayer: function () {
        var cb = this.callback;
        var playerData = this.playerData;
        var DecideDialog = new JJMajhongDecideDialog();
        DecideDialog.setCallback(function () {
            club.net.delPackPlayer(this.pack_info.pid, playerData.uid, function (data) {
                if (data.code == 200) {
                    cb(playerData);
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("玩家" + this.playerData.nickName + "已被踢出亲友圈!");
                    dialog.showDialog();
                } else {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data.error);
                    dialog.showDialog();
                }
            }.bind(this));
        }.bind(this));
        DecideDialog.setDes("确定踢出玩家" + playerData.nickName + "吗");
        DecideDialog.showDialog();

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