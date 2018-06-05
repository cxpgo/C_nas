// 网络通信

hall.net.cmds = {
    'hall_register': '/qp_register',
    'hall_login': '/qp_login',
    'hall_wxUser': '/wx_user',
    'hall_getHuiFangInfo': '/qp_getHuiFangInfo',
    'hall_getHuiFangList': '/qp_getHuiFangList',
    'hall_verCheck': 'gate.gateHandler.queryEntry',
    'hall_enter': 'connector.entryHandler.entryConnector',
    'hall_getShopInfo': 'hall.shopHandler.getShopInfo',
    'hall_buyShopItem': 'hall.shopHandler.buyShopItem',
    'hall_updateUserInfo': 'hall.playerHandler.updatePlayerInfo',
    'hall_BagMsg': 'hall.safeBoxHandler.hallBagMsg',
    'hall_dailyLogin': 'hall.activeHandler.useEveryLogin',
    'hall_getMailInfo': 'hall.mailHandler.getMailInfo',
    'hall_createSafeBox': 'hall.safeBoxHandler.createSafeBox',
    'hall_openSafeBox': 'hall.safeBoxHandler.openSafeBox',
    'hall_operateSafeBox': 'hall.safeBoxHandler.operationSafeBox',
    'hall_updateSafeBox': 'hall.safeBoxHandler.UpdateSafeBox',
    'hall_broadcast': 'hall.msgHandler.talk2broadcast',
    'hall_getGameConfig': 'hall.msgHandler.getGameConfig',
    'hall_getRankInfo': 'hall.rankHandler.getRankInfo',
    'hall_feedbackInfo': 'hall.playerHandler.feedbackInfo',
    'hall_getFeedbackInfo': 'hall.playerHandler.getFeedbackInfo',
    'hall_getPodiumInfo': 'hall.podiumHandler.getPodiumInfo',
    'hall_getShopListInfo': 'hall.shopHandler.getShopInfo',
    'hall_pickPodiumInvite': 'hall.podiumHandler.pickPodiumInvite',
    'hall_findPassword': 'hall.playerHandler.getPassword',
    'hall_getTableServerType': 'hall.msgHandler.getTableServerType',    //获得房间号对应的游戏type
    'hall_heartBeat': 'connector.entryHandler.heartBeat',
    'hall_addShareAward': '/gmFangKaActive',
    'reCreateTables': '/qp_reCreateTables',   //获取代开房间的列表
    'hall_getOrder': '/api/createOrder',                        //获取订单信息.
    'hall_orderStatus': '/api/completeOrder',                      //充值成功发给服务器加钻石
    'hall_checkBind': '/user/checkBind',                       //查询时候绑定邀请码
    // 'hall_bindCode': '/user/bind',                             //绑定邀请码
    'hall_bindCode': '/bind/bind',                             //绑定邀请码
    'hall_shopConfig': '/settings/load',                             //获取商品配置
    'hall_getInfo': '/user/getInfo',                             //获取代理邀请码
    'hall_getGameInfo': '/gameSocket/gameIndex',                             //获取代理邀请码
    'hall_purchase': '/mall/purchase',
    "getWeChatId": "/qp_getHallSettings",
    "yyl_reward": "/yyl/caiChi",
    "yyl_bet": "/yyl/bet",
    "yyl_getRewardInfo": "/yyl/getRewardInfo",
    "yyl_getLianZhongInfo": "/yyl/getLianZhongInfo",
    'hall_joinGoldTable': 'hall.msgHandler.joinGoldTable',
    "hall_advclient": "/settings/adv_list_client",
    "hall_getGoldRanking": "/blackList/getGoldRanking", // 获取金币排行榜

    "hall_everyDayGoldReward": "hall.activeHandler.useDailyGoldReward",
    "hall_changeGoldTable": "hall.msgHandler.changeGoldTable",

    "hall_good_list": "/order/good_list", //积分商城
    "hall_add_order": "/order/add_order", //积分商城商品信息
    "hall_orderList": "/order/orderList", //积分商城兑换记录
    'hall_getTaskInfo': 'hall.msgHandler.getTaskInfo',//获取任务列表
    'hall_taskFinish': 'hall.playerHandler.taskFinish',//完成任务
    'hall_taskProgress': 'hall.playerHandler.taskProgress',//任务进度
    "turn_next_gachaInfo": "/dzp/nextGachaInfo",
    "turn_gacha": "/dzp/gacha",
    'hall_updatePlayerEquip': 'hall.playerHandler.updatePlayerEquip',    //使用装饰
    'nas_buy':'/qp_updatePlayerRes'
};

hall.net.events = {
    'disconnect': function (data) {// from pomelo
        qp.event.send('disconnect', data);
    },
    'disconnected': function (data) { // from heartbeat
        qp.event.send('disconnected', data);
    },
    'reconnect': function (data) {
        qp.event.send('reconnect', data);
    },
    'hallUpdatePlayerAttr': function (data) {
        qp.event.send('hallUpdatePlayerAttr', data);
        JJLog.print(data);
    },
    'hallBroadcastMsg': function (data) {
        qp.event.send('hallBroadcastMsg', data);
        JJLog.print(data);
    },

    'hallMessageNotify': function (data) {
        qp.event.send('hallMessageNotify', data);
        JJLog.print(data);
    },

    'hallTempNotify': function (data) {
        qp.event.send('hallTempNotify', data);
        JJLog.print(data);
    },

    'hallBagMsg': function (data) {
        qp.event.send('hallBagMsg', data);
        JJLog.print(data);
    },
    'hallDayLoginMsg': function (data) {
        hall.dailyLogin = data;
        qp.event.send('hallDayLoginMsg', data);
        JJLog.print(data);
    },
    //背包功能
    'hallUpdateBag': function (data) {
        qp.event.send('hallUpdateBag', data);
        JJLog.print('hallUpdateBag' + JSON.stringify(data));
    },

    'hallUpdateEquip': function (data) {
        qp.event.send('hallUpdateEquip', data);
        JJLog.print('hallUpdateEquip' + JSON.stringify(data));
    },
    'hallChargeResult': function (data) { // sent from native callback
        qp.event.send('hallChargeResult', data);
        JJLog.print(data);
    },
    'hallSafeBox': function (data) {
        qp.event.send('hallSafeBox', data);
        JJLog.print(data);
    },
    'hallWxInvite': function (data) {
        qp.event.send('hallWxInvite', data);
        JJLog.print(data);
    },
    'wxLoginResult': function (data) { // sent from native callback
        qp.event.send('wxLoginResult', data);
        JJLog.print(data);
    },
    'wxShareUrlResult': function (data) { // sent from native callback
        qp.event.send('wxShareUrlResult', data);
        JJLog.print(data);
    },
    'hallLogin': function (data) { // login su
        qp.event.send('hallLogin', data);
        JJLog.print(data);
    },
    'hallGameIng': function (data) {  //断线重连
        qp.event.send('hallGameIng', data);
        JJLog.print(data);
    },
    'wxEnterRoom': function (data) {  //微信直接进房间
        qp.event.send('wxEnterRoom', data);
        JJLog.print(data);
    },

    'hallDayLoginMsg': function (data) {
        hall.dailyLogin = data;
        qp.event.send('hallDayLoginMsg', data);
        JJLog.print(data);
    },

    'locationChanged': function (data) {  //位置更新
        qp.event.send('locationChanged', data);
        JJLog.print(data);
    },

    'hallFreeActiveSwitch': function (data) {
        //{startTime， endTime, status}
        JJLog.print(JSON.stringify(data));
        qp.event.send('hallFreeActiveSwitch', data);
    }, // 通知免费
},

    hall.net.wxLoginCb = null;

