/**
 * 定义牌的描述
 * @param type 花色
 * @param value 点数
 * @param lv 大小
 * @param lvc 癞子变的值 或者 本身的值
 */
function DDZCard(type, value, lv, lvc) {
    this.type = type;
    this.value = value;
    this.level = DDZ_compare[value];
    this.levelChanged = this.level;
    if (XYGLogic.Instance.changeValue && this.value == XYGLogic.Instance.changeValue.value) {
        this.levelChanged = 16;
    }

    lv && (this.level = lv);
    lvc && (this.levelChanged = lvc);
}

DDZCard.prototype.clone = function () {
    var ret = new Card();
    ret.type = this.type;
    ret.value = this.value;
    ret.level = this.level;
    ret.levelChanged = this.levelChanged;
    return ret;
};
DDZCard.prototype.isChangeCard = function () {
    if (XYGLogic.Instance.changeValue && this.value == XYGLogic.Instance.changeValue.value) {
        return true;
    }
    return false;
};

/**
 * 定义牌的集合 方便处理
 * @type {Function}
 */
var DDZCardSet = cc.Class.extend({
    typeArray: null,
    cards: null,
    cardsLength: 0,
    changeCardCount: 0,
    changedNumber: 0,
    exChangedNumber: 0,
    ctor: function () {
        this.typeArray = new Array();
        this.cards = new Array();
    },
    addCard: function (p1, p2, p3, p4) {
        if (arguments.length === 1) {
            if (typeof (p1) === "object") {
                this.addCardEx(p1.type, p1.value, p1.level, p1.levelChanged);
            }
            else if (typeof (p1) === "number") {
                this.addCardEx(0, 0);
            }
        }
        else if ((arguments.length === 2 ||
                arguments.length === 3) &&
            typeof (p1) === "number" &&
            typeof (p2) === "number") {
            this.addCardEx(p1, p2);

        }
        else if (arguments.length === 4 &&
            typeof (p1) === "number" &&
            typeof (p2) === "number" &&
            typeof (p3) === "number" &&
            typeof (p4) === "number") {
            this.addCardEx(p1, p2, p3, p4);
        }
        else {

        }
    },
    addCardEx: function (type, value, level, levelChanged) {
        var card = new DDZCard(type, value);
        if (level && levelChanged) {
            card.level = level;
            card.levelChanged = levelChanged;
        }
        this.cards.push(card);
        this.cardsLength = this.cards.length;
        if (card.isChangeCard()) {
            this.changeCardCount++;
        }
    },
    addCards: function (cardsSet, len) {
        var cardsLen = cardsSet.currentLength();
        len = len || cardsLen;

        cardsLen = Math.min(cardsLen, len);

        for (var i = 0; i < cardsLen; ++i) {
            this.addCard(cardsSet.getCard(i));
        }
    },
    addType: function (cardType, level, len) {
        var typeInfo = {
            cardsType: cardType,
            maxLevel: level,
            cardsLength: len,
        };
        if (this.checkTypeIsHave(typeInfo)) {
            return;
        }
        this.typeArray.push(typeInfo);
    },
    checkTypeIsHave: function (typeInfo) {
        var ret = false;
        _.each(this.typeArray, function (el) {
            if (el.cardsType == typeInfo.cardsType && el.cardsLength == typeInfo.cardsLength && el.maxLevel == typeInfo.maxLevel) {
                ret = true;
            }
        });
        return ret;
    },
    currentLength: function () {
        return this.cards.length;
    },
    getCard: function (index) {
        if (index >= 0 && index < this.cardsLength) {
            return this.cards[index];
        }
        return new DDZCard(0, 0);
    },
    getCards: function () {
        var newCards = [];
        for (var i = 0; i < this.cardsLength; i++) {
            var newCard = {
                type: this.cards[i].type,
                value: this.cards[i].value,
                level: this.cards[i].level,
                levelChanged: this.cards[i].levelChanged
            }
            newCards.push(newCard);
        }
        return newCards;
    },
    sortByLevel: function () {
        var newCards = this.cards.sort(function (cardA, cardB) {
            if (cardA.levelChanged < cardB.levelChanged) {
                return 1;
            }
            else if (cardA.levelChanged == cardB.levelChanged) {
                if (cardA.levelChanged == 16) {
                    if (cardA.value < cardB.value) {
                        return 1;
                    }
                } else {
                    if (cardA.type < cardB.type) {
                        return 1;
                    }
                }
            }
            return -1;
        });
        this.cards = newCards;
    },
    //未使用的赖子
    getCurrChangeCount: function () {
        var ret = 0;
        this.cards.forEach(function (el, index, arr) {
            if (el.levelChanged === DDZGlobal.CARD_LEVEL_CHANGECARD) {
                ret++;
            }
        });
        return ret;
    },
    getANumberWithoutChangeCard: function (exclude, exclude2) {
        for (var i = 1; i <= 13; ++i) {
            if (i != exclude && i != exclude2 &&
                i != XYGLogic.Instance.changeValue.value && i != this.exChangedNumber) {
                return i;
            }
        }
        return 1;
    },
    /**
     * 根据索引删除牌
     */
    delCardByIndex: function (index) {
        if (this.cards[index].levelChanged === DDZGlobal.CARD_LEVEL_CHANGECARD ||
            this.cards[index].isChangeCard()) {
            --this.changeCardCount;
        }

        this.cards.splice(index, 1);
        return this;
    },

    /**
     * 根据牌信息删除牌，只删除第一张
     */
    delCard: function (p1, p2) {
        var type = 0, value = -1;
        if (typeof (p1) === "object") {
            type = p1.type;
            value = p1.value;
        }
        else if (typeof (p1) === "number" && typeof (p2) === "number") {
            type = p1;
            value = p2;
        }

        if (value >= 0) {
            var self = this;
            this.cards.every(function (element, index) {
                if (element.type === type && element.value === value) {
                    self.delCardByIndex(index);
                    return false;
                }
                return true;
            });
        }
    },

    /**
     * 根据牌集删除牌
     */
    delCards: function (cardsSet, len) {
        var realLen = len || cardsSet.currentLength();
        realLen = Math.max(realLen, cardsSet.currentLength());
        for (var i = 0; i < realLen; ++i) {
            var theCard = cardsSet.getCard(i);
            this.delCard(theCard.type, theCard.value);
        }
        return this;
    },

    /**
     * 根据levelChange 获得不同level牌的数量
     * 方便判断赖子牌是否是变化的
     */
    getLevelTuple: function (levelNumber) {
        if (!levelNumber) {
            return { numCount: 0, numCountWithoutChange: 0 };
        }
        levelNumber.length = DDZGlobal.LEVEL_NUMBER;
        for (var i = 0; i < levelNumber.length; i++) {
            levelNumber[i] = 0;
        }
        this.cards.forEach(function (el) {
            levelNumber[el.levelChanged]++;
        });
        var ret = { numCount: 0, numCountWithoutChange: 0 };
        levelNumber.forEach(function (el) {
            if (el) {
                ret.numCount++;
            }
        });
        ret.numCountWithoutChange = ret.numCount;
        if (levelNumber[DDZGlobal.CARD_LEVEL_CHANGECARD]) {
            ret.numCountWithoutChange--;
        }
        return ret;
    },

    /**
     * 获得牌型信息
     */
    getCardsTypeInfo: function (typeIndex) {
        if (this.typeArray.length > 0) {
            typeIndex = typeIndex || 0;
            typeIndex = Math.max(0, typeIndex);
            typeIndex = Math.min(typeIndex, this.typeArray.length);
            return this.typeArray[typeIndex];
        }
        return {cardsType:0, cardsLength:0, maxLevel:0};
    },
    getCardsType: function (typeIndex) {
        return this.getCardsTypeInfo(typeIndex).cardsType;
    },
    getCardsTypeLength: function (typeIndex) {
        return this.getCardsTypeInfo(typeIndex).cardsLength;
    },
    getCardsTypeMaxLevel: function (typeIndex) {
        return this.getCardsTypeInfo(typeIndex).maxLevel;
    },

    /**
     * 根据牌型自动进行排序
     */
    autoSort: function () {
        var cardsType = this.getCardsType();
        if (cardsType == DouDiZhuType.CT_ERROR) {
            return 0;
        }

        if (cardsType == DouDiZhuType.CT_THREE_LINE_TAKE_ONE ||
            cardsType == DouDiZhuType.CT_THREE_LINE_TAKE_TWO ||
            cardsType == DouDiZhuType.CT_SIX_LINE_TAKE_FORE ||
            cardsType == DouDiZhuType.CT_SIX_LINE_TAKE_SINGLE ||
            cardsType == DouDiZhuType.CT_SIX_LINE_TAKE_DOUBLE ||
            cardsType == DouDiZhuType.CT_FORE_LINE_TAKE_TWO ||
            cardsType == DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE) {
            this.sortByTuple();
            return 1;
        }
        else {
            this.sortByLevel();
            return 2;
        }
    },
    sortByTuple: function () {
        var tupleInfo = [];
        this.getLevelTuple(tupleInfo);
        var newCards = this.cards.sort(function (left, right) {
            if (tupleInfo[left.levelChanged] < tupleInfo[right.levelChanged]) {
                return 1;
            }
            else if (tupleInfo[left.levelChanged] == tupleInfo[right.levelChanged]) {
                if (left.levelChanged < right.levelChanged) {
                    return 1;
                }
            }
            return -1;
        });
        this.cards = newCards;
    }

});