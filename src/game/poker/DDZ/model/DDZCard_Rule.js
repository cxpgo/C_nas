//                    0  A  2  3  4  5  6  7  8  9  10 J  Q  K
var DDZ_compare = [0, 12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15];
//用于还原大小的数组
var DDZ_uncompare = [0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 14, 15];

var PISACOUNT = 16;									//每个玩家的牌数

var DDZCard_Rule = {};

//todo 检查是否能出牌 并且返回能出的具体牌型数组 以便进行出牌时进行选择
DDZCard_Rule.checkAndCompareCards = function (cur_cards, pre_cards, pre_cards_type, outCardsArr) {
    var obCards = this.cardsToCardsSet(cur_cards);
    obCards.sortByLevel();
    var tmpCardsArr = [];
    this.setCardType(obCards, tmpCardsArr);

    //不成牌型，不能出
    if (tmpCardsArr.length == 0) {
        //trace(1)
        return false;
    }
    var preCards = this.cardsToCardsSet(pre_cards);
    preCards.sortByLevel();
    this.setCardType(preCards);
    var pre_types = preCards.getCardsTypeInfo();
    this.filterOutCardsArr(obCards, pre_types, tmpCardsArr, outCardsArr);

    if (outCardsArr.length == 0) {
        //trace(1)
        return false;
    } else {
        return true;
    }

};

/**
 * 筛选出比上一手牌型大的牌
 * 并且如果同一种牌型存在多个 则取最大和最小key的牌
 * @param obCards
 * @param outCardsArr
 * @param pre_cards_type
 * @param pre_cards
 */
DDZCard_Rule.filterOutCardsArr = function (obCards, pre_cards_type, tmpCardsArr, outCardsArr) {
    var obTypes = obCards.typeArray;
    //todo 如果存在上一手牌型
    var tempArray = [];
    for (var i = 0; i < obTypes.length; i++) {
        var first = obTypes[i];
        if (this.isFirstCardsBig(first, pre_cards_type)) {
            tempArray.push(first);
        }
    }
    if (tempArray.length == 0) {
        return;
    }
    //todo 去除同一类型太多的情况 取最大和最小值
    var filterArr1 = [];
    var filterObj = {};
    for(var i = 0; i < tempArray.length; i++) {
        var type = tempArray[i].cardsType;
        if (type == DouDiZhuType.CT_THREE_LINE_TAKE_TWO || type == DouDiZhuType.CT_THREE_LINE_TAKE_ONE ||
            type == DouDiZhuType.CT_FORE_LINE_TAKE_TWO || type == DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE) {
            if (!filterObj[type]) {
                filterObj[type] = [];
            }
            filterObj[type].push(tempArray[i]);
        } else {
            filterArr1.push(tempArray[i]);
        }
    }
    for (var key in filterObj) {
        if (filterObj.hasOwnProperty(key)) {
            if(filterObj[key].length > 2) {
                filterArr1.push(filterObj[key][0]);
                filterArr1.push(filterObj[key][filterObj[key].length - 1]);
            } else {
                filterObj[key].forEach(function (el) {
                    filterArr1.push(el);
                })
            }
        }
    }

    filterArr1.forEach(function (el2) {
        for(var key = 0; key < tmpCardsArr.length; key++) {
            var el = tmpCardsArr[key];
            if (el.getCardsType() == el2.cardsType && el.getCardsTypeLength() == el2.cardsLength && el.getCardsTypeMaxLevel() == el2.maxLevel) {
                outCardsArr.push(el);
                break;
            }
        }
    })
};

DDZCard_Rule.isFirstCardsBig = function (first, second) {
    var ret = true;
    var firstType = first.cardsType;
    var secondType = second.cardsType;
    if (firstType != secondType || first.maxLevel <= second.maxLevel || first.cardsLength != second.cardsLength) {
        ret = false;
    }
    if (!secondType || secondType == DouDiZhuType.CT_ERROR) {
        ret = true;
    }
    if (!ret) {
        if (firstType == DouDiZhuType.CT_KING_BOMB) {
            ret = true;
        } else if (secondType == DouDiZhuType.CT_KING_BOMB) {
            ret = false;
        } else if (firstType == DouDiZhuType.CT_BOMB) {
            //只有第一个为炸弹才有必要进行比较 不然前面的判断已经足够
            if (secondType != DouDiZhuType.CT_BOMB) {
                ret = true;
            } else {
                //炸弹我这里是以cardsLength来作为不同类型的大小判断标准
                if (first.cardsLength > second.cardsLength) {
                    ret = true;
                } else if (first.cardsLength == second.cardsLength) {
                    if (first.maxLevel > second.maxLevel) {
                        ret = true;
                    }
                }
            }
        }
    }
    return ret;
};

DDZCard_Rule.getCardType = function (cards) {
};

/**
 * * 获得传入牌集的所有可能牌型
 * 把传入的牌集的所有可能的牌型都push进数组
 * @param cards 传入的牌集
 * @param outCardsArr 返回的数组
 */
DDZCard_Rule.setCardType = function (cardsSet, outCardsArr) {
    var c = cardsSet.currentLength();
    if (c == 1) {            //单张
        this.isDan(cardsSet, outCardsArr);
    } else if (c === 2) {     //王炸 or 一对
        this.isDuiwang(cardsSet, outCardsArr);
        this.isDuizi(cardsSet, outCardsArr);
    } else if (c === 3) {     //三
        this.isSan(cardsSet, outCardsArr)
    } else if (c === 4) {     //三带一 or 炸弹
        this.isBoom(cardsSet, outCardsArr);
        this.isSandaiyi(cardsSet, outCardsArr);
    } else if (c === 5) {
        this.isBoom(cardsSet, outCardsArr);
        this.isSandaidui(cardsSet, outCardsArr);
        this.isShunzi(cardsSet, outCardsArr);
    } else if (c > 5) {
        this.isBoom(cardsSet, outCardsArr);
        this.isShunzi(cardsSet, outCardsArr);
        this.isLiandui(cardsSet, outCardsArr);
        this.isFeiji(cardsSet, outCardsArr);
        this.isFeijidaidan(cardsSet, outCardsArr);
        this.isFeijidaidui(cardsSet, outCardsArr);
        this.isSidaier(cardsSet, outCardsArr);
        this.isSidaierdui(cardsSet, outCardsArr);
    }
};

DDZCard_Rule.isDan = function (obCards, outCardsArr) {
    if (obCards.currentLength() === 1) {
        var level = obCards.getCard(0).levelChanged;
        if (level === 16) {
            level = DDZ_compare[obCards.getCard(0).value];
        }
        obCards.addType(DouDiZhuType.CT_SINGLE, level, 1);

        if (outCardsArr) {
            var cardsTemp = new DDZCardSet();
            cardsTemp.addCards(obCards);
            cardsTemp.addType(DouDiZhuType.CT_SINGLE, level, 1);
            outCardsArr.push(cardsTemp);
        }
        return true;
    }
    return false;
};

DDZCard_Rule.isDuizi = function (obCards, outCardsArr) {
    if (obCards.currentLength() === 2) {
        //天地赖子 会出现赖子不同值 不能组成对子
        if (obCards.getCard(0).levelChanged == 16 &&
            obCards.getCard(1).levelChanged == 16 &&
            obCards.getCard(0).value != obCards.getCard(1).value) {
            return false;
        }
        if ((obCards.getCard(0).levelChanged == obCards.getCard(1).levelChanged || obCards.changeCardCount > 0) &&
            obCards.getCard(1).levelChanged != 14 && obCards.getCard(1).levelChanged != 15) {
            var cardsTemp = new DDZCardSet();
            var levelTemp = 0;
            if (obCards.changeCardCount === 2) {
                levelTemp = DDZ_compare[obCards.getCard(0).value];
            } else {
                levelTemp = obCards.getCard(1).levelChanged;
            }
            obCards.addType(DouDiZhuType.CT_DOUBLE, levelTemp, 1);

            if (outCardsArr) {
                cardsTemp.addCardEx(obCards.getCard(0).type,
                    obCards.getCard(0).value,
                    obCards.getCard(0).level,
                    levelTemp);
                cardsTemp.addCardEx(obCards.getCard(1).type,
                    obCards.getCard(1).value,
                    obCards.getCard(1).level,
                    levelTemp);
                cardsTemp.addType(DouDiZhuType.CT_DOUBLE, levelTemp, 1);
                outCardsArr.push(cardsTemp);
            }
            return true;
        }
    }
    return false;
};

DDZCard_Rule.isDuiwang = function (obCards, outCardsArr) {
    if (2 == obCards.currentLength()) {
        var i = 0;
        for (i = 0; i < 2; ++i) {
            if (obCards.getCard(i).value != 15 && obCards.getCard(i).value != 14) {
                return false;
            }
        }
        obCards.addType(DouDiZhuType.CT_KING_BOMB, obCards.getCard(0).levelChanged, 1);

        if (outCardsArr) {
            outCardsArr.push(obCards);
        }

        return true;
    }
    return false;
};

