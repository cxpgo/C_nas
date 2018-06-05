/**
 * Created by atom on 2016/7/24.
 */

//游戏记录
MajhongInfo = {
    GameMode: 0, //游戏运行模式记录
    MajhongNumber: 17,//手牌最大数量
}

var card_deskSkewX = [15, 13, 10, 6, 2, -2, -4, -8, -12, -15];
var card_showPosX = [14, 14, 14, 14, 14, 14, 14, 14, 14, 12, 12, 12, 12, 12, 12, 12, 12, 12];
var card_showSkewX = [-16, -16, -16, -15, -14, -11, -8, -6, -2, 2, 6, 8, 11, 14, 15, 16, 16, 16];
var card_indexs = [0, 0, 0, 1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 0, 0, 0];

var GetCardDifferentIndex = function (index) {
    var real = index;
    if (MajhongInfo.MajhongNumber < 17)
        real += 2;
    return real;
}

var indicator_Posx = [47, 46, 45, 44, 43, 38, 37, 36, 35, 34];
var indicator_UpPosx = [33, 35, 36, 37, 38, 43, 44, 46, 47, 48];

var ResultTag = {
    HAIDILAO: 'haidilao',
    BIRD: 'bird',
    DAHU: 'dahu',
}

var GameMode = {
    RECORD: 2,
    PLAY: 1,
}

var MjTime = {
    HU_SHOW_TIME: 2,
}


var GameTag = {
    TAG_SPEAKER: 3001,
}

var GameStatus = {
    SEATING: 0,
    WATING: 1,
    READY: 2,           //准备阶段 1秒进入下一阶段
    INITTABLE: 3,       //初始化牌桌阶段 包括 初始化玩家信息、数据信息、庄家判断、牌的初始化、洗牌、发牌
    PLAYING: 4,          //游戏中状态
    GAMERESULT: 5,        //游戏结果阶段 5秒给客户端展示阶段
    GAMEOVER: 6           //游戏结束 桌子解散
}

var DeskType = {
    SELF: 0,
    RIGHT: 1,
    UP: 2,
    LEFT: 3,
    Player: 0,
    Other: 5,
}

var Times = {
    'OPERATETIME': 20,
}

var MJGVCacheKey = "MJGVType";
var MJGVType = {
    V2D: 1,
    V3D: 2,
};
var GetMJGVCacheV = function () {
    if(MajhongInfo.GameMode == GameMode.RECORD){
        return MJGVType.V3D;
    };
    return util.getCacheItem(MJGVCacheKey);
};

var PokerBackGCCacheKey = "PokerBackGVType";
var PokerBgGCCacheKey = "PokerBgGVType";
var PokerBackGVType = {
    V1: 1,
    V2: 2,
    V3: 3,
    V4: 4,
};
var PokerBgGVType = {
    V1: 1,
    V2: 2,
    V3: 3,
    V4: 4,
};

var CommonEvent = {
    TipEvent: 'tip_event',
    Indicator: 'Indicator_event',
    ResetCardState: 'reset_card_state',
    EVT_DESK_MODE: 'EVT_DESK_MODE',
    EVT_DESK_RESULT_INDEX: 'evt_desk_result_index',
    EVT_RECORD: 'evt_record',
    EVT_RECORD_NEXT_STEP: 'evt_record_next_step',
    EVT_GAMING: 'evt_gaming',
    EVT_ShareCallback: 'evt_sharecallback',
    ChangeCardBg: 'evt_changecardBg',
    ChangeGameSceneBg: 'evt_changeGameSceneBg',
    TINGChOICE:'TINGChOICE',
}

var RecordType = {
    READY: 0,
    SEND: 1,
    MO: 2,
    NOTIFY_OP: 3,
    SYSC_OP: 4,
    SYSC_OP_RESULT: 5,
    BIRD_CARDS: 6,
    HAIDI: 7,
    BUHUA: 8,
    GeBaiLao: 10,
    Zhen7Jia8: 11,
    MaiZhuang: 12,
    HengGang: 13,
}

var RecordStatus = {
    PLAY: 1,
    PAUSE: 0,

}

