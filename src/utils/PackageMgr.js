var PackageMgr = (function () {

    var mgr = cc.Class.extend({
        
        ctor: function () {
            this._mAllGames     = {}; //被初始化过的所有游戏
            this._mustShowGames = {}; //必定可被使用的游戏 
            this._mUsedGameIDs  = []; //已经被玩家选定的游戏

            this.AllGameNames = {}; //所有游戏的名称 {重做一次映射}
            this.AllGameIDs = {};   //所有游戏的AppID {重做一次映射}
            
            var cacheUsed = util.getCacheItem("PKGMGR_USED_GAMES");
            if(cacheUsed){
                var t = JSON.parse(cacheUsed);
                if(t instanceof Array){
                    this._mUsedGameIDs = t;
                }
            }
        },
        /**
         * 添加游戏注册管理
         */
        registerGame: function (game, cb) {
            this._mAllGames[game.appId] = game;
            
            this.AllGameNames[game.GameName] = game.GameValue;
            this.AllGameIDs[game.GameName] = game.appId;

            if(game.isMustShow){
                this.appendMustGame(game);
            }
        },
        /**
         * 通过servertype 获取游戏显示的名称
         * @returns string 游戏名{中文}
         */
        getGameName: function (serverTypeName) {
            return this.AllGameNames[serverTypeName] || "";
        },
        /**
         * 通过servertype 获取游戏appid
         * @returns string appid
         */
        getGameAppID: function (serverTypeName) {
            return this.AllGameIDs[serverTypeName] || "";
        },
        /**
         * 检测一个游戏是否已经可用于创建使用
         * @param appId string 游戏id
         */
        isUsed: function (appId) {
            if(this._mUsedGameIDs.indexOf(appId) >= 0){
                return true;
            }
            return false;
        },
        /**
         * 游戏加载时 必定会被显示用于可创建的游戏
         */
        appendMustGame: function (game) {
            this._mustShowGames[game.appId] = game;
        },
        /**
         * 在创建房间中，管理删除一个游戏
         */
        removeUsedGameID: function (appId) {
            _.pull(this._mUsedGameIDs , appId);
            util.setCacheItem("PKGMGR_USED_GAMES" , JSON.stringify(this._mUsedGameIDs));
            qp.event.send('appPackageMgrRemove', appId );
        },
        /**
         * 在创建房间中，管理添加一个游戏
         */
        appendUsedGameID: function (appId) {
            if(this._mUsedGameIDs.indexOf(appId) >= 0){
                return;
            }
            this._mUsedGameIDs.push(appId);
            util.setCacheItem("PKGMGR_USED_GAMES" , JSON.stringify(this._mUsedGameIDs));
            qp.event.send('appPackageMgrAppend', appId , "append");
        },
        /**
         * 获取创建房间中 需要显示可创建的游戏ID
         * @returns [appID]
         */
        getCreateRoomCfg:function (pid) {
            var RoomList = {};
            var ItemClassList = [];
            for(var key in this._mustShowGames)
            {
                var appId = key;
                ItemClassList.push(appId);
            }

            _.forEach(this._mUsedGameIDs , function (appId) {
                ItemClassList.push(appId);
            });

            if (pid > 0) {
                return ItemClassList;
            }
            var apdInfo = {};
            apdInfo['class'] = WGApdGameMGView;
            apdInfo['url'] = [GameRes.WGAptRsBtn1_PNG, GameRes.WGAptRsBtn2_PNG, GameRes.WGAptRsBtn2_PNG];
            ItemClassList.push(apdInfo);
            
            return ItemClassList;
        },
        //获取Game 处于 管理中的
        //不需要显示 必须要处理的Game
        getGamesForMg: function () {
            var ret = [];
            for(var key in hall.gameEntries)
            {
               var game = hall.gameEntries[key];
               if(!this._mustShowGames[key]){
                ret.push(game);
               }
            }
            return ret;
        },

        /**
         * 获取帮助界面中 需要显示的游戏资源
         */
        getGameHelpCfg:function () {
            var RoomList = {};
            var ItemClassList = [];


            var xr = this.getCreateRoomCfg(1);
            _.forEach(xr , function (gameID) {
                var game = hall.gameEntries[gameID];
                var Item = game.getGameHelpItem();
                ItemClassList = ItemClassList.concat(Item);
            }.bind(this));
            

            return ItemClassList;
        },
    });
    return new mgr();
}());