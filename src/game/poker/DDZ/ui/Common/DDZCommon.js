var DouDiZhuType = {
    CT_ERROR:0,                         //错误类型
    CT_SINGLE:1,                        //单牌类型 3
    CT_DOUBLE:2,                        //对牌类型 33
    CT_THREE:3,                         //三同类型 333
    CT_SINGLE_LINE:4,                   //顺子类型 34567
    CT_DOUBLE_LINE:5,                   //对连类型 3344
    CT_THREE_LINE_TAKE_ONE:6,           //三带一类型 3334
    CT_THREE_LINE_TAKE_TWO:7,           //三带二类型 33344
    CT_FORE_LINE_TAKE_TWO:8,            //四带二类型 3333456
    CT_FORE_LINE_TAKE_TWO_DOUBLE:9,     //四带二对类型 33334477
    CT_SIX_LINE_TAKE_FORE:10,            //飞机类型 3334445678
    CT_SIX_LINE_TAKE_SINGLE:11,         //飞机（单带） 33344456
    CT_SIX_LINE_TAKE_DOUBLE:12,         //飞机（飞机带对） 33344456
    CT_BOMB:13,                         //炸弹类型   33333
    CT_KING_BOMB:14,                    //王炸   53,54
    CT_CHUNTIAN:15,                     //春天   53,54
};

var TABLESTATUS =
{
    SEATING: 0,           //没有游戏状态还从没开始过
    WATING: 1,            //休眠状态 没有开始（此时玩家人数不足）
    READY: 2,           //准备阶段 1秒进入下一阶段
    INITTABLE: 3,       //初始化牌桌阶段 包括 初始化玩家信息、数据信息、庄家判断、牌的初始化、洗牌、发牌
    BENEATH: 4,         //叫地主
    PLAYING: 5,          //游戏中状态
    GAMERESULT: 6,        //游戏结果阶段 5秒给客户端展示阶段
    GAMEOVER: 7           //游戏结束 桌子解散
};

var DDZPokerPic = {
    NoRobPng:"res/Game/Poker/DDZ/Resoures/large/btn_buqiang_01.png",
    Rob_LandlordPng:"res/Game/Poker/DDZ/Resoures/large/btn_qiangdizhu_01.png",
    No_CallPng:"res/Game/Poker/DDZ/Resoures/large/btn_bujiao_01.png",
    Call_LandlordPng:"res/Game/Poker/DDZ/Resoures/large/btn_jiaodizhu_01.png",
    He_TouxiangkuanPng:"res/Game/Poker/DDZ/Resoures/result/he_touxiangkuan.png",
    Me_TouxiangkuanPng:"res/Game/Poker/DDZ/Resoures/result/me_touxiangkuan.png",
    Img_loseMedPng:"res/Game/Poker/DDZ/Resoures/result/img_loseMed.png",

    Img_buchu:"res/Game/Poker/DDZ/Resoures/tip/img_buchu.png",
    Img_bujiabei:"res/Game/Poker/DDZ/Resoures/tip/img_bujiabei.png",
    Img_bujiao:"res/Game/Poker/DDZ/Resoures/tip/img_bujiao.png",
    Img_buqiang:"res/Game/Poker/DDZ/Resoures/tip/img_buqiang.png",
    Img_yifen:"res/Game/Poker/DDZ/Resoures/tip/img_yifen.png",
    Img_erfen:"res/Game/Poker/DDZ/Resoures/tip/img_erfen.png",
    Img_sanfen:"res/Game/Poker/DDZ/Resoures/tip/img_sanfen.png",
    Img_jiaodizhu:"res/Game/Poker/DDZ/Resoures/tip/img_jiaodizhu.png",
    Img_jiabei:"res/Game/Poker/DDZ/Resoures/tip/img_jiabei.png",
    Img_qiangdizhu:"res/Game/Poker/DDZ/Resoures/tip/img_qiangdizhu.png",
    Img_meiyoudaguo:"res/Game/Poker/DDZ/Resoures/tip/img_meiyoudaguo.png",
    Img_jiabei:"res/Game/Poker/DDZ/Resoures/tip/img_jiabei.png",
    Img_bujiabei:"res/Game/Poker/DDZ/Resoures/tip/img_bujiabei.png",

};

var DDZCommonParam = {
    'MoveSideTime':0.15,
    'CardOutScaleTime':0.15,
    'RoundResultMoveTime':0.7,
    'RoundTitleScaleTime':0.5,
    'BaojingBlinkTime':0.5,
    'panelCardOutScale':0.6,
    'HandCardShowTime': 0.09,
    'FaPaisHideTime': 0.04,
    'HandCardsMoveTime1': 0.1,
    'HandCardsMoveTime2': 0.2,
    'HandCardsDelayTime': 0.5,
}

var DDZGlobal = {
    CARD_LEVEL_SMALLJOKER: 14,
    CARD_LEVEL_BIGJOKER: 15,
    CARD_LEVEL_CHANGECARD: 16,
    LEVEL_NUMBER: 17
}
var dbDDZChatSound_1 = [
    'nsngdwd',
    'ycdxbl',
    'hhmlb',
    'zpddzjc',
    'nsldwmhspy',
    'xsbxbzl',
    'nqdwg',
    'kndpkzfj',
    'sjjsjq',
    'djdy',
    'btynzywpdm'
]
var dbDDZChatSound_0 = [
    'pykndpzfj',
    'kdbpznsldxzl',
    'nydwrjyhl',
    'hhmlb',
    'wnhzbz',
    'xsbxbzl',
    'yptka',
    'hhzstgyl',
    'sjjsjq',
    'djdy',
    'btynzywpdm'
]
var DB_DDZ_CHAT_USUALMSG_1 = [
    '你是哪个单位的,出牌这么慢.',
    '眼瞅着都下班了,你快点呗.',
    '哈哈,没了吧.',
    '这牌打的真精彩.',
    '你傻愣的,我们还是朋友.',
    '小树不修不直溜,人不修理哏赳赳.',
    '宁千刀万剐,不胡第一把.',
    '看你打牌可真费劲.',
    '时间就是金钱我的朋友.',
    '大家大业还差这点小钱.',
    '拜托,有你这样玩牌的吗.'
]
var DB_DDZ_CHAT_USUALMSG_0 = [
    '朋友,看你打牌可真费劲.',
    '快点吧，牌在你手上都下崽了.',
    '你要耽误人家约会了.',
    '哈哈,没了吧.',
    '喂,你还在不在.',
    '小树不修不直溜,人不修理哏赳赳.',
    '哟,跑挺快呀!',
    '哈哈,真爽,太过瘾了.',
    '时间就是金钱我的朋友.',
    '大家大业还差这点小钱.',
    '拜托,有你这样玩牌的吗.'
]

var POKERDDZOPTYPE = {
    DOUBLE: "double",
    CHECK: "check",
    SEND: "send",
    LORD: "lord"
}

var DDZCreateBtn = {
    DDZBtn1:"res/Game/Poker/DDZ/Resoures/large/btn_doudizhu01.png",
    DDZBtn2:"res/Game/Poker/DDZ/Resoures/large/btn_doudizhu02.png",
    PDKBtn1:"res/Game/Poker/PDK/Resoures/large/btn_paodekuai01.png",
    PDKBtn2:"res/Game/Poker/PDK/Resoures/large/btn_paodekuai02.png",
}
