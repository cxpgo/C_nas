(function () {
    var list = [
        "src/module/init.js",
        "src/utils/init.js",
        "src/qp/init.js",
        "src/deprecated/init.js",
        "src/hall/init.js",
        "src/club/init.js",
        "src/game/init.js",
    ];
    cc.game.config.jsList = [];//重置jsList
    cc.game.config.resList = [];


    var resList = [
        "res/Common/emoji.plist",
        "res/Common/emoji.png",

        "res/Common/common.plist",
        "res/Common/common.png",

        "res/Animation/Flower.plist",

        "res/Animation/throwThing.plist",
        "res/Animation/throwThing.png",

        "res/Animation/lizi_xingxing.plist",

        "res/Animation/effect/ef_saoguang_0001.json",
        "res/Animation/effect/ef_saoguang_0001.png",
        "res/Animation/effect/ef_saoguang_0002.png",

        "res/Animation/hall_lizi.plist",

        "res/Animation/leaf1.plist",
        "res/Animation/leaf1.png",

        "res/Animation/shanxing.plist",
        "res/Animation/shanxing.png",

        "res/Animation/xiaohutexiao.plist",
        "res/Animation/xiaohutexiao.png",

        "res/Animation/shaizi.plist",
        "res/Animation/shaizi.png",

        "res/Animation/particle_texture.plist",
        "res/Animation/effect/eff_casino_xc_31.plist",
        "res/Animation/effect/eff_casino_xc_31.png",
        "res/Animation/effect/loading.json",
        "res/Animation/effect/loading.plist",
        "res/Animation/effect/loading.png",
        "res/Animation/effect/jiesuan.json",
        "res/Animation/effect/ef_emoji_0001.json",
        "res/Animation/effect/ef_biaoqin_xi.plist",
        "res/Animation/effect/ef_biaoqin_xi.png",
        "res/Animation/effect/ef_emoji_0002.json",
        "res/Animation/effect/ef_biaoqin_nu.plist",
        "res/Animation/effect/ef_biaoqin_nu.png",
        "res/Animation/effect/ef_emoji_0003.json",
        "res/Animation/effect/ef_biaoqin_ai.plist",
        "res/Animation/effect/ef_biaoqin_ai.png",
        "res/Animation/effect/ef_emoji_0004.json",
        "res/Animation/effect/ef_biaoqin_le.plist",
        "res/Animation/effect/ef_biaoqin_le.png",
        "res/Animation/effect/ef_finger.json",
        "res/Animation/effect/finger1.png",
        "res/Animation/effect/ef_zuanshishangguang.json",
        "res/Animation/effect/flare05_7.png",
        "res/font/cnganKaihks1.fnt",
        "res/font/cnganKaihks1.png",
        "res/font/cnganKaihks2.fnt",
        "res/font/cnganKaihks2.png",

        "res/font/HYDHJ.fnt",
        "res/font/HYDHJ.png",

        "res/font/HYDHJAD.fnt",
        "res/font/HYDHJAD.png",
    ];


    XYGameInitAppendRes(resList);

    XYGameInitLoad(list);
}());