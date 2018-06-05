var GameNet = function() {
    var cmds = {
        init            : 'initSeat',           //  初始化坐姿信息
        ready           : 'readyGame',          //  游戏准备
        updateDelCards  : 'updateDelCards',     //  打牌协议
        leavePrivate    : 'leavePrivateTable',
        createPrivate   : 'createPrivateTable', //  创建桌子
        joinPrivate     : 'joinPrivateTable',   //  加入
        updatePlayerOp  : 'updatePlayerOp',     //  同步操作
        dissolve        : 'dissolutionTable',   //  解散
        start           : 'lessPersonStart',    //  开始
        GMOp            : 'gmOp',               //  GM 发牌
        chat            : 'chatGame',           //  游戏中聊天
        addRobot        : 'addRobot',           //  机器人
        throw           : 'throwObject',        //  游戏用使用道具
        GMCommand       : 'gmQiPai',            //  下一轮取牌
        mingPaiSelect       : 'mingPaiSelect',            //
        mjTingChange       : 'mjTingChange',            //
    };

    var net = cc.Class.extend({
        imRoomId: -1,
        GameName: "",
        GameHandler:"",
        GameValue: "",
        ctor: function (context) {
            context.net = this;
            this.GameName = context.GameName;
            this.GameHandler = context.GameHandler;
            this.GaemValue = context.GameValue;
        },

        _GameNetRequest : function (baseCMD , data , cb) {

            var sCMD = this.GameName + "." + this.GameHandler + "." + baseCMD;
            
            //所有的协议操作带入uid
            data.uid = hall.user.uid;
            
            qp.net.request(
                sCMD, 
                data,
                function(resp) {
                    if(cb)  cb(resp);
                }
            );
        },
        // 玩家准备
        ready: function(status, cb) {
            this._GameNetRequest(
                cmds.ready, 
                {
                    'status': status
                },
                function(resp) {
                    if (cb) cb(resp);
                }
            );
        },
        createPrivateTable: function(data, cb) {
            //清理IM ID  因为玩家不一定发送离开房间也有可能回到大厅
            this.imRoomId = -1;
            qp.event.listen(this, 'imCreateRoom', this.imCreateRoom.bind(this));
            this._GameNetRequest(
                cmds.createPrivate,
                data,
                function(resp) {
                    cb(resp);
                }
            );
        },
        imCreateRoom: function(data) {
            //去重
            if (this.imRoomId == data.imRoomId || data.imRoomId <= 0) {
                return;
            }
            this.imRoomId = data.imRoomId;
            JJLog.print("IMRoomID:" + this.imRoomId);
            if (cc.sys.isNative) {
                GameLink.onUserJoinRoom(hall.AppNameID + this.GAMENAME + this.imRoomId);
            }
        },

        // 玩家已经进入桌子
        init: function(cb) {
            var self = this;
            this._GameNetRequest(
                cmds.init, 
                {
                    
                },
                function(resp) {
                    if (resp.code == 200) {
                        if (self.imRoomId == -1 &&
                            resp.tableStatus.tableId != undefined &&
                            resp.tableStatus.tableId != -1) {

                            self.imCreateRoom({
                                'imRoomId': resp.tableStatus.tableId
                            });
                        }
                    }
                    cb(resp);
                }
            );
        },

        lessPersonStart: function(cb) {
            this._GameNetRequest(
                cmds.start, 
                {
                    'lessStart': 1 //1同意 0拒绝
                },
                function(resp) {
                    cb(resp);
                }
            );
        },

        /**
         * 玩家出牌
         */
        updatePlayerDelCard: function(data, cb) {
            this._GameNetRequest(
                cmds.updateDelCards,
                data,
                function(resp) {
                    cb(resp);
                }
            );
        },

        joinPrivateTable: function(tableId, cb) {
            this._GameNetRequest(
                cmds.joinPrivate, 
                {
                    'tableId': tableId,
                    'tablePassword': "",
                    'inviteUid': hall.wxInvite.inviteUid
                },
                function(resp) {
                    cb(resp);
                }
            );
        },

        //退出房间
        leavePrivateTable: function(status, cb) {
            this._GameNetRequest(
                cmds.leavePrivate, 
                {
                    'isGameover': status,
                },
                function(resp) {
                    if (resp.code == 200) {
                        this.imRoomId = -1;
                        if (cc.sys.isNative) {
                            GameLink.onUserLeaveRoom();
                        }
                    }
                    if (cb) cb(resp);
                }
            );
        },

        dissolveSeat: function(status, cb) {
            this._GameNetRequest(
                cmds.dissolve, 
                {
                    'status': status
                }, //1代表申请者申请者肯定同意的  2代表同意 3代表拒绝)
                function(resp) {
                    cb(resp);
                }
            );
        },

        updatePlayerOp: function(data, cb) {
            this._GameNetRequest(
                cmds.updatePlayerOp, 
                data,
                function(resp) {
                    if (cb) cb(resp);
                }
            );
        },

        // GM发牌
        GMOp: function(uid, op, cb) {
            this._GameNetRequest(
                cmds.GMOp,
                {
                    'uid': uid,
                    'op': op
                },
                function(resp) {
                    cb(resp);
                });
        },

        gmCommand : function (card) {
            this._GameNetRequest(
                cmds.GMCommand,
                { 
                    'pai': card 
                },
                function (resp) {
                }
            );
        },

        throw: function (objId, cb) {
            this._GameNetRequest(
                cmds.throw,
                {
                    'uid' : hall.user.uid, 
                    'targetUid' : objId.uid, 
                    'throwType' : objId.type
                },
                function (resp) {
                    if (cb) cb(resp);
                }
            );
        },

        // 发表情或者文字
        chat: function(table, cb) {
            this._GameNetRequest(
                cmds.chat, 
                {
                    'uid': hall.user.uid,
                    'data': table
                },
                function(resp) {
                    cb(resp);
                }
            );
        },

        addRobot : function (add, cb) {
            this._GameNetRequest(
                cmds.addRobot,
                {
                    'uid': hall.user.uid,
                    'status': add
                },//1 add 0 reduce
                function (resp) {
                    cb(resp);
                }
            );
        },

        mingPaiSelect : function (showInfo, cb) {
            this._GameNetRequest(
                cmds.mingPaiSelect,
                {
                    'uid': hall.user.uid,
                    'showInfo': showInfo
                },
                function (resp) {
                    cb(resp);
                }
            );
        },
    });
    return net;
}();