hall.net.init = function () {
    qp.event.bind(hall.net.events);
},

    hall.net.auto_relogin_count = 0,
    hall.net.auto_relogin_id = null;
hall.net.checkVersion = function (osPlatform, cb) {
    JJLog.print("snoy checkVersion 1");


    qp.event.listen(hall, 'disconnect', function (msg) {
        JJLog.print("snoy checkVersion 23:" + qp.net.connectFirst);
        if (qp.net.connectFirst == false) {
            if (!!hall.net.auto_relogin_id) {
                clearTimeout(hall.net.auto_relogin_id);
                hall.net.auto_relogin_id = null;
            }
            hall.net.auto_relogin_id = cc.setTimeout(function () {
                hall.net.autoReLogin(function () {
                });
            }, 50);
        }
    });

    qp.event.listen(hall, 'disconnected', function (msg) {
        JJLog.print("snoy disconnected 1:");
        JJLog.print("snoy disconnected 2:" + qp.net.state);
        if (qp.net.state == 'gate') {
//      qp.net.state = 'init';
        } else if (qp.net.state == 'connector') {
            qp.net.state = 'gate';
        }
    });

    qp.event.listen(hall, 'wxEnterRoom', function (data) {
        if (!hall.inRoom) {
            if (!!data['roomId']) {
                hall.wxEnterRoom = data['roomId'];
                pomelo.disconnect();
            }
        }
    });


    qp.event.listen(hall, 'locationChanged', function (data) {
        var info = data.info;
        var navInfo = {};
        var das = BASE64.decoder(info);
        if (das && das instanceof Array) {
            var arr2 = [];
            for (i = 0, l = das.length; i < l; i += 1) {
                arr2.push(String.fromCharCode(das[i]));
            }
            var str = arr2.join('');
            navInfo = JSON.parse(str);
        }
        data.info = navInfo;
        hall.userNav = data;
        if (hall.userNav == null && hall.inRoom) {
            hall.getPlayingGame().net.updateLocalPosition();
        }
    });
    qp.event.listen(hall, 'wxShareUrlResult', function (data) {
        var event = new cc.EventCustom(CommonEvent.EVT_ShareCallback);
        event.setUserData(data.result);
        cc.eventManager.dispatchEvent(event);
    });
    qp.event.listen(hall, 'wxLoginResult', function (data) {
        JJLog.print(data.result);
        JJLog.print(data.code);

        if (data.result == '0') {
            qp.net.request(hall.net.cmds.hall_wxUser, {wxClient: 'wxapp', code: data.code},
                function (resp) {
                    var user = JSON.parse(resp).user;
                    if(!user){
                        hall.net.wxLoginCb({code: 500});
                        return;
                    }
                    JJLog.print("wxLoginResult 1");
                    // if (isEmojiCharacter(user.nickname)) {
                    //     JJLog.print("wxLoginResult 2222");
                    //     user.nickname = "???"
                    // }
                    // ;
                    JJLog.print(JSON.stringify(user));
                    util.setCacheItem('wxUser', JSON.stringify(user));
                    util.setCacheItem('wxLoginTime', new Date().getTime());
                    JJLog.print('user:', util.getCacheItem('wxUser'));
                    JJLog.print('wxLoginTime:', util.getCacheItem('wxLoginTime'));//sex nickname

                    //hall.net.register("1", user.openid, user.openid, user.nickname, '', '', user.openid, user.headimgurl, user.sex,function(data) {
                    hall.net.register("1", user.openid, user.openid, user.nickname, '', '', user.unionid, user.headimgurl, user.sex, function (data) {
                        JJLog.print(data.code);
                        if (data.code == 200) {
                            hall.net.loginCallback(data, hall.net.wxLoginCb);
                        } else {
                            hall.net.wxLoginCb(data);
                        }
                    });
//            } else {
//              hall.net.login("1", user.openid, user.openid, user.headimgurl, cb);
//            }
                });
        } else if (data.result == '-1') {
            hall.net.wxLoginCb({code: 500});
        }
        else {
            hall.net.wxLoginCb({code: 410});
        }

        // qp.event.stop(hall, 'wxLoginResult');
    });

    qp.event.listen(this, 'hallBroadcastMsg', function (data) {
        JJLog.print("hallBroadcastMsg");
        if (hall.speakMsg.length > hall.SPEAK_MSG_LENGTH) {
            hall.speakMsg.splice(0, 1);
        }
        hall.speakMsg.push(data);
        JJLog.print(data);
//            var msg = data["uid"] + ":"+data["record"] ;
//            this.pushMsg(msg);

    });


    qp.event.listen(hall, 'hallSafeBox', function (data) {
        hall.safeBox = data.hallSafeBox;
        JJLog.print(hall.safeBox);
    });

    qp.event.listen(hall, 'hallUpdatePlayerAttr', function (data) {
        for (var i in data) {
            hall.user[i] = data[i];
        }
        JJLog.print(hall.user);
    });

    qp.event.listen(hall, 'hallBagMsg', function (data) {
        hall.speakerInfo = data;
    });

    qp.event.listen(hall, 'hallUpdateBag', function (data) {
        GameBagEquipMgr.Instance.onhallUpdateBag(data);
        console.log('111111111111'+ JSON.stringify(data));
    });

    qp.event.listen(hall, 'hallUpdateEquip', function (data) {
        GameBagEquipMgr.Instance.onhallUpdateEquip(data);
        console.log('222222222222'+ JSON.stringify(data))
    });

    qp.event.listen(hall, 'hallFreeActiveSwitch', function (data) {

        JJLog.print(JSON.stringify(data));
        if (hall.freeData.length == 0) {
            hall.freeData = data;
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var freeData = data[i];
            for (var j = 0; j < hall.freeData.length; j++) {
                if (hall.freeData[j].serverType == freeData.serverType) {
                    hall.freeData[j] = freeData;
                }
            }
        }


        JJLog.print("##########");
        JJLog.print(JSON.stringify(hall.freeData));
    });

    qp.event.listen(hall, 'hallDayLoginMsg', function (data) {
        hall.dayLogin = {};
        hall.dayLogin.loginReward = [];
        //for (var i in data.Loginreward) {
        //  hall.dayLogin.loginReward.push(data.Loginreward[i]);
        //}
        hall.dayLogin.activeData = data.activeData;

        JJLog.print(JSON.stringify(hall.dayLogin));
    });

    qp.event.listen(hall, 'hallLogin', function (data) {
        //JJLog.print(hall.dayLogin);
    });

    qp.event.listen(hall, 'hallGameIng', function (data) {

    });

    if (util.getCacheItem('deviceId') == undefined || util.getCacheItem('deviceId') == "")
        util.setCacheItem('deviceId', util.uuid(16, 16));

    if (util.getCacheItem('audioInited') == undefined || util.getCacheItem('audioInited') == "") {
        util.setCacheItem('background_music', 1);
        util.setCacheItem('sound_effect', 1);
        util.setCacheItem('GameMusic', 1);
        util.setCacheItem('GameEffect', 1);
        util.setCacheItem('music_volume', 1);
        util.setCacheItem('effect_volume', 1);
        util.setCacheItem('audioInited', 1);
    }

    cb();
};