DDZCard_Rule.isSan = function (obCards, outCardsArr) {
    if (3 == obCards.currentLength()) {
        var sameLevel = 0;
        var value = obCards.getCard(0).value;

        if (obCards.getCard(0).levelChanged === 16 &&
            obCards.getCard(1).levelChanged === 16 &&
            obCards.getCard(2).levelChanged === 16) {
            if (obCards.getCard(1).value !== value ||
                obCards.getCard(2).value !== value) {
                return false;
            }
        }
        var levelNum = [];
        obCards.getLevelTuple(levelNum);
        if (this._checkCardsJokerPossible(levelNum)) {
            return false;
        }
        var ret = obCards.cards.every(function (el, index, arr) {
            if (el.levelChanged !== 16) {
                if (sameLevel === 0) {
                    sameLevel = el.levelChanged;
                } else {
                    if (sameLevel !== el.levelChanged) {
                        return false;
                    }
                }
            }
            return true;
        });
        if (!ret) {
            return false;
        }
        var cardsTemp = new DDZCardSet();
        var levelTemp = 0;
        if (obCards.changeCardCount == 3) {
            levelTemp = this.getGrade(value);
        } else {
            levelTemp = obCards.getCard(2).levelChanged;
        }

        obCards.addType(DouDiZhuType.CT_THREE, levelTemp, 1);
        if (outCardsArr) {
            for (var i = 0; i < 3; i++) {
                cardsTemp.addCardEx(obCards.getCard(i).type,
                    obCards.getCard(i).value,
                    obCards.getCard(i).level,
                    levelTemp);
            }
            cardsTemp.addType(DouDiZhuType.CT_THREE, levelTemp, 1);
            outCardsArr.push(cardsTemp);
        }

        return true;
    }
    return false;
};

DDZCard_Rule.isSandaiyi = function (obCards, outCardsArr) {
    var ret = false;
    if (4 == obCards.currentLength() && obCards.changeCardCount < 4) {
        var levelTuple = [];
        var numCountWithoutChange = obCards.getLevelTuple(levelTuple).numCountWithoutChange;
        if (numCountWithoutChange >= 3) {
            return false;
        }
        var i = 0, j = 0;
        var changeCount = obCards.getCurrChangeCount();

        if (changeCount > 3) {
            return false;
        }
        if (changeCount == 3) {
            for (i = 1; i < 14; ++i) {
                if (outCardsArr) {
                    var cardsTemp = new DDZCardSet();
                    var bingoNum = 3;
                    if (i == obCards.cards[bingoNum].levelChanged) {
                        var level = this.valueToLevel(obCards.getANumberWithoutChangeCard(i));
                        cardsTemp.addCardEx(obCards.getCard(0).type, obCards.getCard(0).value,
                            obCards.getCard(0).level, level);
                        for (j = 1; j < 4; ++j) {
                            cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value,
                                obCards.getCard(j).level, obCards.getCard(bingoNum).levelChanged);
                        }
                    }
                    else {
                        for (j = 0; j < 3; ++j) {
                            cardsTemp.addCard(obCards.getCard(j).type, obCards.getCard(j).value,
                                obCards.getCard(j).level, i);
                        }
                        cardsTemp.addCard(obCards.getCard(3).type, obCards.getCard(3).value,
                            obCards.getCard(3).level, obCards.getCard(3).levelChanged);
                    }
                    cardsTemp.addType(DouDiZhuType.CT_THREE_LINE_TAKE_ONE, i, 1);
                    outCardsArr.push(cardsTemp);
                }
                obCards.addType(DouDiZhuType.CT_THREE_LINE_TAKE_ONE, i, 1);
            }
            return true;
        } else {
            for (var key = 13; key > 0; --key) {
                if (levelTuple[key] > 3) {
                    return false;
                }
                var num3Count = 0;
                var cardsTemp = new DDZCardSet();
                if (levelTuple[key] + changeCount >= 3) {
                    for (j = changeCount; j < obCards.currentLength(); ++j) {
                        if (obCards.getCard(j).levelChanged == key) {
                            ++num3Count;
                            cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value);
                            if (num3Count >= 3) {
                                break;
                            }
                        }
                    }
                    j = 0;
                    var leftChange = changeCount;
                    if (num3Count < 3) {
                        for (j = 0; j < 3 - levelTuple[key]; ++j) {
                            cardsTemp.addCardEx(obCards.getCard(j).type,
                                obCards.getCard(j).value, obCards.getCard(j).level, key);
                            --leftChange;
                        }
                    }
                    if (outCardsArr) {
                        if (leftChange > 0) {
                            cardsTemp.addCardEx(obCards.getCard(j).type,
                                obCards.getCard(j).value,
                                obCards.getCard(j).level,
                                this.getGrade(obCards.getCard(j).value));
                        } else {
                            var tmpCard = new DDZCardSet();
                            tmpCard.addCards(obCards);
                            tmpCard.delCards(cardsTemp);
                            cardsTemp.addCards(tmpCard);
                        }
                        cardsTemp.addType(DouDiZhuType.CT_THREE_LINE_TAKE_ONE, key, 1);
                        outCardsArr.push(cardsTemp);
                    }
                    obCards.addType(DouDiZhuType.CT_THREE_LINE_TAKE_ONE, key, 1);
                    ret = true;
                }
            }
        }
    }
    return ret;
};

