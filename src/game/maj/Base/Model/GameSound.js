var MJSoundMgr = function () {
    var originCfgPath = "res/Game/Maj/Base/Resoures/";
    /**
    * 音效配置表
    */
    var GameSfx = {

    };
    var _sound = {
        _cfgPaths: [originCfgPath],
        __proto__: sound,

        _pushCfgPath: function (path) {
            var tPhs = [].concat(path);
            for (var index = 0; index < tPhs.length; index++) {
                var p = tPhs[index];
                if (this._cfgPaths.indexOf(p) >= 0) {
                    return;
                }
            }
            this._cfgPaths = [].concat(path).concat(this._cfgPaths);
        },
        resetCfgPath: function () {
            this._cfgPaths = [originCfgPath];
        },
        _playForCfgPaths: function (file) {
            var path = null;
            for (var index = 0; index < this._cfgPaths.length; index++) {
                var tP = this._cfgPaths[index] + file;
                if (util.isFileExist(tP)) {
                    path = tP;
                    break;
                }
            }
            if (path) {
                CCaudioEngine.playEffect(path, false);
            }
        },

        playOption: function (optionData) {
            var sexType = optionData['userSex'];
            var optionType = optionData['optionType'];

            if (!this.isEffectOn()) {
                return;
            }

            var location = util.getCacheItem('location');
            if (location == undefined || location == null || location == 0 || location == 1) {
                location = this.putonghua;
            } else {
                location = this.changsha;
            }

            if (sexType == undefined || sexType == null || sexType == 2) {
                sexType = this.female;
            } else {
                sexType = this.male;
            }


            switch (optionType) {
                case OPERATIONNAME.CHI: {
                    optionType = 'chi';
                }
                    break;
                case OPERATIONNAME.GANG: {
                    optionType = 'gang';
                }
                    break;
                case OPERATIONNAME.GUO: {
                    return;
                }
                    break;
                case OPERATIONNAME.BUZHANG: {
                    optionType = 'gang';
                }
                    break;
                case OPERATIONNAME.PENG: {
                    // var x = Math.random();
                    // var randomNum = Math.ceil(2 * x);
                    // JJLog.print('xx = ' + x);
                    // optionType = 'peng' + randomNum;
                    optionType = 'peng';
                }
                    break;
                // case OPERATIONNAME.HU: {
                //     var x = Math.random();
                //     var randomNum = Math.ceil(2 * x);
                //     JJLog.print('xx = ' + x);
                //     optionType = 'hu' + randomNum;
                // }
                //     break;
                case OPERATIONNAME.Gebailao: {
                    var x = Math.random();
                    var randomNum = Math.ceil(2 * x);
                    JJLog.print('xx = ' + x);
                    optionType = 'peng' + randomNum;
                }
                    break;

            }
            var file = location + sexType + '/' + optionType + '.mp3';

            this._playForCfgPaths(file, false);
        },

        //自摸 || 胡牌
        playzimo_hu: function (soundData) {
            var sexType = soundData['userSex'];
            var uid = soundData['uid'];
            var ziMo = soundData['ziMo'];

            if (!this.isEffectOn()) {
                return;
            }
            var location = util.getCacheItem('location');
            if (location == undefined || location == null || location == 0 || location == 1) {
                location = this.putonghua;
            } else {
                location = this.changsha;
            }
            if (sexType == undefined || sexType == null || sexType == 2) {
                sexType = this.female;
            } else {
                sexType = this.male;
            }
            if(ziMo)
            {
                var x = Math.random();
                var randomNum = Math.ceil(3 * x);
                var optionType = 'zimo' + randomNum;
            }
            else
            {
                var x = Math.random();
                var randomNum = Math.ceil(2 * x);
                var optionType = 'hu' + randomNum;
            }
            var file = location + sexType + '/' + optionType + '.mp3';
            this._playForCfgPaths(file, false);
        },

        playCard: function (data) {
            var sexType = data['userSex'];
            var cardType = data['cardType'];

            if (!this.isEffectOn()) {
                return;
            }

            var location = util.getCacheItem('location');
            if (location == undefined || location == null || location == 0 || location == 1) {
                location = this.putonghua;
            } else {
                location = this.changsha;
            }

            if (sexType == undefined || sexType == null || sexType == 2) {
                sexType = this.female;
            } else {
                sexType = this.male;
            }

            // var path = 'res/Game/Maj/Base/Resoures/' + location + sexType + '/' + cardType + '.mp3';
            // CCaudioEngine.playEffect(path, false);
            var file = location + sexType + '/' + cardType + '.mp3';
            this._playForCfgPaths(file, false);
        },


        playHuTypeSound: function (soundData) {
            var sexType = soundData['userSex'];
            var huType = soundData['huType'];
            var dt = soundData['dt'];

            if (huType == -1) {
                return;
            }

            if (!this.isEffectOn()) {
                return;
            }

            var location = util.getCacheItem('location');
            if (location == undefined || location == null || location == 0 || location == 1) {
                location = this.putonghua;
            } else {
                location = this.changsha;
            }

            if (sexType == undefined || sexType == null || sexType == 2) {
                sexType = this.female;
            } else {
                sexType = this.male;
            }
            var DaHuSound = XYGLogic.Instance.getMJHuTSound();
            if(DaHuSound){
                var fHu = DaHuSound[huType];
                var file = location + sexType + '/' + fHu;
                this._playForCfgPaths(file, false);
            }            
        },

        playMsg: function (soundData) {
            var sexType = soundData['userSex'];
            var index = soundData['index'];
            if (index == -1) {
                return;
            }

            if (!this.isEffectOn()) {
                return;
            }

            var location = util.getCacheItem('location');
            if (location == undefined || location == null || location == 0 || location == 1) {
                location = this.putonghua;
            } else {
                location = this.changsha;
            }

            if (sexType == undefined || sexType == null || sexType == 2) {
                sexType = 'girl';
            } else {
                sexType = 'boy';
            }
            var msgPath = "fix_msg_" + index;
            var file = 'dbchat/' + sexType + '/' + msgPath + '.mp3';
            this._playForCfgPaths(file, false);
        },
    };

    /**
     * 创建
     * 释放
     * 实例访问
     */
    var instance = null;
    var create = function () {
        if (!instance) {
            instance = sound;
            sound = _sound;
        }
        return sound;
    };

    var release = function () {
        if (instance) {
            sound = instance;
            _sound.resetCfgPath();
            instance = null;
        }
    };

    /**
    * 有需要调用的
    * 将需要检测的路径添加进来
    * @param path string or array
    */
    var RegistMJAudioPath = function (path) {
        _sound._pushCfgPath(path);
    };
    /**
     * 导出接口
     * 每个单例对象都要到处三个接口
     * 一个create、一个release、一个Instance
     */
    var reLogic = {
        create: create,
        release: release,
        RegistMJAudioPath: RegistMJAudioPath,
    };
    return reLogic;
}();