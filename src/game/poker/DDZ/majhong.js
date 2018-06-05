
var DDZPoker = (function () {
    var _GameHong = GameImpl.extend({
        appId: 'com.qp.hall.pokerDDZ',
        GameName: "doudizhu",
        GameValue: "斗地主",
		GameHandler:"pkRoomHandler",
        gameLocation: "dongbei",
        isMustShow: true,
        enter: function (type) {
            //-1 金币场
            if (type == -1) {
                this.runGame(DDZGameLogic , DDZGoldGameScene);
            } else {
                this.runGame(DDZGameLogic , DDZGameScene);
            }
        },

        enterRecord: function (data) {
            this.runReGame(DDZGameLogic , DDZRecordLogic , DDZGameScene , data);
        },

        getCreateRoomItem:function () {
            var arr = [];
             if(DDZCreateRoomLayout)
             {
                 var info = {};
                 info['class'] = DDZCreateRoomLayout;
                 info['url'] = [DDZCreateBtn.DDZBtn1,DDZCreateBtn.DDZBtn2,DDZCreateBtn.DDZBtn2];
                 arr.push(info);
             }
            return arr;
        },

        getGameHelpItem:function () {
            var arr = [];
            if(DDZHelpItem)
            {
                var info = {};
                info['class'] = DDZHelpItem;
                info['url'] = [DDZCreateBtn.DDZBtn1,DDZCreateBtn.DDZBtn2,DDZCreateBtn.DDZBtn2];
                arr.push(info);
            }
            return arr;
        },

        getChatCfg: function (sexType) {
            var CHAT_USUALMSG = {
                0:[
                    '诶，你要耽误人家约会了',
                    '哈哈真爽，太过瘾了',
                    '拜托,有你这样玩牌的吗?',
                    '哈哈,没了吧!',
                    '小树不修不直溜,人不修理哏赳赳',
                    '小样啊,你给我等着',
                ],
                1:[
                    '你是哪个单位的,出牌这么慢',
                    '这牌打得真精彩呀',
                    '你这牌打得太让人无语了',
                    '哈哈,没了吧!',
                    '小树不修不直溜,人不修理哏赳赳',
                    '唉呀,走着瞧',
                ]
            };
            if (this.gameLocation == "dongbei") {
                if (sexType == undefined || sexType == null || sexType == 2) {
                    sexType = 0;
                } else {
                    sexType = 1;
                }
                this.CHAT_USUALMSG = CHAT_USUALMSG[sexType];
            }
            return Chatmsg_Cfg;
        },
    });
    var _Game_ = new _GameHong();
    hall.registerGame(_Game_);
    return _Game_;
})();