DDZCard_Rule.isSandaidui = function (obCards, outCardsArr) {
    var ret = false;
    if (5 == obCards.currentLength() && obCards.changeCardCount < 5) {
        var levelTuple = [];
        var numCountWithoutChange = obCards.getLevelTuple(levelTuple).numCountWithoutChange;
        if (numCountWithoutChange >= 3 || this._checkCardsJokerPossible(levelTuple)) {
            return false;
        }
        var i = 0, j = 0;

        for (i = 1; i < 14 && i < levelTuple.length; ++i) {
            if (levelTuple[i] > 3) {
                return false;
            }
        }

        var numLevel = 0;
        var isFind = false;
        var maxLevel = 0;
        var changeCount = obCards.getCurrChangeCount();

        if (changeCount == 3) {
            // todo 三个赖子加两张单牌的情况 可以有两种配牌
            if (numCountWithoutChange == 2) {
                if (outCardsArr) {
                    var cardsTemp = new DDZCardSet();
                    for (i = 0; i < 2; ++i) {
                        cardsTemp.addCardEx(obCards.getCard(i).type, obCards.getCard(i).value,
                            obCards.getCard(i).level, obCards.getCard(3).level)
                    }
                    cardsTemp.addCardEx(obCards.getCard(2).type, obCards.getCard(2).value,
                        obCards.getCard(2).level, obCards.getCard(4).level);
                    for (i = 3; i < 5; i++) {
                        cardsTemp.addCardEx(obCards.getCard(i).type, obCards.getCard(i).value,
                            obCards.getCard(i).level, obCards.getCard(i).level);
                    }
                    cardsTemp.addType(DouDiZhuType.CT_THREE_LINE_TAKE_TWO, obCards.getCard(3).level, 1);
                    outCardsArr.push(cardsTemp);
                }
                if (outCardsArr) {
                    var cardsTemp = new DDZCardSet();
                    for (i = 0; i < 2; ++i) {
                        cardsTemp.addCardEx(obCards.getCard(i).type, obCards.getCard(i).value,
                            obCards.getCard(i).level, obCards.getCard(4).level)
                    }
                    cardsTemp.addCardEx(obCards.getCard(2).type, obCards.getCard(2).value,
                        obCards.getCard(2).level, obCards.getCard(3).level);
                    for (i = 3; i < 5; i++) {
                        cardsTemp.addCardEx(obCards.getCard(i).type, obCards.getCard(i).value,
                            obCards.getCard(i).level, obCards.getCard(i).level);
                    }
                    cardsTemp.addType(DouDiZhuType.CT_THREE_LINE_TAKE_TWO, obCards.getCard(4).level, 1);
                    outCardsArr.push(cardsTemp);
                }
            } else if (numCountWithoutChange == 1) {
                //todo 一个对子加3张赖子的情况
                for (i = 1; i < 14; i++) {
                    if (outCardsArr) {
                        var cardsTemp = new DDZCardSet();
                        if (i == obCards.getCard(4).levelChanged) {
                            cardsTemp.addCardEx(obCards.getCard(0).type, obCards.getCard(0).value,
                                obCards.getCard(0).level, obCards.getCard(4).levelChanged);
                            var level = this.valueToLevel(obCards.getANumberWithoutChangeCard(i));
                            for (j = 1; j < 3; j++) {
                                cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value,
                                    obCards.getCard(j).level, level)
                            }
                            for (j = 3; j < 5; j++) {
                                cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value,
                                    obCards.getCard(j).level, obCards.getCard(j).levelChanged);
                            }
                        } else {
                            for (j = 0; j < 3; j++) {
                                cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value,
                                    obCards.getCard(j).level, i);
                            }
                            for (j = 3; j < 5; j++) {
                                cardsTemp.addCard(obCards.getCard(j).type, obCards.getCard(j).value,
                                    obCards.getCard(j).level, obCards.getCard(j).levelChanged);
                            }
                        }
                        cardsTemp.addType(DouDiZhuType.CT_THREE_LINE_TAKE_TWO, i, 1);
                        outCardsArr.push(cardsTemp);
                    }
                    obCards.addType(DouDiZhuType.CT_THREE_LINE_TAKE_TWO, i, 1);
                }
            }
            return true;
        }
        if (changeCount == 4) {
            for (i = 1; i < 14; ++i) {
                if (outCardsArr) {
                    var cardsTemp = new DDZCardSet();
                    if (i == obCards.getCard(4).levelChanged) {
                        cardsTemp.addCardEx(obCards.getCard(0).type, obCards.getCard(0).value,
                            obCards.getCard(0).level, obCards.getCard(4).levelChanged);
                        var level = this.valueToLevel(obCards.getANumberWithoutChangeCard(i));
                        for (j = 1; j < 3; j++) {
                            cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value,
                                obCards.getCard(j).level, level)
                        }
                        for (j = 3; j < 5; j++) {
                            cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value,
                                obCards.getCard(j).level, obCards.getCard(4).levelChanged);
                        }
                    } else {
                        for (j = 0; j < 3; j++) {
                            cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value,
                                obCards.getCard(j).level, i);
                        }
                        for (j = 3; j < 5; j++) {
                            cardsTemp.addCard(obCards.getCard(j).type, obCards.getCard(j).value,
                                obCards.getCard(j).level, obCards.getCard(4).levelChanged);
                        }
                    }
                    cardsTemp.addType(DouDiZhuType.CT_THREE_LINE_TAKE_TWO, i, 1);
                    outCardsArr.push(cardsTemp);
                }
                obCards.addType(DouDiZhuType.CT_THREE_LINE_TAKE_TWO, i, 1);
            }
            return true;
        } else {
            for (var key = 13; key > 0; --key) {
                if (levelTuple[key] > 0) {
                    var num3Count = 0;
                    var cardsTemp = new DDZCardSet();
                    if ((levelTuple[key] + changeCount) >= 3) {
                        for (j = changeCount; j < obCards.currentLength(); ++j) {
                            if (obCards.getCard(j).levelChanged == key) {
                                ++num3Count;
                                cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value);
                                if (num3Count >= 3) {
                                    break;
                                }
                            }
                        }
                        j = 0;
                        var leftChange = changeCount;
                        if (num3Count < 3) {
                            for (j = 0; j < 3 - levelTuple[key]; ++j) {
                                cardsTemp.addCardEx(obCards.getCard(j).type,
                                    obCards.getCard(j).value, obCards.getCard(j).level, key);
                                --leftChange;
                            }
                        }
                        var tmpCard = new DDZCardSet();
                        tmpCard.addCards(obCards);
                        tmpCard.delCards(cardsTemp);
                        tmpCard.sortByLevel();

                        //剩下的牌里面还有赖子
                        if (leftChange > 0) {
                            if (outCardsArr) {
                                if (tmpCard.currentLength() == leftChange) {
                                    var nLv1 = this.getGrade(tmpCard.getCard(i));
                                    if (nLv1 == 14 || nLv1 == 15) {
                                        nLv1 = this.valueToLevel(cardsTemp.getANumberWithoutChangeCard(cardsTemp.getCard(0).levelChanged));
                                    }
                                    cardsTemp.addCardEx(tmpCard.getCard(0).type,
                                        tmpCard.getCard(0).value,
                                        tmpCard.getCard(0).level,
                                        nLv1);
                                    cardsTemp.addCardEx(tmpCard.getCard(0).type,
                                        tmpCard.getCard(1).value,
                                        tmpCard.getCard(1).level,
                                        nLv1);
                                } else {
                                    //todo 一张单牌 加一张赖子 一种情况
                                    cardsTemp.addCard(tmpCard.getCard(1));
                                    cardsTemp.addCardEx(tmpCard.getCard(0).type,
                                        tmpCard.getCard(0).value,
                                        tmpCard.getCard(0).level,
                                        tmpCard.getCard(1).levelChanged);
                                }
                                cardsTemp.addType(DouDiZhuType.CT_THREE_LINE_TAKE_TWO, key, 1);
                                outCardsArr.push(cardsTemp);
                            }
                            obCards.addType(DouDiZhuType.CT_THREE_LINE_TAKE_TWO, key, 1);
                            ret = true;
                        } else {
                            //牌里面没有赖子 看两张牌是否相等
                            if (tmpCard.getCard(0).levelChanged == tmpCard.getCard(1).levelChanged) {
                                if (outCardsArr) {
                                    cardsTemp.addCard(tmpCard.getCard(0));
                                    cardsTemp.addCard(tmpCard.getCard(1));
                                    cardsTemp.addType(DouDiZhuType.CT_THREE_LINE_TAKE_TWO, key, 1);
                                    outCardsArr.push(cardsTemp);
                                }

                                obCards.addType(DouDiZhuType.CT_THREE_LINE_TAKE_TWO, key, 1);
                                ret = true;
                            }
                        }
                    }
                }
            }
        }
    }
    return ret;
};
//todo 癞子产生的牌型 纯癞子炸弹 软炸 长炸
DDZCard_Rule.isSoftSi = function (cards) {
};

DDZCard_Rule.isChangeSi = function (cards) {
};

DDZCard_Rule.isLongBoom = function (cards) {
};

DDZCard_Rule.isBoom = function (obCards, outCardsArr) {
    var bRst = false;
    if (obCards.currentLength() >= 4) {
        var cLevelNumber = [];
        var nLevelNum = obCards.getLevelTuple(cLevelNumber).numCountWithoutChange;
        ;
        if (nLevelNum > 1 || this._checkCardsJokerPossible(cLevelNumber)) // 不能有王 并且非赖子牌不能超过一种
        {
            return false;
        }
        var lastCard = obCards.getCard(obCards.currentLength() - 1);
        for (var i = 0; i < obCards.currentLength(); i++) {
            if (!obCards.getCard(i).isChangeCard()) {
                lastCard = obCards.getCard(i);
                break;
            }
        }
        var maxLevel = lastCard.level;

        var cChangeCount = obCards.getCurrChangeCount();
        var cLength = obCards.currentLength();
        //这里要用牌的所有赖子判断 服务器使用 客户端验证也可使用 不验证就不用了
        var nchangeCardCount = obCards.changeCardCount;
        var mLevel = 0;
        var i = 0,
            j = 0,
            k = 0;
        if (cLength == nchangeCardCount) {
            //都是赖子牌 则必须都是相同点数的赖子
            var ret = obCards.cards.every(function (el, index, arr) {
                if (el.value != obCards.getCard(0).value) {
                    return false;
                }
                return true;
            });
            if (ret) {
                mLevel = cLength + 1;
            } else {
                return false;
            }
        } else if (cLength == 4 && nchangeCardCount == 0) {
            mLevel = cLength;
        } else if (cLength == 4 && nchangeCardCount > 0) {
            mLevel = 1;
        } else if (cLength > 4) {
            mLevel = cLength;
        }

        var cardTemp = new DDZCardSet();
        for (i = 0; i < cChangeCount; i++) {
            cardTemp.addCardEx(obCards.getCard(i).type,
                obCards.getCard(i).value,
                obCards.getCard(i).level,
                maxLevel);
        }
        for (j = cChangeCount; j < cLength; j++) {
            cardTemp.addCard(obCards.getCard(j));
        }

        cardTemp.addType(DouDiZhuType.CT_BOMB, maxLevel, mLevel);

        if (outCardsArr) {
            outCardsArr.push(cardTemp);
        }

        obCards.addType(DouDiZhuType.CT_BOMB, maxLevel, mLevel);

    }
    return bRst;
};

