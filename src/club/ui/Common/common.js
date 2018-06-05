club.common = {
    getWanfaDesc: function (config) {
        JJLog.print("get wanfa desc" + config);
        JJLog.print("config", config)
        var wanfa = "";
        if (config.tableName == "paodekuai") {
            wanfa = this.getPDKTableDes.bind(config)();
        } else if (config.tableName == "shisanshui") {
            wanfa = this.getSSSTableDes(config)
        } else if (config.tableName == "qidong") {
            wanfa = this.getMajhongQDTableDes(config);
        } else if (config.tableName == "qidongbd") {
            wanfa = this.getMajhongBDTableDes(config);
        } else if (config.tableName == "qidongljc") {
            wanfa = this.getLJCTableDes(config);
        } else if (config.tableName == "fuzhou") {
            wanfa = this.getMajhongFZTableDes(config);
        } else if (config.tableName == "nanping") {
            wanfa = this.getMajhongNPTableDes(config);
        } else if (config.tableName == "doudizhu") {
            wanfa = this.getDDZTableDes.bind(config)();
        }else if (config.tableName == "tiandakeng") {
            wanfa = this.getTDKTableDes.bind(config)();
        } else if (config.tableName == "xuezhan") {
            wanfa = this.getXZTableDes.bind(config)();
        } else if (config.tableName == "baishan") {
            wanfa = this.getBSTableDes.bind(config)();
        }
        return wanfa;
    },
    getPDKTableDes:function () {
        // var desc = this.mode+'张,'+this.person+"人场,";
        var desc = this.mode+'张,'+this.person+"人场,";
        if (this.aaGem == 1)
            desc += "AA制收费,";
        else if (this.aaGem == 0)
            desc += "房主付费,";
        else if (this.aaGem == 2)
            desc += "大赢家付费,";
        if(this.firstMode == 1)
        {
            desc+= "赢家先出,";
        }
        else
        {
            desc+= "黑桃3先出,";
            if(this.mustContain == 1) desc+= "第一手牌必须包含黑桃3,";
        }

        if(this.showNum == 1)
            desc+= "显示剩余手牌张数,";
        else
            desc+= "不显示剩余手牌张数,";

        if (this.bombScore == 1) {
            desc += "炸弹算分";
        } else {
            desc += "炸弹不算分"
        }

        if(this.isSameIp == 1) desc+= "防作弊."
        return desc;
    },
    getDDZTableDes:function () {
        var desc = this.person + "人场,";
        if (this.mode == 1)
            desc += "抢地主,";
        else if (this.mode == 2)
            desc += "叫分,";
        if (this.aaGem == 1)
            desc += "AA制收费,";
        else if (this.aaGem == 0)
            desc += "房主付费,";
        else if (this.aaGem == 2)
            desc += "大赢家付费,";
        if (this.isLaiZi == 1)
            desc += "带赖子玩法,";
        if (this.maxBomb > 0) {
            var str = this.maxBomb + "炸封顶"
            desc += str;
        }

        if (this.isSameIp == 1) desc += "防作弊,"
        desc += this.rounds + "局";
        return desc;
    },
    getTDKTableDes:function () {
        var desc = this.person + "人场,";
        if (this.showCard == 1)
            desc += "亮底,";
        else
            desc += "不亮底,";
        if (this.king == 1)
            desc += "带王,";
        else
            desc += "不带王,";
        if (this.kingBomb == 1)
            desc += "带王中炮,";
        else
            desc += "不带王中炮,";
        if (this.tMode == 1)
            desc += "把踢,";
        else
            desc += "末踢,";
        if (this.gzBomb == 1)
            desc += "共张随豹,";
        else
            desc += "共张随点,";
        if (this.aaGem == 0)
            desc += "房主付费,";
        else if (this.aaGem == 1)
            desc += "平摊付费,";
        else if (this.aaGem == 2)
            desc += "大赢家付费,";
        if (this.isSameIp == 1) desc += "防作弊,"
        if (this.languo == 1)  desc += "烂锅翻倍,";
        if (this.jinyan == 1)  desc += "是否禁言,";
        if (this.lastT == 1)  desc += "末脚踢服,";
        if (this.ABig == 1)  desc += "抓A必炮,";
        if (this.auto == 1)  desc += "超时托管,";
        if (this.difen == 1)  desc += "底分,";
        desc +=  this.xifen + "喜分,";
        desc += this.rounds + "局";
        return desc;
    },
    getBSTableDes:function () {
        var desc = "白山麻将 ";
        if(this.person == 2)
        {
            desc += this.rounds + '局 ';
        }
        else
        {
            desc += this.rounds + '圈 ';
        }
        desc += this.person + "人 " + this.fengDing + "分封顶 ";

        if (this.baoSanJia == 1)
            desc += '包三家 ';
        if (this.isGold != 1) {
            if (this.aaGem == 1)
                desc += 'AA收费 ';
            else
                desc += '房主付费 ';
        }
        return desc;
    },
    getXZTableDes:function () {
        var desc = "血战麻将 ";

        if(this.mode == 1){
            desc = "推到胡 ";
        }else if(this.mode == 2){
            desc = "三人三房 ";
        }else if(this.mode == 3){
            desc = "三人两房 ";
        }


        desc += this.rounds +'局 ';
        desc += this.person+"人 " +this.fengDing+"番封顶 ";

        if(this.paiChuTime == -1)
        {
            desc+= "出牌无限制 "
        }else
        {
            desc+= this.paiChuTime+"秒出牌 "
        }

        if (this.wanFa1 == 0)
            desc += '自摸加底 ';
        else
            desc += '自摸加番 ';

        if (this.wanFa2 == 0)
            desc += '点杠花(自摸) ';
        else
            desc += '点杠花(点炮) ';

        if(this.huanSan == 1)
            desc += '换三张 ';
        if(this.one9 == 1)
            desc += '幺九将对 ';
        if(this.menQing == 1)
            desc += '门清中张 ';
        if(this.tianDi == 1)
            desc += '天地胡 ';
        if(this.isGold != 1){
            if (this.aaGem == 1)
                desc += 'AA收费 ';
            else
                desc += '房主付费 ';
        }
        return desc;
    },
    getSSSTableDesOld: function (data) {
        var person = data['person'];
        var mode = data['mode'];
        var ishavebanker = data['banker'];
        var AAgem = data['aaGem'];
        var area = data['area'];
        var wanfa = data['wanFa'];
        var wang = data['wang'];
        var isMa = data['isMa'];
        var desc = '';

        if (area == 'nb') {
            desc = "宁波十三道";
        } else {
            if (ishavebanker > 0) {
                desc = '坐庄十三水';
            } else {
                if (wanfa == 0)
                    desc = "经典十三水";
                else if (wanfa == 4) {
                    desc = "加一色十三水";
                }
                else if (wanfa == 1) {
                    desc = "加三张十三水";
                }
                else if (wanfa == 2) {
                    desc = "减一色十三水";
                } else {
                    desc = "全一色十三水";
                }
                if (wang > 0) {
                    desc = "百变十三水, " + wang + "张王";
                }
            }
        }
        desc = desc + "," + person + "人场, "
        var fufei = ["房主付费", "平摊付费", "大赢家付费"];
        if (AAgem > -1 && AAgem < 3) {
            desc = desc + fufei[AAgem];
        }
        var modeArr = ["", ",打枪加一", ",打枪2倍", ",打枪3倍"];
        if (mode > 0 && mode < 4) {
            desc = desc + modeArr[mode];
        }
        desc = desc + ".";
        return desc;
    },
    getMajhongQDTableDes:function (data) {
        this.roomId = data['tableId'];
        this.roundTotal = data['rounds'];
        this.aaGem = data['aaGem'];
        this.op1 = data['jia'];
        this.op2 = data['diScore'];
        this.op3 = data['niao'];
        this.op4 = data['isQiDui'];
        this.op6 = data['person'];
        this.laZi = data['laZi'];
        var desc = this.roundTotal  +'局';

        if(this.laZi > 0)
        {
            desc += (this.laZi+'分');
        }

        if(this.op1 > 0 )
        {
            desc += ' 嵌张';
        }
        if(this.op2 > 0)
        {
            desc += ' 底花X1';
        }
        if(this.op3 > 0)
        {
            desc += ' 飞苍蝇X1';
        }
        if(this.op4 > 0)
        {
            desc += ' 七对胡';
        }
        if(this.aaGem > 0)
        {
            desc += ' AA支付';
        }
        else
        {
            desc += ' 房主支付';
        }
        return desc;
    },
    getMajhongBDTableDes: function (data) {
        this.roomId = data['tableId'];
        this.roundTotal = data['rounds'];
        this.aaGem = data['aaGem'];
        this.op1 = data['isSBL'];
        this.op2 = data['laZi'];
        this.op3 = data['isMaiZhuang'];
        this.op4 = data['isHuangDaoDi'];
        this.op5 = data['isQiDui'];
        this.op6 = data['person'];
        this.isSBL = data['isSBL'];
        this.isHuaScore = data["isHuaScore"];

        var desc = this.roundTotal  +'局 ';

        if(this.op2 > 0)
        {
            desc += (this.op2+'番');
        }

        if(this.op1 == 1 )
        {
            desc += ' 双百佬';

        }else if(this.op1 == 0 )
        {
            desc += ' 单百佬';
        }

        if(this.isHuaScore == 0)
        {
            desc += " 花不算分";
        }
        else if(this.isHuaScore == 1)
        {
            desc += " 一花1分";
        }
        if(this.op3 > 0)
        {
            desc += ' 买庄';
        }
        if(this.op4 > 0)
        {
            desc += ' 一荒到底';
        }
        if(this.op5 > 0)
        {
            desc += ' 七对胡';
        }
        if(this.aaGem > 0)
        {
            desc += ' AA支付';
        }else
        {
            desc += ' 房主支付';
        }
        return desc;
    },
    getLJCTableDes: function (_data) {
        var data = {};
        data["tableStatus"] = _data;
        this.roomId = data["tableStatus"]['tableId'];
        this.roundTotal = data["tableStatus"]['rounds'];
        this.aaGem = data["tableStatus"]['aaGem'];
        this.op1 = data["tableStatus"]['isLaiZi'];
        this.op2 = data["tableStatus"]['laZi'];               //辣子
        this.op3 = data["tableStatus"]['isMaiZhuang'];
        this.op4 = data["tableStatus"]['isHuangDaoDi'];
        this.op5 = data["tableStatus"]['isQiDui'];
        this.op6 = data["tableStatus"]['person'];
        //this.isSBL = data["tableStatus"]['isSBL'];          //带百佬
        this.isHuaScore = data["tableStatus"]["isHuaScore"];


        this.dianPaoSanjia = data['tableStatus']['isDianPaoSanJia'];           //点炮赢3家
        this.isPengGangMenQing = data['tableStatus']['isPengGangMenQing'];     //二次杠算门清
        // 喜钱的四个可选项
        this.xiQian = data['tableStatus']['xiQian'];                                      //喜钱
        this.isYiTiaoLong = data['tableStatus']['isYiTiaoLong'];               //一条龙
        this.isQueMen = data['tableStatus']['isQueMen'];                       //缺门
        this.isYiLuanWu = data['tableStatus']['isYiLuanWu'];                   //一乱无
        this.isQuanXiao =  data['tableStatus']['isQuanXiao'];                  //全小
        this.isQingYiSe = data['tableStatus']['isQingYiSe'] ;                  //清一色

        this.isZuiJiang = data['tableStatus']['isZuiJiang'];                   //追将算坎钱  默认带
        this.isGuo = data['tableStatus']['isGuo'];                            //掴百搭 可选项，选择带百搭时才可选，默认带。若不带百搭则没有

        this.isYiPaoDuoXiang = data['tableStatus']['isYiPaoDuoXiang'];                      //一炮多响
        this.isBaiDaZiMo = data['tableStatus']['isBaiDaZiMo'];                  // 百搭自摸
        this.daDiaoChe = data['tableStatus']['daDiaoChe'];                       //大吊车算3番

        var desc = "";
        if(this.aaGem > 0)
        {
            desc += 'AA支付';
        }else
        {
            desc += '房主支付';
        }

        desc += this.roundTotal  +'局 ';

        if(this.op2 > 0)
        {
            desc += (this.op2+'番');
        }

        //喜钱
        if(this.xiQian > 0)
        {
            if(this.isYiTiaoLong == 1) {
                desc += ' 一条龙';
            }
            if(this.isQueMen == 1) {
                desc += ' 缺门';
            }
            if(this.isYiLuanWu){
                desc += ' 一乱无';
            }
            if(this.isQuanXiao == 1){
                desc += ' 全小' ;
            }
            if(this.isQingYiSe == 1){
                desc += ' 清一色' ;
            }
        }

        //可选玩法
        if(this.op3 > 0)
        {
            desc += ' 买庄';
        }

        if(this.op1 == 1 )
        {
            desc += ' 带百搭';
            if(this.isGuo)
            {
                desc += ' 掴百搭';
            }

        }else if(this.op1 == 0 )
        {
            // desc += ' 单百佬';
            // if(this.isGuo)
            // {
            //     desc += ' 掴百搭';
            // }
        }

        if(this.isZuiJiang == 1)
        {
            desc += ' 追将算坎钱';
        }

        if(this.dianPaoSanjia == 1)
        {
            desc += ' 点炮三家出';
        }

        if(this.isPengGangMenQing)
        {
            desc += ' 二次杠算门清';
        }
        if(this.isYiPaoDuoXiang == 1)
        {
            desc += ' 一炮多响';
        }
        if(this.isBaiDaZiMo ==1)
        {
            desc += ' 百搭自摸';
        }
        if(this.daDiaoChe == 1)
        {
            desc += ' 大吊车3番';
        }

        if(this.op5 > 0)
        {
            desc += ' 七小对';
        }

        return desc;
    },
    getSSSTableDes: function (_data) {
        var data = {};
        data["tableStatus"] = _data;
        JJLog.print("data", data);
        this.roomId = data["tableStatus"]['tableId'];
        this.roundTotal = data["tableStatus"]['rounds'];
        this.person = data["tableStatus"]['person'];
        this.ishavebanker = data["tableStatus"]['banker'];
        this.duose = data["tableStatus"]['duose'];
        this.mode = data["tableStatus"]['mode'];
        this.AAgem =  data["tableStatus"]['aaGem'];
        this.area =  data["tableStatus"]['area'];
        this.wanfa = data["tableStatus"]['wanFa'];
        this.wanFaType = data["tableStatus"]['wanFaType'];
        this.bei = data["tableStatus"]['bei'];
        this.bankerId = data["tableStatus"]['fangZhu'];
        this.isMa =  data["tableStatus"]['isMa'];
        this.isRePrivateTable = data["tableStatus"]['isRePrivateTable'];
        this.chongSan = data["tableStatus"]['chongSan'];
        this.wang = data["tableStatus"]['wang'];
        if(this.isMa > 0 && data["tableStatus"]['maPai'] != null && data["tableStatus"]['maPai'].type != null) {
            this.maPaiId = data["tableStatus"]['maPai'].type+""+data["tableStatus"]['maPai'].value;
        }
        this.tableInfo = data["tableStatus"]["players"];

        var juNum = this.roundTotal;
        var person = this.person;
        var duose = this.duose;
        var mode = this.mode;
        var ishavebanker = this.ishavebanker;
        var aaGem  = this.AAgem;
        var area  = this.area;
        var wanfa = this.wanfa;
        var chongSan = this.chongSan;
        var wang = this.wang;
        var shuangJiang = this.wanFaType;
        var mapaiId = this.maPaiId;
        var desc = '';

        if(area == 'nb')
        {
            desc = "宁波十三道";
        }else
        {
            if (ishavebanker > 0)
            {
                desc = '坐庄十三水';
            }else
            {
                if(wanfa == 0)
                    desc = "经典十三水";
                else if(wanfa == 4)
                {
                    desc = "加一色十三水";
                }
                else if(wanfa == 1)
                {
                    desc = "加三张十三水";
                }
                else if(wanfa == 2)
                {
                    desc = "减一色十三水";
                }else if(wanfa == 3)
                {
                    desc = "全一色十三水";
                }
                if(wang > 0 )
                    desc = "百变十三水";

                if (shuangJiang == 1)
                    desc = "双将十三水";
            }
        }

        desc += " "+ person +"人";
        desc +='('+ juNum +'局)';

        if(wang > 0)
            desc += ' 百变'+ wang +"张";
        if (ishavebanker > 0 || wang > 0 || shuangJiang == 1)
        {
            if(wanfa == 1)
            {
                desc += ' 加三张';
            }else if(wanfa == 2)
            {
                desc += ' 减一色';
            }else if(wanfa == 4)
            {
                desc += ' 加一色';
            }
        }

        if(mode == 1)
        {
            desc += ' 打枪加一';
        }else
        {
            desc += ' 打枪'+mode+"倍";
        }

        if(this.isMa == 1)
        {
            desc += ' 马牌('+SSSPoker.PokerPaiImage.paiName[mapaiId]+')';
        }
        if (aaGem == 0)
        {
            desc += ' 房主付费';
        }
        else if (aaGem == 1)
        {
            desc += ' 平摊付费';
        }else if(aaGem == 2)
        {

            desc += ' 大赢家付费';
        }

        if(chongSan == 1)
            desc += " 冲三";

        return desc;
    },
    getMajhongFZTableDes: function (_data) {
        var data = {};
        data["tableStatus"] = _data;
        this.roomId = data["tableStatus"]['tableId'];
        this.roundTotal = data["tableStatus"]['rounds'];
        this.aaGem = data["tableStatus"]['aaGem'];
        this.op1 = data["tableStatus"]['jinlong']; //金龙
        this.op2 = data["tableStatus"]['jinTwo']; //
        this.op3 = data["tableStatus"]['jinThree'];
        this.op4 = data["tableStatus"]['oneKe'];
        this.op5 = data["tableStatus"]['qinghun']; //清混一色
        this.op6 = data["tableStatus"]['person'];
        this.jinkan = data["tableStatus"]['jinkan'];
        this.fangHuBei =  data["tableStatus"]['fangHuBei'];

        var desc = '';
        if(this.op4 > 0)
        {
            desc = '1课 ';
        }else
        {
            desc = this.roundTotal +'局 ';
        }
        desc += this.op6+"人";
        if(this.aaGem == 1)
        {
            desc += ' AA支付';
        } else if (this.aaGem == 2) {
            desc += ' 大赢家支付';
        }
        else
        {
            desc += ' 房主支付';
        }

        if(this.jinkan == 1)
        {
            desc += " 金坎";
        }
        if(this.op5 == 1)
        {
            desc += " 清混一色";
        }
        if(this.op1 == 1)
        {
            desc += " 金龙";
        }
        // desc += " 游金X"+this.op5;

        if (this.op2 == 1)
        {
            desc += ' 双金不平胡';
        }

        var descStr = ["放胡全赔","放胡双倍单赔","放胡单赔"];
        if(this.fangHuBei == null || this.fangHuBei == 'undefined' || this.fangHuBei == "")
        {
            this.fangHuBei = 0;
            desc += " " + descStr[this.fangHuBei];
        }
        else
        {
            desc += " " + descStr[this.fangHuBei];
        }
        return desc;
    },
    getMajhongNPTableDes: function (_data) {
        var data = {};
        data["tableStatus"] = _data;
        this.roomId = data["tableStatus"]['tableId'];
        this.roundTotal = data["tableStatus"]['rounds'];
        this.aaGem = data["tableStatus"]['aaGem'];
        this.person = data["tableStatus"]['person'];
        this.op1 = data["tableStatus"]['diScore'];
        this.op2 = data["tableStatus"]['isDaQiDui'];
        this.op3 = data["tableStatus"]['isXiaoQiDui'];
        this.op4 = data["tableStatus"]['isQingYiSe'];
        this.op5 = data["tableStatus"]['isPingHu'];

        var desc = this.roundTotal  +'局';

        if(this.person > 0 )
        {
            desc += ' ' + this.person + "人";
        }
        if(this.op1 > 1)
        {
            desc += ' ' + this.op1 + '倍底分';
        }
        if(this.op2 > 0) {
            desc += " 大七对"
        }
        if(this.op3 > 0) {
            desc += " 小七对"
        }
        if(this.op4 > 0) {
            desc += " 清一色"
        }
        if(this.op5 > 0) {
            desc += " 可平胡"
        }
        if(this.aaGem == 1)
        {
            desc += ' AA支付';
        } else if (this.aaGem == 2) {
            desc += ' 大赢家支付';
        }
        else
        {
            desc += ' 房主支付';
        }
        return desc;
    },
};