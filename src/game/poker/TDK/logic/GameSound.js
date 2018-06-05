var TDKSoundMgr = function () {

    /**
    * 音效配置表
    */
    var GameSfx = {
        AllIn: {
            url: ["allin.mp3"],
            loop: false,
        },
        QiJiao: {
            url: ["TI1.mp3"],
            loop: false,
        },
        BuTi: {
            url: ["BUTI1.mp3"],
            loop: false,
        },
        FanTi: {
            url: ["FANTI1.mp3"],
            loop: false,
        },
        Gen: {
            url: ["gen.mp3" , "GEN1.mp3"],
            loop: false,
        },
        Guo: {
            url: ["guo.mp3"],
            loop: false,
        },
        JiaZhu: {
            url: ["jia.mp3"],
            loop: false,
        },
        KaiP: {
            url: ["KAI1.mp3"],
            loop: false,
        },
        KouP: {
            url: ["KOU1.mp3"],
            loop: false,
        },

    };
    var _sound = {
        _path: "res/Game/Poker/TDK/Resoures/audio/",
        __proto__: sound,
        playConfigSound : function(cfgName, isMan) {
            var cfg = GameSfx[cfgName];
            
            if(!cfg) {
                return ;
            }
        
            var gender = null;
            if(typeof(isMan) === "boolean"){
                gender = isMan ? "M" : "F";    
            }
            
            soundIndex = soundIndex || 0;
            var min = 0;
            var max = Math.floor(cfg.url.length);
            var soundIndex = Math.floor(Math.random() * (max - min)) + min;
        
            var url = this.getGenderSoundFile(cfg.url[soundIndex], gender);
        
            this.playSound(url);
        
        },
        getGenderSoundFile : function(resUrl, gender) {
            var preFix = "";
            if (gender == undefined) {
                preFix = "";
            }
            else {
                preFix = gender === "M" ? "man" : "women";
            }
        
            return this._path + preFix + "/" + resUrl;
        },
        playChipIn: function () {
            if (!this.isEffectOn()) {
                return;
            }

            CCaudioEngine.playEffect(this._path + 'chip.mp3', false);

        },
        playRewardPour: function () {
            if (!this.isEffectOn()) {
                return;
            }

            CCaudioEngine.playEffect(this._path + 'chip_he.mp3', false);

        },

        playBigWin: function () {
            if (!this.isEffectOn()) {
                return;
            }

            CCaudioEngine.playEffect('res/PokerBRSSS/Resoures/sound/battle_cheer.mp3', false);
        },

        playDPCard: function () {
            var url = this._path + 'sendgamecard.mp3';
            this.playSound(url);
        },

        playReady: function () {
            var url = this._path + 'Ready.mp3';
            this.playSound(url);
        },
        playBgSound: function () {

            if (!this.isBgOn()) {
                return;
            }
            var randomNum = util.getCacheItem('backgroundmusic');
            if (randomNum != 2) {
                var bgStr = 'tdkbgm1.mp3';
            } else {
                var bgStr = 'tdkbgm2.mp3';
            }

            CCaudioEngine.playMusic(this._path + bgStr, true);
            if (!CCaudioEngine.isMusicPlaying()) {
                CCaudioEngine.playMusic(this._path + bgStr, true);
            }
        },

        playDBPokerMsg: function (soundData) {
            var sexType = soundData['userSex'];
            var index = soundData['index'];
            if (index == -1) {
                return;
            }
            if (!this.isEffectOn()) {
                return;
            }
            var str = '';
            var msgPath = '';
            if (sexType == 2) {
                sexType = 'girl';
            } else {
                sexType = 'boy';
            }
            var msgPath = "fix_msg_" + index;
            var path = 'res/Game/Poker/DDZ/Resoures/dbchat/' + sexType + '/' + msgPath + '.mp3';
            CCaudioEngine.playEffect(path, false);
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
    return reLogic;
}();