var CommonEventAction = {
    'TipCancel': 'tip_cancel',
    'Indicator_Start': 'Indicator_Start',
    'Indicator_Stop': 'Indicator_Stop',
    'GANG_EVT': 'GANG_EVT',
    //********quanzhou*********
    'BUHUA_EVT': 'BUHUA_EVT',
    'KAIJIN_EVT': 'KAIJIN_EVT',
    'PLAYEROP_EVT': 'PLAYEROP_EVT',
    'KAIPIZI_EVT': 'KAIPIZI_EVT',         //武汉用 皮子
    'CARDREVERSAL_EVT': 'CARDREVERSAL_EVT',   //老韭菜 翻转
    "CARDSWITCHNORMAL_EVT": 'CARDSWITCHNORMAL_EVT', //老韭菜 翻转
    "UPDATETIP_EVT": 'UPDATETIP_EVT', //老韭菜 翻转
    //---------quanzhou-----------

    'ADDORDER': 'ADDORDER',
    'BACKPACK_EVT': 'BACKPACK_EVT',
    'BACKPACKITEM_EVT': 'BACKPACKITEM_EVT',
}

var CommonParam = {
    'PAICARDBACK': (util.getCacheItem('majiang_bg') != undefined && util.getCacheItem('majiang_bg') != null) ? util.getCacheItem('majiang_bg') : 8,
    'ShowUpCardHeight': 30,
    'MoveUpTime': 0.03,
    'MoveDownTime': 0.2,
    'PutOut1stTime': 0.05,
    'PutOutScale': 1.2,
    'PutOut2ndTime': 0.1,
    'PutOutScaleBack': 0.7,
    'ShowDelayTime': 0.3,
    'PutOutScaleReset': 1.0,
    'ChatFadeOut': 4.0,
    //********quanzhou*********
    'BuhuaDelay': 2.0,
    'JinpaiDelay': 2.0,
    'JinPaiScale': 0.7,
    'My17CardStandScale': 0.8,
    'My17CardShowScale': 0.65,
    'My14CardShowScale': 0.7,
    'Other17CardStandScale': 0.77,
    'Other17ShowScale': 0.8,
    'Other17CardRecordScale': 0.8,
    'UP17CardStandScale': 0.85,
    'UP17ShowScale': 0.95,
    'UP17CardRecordScale': 0.95,
    'LeftCardGap': 0.67,
    'LeftCardWidthGap': 0.96,
    'UpCardGap': 0.96,
    'UpCardHeightGap': 0.72,
    'DownCardGap': 0.66,
    'DownCardHeightGap': 0.72,
    'DeskOneNum': 10,
    'ResultCardScale': 0.9,
    //---------quanzhou-----------
    //pdk
    'pokerGap': 70,
    'selectColor': { r: 183, g: 36, b: 0, a: 255 },
    'unselectColor': { r: 123, g: 90, b: 70, a: 255 },
    'greenColor': { r: 29, g: 153, b: 0, a: 255 },
    'redColor': { r: 183, g: 36, b: 0, a: 255 },

    //fuzhou
    'cardOutTime': 0.1,
    'cardUpHeight': 0,
    'cardUpTime': 0.2,
    'cardDownTime': 0.5,
    'cardMoveTime_MoCard': 0.2,
    'cardMoveTime_0': 0.09,
    'cardMoveTime_1': 0.07,
    'cardMoveTime_2': 0.05,
    'handCardMoveTime': 0.15,
    'cardOutScale': 0.5,
    //chipenggang
    'pengPaisStopTime': 0.3,
    'pengPaisMoveTime': 0.2,
    'handPaisMoveTime': 0.2,
    'handMoPaiMoveTime': 0.2,
}
//********quanzhou*********
var CARD_JIN = {
    'NO': 0,
    'YES': 1,
}
//---------quanzhou-----------

var NetErr = {
    'OK': 200,
    'ERR': 500
}


var ResCard = {
    "chi": "#word_chi1.png",
    "peng": "#word_peng1.png",
    "gang": "#word_gang1.png",
    "buzhang": "#word_buzhang.png",
    "hu": "#word_hu.png"


}

var TABLEDIRECTION = {
    'EAST': 0,
    'SOUTH': 1,
    'WEST': 2,
    'NORTH': 3
}

