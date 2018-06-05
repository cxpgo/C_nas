(function () {
	var cmds = {
        huan3             : 'huan3Pai',           //  换三张
        dingQue           : 'dingQue',           //  定缺
    };
	var net  = GameNet.extend({
		
		huan3Pai:function (data, cb) {
			this._GameNetRequest(
				cmds.huan3, 
				data,
				function (resp) {
					cb(resp);
				}
			);
		},

		dingQue : function (data, cb) {
			this._GameNetRequest(
				cmds.dingQue, 
				data,
				function (resp) {
					cb(resp);
				}
			);
		},

		updatePlayerDelCard: function (card , cb) {
			this._super(
				{
					opCard : card,
				},
				cb
			);
		},

	});



	return new net(MJBaiShan.Game);
})();


