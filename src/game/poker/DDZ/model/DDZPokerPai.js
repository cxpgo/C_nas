var DDZPokerPai = function () {
    var PokerPaiCard = {
        "13": 0, // 方块3
        "23": 1, // 梅花3
        "33": 2, // 红桃3
        "43": 3, // 黑桃3
        "14": 4, // 方块4
        "24": 5, // 梅花4
        "34": 6, // 红桃4
        "44": 7, // 黑桃4
        "15": 8, // 方块5
        "25": 9, // 梅花5
        "35": 10, // 红桃5
        "45": 11, // 黑桃5
        "16": 12, // 方块6
        "26": 13, // 梅花6
        "36": 14, // 红桃6
        "46": 15, // 黑桃6
        "17": 16, // 方块7
        "27": 17, // 梅花7
        "37": 18, // 红桃7
        "47": 19, // 黑桃7
        "18": 20, // 方块8
        "28": 21, // 梅花8
        "38": 22, // 红桃8
        "48": 23, // 黑桃8
        "19": 24, // 方块9
        "29": 25, // 梅花9
        "39": 26, // 红桃9
        "49": 27, // 黑桃9
        "110": 28, // 方块10
        "210": 29, // 梅花10
        "310": 30, // 红桃10
        "410": 31, // 黑桃10
        "111": 32, // 方块J
        "211": 33, // 梅花J
        "311": 34, // 红桃J
        "411": 35, // 黑桃J
        "112": 36, // 方块Q
        "212": 37, // 梅花Q
        "312": 38, // 红桃Q
        "412": 39, // 黑桃Q
        "113": 40, // 方块K
        "213": 41, // 梅花K
        "313": 42, // 红桃K
        "413": 43, // 黑桃K
        "11": 44, // 方块A
        "21": 45, // 梅花A
        "31": 46, // 红桃A
        "41": 47, // 黑桃A
        "12": 48, // 方块2
        "22": 49, // 梅花2
        "32": 50, // 红桃2
        "42": 51, // 黑桃2
        "514": 52, // 小王
        "515": 53 // 大王
    };

    var PokerPaiImage = {
        "blackpoint": {// 黑色点数
            "1": "black_0.png",
            "2": "black_1.png",
            "3": "black_2.png",
            "4": "black_3.png",
            "5": "black_4.png",
            "6": "black_5.png",
            "7": "black_6.png",
            "8": "black_7.png",
            "9": "black_8.png",
            "10": "black_9.png",
            "11": "black_10.png",
            "12": "black_11.png",
            "13": "black_12.png"
        },

        "redpoint": {// 红色点数
            "1": "red_0.png",
            "2": "red_1.png",
            "3": "red_2.png",
            "4": "red_3.png",
            "5": "red_4.png",
            "6": "red_5.png",
            "7": "red_6.png",
            "8": "red_7.png",
            "9": "red_8.png",
            "10": "red_9.png",
            "11": "red_10.png",
            "12": "red_11.png",
            "13": "red_12.png"
        },

        "paiImage": {
            // "00": 'DDZ0x00.png', // 牌背
            "00": 'DDZ1x00.png', // 牌背
            "13": 'DDZ0x03.png', // 方块3
            "23": 'DDZ0x13.png', // 梅花3
            "33": 'DDZ0x23.png', // 红桃3
            "43": 'DDZ0x33.png', // 黑桃3
            "14": 'DDZ0x04.png', // 方块4
            "24": 'DDZ0x14.png', // 梅花4
            "34": 'DDZ0x24.png', // 红桃4
            "44": 'DDZ0x34.png', // 黑桃4
            "15": 'DDZ0x05.png', // 方块5
            "25": 'DDZ0x15.png', // 梅花5
            "35": 'DDZ0x25.png', // 红桃5
            "45": 'DDZ0x35.png', // 黑桃5
            "16": 'DDZ0x06.png', // 方块6
            "26": 'DDZ0x16.png', // 梅花6
            "36": 'DDZ0x26.png', // 红桃6
            "46": 'DDZ0x36.png', // 黑桃6
            "17": 'DDZ0x07.png', // 方块7
            "27": 'DDZ0x17.png', // 梅花7
            "37": 'DDZ0x27.png', // 红桃7
            "47": 'DDZ0x37.png', // 黑桃7
            "18": 'DDZ0x08.png', // 方块8
            "28": 'DDZ0x18.png', // 梅花8
            "38": 'DDZ0x28.png', // 红桃8
            "48": 'DDZ0x38.png', // 黑桃8
            "19": 'DDZ0x09.png', // 方块9
            "29": 'DDZ0x19.png', // 梅花9
            "39": 'DDZ0x29.png', // 红桃9
            "49": 'DDZ0x39.png', // 黑桃9
            "110": 'DDZ0x010.png', // 方块10
            "210": 'DDZ0x110.png', // 梅花10
            "310": 'DDZ0x210.png', // 红桃10
            "410": 'DDZ0x310.png', // 黑桃10
            "111": 'DDZ0x0j.png', // 方块J
            "211": 'DDZ0x1j.png', // 梅花J
            "311": 'DDZ0x2j.png', // 红桃J
            "411": 'DDZ0x3j.png', // 黑桃J
            "112": 'DDZ0x0q.png', // 方块Q
            "212": 'DDZ0x1q.png', // 梅花Q
            "312": 'DDZ0x2q.png', // 红桃Q
            "412": 'DDZ0x3q.png', // 黑桃Q
            "113": 'DDZ0x0k.png', // 方块K
            "213": 'DDZ0x1k.png', // 梅花K
            "313": 'DDZ0x2k.png', // 红桃K
            "413": 'DDZ0x3k.png', // 黑桃K
            "11": 'DDZ0x01.png', // 方块A
            "21": 'DDZ0x11.png', // 梅花A
            "31": 'DDZ0x21.png', // 红桃A
            "41": 'DDZ0x31.png', // 黑桃A
            "12": 'DDZ0x02.png', // 方块2
            "22": 'DDZ0x12.png', // 梅花2
            "32": 'DDZ0x22.png', // 红桃2
            "42": 'DDZ0x32.png', // 黑桃2
            "514": 'DDZ0x41.png', // 小王
            "515": 'DDZ0x42.png' // 大王
        },


        // 获取牌的类型图片
        ImgOfColor: function (pai) {
            var paiColor = pai.key;
            return this["paiImage"][paiColor.toString()];
        },

        // 获取牌的类型图片
        ImgOfCard: function (key) {
            return this["paiImage"][key];
        },
    };

    var PokerPai = cc.Class.extend({
        ctor: function (pai) {
            this.object = {};
            if (typeof (pai) == 'string') {
                this.type = parseInt(pai[0]);
                this.value = parseInt(pai.substr(1, pai.length));
                this.key = pai;
                this.object["type"] = this.type;
                this.object["value"] = this.value;
                this.object["key"] = this.key;

            } else {
                this.type = pai.type;
                this.value = pai.value;
                this.key = this.type + "" + this.value;
                this.object = pai;
            }
            this.num = PokerPaiCard[this.key];
        },

        // 扑克牌的对象，包含类型和值，类型即花色
        objectOfPai: function () {
            return this.object;
        },

        // key,一个字符串值,第一位是花，后面是值1-13
        keyOfPai: function () {
            return this.key;
        },

        valueOfPai: function () {
            return this.value;
        },

        // 编号
        numOfPai: function () {
            return this.num;
        },

        // 是否小王牌
        isSmallJacker: function () {
            return this.value == 14;
        },
        // 是否大王牌
        isBigJacker: function () {
            return this.value == 15;
        },

        imageOfPai: function () {
            return PokerPaiImage.ImgOfCard(this.key);
        },

        // 获取花色image
        colorImageOfPai: function () {
            return PokerPaiImage.ImgOfColor(this.object);
        },
    });

    return PokerPai;
}();