var OPERATIONTYPE = {
    'TIANHU': 0,
    'CHI': 1,
    'PENG': 2,
    'GANG': 3,
    'BUZHANG': 4,
    'HU': 5,
    'GUO': 6,
    'TING': 7,
}

var OPERATIONNAME = {
    'CHI': "chi",
    'PENG': "peng",
    'GANG': "gang",
    'BUZHANG': "bu",
    'HU': "hu",
    'GUO': "guo",
    'TING': "ting",
    'Gebailao': "gebailao",
}

var OPER_GANG_TYPE = {
    'GANG_AN': 1,
    'GANG_OTHER': 2,
    'GANG_MING': 3,
    // 'Gang_Pizi': 4,
    // 'Gang_Laizi': 5,
    'GANG_J1': 4,    // 中发白 蛋
    'GANG_T1': 5,    // 一条一同一万 蛋
    'GANG_T9': 6,    // 九条九筒九万 蛋
    'GANG_F1': 7,    // 东南西北风   蛋
    'GANG_BU': 8,    // 补 蛋
    'GANG_JTF': 9,    // 任意蛋  用于癞子牌组成蛋时， 摸到 1/9万 1/9条 后变成正式蛋所用
}

var CARD_SITE = {
    'HAND_IN': 0,
    'HAND_OUT': 1,
    'HAND_CHI': 2,
    'HAND_PENG': 3,
    'HAND_GANG': 4,
    'HAND_HU': 5,
    'RECORD': 6,
}

var TipRes = {
    'chi'       : ['btn_chi.png',   'chi.png'],
    'peng'      : ['btn_peng.png',  'peng.png'],
    'gang'      : ['btn_gang.png',  'gang.png'],
    'bu'        : ['btn_gang.png',  'gang.png'],
    'hu'        : ['btn_hu.png',    'hu.png'],
    'guo'       : ['btn_guo.png',   'guo.png'],
    'ting'      : ['btn_ting.png',  'ting.png'],
    'gebailao'  : ['btn_ting.png',  'guo.png'],
}

var DaHuSound = {
    0: 'queyise',
    1: 'banbanhu',
    2: 'dasixi',
    3: 'liuliushun',
}

var CHAT_TYPE = {
    'Usual': 0,
    'Exp': 1,
};

var CHAT_EMOJI = [
    'E40A.png',
    'E40B.png',
    'E40C.png',
    'E40D.png',
    'E40F.png',
    'E056.png',
    'E057.png',
    'E058.png',
    'E105.png',
    'E106.png',
    'E107.png',
    'E108.png',
    'E403.png',
    'E404.png',
    'E405.png',
    'E406.png',
    'E407.png',
    'E408.png',
    'E410.png',
    'E411.png',
    'E412.png',
    'E40E.png',
    'E414.png',
    'E415.png',
    'E416.png',
    'E417.png',
    'E418.png',
    'E421.png',
];


var SexInfo = {
    '1': { 'head': 'male.png', 'icon': 'sex_male.png' },//男
    '2': { 'head': 'female.png', 'icon': 'sex_female.png' },//女
};


var PuKeType = {
    CT_ERROR: 0,                         //错误类型
    CT_SINGLE: 1,                        //单牌类型 3
    CT_DOUBLE: 2,                        //对牌类型 33
    CT_THREE: 3,                         //三同类型 333
    CT_SINGLE_LINE: 4,                   //顺子类型 34567
    CT_DOUBLE_LINE: 5,                   //对连类型 3344
    CT_THREE_LINE_TAKE_ONE: 6,           //三带一类型 3334
    CT_THREE_LINE_TAKE_TWO: 7,           //三带二类型 33344
    CT_FORE_LINE_TAKE_THREE: 8,          //四带三类型 3333456
    CT_SIX_LINE_TAKE_FORE: 9,            //飞机类型 3334445678
    CT_BOMB: 10                          //炸弹类型   33333
}

var gReportError = function (errorStr) {
    JJLog.log2cloud(errorStr);
}

var isEmojiCharacter = function (substring) {
    for (var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                if (0x1d000 <= uc && uc <= 0x1f77f) {
                    return true;
                }
            }
        } else if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            if (ls == 0x20e3) {
                return true;
            }
        } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
                return true;
            } else if (0x2B05 <= hs && hs <= 0x2b07) {
                return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
                return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
                return true;
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                || hs == 0x2b50) {
                return true;
            }
        }
    }
}

