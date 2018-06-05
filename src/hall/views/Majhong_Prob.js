var GameProb = cc.Layer.extend({
    ctor:function(data)
    {
        this._super();
        var root = ccs.load(GameHallJson.GameProb).node;
        this.addChild(root);

        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
    },
    showPanel:function()
    {
        cc.director.getRunningScene().addChild(this);
    }
});