hall.net.findPwd = function (username, reservedInfo, cb) {
    qp.net.request(hall.net.cmds.hall_findPassword,
        {userName: username, passwordRecord: reservedInfo},
        function (resp) {
            cb(resp);
        });
};

hall.net.register = function (regType, username, pwd, nickName, inviteUserName, reservedInfo, deviceId, headUrl, sex, cb) {
    var os = "ios";
    if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
        os = "android";

    var params = {
        name: username,
        password: pwd,
        regType: regType,
        appId: hall.appId,
        passwordRecord: reservedInfo,
        deviceID: deviceId,
        nickName: nickName,
        curVersion: hall.curVersion,
        osPlatform: os
    };

    if (headUrl != undefined && headUrl.length > 0)
        params.headUrl = headUrl;
    if (sex != undefined && sex >= 0) {
        params.userSex = sex;
    }

    // if(inviteUserName != undefined && inviteUserName.length > 0)
    // {
    //     params.inviteRecord = "regRecord";
    //     params.inviteUserName = inviteUserName;
    // }
    JJLog.print(JSON.stringify(params));

    qp.net.request(hall.net.cmds.hall_register, params,
        function (resp) {
            resp = JSON.parse(resp);
            if (resp.code == 200) {
                cb(resp);
            } else {
                qp.net.request(hall.net.cmds.hall_register, params,
                    function (resp) {
                        resp = JSON.parse(resp);
                        if (resp.code == 200) {
                            cb(resp);
                        } else {
                            qp.net.request(hall.net.cmds.hall_register, params,
                                function (resp) {
                                    resp = JSON.parse(resp);
                                    cb(resp);
                                });
                        }
                    });
            }
        });
};

hall.net.guestLogin = function (cb) {
    // if (util.getCacheItem('guestUser') == undefined || util.getCacheItem('guestUser') == "") {
    hall.net.register("1", util.getCacheItem('deviceId'), util.getCacheItem('deviceId'), util.getCacheItem('deviceId'), '', '',
        util.getCacheItem('deviceId'), '', 1, function (data) {
            if (data.code == 200) {
                util.setCacheItem('guestUser', util.getCacheItem('deviceId'));
                // hall.net.login("1", util.getCacheItem('guestUser'), util.getCacheItem('guestUser'), '', cb);
                hall.net.loginCallback(data, cb);
            } else {
                cb(data);
            }
        });
    // }
    // else {
    //   hall.net.login("1", util.getCacheItem('guestUser'), util.getCacheItem('guestUser'), '', cb);
    // }
};

hall.net.wxShareURL = function (title, desc, flag) {

    // if (hall.PACKAGEFROM == "bd") {
    //     hall.net.wxShareURLWithAgentId(title, desc, "100862", flag);
    //     return;
    // }else if (hall.PACKAGEFROM == "360") {
    //     hall.net.wxShareURLWithAgentId(title, desc, "100864", flag);
    //     return;
    // }

    var share = servers.share;
    if (hall.wxEnterRoom != 0) {
        share = share.replace('=0', '=' + hall.wxEnterRoom);
        hall.wxEnterRoom = 0;
    }
    if (flag == 1 && share.indexOf("roomId") != -1) {
        share = servers.aLishare;
    }
    JJLog.print(share);
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("NativeOcClass",
                "wxShareURL:withDesc:withURL:useFlag:", title, desc, share, '' + flag);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                "wxShareURL", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", title, desc, share, flag);
        }
    }
};