DDZCard_Rule.isSidaier = function (obCards, outCardsArr) {
    var bRst = false;
    var cChangeCount = obCards.getCurrChangeCount();
    if (6 == obCards.currentLength() &&
        obCards.changeCardCount < 6) // 不全是癞子才进这里
    {
        var cLevelNumber = [];
        var nLevelNum = obCards.getLevelTuple(cLevelNumber).numCount;
        if (nLevelNum <= 1) // 炸弹
        {
            return false;
        }

        var nChangeID = 0;
        var i = 0,
            j = 0;
        var bRes = false;
        var nlevel = 0;

        //////////////////////////////////////////////////////////////////////////
        /// 如果是有4个或以上癞子
        if (cChangeCount >= 4) {
            if (cChangeCount === 5 ||
                (cChangeCount === 4 && obCards.getCard(4).levelChanged !== obCards.getCard(5).levelChanged)) { // 所有情况
                for (i = 1; i < 14; i++) {
                    if (outCardsArr) {
                        var cardsTemp = new DDZCardSet();
                        var cLevel = this.valueToLevel(obCards.getANumberWithoutChangeCard(obCards.getCard(5).value));
                        cardsTemp.addCardEx(obCards.getCard(4).type,
                            obCards.getCard(4).value,
                            obCards.getCard(4).level,
                            obCards.getCard(4).levelChanged == 16 ? cLevel : obCards.getCard(4).levelChanged);
                        cLevel = obCards.getCard(4).levelChanged;
                        cardsTemp.addCardEx(obCards.getCard(5).type,
                            obCards.getCard(5).value,
                            obCards.getCard(5).level,
                            obCards.getCard(5).levelChanged);

                        if (i === obCards.getCard(5).levelChanged ||
                            i === cLevel) {
                            var nTri = i;
                            var cLevelNext = this.valueToLevel(obCards.getANumberWithoutChangeCard(obCards.getCard(5).value, this.levelToValue(cLevel)));
                            for (j = 0; j < 3; j++) {
                                cardsTemp.addCardEx(obCards.getCard(j).type,
                                    obCards.getCard(j).value,
                                    obCards.getCard(j).level,
                                    nTri);
                            }
                            cardsTemp.addCardEx(obCards.getCard(3).type,
                                obCards.getCard(3).value,
                                obCards.getCard(3).level,
                                cLevelNext);
                        } else {
                            for (j = 0; j < 4; j++) {
                                cardsTemp.addCardEx(obCards.getCard(j).type,
                                    obCards.getCard(j).value,
                                    obCards.getCard(j).level,
                                    i);
                            }
                        }

                        cardsTemp.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO, i, 1);
                        outCardsArr.push(cardsTemp);
                    }

                    obCards.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO, i, 1);
                }
            } else if (cChangeCount === 4 &&
                obCards.getCard(4).levelChanged === obCards.getCard(5).levelChanged) { // 所有情况
                var cDual = obCards.getCard(4).levelChanged;
                for (i = 1; i < 14; i++) {
                    if (outCardsArr) {
                        var cardsTemp = new DDZCardSet();
                        if (i === cDual) {
                            var cLevelPlus = [];
                            cLevelPlus[0] = this.valueToLevel(obCards.getANumberWithoutChangeCard(this.levelToValue(cDual)));
                            cLevelPlus[1] = this.valueToLevel(obCards.getANumberWithoutChangeCard(this.levelToValue(cDual), this.levelToValue(cLevelPlus[0])));

                            for (j = 0; j < 2; j++) {
                                cardsTemp.addCardEx(obCards.getCard(j).type,
                                    obCards.getCard(j).value,
                                    obCards.getCard(j).level,
                                    cLevelPlus[j]);
                            }
                            for (j = 2; j < 6; j++) {
                                cardsTemp.addCardEx(obCards.getCard(j).type,
                                    obCards.getCard(j).value,
                                    obCards.getCard(j).level,
                                    cDual);
                            }
                            cardsTemp.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO, i, 1);
                            outCardsArr.push(cardsTemp);
                        } else {
                            for (j = 0; j < 4; j++) {
                                cardsTemp.addCardEx(obCards.getCard(j).type,
                                    obCards.getCard(j).value,
                                    obCards.getCard(j).level,
                                    i);
                            }
                            for (j = 4; j < 6; j++) {
                                cardsTemp.addCardEx(obCards.getCard(j).type,
                                    obCards.getCard(j).value,
                                    obCards.getCard(j).level,
                                    cDual);
                            }
                            cardsTemp.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO, i, 1);
                            outCardsArr.push(cardsTemp);
                        }
                    }

                    obCards.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO, i, 1);
                }
            }
            bRst = true;
        } else {
            if (obCards.getCurrChangeCount() == obCards.currentLength()) {
                return false;
            }

            /// 如果不是4个癞子+两张的情况
            for (i = 13; i > 0; --i) {
                if (cLevelNumber[i] + cChangeCount >= 4) {
                    var cardsTemp = new DDZCardSet();
                    this._add4TuplePlus2Single(obCards, cardsTemp, cLevelNumber, i);

                    if (outCardsArr) {
                        outCardsArr.push(cardsTemp);
                    }

                    obCards.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO, i, 1);
                    bRst = true;
                }
            }
        }
    }
    return bRst;
};

DDZCard_Rule.isSidaierdui = function (obCards, outCardsArr) {
    var bRes = false;
    if (8 === obCards.currentLength() &&
        obCards.changeCardCount < 8) // 这里需要用原始癞子来判断
    {
        var cLevelNumber = [];
        var nLevelNum = obCards.getLevelTuple(cLevelNumber).numCount;
        if (this._checkCardsJokerPossible(cLevelNumber) ||
            nLevelNum <= 1) {
            // 四带两对不可能有王
            return false;
        }
        var nChangeID = 0;
        var i = 0,
            j = 0,
            k = 0;
        var nlevel = 0,
            nlevelTemp = 0;
        var bRestart = false;

        //////////////////////////////////////////////////////////////////////////
        /// 如果是有4个癞子
        var nChangeCount = obCards.getCurrChangeCount();
        if (nChangeCount > 4) { // 4个万能牌带2对的情况
            var nLeftChangeCardCount = obCards.getCurrChangeCount() - 4;
            var tailCards = new DDZCardSet();
            if (nLeftChangeCardCount === 3 ||
                nLeftChangeCardCount === 2) // 剩余两张癞子肯定可以
            {
                var firstCard = obCards.getCard(6);
                var lastCard = obCards.getCard(7);
                if (firstCard.levelChanged === lastCard.levelChanged ||
                    firstCard.levelChanged === 16) {
                    var cLevel = this.valueToLevel(obCards.getANumberWithoutChangeCard(lastCard.value));
                    for (i = 4; i < 6; i++) {
                        tailCards.addCardEx(obCards.getCard(i).type, obCards.getCard(i).value,
                            obCards.getCard(i).level, cLevel);
                    }
                    tailCards.addCardEx(firstCard.type, firstCard.value, firstCard.level, lastCard.levelChanged);
                    tailCards.addCardEx(lastCard.type, lastCard.value, lastCard.level, lastCard.levelChanged);
                } else {
                    tailCards.addCardEx(obCards.getCard(4).type, obCards.getCard(4).value,
                        obCards.getCard(4).level, firstCard.levelChanged);
                    tailCards.addCardEx(obCards.getCard(5).type, obCards.getCard(5).value,
                        obCards.getCard(5).level, lastCard.levelChanged);
                    tailCards.addCardEx(firstCard.type, firstCard.value,
                        firstCard.level, firstCard.levelChanged);
                    tailCards.addCardEx(lastCard.type, lastCard.value,
                        lastCard.level, lastCard.levelChanged);
                }
                bRes = true;
            } else if (nLeftChangeCardCount === 1) {
                var cLevel = 0;
                if (obCards.getCard(5).levelChanged === obCards.getCard(6).levelChanged) {
                    cLevel = obCards.getCard(7).levelChanged;
                    bRes = true;
                } else if (obCards.getCard(6).levelChanged === obCards.getCard(7).levelChanged) {
                    cLevel = obCards.getCard(5).levelChanged;
                    bRes = true;
                }

                if (bRes) {
                    var firstCard = obCards.getCard(4);
                    tailCards.addCardEx(firstCard.type, firstCard.value, firstCard.level, cLevel);
                    for (var i = 5; i < 8; i++) {
                        tailCards.addCardEx(obCards.getCard(i).type, obCards.getCard(i).value,
                            obCards.getCard(i).level, obCards.getCard(i).levelChanged);
                    }
                }
            }

            if (bRes) {
                for (var i = 1; i < 14; i++) {
                    var cardsTemp = new DDZCardSet();
                    for (var j = 0; j < 4; j++) {
                        cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value,
                            obCards.getCard(j).level, i);
                    }
                    cardsTemp.addCards(tailCards);
                    cardsTemp.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE, i, 1);

                    if (outCardsArr) {
                        outCardsArr.push(cardsTemp);
                    }

                    obCards.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE, i, 1);
                }
            }
        } else {
            var nLeftChangeCardCount = obCards.getCurrChangeCount() - 4;
            if (nLeftChangeCardCount === 0 &&
                obCards.getCard(4).levelChanged === obCards.getCard(5).levelChanged &&
                obCards.getCard(6).levelChanged === obCards.getCard(7).levelChanged) {
                var tailCards = new DDZCardSet();
                for (var i = 4; i < 8; i++) {
                    tailCards.addCardEx(obCards.getCard(i).type, obCards.getCard(i).value,
                        obCards.getCard(i).level, obCards.getCard(i).levelChanged);
                }
                bRes = true;
                for (var i = 1; i < 14; i++) {
                    var cardsTemp = new DDZCardSet();
                    for (var j = 0; j < 4; j++) {
                        cardsTemp.addCardEx(obCards.getCard(j).type, obCards.getCard(j).value,
                            obCards.getCard(j).level, i);
                    }
                    cardsTemp.addCards(tailCards);
                    cardsTemp.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE, i, 1);

                    if (outCardsArr) {
                        outCardsArr.push(cardsTemp);
                    }

                    obCards.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE, i, 1);
                }
            } else {
                /// 如果不是4个癞子+两对的情况
                for (i = 13; i > 0; --i) {
                    if (cLevelNumber[i] + obCards.changeCardCount >= 4) {
                        var cardsTemp = new DDZCardSet();
                        for (j = 0; j < obCards.currentLength(); ++j) {
                            if (i == obCards.getCard(j).levelChanged) {
                                cardsTemp.addCard(obCards.getCard(j));
                            }
                        }
                        var nChangeNum = 0;
                        for (j = 0; j < 4 - cLevelNumber[i]; ++j) /// 用癞子补齐4个
                        {
                            cardsTemp.addCardEx(obCards.getCard(nChangeNum).type,
                                obCards.getCard(nChangeNum).value,
                                obCards.getCard(nChangeNum).level,
                                i);
                            ++nChangeNum;
                        }

                        var nSingleNumber = 0;
                        var tmpCards = new DDZCardSet();
                        tmpCards.addCards(obCards);
                        tmpCards.delCards(cardsTemp);
                        tmpCards.sortByLevel();
                        var cSunLevel = [];
                        tmpCards.getLevelTuple(cSunLevel);
                        for (j = 1; j < 14; ++j) {
                            nSingleNumber += cSunLevel[j] % 2;
                        }

                        var nLeftChangeCard = nChangeCount - nChangeNum;
                        /// 如果没有单张了，或者单张的数目小于等于癞子数目，就可以构成对子了
                        if ((((nSingleNumber + nLeftChangeCard) % 2) === 0) &&
                            (nSingleNumber <= nLeftChangeCard)) {
                            var ntmpChange = 0;
                            var m = 0;
                            for (m = 0; m < 14; ++m) {
                                if (cSunLevel[m] > 0) {
                                    for (j = 0; j < tmpCards.currentLength(); ++j) {
                                        if (m === tmpCards.getCard(j).levelChanged) {
                                            cardsTemp.addCard(tmpCards.getCard(j));
                                        }
                                    }
                                    var nAddChangeCard = cSunLevel[m] % 2;

                                    if (nAddChangeCard > 0) {
                                        cardsTemp.addCardEx(tmpCards.getCard(ntmpChange).type,
                                            tmpCards.getCard(ntmpChange).value,
                                            tmpCards.getCard(ntmpChange).level,
                                            m);
                                        ++ntmpChange;
                                    }
                                }
                            }
                            if ((nLeftChangeCard - ntmpChange) > 0) {
                                for (m = ntmpChange; m < nLeftChangeCard; ++m) {
                                    cardsTemp.addCardEx(tmpCards.getCard(m).type,
                                        tmpCards.getCard(m).value,
                                        tmpCards.getCard(m).level,
                                        this.valueToLevel(tmpCards.getCard(m).value));
                                }
                            }
                            cardsTemp.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE, i, 1);

                            if (outCardsArr) {
                                outCardsArr.push(cardsTemp);
                            }

                            obCards.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE, i, 1);
                            bRes = true;
                        }
                    }
                }
            }
        }
    }

    return bRes;
};

