
var TianDaKeng = function () {
    var PuKeType = {
        CT_ERROR: 0,                         //错误类型
        CT_SINGLE: 1,                        //单牌类型 3
        CT_DOUBLE: 2,                        //对牌类型 33
        CT_THREE: 3,                         //三同类型 333
        CT_SINGLE_LINE: 4,                   //顺子类型 34567
        CT_DOUBLE_LINE: 5,                   //对连类型 3344
        CT_THREE_LINE_TAKE_ONE: 6,           //三带一类型 3334
        CT_THREE_LINE_TAKE_TWO: 7,           //三带二类型 33344
        CT_FORE_LINE_TAKE_THREE: 8,          //四带三类型 3333456
        CT_SIX_LINE_TAKE_FORE: 9,            //飞机类型 3334445678
        CT_BOMB: 10                          //炸弹类型   33333
    };
    //  S H C D 黑红梅方  4 3 2 1
    //用于比较大小的数组
    //              0, A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J,  Q, K, King  King
    var compare = [0, 15, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16];
    //每个玩家的牌数
    var logic = function (opts) {
        this._gzBomb = opts.gzBomb != undefined ? opts.gzBomb : 0;
        this._WZP = opts.kingBomb != undefined ? opts.kingBomb : 0;
        compare[15] = opts.ABig == 1 ? 14 : 16;
    };
    
    var proto = logic.prototype;
    
    proto.CalScore = function (pisa) {
        var bombAdd = 0;
    
        for (var i = 0; i < pisa.length; i++) {
            bombAdd += compare[pisa[i].value];
        }
    
        // if (pisa.length != 5)
        // {
        //     return bombAdd;
        // }
    
        for(var i = 0;i<pisa.length;i++)
        {
            if(pisa[i].isGZ == null || pisa[i].isGZ == undefined)
                pisa[i].isGZ = 0;
        }
    
        pisa.sort(function (cardA, cardB) {
            if(compare[cardA.value] == compare[cardB.value])
            {
                return cardA.isGZ - cardB.isGZ;
            }
            else
            {
                return compare[cardA.value] - compare[cardB.value];
            }
        });
    
        var vecHintCards = {type: PuKeType.CT_ERROR, leftPisa: pisa, pisaPoint: 0};
    
        var kingCount = this.GetKingCount(pisa);
        if (pisa.length > 3 && this._findForeLine(pisa, vecHintCards)) {
            bombAdd += 60;
        } else if (pisa.length > 2 && this._findThreeLine(pisa, vecHintCards)) {
            if (kingCount > 1 && this._WZP == 1)
                bombAdd += 60;
            else
                bombAdd += 30;
        }
    
        if (kingCount > 1)
            bombAdd += 30;
    
        return bombAdd;
    };
    
    proto.GetLogicValue = function (pisa) {
        var value = 0;
        if(!!pisa) value = compare[pisa.value]
        return value;
    };
    
    //获取牌数量
    proto.GetKingCount = function (pisa) {
        var count = 0
        for (var i = 0; i < pisa.length; i++) {
            if (compare[pisa[i].value] == 14 || compare[pisa[i].value] == 16) {
                if (pisa[i].isGZ == 1) {
                    if (this._gzBomb == 1) {
                        count += 1;
                    }
                } else {
                    count += 1;
                }
            }
        }
        return count;
    };
    
    // 创建最后出牌的牌型 outCard.value : compare
    proto.createLastOp = function (lastOpPai, outCard) {
        outCard.opCard = lastOpPai.cards;
        outCard.opCardType = lastOpPai.type;
        outCard.count = 1;
        switch (outCard.opCardType) {
            case PuKeType.CT_SINGLE:
                outCard.value = outCard.opCard[0].value;
                break;
            case PuKeType.CT_DOUBLE:
                outCard.value = outCard.opCard[0].value;
                break;
            case PuKeType.CT_THREE:
                outCard.value = outCard.opCard[0].value;
                break;
            case PuKeType.CT_BOMB:
                outCard.value = outCard.opCard[0].value;
                break;
            case PuKeType.CT_SIX_LINE_TAKE_FORE:
                this.IsContinue3(outCard.opCard, outCard)
                break;
            case PuKeType.CT_DOUBLE_LINE:
                this.IsContinue2(outCard.opCard, outCard)
                break;
            case PuKeType.CT_SINGLE_LINE:
                this.IsStraight(outCard.opCard, outCard)
                break;
            case PuKeType.CT_FORE_LINE_TAKE_THREE:
                this.Is4And3(outCard.opCard, outCard);
                break;
            case PuKeType.CT_THREE_LINE_TAKE_TWO:
                this.Is3And2(outCard.opCard, outCard);
                break;
            case PuKeType.CT_THREE_LINE_TAKE_ONE:
                this.Is3And1(outCard.opCard, outCard)
                break;
        }
    }
    
    //获取最大的单牌
    proto._findSingle = function (CardsInHand, vecHintCards) {
        var bRes = false;
        for (var i = CardsInHand.length - 1; i >= 0; i--) {
            //获取数值
            var bHandLogicValue = compare[CardsInHand[i].value];
            if (bHandLogicValue == 14 || bHandLogicValue == 16) continue;
            //完成判断
            var temp = [];
            CardsInHand.forEach(function (el) {
                temp.push({type: el.type, value: el.value, isGZ: el.isGZ})
            });
            for (var l = 0; l < temp.length; l++) {
                if (temp[l].value == CardsInHand[i].value) {
                    temp.splice(l, 1);
                    break;
                }
            }
            vecHintCards.type = PuKeType.CT_SINGLE;
            vecHintCards.pisaPoint = bHandLogicValue;
            vecHintCards.leftPisa = temp;
            bRes = true;
            break;
    
        }
        return bRes;
    }
    
    //找对
    proto._findDouble = function (CardsInHand, vecHintCards) {
        var bRes = false;
        //搜索连牌
        for (var i = CardsInHand.length - 1; i >= 0; i--) {
            //获取数值
            var bHandLogicValue = compare[CardsInHand[i].value];
            if (bHandLogicValue == 14 || bHandLogicValue == 16) continue;
            if (this._gzBomb == 0 && CardsInHand[i].isGZ == 1) continue;
            //搜索连牌
            for (var j = i; j >= 1; j--) {
                if ((compare[CardsInHand[j].value]) != bHandLogicValue) continue;
                if ((compare[CardsInHand[j - 1].value]) != bHandLogicValue) continue;
                //完成判断
                var temp = [];
                CardsInHand.forEach(function (el) {
                    temp.push({type: el.type, value: el.value, isGZ: el.isGZ})
                });
                for (var l = 0; l < temp.length; l++) {
                    if (temp[l].value == CardsInHand[i].value) {
                        temp.splice(l, 2);
                        break;
                    }
                }
                vecHintCards.type = PuKeType.CT_DOUBLE;
                vecHintCards.pisaPoint = bHandLogicValue;
                vecHintCards.leftPisa = temp;
                bRes = true;
                break;
            }
        }
        return bRes;
    }
    
    //找三同
    proto._findThreeLine = function (CardsInHand, vecHintCards) {
        var bRes = false;
        //搜索连牌
        for (var i = CardsInHand.length - 1; i >= 0; i--) {
            //获取数值
            var bHandLogicValue = compare[CardsInHand[i].value];
            //构造判断
            if (bHandLogicValue == 14 || bHandLogicValue == 16) continue;
            if (this._gzBomb == 0 && CardsInHand[i].isGZ == 1) continue;
            //搜索连牌
            for (var j = i; j >= 2; j--) {
                //三牌判断
                if ((compare[CardsInHand[j].value]) != bHandLogicValue) continue;
                if ((compare[CardsInHand[j - 1].value]) != bHandLogicValue) continue;
                if ((compare[CardsInHand[j - 2].value]) != bHandLogicValue) continue;
                //完成判断
                var temp = [];
                CardsInHand.forEach(function (el) {
                    temp.push({type: el.type, value: el.value, isGZ: el.isGZ})
                });
    
                for (var l = 0; l < temp.length; l++) {
                    if (temp[l].value == CardsInHand[i].value) {
                        temp.splice(l, 3);
                        break;
                    }
                }
                vecHintCards.type = PuKeType.CT_THREE;
                vecHintCards.pisaPoint = bHandLogicValue;
                vecHintCards.leftPisa = temp;
                bRes = true;
                break;
            }
        }
        return bRes;
    }
    
    //找四同
    proto._findForeLine = function (CardsInHand, vecHintCards) {
        var bRes = false;
        //搜索连牌
        for (var i = CardsInHand.length - 1; i >= 0; i--) {
            //获取数值
            var bHandLogicValue = compare[CardsInHand[i].value];
            //构造判断
            if (bHandLogicValue == 14 || bHandLogicValue == 16) continue;
            if (this._gzBomb == 0 && CardsInHand[i].isGZ == 1) continue;
            //搜索连牌
            for (var j = i; j >= 3; j--) {
                //四牌判断
                if ((compare[CardsInHand[j].value]) != bHandLogicValue) continue;
                if ((compare[CardsInHand[j - 1].value]) != bHandLogicValue) continue;
                if ((compare[CardsInHand[j - 2].value]) != bHandLogicValue) continue;
                if ((compare[CardsInHand[j - 3].value]) != bHandLogicValue) continue;
                //完成判断
                var temp = [];
                CardsInHand.forEach(function (el) {
                    temp.push({type: el.type, value: el.value, isGZ: el.isGZ})
                });
    
                for (var l = 0; l < temp.length; l++) {
                    if (temp[l].value == CardsInHand[i].value) {
                        temp.splice(l, 4);
                        break;
                    }
                }
                vecHintCards.type = PuKeType.CT_BOMB;
                vecHintCards.pisaPoint = bHandLogicValue;
                vecHintCards.leftPisa = temp;
                bRes = true;
                break;
            }
        }
        return bRes;
    }


    /**
     * 创建
     * 释放
     * 实例访问
     */
    var instance = null;
    /**
     * 
     * @param {cc.p} mgPos    告知发牌器的位置  世界坐标
     */
    var create = function (opts) {
        if (!instance) {
            instance = new logic(opts);
        }
        return instance;
    };

    var release = function () {
        if (instance) {
            // instance.release();
            instance = null;
        }
    };

    /**
     * 导出接口
     * 每个单例对象都要到处三个接口
     * 一个create、一个release、一个Instance
     */
    var reLogic = {
        create: create,
        release: release
    };

    Object.defineProperty(reLogic, "Instance", {
        get: function () {
            create();
            return instance;
        }
    });

    return reLogic;

}();
