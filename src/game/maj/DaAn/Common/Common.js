
var MJDaAnGameStatus = {
    SEATING:0,
    WATING:1,
    READY: 2,           //准备阶段 1秒进入下一阶段
    INITTABLE: 3,       //初始化牌桌阶段 包括 初始化玩家信息、数据信息、庄家判断、牌的初始化、洗牌、发牌
    PLAYING:4,          //游戏中状态
    GAMERESULT:5,        //游戏结果阶段 5秒给客户端展示阶段
    GAMEOVER:6           //游戏结束 桌子解散
}

var MJDaAnTipRes = {
    'chi'       : ['btn_chi.png',   'chi.png'],
    'peng'      : ['btn_peng.png',  'cha.png'],
    'gang'      : ['btn_gang.png',  'gang.png'],
    'bu'        : ['btn_gang.png',  'dan.png'],
    'hu'        : ['btn_hu.png',    'hu.png'],
    'guo'       : ['btn_guo.png',   'guo.png'],
    'ting'      : ['btn_ting.png',  'ting.png'],
}

var MJDaAnHuSound = {
    0:'hu1',
    2:'hu2',
    3:'hu2',
    4:'hu1',
    5:'hu2',
    6:'hu1',
    7:'hu2',
    8:'hu1',
    9:'hu1',
    51:'hu2',
    100:'hu1',
    101:'hu2',
    102:'hu1',
}

var MJDaAnHuWord = {
    0: "平胡",
    2: "夹胡",
    3: "漂胡",
    4: "夹五胡",
    5: "孤丁胡",
    6: "清一色",
    7: "清一色夹五胡",
    8: "清一色漂胡",
    9: "清一色孤丁胡",
    51: "三家清",
    100: "摸宝",
    101: "直对宝",
    102: "幺鸡会牌",
}

var MJDaAnDaHuRes = {
    0:'dahu_xiaohu.png',
    2:'dahu_jiahu.png',
    3:'dahu_piaohu.png',
    4:'jiawuhu.png',
    5:'dahu_gudinghu.png',
    6:'dahu_qingyise.png',
    7:'qingyisejiawuhu.png',
    8:'qingyisepiaohu.png',
    9:'qingyisegudinghu.png',
    51:'sanjiaqing.png',
    100:'dahu_mobao.png',
    101:'zhiduibao.png',
    102:'yaojihuipai.png',
}

var DAGame_Logo = {
    DALogo:"res/Game/Maj/DaAn/Resoures/room/img_daan_logo.png",
}

MJDaAn.Common = {
    GameStatus  : MJDaAnGameStatus,
    TipRes      : MJDaAnTipRes,
    HuSound     : MJDaAnHuSound,
    HuWord      : MJDaAnHuWord,
    HuRes       : MJDaAnDaHuRes,
};



