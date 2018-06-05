var GameBaseState = cc.Class.extend({
    ctor: function (status, id) {
        this.mID = id;
        this.mStatus = status;
        XYGLogic.Instance.status = status;

        JJLog.print("[GameState] status:", status);
    },

    init: function () {
        if (this.text_round) {
            this.text_round.setString(XYGLogic.Instance.currentRound + '/' + XYGLogic.Instance.roundTotal);
        }
        this.onInit.apply(this, arguments);
    },
    destroy: function () {

        this.onRelease.apply(this, arguments);
    },


    //over
    onInit: function () {
    },
    onRelease: function () {
    },
});