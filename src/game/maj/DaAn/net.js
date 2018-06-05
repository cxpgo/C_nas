(function () {
	var cmds = {
        
    };
	var net  = GameNet.extend({
		GameName: MJDaAn.Game.GameName,
        GameValue: MJDaAn.Game.GameValue,
		GameHandler:MJDaAn.Game.GameHandler,
		
		updatePlayerDelCard: function (card , cb) {
			this._super(
				{
					opCard : card,
				},
				cb
			);
		},

	});



	return new net(MJDaAn.Game);
})();