DDZCard_Rule.isShunzi = function (obCards, outCardsArr) {
    var ret = false;
    var totalChangeNum = obCards.getCurrChangeCount();
    var changeNumber = totalChangeNum;
    if (obCards.currentLength() > 4 && obCards.currentLength() !== totalChangeNum) {
        var cardsTemp = new DDZCardSet();
        var pureChange = obCards.currentLength() == totalChangeNum;
        if (!pureChange) {
            var i = totalChangeNum;
            //最大值不能大于A
            if (obCards.getCard(i).levelChanged > 12) {
                return false;
            }

            var j = 0,
                changeTemp = 0;
            for (; i < obCards.currentLength() - 1; ++i) {
                if (obCards.getCard(i).levelChanged > obCards.getCard(i + 1).levelChanged + 1) {
                    if (obCards.getCard(i).levelChanged - obCards.getCard(i + 1).levelChanged - 1 > totalChangeNum) {
                        return false;
                    } else {
                        changeTemp = totalChangeNum - changeNumber;
                        for (j = 0; j < obCards.getCard(i).levelChanged - obCards.getCard(i + 1).levelChanged - 1; ++j) {
                            cardsTemp.addCardEx(obCards.getCard(changeTemp + j).type,
                                obCards.getCard(changeTemp + j).value,
                                obCards.getCard(changeTemp + j).level,
                                obCards.getCard(i + 1).levelChanged + 1 + j);
                        }
                        changeNumber = changeNumber - (obCards.getCard(i).levelChanged - obCards.getCard(i + 1).levelChanged - 1);
                    }
                } else if (obCards.getCard(i).levelChanged === obCards.getCard(i + 1).levelChanged) {
                    return false;
                }

                cardsTemp.addCard(obCards.getCard(i));
            }

            cardsTemp.addCard(obCards.getCard(i));
        }

        var i = 0,
            j = 0,
            changeTemp = 0;
        if (!pureChange) {
            var typeNumber = changeNumber + 1;
            var beginSpace = 0,
                endSpace = 0;
            if (changeNumber > 0) {
                endSpace = 12 - obCards.getCard(obCards.changeCardCount).levelChanged;
                typeNumber -= (changeNumber - endSpace > 0 ? changeNumber - endSpace : 0);
                beginSpace = obCards.getCard(obCards.currentLength() - 1).levelChanged - 1;
                typeNumber -= (changeNumber - beginSpace > 0 ? changeNumber - beginSpace : 0);
            }
            if (typeNumber > 0) {
                cardsTemp.sortByLevel();
                var levelBegin = cardsTemp.getCard(cardsTemp.currentLength() - 1).levelChanged;
                var levelEnd = cardsTemp.getCard(0).levelChanged;
                var tureBegin = beginSpace > changeNumber ? levelBegin - changeNumber : levelBegin - beginSpace;
                for (i = 0; i < typeNumber; ++i) {
                    var cardsRet = new DDZCardSet();
                    cardsRet.addCards(cardsTemp);
                    changeTemp = totalChangeNum - changeNumber;
                    for (j = 0; j < changeNumber; ++j) {
                        cardsRet.addCardEx(obCards.getCard(changeTemp + j).type,
                            obCards.getCard(changeTemp + j).value,
                            obCards.getCard(changeTemp + j).level,
                            j < levelBegin - tureBegin ? tureBegin + j : levelEnd + 1 + j + tureBegin - levelBegin);
                    }
                    cardsRet.addType(DouDiZhuType.CT_SINGLE_LINE, tureBegin + cardsRet.currentLength() - 1, obCards.currentLength());

                    if (outCardsArr) {
                        outCardsArr.push(cardsRet);
                    }

                    obCards.addType(DouDiZhuType.CT_SINGLE_LINE, tureBegin + cardsRet.currentLength() - 1, obCards.currentLength());
                    ret = true;
                    if (tureBegin < levelBegin) {
                        tureBegin++;
                    }
                }
            }
        } else {
            var typeNumber = 12 - obCards.changeCardCount + 1;
            var cardsRet = new DDZCardSet();
            for (var i = 0; i < typeNumber; ++i) {
                obCards.addType(DouDiZhuType.CT_SINGLE_LINE, i + changeNumber, obCards.currentLength());
                for (var j = 0; j < changeNumber; ++j) {
                    cardsRet.addCardEx(obCards.getCard(changeTemp + j).type,
                        obCards.getCard(changeTemp + j).value,
                        obCards.getCard(changeTemp + j).level,
                        i + changeNumber);
                }
            }
            if (outCardsArr) {
                outCardsArr.push(cardsRet);
            }
            ret = true;
        }
    }
    return ret;
};

