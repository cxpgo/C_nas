club.net = {};
club.net.cmds = {
    // 亲友圈api
    "createPack": "/qp_packCreate",
    "getPacks": "/qp_getPacks",
    "getPlayerPack": "/qp_getPlayerPack",
    "getPackMembers": "/qp_getPackMembers",
    "updatePackInfo": "/qp_updatePackInfo",
    "getPackTablesList": "/qp_getPackTablesList",
    "packApplyJoin": "/qp_packApplyJoin",
    "quitPack": "/qp_quitPack",
    "delPackPlayer": "/qp_delPackPlayer",
    "packApplyList": "/qp_packApplyList",
    "playerApplyList": "/qp_plyerApplyList",
    "playerCancelApply": "/qp_playerCancelApply",
    "memberCreateTable": "/qp_memberCreateTable",
    "quickJoin": "/qp_quickJoin",
    "updateMemberNote": "/qp_updateMemberNote",
    "packAuthApply": "/qp_packAuthApply",
    "getPackByNum": "/qp_getPackByNum",
    "packInviteJoin": "/qp_packInviteJoin",
    "packGameHistory": "/qp_packGameHistory",
    "addPackFangka": "/qp_addPackFangka",
    "updatePackNotice": "/qp_updatePackNotice",
    "packApplyJoinGame": "hall.packHandler.packApplyJoinGame",
    "getAutoTableSetting": "/qp_getAutoTableSetting",
    "createAutoTable": "/qp_createAutoTable",
    "delPackAutoTable": "/qp_delPackAutoTable",
};

club.net.events = {
    'packNotifyPlayerEnter': function (data) {
        qp.event.send('packNotifyPlayerEnter', data);
        JJLog.print(data);
    },
    'packNotifyPlayerLeave': function (data) {
        qp.event.send('packNotifyPlayerLeave', data);
        JJLog.print(data);
    },
    'packNotifyOnlineList': function (data) {
        qp.event.send('packNotifyOnlineList', data);
        JJLog.print(data);
    },
    'packNotifyPlayerState': function (data) {
        qp.event.send('packNotifyPlayerState', data);
        JJLog.print(data);
    },
    'packNotifyTableState': function (data) {
        qp.event.send('packNotifyTableState', data);
        JJLog.print(data);
    },
    'packNotifyTableAdd': function (data) {
        qp.event.send('packNotifyTableAdd', data);
        JJLog.print(data);
    },
    'packNotifyTableClose': function (data) {
        qp.event.send('packNotifyTableClose', data);
        JJLog.print(data);
    },
    'packNotifyJoin': function (data) {
        qp.event.send('packNotifyJoin', data);
        JJLog.print(data);
    },
    "packNotifyRejectJoin": function (data) {
        qp.event.send('packNotifyRejectJoin', data);
        JJLog.print(data);
    },
    "packNotifyJoinGame": function (data) {
        qp.event.send('packNotifyJoinGame', data);
        JJLog.print(data);
    }
};

//亲友圈api
club.net.init = function () {
    qp.event.bind(club.net.events);
};

club.net.registerListener = function () {
    JJLog.print("club registerListener !!!!!!!");
    qp.event.listen(club, 'packNotifyPlayerEnter', function (data) {
        club.playerEnter(data);
    });
    qp.event.listen(club, 'packNotifyPlayerLeave', function (data) {
        club.playerLeave(data);
    });
    qp.event.listen(club, 'packNotifyOnlineList', function (data) {
        club.initOnlineList(data);
    });
    qp.event.listen(club, 'packNotifyPlayerState', function (data) {
        club.playerState(data);
    });
    qp.event.listen(club, 'packNotifyJoin', function (data) {
        club.packNotifyJoin(data);
    });
    qp.event.listen(club, 'packNotifyRejectJoin', function (data) {
        club.packNotifyRejectJoin(data);
    });
};

