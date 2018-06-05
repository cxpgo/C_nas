
var TDKPoker = (function () {
    var _GameHong = GameImpl.extend({
        appId: 'com.qp.hall.tiandakeng',
        GameName: "tiandakeng",
        GameValue: "填大坑",
		GameHandler:"pkRoomHandler",
        gameLocation: "dongbei",
        isMustShow: true,
        enter: function () {
            this.runGame(TDKGameLogic , TDKRoom);
        },

        getSetUpPlugin: function (context, args) {
            var pluginView = new TDKSetupPlugIn(context, args[0]);
            return pluginView;
        },

        getCreateRoomItem:function () {
            var arr = [];
            if(TDKCreateRoomItem)
            {
                var info = {};
                info['class'] = TDKCreateRoomItem;
                info['url'] = [TDKCreateBtn.TDKBtn1, TDKCreateBtn.TDKBtn2, TDKCreateBtn.TDKBtn2];
                arr.push(info);
            }
            return arr;
        },

        getGameHelpItem:function () {
            var arr = [];
            if(TDKHelpItem)
            {
                var info = {};
                info['class'] = TDKHelpItem;
                info['url'] = [TDKCreateBtn.TDKBtn1, TDKCreateBtn.TDKBtn2, TDKCreateBtn.TDKBtn2];
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