var cutStringLenght = function (subString) {
    var _length = 0;
    var _name = subString;
    var length = subString.length;
    for (var i = 0; i < length; i++) {
        var charCode = subString.charCodeAt(i);
        if (charCode > 0 && charCode <= 128) {
            _length++;
            if (_length > 10) {
                _name = subString.substr(0, i - 2) + "...";
                return _name;
            }
        } else {
            _length += 2;
            if (_length > 10) {
                _name = subString.substr(0, i - 1) + "...";
                return _name;
            }
        }
    }
    return _name;

}

var NoticeMsg = {
    list: [],
    board: [],
    size: 5,
    addMsg: function (msg) {
        if (this.list.length >= this.size) {
            this.list.splice(0, 1);
        }
        this.list.push(msg);
    },
    getMsg: function (index) {
        if (index < this.list.length) {
            return this.list[index];
        }

        return ' ';
    },

    addBoard: function (msg) {
        if (this.board.length >= this.size) {
            this.board.splice(0, 1);
        }
        this.board.push(msg);
    },
    getBoard: function (index) {
        if (index < this.board.length) {
            return this.board[index];
        }

        return ' ';
    },


};

var Chatmsg_Cfg = {
    0:[
        '诶，你要耽误人家约会了',
        '哈哈真爽，太过瘾了',
        '拜托,有你这样玩牌的吗?',
        '哈哈,没了吧!',
        '小树不修不直溜,人不修理哏赳赳',
        '小样啊,你给我等着',
    ],
    1:[
        '你是哪个单位的,出牌这么慢',
        '这牌打得真精彩呀',
        '你这牌打得太让人无语了',
        '哈哈,没了吧!',
        '小树不修不直溜,人不修理哏赳赳',
        '唉呀,走着瞧',
    ]
};

var Setting_BgCfg = [
    'res/GameHall/Resoures/setting/bg_doudizhu_01.jpg',
    'res/GameHall/Resoures/setting/bg_doudizhu_02.jpg',
    'res/GameHall/Resoures/setting/bg_doudizhu_03.jpg',
    'res/GameHall/Resoures/setting/bg_doudizhu_04.jpg',
]

var Setting_BackCfg = [
    'res/GameHall/Resoures/setting/img_poker_01.png',
    'res/GameHall/Resoures/setting/img_poker_02.png',
    'res/GameHall/Resoures/setting/img_poker_03.png',
    'res/GameHall/Resoures/setting/img_poker_04.png',
]

////////黄笑笑////////////
////////背包、商城、转盘、积分任务配置

//hxx add
var orederState = {
    1 : '生成订单',
    2 : '客服确认订单',
    3 : '等待运营确认修改',
    4 : '确认收货',
    5 : '申请退货',
    6 : '退货申请驳回',
    7 : '退货确认',
    0 : '虚拟道具',
}

var ExchangePng = {
    1:'res/GameHall/Resoures/exchange/img_jifen.png',
    2:'res/GameHall/Resoures/exchange/img_jinbi.png',
}

var ExchangeType = {
    1:'积分',
    2:'金币',
    3:'钻石',
}
var backpack_type = {
    'score':'积分',
    'gold':'金币',
    'gem':'钻石',
}
var backpack_icon = {
    'gold':"res/GameHall/Resoures/image/img_jifen.png",
    'gem':"res/GameHall/Resoures/image/img_zuanshi.png",
}

