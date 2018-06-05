
var MJBaiShanGameStatus = {
    SEATING:0,
    WATING:1,
    READY: 2,           //准备阶段 1秒进入下一阶段
    INITTABLE: 3,       //初始化牌桌阶段 包括 初始化玩家信息、数据信息、庄家判断、牌的初始化、洗牌、发牌
    HUANSAN:4,
    DINGQUE:5,
    PLAYING:6,          //游戏中状态
    GAMERESULT:7,        //游戏结果阶段 5秒给客户端展示阶段
    GAMEOVER:8           //游戏结束 桌子解散
}

var MJBaiShanHuSound = {
    0:'hu1',
    1:'hu2',
    2:'hu2',
    3:'hu2',
    4:'hu1',
    5:'hu2',
    6:'hu2',
    7:'hu1',
    8:'hu1',
    9:'hu2',
    10:'hu1',
    11:'hu2',
    12:'hu1',
    13:'hu2',
    14:'hu2',
    15:'hu1',
    16:'hu1',
    17:'hu2',
    18:'hu1',
    19:'hu2',
    20:'hu1',
    21:'hu1',
    22:'hu1',
    23:'hu1',
}

var MJBaiShanTipRes = {
    'chi'       : ['btn_chi.png',   'chi.png'],
    'peng'      : ['btn_peng.png',  'cha.png'],
    'gang'      : ['btn_gang.png',  'gang.png'],
    'bu'        : ['btn_gang.png',  'dan.png'],
    'hu'        : ['btn_hu.png',    'hu.png'],
    'guo'       : ['btn_guo.png',   'guo.png'],
    'ting'      : ['btn_ting.png',  'ting.png'],
}

var MJBaiShanHuWord = {
    0: "平胡",
    1: "清一色",
    2: "混一色",
    3: "漂胡",
    4: "立门",//谁也不靠并且自摸
    5: "杠上花",
    6: "抢杠胡",
    7: "杠后炮",
    8: "手把一",
    9: "一般高",
    10: "四归一",
    11: "三花同顺",
    12: "三家清",
    13: "四家清",
    14: "七对",
    15: "十三幺",
    16: "报听",
    17: "包三家",
}
var MJBaiShanDaHuRes = {
    0:'dahu_xiaohu.png',
    1:'dahu_qingyise.png',
    2:'hunyise.png',
    3:'dahu_piaohu.png',
    4:'dahu_limeng.png',
    5:'dahu_gangshangkaihua.png',
    6:'qiangganghu.png',
    7:'dahu_ganghoupao.png',
    8:'dahushoubayi.png',
    9:'yibangao.png',
    10:'siguiyi.png',
    11:'sanhuatongshun.png',
    12:'sanjiaqing.png',
    13:'sijiaqing.png',
    14:'dahu_qixiaodui.png',
    15:'shisanyao.png',
    16:'ting.png',
    17:'baosanjia.png',
}

var BSCreateBtn = {
    BSBtn1:"res/Game/Maj/BaiShan/Resoures/create_room/baishanmajiang.png",
    BSBtn2:"res/Game/Maj/BaiShan/Resoures/create_room/baishanmajiang2.png",
}

var BSGame_Logo = {
     BSLogo:"res/Game/Maj/BaiShan/Resoures/room/img_baishan_logo.png",
}

MJBaiShan.Common = {
    GameStatus  : MJBaiShanGameStatus,
    TipRes      : MJBaiShanTipRes,
    HuSound     : MJBaiShanHuSound,
    HuWord      : MJBaiShanHuWord,
    HuRes       : MJBaiShanDaHuRes,
};