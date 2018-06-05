var DDZChunTianAnimation = cc.Layer.extend({
    panel_root: null,
    action: null,
    root: null,
    ctor: function () {
        this._super();
        var json = util.LoadUI(DDZPokerJson.EffectAnima);
        this.root = json.node;
        this.action = json.action;

        this.root.runAction(this.action);
        this.addChild(this.root);
    },

    play: function (calls) {
        var self = this;
        this.action.play('chuntian', false);
        this.action.setLastFrameCallFunc(function () {
            calls();
            self.removeFromParent();
        })
    }
});