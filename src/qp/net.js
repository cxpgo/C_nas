qp.net = {
    state: 'gate',
    connectFirst: true,
    servers: servers,
    ossWeb: 'http://www.yiqigame.me:30120',
    connections: [],
    disconnected: false,

    listenRequest: function (type, cmd, cb) {
        var conn = {
            type: type,
            cmd: cmd,
            cb: cb,
            responded: false,
        };

        cc.setTimeout(function () {
            //JJLog.print(cmd + ' listen timeout');

            // var found = false;
            // for (var i = 0; i < qp.net.connections.length; i++) {
            //     if (qp.net.connections[i] == this) {
            //         qp.net.connections.splice(i, 1);
            //         found = true;
            //         break;
            //     }
            // }
            // // qp.net.delRequest(this);

            // if (!found) {
            //     JJLog.print(this.cmd + ' not in connections');
            //     return;
            // }


            if (!this.responded) {
                this.responded = true;
                JJLog.print(cmd + ' timeout');
                //清理connections  取消所有监听定时事件 重新还原
                if (this.type == 'socket')
                    this.cb({ code: 500, error: '网络超时' });
                else {
                    this.cb(JSON.stringify({ code: 500, error: '网络超时' }));
                    // qp.event.send('disconnect');
                }

                if (this.type == 'socket' && !qp.net.disconnected) {
                    qp.net.disconnected = true;
                    qp.net.connections = [];
                    JJLog.print(cmd + ' timeout and trigger disconnect');
                    var pomelo = window.pomelo;
                    pomelo.disconnect();
                }
            }
        }.bind(conn), hall.inRoom ? 5000 : 8000);

        qp.net.connections.push(conn);
    },

    recvRequest: function (cb) {
        if (this.type == 'socket')
            qp.net.disconnected = false;
        for (var i = 0; i < qp.net.connections.length; i++) {
            if (qp.net.connections[i].cb == cb) {
                if (!qp.net.connections[i].responded) {
                    qp.net.connections[i].responded = true;
                    // delete qp.net.connections[i];
                    qp.net.connections.splice(i, 1);

                    return true;
                } else {
                    return false;
                }
            }
        }

        return true;
    },

    request: function (cmd, params, cb) {
        if (cmd == hall.net.cmds.hall_register ||
            cmd == hall.net.cmds.hall_login ||
            cmd == hall.net.cmds.hall_wxUser ||
            cmd == hall.net.cmds.hall_getHuiFangInfo ||
            cmd == hall.net.cmds.hall_getHuiFangList ||
            cmd == hall.net.cmds.hall_addShareAward ||
            cmd == hall.net.cmds.reCreateTables ||
            cmd == hall.net.cmds.hall_getOrder ||
            cmd == hall.net.cmds.hall_orderStatus ||
            cmd == hall.net.cmds.getWeChatId ||
            cmd == hall.net.cmds.yyl_bet ||
            cmd == hall.net.cmds.yyl_reward ||
            cmd == hall.net.cmds.yyl_getRewardInfo ||
            cmd == hall.net.cmds.yyl_getLianZhongInfo ||
            cmd == club.net.cmds.getPacks ||
            cmd == club.net.cmds.getPlayerPack ||
            cmd == club.net.cmds.getPackMembers ||
            cmd == club.net.cmds.getPackTablesList ||
            cmd == club.net.cmds.packApplyJoin ||
            cmd == club.net.cmds.packApplyList ||
            cmd == club.net.cmds.playerApplyList ||
            cmd == club.net.cmds.playerCancelApply ||
            cmd == club.net.cmds.memberCreateTable ||
            cmd == club.net.cmds.quitPack ||
            cmd == club.net.cmds.quickJoin ||
            cmd == club.net.cmds.updateMemberNote ||
            cmd == club.net.cmds.createPack ||
            cmd == club.net.cmds.packAuthApply ||
            cmd == club.net.cmds.delPackPlayer ||
            cmd == club.net.cmds.getPackByNum ||
            cmd == club.net.cmds.packInviteJoin ||
            cmd == club.net.cmds.packGameHistory ||
            cmd == club.net.cmds.addPackFangka ||
            cmd == club.net.cmds.updatePackNotice ||
            cmd == club.net.cmds.getAutoTableSetting ||
            cmd == club.net.cmds.createAutoTable ||
            cmd == club.net.cmds.delPackAutoTable ||
            cmd == club.net.cmds.setOwnerCreateOnly ||
            cmd == hall.net.cmds.turn_gacha ||
            cmd == hall.net.cmds.turn_next_gachaInfo||
            cmd == hall.net.cmds.nas_buy
            ) {

            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("POST", qp.net.servers.web + cmd, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (!qp.net.recvRequest(cb))
                        return;
                    if (xhr.status >= 200 && xhr.status <= 207) {
                        var response = xhr.responseText;
                        var data = JSON.parse(response);
                        if (data.httpToken) {
                            params.httpToken = data.httpToken;
                            qp.net.request(cmd, params, cb);
                            return;
                        } else {
                            DecodeYQGRes(data);
                            response = JSON.stringify(data);
                            cb(response);
                        }
                    } else {
                        cb(JSON.stringify({ code: 400, error: 'error' }));
                    }
                }
            };
            EncodeYQGReq(params);
            var keys = [];
            for (var o in params) {
                keys.push(o + '=' + encodeURIComponent(params[o]));
            }
            xhr.send(keys.join('&'));

            qp.net.listenRequest('http', cmd, cb);

        }
        else if (cmd == hall.net.cmds.hall_checkBind ||
            cmd == hall.net.cmds.hall_bindCode ||
            cmd == hall.net.cmds.hall_shopConfig ||
            cmd == hall.net.cmds.hall_getInfo ||
            cmd == hall.net.cmds.hall_advclient ||
            cmd == hall.net.cmds.hall_getGameInfo ||
            cmd == hall.net.cmds.hall_getGoldRanking ||
            cmd == hall.net.cmds.hall_purchase ||
            cmd == hall.net.cmds.hall_good_list ||
            cmd == hall.net.cmds.hall_add_order ||
            cmd == hall.net.cmds.hall_orderList) {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("POST", qp.net.ossWeb + cmd, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (!qp.net.recvRequest(cb))
                        return;

                    if (xhr.status >= 200 && xhr.status <= 207) {
                        var response = xhr.responseText;
                        var data = JSON.parse(response);
                        if (data.httpToken) {
                            params.httpToken = data.httpToken;
                            qp.net.request(cmd, params, cb);
                            return;
                        } else {
                            DecodeYQGRes(data);
                            response = JSON.stringify(data);
                            cb(response);
                        }

                    } else {
                        cb(JSON.stringify({ code: 400, error: 'error' }));
                    }
                }
            };
            EncodeYQGReq(params);
            var keys = [];
            for (var o in params) {
                keys.push(o + '=' + encodeURIComponent(params[o]));
            }
            xhr.send(keys.join('&'));
            qp.net.listenRequest('http', cmd, cb);
        }
        else {
            var pomelo = window.pomelo;
            if (qp.net.state == 'gate') {
                JJLog.print("gate cmd??:" + cmd);
                if (cmd == hall.net.cmds.hall_enter) {
                    // var portId = parseInt(Math.random() * 10);

                    pomelo.init({
                        host: qp.net.servers.connector,
                        port: qp.net.servers.ports[parseInt(params.uid) % qp.net.servers.ports.length],
                        log: true
                    }, function () {
                        qp.net.connectFirst = false;
                        JJLog.print(cmd);
                        //params['gameServerType'] = 'quanzhou';
                        pomelo.request(cmd, params, function (data) {
                            if (!qp.net.recvRequest(cb))
                                return;

                            qp.net.state = 'connector';
                            DecodeYQGRes(data);
                            JJLog.print(JSON.stringify(data));
                            cb(data);
                        });
                        qp.net.listenRequest('socket', cmd, cb);
                    });
                } else {
                    pomelo.request(cmd, params, function (data) {
                        if (!qp.net.recvRequest(cb))
                            return;
                        DecodeYQGRes(data);
                        JJLog.print(JSON.stringify(data));
                        cb(data);
                    });
                    qp.net.listenRequest('socket', cmd, cb);
                }

            } else if (qp.net.state == 'connector') {
                //params['gameServerType'] = 'quanzhou';
                pomelo.request(cmd, params, function (data) {
                    if (cmd != hall.net.cmds.hall_heartBeat && !qp.net.recvRequest(cb))
                        return;

                    DecodeYQGRes(data);
                    cb(data);
                });
                if (cmd != hall.net.cmds.hall_heartBeat) {
                    qp.net.listenRequest('socket', cmd, cb);
                }
            }
        }
    }
}

