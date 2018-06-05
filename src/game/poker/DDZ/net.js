(function () {
	var cmds = {
        doLord: 'doLord'
    };
	var net  = GameNet.extend({
		updatePlayerDelCard: function (card, type, cb) {
			this._super(
				{
					'opCard': card,
					'opCardType': type
				}, 
				cb
			);
		},

        sendDoLord: function (data, cb) {
            this._GameNetRequest(cmds.doLord, data, cb)
        }

	});

	return new net(DDZPoker);
})();