var Item_cfg = {
    gold: "res/Common/item_icon/img_small_gold.png",
    gem: "res/Common/item_icon/img_small_gem.png",
    score: "res/Common/item_icon/img_small_score.png",
}
//牌背、头像框
var Backpack_small = {
    10301: "res/Common/item_icon/head_small_10301.png",
    10401: "res/Common/item_icon/head_small_10401.png",
    10501: "res/Common/item_icon/head_small_10501.png",
    10601: "res/Common/item_icon/head_small_10601.png",
    10411: "res/Common/item_icon/head_small_10411.png",
    10421: "res/Common/item_icon/head_small_10421.png",
    10431: "res/Common/item_icon/head_small_10431.png",
    10441: "res/Common/item_icon/head_small_10441.png",
    10451: "res/Common/item_icon/head_small_10451.png",
    10461: "res/Common/item_icon/head_small_10461.png",
    10471: "res/Common/item_icon/head_small_10471.png",
    10701: "res/Common/item_icon/back_small_10701.png",
    10801: "res/Common/item_icon/back_small_10801.png",
    10901: "res/Common/item_icon/back_small_10901.png",
    10911: "res/Common/item_icon/back_small_10911.png",
    10912: "res/Common/item_icon/back_small_10912.png",
    10913: "res/Common/item_icon/back_small_10913.png",
    10914: "res/Common/item_icon/back_small_10914.png",
    10915: "res/Common/item_icon/back_small_10915.png",
    10916: "res/Common/item_icon/back_small_10916.png",
    10917: "res/Common/item_icon/back_small_10917.png",
    10918: "res/Common/item_icon/back_small_10918.png",
    10919: "res/Common/item_icon/back_small_10919.png",
    10920: "res/Common/item_icon/back_small_10920.png",
    10921: "res/Common/item_icon/back_small_10921.png",
    10922: "res/Common/item_icon/back_small_10922.png",
}
var Backpack_big = {
    10301: "res/Common/item_icon/head_big_10301.png",
    10401: "res/Common/item_icon/head_big_10401.png",
    10501: "res/Common/item_icon/head_big_10501.png",
    10601: "res/Common/item_icon/head_big_10601.png",
    10411: "res/Common/item_icon/head_big_10411.png",
    10421: "res/Common/item_icon/head_big_10421.png",
    10431: "res/Common/item_icon/head_big_10431.png",
    10441: "res/Common/item_icon/head_big_10441.png",
    10451: "res/Common/item_icon/head_big_10451.png",
    10461: "res/Common/item_icon/head_big_10461.png",
    10471: "res/Common/item_icon/head_big_10471.png",
    10701: "res/Common/item_icon/back_big_10701.png",
    10801: "res/Common/item_icon/back_big_10801.png",
    10901: "res/Common/item_icon/back_big_10901.png",
    10911: "res/Common/item_icon/back_big_10911.png",
    10912: "res/Common/item_icon/back_big_10912.png",
    10913: "res/Common/item_icon/back_big_10913.png",
    10914: "res/Common/item_icon/back_big_10914.png",
    10915: "res/Common/item_icon/back_big_10915.png",
    10916: "res/Common/item_icon/back_big_10916.png",
    10917: "res/Common/item_icon/back_big_10917.png",
    10918: "res/Common/item_icon/back_big_10918.png",
    10919: "res/Common/item_icon/back_big_10919.png",
    10920: "res/Common/item_icon/back_big_10920.png",
    10921: "res/Common/item_icon/back_big_10921.png",
    10922: "res/Common/item_icon/back_big_10922.png",
}
var backpackCfg = util.getBackpackData();

var exchangeBtnCfg = [
    ['res/GameHall/Resoures/exchange/btn_jifenduihuan_02.png',
        'res/GameHall/Resoures/exchange/btn_jifenduihuan_01.png',
        'res/GameHall/Resoures/exchange/btn_jifenduihuan_01.png'],
    ['res/GameHall/Resoures/exchange/btn_jinbiduihuan_02.png',
        'res/GameHall/Resoures/exchange/btn_jinbiduihuan_01.png',
        'res/GameHall/Resoures/exchange/btn_jinbiduihuan_01.png'],
]

var CodeCommon = {
    NO_GEM: {CODE: 10010, ERROR: "钻石不足，请前往充值!"},
    NO_GOLD: {CODE: 10020, ERROR: "金币不足，请前往充值!"},
    NO_SCORE: {CODE: 10030, ERROR: "积分不足，请前往充值!"},
}

//end


