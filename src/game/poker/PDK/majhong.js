
var PDKPoker = (function () {
    var _GameHong = GameImpl.extend({
        appId: 'com.qp.hall.pokerPDK',
        GameName: "paodekuai",
        GameValue: "跑得快",
        GameHandler:"pkRoomHandler",
        gameLocation: "dongbei",
        isMustShow: true,
        enter: function () {
            this.runGame(PDKGameLogic , PDKGameScene);
        },

        enterRecord: function (data) {
            this.runReGame(PDKGameLogic , PDKRecordLogic , PDKGameScene , data);
        },
        getCreateRoomItem:function () {
            var arr = [];
            if(PDKCreateRoomLayout)
            {
                var info = {};
                info['class'] = PDKCreateRoomLayout;
                info['url'] = [DDZCreateBtn.PDKBtn1,DDZCreateBtn.PDKBtn2,DDZCreateBtn.PDKBtn2];
                arr.push(info);
            }

            return arr;

        },

        getGameHelpItem:function () {
            var arr = [];
            if(PDKHelpItem)
            {
                var info = {};
                info['class'] = PDKHelpItem;
                info['url'] = [DDZCreateBtn.PDKBtn1,DDZCreateBtn.PDKBtn2,DDZCreateBtn.PDKBtn2];
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
