
// 富文本
var MajhongNotice = cc.Layer.extend({
    panel_msg: null,
    textArray: null,
    rollSpeed: 40,
    fontSize: 24,
    scrollTimes: 0,
    msgArr: [],
    msgIndex: 0,
    exitFlag: false,
    lastedIndex: 0,
    isGaming: false,
    ctor: function (isInGame) {
        this._super();
        var Json = GameHallJson.Notice;
        var root = util.LoadUI(Json).node;
        this.addChild(root);
        this.panel_msg = ccui.helper.seekWidgetByName(root, "panel_msg");
        this.textArray = new Array();

        this.msgArr[0] = '测试的第一句话,不是那么长的一句话！';
        this.msgArr[1] = '测试的第二句话,有点短的一句话';
        this.msgArr[2] = '我们祖国我们爱你';
        this.msgArr[3] = '今天整理图片，晚上出个一张图大预览吧';
        this.msgArr[4] = '金雕CR500察打一体无人直升机，是中国兵器集团北方工业公司研制的最新型无人攻击直升机。';
        if (isInGame == true) {
            this.isGaming = true;
        }


        // this.getRichText("恭喜玩家<font color='#ffd800'>5pmvMw==（ID:225883）</font>,获得<font color='#ffd800'>400</font>钻石奖励. ");
    },

    onEnter: function () {
        this._super();
        if (this.isGaming) {
            var _this = this;
            qp.event.listen(this, 'hallTempNotify', function (data) {
                JJLog.print("data", data)
                _this.setVisible(true);
                _this.scrollTimes = 0;
                var msg = data['hallTempNotify']['contents'];
                if (msg == null || msg == undefined) {
                    msg = "";
                }
                this.addMsg(msg);
            });
            this.scheduleOnce(this.rescrollMsg, 2);

            qp.event.listen(this, 'hallMessageNotify', function (data) {

                var text = data['hallMessageNotify']['contents'];
                if (text == null || text == undefined) {
                    text = "";
                }
                var msg = {};
                msg['userName'] = '系统通知';
                msg['record'] = text;
                NoticeMsg.addMsg(msg);
            });

        } else {
            qp.event.listen(this, 'hallMessageNotify', function (data) {
                JJLog.print("hallMessageNotify");
                JJLog.print(data);
                JJLog.print("data", data);
                var msg = data['hallMessageNotify']['contents'];
                if (msg == null || msg == undefined) {
                    msg = "";
                }
                this.addMsg(msg);
            });
            this.scheduleOnce(this.rescrollMsg, 2);
        }
    },

    onExit: function () {
        if (this.isGaming) {
            qp.event.stop(this, 'hallTempNotify');
            qp.event.stop(this, 'hallMessageNotify');
        }
        else {
            qp.event.stop(this, 'hallMessageNotify');
        }
        this.scrollTimes = 0;
        this._super();
        this.exitFlag = true;
    },

    addMsg: function (text) {
        var msg = {};
        msg['userName'] = '系统通知';
        msg['record'] = text;
        this.pushMsg(msg);

        this.msgIndex++;
        if (this.msgIndex >= this.msgArr.length) {
            this.msgIndex = 0;
        }
    },

    pushMsg: function (jMsg) {
        if (this.isGaming) {
            NoticeMsg.addBoard(jMsg);
        } else {
            NoticeMsg.addMsg(jMsg);
        }

        if (this.exitFlag)
            return;

        if (this.textArray.length > 0) {
            this.runNextMaquee(jMsg);
        } else {
            this.setVisible(true);
            var pannelSize = this.panel_msg.getContentSize();
            this.runMarquee(jMsg, cc.p(pannelSize.width, 0));
        }

    },

    runNextMaquee: function (msg) {
        JJLog.print("runNextMaquee", msg);
        var text = this.textArray[this.textArray.length - 1];
        var textSize = text.getContentSize();
        var pos = text.getPosition();
        var pannelSize = this.panel_msg.getContentSize();

        if (pos.x + textSize.width < pannelSize.width) //在中间显示完全
        {
            this.runMarquee(msg, cc.p(pannelSize.width, 0));
        } else if (pos.x + textSize.width >= pannelSize.width)//未显示完全
        {
            this.runMarquee(msg, cc.p(pos.x + textSize.width, 0));
        }
    },

    runMarquee: function (msg, pos) {

        var richText = this.getRichText(msg["record"]);
        var pannelSize = this.panel_msg.getContentSize();
        richText.setPosition(cc.p(richText.width/2 + pos.x, pannelSize.height / 2));
        var between = pos.x - pannelSize.width;
        var time1 = (between + richText.width + pannelSize.width) / this.rollSpeed;

        var move1 = cc.moveTo(time1, cc.p(-richText.width/2, pannelSize.height / 2));
        var clearAction = cc.callFunc(this.clearText, this);
        var removeSelf = cc.removeSelf(true);
        var seq = cc.sequence(move1, clearAction, removeSelf);
        //var seq = cc.sequence(move1,removeSelf);
        richText.runAction(seq);
        this.textArray.push(richText);
    },

    getRichText: function (content) {
        var richText = new ccui.RichText();      // 富文本控件
        // var lines       = content.split("\n");      // 所有行
        var str = "";
        var elemts = content.split(/<font color='(.*?)'>(.*?)<\/font>/);
        var color = cc.color.WHITE;
        for (var k = 0; k < elemts.length;) {
            var e = elemts[k];
            if (e[0] == "#") {
                color = cc.color(e);
                e = elemts[k + 1];

                if(e.length>11)
                {
                    var uid = e.substring(e.length-11);
                    e = e.substring(0,e.length-11);
                    e = DecodePlayerName(e);
                }
                k += 2;
            } else {
                color = {r:255, g:219, b:96};//cc.color.WHITE;
                k++;
            }
            str += e;
            var re = new ccui.RichElementText(0, color, 255, e, "Arial", 20);
            richText.pushBackElement(re);
        }

        richText.ignoreContentAdaptWithSize(false);
        this.panel_msg.addChild(richText);
        var _strText = new ccui.Text(str, "Arial", 24);
        richText.setAnchorPoint(cc.p(0.5, 0.5));
        richText.height = _strText.getVirtualRendererSize().height;
        richText.width = _strText.getVirtualRendererSize().width;
        return richText;
        // var panel_size = this.panel_msg.getContentSize();
        // richText.setPosition(cc.p(richText.width / 2 + panel_size.width, panel_size.height / 2));
        // var times = (richText.width * 1.5 + panel_size.width ) / this.rollSpeed;
        // var move1 = cc.moveTo(times, cc.p(-richText.width, panel_size.height / 2));
        // var switchAction = cc.callFunc(this.switchText, this);
        // var removeSelf = cc.removeSelf(true);
        // var seq = cc.sequence(move1, switchAction, removeSelf);
        // richText.runAction(seq)
    },

    clearText: function () {
        if (this.textArray.length > 0) {
            this.textArray.splice(0, 1);
            if (this.textArray.length == 0) {
                if (this.isGaming) {
                    this.scrollTimes++;
                    if (this.scrollTimes > 2) {
                        this.scrollTimes = 0;
                        this.setVisible(false);
                    } else {
                        this.scheduleOnce(this.rescrollMsg, 2);
                    }
                } else {
                    this.scheduleOnce(this.rescrollMsg, 2);
                }
            } else {
                JJLog.print("text wait next");
            }
        }
    },

    rescrollMsg: function (dt) {
        if (this.isGaming) {
            if (NoticeMsg.board.length <= 0) return;
            if (this.lastedIndex >= NoticeMsg.board || this.lastedIndex >= NoticeMsg.size) {
                this.lastedIndex = 0;
            }
            this.pushMsg(NoticeMsg.getBoard(this.lastedIndex));
            this.lastedIndex++;
        } else {
            if (NoticeMsg.list.length <= 0) return;
            if (this.lastedIndex >= NoticeMsg.list || this.lastedIndex >= NoticeMsg.size) {
                this.lastedIndex = 0;
            }
            this.pushMsg(NoticeMsg.getMsg(this.lastedIndex));
            this.lastedIndex++;
        }

    },

    setRollSpeed: function (jSpeed) {
        this.rollSpeed = jSpeed;
    },

    showPlayer: function () {
        JJLog.print("show name = " + this.getString());
    },

});