var ShaiziAnimation = cc.Node.extend({
    shaizi1: null,
    shaizi2: null,
    ctor: function (point1, point2) {
        this._super();
        XYGLogic.Instance.addSpriteFrames('res/Animation/shaizi.plist');
        this.shaizi1 = new ccui.ImageView("shaizi" + point1 + ".png", ccui.Widget.PLIST_TEXTURE);
        this.shaizi2 = new ccui.ImageView("shaizi" + point2 + ".png", ccui.Widget.PLIST_TEXTURE);
        this.shaizi1.setPosition(cc.p(-50, -20));
        this.shaizi2.setPosition(cc.p(50, -14));
        this.shaizi1.setVisible(false);
        this.shaizi2.setVisible(false);
        this.addChild(this.shaizi1);
        this.addChild(this.shaizi2);
        this.setVisible(false);
    },

    runAnimation: function (cb) {
        this.runAction(cc.sequence(cc.show(), cc.callFunc(function () {
            var sp_ani1 = new cc.Sprite('#' + 'shaizi_anmi1.png');
            this.addChild(sp_ani1);
            sp_ani1.setPosition(cc.p(0, 0));

            var animFrames = [];
            var str = "";
            var frame;
            for (var i = 1; i < 12; i++) {
                str = "shaizi_anmi" + i + ".png";
                frame = cc.spriteFrameCache.getSpriteFrame(str);
                animFrames.push(frame);
            }
            var anim = new cc.Animation(animFrames, 0.1);
            sp_ani1.runAction(cc.sequence(cc.animate(anim), cc.callFunc(function () {
                sp_ani1.setVisible(false);
                this.shaizi1.setVisible(true);
                this.shaizi2.setVisible(true);
            }.bind(this))));
        }.bind(this)), cc.delayTime(2), cc.callFunc(function () {
            cb();
        }), cc.removeSelf()));
    }

});

var THROWTHINGTYPE = {
    1: 'hh',
    2: 'qq',
    3: 'za',
    4: 'zd',
    5: 'zt',
}
var THROWTHINGPNGLEGTH = {
    1: 8,
    2: 8,
    3: 8,
    4: 8,
    5: 8,
}
var ddzTHROWTHINGTYPE = {
    1: 'mahjong_magic_emotion_rose',
    2: 'mahjong_magic_emotion_bomb',
    3: 'mahjong_magic_emotion_egg',
    4: 'mahjong_magic_emotion_brick',
}
var ddzTHROWTHINGPNGLEGTH = {
    1: 32,
    2: 35,
    3: 26,
    4: 27
};


var SetGangCardNums = function (cards) {
    if (cards.length > 2) {
        var temp = new Array();
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card['num'] = 1;
            if (i < 2) {
                temp.push(card);
            } else {
                var contains = false;
                for (var j = 0; j < temp.length; j++) {
                    if (card['type'] + card['value'] == temp[j]['type'] + temp[j]['value']) {
                        temp[j]['num'] += 1;
                        contains = true;
                        break;
                    }
                }
                if (!contains) {
                    temp.push(card);
                }
            }
        }
        return temp;
    }
    return cards;
}
/** 绘制胡的牌行
 *  info 牌行数据
 *  panel_f 吃碰杠 牌行用的Layer
 *  panel_card 所有牌的父节点
 *  
 * */ 
