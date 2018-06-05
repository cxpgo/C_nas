var DDZSound = function () {
    var CCaudioEngine = cc.audioEngine;

    var getRandomInt = function (max) {
        var min = 0;
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };
    /**
     * 音效配置表
     */
    var GameSfx = {
        order: {
            url: ["order0.mp3", "noorder.mp3"],
            sexcared: true,
        },

        grab: {
            url: ["order1.mp3", "order2.mp3", "order3.mp3"],
            sexcared: true,
        },

        no_grab: {
            url: ["norob.mp3"],
            sexcared: true,
        },
        calls: {
            url: ["fen_0.mp3", "fen_1.mp3", "fen_2.mp3", "fen_3.mp3"],
            sexcared: true,
        },
        double: {
            url: ["bujiabei.mp3", "jiabei.mp3"],
            sexcared: true,
        }
    };
    var _sound = {
        'male': 1,
        'female': 0,
        'putonghua': 'pt_',
        'changsha': 'fy_',
        soundOn: true,
        bgOn: true,
        soundLocation: 'common_',//普通话
        sexType: 'man',
        timeUpAlarm: null,
        _dani: null,
        __proto__: sound,
        stopBgSound: function () {
            CCaudioEngine.stopMusic();
        },

        stopEffect: function () {
            CCaudioEngine.stopAllEffects();
        },

        isBgOn: function () {
            var bgOn = util.getCacheItem('background_music');
            if (bgOn == 0) {
                return false;
            }

            return true
        },

        isEffectOn: function () {
            var effectOn = util.getCacheItem('sound_effect');
            if (effectOn == 0) {
                return false;
            }

            return true;
        },

        gameSoundQuiet: function () {
            cc.audioEngine.setMusicVolume(0);
            cc.audioEngine.setEffectsVolume(0);
        },

        gameSoundResume: function () {
            var soundVolume = util.getCacheItem('effect_volume');
            var musicVolume = util.getCacheItem('music_volume');
            if (musicVolume != null && musicVolume != "" && musicVolume != undefined) {
                cc.audioEngine.setMusicVolume(musicVolume);
            }

            if (soundVolume != null && soundVolume != "" && soundVolume != undefined) {
                cc.audioEngine.setEffectsVolume(soundVolume);
            }

        },

        playBgSound: function (type, bool) {
            if (!this.isBgOn()) {
                return;
            }
            var randomNum = util.getCacheItem('backgroundmusic');
            var bgStr = 'res/Game/Poker/DDZ/Resoures/audio/';

            if (randomNum != 2) {
                 bgStr += 'ddz_audio_Welcome.mp3';
            } else {
                 bgStr += 'ddz_audio_Welcome.mp3';
            }

            JJLog.print("!!!!!!!!!!!!!!!!!!!!!!", bgStr);
            CCaudioEngine.playMusic(bgStr, true);
            if (!CCaudioEngine.isMusicPlaying()) {
                CCaudioEngine.playMusic(bgStr, true);
            }
        },

        playGameSound: function (type, bool) {
            if (!this.isBgOn()) {
                return;
            }
            var randomNum = util.getCacheItem('ddzbackgroundmusic');
            var bgStr = 'res/Game/Poker/DDZ/Resoures/audio/';

            if (randomNum >= type && bool) return;
            util.setCacheItem('ddzbackgroundmusic', type);
            switch (type) {
                case 0:
                    bgStr += 'ddz_audio_Welcome.mp3';
                    break;
                case 1:
                    bgStr += 'ddz_audio_normal1.mp3';
                    break;
                case 2:
                    bgStr += 'ddz_audio_normal2.mp3';
                    break;
                case 3:
                    bgStr += 'ddz_audio_Exciting.mp3';
                    break;
            }
            JJLog.print("!!!!!!!!!!!!!!!!!!!!!!", bgStr);
            CCaudioEngine.playMusic(bgStr, true);
            if (!CCaudioEngine.isMusicPlaying()) {
                CCaudioEngine.playMusic(bgStr, true);
            }
        },

        playMusic: function (path) {
            if (!this.isBgOn()) {
                return;
            }
            CCaudioEngine.playMusic(path, false);
        },

        playSound: function (path) {
            if (!this.isEffectOn()) {
                return;
            }
            CCaudioEngine.playEffect(path, false);
        },

        playSelectCard: function () {
            if (!this.isEffectOn()) {
                return;
            }
            CCaudioEngine.playEffect('res/audio/effect/game_p_select_card.mp3', false);
        },

        playCardDown: function () {
            if (!this.isEffectOn()) {
                return;
            }
            CCaudioEngine.playEffect('res/audio/effect/game_p_discard.mp3', false);
        },

        playBtnSound: function () {
            if (!this.isEffectOn()) {
                return;
            }
            CCaudioEngine.playEffect('res/Game/Poker/DDZ/Resoures/audio/ddz_audio_button_click.mp3', false);
        },

        playPlayerEnter: function () {
            if (!this.isEffectOn()) {
                return;
            }
            CCaudioEngine.playEffect('res/audio/effect/audio_enter.mp3', false);
        },

        playTimeUpAlarm: function () {
            if (!this.isEffectOn()) {
                return;
            }
            //        this.timeUpAlarm = CCaudioEngine.playEffect('res/audio/effect/timeup_alarm.mp3',true);
        },

        stopTimeUpAlarm: function () {
            if (this.timeUpAlarm != null && this.timeUpAlarm != undefined) {
                CCaudioEngine.stopEffect(this.timeUpAlarm);
                this.timeUpAlarm = null;
            }

        },

        playPokerMsg: function (soundData) {
            var sexType = soundData['userSex'];
            var index = soundData['index'];
            if (index == -1) {
                return;
            }

            if (!this.isEffectOn()) {
                return;
            }

            // if (sexType == undefined || sexType == null || sexType == 1) {
            //     sexType = this.male;
            // } else {
            //     sexType = this.female;
            // }
            if (sexType == 2) {
                sexType = this.female;
            } else {
                sexType = this.male;
            }

            var msgPath = "fix_msg_" + index;
            var path = 'res/Game/Poker/DDZ/Resoures/pt_' + sexType + '/' + msgPath + '.mp3';
            CCaudioEngine.playEffect(path, false);
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

        playPokerCard: function (data, isDani) {
            if (!this.isEffectOn()) {
                return;
            }

            var sexType = data['sex'];
            var cardType = data['cardsType'].cardsType;
            var cards = data['cards'];
            // if (sexType == undefined || sexType == null || sexType == 1) {
            //     sexType = this.male;
            // } else {
            //     sexType = this.female;
            // }
            if (sexType == 2) {
                sexType = this.female;
            } else {
                sexType = this.male;
            }
            var sound = null;
            if (cards.length > 0) {
                var value = DDZCard_Rule.levelToValue(data['cardsType'].maxLevel);

                if (isDani || !XYGLogic.Instance.lastOpUid) {
                    switch (cardType) {
                        case DouDiZhuType.CT_SINGLE:
                            sound = '1_' + value;
                            break;
                        case DouDiZhuType.CT_DOUBLE:
                            sound = '2_' + value;
                            break;
                        case DouDiZhuType.CT_THREE:
                            sound = '3_' + value;
                            break;
                        case DouDiZhuType.CT_SINGLE_LINE:
                            sound = '1S_0';
                            break;
                        case DouDiZhuType.CT_DOUBLE_LINE:
                            sound = '2S_0';
                            break;

                        case DouDiZhuType.CT_THREE_LINE_TAKE_ONE:
                            sound = '3D1';
                            break;
                        case DouDiZhuType.CT_THREE_LINE_TAKE_TWO:
                            sound = '3D2';
                            break;

                        case DouDiZhuType.CT_FORE_LINE_TAKE_TWO:
                            // var len = cards.length - 4;
                            sound = '4D1';
                            break;
                        case DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE:
                            // var len = cards.length - 6;
                            sound = '4D2';
                            break;

                        case DouDiZhuType.CT_SIX_LINE_TAKE_FORE:
                            sound = 'FEIJI';
                            break;
                        case DouDiZhuType.CT_SIX_LINE_TAKE_SINGLE:
                            sound = 'FEIJI';
                            break;
                        case DouDiZhuType.CT_SIX_LINE_TAKE_DOUBLE:
                            sound = 'FEIJI';
                            break;

                        case DouDiZhuType.CT_BOMB:
                            sound = 'ZHADAN';
                            break;
                        case DouDiZhuType.CT_KING_BOMB:
                            sound = '2_14';
                            break;
                    }
                } else {

                    switch (cardType) {
                        case DouDiZhuType.CT_SINGLE:
                            sound = '1_' + value;
                            break;
                        case DouDiZhuType.CT_DOUBLE:
                            sound = '2_' + value;
                            break;
                        case DouDiZhuType.CT_THREE:
                            sound = '3_' + value;
                            break;
                        case DouDiZhuType.CT_SINGLE_LINE:
                        case DouDiZhuType.CT_DOUBLE_LINE:
                        case DouDiZhuType.CT_THREE_LINE_TAKE_ONE:
                        case DouDiZhuType.CT_THREE_LINE_TAKE_TWO:
                        case DouDiZhuType.CT_FORE_LINE_TAKE_TWO:
                        case DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE:
                        case DouDiZhuType.CT_SIX_LINE_TAKE_FORE:
                        case DouDiZhuType.CT_SIX_LINE_TAKE_SINGLE:
                        case DouDiZhuType.CT_SIX_LINE_TAKE_DOUBLE:
                            var _index = Math.floor(Math.random() * 3);
                            sound = 'dani' + _index;
                            break;

                        case DouDiZhuType.CT_BOMB:
                            sound = 'ZHADAN';
                            break;
                        case DouDiZhuType.CT_KING_BOMB:
                            sound = '2_14';
                            break;
                    }
                }
            } else {
                var _index = Math.floor(Math.random() * 4)
                sound = 'Pass_' + _index;
            }
            if(!sound) return;
            var path = 'res/Game/Poker/DDZ/Resoures/pt_' + sexType + '/' + sound + '.mp3';
            CCaudioEngine.playEffect(path, false);
        },

        playPokerCard2: function (data, isDani) {
            if (!this.isEffectOn()) {
                return;
            }

            var sexType = data['sex'];
            var cardType = data['cardsType'];
            var cards = data['cards'];
            // if (sexType == undefined || sexType == null || sexType == 1) {
            //     sexType = this.male;
            // } else {
            //     sexType = this.female;
            // }
            if (sexType == 2) {
                sexType = this.female;
            } else {
                sexType = this.male;
            }
            var sound = null;
            if (cards.length > 0) {
                var value = cards[0].value;

                if (isDani || !XYGLogic.Instance.lastOpUid) {
                    switch (cardType) {
                        case PuKeType.CT_SINGLE:
                            sound = '1_' + value;
                            break;
                        case PuKeType.CT_DOUBLE:
                            sound = '2_' + value;
                            break;
                        case PuKeType.CT_THREE:
                            sound = '3_' + value;
                            break;
                        case PuKeType.CT_SINGLE_LINE:
                            sound = '1S_0';
                            break;
                        case PuKeType.CT_DOUBLE_LINE:
                            sound = '2S_0';
                            break;
                        case PuKeType.CT_THREE_LINE_TAKE_ONE:
                            sound = '3D1';
                            break;
                        case PuKeType.CT_THREE_LINE_TAKE_TWO:
                            sound = '3D2_0';
                            break;
                        case PuKeType.CT_FORE_LINE_TAKE_THREE:
                            var len = cards.length - 4;
                            sound = '4D' + len + "_0";
                            break;
                        case PuKeType.CT_SIX_LINE_TAKE_FORE:
                            sound = 'FEIJI';
                            break;
                        case PuKeType.CT_BOMB:
                            sound = 'ZHADAN';
                            break;
                    }
                } else {

                    switch (cardType) {
                        case PuKeType.CT_SINGLE:
                            sound = '1_' + value;
                            break;
                        case PuKeType.CT_DOUBLE:
                            sound = '2_' + value;
                            break;
                        case PuKeType.CT_THREE:
                            sound = '3_' + value;
                            break;
                        case PuKeType.CT_SINGLE_LINE:
                        case PuKeType.CT_DOUBLE_LINE:
                        case PuKeType.CT_THREE_LINE_TAKE_ONE:
                        case PuKeType.CT_THREE_LINE_TAKE_TWO:
                        case PuKeType.CT_FORE_LINE_TAKE_THREE:
                        case PuKeType.CT_SIX_LINE_TAKE_FORE:
                            var _index = Math.floor(Math.random() * 3);
                            sound = 'dani' + _index;
                            break;

                        case PuKeType.CT_BOMB:
                            sound = 'ZHADAN';
                            break;
                        case PuKeType.CT_KING_BOMB:
                            sound = '2_14';
                            break;
                    }
                }
            } else {
                var _index = Math.floor(Math.random() * 4)
                sound = 'Pass_' + _index;
            }
            if(!sound) return;
            var path = 'res/Game/Poker/DDZ/Resoures/pt_' + sexType + '/' + sound + '.mp3';
            CCaudioEngine.playEffect(path, false);
        },

        playConfigSound: function (cfgName, soundIndex, user) {
            if (!this.isEffectOn()) {
                return;
            }
            var cfg = GameSfx[cfgName];

            if (!cfg) {
                return;
            }

            var sfxPh = "";
            if (cfg.sexcared) { //如果需要区分男女
                user = user || hall.user;
                var sexType = user && user.userSex;

                if (sexType == 2) {
                    sexType = this.female;
                } else {
                    sexType = this.male;
                }
                sfxPh = "pt_" + sexType
            }

            soundIndex = soundIndex || 0;
            soundIndex = Math.max(soundIndex, 0);
            soundIndex = Math.min(soundIndex, cfg.url.length - 1);

            var msgPath = cfg.url[soundIndex];
            var path = 'res/Game/Poker/DDZ/Resoures/' + sfxPh + '/' + msgPath;
            CCaudioEngine.playEffect(path, false);
        },

        /**
         * 播放叫地主音效
         */
        PlayOrderSound: function (user, order) {
            this.playConfigSound("order", order ? 0 : 1, user);
        },

        /**
         * 播放抢地主音效
         */
        PlayGrabSound: function (user, grab) {
            if (grab) {
                var soundIndex = getRandomInt(GameSfx.grab.url.length);
                this.playConfigSound("grab", soundIndex, user);
            }
            else {
                this.playConfigSound("no_grab", 0, user);
            }
        },
        PlaycallsSound: function (user, order) {
            this.playConfigSound("calls", order, user);
        },
        PlayDoubleSound: function (user, isDouble) {
            this.playConfigSound("double", isDouble, user);
        },

        /**
         * 播放单局结算音效
         *  @param type Boolean
         *  true 胜利 false 失败
         */
        playRoundMusic: function (type) {
            if (type) {
                CCaudioEngine.playMusic("res/Game/Poker/DDZ/Resoures/audio/ddz_audio_win.mp3", false);
            } else {
                CCaudioEngine.playMusic("res/Game/Poker/DDZ/Resoures/audio/ddz_audio_lose.mp3", false);
            }
        },
        playCardClick: function () {
            this.playSound("res/Game/Poker/DDZ/Resoures/audio/ddz_audio_card_click.mp3")
        },

        playBaojingSound: function () {
            var path = 'res/Game/Poker/DDZ/Resoures/audio/ddz_audio_alert.mp3';
            CCaudioEngine.playEffect(path, false);
        },
        playPokerCardDown: function () {
            var path = 'res/Game/Poker/DDZ/Resoures/audio/ddz_audio_card_down.mp3';
            CCaudioEngine.playEffect(path, false);
        },
        playSendCardSound: function () {
            var path = 'res/Game/Poker/DDZ/Resoures/audio/ddz_audio_card_send.mp3';
            CCaudioEngine.playEffect(path, false);
        }
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