DDZCard_Rule.isLiandui = function (obCards, outCardsArr) {
    var ret = false;
    if (0 === obCards.currentLength() % 2 &&
        obCards.currentLength() > 5) {
        var levelNumArr = [];
        obCards.getLevelTuple(levelNumArr);
        if (this._checkCardsJokerPossible(levelNumArr)) {
            return false;
        }

        var changeNumber = obCards.getCurrChangeCount();
        var cardContinue = obCards.currentLength();
        var i = 0,
            j = 0;
        // for (i = 13; i < 17; ++i) {
        //     cardContinue -= levelNumArr[i];
        // }
        cardContinue -= changeNumber;
        var levelBegin = 0;
        for (i = 1; i < 13; ++i) {
            if (levelNumArr[i] > 0) {
                if (levelBegin === 0 && levelNumArr[i] > 0) {
                    levelBegin = i;
                }
                if (levelBegin > 0) {
                    if (levelNumArr[i] > 2) {
                        return false;
                    } else if (levelNumArr[i] < 2) {
                        changeNumber -= (2 - levelNumArr[i]);
                    }

                    if (changeNumber < 0) {
                        return false;
                    }
                }

                cardContinue -= levelNumArr[i];
                if (cardContinue <= 0) {
                    break;
                }
            }
        }

        var typeNumber = Math.floor(changeNumber / 2) + 1;
        var beginSpace = 0,
            endSpace = 0;
        if (changeNumber > 0) {
            endSpace = 12 - i;
            typeNumber -= (Math.floor(changeNumber / 2) - endSpace > 0 ? Math.floor(changeNumber / 2) - endSpace : 0);
            beginSpace = levelBegin - 1;
            typeNumber -= (Math.floor(changeNumber / 2) - beginSpace > 0 ? Math.floor(changeNumber / 2) - beginSpace : 0);
        }

        if (typeNumber > 0) {
            var cardsTemp = new DDZCardSet();
            var levelEnd = i;
            var changeID = 0;
            var obCardsID = obCards.currentLength() - 1;
            for (i = levelBegin; i <= levelEnd; ++i) {
                for (j = 0; j < 2; ++j) {
                    if (obCards.getCard(obCardsID).levelChanged === i) {
                        cardsTemp.addCard(obCards.getCard(obCardsID));
                        obCardsID--;
                    } else {
                        cardsTemp.addCardEx(obCards.getCard(changeID).type,
                            obCards.getCard(changeID).value,
                            obCards.getCard(changeID).level,
                            i);
                        changeID++;
                    }
                }
            }

            var tureBegin = beginSpace > Math.floor((obCards.changeCardCount - changeID) / 2) ? levelBegin - Math.floor((obCards.changeCardCount - changeID) / 2) : levelBegin - beginSpace;
            for (i = 0; i < typeNumber; ++i) {
                var cardsRet = new DDZCardSet();
                cardsRet.addCards(cardsTemp);
                for (j = 0; j < obCards.getCurrChangeCount() - changeID; ++j) {
                    cardsRet.addCardEx(obCards.getCard(changeID + j).type,
                        obCards.getCard(changeID + j).value,
                        obCards.getCard(changeID + j).level,
                        Math.floor(j / 2) < levelBegin - tureBegin ?
                            tureBegin + Math.floor(j / 2) :
                            levelEnd + 1 + Math.floor(j / 2) + tureBegin - levelBegin);
                }

                if (cardsRet.currentLength() === obCards.currentLength()) {
                    cardsRet.addType(DouDiZhuType.CT_DOUBLE_LINE, tureBegin + Math.floor(cardsRet.currentLength() / 2) - 1,
                        Math.floor(obCards.currentLength() / 2));

                    if (outCardsArr) {
                        outCardsArr.push(cardsRet);
                    }

                    obCards.addType(DouDiZhuType.CT_DOUBLE_LINE,
                        tureBegin + Math.floor(cardsRet.currentLength() / 2) - 1, Math.floor(obCards.currentLength() / 2));
                    ret = true;
                }
                tureBegin = tureBegin + 1 > levelBegin ? levelBegin : tureBegin + 1;
            }
        }
    }
    return ret;
};

DDZCard_Rule.isFeiji = function (obCards, outCardsArr) {
    var ret = false;
    if (0 === obCards.currentLength() % 3 && obCards.currentLength() > 5) {
        var levelTuple = [];
        obCards.getLevelTuple(levelTuple);

        var isBomb = obCards.cards.every(function (el, index, arr) {
            if (el.value !== obCards.getCard(0).value) {
                return false;
            }
            return true;
        });

        if (isBomb) {
            return false;
        }

        var i = 0,
            j = 0;
        var levelBegin = 0;
        var changeNumber = obCards.getCurrChangeCount();
        var levelEnd = 0;

        var singleNum = 0;
        var leftChangeCard = 0;
        for (i = 12; i > 0; --i) {
            var is3Tuple = false;
            var cardsTemp = new DDZCardSet();
            if (i >= obCards.currentLength() / 3) {
                if (( levelTuple[i] + levelTuple[i - 1] + changeNumber) >= 6) {
                    var retInfo = {};
                    is3Tuple = this._checkContinue3Tuple(levelTuple, i, Math.floor(obCards.currentLength() / 3),
                        changeNumber, retInfo);
                    singleNum = retInfo.nSingleNum;
                    leftChangeCard = retInfo.nLeftChangeCard;

                    if (is3Tuple) {
                        levelBegin = i - Math.floor(obCards.currentLength() / 3) + 1;
                        levelEnd = i;

                        var tmpCards = new DDZCardSet();
                        tmpCards.addCards(obCards);
                        var tmpChange = 0;
                        var m = 0;
                        for (m = levelBegin; m < levelEnd + 1; ++m) {
                            var count = 0;
                            for (j = 0; j < tmpCards.currentLength(); ++j) {
                                if (tmpCards.getCard(j).levelChanged === m) {
                                    cardsTemp.addCard(tmpCards.getCard(j));
                                    ++count;
                                }
                                if (count >= 3) {
                                    break;
                                }
                            }
                            if (count < 3) {
                                for (var k = 0; k < 3 - count; ++k) {
                                    cardsTemp.addCard(tmpCards.getCard(tmpChange).type,
                                        tmpCards.getCard(tmpChange).value,
                                        tmpCards.getCard(tmpChange).level,
                                        m);
                                    ++tmpChange;
                                }
                            }
                        }

                        cardsTemp.addType(DouDiZhuType.CT_SIX_LINE_TAKE_FORE, levelEnd, Math.floor(obCards.currentLength() / 3));

                        if (outCardsArr) {
                            outCardsArr.push(cardsTemp);
                        }

                        obCards.addType(DouDiZhuType.CT_SIX_LINE_TAKE_FORE, levelEnd, Math.floor(obCards.currentLength() / 3));
                        ret = true;
                    }
                }
            }
        }
    }

    return ret;
};

DDZCard_Rule.isFeijidaidan = function (obCards, outCardsArr) {
    var ret = false;
    if (0 === obCards.currentLength() % 4 && obCards.currentLength() > 7) {
        var cLevelNumber = [];
        obCards.getLevelTuple(cLevelNumber);
        var i = 0,
            j = 0;
        var nLevelBegin = 0;
        var nChangeNumber = obCards.getCurrChangeCount();
        var bRestart = false;
        var nLevelEnd = 0;
        var cardsCheck = new DDZCardSet();
        cardsCheck.addCards(obCards);

        // var vecCardsCheck = [];

        // 排除这种情况，主要原因是
        // 1. 概率低
        // 2. 显示牌型看起来比较奇怪
        // 3. 兼容非癞子情况（非癞子的时候不出选框）

        //todo 4个的飞机也可以判断为3个飞机带三
        if (obCards.currentLength() == 12 &&
            this.isFeiji(cardsCheck)) {
            return false;
        }

        // 排除这种情况，主要原因同上
        if (obCards.currentLength() === 8) {
            // 下面这个判断是为了防止出现44445555的情况
            var nTypeNumberTemp = 0;
            cLevelNumber.forEach(function (el) {
                if (el > 0) {
                    nTypeNumberTemp++;
                }
            });
            if (nTypeNumberTemp <= 2) {
                return false;
            }
        }

        var nSingleNumber = 0;
        var nLeftChangeCard = 0;
        for (i = 12; i > 0; --i) {
            var bIs3Tuple = false;
            var cardsTemp = new DDZCardSet();
            if (i >= obCards.currentLength() / 4) {
                /// 只有当前level的牌数量+相连的牌数量+癞子够六张了，才有可能构成三顺
                if ((cLevelNumber[i] + cLevelNumber[i - 1] + nChangeNumber) >= 6) {
                    var retInfo = {};
                    bIs3Tuple = this._checkContinue3Tuple(cLevelNumber, i, obCards.currentLength() / 4,
                        nChangeNumber, retInfo);
                    nSingleNumber = retInfo.nSingleNum;
                    nLeftChangeCard = retInfo.nLeftChangeCard;

                    if (bIs3Tuple) {
                        nLevelBegin = i - obCards.currentLength() / 4 + 1;
                        nLevelEnd = i;

                        var tmpCards = new DDZCardSet();
                        tmpCards.addCards(obCards);
                        /// 先将三顺放入
                        var ntmpChange = 0;
                        var m = 0;
                        for (m = nLevelBegin; m < nLevelEnd + 1; ++m) {
                            var nCount = 0;
                            for (j = 0; j < tmpCards.currentLength(); ++j) {
                                if (tmpCards.getCard(j).levelChanged == m) {
                                    cardsTemp.addCard(tmpCards.getCard(j));
                                    ++nCount;
                                }
                                if (nCount >= 3) {
                                    break;
                                }
                            }
                            if (nCount < 3) {
                                for (var k = 0; k < 3 - nCount; ++k) {
                                    cardsTemp.addCardEx(tmpCards.getCard(ntmpChange).type,
                                        tmpCards.getCard(ntmpChange).value,
                                        tmpCards.getCard(ntmpChange).level,
                                        m);
                                    ++ntmpChange;
                                }
                            }
                        }

                        tmpCards.delCards(cardsTemp);

                        if (outCardsArr) {
                            for (m = 0; m < tmpCards.currentLength(); ++m) {
                                if (tmpCards.getCard(m).levelChanged == 16) {
                                    cardsTemp.addCardEx(tmpCards.getCard(m).type,
                                        tmpCards.getCard(m).value,
                                        tmpCards.getCard(m).level,
                                        this.getGrade(tmpCards.getCard(m)));
                                } else {
                                    cardsTemp.addCard(tmpCards.getCard(m));
                                }
                            }
                            cardsTemp.addType(DouDiZhuType.CT_SIX_LINE_TAKE_SINGLE, nLevelEnd, Math.floor(obCards.currentLength() / 4));
                            outCardsArr.push(cardsTemp);
                        }

                        obCards.addType(DouDiZhuType.CT_SIX_LINE_TAKE_SINGLE, nLevelEnd, Math.floor(obCards.currentLength() / 4));

                        ret = true;
                    }
                }
            }
        }
    }
    return ret;
};

