var MJChangChun = (function () {
	var _GameHong = GameImpl.extend(MJChangChunInitC).extend({
		appId			: 	'com.qp.hall.changchun',
		GameName		: 	"changchun",
        GameValue		: 	"长春麻将",
		GameHandler		:	"mjRoomHandler",
        gameLocation: "dongbei",
		enter: function () {
            this.runGame(this.Logic , this.GameScene);
		},

		enterRecord: function (data) {
            this.runReGame(this.Logic , this.RecordLogic , this.GameScene , data);
		},

		getCreateRoomItem:function () {
            if(this.WGCreateRoom)
            {
                var info = {};
                info['class'] = this.WGCreateRoom;
                info['url'] = [
					this.RESPath+'Resoures/create_room/changchunmajiang.png',
                    this.RESPath+'Resoures/create_room/changchunmajiang2.png',
					this.RESPath+'Resoures/create_room/changchunmajiang2.png'
				]
                return info;
            }
        },

        getGameHelpItem:function () {
            var arr = [];
            if(CCHelpItem)
            {
                var info = {};
                info['class'] = CCHelpItem;
                info['url'] = [
                    this.RESPath+'Resoures/create_room/changchunmajiang.png',
                    this.RESPath+'Resoures/create_room/changchunmajiang2.png',
                    this.RESPath+'Resoures/create_room/changchunmajiang2.png'
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

