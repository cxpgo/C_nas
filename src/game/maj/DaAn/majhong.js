MJDaAn.Game = (function () {
	var _GameHong = GameImpl.extend(MJDaAn).extend({
		appId: 'com.qp.hall.daan',
		GameName: "daan",
        GameValue: "大安麻将",
		GameHandler:"mjRoomHandler",
        gameLocation: "dongbei",
		enter: function () {
            this.runGame(MJDaAnLogic , MJDaAn.GameScene);
		},

		enterRecord: function (data) {
            this.runReGame(MJDaAnLogic , MJDaAnRecordLogic , MJDaAn.GameScene , data);
		},

		getCreateRoomItem:function () {
            if(MJDaAn.WGCreateRoom)
            {
                var info = {};
                info['class'] = MJDaAn.WGCreateRoom;
                info['url'] = [
					this.RESPath+'Resoures/create_room/daanmajiang.png',
                    this.RESPath+'Resoures/create_room/daanmajiang2.png',
					this.RESPath+'Resoures/create_room/daanmajiang2.png'
				]
                return info;
            }
        },

        getGameHelpItem:function () {
            var arr = [];
            if(DAHelpItem)
            {
                var info = {};
                info['class'] = DAHelpItem;
                info['url'] = [
                    this.RESPath+'Resoures/create_room/daanmajiang.png',
                    this.RESPath+'Resoures/create_room/daanmajiang2.png',
                    this.RESPath+'Resoures/create_room/daanmajiang2.png'
                ]
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

