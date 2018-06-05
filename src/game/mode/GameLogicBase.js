var GameLogicBase = function () {
    var _GameStatus = null;
    var logic = cc.Class.extend({
        ctor: function (gameStatusCfg) {
            _GameStatus = gameStatusCfg;
            this.seatArray = new Array(4);//座位上的玩家数据
            this.selfPos = 0;
            this.selfInfo = null;     //当前自己数据
            this.tableId = 0;
            this.status = 0;
            this.tableModel = 0;
            this.person = 0;
            this.inited = false;      //是否初始化过
            this.JinPaiId = null;
            this.isOffline = false;
            this.offLineInfo = {};
    
            this._mTableData = {};
            this.getReady = {};
            this.lastOpUid = null;
            this.report = null; //总结算数据
            Object.defineProperties(this, {
                "Data": {
                    get: function () {
                        return this._mTableData;
                    }
                },
            });
        },
    
        initialize: function () {
            this.registerAllEvents();
        },
    
        release: function () {
            this.removeAllEvents();
            // this.cleanSpriteFrames();
        },
    
        registerAllEvents: function () {
            qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
            qp.event.listen(this, 'mjPlayerEnter', this.onPlayerEnter.bind(this));
            qp.event.listen(this, 'mjPlayerLeave', this.onPlayerExit.bind(this));
            qp.event.listen(this, 'mjLocalPosition', this.onHallLocalPosition.bind(this));
            
            qp.event.listen(this, 'mjThrowStatus', this.onGamethorw.bind(this));
            qp.event.listen(this, 'pkSyncTableStatus', this.onTableStatus.bind(this));
    
            qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
            qp.event.listen(this, 'mjGameOver', this.onGameOver);
            qp.event.listen(this, 'mjGameResult', this.onGameResult);
        },
    
        removeAllEvents: function () {
            qp.event.stop(this, 'mjGameStart');
            qp.event.stop(this, 'mjPlayerEnter');
            qp.event.stop(this, 'mjPlayerLeave');
            qp.event.stop(this, 'mjLocalPosition');
    
            qp.event.stop(this, 'mjThrowStatus');
            qp.event.stop(this, 'pkSyncTableStatus');
    
            qp.event.stop(this, 'mjDissolutionTable');
            qp.event.stop(this, 'mjGameOver');
            qp.event.stop(this, 'mjGameResult');
        },
    
        initSeatInfo: function (data) {
            this._mTableData = data.tableStatus;
            this.tableId = data.tableStatus['tableId'];
            this.status = data.tableStatus['tableStatus'];
            this.tableModel = data["tableType"];
            this.person = data.tableStatus['person'];
    
            if (data['tableStatus']['isOffline'] == 1) {
                this.isOffline = true;
            }
    
            this._initPlayers(data);
    
            this._checkDissolution(data);
    
            qp.event.send('appGameBaseInfo', data);
            qp.event.send('appGameRoomInfo', {});
            
            this.inited = true;
    
        },

        _initPlayers: function (data) {
            var playerDataArray = data["tableStatus"]["players"];
            for (var i = 0; i < playerDataArray.length; i++) {
                var info = playerDataArray[i]["player"];
                info['isOffLine'] = playerDataArray[i]['isOffLine'];
                info['coinNum'] = playerDataArray[i]['coinNum'];
                var id = info["uid"];
                var pos = info["position"];
                this.seatArray[pos] = info;
                if (id == hall.user.uid) {
                    this.selfPos = pos;
                    this.selfInfo = this.seatArray[pos];
                }
            }
        },
        
        exitGame: function () {
            //如果游戏没有开始 并且 游戏处于第一轮
            if (this.status <= _GameStatus.INITTABLE && this.Data.currRounds <= 1) {
                if (XYGLogic.Instance.Data.fangZhu != hall.user.uid ||
                    (XYGLogic.Instance.isRePrivateTable != null && XYGLogic.Instance.isRePrivateTable != undefined && XYGLogic.Instance.isRePrivateTable == 1)) {
                    this.leavePrivateTable(0);
                } else {
                    this.showDissolveTip();
                }
            }
            else {
                var dialog = new JJMajhongDecideDialog();
                dialog.setDes('游戏正在进行， 确定要发起解散吗?');
                dialog.showDialog();
                dialog.setCallback(function () {
                    hall.getPlayingGame().net.dissolveSeat(1, function (data) {
                    }.bind(this));
                });
            }
        },
    
        leavePrivateTable:function (states) {
            this.report = null;
            var self = this;
            XYGLogic.Net.leavePrivateTable(states,
                function (data) {
                    if (data['code'] == 200) {
                        self.onPlayerExit({uid : hall.user.uid});
                    }
                    else {
                        if (data['err'] != undefined && data['err'] != null) {
                            var dialog = new JJConfirmDialog();
                            dialog.setDes(data['err']);
                            dialog.showDialog();
                        }
                    }
                }
            );
        },
        //玩家准备离开时 交互提示操作
        showDissolveTip: function() {
            sound.playBtnSound();
            var dialog = new JJMajhongDecideDialog();
            if (hall.songshen == 1) {
                dialog.setDes('您未开始一局游戏,是否解散?');
            } else {
                dialog.setDes('您未开始一局游戏,解散房间不扣钻石,是否解散?');
            }
            dialog.showDialog();
            dialog.setCallback(function () {
                this.leavePrivateTable(0)
            }.bind(this));
        },
    

        _checkDissolution: function (data) {
            //解散房间
            if (data['tableStatus']['dissolutionTable'] != -1 
                && data['tableStatus']['dissolutionTable']['result'] != 1) {
                
                    var disarr = data['tableStatus']['dissolutionTable']['disArr'];
                var isDisarr = true;
                var disUid = {};
                for (var k = 0; k < disarr.length; k++) {
                    if (k == 0) {
                        disUid['uid'] = disarr[k];
                    }
                    if (hall.user.uid == disarr[k]) {
                        isDisarr = false;
                    }
                }
    
                if (isDisarr) {
                    var option = new DissloveOptionDialog(disUid);
                    option.showDialog();
                } else {
                    var option = new DissloveResultDialog(data['tableStatus']['dissolutionTable']);
                    option.showDialog();
                }
            }
        },
        /**
         * 游戏中 有使用Plist 预加载plist 并记录 添加的文件
         */
        addSpriteFrames: function (plistPath) {
            this._mCacheAddFrameKeys = this._mCacheAddFrameKeys || {};
            if(this._mCacheAddFrameKeys[plistPath]){
                return;
            }
            this._mCacheAddFrameKeys[plistPath] = plistPath;

            cc.spriteFrameCache.addSpriteFrames(plistPath);
        },
        /**
         * 游戏中 对预加载的plist 进行删除
         */
        removeSpriteFrames: function (plistPath){
            if(!this._mCacheAddFrameKeys || !this._mCacheAddFrameKeys[plistPath]){
                return;
            }
            delete this._mCacheAddFrameKeys[plistPath];
            cc.spriteFrameCache.removeSpriteFramesFromFile(plistPath);
        },
         /**
         * 游戏结束时清理所有被加载过的plist
         */
        cleanSpriteFrames: function(){
            if(!this._mCacheAddFrameKeys){
                return;
            }
            delete this._mCacheAddFrameKeys[plistPath];
            for (var plistPath in this._mCacheAddFrameKeys) {
                this.removeSpriteFrames(plistPath);
            }
        },

        //检测是否是某些状态
        //@statusKey -- SEATING,WATING ... 一般会在游戏Commonjs先配置
        //@betweenKey 如果betWeenKey存在 那么 就会返回 是否在 statusKey -> bewWeenkey之间
        isTheStatus: function (statusKey , betweenKey) {
            var flag = false;
            if(statusKey ){
                if(!betweenKey){
                    flag = _GameStatus[statusKey] == this.status;
                }else{
                    flag = (_GameStatus[statusKey] <= this.status && _GameStatus[betweenKey] >= this.status);
                }
            }
            return flag;
        },
        //====================================
        //==游戏状态监听操作
        //====================================
        onGameStart: function (data) {
            this.JinPaiId = null;
            this.isOffline = false;
            this.offLineInfo = {};
            this.currentRound = data['currRounds'];
            this.bankerId = data["banker"];
        },
        //定位变化
        onHallLocalPosition: function (data) {
            JJLog.print(data);
            if (this.seatArray != null) {
                for (var i = 0; i < this.seatArray.length; i++) {
                    var info = this.seatArray[i];
                    if (info != null && info != undefined) {
                        var id = info["uid"];
                        if (id == data.uid) {
                            this.seatArray[i]["nav"] = data["nav"];
                            break;
                        }
                    }
    
                }
            }
        },
        //玩家进入
        onPlayerEnter:function(data){
            JJLog.print(data);
        },
        //玩家离开
        onPlayerExit:function(data){
            JJLog.print(data);
        },
    
        onTableStatus: function (jtable) {
            var status = jtable.tableStatus;
            this.Data.tableStatus = status;
            this.status = status;
        },

        onGamethorw: function (data) {
            console.error("!!!!!!!!!!!!!!!!!!!!!!!", data)
            var throwType = data['throwType'];
            if (throwType != 0) {
                XYGLogic.Instance.addSpriteFrames("res/Animation/throwThing.plist");
                var target = data['targetUid'];
                var uid = data['uid'];
                var startPos = cc.p(0, 0);
                var endPos = cc.p(0, 0);
                var off = cc.p(50, 80);
    
                var self = { x: 30, y: 35 };
                var left = { x: 50, y: 500 };
                var right = { x: 1150, y: 500 };
    
                startPos = XYGLogic.Instance.getSeatHeadStartPos(uid);
                endPos = XYGLogic.Instance.getSeatHeadEndPos(target);
                if (THROWTHINGTYPE[throwType] != null && THROWTHINGTYPE[throwType] != undefined) {
                    var img = new ccui.ImageView(THROWTHINGTYPE[throwType] + "_0.png", ccui.Widget.PLIST_TEXTURE);
                    img.setPosition(cc.pAdd(off, startPos));
                    cc.director.getRunningScene().addChild(img, 100);
                    img.runAction(cc.sequence(cc.moveTo(0.3, cc.pAdd(off, endPos)), cc.callFunc(function () {
                        var ani = new cc.Sprite('#' + THROWTHINGTYPE[throwType] + "_1.png");
                        ani.setScale(2);
                        cc.director.getRunningScene().addChild(ani, 100);
                        ani.setPosition(cc.pAdd(off, endPos));
                        var animFrames = [];
                        for (var j = 0; j < THROWTHINGPNGLEGTH[throwType]; j++) {
                            var str = THROWTHINGTYPE[throwType] + "_" + j + ".png";
                            var frame = cc.spriteFrameCache.getSpriteFrame(str);
                            animFrames.push(frame);
                        }
                        var bomb = new cc.Animation(animFrames, 0.06);
                        sound.playSound("res/audio/effect/" + THROWTHINGTYPE[throwType] + ".mp3", false);
                        ani.runAction(cc.sequence(cc.animate(bomb), cc.removeSelf()));
                    }.bind(this)), cc.removeSelf()));
                }
            }
        },
    
        onGameResult: function (data) {
            XYGLogic.Instance.result = data;
            XYGLogic.Instance.Data.currRounds += 1;
            //刘局了直接弹出结算
            //其他情况下  会在 播放完 胡牌动画后 自动弹出结算
            if (data['roundResult'] == 0) {
                var img = new ccui.ImageView(MJBaseRes.LiuJu, ccui.Widget.LOCAL_TEXTURE);
                img.setPosition(cc.p(640,360));
                img.runAction(cc.sequence(cc.scaleTo(1, 2),
                    cc.scaleTo(2, 1),
                    cc.delayTime(2),
                    cc.callFunc(function(){
                        this.showRoundResult();
                    }.bind(this)),
                    cc.removeSelf())
                );
                cc.director.getRunningScene().addChild(img, 100);
            }
        },
    
        onGameOver: function (data) {
            JJLog.print('GameOver Response -- -- -- -- ' + JSON.stringify(data));
            XYGLogic.Instance.report = data;
            if (XYGLogic.Instance.result && XYGLogic.Instance.result["isOver"] == 1) {
                return;
            }
            var tip = new JJConfirmDialog();
            var str = '经玩家 ';
            for (var i = 0; i < data['players'].length; i++) {
                str += ('【' + base64.decode(data['players'][i]['nickName']) + '】');
            }
            str += ('同意,房间解散成功!');
            tip.setDes(str);
            tip.setCallback(function () {
                XYGLogic.Instance.showEndResult();
            }.bind(this));
            tip.showDialog();
        },
    
        onDissolutionTable: function (data) {
            if (data['result'] == 0)//0拒绝解散
            {
                var tip = new JJConfirmDialog();
                var nickName = base64.decode(XYGLogic.Instance.uidOfInfo(data['uid'])["nickName"]);
                tip.setDes('玩家' + '【' + nickName + '】' + '拒绝解散房间,解散房间失败！');
                tip.setCallback(function () {
                    JJLog.print('this is test callback');
                });
                tip.showDialog();
            } else if (data['result'] == 1)//1解散成功
            {
    
            } else if (data['result'] == -1) {
                if (data['status'] == 1) {
                    if (data['uid'] == hall.user.uid) {
                        var result = new DissloveResultDialog(data);
                        result.showDialog();
                    } else {
                        var option = new DissloveOptionDialog(data);
                        option.showDialog();
                    }
                }
            }
        },
        //====================================
        //==数据获取
        //====================================
        getAllPlayerInfo: function () {
            var seatArray = [];
            for (var i = 0; i < this.seatArray.length; i++) {
                if (this.seatArray[i]) {
                    seatArray.push(this.seatArray[i]);
                }
            }
            return seatArray;
        },
    
        getTablePerson:function () {
            return this.person;
        },
    
    
        getCardByPlayer: function (uid) {
    
            var playerDataArray = this.Data["players"];
    
            for(var i = 0;i<playerDataArray.length;i++){
                if(playerDataArray[i]['uid'] == uid)
                {
                    var info = playerDataArray[i];
                    return info;
                }
            }
    
            return null;
        },
    
        seatPosInfo: function (pos) {
            if(this.seatArray[pos] == undefined)
            {
                return null;
            }
            return this.seatArray[pos];
        },
    
        setSeatPosInfo: function (data) {
            this.seatArray[data["position"]] = data;
        },
    
        uidOfInfo: function (uid) {
            for(var p in this.seatArray){
                if(uid == this.seatArray[p]['uid']) {
                    return this.seatArray[p];
                }
            }
            return null;
        },
    
        selfSeatInfo: function () {
            return this.selfInfo;
        },
    
    
        //====================================
        //==服务器交互
        //====================================
        reqBaseInfo: function () {
            var self = this;
            XYGLogic.net.init(function (reps) {
                if (reps.code == 200) {
                    self.initSeatInfo(reps);
    
                    if(XYGLogic.net.updateLocalPosition)
                        XYGLogic.net.updateLocalPosition();
                }
            });
        },
        //玩家准备
        ready: function (cb) {
            XYGLogic.net.ready(1, cb);
        },
        //人不满开桌
        lessPersonStart: function (cb) {
            XYGLogic.net.lessPersonStart(cb);
        },
        //语音聊天
        chat: function (msg, isEmoj, cb) {
            JJLog.print("chat:");
            XYGLogic.net.chat(msg, isEmoj, cb);
        },
        //动态表情发送
        throw: function(objectId, cb) {
            JJLog.print("throw:");
            XYGLogic.net.throw(objectId, cb);
        },
        //添加机器人
        addRobot: function (jadd) {
            XYGLogic.net.addRobot(jadd, function (data) {});
        },
    
        // GM发牌
        GMOp: function (uid, op, cb) {
            XYGLogic.net.GMOp(uid, op, cb);
        },
    
        // GM下一轮去拍
        gmCommand: function (card) {
            XYGLogic.net.gmCommand(card);
        },

        //====================================
        //Override
        //====================================
        showRoundResult: function () {},
        showEndResult: function () {},
        
    });
    return logic;    
}();