//测试代码======
hall.net.wxShareURLTest = function (title, desc, flag) {

    //var fullPath = "http://update.lekoy.com/res/yjzhejiangTest/share.png" ;//”http://update.lekoy.com/res/yjzhejiangTest/share.png“;


    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            var fullPath = jsb.fileUtils.getWritablePath() + "qipai/" + "/res/share/share.jpg";
            if (!jsb.fileUtils.isFileExist(fullPath)) {
                // 缓存文件不存在

                fullPath = jsb.fileUtils.fullPathForFilename("res/share/share.png")
            }

            jsb.reflection.callStaticMethod("NativeOcClass", "shareIMGWithFilePath:width:height:useFlag:", fullPath, 160, 100, 1);

//            var fullPath = "http://update.lekoy.com/res/yjzhejiangTest/share.png" ;
//
//            jsb.reflection.callStaticMethod("NativeOcClass", "shareIMGWithURL:width:height:useFlag:", fullPath, 160, 100,1);

        } else if (cc.sys.os == cc.sys.OS_ANDROID) {

            var fullPath = jsb.fileUtils.getWritablePath() + "qipai/" + "res/share/share.jpg";
            if (!jsb.fileUtils.isFileExist(fullPath)) {
                // 缓存文件不存在
                fullPath = jsb.fileUtils.fullPathForFilename("res/share/share.png");
            }


            // var fullPath = "http://update.lekoy.com/res/yjzhejiangTest/share.png" ;

            jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                "ShareIMGWithFilePath", "(Ljava/lang/String;III)V", fullPath, 160, 100, 1);

            //  jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
            // "ShareIMGWithFilePath", "(Ljava/lang/String;III)V", fullPath, 160, 100,1);
        }
    }
};


hall.net.wxShareURLWithAgentId = function (title, desc, agentId, flag) {
    var share = "http://mall.yiqigame.me/wxpub.html?a=1&token=download&s=" + hall.AppAgentType + "&t=" + agentId;

    if (hall.PACKAGEFROM == "360") {
        share += "&c=360"
    } else if (hall.PACKAGEFROM == "bd") {
        share += "&c=bd"
    }

    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("NativeOcClass",
                "wxShareURL:withDesc:withURL:useFlag:", title, desc, share, '' + flag);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                "wxShareURL", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", title, desc, share, flag);
        }
    }
};

hall.net.wxShareScreen = function (flag) {
    if (cc.sys.isNative) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("NativeOcClass",
                "wxShareScreen:", '' + flag);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                "wxShareScreen", "(I)V", flag);
        }
    }
};

hall.net.wxLogin = function (cb) {
    if (!cc.sys.isNative) {
        qp.net.request(hall.net.cmds.hall_wxUser, {
                wxClient: cc.sys.browserType == cc.sys.BROWSER_TYPE_WECHAT ? 'wxpub' : 'wxweb',
                code: wxCode
            },
            function (resp) {
                var user = JSON.parse(resp).user;
//      if (util.getCacheItem('wxUser') == undefined) {
//        util.setCacheItem('wxUser', user);
                hall.net.register("1", user.openid, user.openid, user.nickname, '', '', user.unionid, user.headimgurl, user.sex, function (data) {
                    if (data.code == 200) {
                        hall.net.login("1", user.openid, user.openid, user.headimgurl, cb);
//            hall.net.loginCallback(data, cb);
                    } else {
                        cb(data);
                    }
                });
//      } else {
//        hall.net.login("1", user.openid, user.openid, user.headimgurl, cb);
//      }
            });
    } else {
        hall.net.wxLoginCb = cb;

        var lastLogin = util.getCacheItem('wxLoginTime');
        if (lastLogin != null && lastLogin != '')
            lastLogin = parseInt(lastLogin);
        else
            lastLogin = 0;

        var now = new Date().getTime();
        JJLog.print(lastLogin);
        JJLog.print(now);
        JJLog.print(now - lastLogin);
        if (now - lastLogin > 3600 * 1000 * 24)
            util.removeCacheItem('wxUser');

        var user = util.getCacheItem('wxUser');
        JJLog.print('user:', user);
        if (user != null && user != '') {
            var user = JSON.parse(user);
            var nickNameBase64 = user.nickname;
            JJLog.print("bace64nickName 3:" + nickNameBase64);
            hall.net.register("1", user.openid, user.openid, nickNameBase64, '', '', user.unionid, user.headimgurl, user.sex, function (data) {
                JJLog.print(data.code);
                if (data.code == 200)
                    hall.net.loginCallback(data, hall.net.wxLoginCb);
                else
                    hall.net.wxLoginCb(data);
            });

        } else {
            if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("NativeOcClass",
                    "wxLogin:", 'qphall');
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                    "wxLogin", "(Ljava/lang/String;)V", 'qphall');
            }
        }
    }
};

hall.net.loginCallback = function (data, cb) {
    hall.token = data.token;
    qp.net.request(hall.net.cmds.hall_enter, {uid: data.uid, token: hall.token},


        function (resp) {
            if (resp.code == 200) {
                if (!!data['isShen'] && data['isShen'] != null && data['isShen'] != undefined) {
                    // hall.songshen = data['isShen'];
                }
                hall.user = resp.player;
                JJLog.print(hall.user.uid);

                hall.net.startLocation();
                // if (cc.sys.os == cc.sys.OS_ANDROID) {
                //     cc.setTimeout(function () {
                //         hall.net.startLocation();
                //         cc.setTimeout(function () {
                //             hall.net.startLocation();
                //         }, 3000);
                //     }, 3000);
                // }

                if (cc.sys.isNative) {
                    GameLink.onUserLogin(hall.AppNameID + hall.user.uid);
                }

                JJLog.print("loginCallback and heart");
                hall.net.resetHeartBeat();
                hall.net.heartBeat(function () {
                });

                hall.net.getWxRoomId();

                if (util.getCacheItem('loginReason') == 1) {
                    var coinNum = hall.user.coinNum - util.getCacheItem('coinNum');
                    var gemNum = hall.user.gemNum - util.getCacheItem('gemNum');
                    qp.event.send('hallChargeResult', {coinNum: coinNum, gemNum: gemNum});

                    util.setCacheItem('loginReason', 0);
                }

                if (!cc.sys.isNative &&
                    window.hasOwnProperty('inviteTableId') && inviteTableId != 0) {
                    hall.wxInvite = {
                        inviteUid: inviteUid, areaId: inviteAreaId, tableId: inviteTableId,
                        baseChip: inviteBaseChip, vip: invitePrivate, password: inviteTablePwd
                    };
                    setTimeout(function () {
                        qp.event.send('hallWxInvite', hall.wxInvite);
                    }, 20);
                } else {
                    hall.wxInvite = {inviteUid: 0, areaId: 0, tableId: 0, baseChip: 0, vip: 0, password: 0};
                }
            }
            cb(resp);

            if (data.code == 200 && data['isDownGame'] == 1) {
                hall.mustUpdate = true;

                if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
                    hall.updateUrl = data['downloadUrlIOS'];
                } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                    hall.updateUrl = data['downloadUrlAndroid'];
                } else {
                    hall.updateUrl = data['downloadUrlAndroid'];
                }
            }
            JJLog.print('登陆回调=' + JSON.stringify(resp));
            if (resp.code == 200) {
                var gaming = resp['gameing'];
                var serverId = resp['serverId'];
                var arenaId = resp['arenaId'];
                var isGold = resp['isGold'];
                if (gaming == 1 && hall.mustUpdate == false) {

                    if (isGold == 1) {
                        hall.rePlayingEnter(serverId , -1)
                    } else {
                        hall.rePlayingEnter(serverId , arenaId)
                    }
                } else {
                    
                    var event = new cc.EventCustom(CommonEvent.EVT_GAMING);
                    event.setUserData(data['gameing']);
                    cc.eventManager.dispatchEvent(event);
                    var hall1 = new MajhongHall();
                    hall1.showHall();

                }
            }
        });
};

