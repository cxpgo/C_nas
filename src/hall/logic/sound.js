/**
 * Created by chenh on 16/5/26.
 */

var CCaudioEngine = cc.audioEngine;

var sound = {
    'male': 1,
    'female': 0,
    'putonghua': 'pt_',
    'changsha': 'fy_',
    soundOn: true,
    bgOn: true,
    soundLocation: 'common_',//普通话
    sexType: 'man',
    timeUpAlarm: null,

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

    playBgSound: function () {

        if (!this.isBgOn()) {
            return;
        }
        var randomNum = util.getCacheItem('backgroundmusic');
        var bgStr = 'res/audio/music/';
        if (randomNum != 2) {
            bgStr += 'dongbeibgm1.mp3';
        } else {
            bgStr += 'dongbeibgm2.mp3';
        }

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
        CCaudioEngine.playEffect('res/audio/effect/audio_button_click.mp3', false);
    },

    playPlayerEnter: function () {
        if (!this.isEffectOn()) {
            return;
        }
        CCaudioEngine.playEffect('res/audio/effect/audio_enter.mp3', false);
    },


    playReceiveGoldSound: function () {
        if (!this.isEffectOn()) {
            return;
        }
        CCaudioEngine.playEffect('res/audio/effect/goldAction.mp3', false);
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

}