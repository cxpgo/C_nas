
var MJJiuTaiGameStatus = {
    SEATING:0,
    WATING:1,
    READY: 2,           //准备阶段 1秒进入下一阶段
    INITTABLE: 3,       //初始化牌桌阶段 包括 初始化玩家信息、数据信息、庄家判断、牌的初始化、洗牌、发牌
    PLAYING:4,          //游戏中状态
    GAMERESULT:5,        //游戏结果阶段 5秒给客户端展示阶段
    GAMEOVER:6           //游戏结束 桌子解散
}
var MJJiuTaiTipRes = {
    'chi'       : ['btn_chi.png',   'chi.png'],
    'peng'      : ['btn_peng.png',  'cha.png'],
    'gang'      : ['btn_gang.png',  'gang.png'],
    'bu'        : ['btn_gang.png',  'dan.png'],
    'hu'        : ['btn_hu.png',    'hu.png'],
    'guo'       : ['btn_guo.png',   'guo.png'],
    'ting'      : ['btn_ting.png',  'ting.png'],
}

var MJJiuTaiHuSound = {
    0:'hu1',
    1:'hu2',
    2:'hu2',
    3:'hu2',
    4:'hu1',
    5:'hu2',
}


var MJJiuTaiHuWord = {
    1   : "平胡",
    2   : "夹胡",
    3   : "漂胡",
    4   : "七小对",
    8   : "豪华七小对",
    16  : "双豪华七小对",
    32  : "超豪华七小对",
    50  : "清一色",
    51  : "站立",//门清
    52  : "全球人",
    100 : "搂宝",
    101 : "通宝",
    110 : "杠开胡",
    111 : "杠后炮",
}

var MJJiuTaiDaHuRes = {
    1   : "dahu_xiaohu.png",
    2   : "dahu_jiahu.png",
    3   : "dahu_piaohu.png",
    4   : "dahu_qixiaodui.png",
    8   : "dahu_qixiaodui.png",
    16  : "dahu_shuanghaohua.png",
    32  : "dahu_chaohaohua.png",
    50  : "dahu_qingyise.png",
    51  : "dahu_mengqing.png",
    52  : "dahu_quanqiuren.png",
    100 : "dahu_loubao.png",
    101 : "dahu_tongbao.png",
    110 : "dahu_gangkaihu.png",
    111 : "dahu_ganghoupao.png",
}

var JTGame_Logo = {
    JTLogo:"res/Game/Maj/JiuTai/Resoures/room/img_jiutai_logo.png",
}

MJJiuTai.Common = {
    GameStatus  : MJJiuTaiGameStatus,
    TipRes      : MJJiuTaiTipRes,
    HuSound     : MJJiuTaiHuSound,
    HuWord      : MJJiuTaiHuWord,
    HuRes       : MJJiuTaiDaHuRes,
};