club.net.getPacks = function (cb) {
    qp.net.request(club.net.cmds.getPacks,
        {
            uid: hall.user.uid,
            target: "owner"
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.createPack = function (name,cb) {
    qp.net.request(club.net.cmds.createPack,
        {
            uid: hall.user.uid,
            name:name,
            picUrl:hall.user.headUrl,
            ownerUid:hall.user.uid,
            ownerName:hall.user.nickName
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.getPlayerPack = function (cb) {
    qp.net.request(club.net.cmds.getPlayerPack,
        {
            uid: hall.user.uid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.getPackMembers = function (pid, pageIndex, pageSize, cb) {
    qp.net.request(club.net.cmds.getPackMembers,
        {
            uid: hall.user.uid,
            pid: pid,
            pageIndex: pageIndex,
            pageSize: pageSize
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.getPackTablesList = function (pid, cb) {
    qp.net.request(club.net.cmds.getPackTablesList,
        {
            uid: hall.user.uid,
            pid: pid,
            all: 1,
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.packApplyJoin = function (packNum, cb) {
    qp.net.request(club.net.cmds.packApplyJoin,
        {
            uid: hall.user.uid,
            packNum: packNum,
            playerUid: hall.user.uid,
            playerName: hall.user.nickName,
            phone: hall.user.phoneNumber
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.packApplyList = function (pid, cb) {
    qp.net.request(club.net.cmds.packApplyList,
        {
            uid: hall.user.uid,
            pid: pid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.playerApplyList = function (cb) {
    qp.net.request(club.net.cmds.playerApplyList,
        {
            uid: hall.user.uid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.playerCancelApply = function (pid, cb) {
    qp.net.request(club.net.cmds.playerCancelApply,
        {
            uid: hall.user.uid,
            pid: pid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.memberCreateTable = function (pid, roomName, roomConfig, serverType, cb) {

    qp.net.request(club.net.cmds.memberCreateTable,
        {
            uid: hall.user.uid,
            pid: pid,
            roomName: roomName,
            roomConfig: roomConfig,
            bDisable: 0,
            serverType: serverType
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.quitPack = function (pid, cb) {
    qp.net.request(club.net.cmds.quitPack,
        {
            uid: hall.user.uid,
            pid: pid,
            delUid: hall.user.uid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.quickJoinRoom = function (pid, cb) {
    qp.net.request(club.net.cmds.quickJoin,
        {
            'uid': hall.user.uid,
            'pid': pid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.updateMemberNote = function (pid, note, cb) {
    qp.net.request(club.net.cmds.updateMemberNote,
        {
            'uid': hall.user.uid,
            'pid': pid,
            "note":note
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.packAuthApply = function (pid, applyUid, audit, cb) {
    qp.net.request(club.net.cmds.packAuthApply,
        {
            'uid': hall.user.uid,
            'pid': pid,
            'applyUid':applyUid,
            'audit':audit,
            'auditUid': hall.user.uid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.delPackPlayer = function (pid, delUid, cb) {
    qp.net.request(club.net.cmds.delPackPlayer,
        {
            'uid': hall.user.uid,
            'pid': pid,
            'delUid': delUid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.getPackByNum = function (packNum, cb) {
    qp.net.request(club.net.cmds.getPackByNum,
        {
            'uid': hall.user.uid,
            'packNum': packNum
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.packInviteJoin = function (pid, applyUid, cb) {
    qp.net.request(club.net.cmds.packInviteJoin,
        {
            'uid': hall.user.uid,
            'pid': pid,
            'applyUid': applyUid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.packGameHistory = function (pid, pageIndex,pageSize, cb) {
    qp.net.request(club.net.cmds.packGameHistory,
        {
            'uid': hall.user.uid,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            "pid":pid,
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.addPackFangka = function (pid, fangKa, cb) {
    qp.net.request(club.net.cmds.addPackFangka,
        {
            'uid': hall.user.uid,
            'pid': pid,
            'fangKa': fangKa,
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.updatePackNotice = function (pid, notice, cb) {
    qp.net.request(club.net.cmds.updatePackNotice,
        {
            'uid': hall.user.uid,
            'pid': pid,
            'notice': notice,
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.packApplyJoinGame = function (pid,tableId, cb) {
    qp.net.request(club.net.cmds.packApplyJoinGame,
        {
            uid: hall.user.uid,
            pid: pid,
            tableId:tableId
        },
        function (resp) {
            cb(resp);
        });
};

club.net.getAutoTableSetting = function (pid, cb) {
    qp.net.request(club.net.cmds.getAutoTableSetting,
        {
            uid: hall.user.uid,
            pid: pid,
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.createAutoTable = function (pid,roomName, roomConfig, serverType,  cb) {
    qp.net.request(club.net.cmds.createAutoTable,
        {
            uid: hall.user.uid,
            pid: pid,
            bDisable:0,
            roomName:roomName,
            roomConfig:roomConfig,
            serverType:serverType
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

club.net.delPackAutoTable = function (pid, autoId, cb) {
    qp.net.request(club.net.cmds.delPackAutoTable,
        {
            uid: hall.user.uid,
            pid: pid,
            autoId:autoId
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};