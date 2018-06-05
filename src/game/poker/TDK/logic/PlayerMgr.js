var TDKPlayerMgr = function () {
    var pmg = cc.Class.extend({

        ctor: function () {
            this.mPlayers = {};
            this.mPCount = 0;
            this.mChipInFromPosCfgs = {};
        },

        add: function (player) {
            if(!player || !player.uid) return;

            if(player.player){
                player.position = player.player.position;
            }
            this.mPlayers[player.uid] = player;
            this.mPCount ++;
            qp.event.send("appPlayerEnter" , {});
        },

        getPlayers: function (){
            return this.mPlayers;
        },

        updatePlayer: function (info) {
            var uid = info.uid;
            var player = this.mPlayers[uid];
            if(!player){
                // cc.error("Error not find player uid:"+uid);
                this.add( info );
                return;
            }else{
                for (var key in info) {
                    if(key == "player" && player.player){
                        for (var pkey in info.player) {
                            player.player[pkey] = info.player[pkey];
                        }
                    }else{
                        player[key] = info[key];
                    }

                }
            }
        },
        getLocalPlayer: function () {
            var uid = hall.user.uid;
            return this.mPlayers[uid];
        },
        getLocalBasePlayer: function () {
            return this.getLocalPlayer().player;
        },
        getPlayer: function (uid) {
            if(!uid) return null;
            return this.mPlayers[uid];
        },
        removePlayer: function(uid){
            if(!uid) return;
            delete this.mPlayers[uid];
            this.mPCount --;
            qp.event.send("appPlayerExit" , {});
        },

        getLocalPosition : function() {
            var localPlayer = this.getLocalPlayer();

            return localPlayer ? localPlayer.position : -1;
        },
        /**
         * pIndex 处于视图的第几个位置
         */
        viewIndex2Chair : function(pIndex) {

            var localPos = this.getLocalPosition();
            var baseIndex = pIndex - localPos;
            
            if(baseIndex > 0){ //在右侧
                return 0 + baseIndex;
            }else{//在左侧
                return TDK_TABLE_TOTAL_PN + baseIndex;
            }
        },

        chair2ViewIndex : function (chair) {
            var localPos = this.getLocalPosition();

            var posIndex = (localPos + chair) % TDK_TABLE_TOTAL_PN
           
            return posIndex;
        },

        getBasePlayer: function (uid) {
            if(!uid) return;
            var player = this.mPlayers[uid];
            if(!player){
                JJLog.print("[PlayerMgr] gerBasePlayer Error! uid:" + uid + " not find!!");
                return;
            }
            return player.player;
        },

        
        getPlayerByPos: function (chair) {
            var baseChair = this.chair2ViewIndex(chair);

            for (var uid in this.mPlayers) {
                var player = this.mPlayers[uid];
                if(player.position == baseChair){
                    return player;
                }
            }
            return null;
        },

        getBasePlayerByPos: function (pos) {
            var player = this.getPlayerByPos(pos);
            if(!player) return null;
            return player.player;
        },

        getBankerPlayer: function () {
            var uid = XYGLogic.Instance.bankerUid;
            return this.getPlayer(uid);
        },
        getBankerBasePlayer: function () {
            var bankerPlayer = this.getBankerPlayer();
            return bankerPlayer ? bankerPlayer.player : null;
        },

        getChipInFromPos: function (uid) {
            return cc.p(38,600);
        },

    });

    /**
     * 创建
     * 释放
     * 实例访问
     */
    var instance = null;
    var create = function () {
        if (!instance) {
            instance = new pmg();
        }
        return instance;
    };

    var release = function () {
        if (instance) {
            instance = null;
        }
    };

    /**
     * 导出接口
     * 每个单例对象都要到处三个接口
     * 一个create、一个release、一个Instance
     */
    var reLogic = {
        create: create,
        release: release
    };

    Object.defineProperty(reLogic, "Instance", {
        get: function () {
            create();
            return instance;
        }
    });

    return reLogic;
}();


