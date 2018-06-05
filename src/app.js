AppCtrl = {
    inGameFirst: false,
    ResVersion: "1.0.0",
    RemoteCfg: {},
    TempSongShen: null,
    isHotInWhiteUser: false,
    onStart: function () {
        if (!cc.sys.isNative) {
           this.loadGame();
           return;
        }
        this.AsstesMgr = new AssetsManagerLoaderScene();
        this.AsstesMgr.show();
        
        this.Connect();
    },
    Connect: function () {
        var self = this;
        var _init = false;
        var readCount = 0;
        var _handlerID = null;
        var _sF = function () {
            JJLog.print("_handlerID:", _handlerID);
            if (_handlerID != null) {
                cc.clearInterval(_handlerID);
                _handlerID = null;
            }
            if (!_init) {
                self._start();
            }
            _init = true;
        };
        _handlerID = cc.setInterval(
            function () {
                readCount++;
                if (readCount == 6) {
                    _sF();
                    return;
                }
                if (readCount % 3 == 0) {
                    self.AsstesMgr.showTips("Network connection failure!!");
                }
                self._readRemoteCfg(_sF);
            },
            10 * 1000
        );
        self._readRemoteCfg(_sF);
    },

    _start: function () {
        for (var key in ServerCfg) {
            if (this.RemoteCfg[key]) {
                ServerCfg[key] = this.RemoteCfg[key];
            }
        }
        this._readHotInWhiteUser();

        //提审版本
        if (this._isAudit()) {
            JJLog.print("songshen banben");
            this.TempSongShen = 1;
            this.loadGame();
        }
        //非提审版本
        else {
            this.AsstesMgr.run();//热更检测
        }
    },

    loadGame: function () {
        cc.loader.loadJs(cc.game.config.jsList, function (err) {
            if (AppCtrl.TempSongShen) {
                hall.songshen = AppCtrl.TempSongShen;
            }
            cc.loader.load(cc.game.config.resList, function () {
                cc.director.runScene(new SangongLoginScene());
            });
        });
    },

    GetRemoteCfg: function () {
        return this.RemoteCfg;
    },
    //是否是提审版本
    _isAudit: function () {
        var os = cc.sys.os;
        var version = DeviceUtils.Version;

        var auditVersionKey = os + "_Audit";
        cc.log("[auditVersionKey] ", auditVersionKey);
        cc.log(this.RemoteCfg[auditVersionKey]);
        if (auditVersionKey && this.RemoteCfg[auditVersionKey] == version) {
            return true;
        }
        return false;
    },
    _readHotInWhiteUser: function () {
        var deviceId = DeviceUtils.DeviceId;
        var whiteUsers = this.RemoteCfg.WhiteUsers; //Array
        if(whiteUsers && (whiteUsers instanceof Array) ){ //&& whiteUsers.indexOf(deviceId)){
            for (var index = 0; index < whiteUsers.length; index++) {
                var element = whiteUsers[index];
                var userDID = "";
                var userDName = "User";

                var indT = element.indexOf("//");
                var lastIndT = element.indexOf("//");
                if(indT >= 0){
                    userDID = element.substr(0,indT);
                }
                if(lastIndT > 5 ){
                    userDName = element.substr(lastIndT+2,element.length - 1);
                }
                if(deviceId && "" != deviceId && userDID == deviceId){
                    this.isHotInWhiteUser = true;
                    JJLog.print("UserDName:" , userDName , "UserDID:" , userDID , " 在白名单配置中!!");
                    break;
                }    
            }
        }
    },

    _readRemoteCfg: function (handler) {
        var self = this;
        var url = "http://update.lekoy.com/ClientHot/YJDBQP/AppConfig.json" + "?version=" + Date.now();;
        // 创建请求
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    JJLog.print(xhr.responseText);
                    try {
                        var data = JSON.parse(xhr.responseText);
                        JJLog.print(data);
                        self.RemoteCfg = data || {};
                    } catch (error) {
                    }
                }
                if (handler) handler();
            }
        }.bind(this);
        xhr.send("");
    },
};