DDZCard_Rule.isFeijidaidui = function (obCards, outCardsArr) {
    var bRst = false;
    if (0 == obCards.currentLength() % 5 && obCards.currentLength() > 9) {
        var cLevelNumber = [];
        obCards.getLevelTuple(cLevelNumber);
        if (this._checkCardsJokerPossible(cLevelNumber)) {
            // 三顺带对不可能有王
            return false;
        }
        var i = 0,
            j = 0;
        var nLevelBegin = 0;
        var nChangeNumber = obCards.getCurrChangeCount();
        var bRestart = false;
        var nLevelEnd = 0;

        var nSingleNumber = 0;
        var nLeftChangeCard = 0;
        for (i = 12; i > 0; --i) {
            var bIs3Tuple = false;
            var cardsTemp = new DDZCardSet();

            if (i >= obCards.currentLength() / 5) {
                if ((cLevelNumber[i] + cLevelNumber[i - 1] + nChangeNumber) >= 6) {
                    nSingleNumber = 0;
                    nLeftChangeCard = obCards.getCurrChangeCount();
                    var ret = {};
                    bIs3Tuple = this._checkContinue3Tuple(cLevelNumber, i, Math.floor(obCards.currentLength() / 5),
                        obCards.getCurrChangeCount(), ret);
                    nSingleNumber = ret.nSingleNum;
                    nLeftChangeCard = ret.nLeftChangeCard;
                    if (bIs3Tuple) {
                        nLevelBegin = i - Math.floor(obCards.currentLength() / 5) + 1;
                        nLevelEnd = i;

                        var tmpCards = new DDZCardSet();
                        tmpCards.addCards(obCards);
                        /// 先将三顺放入
                        var ntmpChange = 0;
                        var m = 0;
                        for (m = nLevelBegin; m < nLevelEnd + 1; ++m) {
                            var nCount = 0;
                            for (j = 0; j < tmpCards.currentLength(); ++j) {
                                if (tmpCards.getCard(j).levelChanged == m) {
                                    cardsTemp.addCard(tmpCards.getCard(j));
                                    ++nCount;
                                }
                                if (nCount >= 3) {
                                    break;
                                }
                            }
                            if (nCount < 3) {
                                for (var k = 0; k < 3 - nCount; ++k) {
                                    cardsTemp.addCardEx(tmpCards.getCard(ntmpChange).type,
                                        tmpCards.getCard(ntmpChange).value,
                                        tmpCards.getCard(ntmpChange).level,
                                        m);
                                    ++ntmpChange;
                                }
                            }
                        }

                        tmpCards.delCards(cardsTemp);

                        for (m = 1; m <= 13; ++m) {
                            if (m < nLevelBegin || m >= nLevelBegin + Math.floor(obCards.currentLength() / 5)) {
                                if (cLevelNumber[m] > 0) {
                                    nSingleNumber += (cLevelNumber[m] % 2);
                                }
                            }
                        }

                        if ((((nSingleNumber + nLeftChangeCard) % 2) == 0) &&
                            (nSingleNumber <= nLeftChangeCard)) {
                            ntmpChange = 0;
                            var cSunLevel = [];
                            tmpCards.sortByLevel();
                            tmpCards.getLevelTuple(cSunLevel);
                            for (m = 0; m < 14; ++m) {
                                if (cSunLevel[m] > 0) {
                                    for (j = 0; j < tmpCards.currentLength(); ++j) {
                                        if (m == tmpCards.getCard(j).levelChanged) {
                                            cardsTemp.addCard(tmpCards.getCard(j));
                                        }
                                    }
                                    var nAddChangeCard = cSunLevel[m] % 2;

                                    if (nAddChangeCard > 0) {
                                        cardsTemp.addCardEx(tmpCards.getCard(ntmpChange).type,
                                            tmpCards.getCard(ntmpChange).value,
                                            tmpCards.getCard(ntmpChange).level,
                                            m);
                                        ++ntmpChange;
                                    }
                                }
                            }

                            if (outCardsArr) {
                                if ((nLeftChangeCard - ntmpChange) > 0) {
                                    for (m = ntmpChange; m < nLeftChangeCard; ++m) {
                                        cardsTemp.addCardEx(tmpCards.getCard(m).type,
                                            tmpCards.getCard(m).value,
                                            tmpCards.getCard(m).level,
                                            this.getGrade(tmpCards.getCard(m)));
                                    }
                                }
                                cardsTemp.addType(DouDiZhuType.CT_SIX_LINE_TAKE_DOUBLE, nLevelEnd, Math.floor(obCards.currentLength() / 5));
                                outCardsArr.push(cardsTemp);
                            }

                            obCards.addType(DouDiZhuType.CT_SIX_LINE_TAKE_DOUBLE, nLevelEnd, Math.floor(obCards.currentLength() / 5));
                            bRst = true;
                        }
                    }
                }
            }
        }
    }
    return bRst;
};

DDZCard_Rule.bucketInfo = function (cards) {
    var buckets = [];
    //权级做key，同权级牌出现的次数做value
    var map = {};
    _.each(cards, function (card) {
        var grade = DDZ_compare[card.value];
        if (!_.includes(buckets, grade)) {
            buckets.push(grade);
            map[grade] = 1;
        } else {
            map[grade]++;
        }
    }.bind(this));

    //找出出现次数最多的牌，出现次数同样多，取最大值
    var max_num = 0;
    var most_grade = null;
    //找出出现次数最少的牌
    var min_num = 5;
    var least_grade = null;

    _.each(map, function (num, grade) {
        num = parseInt(num, 10);
        grade = parseInt(grade, 10);

        //出现次数最多
        if (num > max_num) {
            max_num = num;
            most_grade = grade;
        }
        //出现次数同样多，取最大值
        if (num === max_num) {
            if (grade > most_grade) {
                most_grade = grade;
            }
        }

        //出现次数最少的牌
        if (num < min_num) {
            min_num = num;
            least_grade = grade;
        }
    }.bind(this));

    return {
        "bucket_num": buckets.length,
        "most_grade": most_grade,
        "most_grade_num": max_num,
        "least_grade": least_grade,
        "least_grade_num": min_num
    };
}

DDZCard_Rule.isLianxu = function (cards) {
    if (!cards || cards.length == 0) return false;

    cards = this.sortCards(cards);

    //最大的牌，不能超过A
    if (DDZ_compare[cards[0].value] > 12) {
        return false;
    }
    var count = cards.length - 1;
    for (var i = 0; i < count; i++) {
        if (DDZ_compare[cards[i].value] !== DDZ_compare[cards[i + 1].value] + 1) {
            return false;
        }
    }

    return true;
};

DDZCard_Rule.isGradeLianxu = function (grades) {
    grades = grades.sort(function (a, b) {
        return a < b ? 1 : -1;
    });
    //最大的牌，不能超过A
    if (grades[0] > 12) {
        return false;
    }
    var count = grades.length - 1;
    for (var i = 0; i < count; i++) {
        if (grades[i] !== grades[i + 1] + 1) {
            return false;
        }
    }

    return true;
}

