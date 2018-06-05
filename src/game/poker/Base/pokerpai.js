var Poker = {};
Poker.PokerPaiCard = {
    "13" : 0, // 方块3
    "23" : 1, // 梅花3
    "33" : 2, // 红桃3
    "43" : 3, // 黑桃3
    "14" : 4, // 方块4
    "24" : 5, // 梅花4
    "34" : 6, // 红桃4
    "44" : 7, // 黑桃4
    "15" : 8, // 方块5
    "25" : 9, // 梅花5
    "35" : 10, // 红桃5
    "45" : 11, // 黑桃5
    "16" : 12, // 方块6
    "26" : 13, // 梅花6
    "36" : 14, // 红桃6
    "46" : 15, // 黑桃6
    "17" : 16, // 方块7
    "27" : 17, // 梅花7
    "37" : 18, // 红桃7
    "47" : 19, // 黑桃7
    "18" : 20, // 方块8
    "28" : 21, // 梅花8
    "38" : 22, // 红桃8
    "48" : 23, // 黑桃8
    "19" : 24, // 方块9
    "29" : 25, // 梅花9
    "39" : 26, // 红桃9
    "49" : 27, // 黑桃9
    "110" : 28, // 方块10
    "210" : 29, // 梅花10
    "310" : 30, // 红桃10
    "410" : 31, // 黑桃10
    "111" : 32, // 方块J
    "211" : 33, // 梅花J
    "311" : 34, // 红桃J
    "411" : 35, // 黑桃J
    "112" : 36, // 方块Q
    "212" : 37, // 梅花Q
    "312" : 38, // 红桃Q
    "412" : 39, // 黑桃Q
    "113" : 40, // 方块K
    "213" : 41, // 梅花K
    "313" : 42, // 红桃K
    "413" : 43, // 黑桃K
    "11" : 44, // 方块A
    "21" : 45, // 梅花A
    "31" : 46, // 红桃A
    "41" : 47, // 黑桃A
    "12" : -4, // 方块2
    "22" : -3, // 梅花2
    "32" : -2, // 红桃2
    "42" : -1, // 黑桃2
    "414" : 52, // 小王
    "415" : 53, // 大王
};