var MJDrawHuLineCardTip = function (info , panel_f , panel_card) {
    var ResultCardScale = 1;
    var posNextX = 0;

    var qiangGangPais = info['qiangGangPai'] || [];
    var _searchQGCard = function (cardData) {
        for (var index = 0; index < qiangGangPais.length; index++) {
            var e = qiangGangPais[index];
            if (e.type == cardData.type && e.value === cardData.value) {
                return true;
            }
        }
        return false;
    }
    //吃碰杠
    var funcArr = info['paiDest']
    for (var k = 0; k < funcArr.length; k++) {
        var funcInfo = funcArr[k];
        var funcType = funcInfo['type'];

        var panelC = panel_f.clone();
        panelC.setVisible(true);
        switch (funcType) {
            case OPERATIONNAME.BUZHANG:
            case OPERATIONNAME.GANG:
                {
                    var gangtype = funcInfo['origin'];
                    var cardObjs = funcInfo['pai'];
                    if (gangtype < OPER_GANG_TYPE.GANG_J1) {
                        var cardObj = [].concat(cardObjs)[0];
                        for (var a = 0; a < 4; a++) {
                            var card = MJCardTip.create3D(cardObj);
                            var width = card.getContentSize().width;
                            card.x = (width - 3) * a;
                            if (a == 3) {
                                card.x = (width - 3) * 1;
                                card.y = 12;
                            } else {
                                if (funcInfo.origin == OPER_GANG_TYPE.GANG_AN) card.SetBack();
                                card.x = (width - 3) * a;
                                card.y = 0;
                            }
                            panelC.addChild(card, a);
                        }
                    } else {
                        var cards = SetGangCardNums(funcInfo['pai']);
                        for (var i = 0; i < cards.length; i++) {
                            var card = MJCardTip.create3D(cards[i]);
                            var width = card.getContentSize().width;
                            card.x = (width - 3) * i;
                            card.y = 0;
                            panelC.addChild(card, i, i);
                            if(i>=3){
                                var nPSize = panelC.getContentSize();
                                nPSize.width += (width - 2);
                                panelC.setContentSize(nPSize)
                            }
                        }
                    }
                }
                break;
            case OPERATIONNAME.PENG:
                {
                    var cardObj = funcInfo['pai'];
                    for (var a = 0; a < 3; a++) {
                        var card = MJCardTip.create3D(cardObj);
                        var width = card.getContentSize().width;
                        card.x = (width - 3) * a;
                        card.y = 0;
                        panelC.addChild(card, a);
                    }
                    if (_searchQGCard(cardObj)) {
                        var card = MJCardTip.create3D(cardObj);
                        card.x = (width - 3) * 1;
                        card.y = 12;
                        card.showGray();
                        panelC.addChild(card, 3);
                    }
                }
                break;
            case OPERATIONNAME.CHI:
                {
                    var cardArr = funcInfo['pai'];
                    for (var a = 0; a < cardArr.length; a++) {
                        var card = MJCardTip.create3D(cardArr[a]);
                        var width = card.getContentSize().width;
                        card.x = (width - 3) * a;
                        card.y = 0;
                        panelC.addChild(card, a);
                    }
                }
                break;
        }
        panelC.setScale(ResultCardScale);
        panelC.x = posNextX;
        panelC.y = 0;
        panel_card.addChild(panelC, 0);
        posNextX = posNextX + panelC.getContentSize().width * panel_card.getScale() + 5;
    }

    var index = 0;
    //手牌
    for (var typeTag in info['qiPai']) {
        var arr = info['qiPai'][typeTag];
        for (var j = 0; j < arr.length; j++) {
            var obj = arr[j];
            var cardShow = MJCardTip.create3D(obj);
            cardShow.setScale(ResultCardScale);
            cardShow.setAnchorPoint(0, 0);
            var width = cardShow.getContentSize().width;
            cardShow.setPosition(posNextX + 5, 0);
            posNextX = width * ResultCardScale + posNextX;
            panel_card.addChild(cardShow, index);
            index++;
        }
    }
    //胡牌
    posNextX += 10;
    
    if (info["isHu"] > 0) {
        var huArr = new Array();
        if (info['huType'].length > 0) {
            for (var b = 0; b < info['huType'].length; b++) {
                var paiInfoB = info['huType'][b]['pais'];
                for (var c = 0; c < paiInfoB.length; c++) {
                    var added = false;
                    for (var d = 0; d < huArr.length; d++) {
                        var parS = paiInfoB[c];
                        var strS = parS['type'] + parS['value'];

                        var parT = huArr[d];
                        var strT = parT['type'] + parT['value'];
                        if (strS == strT) {
                            added = true;
                            break;
                        }
                    }
                    if (added) continue;

                    huArr.push(paiInfoB[c]);
                    var cardShow = MJCardTip.create3D(paiInfoB[c]);
                    cardShow.setScale(ResultCardScale);
                    cardShow.setAnchorPoint(0, 0);
                    var width = cardShow.getContentSize().width;
                    cardShow.setPosition(posNextX, 0);
                    panel_card.addChild(cardShow, index);
                    posNextX = width * ResultCardScale + posNextX;
                    var size3 = cardShow.getContentSize();
                    var huImg = new ccui.ImageView('hudejiaobiao1.png', ccui.Widget.PLIST_TEXTURE);
                    cardShow.addChild(huImg);
                    huImg.setPosition(size3.width - huImg.getContentSize().width * 0.5,
                        size3.height - huImg.getContentSize().height * 0.5);
                    index++;
                }
            }
        }
    }

}