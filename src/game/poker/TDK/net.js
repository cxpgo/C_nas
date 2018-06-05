(function () {
	var cmds = {
       
    };
	var net  = GameNet.extend({
		
        updatePlayerOp: function(optType, amount, cOpType, cb) {
            this._super(
                {
                    opType: optType,
                    cOpType: cOpType,
                    amount: parseInt(amount),
                },
                cb
            );
        },

	});
	return new net(TDKPoker);
})();
