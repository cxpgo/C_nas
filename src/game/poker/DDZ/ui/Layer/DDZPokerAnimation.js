var DDZPokerAnimation = cc.Layer.extend({
    panel_root: null,
    panel_bomb: null,
    panel_shunzi: null,
    panel_liandui: null,
    panel_feiji: null,
    panel_chuntian: null,
    action: null,
    root: null,
    ctor: function () {
        this._super();
    },

    play: function (typeInfo) {
        var type = typeInfo.cardsType;
        switch (type) {
            case DouDiZhuType.CT_BOMB:
                var node_anim = util.playTimeLineAnimation(DDZPokerJson.Eff_zhadan,false);
                node_anim.setPositionX(200);
                this.addChild(node_anim, 100);
                break;
            case DouDiZhuType.CT_KING_BOMB:
                var node_anim = util.playTimeLineAnimation(DDZPokerJson.Eff_wanzha,false);
                node_anim.setPositionX(200);
                this.addChild(node_anim, 100);
                break;
            case DouDiZhuType.CT_SINGLE_LINE:
                var node_anim = util.playTimeLineAnimation(DDZPokerJson.Eff_shunzi,false);
                node_anim.setPositionX(200);
                this.addChild(node_anim, 100);
                break;
            case DouDiZhuType.CT_DOUBLE_LINE:
                var node_anim = util.playTimeLineAnimation(DDZPokerJson.Eff_liandui,false);
                node_anim.setPositionX(200);
                this.addChild(node_anim, 100);
                break;
            case DouDiZhuType.CT_SIX_LINE_TAKE_FORE:
            case DouDiZhuType.CT_SIX_LINE_TAKE_DOUBLE:
            case DouDiZhuType.CT_SIX_LINE_TAKE_SINGLE:
                var node_anim = util.playTimeLineAnimation(DDZPokerJson.Eff_feiji,false);
                node_anim.setPositionX(200);
                this.addChild(node_anim, 100);
                break;
        }
    }
});