DDZCard_Rule.getGrade = function (card) {
    /*if (card.type === 5)
        return 16;
    if (card.type === 6)
        return 17;*/
    return DDZ_compare[card.value];
};

DDZCard_Rule.valueToLevel = function (value) {
    return DDZ_compare[value];
};

DDZCard_Rule.levelToValue = function (level) {
    return DDZ_uncompare[level];
};

DDZCard_Rule.getGrades = function (cards) {
    var t = {};
    _.each(cards, function (card) {
        var grade = DDZ_compare[card.value];
        if (t[grade]) {
            t[grade]++;
        } else {
            t[grade] = 1;
        }
    }.bind(this));

    return t;
};

DDZCard_Rule.getKeyGradeByType = function (cards, type) {
    if (type === DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE) {
        //sidaierdui
        //获取桶信息
        var bucket_info = this.bucketInfo(cards);
        var bucket_num = bucket_info.bucket_num;
        var most_grade = bucket_info.most_grade;
        var most_grade_num = bucket_info.most_grade_num;

        return parseInt(most_grade, 10);
    }

    if (type === DouDiZhuType.CT_SIX_LINE_TAKE_SINGLE) {
        //飞机带单
        var grades = DDZCard_Rule.getGrades(cards);
        var t = [];
        for (var grade in grades) {
            if (grades.hasOwnProperty(grade)) {
                var num = grades[grade];
                if (num >= 3) {
                    t.push(parseInt(grade, 10));
                }
            }
        }

        //一副牌最多带5张单牌，t的数量最多+1
        t = _.reverse(_.sortBy(t));
        if (t.length === cards.length / 4) {
            return parseInt(t[0], 10);
        } else {
            t.pop();

            if (this.isGradeLianxu(t)) {
                return parseInt(t[0], 10);
            } else {
                return parseInt(t[1], 10);
            }
        }
    }
};

DDZCard_Rule.getKeyGrade = function (cards) {
    //唯一牌型
    var ct_ar = this.getCardType(cards);
    var ct = ct_ar[0];

    //三带一，三带对，四带二, 四带对
    if (_.includes([DouDiZhuType.CT_THREE_LINE_TAKE_TWO, DouDiZhuType.CT_THREE_LINE_TAKE_ONE, DouDiZhuType.CT_FORE_LINE_TAKE_TWO, DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE], ct)) {
        //获取桶信息
        var bucket_info = this.bucketInfo(cards);
        var bucket_num = bucket_info.bucket_num;
        var most_grade = bucket_info.most_grade;
        var most_grade_num = bucket_info.most_grade_nums;

        return parseInt(most_grade, 10);
    }

    //飞机带对
    if (ct === DouDiZhuType.CT_SIX_LINE_TAKE_DOUBLE) {
        var buckets = [];
        //牌值做key，同牌值的牌，出现的次数做value
        var map = {};
        _.each(cards, function (card) {
            var grade = DDZ_compare[card.value];
            if (!_.includes(buckets, grade)) {
                buckets.push(grade);
                map[grade] = 1;
            } else {
                map[grade]++;
            }
        }.bind(this));

        //出现次数为3的牌中，最大牌值
        //飞机带对，关键牌值肯定比3大
        var max_grade = 3;
        _.each(map, function (num, grade) {
            num = parseInt(num, 10);
            grade = parseInt(grade, 10);

            if (num === 3 && grade > max_grade) {
                max_grade = grade;
            }
        }.bind(this));

        return parseInt(max_grade, 10);
    }

    //飞机带单
    if (ct === DouDiZhuType.CT_SIX_LINE_TAKE_SINGLE) {
        //todo
        //trace(cards);

        var grades = this.getGrades(cards);
        var t = [];
        for (var grade in grades) {
            if (grades.hasOwnProperty(grade)) {
                var num = grades[grade];
                if (num >= 3) {
                    t.push(parseInt(grade, 10));
                }
            }
        }

        //一副牌最多带5张单牌，t的数量最多+1
        t = _.reverse(_.sortBy(t));
        if (t.length === cards.length / 4) {
            return t[0];
        } else {
            t.pop();
            if (this.isGradeLianxu(t)) {
                return t[0];
            } else {
                return t[1];
            }
        }
    }
};

DDZCard_Rule._reverse = function (arr) {
    var res = [];
    for (var i = arr.length - 1; i >= 0; i--)
        res.push(arr[i]);
    return res;
};

DDZCard_Rule.sortCards = function (cards) {
    return this._reverse(
        _.sortBy(cards, function (card) {
            return DDZ_compare[card.value];
        })
    );
};

DDZCard_Rule.sortOutCards = function (cards) {
    return _.sortBy(cards, function (card) {
        return DDZ_compare[card.value];
    })
};

// 判断数组中是否存在王 存在则不可能为对子
DDZCard_Rule._checkCardsJokerPossible = function (levelNumArr) {
    var bRst = false;
    if (levelNumArr[DDZGlobal.CARD_LEVEL_SMALLJOKER] > 0 || levelNumArr[DDZGlobal.CARD_LEVEL_BIGJOKER] > 0) {
        bRst = true;
    }
    return bRst;
};

DDZCard_Rule._getLevelTuplenNumCountWithoutChange = function (levelNumArr) {
    var numCountWithoutChange = 0;
    for (var key in levelNumArr) {
        if (levelNumArr.hasOwnProperty(key) && !this.isChangeGrade(key)) {
            numCountWithoutChange++;
        }
    }
    return numCountWithoutChange;
}

DDZCard_Rule._checkContinue3Tuple = function (levelNumArr, startIndex, len, changeCardNumber, retInfo) {
    retInfo.nSingleNum = 0;
    retInfo.nLeftChangeCard = 0;
    var bRet = false;
    if (startIndex < len) {
        bRet = false;
    } else {

        var nEnd = startIndex;
        var nBegin = startIndex;
        var n3TupleNum = 0;
        for (var i = startIndex; i > 0; --i) {
            var numValue = levelNumArr[i];
            if ((numValue + changeCardNumber) > 2) {
                ++n3TupleNum;
                if (numValue > 3) {
                    retInfo.nSingleNum += numValue - 3;
                }

                if (numValue < 3) {
                    changeCardNumber -= (3 - numValue);

                    if (changeCardNumber < 0) {
                        return false;
                    }
                }

                if (n3TupleNum == len) {
                    retInfo.nLeftChangeCard = changeCardNumber;
                    return true;
                }
            } else {
                return false;
            }
        }
    }

    return bRet;
};

DDZCard_Rule._add4TuplePlus2Single = function (srcCards, dstCards, levelNumArr, levelChanged) {
    if (levelChanged < 1 || levelChanged > 13) {
        return;
    }

    var i = 0,
        j = 9;
    var nChaneNum = 0;
    var nAddChange = 4 - levelNumArr[levelChanged];

    /// 首先把四张的放进去
    for (j = 0; j < srcCards.currentLength(); ++j) {
        if (levelChanged === srcCards.getCard(j).levelChanged) {
            dstCards.addCard(srcCards.getCard(j));
        }
    }

    /// 如果不够的话，用癞子补上
    for (j = 0; j < nAddChange; ++j) {
        dstCards.addCardEx(srcCards.getCard(nChaneNum).type,
            srcCards.getCard(nChaneNum).value,
            srcCards.getCard(nChaneNum).level,
            levelChanged);
        ++nChaneNum;
    }

    /// 最后是单张
    //先添加没有使用的赖子
    for (j = nChaneNum; j < srcCards.getCurrChangeCount(); ++j) {
        dstCards.addCard(srcCards.getCard(nChaneNum).type,
            srcCards.getCard(nChaneNum).value,
            srcCards.getCard(nChaneNum).level,
            this.getGrade(srcCards.getCard(nChaneNum)));
        ++nChaneNum;
    }

    //最后添加剩余的单张
    for (j = srcCards.getCurrChangeCount(); j < srcCards.currentLength(); ++j) {
        if (srcCards.getCard(j).levelChanged != levelChanged) {
            dstCards.addCard(srcCards.getCard(j));
        }
    }

    dstCards.addType(DouDiZhuType.CT_FORE_LINE_TAKE_TWO, levelChanged, 1);
}

DDZCard_Rule.isChangeGrade = function (grade) {
    var bRes = false;
    if (XYGLogic.Instance.changeValue && this.getGrade(XYGLogic.Instance.changeValue) == grade) {
        bRes = true;
    }
    return bRes;
};

DDZCard_Rule.cardsToCardsSet = function (cards) {
    var cardsSet = new DDZCardSet();
    for (var key in cards) {
        if (cards.hasOwnProperty(key)) {
            if (cards[key].value && cards[key].type) {
                cardsSet.addCard(cards[key]);
            } else {
                cardsSet.addCard(0, 0);
            }
        }
    }
    return cardsSet;
};
