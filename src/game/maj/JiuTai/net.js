(function () {
	var cmds = {
        
    };
	var net  = GameNet.extend({
		
		updatePlayerDelCard: function (card , cb) {
			this._super(
				{
					opCard : card,
				},
				cb
			);
		},

	});



	return new net(MJJiuTai.Game);
})();