hall.net.login = function (regType, username, pwd, headUrl, cb) {
    var params = {name: username, password: pwd, regType: regType, appId: hall.appId};
    if (headUrl != undefined && headUrl.length > 0)
        params.headUrl = headUrl;

    qp.net.request(hall.net.cmds.hall_login, params,
        function (resp) {
            var data = JSON.parse(resp);
            if (data.code == 200) {
                util.setCacheItem('userName', username);
                util.setCacheItem('userPwd', pwd);
                hall.net.loginCallback(data, cb);
            } else {
                cb(resp);
            }
        });
};

var auto_relogin_success_first_time = 0;
var auto_relogin_success_count = 0;
var lastReloginTime = 0;
hall.net.autoReLogin = function (cb) {
    hall.net.resetHeartBeat();
    hall.net.auto_relogin_count++;
    lastReloginTime = Date.now();
    if (qp.net.state == 'gate') {
        //      qp.net.state = 'init';
    } else if (qp.net.state == 'connector') {
        qp.net.state = 'gate';
    }

    if (auto_relogin_success_first_time > 0 && lastReloginTime - auto_relogin_success_first_time < 10000 && auto_relogin_success_count > 2) { // 同一个账号反复抢登
        auto_relogin_success_first_time = 0;
        auto_relogin_success_count = 0;
        hall.net.auto_relogin_count = 0;
        MajhongLoading.dismiss();
        var dialog = new JJConfirmDialog();
        dialog.setDes('账号频繁登录不同设备，请稍后重试!');
        dialog.setCallback(function () {
            qp.exit();
        });
        dialog.showDialog();
        return;
    }

    if (hall.net.auto_relogin_count > 2) {
        auto_relogin_success_first_time = 0;
        auto_relogin_success_count = 0;
        hall.net.auto_relogin_count = 0;
        MajhongLoading.dismiss();
        var dialog = new JJConfirmDialog();
        dialog.setDes('网络异常，请重新登录!');
        dialog.setCallback(function () {
            qp.exit();
        });
        dialog.showDialog();
        return;
    }

    MajhongLoading.dismiss();
    MajhongLoading.show('网络已断开,正在重新连接');
    qp.event.send('reconnect', {code: 201});

    var params = {name: hall.user.userName, password: hall.user.password, regType: "1", appId: hall.appId};
    if (hall.user.headUrl != undefined && hall.user.headUrl.length > 0)
        params.headUrl = hall.user.headUrl;

    qp.net.request(hall.net.cmds.hall_login, params,
        function (resp) {
            var data = JSON.parse(resp);
            if (data.code == 200) {
                JJLog.print(JSON.stringify(resp) + "~~~~~~~~~~~~~~~~~~~~~");
                qp.event.send('reconnect', {code: 200});
                hall.net.auto_relogin_count = 0;

                hall.net.loginCallback(data, function (loginData) {
                    if (loginData.code == 200) {
                        JJLog.print('autoReLogin OK');
                        MajhongLoading.dismiss();

                        auto_relogin_success_count++;
                        if (auto_relogin_success_first_time == 0) {
                            auto_relogin_success_first_time = Date.now();
                            // 30秒内没有发生重新抢登,把条件清零
                            cc.setTimeout(function () {
                                auto_relogin_success_first_time = 0;
                                auto_relogin_success_count = 0;
                            }, 30000);
                        }
                    }
                }.bind(this));
            }
            else {
                if (hall.net.auto_relogin_count > 2) {
                    auto_relogin_success_first_time = 0;
                    auto_relogin_success_count = 0;
                    hall.net.auto_relogin_count = 0;
                    MajhongLoading.dismiss();
                    var dialog = new JJConfirmDialog();
                    dialog.setDes('网络异常，请重新登录!');
                    dialog.setCallback(function () {
                        qp.exit();
                    });
                    dialog.showDialog();
                } else {

                    cc.setTimeout(function () {
                        hall.net.autoReLogin(function () {
                        });
                    }, 1000);
                }
            }
        });
};

hall.net.getShopItems = function (cb) {
    qp.net.request(hall.net.cmds.hall_getShopInfo,
        {uid: hall.user.uid},
        function (resp) {
            hall.shopItems = [];
            for (var i in resp.shopInfo) {
                hall.shopItems.push(resp.shopInfo[i]);
            }
            cb(hall.shopItems);
        });
};

