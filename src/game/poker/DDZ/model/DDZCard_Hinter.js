var DDZCard_Hinter = {
    changeCount: 0,
    changeCountChild: 0,
    changeCards: null,
    changeCardsChild: null,
    changeValue: null,
    // 出牌提示
    getCardHint: function (handCards, preCards, preCardsType) {
        this.changeCount = 0;
        this.changeCountChild = 0;
        this.changeCards = new Array();
        this.changeCardsChild = new Array();
        this.changeGrade = DDZCard_Rule.getGrade(XYGLogic.Instance.changeValue);
        var preCards = preCards || [];
        var isFull = !preCardsType;
        if (isFull) {
            return this.getFullCardHint(handCards);
        }
        var hintCards = [];
        handCards = _.sortBy(handCards, function (card) {
            return DDZCard_Rule.getGrade(card);
        });
        preCards = _.sortBy(preCards, function (card) {
            return DDZCard_Rule.getGrade(card);
        });
        // 出现次数作为key，牌值作为value
        var numToGradeAr = this.analysisHandCards(handCards);

        // 单纯牌型：单张，对子，顺子，连对，三张，飞机不带
        // 单张提示
        var type = preCardsType.cardsType;
        if (DouDiZhuType.CT_SINGLE == type) {
            hintCards = [].concat(hintCards, this.hintDan(handCards, preCards, preCardsType,numToGradeAr));
        }

        // 对子提示
        if (DouDiZhuType.CT_DOUBLE == type) {
            hintCards = [].concat(hintCards, this.hintDuizi(handCards, preCards, preCardsType,numToGradeAr));
        }
        //如果是当前玩家出牌  做只等提示出牌    那么就从 三张开始
        // 三张提示
        if (DouDiZhuType.CT_THREE == type) {
            hintCards = [].concat(hintCards, this.hintSan(handCards, preCards, preCardsType,numToGradeAr));
        }

        // 顺子提示
        if (DouDiZhuType.CT_SINGLE_LINE == type) {
            hintCards = [].concat(this.hintShunZi(handCards, preCards, preCardsType,numToGradeAr), hintCards);
        }

        // 连对
        if (DouDiZhuType.CT_DOUBLE_LINE == type) {
            hintCards = [].concat(hintCards, this.hintLianDui(handCards, preCards,preCardsType, numToGradeAr));
        }

        // 飞机
        if (DouDiZhuType.CT_SIX_LINE_TAKE_FORE == type) {
            hintCards = [].concat(hintCards, this.hintFeiJi(handCards, preCards, preCardsType,numToGradeAr));
        }

        //todo 混合牌型: 三带一，三带对，飞机带单，飞机带对，四带二，四带对

        // 三带一提示
        if (DouDiZhuType.CT_THREE_LINE_TAKE_ONE == type) {
            hintCards = [].concat(hintCards, this.hintSanDaiYi(handCards, preCards, preCardsType, numToGradeAr));
        }

        // 三带对提示
        if (DouDiZhuType.CT_THREE_LINE_TAKE_TWO == type) {
            hintCards = [].concat(hintCards, this.hintSanDaiDui(handCards, preCards, preCardsType, numToGradeAr));
        }

        // 飞机带单提示
        if (DouDiZhuType.CT_SIX_LINE_TAKE_SINGLE == type) {
            hintCards = [].concat(hintCards, this.hintFeiJiDaiDan(handCards, preCards, preCardsType, numToGradeAr));
        }

        // 飞机带对提示
        if (DouDiZhuType.CT_SIX_LINE_TAKE_DOUBLE == type) {
            hintCards = [].concat(hintCards, this.hintFeiJiDaiDui(handCards, preCards, preCardsType, numToGradeAr));
        }

        // 四带二提示
        if (DouDiZhuType.CT_FORE_LINE_TAKE_TWO == type) {
            hintCards = [].concat(hintCards, this.hintSiDai2Dan(handCards, preCards, preCardsType, numToGradeAr));
        }
        // 四带二对
        if (DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE == type) {
            hintCards = [].concat(hintCards, this.hintSiDai2Dui(handCards, preCards, preCardsType, numToGradeAr));
        }
        // 王炸没有牌能打的住，默认返回空牌组
        // 不是王炸的情况下：如果上一手牌型是炸弹，加入更大的炸弹; 如果上一受牌不是炸弹，加入炸弹
        if (DouDiZhuType.CT_KING_BOMB !== type) {
            hintCards = [].concat(hintCards, this.hint4Boom(handCards, preCards, preCardsType, numToGradeAr));
        }

        // 如果手牌中有王炸，加入王炸
        hintCards = [].concat(hintCards, this.hint2Joker(handCards));

        JJLog.print("!!!!!!!! hintCards", hintCards);
        var newHintCards = [];
        _.each(hintCards, function (el) {
            if (el.length > 0) {
                newHintCards.push(el)
            }
        });
        JJLog.print("!!!!!!!!newHintCards", newHintCards);
        return newHintCards;
    },

    //如果没有上家出牌 提示所有能出的牌型
    getFullCardHint: function (handCards, preCards, preCardsType, cardsLast) {
        var preCards = preCards || [];
        var hintCards = [];
        handCards = _.sortBy(handCards, function (card) {
            return DDZCard_Rule.getGrade(card);
        });
        preCards = _.sortBy(preCards, function (card) {
            return DDZCard_Rule.getGrade(card);
        });
        // 出现次数作为key，牌值作为value
        var numToGradeAr = this.analysisHandCards(handCards);
        // 单纯牌型：单张，对子，顺子，连对，三张，飞机不带

        //如果是当前玩家出牌  做只等提示出牌    那么就从 三张开始

        //todo 混合牌型: 三带一，三带对，飞机带单，飞机带对，四带二，四带对
        // 飞机带单提示
        hintCards = [].concat(hintCards, this.hintFeiJiDaiDan(handCards, preCards, preCardsType, numToGradeAr));
        // 飞机带对提示
        hintCards = [].concat(hintCards, this.hintFeiJiDaiDui(handCards, preCards, preCardsType, numToGradeAr));
        // 飞机
        hintCards = [].concat(hintCards, this.hintAllFeiJi(handCards, preCards, numToGradeAr));
        // 三带一提示
        hintCards = [].concat(hintCards, this.hintSanDaiYi(handCards, preCards, preCardsType, numToGradeAr));
        // 连对
        hintCards = [].concat(hintCards, this.hintAllLianDui(handCards, preCards, numToGradeAr));
        // 三带对提示
        hintCards = [].concat(hintCards, this.hintSanDaiDui(handCards, preCards, preCardsType, numToGradeAr));
        // 顺子提示
        hintCards = [].concat(hintCards, this.hintAllShunZi(handCards, preCards,numToGradeAr));
        // 对子提示
        hintCards = [].concat(hintCards, this.hintDuizi(handCards, preCards, preCardsType,numToGradeAr));
        // 三张提示
        hintCards = [].concat(hintCards, this.hintSan(handCards, preCards, preCardsType,numToGradeAr));
        // 四带二提示
        hintCards = [].concat(hintCards, this.hintSiDai2Dan(handCards, preCards, preCardsType, numToGradeAr));
        // 四带二对
        hintCards = [].concat(hintCards, this.hintSiDai2Dui(handCards, preCards, preCardsType, numToGradeAr));
        // 王炸没有牌能打的住，默认返回空牌组
        // 不是王炸的情况下：如果上一手牌型是炸弹，加入更大的炸弹; 如果上一受牌不是炸弹，加入炸弹
        hintCards = [].concat(hintCards, this.hint4Boom(handCards, preCards, preCardsType, numToGradeAr));

        // 单张提示
        hintCards = [].concat(hintCards, this.hintDan(handCards, preCards, preCardsType,numToGradeAr));
        // 如果手牌中有王炸，加入王炸
        hintCards = [].concat(hintCards, this.hint2Joker(handCards));

        JJLog.print("!!!!!!!! hintCards", hintCards);
        var newHintCards = [];
        _.each(hintCards, function (el) {
            if (el.length > 0) {
                newHintCards.push(el)
            }
        });
        JJLog.print("!!!!!!!!newHintCards", newHintCards);
        return newHintCards;
    },

    //智能出牌提示 找出选择的手牌中最大的顺子或者连对
    autoHint: function (handCards, preCards, preCardsType) {
        this.changeCount = 0;
        this.changeCountChild = 0;
        this.changeCards = new Array();
        this.changeCardsChild = new Array();
        this.changeGrade = DDZCard_Rule.getGrade(XYGLogic.Instance.changeValue);
        var preCards = preCards || [];
        var hintCards = [];
        handCards = _.sortBy(handCards, function (card) {
            return DDZCard_Rule.getGrade(card);
        });
        // 出现次数作为key，牌值作为value
        var numToGradeAr = this.analysisHandCards(handCards);

        //todo 先只提示顺子 连对 3顺
        //如果选择的牌刚好为一个牌型 则不提示了
        if (preCards.length > 0 && preCardsType) {
            //todo 存在上一手牌型则提示 除单张
            var type = preCardsType.cardsType;
            var temp = [];
            if (type == DouDiZhuType.CT_KING_BOMB) {
                return [];
            }
            if (type == DouDiZhuType.CT_SINGLE_LINE) {
                temp = this.hintShunZi(handCards, preCards, preCardsType, numToGradeAr);
            } else if (type == DouDiZhuType.CT_DOUBLE_LINE) {
                temp = this.hintLianDui(handCards, preCards, preCardsType, numToGradeAr);
            } else if (type == DouDiZhuType.CT_THREE_LINE_TAKE_ONE) {
                temp = this.hintSanDaiYi(handCards, preCards, preCardsType, numToGradeAr);
            } else if (type == DouDiZhuType.CT_THREE_LINE_TAKE_TWO) {
                temp = this.hintSanDaiDui(handCards, preCards, preCardsType, numToGradeAr);
            } else if (type == DouDiZhuType.CT_FORE_LINE_TAKE_TWO) {
                temp = this.hintSiDai2Dan(handCards, preCards, preCardsType, numToGradeAr);
            } else if (type == DouDiZhuType.CT_FORE_LINE_TAKE_TWO_DOUBLE) {
                temp = this.hintSiDai2Dui(handCards, preCards, preCardsType, numToGradeAr);
            } else if (type == DouDiZhuType.CT_SIX_LINE_TAKE_FORE) {
                temp = this.hintFeiJi(handCards, preCards, preCardsType, numToGradeAr);
            } else if (type == DouDiZhuType.CT_SIX_LINE_TAKE_SINGLE) {
                temp = this.hintFeiJiDaiDan(handCards, preCards, preCardsType, numToGradeAr);
            } else if (type == DouDiZhuType.CT_SIX_LINE_TAKE_DOUBLE) {
                temp = this.hintSanDaiDui(handCards, preCards, preCardsType, numToGradeAr);
            }
            if (temp.length > 0) {
                hintCards.push(temp[0]);
            } else {
                var tempBoom = this.hint4Boom(handCards, preCards, preCardsType, numToGradeAr);
                if (tempBoom.length > 0) {
                    hintCards.push(tempBoom[0]);
                }
            }

        }
         else {
            var tempCards = [];
            tempCards = [].concat(tempCards, this.hintMaxShunZi(handCards, numToGradeAr));
            tempCards = [].concat(tempCards, this.hintMaxLianDui(handCards, numToGradeAr));
            tempCards = [].concat(tempCards, this.hintMaxFeiJi(handCards, numToGradeAr));
            JJLog.print("!!!!!!!!!!!!!!!!!!tempCards=>", tempCards);
            if (tempCards.length > 0) {
                var maxCards = tempCards[0];
                for (var i = 0; i < tempCards.length; i++){
                    var temp = tempCards[i];
                    if (temp.cardsLength > maxCards.cardsLength) {
                        maxCards = temp;
                    } else if (temp.cardsLength == maxCards.cardsLength){
                        if (temp.cardsType > maxCards.cardsType) {
                            maxCards = temp;
                        }
                    }
                }
                hintCards.push(maxCards.cards);
            }
        }

        //自动选出最优的选择
        return hintCards;
    },

    //最后一手牌 情况判断
    autoSendHint: function (handCards, preCards, preCardsType,tempCards, needLength, autoArr) {
        this.changeCount = 0;
        this.changeCountChild = 0;
        this.changeCards = new Array();
        this.changeCardsChild = new Array();
        this.changeGrade = DDZCard_Rule.getGrade(XYGLogic.Instance.changeValue);
        var preCards = preCards || [];
        var hintCards = [];
        handCards = _.sortBy(handCards, function (card) {
            return DDZCard_Rule.getGrade(card);
        });
        preCards = _.sortBy(preCards, function (card) {
            return DDZCard_Rule.getGrade(card);
        });
        // 出现次数作为key，牌值作为value
        var numToGradeAr = this.analysisHandCards(handCards);

        // var autoArr = []
        hintCards = this.hint2Joker(handCards);

        if (hintCards.length > 0) {
            if (2 >= needLength) {
                autoArr.push(hintCards[0]);
            }
            return;
        }

        hintCards = this.hint4Boom(handCards, preCards, preCardsType, numToGradeAr)

        if (hintCards.length > 0) {
            if (hintCards.length == 1 && hintCards[0].length >= needLength) {
                autoArr.push(hintCards[0])
            }
            return;
        }

        var mLength = tempCards[0].length;
        var index = 0;
        tempCards.forEach(function (el, idx) {
            if (el.length > mLength) {
                mLength = el.length;
                index = idx
            }
        })
        autoArr.push(tempCards[index]);
        return;

    },

    // 工具算法
    /**
     * 分析手牌, 按照“单张，对子，三张，四张”分组 癞子单独提出来 用来配牌
     *
     * return ['x1':[grade1, ..], 'x2':[grade2, ..], 'x3':[grade3, ..], 'x4':[grade4, ..]]
     */

    //分析主体牌型
    analysisHandCards: function (cards) {
        var ar = [];

        var bucket = DDZCard_Rule.getGrades(cards);

        this.changeCards = [];
        this.changeCount = 0;

        for (var grade in bucket) {
            if (bucket.hasOwnProperty(grade)) {
                if (bucket[grade]) {
                    var num = bucket[grade];
                    if (this.changeGrade == grade) {
                        this.changeCards = this.findCardByGrade(cards, grade, num)
                        this.changeCount = num;
                        continue;
                    }
                    var key = 'x' + num;
                    if (!ar[key]) {
                        ar[key] = [];
                    }

                    ar[key].push(parseInt(grade));
                }
            }
        }

        // 排序
        for (var i = 1; i <= 4; i++) {
            var key = 'x' + i;
            if (ar[key]) {
                ar[key] = _.sortBy(ar[key], function (grade) {
                    return grade;
                });
            }
            else {
                ar[key] = [];
            }
        }

        // todo
        // JJLog.print(ar);
        return ar;
    },
    //第二次分析牌型
    analysisHandCardsChild: function (cards) {
        var ar = [];

        var bucket = DDZCard_Rule.getGrades(cards);

        this.changeCardsChild = new Array();
        this.changeCountChild = 0;

        for (var grade in bucket) {
            if (bucket.hasOwnProperty(grade)) {
                if (bucket[grade]) {
                    var num = bucket[grade];
                    if (this.changeGrade == grade) {
                        this.changeCardsChild = this.findCardByGrade(cards, grade, num)
                        this.changeCountChild = num;
                        continue;
                    }
                    var key = 'x' + num;
                    if (!ar[key]) {
                        ar[key] = [];
                    }

                    ar[key].push(parseInt(grade));
                }
            }
        }

        // 排序
        for (var i = 1; i <= 4; i++) {
            var key = 'x' + i;
            if (ar[key]) {
                ar[key] = _.sortBy(ar[key], function (grade) {
                    return grade;
                });
            }
            else {
                ar[key] = [];
            }
        }

        // todo
        // JJLog.print(ar);
        return ar;
    },

    // 指定grade，从手牌中找到若干张牌 grade => [card_id, ..]
    findCardByGrade: function (cardsStock, grade, num) {
        var outCards = [];
        _.each(cardsStock, function (card) {
            if (DDZCard_Rule.getGrade(card) == grade && num > 0) {
                outCards.push(card);
                num--;
            }
        });

        if (num === 0) {
            return outCards;
        }
        else {
            return false;
        }
    },
    findAnyCardByGrade: function (cardsStock, grade, num) {
        var outCards = [];
        _.each(cardsStock, function (card) {
            if (DDZCard_Rule.getGrade(card) == grade && num > 0) {
                outCards.push(card);
                num--;
            }
        });

        if (outCards.length > 0) {
            return outCards;
        } else {
            return false;
        }
    },
    // 将grade列表的队列，转化为card列表的队列，card必须在手牌中
    tranlateGradeQueueToCardQueue: function (cardsStock, gradeQueue, num) {
        var cardQueue = [];
        for (var i in gradeQueue) {
            if (gradeQueue.hasOwnProperty(i)) {
                var gradeList = gradeQueue[i];
                var cards = [];
                for (var j in gradeList) {
                    if (gradeList.hasOwnProperty(j)) {
                        var grade = gradeList[j];
                        cards = [].concat(cards, this.findCardByGrade(cardsStock, grade, num));
                    }
                }
                cardQueue.push(cards);
            }
        }

        return cardQueue;
    },
    // JJLog.print( tranlateGradeQueueToCardQueue([5, 6, 19, 46, 8, 21, 34, 9, 22, 10, 23, 36, 49, 53, 54],
    //                     [[ 5, 6, 7, 8, 9 ], [ 6, 7, 8, 9, 10 ]], 1) );

    // 将grade的列表，转化为card的列表，card必须在手牌中
    tranlateGradeListToCardList: function (cardsStock, gradeList, num) {
        var cards = [];
        for (var j in gradeList) {
            if (gradeList.hasOwnProperty(j)) {
                var grade = gradeList[j];
                cards = [].concat(cards, this.findCardByGrade(cardsStock, grade, num));
            }
        }

        return cards;
    },
    // 将grade的列表，转化为card的队列，card必须在手牌中
    tranlateGradeListToCardQueue: function (cardsStock, gradeList, num) {
        var cards = [];
        for (var j in gradeList) {
            if (gradeList.hasOwnProperty(j)) {
                var grade = gradeList[j];
                cards.push(this.findCardByGrade(cardsStock, grade, num));
            }
        }

        return cards;
    },
    // 将grade的列表，转化为card的列表，card必须在手牌中 数量不定
    tranlateGradeListToAnyCardList: function (cardsStock, gradeList, num) {
        var cards = [];
        for (var j in gradeList) {
            if (gradeList.hasOwnProperty(j)) {
                var grade = gradeList[j];
                cards = [].concat(cards, this.findAnyCardByGrade(cardsStock, grade, num));
            }
        }

        return cards;
    },

    // 依次提示所有能出的单牌
    hintDan: function (cardsStock, preCards, preCardsType, _numToGradeAr) {

        // 能出的单牌的grade
        var gradeQueue = [];

        var baseGrade = 0;
        if (preCards && preCardsType) {
            baseGrade = preCardsType.maxLevel;
        }
        // 出现次数作为key，牌值作为value
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cardsStock);
        gradeQueue = [].concat(
            _.filter(numToGradeAr['x1'], function (grade) {
                return grade > baseGrade;
            }),
            _.filter(numToGradeAr['x2'], function (grade) {
                return grade > baseGrade;
            }),
            _.filter(numToGradeAr['x3'], function (grade) {
                return grade > baseGrade;
            }),
            _.filter(numToGradeAr['x4'], function (grade) {
                return grade > baseGrade;
            })
        );
        var cardQuene = [];
        cardQuene = [].concat(this.tranlateGradeListToCardQueue(cardsStock, gradeQueue, 1));
        if (this.changeGrade > baseGrade && this.changeCount > 0) {
            cardQuene.push(this.addChangeCard([], 1));
        }
        // 将grade转换为id
        return cardQuene;
    },

    // 依次提示所有能出的对子
    hintDuizi: function (cardsStock, preCards, preCardsType, _numToGradeAr) {
        // 能出的牌grade
        var gradeQueue = [];
        var cardsList = [];

        var baseGrade = 0;
        if (preCards && preCardsType) {
            baseGrade = preCardsType.maxLevel;
        }
        // 出现次数作为key，牌值作为value
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cardsStock);

        gradeQueue = [].concat(
            _.filter(numToGradeAr['x2'], function (grade) {
                return grade > baseGrade;
            }),
            _.filter(numToGradeAr['x3'], function (grade) {
                return grade > baseGrade;
            }),
            _.filter(numToGradeAr['x4'], function (grade) {
                return grade > baseGrade;
            })
        );
        cardsList = [].concat(cardsList, this.tranlateGradeListToCardQueue(cardsStock, gradeQueue, 2));

        var gradeList = [].concat(numToGradeAr['x1']);
        gradeList = _.filter(gradeList, function (grade) {
            return grade < 14 && grade > baseGrade;
        });
        gradeList = _.sortBy(gradeList, function (grade) {
            return grade;
        });
        var gradeQueue = [];
        for (var i = 0; i < gradeList.length; i++) {
            if (this.changeCount >= 1) {
                gradeQueue.push(gradeList[i]);
            } else {
                break;
            }
        }
        for (var key in gradeQueue) {
            if (gradeQueue.hasOwnProperty(key)) {
                var grade = gradeQueue[key];
                cardsList.push(this.addChangeCard(this.findCardByGrade(cardsStock, grade, 1), 1));
            }
        }

        // 将grade转换为id
        return cardsList;
    },

    // 依次提示所有能出的三张
    hintSan: function (cardsStock, preCards,preCardsType, _numToGradeAr) {
        var baseGrade = 0;
        if (preCards && preCardsType) {
            baseGrade = preCardsType.maxLevel;
        }
        var cardQueue = this.find3Tuple(cardsStock, baseGrade, _numToGradeAr);
        console.error("find3Tuple", cardQueue)
        return cardQueue;
    },

    //依次提示所有能出的顺子
    hintShunZi: function (cardsStock, preCards, preCardsType, _numToGradeAr, _length) {
        // 能出的牌grade
        var gradeQueue = [];
        var baseGrade = 0;
        var length = preCards ? preCards.length : _length; //如果自动出牌提示    顺子就比较粗暴了   只选用5张牌
        if (preCards && preCardsType) {
            baseGrade = preCardsType.maxLevel - length + 1;
        }
        if (cardsStock.length < length) return [];
        // 出现次数作为key，牌值作为value
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cardsStock);

        // 手牌中大于上手牌最小值，且能构成顺子的单牌grade列表
        var gradeList = [].concat(numToGradeAr['x1'], numToGradeAr['x2'], numToGradeAr['x3'], numToGradeAr['x4']);
        gradeList = _.filter(gradeList, function (grade) {
            return grade > baseGrade && grade < 13;
        });
        gradeList = _.sortBy(gradeList, function (grade) {
            return -grade;
        });
        //如果加上赖子都不能凑出合适长度的顺子
        if (gradeList.length + this.changeCount < length) {
            return [];
        }

        var i = 0, j = 0, k = 0;
        var nChangedNumber = 0;
        var nLevelBegin = 0, nLevelNext = 0;
        for (i = gradeList.length - 1; i >= 0; --i) {
            nLevelBegin = gradeList[i];
            if (nLevelBegin - this.changeCount > 13 - length) {
                break;
            }
            var cardsTemp = [];
            nChangedNumber = 0;
            nLevelNext = nLevelBegin;
            //以nLevelBegin为起点 开始向前寻找 没有则以赖子替代
            for (j = i; j >= 0; --j) {
                for (k = 0; k < gradeList[j] - nLevelNext;) {
                    nChangedNumber++;
                    nLevelNext++;
                    if (nLevelNext - nLevelBegin > length - 1) {
                        break;
                    }
                }
                if (nLevelNext - nLevelBegin > length - 1) {
                    break;
                }
                cardsTemp.push(gradeList[j]);
                nLevelNext++;
                if (this.changeCount >= nChangedNumber) {
                    if (nLevelNext - nLevelBegin > length - 1) {
                        break;
                    }
                } else {
                    break;
                }
            }

            //如果找完还不够长度 则向后寻找
            for (j = nLevelNext - nLevelBegin; j < length; ++j) {
                if (nLevelNext < 13) {
                    nChangedNumber++;
                    nLevelNext++;
                }
            }
            if (this.changeCount >= nChangedNumber) {
                nLevelNext = nLevelBegin - 1;
                var bFound = false;
                for (j = cardsTemp.length + nChangedNumber; j < length; ++j) {
                    if (gradeList[j] > 0) {
                        // 如果向前加的时候发现已经有该level的牌，
                        // 那么这种情况肯定找过了，不用考虑
                        bFound = true;
                        break;
                    }
                    nChangedNumber++;
                    nLevelNext--;
                }
                if (!bFound) {
                    if (this.changeCount >= nChangedNumber && nLevelNext > baseGrade - 1) {
                        JJLog.print("!!!!!!!!!!!!!!!", length, nChangedNumber, cardsTemp)
                        var tempObj = {cards: cardsTemp, nChangedNumber: nChangedNumber};
                        gradeQueue.push(tempObj);
                    }
                }
            }
        }

        var cardQueue = [];
        for (var key in gradeQueue) {
            if (gradeQueue.hasOwnProperty(key)) {
                var temp = gradeQueue[key];
                var grade = temp["cards"];
                var nums = temp["nChangedNumber"];
                cardQueue.push(this.addChangeCard(this.tranlateGradeListToCardList(cardsStock, grade, 1), nums))
            }
        }
        return cardQueue;
    },

    //提示所有顺子
    hintAllShunZi: function (cardsStock, preCards, _numToGradeAr) {
        var cards = []
        for (var i = cardsStock.length; i >= 5; i--) {
            cards = [].concat(cards, this.hintShunZi(cardsStock, false,false, _numToGradeAr, i));
        }
        // return cards.slice(0, 1);
        return cards;
    },
    //提示最大的顺子
    hintMaxShunZi: function (cardsStock, _numToGradeAr) {
        var cards = []
        for (var i = cardsStock.length; i >= 5; i--) {
            var temp = this.hintShunZi(cardsStock, false,false, _numToGradeAr, i);
            if (temp.length > 0) {
                cards.push({cardsType: DouDiZhuType.CT_SINGLE_LINE,cards:temp[0], cardsLength: i});
                break;
            }
        }
        return cards;
    },

    //一次提示能出的连对
    hintLianDui: function (cardsStock, preCards, preCardsType, _numToGradeAr, _length) {
        // 能出的牌grade
        var gradeQueue = [];
        var baseGrade = 0;
        var length = preCards.length ? Math.floor(preCards.length / 2) : _length;
        if (preCards && preCardsType) {
            baseGrade = preCardsType.maxLevel - length + 1;
        }
        // 出现次数作为key，牌值作为value
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cardsStock);
        //牌值作为key 次数作为value
        var cLevelNumber = DDZCard_Rule.getGrades(cardsStock);
        // 手牌中，大于上手牌的最小值，且能构成连对的grade列表
        var gradeList = [].concat(numToGradeAr['x1'], numToGradeAr['x2'], numToGradeAr['x3'], numToGradeAr['x4']);
        gradeList = _.filter(gradeList, function (grade) {
            return grade > baseGrade && grade < 13;
        });
        gradeList = _.sortBy(gradeList, function (grade) {
            return -grade;
        });
        //如果加上赖子都不够长度 则返回
        if (gradeList.length + this.changeCount / 2 < length) {
            return [];
        }

        var i = 0, j = 0, k = 0;
        var nChangedNumber = 0;
        var nChangedTypeNumber = 0;
        var nLevelBegin = 0, nLevelNext = 0, nLevelTemp = 0;
        for (i = gradeList.length - 1; i >= 0; --i) {
            nLevelBegin = gradeList[i];
            if (nLevelBegin - this.changeCount / 2 > 13 - length) {
                break;
            }
            var cardsTemp = [];
            nChangedNumber = 0;
            nChangedTypeNumber = 0;

            nLevelNext = nLevelBegin;
            for (j = i; j >= 0; --j) {
                nLevelTemp = gradeList[j];
                if (nLevelTemp - nLevelBegin > length - 1) {
                    break;
                }
                for (k = 0; k < nLevelTemp - nLevelNext;) {
                    nChangedNumber += 2;
                    nChangedTypeNumber++;
                    nLevelNext++;
                }
                if (nLevelNext - nLevelBegin > length - 1) {
                    break;
                }
                cardsTemp.push(gradeList[j]);
                if (cLevelNumber[gradeList[j]] == 1) {
                    nChangedNumber++;
                }
                if (this.changeCount >= nChangedNumber) {
                    nLevelNext++;
                    if (nLevelNext - nLevelBegin > length - 1) {
                        break;
                    }
                } else {
                    break;
                }
            }
            for (j = nLevelNext - nLevelBegin; j < length; ++j) {
                if (nLevelNext < 13) {
                    nChangedNumber += 2;
                    nChangedTypeNumber++;
                    nLevelNext++;
                }
            }
            if (this.changeCount >= nChangedNumber) {
                nLevelNext = nLevelBegin - 1;
                var bFound = false;
                for (j = cardsTemp.length + nChangedTypeNumber; j < length; ++j) {
                    if (cLevelNumber[nLevelNext] > 0) {
                        bFound = true;
                        break;
                    }
                    nChangedNumber += 2;
                    nChangedTypeNumber++;
                    nLevelNext--;
                }
                if (!bFound) {
                    if (this.changeCount >= nChangedNumber && nLevelNext > baseGrade - 1) {
                        var tempObj = {cards: cardsTemp, nChangedNumber: nChangedNumber};
                        gradeQueue.push(tempObj);
                    }
                }
            }
        }
        var cardQueue = [];
        for (var key in gradeQueue) {
            if (gradeQueue.hasOwnProperty(key)) {
                var temp = gradeQueue[key];
                var grade = temp["cards"];
                var nums = temp["nChangedNumber"];
                cardQueue.push(this.addChangeCard(this.tranlateGradeListToAnyCardList(cardsStock, grade, 2), nums))
            }
        }
        return cardQueue;
    },

    //提示所有连对
    hintAllLianDui: function (cardsStock, preCards, _numToGradeAr) {
        var cards = []
        for (var i = Math.floor(cardsStock.length / 2); i >= 3; --i) {
            cards = [].concat(cards, this.hintLianDui(cardsStock, false,false, _numToGradeAr, i));
        }
        // return cards.slice(0, 1);
        return cards;
    },

    //提示选起的手牌中最大的连对
    hintMaxLianDui: function (cardsStock, _numToGradeAr) {
        var cards = [];
        for (var i = Math.floor(cardsStock.length / 2); i >= 3; i--) {
            var temp = this.hintLianDui(cardsStock, false,false, _numToGradeAr, i);
            if (temp.length > 0) {
                cards.push({cardsType: DouDiZhuType.CT_DOUBLE_LINE,cards:temp[0], cardsLength: i});
                break;
            }
        }
        return cards;
    },

    //提示飞机不带
    hintFeiJi: function (cardsStock, preCards,preCardsType, _numToGradeAr, length) {
        var baseGrade = 0;
        if (preCards && preCardsType) {
            baseGrade = preCardsType.maxLevel;
        }
        var length = preCards ? preCards.length / 3 : length;

        return this.findContinue3Tuple(cardsStock, baseGrade, length, _numToGradeAr);
    },

    //提示所有能出的飞机
    hintAllFeiJi: function (cardsStock, preCards, _numToGradeAr) {
        var cards = []
        for (var i = Math.floor(cardsStock.length / 3); i >= 2; --i) {
            cards = [].concat(cards, this.hintFeiJi(cardsStock, false,false, _numToGradeAr, i));
        }
        // return cards.slice(0, 1);
        return cards;
    },

    //提示选起的手牌中最大的飞机
    hintMaxFeiJi: function (cardsStock, _numToGradeAr) {
        var cards = [];
        for (var i = Math.floor(cardsStock.length / 3); i >= 3; i--) {
            var temp = this.hintFeiJi(cardsStock, false,false, _numToGradeAr, i);
            if (temp.length > 0) {
                cards.push({cardsType: DouDiZhuType.CT_SIX_LINE_TAKE_FORE,cards:temp[0], cardsLength: i});
                break;
            }
        }
        return cards;
    },

    //提示三带一
    hintSanDaiYi: function (cards, preCards, preCardsType, _numToGradeAr) {

        var keyGrade = 0;
        if (preCards && preCardsType) {
            keyGrade = preCardsType.maxLevel;
        }
        // 出现次数作为key，牌值作为value
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cards);

        // 遍历所有三张，找到去除指定三张之外的最小的单张，得到三带一
        var sandaiyiCardsList = [];
        var sanCardsList = this.find3Tuple(cards, keyGrade, numToGradeAr);
        for (var key in sanCardsList) {
            if (sanCardsList.hasOwnProperty(key)) {
                var sanCards = sanCardsList[key];
                var danCardsList = this.findDanByNum(_.filter(cards, function (card) {
                    return !_.includes(sanCards, card);
                }), 1);

                if (danCardsList[0]) {
                    var danCards = danCardsList[0];
                    sandaiyiCardsList.push([].concat(sanCards, danCards));
                }
            }
        }
        return sandaiyiCardsList;
    },
    //提示三带对
    hintSanDaiDui: function (cards, preCards, preCardsType, _numToGradeAr) {

        var keyGrade = 0;
        if (preCards && preCardsType) {
            keyGrade = preCardsType.maxLevel;
        }
        // 出现次数作为key，牌值作为value
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cards);

        // 遍历所有三张，找到去除指定三张之外的最小的对子，得到三带一
        var sandaiduiCardsList = [];
        var sanCardsList = this.find3Tuple(cards, keyGrade, numToGradeAr);
        for (var key in sanCardsList) {
            if (sanCardsList.hasOwnProperty(key)) {
                var sanCards = sanCardsList[key];
                var cardsStock = _.filter(cards, function (card) {
                    return !_.includes(sanCards, card);
                })
                var duiziCardsList = this.findDuiziByNum(cardsStock, 1);

                if (duiziCardsList.length == 2) {
                    sandaiduiCardsList.push([].concat(sanCards, duiziCardsList));
                }
            }
        }
        return sandaiduiCardsList;
    },

    //提示飞机带单
    hintFeiJiDaiDan: function (cards, preCards, preCardsType, _numToGradeAr) {
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cards);

        var keyGrade = 0;
        var length = preCards.length ? preCards.length / 4 : 2;
        if (preCards && preCardsType) {
            keyGrade = preCardsType.maxLevel - length + 1;
        }
        // 使用飞机中最小的值作为关键牌值，与HintRule统一
        // keyGrade = keyGrade - length + 1;

        var feijiCardsList = this.findContinue3Tuple(cards, keyGrade, length, numToGradeAr);

        // 飞机带单
        var feijidaidanCardsList = [];
        for (var key in feijiCardsList) {
            if (feijiCardsList.hasOwnProperty(key)) {
                var feijiCards = feijiCardsList[key];
                var cardsStock = _.filter(cards, function (card) {
                    return !_.includes(feijiCards, card);
                });

                var danList = this.findDanByNum(cardsStock, feijiCards.length / 3);
                if (danList.length == feijiCards.length / 3) {
                    feijidaidanCardsList.push([].concat(feijiCards, danList));
                }
            }
        }
        return feijidaidanCardsList;
    },

    //提示飞机带对
    hintFeiJiDaiDui: function (cards, preCards, preCardsType, _numToGradeAr) {

        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cards);

        var keyGrade = 0;
        var length = preCards.length ? preCards.length / 5 : 2;
        if (preCards && preCardsType) {
            keyGrade = preCardsType.maxLevel - length + 1;
        }
        // 使用飞机中最小的值作为关键牌值，与HintRule统一
        // keyGrade = keyGrade - length + 1;

        var feijiCardsList = this.findContinue3Tuple(cards, keyGrade, length, numToGradeAr);

        // 飞机带对
        var feijidaiduiCardsList = [];
        for (var key in feijiCardsList) {
            if (feijiCardsList.hasOwnProperty(key)) {
                var feijiCards = feijiCardsList[key];
                var cardsStock = _.filter(cards, function (card) {
                    return !_.includes(feijiCards, card);
                });

                var duiziCardsList = this.findDuiziByNum(cardsStock, feijiCards.length / 3);
                if (duiziCardsList.length == feijiCards.length / 3 * 2) {
                    feijidaiduiCardsList.push([].concat(feijiCards, duiziCardsList));
                }
            }
        }
        return feijidaiduiCardsList;
    },

    //提示四带两个
    hintSiDai2Dan: function (cards, preCards, preCardsType, _numToGradeAr) {
        var keyGrade = 0;
        if (preCards && preCardsType) {
            keyGrade = preCardsType.maxLevel;
        }
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cards);
        // 将grade转换为id
        var siCardsList = this.find4Tuple(cards, keyGrade, numToGradeAr);
        // 四带二
        var sidaierCardsList = [];
        for (var key in siCardsList) {
            if (siCardsList.hasOwnProperty(key)) {
                var siCards = siCardsList[key];
                var cardsStock = _.filter(cards, function (card) {
                    return !_.includes(siCards, card);
                });

                var danX2 = this.findDanByNum(cardsStock, 2);
                if (danX2.length == 2) {
                    sidaierCardsList.push([].concat(siCards, danX2));
                }
            }
        }

        return sidaierCardsList;
    },
    //提示四带两对
    hintSiDai2Dui: function (cards, preCards, preCardsType, _numToGradeAr) {
        var keyGrade = 0;
        if (preCards && preCardsType) {
            keyGrade = preCardsType.maxLevel;
        }
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cards);

        // 将grade转换为id
        var siCardsList = this.find4Tuple(cards, keyGrade, numToGradeAr);

        // 四带二对
        var sidaierduiCardsList = [];
        for (var key in siCardsList) {
            if (siCardsList.hasOwnProperty(key)) {
                var siCards = siCardsList[key];
                var cardsStock = _.filter(cards, function (card) {
                    return !_.includes(siCards, card);
                });

                var duiziCardsList = this.findDuiziByNum(cardsStock, 2);
                if (duiziCardsList.length == 2 * 2) {
                    sidaierduiCardsList.push([].concat(siCards, duiziCardsList));
                }
            }
        }

        return sidaierduiCardsList;
    },
    //提示炸弹
    hint4Boom: function (cards, preCards, preCardsType, _numToGradeAr) {

        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cards);
        var cLevelNumber = DDZCard_Rule.getGrades(cards);
        if (preCards && preCardsType && DouDiZhuType.CT_BOMB == preCardsType.cardsType) {
            var keyGrade = preCardsType.maxLevel;
            var mLength = preCardsType.cardsLength;
        } else {
            var keyGrade = 0;
        }
        // 能出的牌grade
        var cardQueue = [];
        var gradeQueue = [];
        var cardsTemp = [];
        if (keyGrade > 0) {
            if (mLength == 1) {
                //上一手为软炸
                var gradeQueue = [].concat(numToGradeAr["x4"], numToGradeAr["x3"], numToGradeAr["x2"], numToGradeAr["x1"]);
                for (var i in gradeQueue) {
                    if (gradeQueue.hasOwnProperty(i)) {
                        var grade = gradeQueue[i];
                        var nChanged = 4 - cLevelNumber[grade];
                        if (cLevelNumber[grade] == 4) {
                            cardsTemp.push({grade: grade, num: 0,count: cLevelNumber[grade]});
                        } else if (cLevelNumber[grade] > 0 && this.changeCount >= nChanged && grade < 14) {
                            if (grade > keyGrade) {
                                cardsTemp.push({grade: grade, num: nChanged,count: cLevelNumber[grade]});
                            } else if (this.changeCount > nChanged) {
                                cardsTemp.push({grade: grade, num: nChanged + 1,count: cLevelNumber[grade]});
                            }
                        }
                    }
                }
            } else if (mLength == 4) {
                //上一手为硬炸
                var gradeQueue = [].concat(numToGradeAr["x4"], numToGradeAr["x3"], numToGradeAr["x2"], numToGradeAr["x1"]);
                for (var i = 0; i < gradeQueue.length; i++) {
                    var grade = gradeQueue[i];
                    var nChanged = 5 - cLevelNumber[grade];
                    if (cLevelNumber[grade] == 4 && grade > keyGrade && grade < 14) {
                        cardsTemp.push({grade: grade, num: 0,count: cLevelNumber[grade]});
                    } else if (this.changeCount >= nChanged && grade < 14) {
                        cardsTemp.push({grade: grade, num: nChanged,count: cLevelNumber[grade]});
                    }
                }
            } else if (mLength > 4) {
                var gradeQueue = [].concat(numToGradeAr["x4"], numToGradeAr["x3"], numToGradeAr["x2"], numToGradeAr["x1"]);
                for (var i = 0; i < gradeQueue.length; i++) {
                    var grade = gradeQueue[i];
                    var nChanged = mLength - cLevelNumber[grade];
                    if (this.changeCount >= nChanged && grade < 14) {
                        if (grade > keyGrade) {
                            cardsTemp.push({grade: grade, num: nChanged,count: cLevelNumber[grade]});
                        } else if (this.changeCount > nChanged) {
                            cardsTemp.push({grade: grade, num: nChanged + 1,count: cLevelNumber[grade]});
                        }
                    }
                }
            }
        } else {
            var gradeQueue = [].concat(numToGradeAr["x4"], numToGradeAr["x3"], numToGradeAr["x2"], numToGradeAr["x1"]);
            for (var i in gradeQueue) {
                if (gradeQueue.hasOwnProperty(i)) {
                    var grade = gradeQueue[i];
                    var nChanged = 4 - cLevelNumber[grade];
                    if (cLevelNumber[grade] > 0 && this.changeCount >= nChanged && grade < 14) {
                        cardsTemp.push({grade: grade, num: nChanged, count: cLevelNumber[grade]});
                    }
                }
            }
        }

        // 将grade转换为id

        for (var i = 0; i < cardsTemp.length; i++) {
            var obj = cardsTemp[i];
            cardQueue.push(this.addChangeCard(this.findCardByGrade(cards, obj.grade, obj.count), obj.num));
        }
        return cardQueue;
    },
    //提示王炸
    hint2Joker: function (handCards) {
        var bRes = false;
        var vecCards = [];
        var cSmall = -1, cBig = -1;
        for (var i = 0; i < handCards.length; i++) {
            if (handCards[i].value == 15 && handCards[i].type == 5) {
                cBig = i;
            }
            if (handCards[i].value == 14 && handCards[i].type == 5) {
                cSmall = i;
            }
        }
        bRes = (cBig != -1 && cSmall != -1);
        if (bRes) {
            vecCards.push([{type: 5, value: 14}, {type: 5, value: 15}]);
        }
        return vecCards;
    },

    // 为“四带二，飞机带单”找出需要的单牌。单牌优先，依次拆牌
    findDanByNum: function (cardsStock, num) {
        var cardsList = [];
        if (cardsStock.length < num) {
            return cardsList;
        }

        var numToGradeAr = this.analysisHandCardsChild(cardsStock);
        cardsList = [].concat(
            _.sortBy(this.tranlateGradeListToCardList(cardsStock, numToGradeAr['x1'], 1), function (card) {
                return DDZCard_Rule.getGrade(card);
            }),
            _.sortBy(this.tranlateGradeListToCardList(cardsStock, numToGradeAr['x2'], 2), function (card) {
                return DDZCard_Rule.getGrade(card);
            }),
            _.sortBy(this.tranlateGradeListToCardList(cardsStock, numToGradeAr['x3'], 3), function (card) {
                return DDZCard_Rule.getGrade(card);
            }),
            _.sortBy(this.addChangeCardTow([], this.changeCountChild, 0), function (card) {
                return DDZCard_Rule.getGrade(card);
            }),
            _.sortBy(this.tranlateGradeListToCardList(cardsStock, numToGradeAr['x4'], 4), function (card) {
                return DDZCard_Rule.getGrade(card);
            })
        );

        return cardsList.slice(0, num);
    },

    // 为“四带对，飞机带对”找出需要的对子。对子优先，依次拆牌
    findDuiziByNum: function (cardsStock, num) {
        var cardsList = [];
        if (cardsStock.length < num * 2) {
            return cardsList;
        }

        var numToGradeAr = this.analysisHandCardsChild(cardsStock);
        // 将所有对子放入数组头部，所有三张拆一对出来push进数组，所有四张全部push进入数组
        cardsList = [].concat(
            _.sortBy(this.tranlateGradeListToCardList(cardsStock, numToGradeAr['x2'], 2), function (card) {
                return DDZCard_Rule.getGrade(card);
            }),
            _.sortBy(this.tranlateGradeListToCardList(cardsStock, numToGradeAr['x3'], 2), function (card) {
                return DDZCard_Rule.getGrade(card);
            }),
            _.sortBy(this.tranlateGradeListToCardList(cardsStock, numToGradeAr['x4'], 4), function (card) {
                return DDZCard_Rule.getGrade(card);
            })
        );

        var gradeList = [].concat(numToGradeAr['x1']);
        gradeList = _.filter(gradeList, function (grade) {
            return grade < 14;
        });
        gradeList = _.sortBy(gradeList, function (grade) {
            return grade;
        });
        var nChangedID = 0;

        for (var i = 0; i < gradeList.length; i++) {
            nChangedID++;
            if (this.changeCountChild >= nChangedID) {
                cardsList = [].concat(cardsList, this.addChangeCardTow(this.findCardByGrade(cardsStock, gradeList[i], 1), 1, nChangedID - 1));
            } else {
                break;
            }
        }


        //添加癞子对
        if (this.changeCount - nChangedID >= 4) {
            cardsList = [].concat(cardsList, this.addChangeCardTow([], 4, nChangedID))
        } else if (this.changeCount - nChangedID >= 2) {
            cardsList = [].concat(cardsList, this.addChangeCardTow([], 2, nChangedID))
        }

        return cardsList.slice(0, num * 2);
    },

    //查找连续的3张
    findContinue3Tuple: function (cardsStock, keyGrade, length, _numToGradeAr) {
        var gradeQueue = [];
        // 出现次数作为key，牌值作为value
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cardsStock);
        //牌值作为key 次数作为value
        var cLevelNumber = DDZCard_Rule.getGrades(cardsStock);

        // 手牌中，大于上手牌的最小值，且能构成飞机的grade列表
        var gradeList = [].concat(numToGradeAr['x1'], numToGradeAr['x2'], numToGradeAr['x3'], numToGradeAr['x4']);
        gradeList = _.filter(gradeList, function (grade) {
            return grade > keyGrade && grade < 13;
        });
        gradeList = _.sortBy(gradeList, function (grade) {
            return -grade;
        });

        //如果加上赖子都不够长度 则返回
        if (gradeList.length + this.changeCount / 3 < length) {
            return [];
        }

        var i = 0, j = 0, k = 0;
        var nChangedNumber = 0;
        var nChangedTypeNumber = 0;
        var nLevelBegin = 0, nLevelNext = 0, nLevelTemp = 0;
        for (i = gradeList.length - 1; i >= 0; --i) {
            nLevelBegin = gradeList[i];
            if (nLevelBegin - this.changeCount / 3 > 13 - length) {
                break;
            }
            var cardsTemp = [];
            nChangedNumber = 0;
            nChangedTypeNumber = 0;

            nLevelNext = nLevelBegin;
            for (j = i; j >= 0; --j) {
                nLevelTemp = gradeList[j];
                if (nLevelTemp - nLevelBegin > length - 1) {
                    break;
                }
                for (k = 0; k < nLevelTemp - nLevelNext;) {
                    nChangedNumber += 3;
                    nChangedTypeNumber++;
                    nLevelNext++;
                }
                if (nLevelNext - nLevelBegin > length - 1) {
                    break;
                }
                cardsTemp.push(gradeList[j]);
                if (cLevelNumber[gradeList[j]] == 1) {
                    nChangedNumber += 2;
                } else if (cLevelNumber[gradeList[j]] == 2) {
                    nChangedNumber++
                }
                if (this.changeCount >= nChangedNumber) {
                    nLevelNext++;
                    if (nLevelNext - nLevelBegin > length - 1) {
                        break;
                    }
                } else {
                    break;
                }
            }
            for (j = nLevelNext - nLevelBegin; j < length; ++j) {
                if (nLevelNext < 13) {
                    nChangedNumber += 3;
                    nChangedTypeNumber++;
                    nLevelNext++;
                }
            }
            if (this.changeCount >= nChangedNumber) {
                nLevelNext = nLevelBegin - 1;
                var bFound = false;
                for (j = cardsTemp.length + nChangedTypeNumber; j < length; ++j) {
                    if (cLevelNumber[nLevelNext] > 0) {
                        bFound = true;
                        break;
                    }
                    nChangedNumber += 3;
                    nChangedTypeNumber++;
                    nLevelNext--;
                }
                if (!bFound) {
                    if (this.changeCount >= nChangedNumber && nLevelNext > keyGrade - 1) {
                        var tempObj = {cards: cardsTemp, nChangedNumber: nChangedNumber};
                        gradeQueue.push(tempObj);
                    }
                }
            }
        }
        var cardQueue = [];
        for (var key in gradeQueue) {
            if (gradeQueue.hasOwnProperty(key)) {
                var temp = gradeQueue[key];
                var grade = temp["cards"];
                var nums = temp["nChangedNumber"];
                cardQueue.push(this.addChangeCard(this.tranlateGradeListToAnyCardList(cardsStock, grade, 3), nums))
            }
        }
        return cardQueue;
    },

    // 查找能出的三张
    find3Tuple: function (cardsStock, baseGrade, _numToGradeAr) {
        // 能出的牌grade
        var gradeQueue = [];
        var cardsQueue = [];
        //有没有4个2
        var bMax2 = false;
        // 出现次数作为key，牌值作为value
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cardsStock);
        gradeQueue = [].concat(
            _.filter(numToGradeAr['x3'], function (grade) {
                if (grade == 13) {
                    bMax2 = true;
                }
                return grade > baseGrade;
            })
        );
        cardsQueue = [].concat(cardsQueue, this.tranlateGradeListToCardQueue(cardsStock, gradeQueue, 3));

        if (this.changeCount >= 1) {
            gradeQueue = [].concat(
                _.filter(numToGradeAr['x2'], function (grade) {
                    if (grade == 13) {
                        bMax2 = true;
                    }
                    return grade > baseGrade;
                })
            );
            var tempArray = this.tranlateGradeListToCardQueue(cardsStock, gradeQueue, 2);
            for (var key in tempArray) {
                var temp = tempArray[key];
                cardsQueue.push(this.addChangeCard(temp, 1));

            }
        }
        if (this.changeCount >= 2) {
            gradeQueue = [].concat(
                _.filter(numToGradeAr['x1'], function (grade) {
                    if (grade == 13) {
                        bMax2 = true;
                    }
                    return grade > baseGrade && grade < 14;
                })
            );
            var tempArray = this.tranlateGradeListToCardQueue(cardsStock, gradeQueue, 1);
            for (var key in tempArray) {
                var temp = tempArray[key];
                cardsQueue.push(this.addChangeCard(temp, 2));

            }
        }
        //没有二提示癞子变的2
        if (this.changeCount >= 3 && !bMax2 && baseGrade < 13) {
            cardsQueue.push(this.addChangeCard([], 3));
        }
        // 将grade转换为id
        return cardsQueue;
    },

    //查找能出的四个
    find4Tuple: function (cardsStock, baseGrade, _numToGradeAr) {
        var gradeQueue = [];
        // 出现次数作为key，牌值作为value
        var numToGradeAr = _numToGradeAr || this.analysisHandCards(cardsStock);
        //牌值作为key 出现次数作为key
        var cLevelNumber = DDZCard_Rule.getGrades(cardsStock);
        //有没有4个二
        var bMax2 = false;
        var i = 0, j = 0;
        var nChangedID = 0;
        var nLevel = 0;
        var gradeList = [].concat(numToGradeAr['x1'], numToGradeAr['x2'], numToGradeAr['x3'], numToGradeAr['x4']);
        gradeList = _.filter(gradeList, function (grade) {
            return grade > baseGrade && grade < 14;
        });
        gradeList = _.sortBy(gradeList, function (grade) {
            return -grade;
        });

        for (i = gradeList.length - 1; i >= 0; --i) {
            var cardsTemp = [];
            nLevel = gradeList[i];
            nChangedID = 0;
            cardsTemp.push(nLevel);
            for (j = cLevelNumber[nLevel]; j < 4; j++) {
                nChangedID++;
            }
            if (this.changeCount >= nChangedID) {
                if (nLevel == 13) {
                    bMax2 = true;
                }
                var tempObj = {cards: cardsTemp, nChangedNumber: nChangedID};
                gradeQueue.push(tempObj);
            }
        }
        if (this.changeCount >= 4 && !bMax2 && baseGrade < 13) {
            var tempObj = {cards: [], nChangedNumber: 4};
            gradeQueue.push(tempObj);
        }
        var cardQueue = [];
        for (var key in gradeQueue) {
            if (gradeQueue.hasOwnProperty(key)) {
                var temp = gradeQueue[key];
                var grade = temp["cards"];
                var nums = temp["nChangedNumber"];
                cardQueue.push(this.addChangeCard(this.tranlateGradeListToAnyCardList(cardsStock, grade, 4), nums))
            }
        }
        return cardQueue;

    },
    // 获取关键牌值
    getKeyGradeAnyway: function (cards, cardType) {
        var obCards = DDZCard_Rule.cardsToCardsSet(cards);
        obCards.sortByLevel();
        DDZCard_Rule.setCardType(obCards);
        var ct_types = obCards.typeArray;
        if (ct_types.length === 1) {
            return obCards.getCardsTypeMaxLevel(0);
        }
        else {
            var typeIndex = 0;
            for (var i = 0; i < ct_types.length; i++) {
                if (cardType == obCards.getCardsType(i)) {
                    typeIndex = i;
                }
            }
            return obCards.getCardsTypeMaxLevel(i)
        }
    },

    find2Joker: function (handCards) {
        var bRes = false;
        var cSmall = -1, cBig = -1;
        for (var i = 0; i < handCards.length; i++) {
            if (handCards[i].value == 15 && handCards[i].type == 5) {
                cBig = i;
            }
            if (handCards[i].value == 14 && handCards[i].type == 5) {
                cSmall = i;
            }
        }
        bRes = (cBig != -1 && cSmall != -1);
        return bRes;
    },
    find4TupleMax2: function (handCards) {
        var bMax2 = false;
        var numToGradeAr = this.analysisHandCards(handCards);
        var gradeList = [].concat(numToGradeAr['x4']);
        for (var i = gradeList.length - 1; i >= 0; i--) {
            if (gradeList[i] == 13) {
                bMax2 = true;
            }
        }
        return bMax2;
    },
    //是否有两王 或者四个2
    checkMustLord: function (handCards) {
        var bRes = false;
        if (this.find2Joker(handCards) || this.find4TupleMax2(handCards)) {
            bRes = true;
        }
        return bRes;
    },

    //添加癞子牌
    addChangeCard: function (cards, num, value) {
        if (num > this.changeCount) return false;
        var tempArray = this.changeCards.slice(0, num);
        return [].concat(cards, tempArray);
    },
    //第二次添加癞子牌
    addChangeCardTow: function (cards, num, start) {
        start = start ? start : 0;
        var end = start + num;
        if (end > this.changeCountChild) return false;
        var tempArray = this.changeCardsChild.slice(start, num);
        return [].concat(cards, tempArray);
    },
};