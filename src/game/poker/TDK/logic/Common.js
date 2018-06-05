var TDK_TABLE_TOTAL_PN = 5;

var TABLE_ROLE_OP = {

};

var TDK_ROLE_TYPE = { //玩家角色

};

//操作的类型
var TIANDAKENGTYPE = {
    START: 0,
    TI: 2,    //踢
    PASS: 3,    //过牌
    CALL: 1,    //跟住
    OVER: 4,    //弃牌
    SHOW: 5,    //开牌
    END: 6,    
}

var TDK_COP_TYPE = {
    START   :   0,
    TI      :   2,    //踢
    FT      :   21,   //返踢
    PASS    :   3,    //过牌
    CALL    :   1,    //下注
    GZ      :   11,   //跟注
    OVER    :   4,    //弃牌
    SHOW    :   5,
    END     :   6,
    ZB      :   -100, //准备
}

var TDK_XZ_TYPE = {
    CLICK_T : 1,
    TOUCH_T : 2,
};


var TDK_TABLESTATUS = {
    SEATING: 0,           //没有游戏状态还从没开始过
    WATING: 1,            //休眠状态 没有开始（此时玩家人数不足）
    READY: 2,           //准备阶段 1秒进入下一阶段
    INITTABLE: 3,       //初始化牌桌阶段 包括 初始化玩家信息、数据信息、庄家判断、牌的初始化、洗牌、发牌
    PLAYING: 4,          //游戏中状态
    GAMERESULT: 5,        //游戏结果阶段 5秒给客户端展示阶段
    GAMEOVER: 6           //游戏结束 桌子解散

};

//筹码点数
var TDK_POUR_C = {
    POUR_C0: 1,
    POUR_C1: 2,
    POUR_C2: 5,
    POUR_C3: 5,
};
//筹码值
var TDK_POUR_V = {
    POUR_V1: 1,
    POUR_V2: 2,
    POUR_V3: 3,
    POUR_V4: 4,
    POUR_V5: 5,
};
//筹码数组
var TDK_POUR_Arr = {
    1: [1],
    2: [2],
    3: [1, 2],
    4: [2, 2],
    5: [5],
};

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
var TDKCreateBtn = {
    TDKBtn1:"res/Game/Poker/TDK/Resoures/large/btn_tiandakeng_01.png",
    TDKBtn2:"res/Game/Poker/TDK/Resoures/large/btn_tiandakeng_02.png",
}
