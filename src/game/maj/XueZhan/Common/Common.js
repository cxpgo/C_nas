
var XueZhanGameStatus = {
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

var MJXueZhanTipRes = {
    'chi'       : ['btn_chi.png',   'chi.png'],
    'peng'      : ['btn_peng.png',  'cha.png'],
    'gang'      : ['btn_gang.png',  'gang.png'],
    'bu'        : ['btn_gang.png',  'dan.png'],
    'hu'        : ['btn_hu.png',    'hu.png'],
    'guo'       : ['btn_guo.png',   'guo.png'],
    'ting'      : ['btn_ting.png',  'ting.png'],
}

var XueZhanHuSound = {
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

var XueZhanHuWord = {
    0: "平胡",
    1: "清一色",
    2: "对对胡",
    3: "清对",
    4: "七对",
    5: "清七对",
    6: "龙七对",
    7: "清龙七对",
    8: "全幺九",
    9: "将对",
    10: "将七对",
    11: "中张",
    12: "海底捞月",
    13: "海底炮",
    14: "门清",
    15: "夹心五",
    16: "杠上开花",
    17: "杠上炮",
    18: "抢杠胡",
    19: "金钩胡",
    20: "天胡",
    21: "地胡",
    22: "金钩胡",
    23: "将将胡",
}

var XueZhanCommonParam = {
    'PAICARDBACK':(util.getCacheItem('majiang_bg')!=undefined && util.getCacheItem('majiang_bg') != null)?util.getCacheItem('majiang_bg'):8,
    'ShowUpCardHeight':30,
    'MoveUpTime':0.03,
    'MoveDownTime':0.2,
    'PutOut1stTime':0.05,
    'PutOutScale':1.2,
    'PutOut2ndTime':0.1,
    'PutOutScaleBack':0.7,
    'ShowDelayTime':0.3,
    'PutOutScaleReset':1.0,
    'ChatFadeOut':4.0,
    //********quanzhou*********
    'BuhuaDelay':2.0,
    'JinpaiDelay':2.0,
    'JinPaiScale':0.8,
    'My17CardStandScale':1,
    'My17CardShowScale':0.8,
    'My14CardShowScale':0.8,
    'Other17CardStandScale':0.77,
    'Othter17CardShowScale':1,
    'Othter17ShowScale':0.96,
    'Othter14ShowScale':1,
    'Othter17CardRecordScale':1,
    'Othter14CardRecordScale':1,
    'LeftCardGap':0.67,
    'LeftCardWidthGap':0.96,
    'UpCardGap':0.96,
    'UpCardHeightGap':0.72,
    'DownCardGap':0.66,
    'DownCardHeightGap':0.72,
    'DeskOneNum':10,
    'ResultCardScale':1,
    //---------quanzhou-----------
}

var XZCreateBtn = {
    XZBtn1:"res/Game/Maj/XueZhan/Resoures/large/btn_xiezhandaodi01.png",
    XZBtn2:"res/Game/Maj/XueZhan/Resoures/large/btn_xiezhandaodi02.png",
}

var XZGame_Logo = {
    XZLogo:"res/Game/Maj/XueZhan/Resoures/room/img_xuezhan_logo.png",
}

MJXueZhan.Common = {
    GameStatus  : XueZhanGameStatus,
    TipRes      : MJXueZhanTipRes,
    HuSound     : XueZhanHuSound,
    HuWord      : XueZhanHuWord,
};