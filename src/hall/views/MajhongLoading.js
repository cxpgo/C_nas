var MajhongLoading = {
    load: null,
    runningScene: null,
    show: function (text) {
        var running = cc.director.getRunningScene();
        if (running == this.runningScene) {
            if (this.load != null) {
                this.load.removeFromParent();
                this.load = null;
            }
        }
        if (this.load == null) {
            this.load = new MajhongLoading.loading();
            this.runningScene = running;
            this.runningScene.addChild(this.load, 100);
        }
        this.load.setText(text);
        this.load.setVisible(true);

    },
    dismiss: function () {
        var running = cc.director.getRunningScene();
        if (running != this.runningScene) {
            this.load = null;
        }
        if (this.load != null) {
            this.load.setVisible(false);
            this.load.removeFromParent();
            this.load = null;
        }
    },
};

MajhongLoading.loading = cc.Layer.extend({
    text_des: null,
    sprite_load: null,
    ctor: function () {
        this._super();
        var root = util.LoadUI("res/GameHall/loading.json").node;
        this.addChild(root);
        this.sprite_load = ccui.helper.seekWidgetByName(root, "sprite_load");

        var node_anim = util.playTimeLineAnimation("res/Animation/effect/loading.json",true , "res/Animation/");
        node_anim.setPosition(this.sprite_load.getPosition().x, this.sprite_load.getPosition().y);
        root.addChild(node_anim, 100);
        this.text_des = ccui.helper.seekWidgetByName(root, "text_des");
    },
    onEnter: function () {
        this._super();
        var actionTo = cc.rotateBy(1.5, 180).repeatForever();
        this.sprite_load.runAction(actionTo);
    },

    setText: function (text) {
        if(text == null || text == undefined) text = "";
        this.text_des.setString(text);
    },


});
