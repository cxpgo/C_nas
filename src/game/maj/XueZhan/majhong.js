//需要更改 -- 更换名字
var XueZhanMajhong = (function () {
	var ChatCfg = [
		'你太牛了',
		'哈哈,手气真好',
		'快点出牌啊',
		'今天真高兴',
		'这个吃的好',
		'你放炮我不胡',
		'你家里是开银行的撒',
		'不好意思,有事情要先走了',
		'你的牌打的太好了',
		'大家好,很高兴见到各位',
		'怎么又断线了啊,网络这么差',
	];
	var _GameHong = GameImpl.extend({
		appId: 'com.qp.hall.xuezhanmajhong',
        GameName: "xuezhan",
        GameValue: "血战麻将",
		GameHandler:"mjRoomHandler",
		
		CHAT_USUALMSG: ChatCfg,
		enter: function () {
            this.runGame(MJXueZhanLogic , XueZhanGameScene);
        },
		enterRecord: function (data) {
            this.runReGame(MJXueZhanLogic , XueZhanMajhong.Record , XueZhanGameScene , data);
		},

        getCreateRoomItem:function () {
            var arr = [];
            if(CreateRoomLayout_xz)
            {
                var info = {};
                info['class'] = CreateRoomLayout_xz;
                info['url'] = [XZCreateBtn.XZBtn1,XZCreateBtn.XZBtn2,XZCreateBtn.XZBtn2]
                arr.push(info);
            }
            return arr;
        },

        getGameHelpItem:function () {
            var arr = [];
            if(XZHelpItem)
            {
                var info = {};
                info['class'] = XZHelpItem;
                info['url'] = [XZCreateBtn.XZBtn1,XZCreateBtn.XZBtn2,XZCreateBtn.XZBtn2]
                arr.push(info);
            }
            return arr;
        },
	});
	var _Game_ = new _GameHong();
	hall.registerGame(_Game_);
	return _Game_;
})();