hall.net.buyShopItem = function (id, channel, cb) {
    qp.net.request(hall.net.cmds.hall_buyShopItem,
        {uid: hall.user.uid, id: id, channel: channel, token: hall.token},
        function (resp) {
//      cb(resp);
            if (resp.code == 200) {
                if (!cc.sys.isNative) {
                    window.pingpp.createPayment(resp.charge, function (result, err) {
                        JJLog.print(result, err);
                    });

                    util.setCacheItem('loginReason', 1);
                    util.setCacheItem('coinNum', hall.user.coinNum);
                    util.setCacheItem('gemNum', hall.user.gemNum);
                } else {
                    if (cc.sys.os == cc.sys.OS_IOS) {
                        jsb.reflection.callStaticMethod("NativeOcClass",
                            "pay:", JSON.stringify(resp.charge));
                    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                            "pay", "(Ljava/lang/String;)V", JSON.stringify(resp.charge));
                    }
                }

                //util.setCacheItem('userName', hall.user.userName);
                //util.setCacheItem('userPwd', hall.user.password);
                //
                //setTimeout(function() {
                //  util.removeCacheItem('userName');
                //  util.removeCacheItem('userPwd');
                //}, 30000);
            }
        });
};

hall.net.uploadHeadPhoto = function (cb) {
    hall.net.updateUserInfo({headUrl: url}, function (data) {
        cb(data);
    });
};

hall.net.updateUserInfo = function (info, cb) { // info是一个对象 类似 {nickName : 'xxx', userSex : 2}
    info.uid = hall.user.uid;
    qp.net.request(hall.net.cmds.hall_updateUserInfo,
        info,
        function (resp) {
            if (resp.code == 200) {
                for (var p in info)
                    hall.user[p] = info[p];
            }
            cb(resp);
        });
};

hall.net.dailyLogin = function (cb) {
    qp.net.request(hall.net.cmds.hall_dailyLogin,
        {uid: hall.user.uid},
        function (resp) {
            if (resp.code == 200)
                hall.dailyLogin.activeData.dayLogin = 1;
            cb(resp);
        });
};

hall.net.getMailInfo = function (type, cb) {
    qp.net.request(hall.net.cmds.hall_getMailInfo,
        {uid: hall.user.uid, type: type},
        function (resp) {
            if (resp.code == 200)
                hall.mails = resp.mailInfo;
            cb(resp);
        });
};

hall.net.createSafeBox = function (pwd, cb) {
    qp.net.request(hall.net.cmds.hall_createSafeBox,
        {uid: hall.user.uid, password: pwd},
        function (resp) {
            cb(resp);
        });
    a
};

hall.net.updateSafeBox = function (oldPwd, newPwd, cb) {
    qp.net.request(hall.net.cmds.hall_updateSafeBox,
        {
            uid: hall.user.uid,
            oldPassword: oldPwd,
            newPassword: newPwd
        },
        function (resp) {
            cb(resp);
        });
};

hall.net.openSafeBox = function (pwd, cb) {
    if (hall.safeBox == undefined || hall.safeBox == null) {
        qp.net.request(hall.net.cmds.hall_createSafeBox,
            {uid: hall.user.uid, password: pwd},
            function (resp) {
                cb(resp);
            });
    } else {
        qp.net.request(hall.net.cmds.hall_openSafeBox,
            {uid: hall.user.uid, password: pwd},
            function (resp) {
                cb(resp);
            });
    }
};

/*操作保险箱
 uid
 type 1:加钱 2：减少钱  3：送钱
 coinNum
 userName:被送方名字
 * */
hall.net.operateSafeBox = function (type, coinNum, userName, cb) {
    qp.net.request(hall.net.cmds.hall_operateSafeBox,
        {uid: hall.user.uid, type: type, coinNum: coinNum, userName: userName},
        function (resp) {
            cb(resp);
        });
};

hall.net.broadcast = function (msg, cb) {
    qp.net.request(hall.net.cmds.hall_broadcast,
        {
            uid: hall.user.uid,
            msg: msg,
            itemId: 1
        },
        function (resp) {
            cb(resp);
        });
};

hall.net.getGameCfg = function (gameId, cb) {
    qp.net.request(hall.net.cmds.hall_getGameConfig,
        {uid: hall.user.uid, gameId: gameId},
        function (resp) {
            cb(resp);
        });
};

hall.net.getRankList = function (cb) {
    qp.net.request(hall.net.cmds.hall_getRankInfo,
        {uid: hall.user.uid},
        function (resp) {
            cb(resp);
        });
};

hall.net.sendfeedback = function (msg, cb) {
    qp.net.request(hall.net.cmds.hall_feedbackInfo,
        {
            uid: hall.user.uid,
            feedback: msg
        },
        function (resp) {
            cb(resp);
        });
};

hall.net.getfeedback = function (cb) {
    qp.net.request(hall.net.cmds.hall_getFeedbackInfo,
        {
            uid: hall.user.uid
        },
        function (resp) {
            cb(resp);
        });
};

//领奖系统
//PODIUM_TYPE:
//{
//    PODIUM_VIP: 1,      //VIP领奖相关
//        PODIUM_FRIEND: 2,   //好友推荐奖相关
//    PODIUM_GIVE: 3      //赠送金币相关
//},

hall.net.getPodiumInfo = function (cb) {
    qp.net.request(hall.net.cmds.hall_getPodiumInfo,
        {
            uid: hall.user.uid
        },
        function (resp) {
            cb(resp);
        });
};

hall.net.pickPodiumInvite = function (key, cb) {
    qp.net.request(hall.net.cmds.hall_pickPodiumInvite,
        {
            uid: hall.user.uid,
            podiumKey: key
        },
        function (resp) {
            cb(resp);
        });
};


hall.net.getShopListInfo = function (cb) {
    qp.net.request(hall.net.cmds.hall_getShopListInfo,
        {
            uid: hall.user.uid
        },
        function (resp) {
            cb(resp);
        });
};

hall.net.getShopItem = function (key, cb) {
    qp.net.request(hall.net.cmds.hall_buyShopItem,
        {
            uid: hall.user.uid,
            id: key
        },
        function (resp) {
            cb(resp);
        });
};

var heartbeat_request_count = 0;
var heartbeat_respond_count = 0;
var heartbeat_timer_id = -1;

hall.net.resetHeartBeat = function () {
    heartbeat_request_count = 0;
    heartbeat_respond_count = 0;
    if (heartbeat_timer_id != -1) {
        cc.clearInterval(heartbeat_timer_id);
        heartbeat_timer_id = -1;
    }
};