Poker.PokerPaiImage = {
    "color":{// 花色
        "1":"bigtag_0.png",     // 方块
        "2":"bigtag_1.png",     // 草花
        "3":"bigtag_2.png",     // 红桃
        "4":"bigtag_3.png",     // 黑桃
        "5":"bigtag_3.png",     // 黑桃
        "6":"bigtag_4.png",     // 小王
        "7":"bigtag_5.png"      // 大王

    },
    "blackpoint":{// 黑色点数
        "1":"black_0.png",
        "2":"black_1.png",
        "3":"black_2.png",
        "4":"black_3.png",
        "5":"black_4.png",
        "6":"black_5.png",
        "7":"black_6.png",
        "8":"black_7.png",
        "9":"black_8.png",
        "10":"black_9.png",
        "11":"black_10.png",
        "12":"black_11.png",
        "13":"black_12.png"
    },

    "redpoint":{// 红色点数
        "1":"red_0.png",
        "2":"red_1.png",
        "3":"red_2.png",
        "4":"red_3.png",
        "5":"red_4.png",
        "6":"red_5.png",
        "7":"red_6.png",
        "8":"red_7.png",
        "9":"red_8.png",
        "10":"red_9.png",
        "11":"red_10.png",
        "12":"red_11.png",
        "13":"red_12.png"
    },

    "jackerpoint":{
        "1":"smalltag_4.png",
        "2":"smalltag_5.png"
    },

    "paiImage":{
        // "00" : '0x00.png', // 牌背
        "00" : '1x00.png', // 牌背
        "13" : '0x03.png', // 方块3
        "23" : '0x13.png', // 梅花3
        "33" : '0x23.png', // 红桃3
        "43" : '0x33.png', // 黑桃3
        "14" : '0x04.png', // 方块4
        "24" : '0x14.png', // 梅花4
        "34" : '0x24.png', // 红桃4
        "44" : '0x34.png', // 黑桃4
        "15" : '0x05.png', // 方块5
        "25" : '0x15.png', // 梅花5
        "35" : '0x25.png', // 红桃5
        "45" : '0x35.png', // 黑桃5
        "16" : '0x06.png', // 方块6
        "26" : '0x16.png', // 梅花6
        "36" : '0x26.png', // 红桃6
        "46" : '0x36.png', // 黑桃6
        "17" : '0x07.png', // 方块7
        "27" : '0x17.png', // 梅花7
        "37" : '0x27.png', // 红桃7
        "47" : '0x37.png', // 黑桃7
        "18" : '0x08.png', // 方块8
        "28" : '0x18.png', // 梅花8
        "38" : '0x28.png', // 红桃8
        "48" : '0x38.png', // 黑桃8
        "19" : '0x09.png', // 方块9
        "29" : '0x19.png', // 梅花9
        "39" : '0x29.png', // 红桃9
        "49" : '0x39.png', // 黑桃9
        "110" : '0x010.png', // 方块10
        "210" : '0x110.png', // 梅花10
        "310" : '0x210.png', // 红桃10
        "410" : '0x310.png', // 黑桃10
        "111" : '0x0j.png', // 方块J
        "211" : '0x1j.png', // 梅花J
        "311" : '0x2j.png', // 红桃J
        "411" : '0x3j.png', // 黑桃J
        "112" : '0x0q.png', // 方块Q
        "212" : '0x1q.png', // 梅花Q
        "312" : '0x2q.png', // 红桃Q
        "412" : '0x3q.png', // 黑桃Q
        "113" : '0x0k.png', // 方块K
        "213" : '0x1k.png', // 梅花K
        "313" : '0x2k.png', // 红桃K
        "413" : '0x3k.png', // 黑桃K
        "11" : '0x01.png', // 方块A
        "21" : '0x11.png', // 梅花A
        "31" : '0x21.png', // 红桃A
        "41" : '0x31.png', // 黑桃A
        "12" : '0x02.png', // 方块2
        "22" : '0x12.png', // 梅花2
        "32" : '0x22.png', // 红桃2
        "42" : '0x32.png', // 黑桃2
        "414" : '0x41.png', //小王
        "415" : '0x42.png'  // 大王
    },

    "paiName":{
        "13" : '方块3',
        "23" : '梅花3',
        "33" : '红桃3', //
        "43" : '黑桃3', //
        "14" : '方块4', //
        "24" : '梅花4', //
        "34" : '红桃4', //
        "44" : '黑桃4', //
        "15" : '方块5', //
        "25" : '梅花5', //
        "35" : '红桃5', //
        "45" : '黑桃5', //
        "16" : '方块6', //
        "26" : '梅花6', //
        "36" : '红桃6', //
        "46" : '黑桃6', //
        "17" : '方块7', //
        "27" : '梅花7', //
        "37" : '红桃7', //
        "47" : '黑桃7', //
        "18" : '方块8', //
        "28" : '梅花8', //
        "38" : '红桃8', //
        "48" : '黑桃8', //
        "19" : '方块9', //
        "29" : '梅花9', //
        "39" : '红桃9', //
        "49" : '黑桃9', //
        "110" : '方块10', //
        "210" : '梅花10', //
        "310" : '红桃10', //
        "410" : '黑桃10', //
        "111" : '方块J', //
        "211" : ' 梅花J', //
        "311" : '红桃J', //
        "411" : '黑桃J', //
        "112" : '方块Q', //
        "212" : '梅花Q', //
        "312" : '红桃Q', //
        "412" : '黑桃Q', //
        "113" : '方块K', //
        "213" : '梅花K', //
        "313" : '红桃K', //
        "413" : '黑桃K', //
        "11" : '方块A', //
        "21" : '梅花A', //
        "31" : '红桃A', //
        "41" : '黑桃A', //
        "12" : '方块2', //
        "22" : '梅花2', //
        "32" : '红桃2', //
        "42" : '黑桃2', //
        "315" : '小王', //
        "415" : '大王'  //
    },

    // 获取牌的类型图片
    ImgOfColor: function (pai) {
      var paiColor = pai.type;
      return this["color"][paiColor.toString()];
    },

    // 获取牌的类型图片
    ImgOfCard: function (key) {
        return this["paiImage"][key];
    },

    // 获取牌的点数图片
    ImgOfPoint:function(pai){
        var paiColor = pai.type;
        var paiPoint = pai.value;
        if(paiColor == 6)
            return this["jackerpoint"]["1"];
        if(paiColor == 7)
            return this["jackerpoint"]["2"];
        if(paiColor == 1 || paiColor == 3 )
            return this["redpoint"][paiPoint.toString()];
        return this["blackpoint"][paiPoint.toString()];
    }
};

Poker.PokerPai = cc.Class.extend({
    ctor: function (pai) {
        this.object = {};
        if (typeof(pai) == 'string') {
            this.type = parseInt(pai[0]);
            this.value = parseInt(pai.substr(1,pai.length));
            this.key = pai;
            this.object["type"] = this.type;
            this.object["value"] = this.value;

        } else {
            this.type = pai.type;
            this.value = pai.value;
            this.key = this.type+""+this.value;
            this.object = pai;
        }
        this.num = Poker.PokerPaiCard[this.key];
    },

    // 扑克牌的对象，包含类型和值，类型即花色
    objectOfPai: function () {
      return this.object;
    },

    // key,一个字符串值,第一位是花，后面是值1-13
    keyOfPai: function () {
      return this.key;
    },

    // 编号
    numOfPai: function () {
      return this.num;
    },

    // 是否王牌
    isJacker: function() {
        return this.value == 14;
     },

    imageOfPai:function(){
        return "DDZ"+Poker.PokerPaiImage.ImgOfCard(this.key);
    },

    // 获取花色image
    colorImageOfPai:function(){
        return Poker.PokerPaiImage.ImgOfColor(this.object);
    },

    // 获取点数图片
    pointImageOfPai:function(){
        return Poker.PokerPaiImage.ImgOfPoint(this.object);
    }
});

