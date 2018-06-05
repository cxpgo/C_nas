var PackEvent = {
    //通知玩家登陆
    packNotifyPlayerEnter: "packNotifyPlayerEnter",
    //通知玩家离线
    packNotifyPlayerLeave: "packNotifyPlayerLeave",
    //通知在线玩家列表
    packNotifyOnlineList: "packNotifyOnlineList",
    //通知玩家状态变化
    packNotifyPlayerState: "packNotifyPlayerState",
    //通知房间状态变化
    packNotifyTableState: "packNotifyTableState",
    //通知房间增加
    packNotifyTableAdd: "packNotifyTableAdd",
    //通知房间关闭
    packNotifyTableClose: "packNotifyTableClose",
    //通知玩家加入
    packNotifyJoin:           "packNotifyJoin",
    //通知玩家申请被拒绝
    packNotifyRejectJoin:     "packNotifyRejectJoin",
};
var club = {
    default_pack: null,
    layer: null,
    onlineList: {},
    state_player: {},
    state_room: {},
    state_notice:{},
    notice:{},
    maxPerson: 120,
    isInit: false,
    isPackRoom:null,
    gamePackId:null,
    gameRoomId:null,
    net: null,
    common:null,

    _inviteInstance:null,

    enter: function () {
        this.default_pack = util.getCacheItem("default_pack");
        this.resetGameData();
        if (this.default_pack > 0) {
            this.getPlayerPack()
        } else {
            var layer = new clubMainLayer(club.type.common);
            layer.enter();
        }
    },
    gameBackClub: function () {
        JJLog.print("检查是否从亲友圈游戏返回大厅", this.gamePackId);
        var data = this.gamePackId;
        if (data > 0) {
            MajhongLoading.show();
            util.setCacheItem("default_pack", data);
            this.default_pack = data;
            this.resetGameData();
            this.getPlayerPack();
            MajhongLoading.dismiss();
        }
    },
    resetGameData: function () {
        this.isPackRoom = false;
        this.gamePackId = null;
        this.gameRoomId = null;
        this.layer = null;
    },
    getPlayerPack: function () {
        club.net.getPlayerPack(function (data) {
            if (data.data) {
                data = data.data;
                this.findPack(data);
            } else {
            }
        }.bind(this))
    },
    findPack: function (data) {
        for (var i = 0; i < data.length; i++) {
            if (parseInt(this.default_pack) == parseInt(data[i].pid)) {
                this.joinPack(data[i]);
                return;
            }
        }
        var layer = new clubMainLayer(club.type.common);
        layer.enter();
    },
    joinPack: function (data) {
        if (this.layer) {
            JJLog.print("remove old pack layer");
            cc.director.getRunningScene().removeChild(this.layer);
        }
        this.layer = new clubLayer(data);
        this.layer.enter();
    },
    joinAdminPack: function (data) {
        if (this.layer) {
            JJLog.print("remove old pack layer");
            cc.director.getRunningScene().removeChild(this.layer);
        }
        this.layer = new clubAdminLayer(data);
        this.layer.enter();
    },
    exitPack: function () {
        util.setCacheItem("default_pack", 0);
        if (this.layer) {
            cc.director.getRunningScene().removeChild(this.layer);
        }
    },
    quitPack: function (packInfo) {
        var DecideDialog = new JJMajhongDecideDialog();
        DecideDialog.setCallback(function () {
            club.net.quitPack(packInfo.pid, function (data) {
                if (data.code == 200) {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("退出成功");
                    dialog.showDialog();
                    this.exitPack();
                } else {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data.error);
                    dialog.showDialog();
                }
            }.bind(this));
        }.bind(this));
        DecideDialog.setDes("确定要退出亲友圈" + packInfo.name + "吗");
        DecideDialog.showDialog();
    },
    initOnlineList: function (data) {
        // this.onlineList = {};
        // this.state_player = {};
        // this.state_room = {};

        // if (this.isInit) {
        // }
        // this.isInit = true;
        for (var key in data) {
            var users = {};
            var temp = data[key];
            _.forEach(temp, function (item) {
                users[item.uid] = item;
            });
            this.onlineList[key] = users;
            this.state_player[key] = true;
            this.state_room[key] = true;
            this.state_notice[key] = false;
        }
    },
    playerEnter: function (data) {
        if (this.onlineList == null || this.onlineList == "") return;
        var user = data.user;
        var pid = data.pid;
        var temp = this.onlineList[pid];
        if (!temp) return;
        if (temp[user.uid]) {
            temp[user.uid].online = user.online;
        } else {
            temp[user.uid] = user;
        }
        this.state_player[pid] = true;
    },
    playerLeave: function (data) {
        var user = data.user;
        var pid = data.pid;
        var temp = this.onlineList[pid];
        if (!temp) return;
        if (temp[user.uid]) {
            temp[user.uid].online = user.online;
        } else {
            temp[user.uid] = user;
        }
        this.state_player[pid] = true;
    },
    playerState: function (data) {
        var pid = data.pid;
        var online = data.online;
        var uids = data.uids;
        var temp = this.onlineList[pid];
        if (!temp) return;
        for (var i = 0; i < uids.length; i++) {
            if (temp && temp[uids[i]]) {
                temp[uids[i]].online = online;
            }
        }
        this.state_player[pid] = true;
    },
    packNotifyJoin: function (data) {
        JJLog.print("packNotifyJoin =>", data);
        var dialog = new JJConfirmDialog();
        // dialog.setDes("你对" + data.name + "的申请已被通过, 快进去体验亲友圈功能吧!");
        dialog.setDes("你已经加入亲友圈" + data.name + ", 快进去体验亲友圈功能吧!");
        dialog.showDialog();
    },
    packNotifyRejectJoin: function (data) {
        JJLog.print("packNotifyRejectJoin=>", data);
        var dialog = new JJConfirmDialog();
        dialog.setDes("你对" + data.name + "的申请被管理员拒绝!");
        dialog.showDialog();
    },
    updateMemberNote: function (pid, note) {
        club.net.updateMemberNote(pid, note, function (data) {
            if (data.code == 200) {
                club.state_player[pid] = true;
                club.state_notice[pid] = true;
                club.notice[pid] = note;
                var dialog = new JJConfirmDialog();
                dialog.setDes("设置个人信息成功!");
                dialog.showDialog();
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data.error);
                dialog.showDialog();
            }
        })
    },
    initClub: function () {
        if (this.net) {
            this.net.init();
            this.net.registerListener();
        }
    },
    // showInvite: function (pid, roomId) {
    //     if (this.isPackRoom) {
    //         var DecideDialog = new JJMajhongDecideDialog();
    //         DecideDialog.setCallback(function () {
    //             club.net.packApplyJoinGame(pid, roomId, function (data) {
    //                 JJLog.print(data);
    //             })
    //         }.bind(this));
    //         DecideDialog.setDes("确定要邀请群成员加入房间吗?");
    //         DecideDialog.showDialog();
    //     }
    // },
    getClubInviteInstance: function (data) {
        if (this._inviteInstance != null) {
            this._inviteInstance.setRoomInfo(data);
        } else {
            this._inviteInstance = new ClubInviteRoomInfo(data);
            this._inviteInstance.show();
        }
    },
    cleanClubInviteInstance: function () {
        this._inviteInstance = null;
    }


};

club.colors = {
    pack_id: cc.color(72, 93, 101),
    user_name: cc.color(72, 93, 101),
    pack_name: cc.color(16, 78, 120),
    online: cc.color(25, 147, 22),
    game: cc.color(255, 12, 12),
    offline: cc.color(145, 149, 149),
    history_self: cc.color(234,66,0),
    history_red: cc.color(255,0,0),
    history_green: cc.color(29,153,0),
};

club.type = {
    common: 1,
    admin: 2
}

hall.registerClub(club);