hall.net.heartBeat = function (cb) {
    if (qp.net.state != 'connector' || hall.songshen == 1) {
        return;
    }
    heartbeat_request_count++;
    qp.net.request(hall.net.cmds.hall_heartBeat,
        {uid: hall.user.uid},
        function (resp) {
            //JJLog.print("heartBeat response");
            if (resp.code == 200) {
                //heartbeat_respond_count++;
                heartbeat_request_count = 0;
                hall.lastRecieveTime = Date.now();
                hall.delayMS = hall.lastRecieveTime - hall.lastSendTime;
            } else {
                JJLog.print("bad heart message");
            }
            cb(resp);
        });

    if (heartbeat_timer_id == -1) {
        JJLog.print("heartBeat_time reset:" + heartbeat_timer_id);
        //JJLog.print(Date.now());
        heartbeat_timer_id = cc.setInterval(function () {
            //JJLog.print('heartBeat ...'+heartbeat_request_count+'/'+heartbeat_respond_count);

            // if (heartbeat_request_count - heartbeat_respond_count >= 2) {
            hall.lastSendTime = Date.now();
            if (heartbeat_request_count >= 3) {
                hall.net.resetHeartBeat();
                JJLog.print("heart close autorelogin 2");
                var nowTime = Date.now();
                if (nowTime - lastReloginTime >= 10000 && !MajhongLoading.load) {
                    JJLog.print("heart gate 1");
                    var pomelo = window.pomelo;
                    if (pomelo.connectState != 'disconnected') {
                        pomelo.disconnect();
                    } else {
                        JJLog.print("heart gate2");
                        // cc.setTimeout(function () {
                        //     hall.net.autoReLogin(function () {
                        //     });
                        // }, 1000);
                    }
                }
            }
            else {
                hall.net.heartBeat(function () {
                });
            }
        }, 5000);
    }
};

hall.net.getWxRoomId = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        hall.wxEnterRoom = jsb.reflection.callStaticMethod("NativeOcClass",
            "getWxRoomId");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        hall.wxEnterRoom = jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
            "getWxRoomId", "()I");
    }
    JJLog.print('getWxRoomId', hall.wxEnterRoom);
};

var gameIsBackMode = false;
cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
    JJLog.print("游戏进入后台");
    cc.audioEngine.setMusicVolume(0);
    cc.audioEngine.setEffectsVolume(0);
    gameIsBackMode = true;
});
cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
    JJLog.print("重新返回游戏");
//    var pomelo = window.pomelo;
//    if (pomelo.connectState != 'disconnected' && qp.net.isGameing == true) {
//        cc.audioEngine.stopAllEffects();
//        pomelo.disconnect();
//    }
    var soundVolume = util.getCacheItem('effect_volume');
    var musicVolume = util.getCacheItem('music_volume');

    if (musicVolume != null && musicVolume != "" && musicVolume != undefined) {
        cc.audioEngine.setMusicVolume(musicVolume);
    }

    if (soundVolume != null && soundVolume != "" && soundVolume != undefined) {
        cc.audioEngine.setEffectsVolume(soundVolume);
    }
    gameIsBackMode = false;
    if (hall.user.uid != null && hall.user.uid != undefined) {
        hall.net.startLocation();
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            cc.setTimeout(function () {
                hall.net.startLocation();
                cc.setTimeout(function () {
                    hall.net.startLocation();
                }, 3000);
            }, 3000);
        }
    }
});

hall.net.getHuiFangInfo = function (recordId, cb) {
    qp.net.request(hall.net.cmds.hall_getHuiFangInfo,
        {huiFangNum: recordId},
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.getHuiFangList = function (cb) {
    qp.net.request(hall.net.cmds.hall_getHuiFangList,
        {uid: hall.user.uid},
        function (resp) {
            cb(JSON.parse(resp));
        });
};


hall.net.addShareAward = function (cb) {
    qp.net.request(hall.net.cmds.hall_addShareAward,
        {
            uid: hall.user.uid, type: 1
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.openLocationSetting = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("NativeOcClass",
            "openLocationSetting");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
            "openLocationSetting", "()V");
    }
};

hall.net.isLocationEnabled = function () {
    var enabled = 0;
    if (cc.sys.os == cc.sys.OS_IOS) {
        enabled = jsb.reflection.callStaticMethod("NativeOcClass",
            "isLocationEnabled");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        enabled = jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
            "isLocationEnabled", "()I");
    }

    return enabled == 1 ? true : false;
};

hall.net.startLocation = function () {
    if (hall.songshen == 0) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("NativeOcClass",
                "startLocation");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                "startLocation", "()V");
        }
    }
};

hall.net.UMengEvent = function (eventName, eventLabel) {
    if (hall.songshen == 0) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("NativeOcClass",
                "UMengPlayerEvent:label:", eventName, eventLabel);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                "UMengPlayerEvent", "(Ljava/lang/String;Ljava/lang/String;)V", eventName, eventLabel);
        }
    }
};

hall.net.UMengLogin = function () {
    if (hall.songshen == 0) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("NativeOcClass",
                "UMengPlayerLogin:", '' + hall.user.uid);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                "UMengPlayerLogin", "(Ljava/lang/String;)V", '' + hall.user.uid);
        }
    }
};

//获取代开房间的列表
hall.net.reCreateTables = function (data, cb) {
    qp.net.request(hall.net.cmds.reCreateTables,
        data,
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.getOrder = function (orderid, cb) {
    qp.net.request(hall.net.cmds.hall_getOrder,
        {
            uid: hall.user.uid, prodId: orderid, prodNum: 1
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.orderStatus = function (orderinfo,receipt, cb) {
    qp.net.request(hall.net.cmds.hall_orderStatus,
        {
            uid: hall.user.uid, payChannel: orderinfo['payChannel'],receipt:receipt, status: orderinfo['status'],
            prodId: orderinfo['prodId'], prodNum: orderinfo['prodNum'], orderId: orderinfo['orderId']
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};
//查询是否绑定邀请码
hall.net.checkBind = function (cb) {
    qp.net.request(hall.net.cmds.hall_checkBind,
        {
            uid: hall.user.uid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};
hall.net.bindCode = function (data, cb) {
    qp.net.request(hall.net.cmds.hall_bindCode,
        data,
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.nasBuy = function (data, cb) {
    qp.net.request(hall.net.cmds.nas_buy,
        data,
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.getShopConfig = function (cb) {
    qp.net.request(hall.net.cmds.hall_shopConfig,
        {
            uid: hall.user.uid,
            prod: 'sss',
            serverType: 'shisanshui',
            token: hall.user.uid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.getPlayerInfo = function (cb) {
    qp.net.request(hall.net.cmds.hall_getInfo,
        {
            uid: hall.user.uid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.getGameInfo = function (cb) {
    qp.net.request(hall.net.cmds.hall_getGameInfo,
        {
            uid: hall.user.uid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.purchase = function (num, cb) {
    qp.net.request(hall.net.cmds.hall_purchase,
        {
            uid: hall.user.uid,
            prod: 'sss',
            serverType: 'shisanshui',
            count: num,
            productName: '购买钻石',
            channel: 'wxpay',
            token: hall.user.uid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

//hxx
hall.net.advclient = function (cb) {
    qp.net.request(hall.net.cmds.hall_advclient,
        {
            rootAgent: hall.user.rootAgent,
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.getWeChatId = function (cb) {
    qp.net.request(hall.net.cmds.getWeChatId,
        {'uid': hall.user.uid, 'keys': '"healthNotice","kfWeChat","fkWeChat","dlWeChat","tsWeChat"'},
        function (resp) {
            cb(JSON.parse(resp));
        });
}

hall.net.getTableServerType = function (roomId, cb) {
    qp.net.request(hall.net.cmds.hall_getTableServerType,
        {
            uid: hall.user.uid,
            tableId: roomId
        },
        function (resp) {
            cb(resp);
        });
};

hall.net.yylReward = function (cb) {
    qp.net.request(hall.net.cmds.yyl_reward,
        {'uid': hall.user.uid},
        function (resp) {
            cb(JSON.parse(resp));
        });
}

hall.net.yylBet = function (num, cb) {
    qp.net.request(hall.net.cmds.yyl_bet,
        {'uid': hall.user.uid, 'betNum': num},
        function (resp) {
            cb(JSON.parse(resp));
        });
}

hall.net.yylGetRewardInfo = function (type, cb) {
    qp.net.request(hall.net.cmds.yyl_getRewardInfo,
        {'uid': hall.user.uid, 'type': type},
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.yylGetRewardNotice = function (Rewardlevel, cb) {
    qp.net.request(hall.net.cmds.yyl_getRewardInfo,
        {'uid': hall.user.uid, 'Rewardlevel': Rewardlevel, 'type': 3},
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.yylGetLianZhongInfo = function (type, cb) {
    qp.net.request(hall.net.cmds.yyl_getLianZhongInfo,
        {'uid': hall.user.uid, 'type': type},
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.joinGoldTable = function (serverType, level, gameType, cb) {
    qp.net.request(hall.net.cmds.hall_joinGoldTable,
        {'uid': hall.user.uid, 'serverType': serverType, 'type': gameType, 'level': level},
        function (resp) {
            cb(resp);
        });
};


hall.net.everyDayGoldReward = function (cb) {
    qp.net.request(hall.net.cmds.hall_everyDayGoldReward,
        {'uid': hall.user.uid},
        function (resp) {
            cb(resp);
        });
};

hall.net.changeGoldTable = function (serverType, tableId, level, gameType, cb) {
    qp.net.request(hall.net.cmds.hall_changeGoldTable,
        {'uid': hall.user.uid, 'serverType': serverType, 'type': gameType, 'level': level, 'tableId': tableId},
        function (resp) {
            cb(resp);
        });
};
hall.net.getGoldRanking = function (cb) {
    qp.net.request(hall.net.cmds.hall_getGoldRanking,
        {},
        function (resp) {
            JJLog.print("getGoldRanking", resp);
            cb(JSON.parse(resp));
        });
};

hall.net.talk = function () {
    hall.getPlayingGame().imIsRecording = true;
    sound.gameSoundQuiet();
    if (cc.sys.isNative) {
        GameLink.onUserStartTalk();
    }
};

hall.net.send = function (cancelVoice) {
    hall.getPlayingGame().imIsRecording = false;
    sound.gameSoundResume();
    if (cc.sys.isNative) {
        GameLink.onUserStopTalk(cancelVoice || false);
    }

};

hall.net.gache = function (cb) {
    qp.net.request(hall.net.cmds.turn_gacha,
        {'uid': hall.user.uid},
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.nextGacheInfo = function (cb) {
    qp.net.request(hall.net.cmds.turn_next_gachaInfo,
        {'uid': hall.user.uid},
        function (resp) {
            cb(JSON.parse(resp));
        });
};

//任务
hall.net.getTaskInfoList = function (cb) {
    qp.net.request(hall.net.cmds.hall_getTaskInfo,
        { uid: hall.user.uid },
        function (resp) {
            cb(resp);
        });
};
//商品列表
hall.net.goodlist = function (pageId,pageSize,cb) {
    qp.net.request(hall.net.cmds.hall_good_list,
        {
            uid: hall.user.uid,
            pageSize:pageSize,
            pageId:pageId,
            type:0
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};
//兑换商品
hall.net.add_order = function (goodId,goodNum,cb) {
    qp.net.request(hall.net.cmds.hall_add_order,
        {
            uid: hall.user.uid,
            goodId:goodId,
            goodNum:goodNum
        },
        function (resp) {
            cb(JSON.parse(resp),{
                uid: hall.user.uid,
                goodId:goodId,
                goodNum:goodNum
            });
        });
};
//兑换记录
hall.net.orderList = function (pageId,pageSize,cb) {
    qp.net.request(hall.net.cmds.hall_orderList,
        {
            uid: hall.user.uid,
            pageId:pageId,
            pageSize:pageSize,
            searchUID:hall.user.uid
        },
        function (resp) {
            cb(JSON.parse(resp));
        });
};

hall.net.sendPlayerEquip = function (itemId, cb) {
    qp.net.request(hall.net.cmds.hall_updatePlayerEquip,
        {
            uid: hall.user.uid,
            itemId: itemId
        },
        function (resp) {
            cb(resp);
        });
};
