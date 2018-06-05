
var ClubHistory = cc.Layer.extend({
    listview_session:null,
    listview_round:null,
    btn_back:null,
    btn_view_others:null,
    panel_session_cell:null,
    panel_round_cell:null,
    panel_list:null,
    panel_round:null,
    loaded:false,
    text_gotoplay:null,
    panel_sss_session_cell:null,
    panel_sss_round_cell:null,
    panel_sss_roundresult:null,
    isSeeMe:null,
    pid:null,
    ctor:function(data)
    {
        this._super();
        var JsonRes = ClubJson.ClubHistory;
        var root = util.LoadUI(JsonRes).node;
        this.addChild(root);
        this.pid = data;
        this.panel_list = ccui.helper.seekWidgetByName(root,"panel_list");
        this.panel_list.setVisible(true);
        this.panel_round = ccui.helper.seekWidgetByName(root,"panel_round");
        this.panel_round.setVisible(false);
        this.listview_session = ccui.helper.seekWidgetByName(root,"listview_session");
        this.listview_round = ccui.helper.seekWidgetByName(root,"listview_round");
        this.listview_round.setVisible(false);
        this.btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
        this.btn_back.addClickEventListener(function () {
            if(this.listview_round.isVisible())
            {
                this.showListSession();
            }else
            {
                this.removeFromParent();
            }


        }.bind(this));
        this.btn_view_others = ccui.helper.seekWidgetByName(root,"btn_view_others");
        this.btn_view_others.addClickEventListener(function () {
            var dialog = new JJCheckRecord();
            dialog.showDialog();
        }.bind(this));

        var panel = ccui.helper.seekWidgetByName(root, "panel_only_seeme");
        var checkbox = ccui.helper.seekWidgetByName(root, "checkbox_only_seeme");
        panel._checkBox = checkbox;
        panel.addClickEventListener(function (sender) {
            this.onClickSeeMe(sender);
        }.bind(this));

        this.isSeeMe = false;
        var _isSeeMe = util.getCacheItem("config_history_isOnly");
        if (_isSeeMe == 1 || _isSeeMe == 2) {
            this.isSeeMe = _isSeeMe == 1 ? true : false;
        }
        checkbox.setSelected(this.isSeeMe)


        // if(GAMENAME.indexOf("shisanshui") != -1)
        // {
        //     this.btn_view_others.setVisible(false);
        // }



        this.panel_session_cell = ccui.helper.seekWidgetByName(root,"panel_session_cell");
        this.panel_round_cell = ccui.helper.seekWidgetByName(root,"panel_round_cell");
        this.text_gotoplay = ccui.helper.seekWidgetByName(root,"text_gotoplay");
        this.text_gotoplay.setVisible(false);
        this.panel_round_cell.setVisible(false);
        this.panel_session_cell.setVisible(false);
        //十三水
        this.panel_sss_session_cell = ccui.helper.seekWidgetByName(root,"panel_sss_session_cell");
        this.panel_sss_round_cell = ccui.helper.seekWidgetByName(root,"panel_sss_round_cell");
        this.panel_sss_session_cell.setVisible(false);
        this.panel_sss_round_cell.setVisible(false);
        this.panel_sss_roundresult = ccui.helper.seekWidgetByName(root,"panel_sss_roundresult");
        this.panel_sss_roundresult.setVisible(false);
        this.panel_sss_roundresult.addClickEventListener(function () {
            this.closeSSSresult();
        }.bind(this));

        var text_tip = ccui.helper.seekWidgetByName(root,"text_tip");
        text_tip.setString('提醒:保存最近三天的录像');

    },

    onEnter: function () {
        this._super();

        this.showListSession();
    },


    showListRound: function (roundData) {
        this.panel_list.setVisible(false);
        this.panel_round.setVisible(true);
        this.listview_round.removeAllChildren();
        this.listview_round.setVisible(true);
        this.listview_session.setVisible(false);
        var _this = this;
        var resultList = roundData['data'];
        var serverType = roundData['serverType'];
        JJLog.print("单个回放="+ JSON.stringify(roundData));
        for(var i = 0;i<resultList.length;i++)
        {
            var result = resultList[i];
            var cell = null;
            if(serverType == 'shisanshui' || serverType == "")
            {
                cell = this.panel_sss_round_cell.clone();
                var info = {};
                info['recordId'] = result['num'];

                cell.addClickEventListener(function () {

                    MajhongLoading.show('加载中...');
                    var recordId = this['recordId'];
                    hall.net.getHuiFangInfo(recordId,
                        function(data)
                        {
                            MajhongLoading.dismiss();
                            JJLog.print("SSS回放数据="+ JSON.stringify(data));
                            if(data['code'] == 200)
                            {
                                _this.showSSSresult(data);
                            }else{
                                MajhongLoading.dismiss();
                                var dialog = new JJConfirmDialog();
                                dialog.setDes(data['err']);
                                dialog.showDialog();
                            }

                        });

                }.bind(info));
            }else
            {
                cell = this.panel_round_cell.clone();
                var btn_view =  ccui.helper.seekWidgetByName(cell,"btn_view");
                var btn_share =  ccui.helper.seekWidgetByName(cell,"btn_share");

                var info = {};
                info['recordId'] = result['num'];
                btn_share.addClickEventListener(function () {
                    var recordId = this['recordId'];
                    hall.net.wxShareURL(GAMENAMES[serverType],'玩家['+hall.user.nickName + ']分享了一个回访码:'+recordId+'在大厅点击进入战绩页面然后点击查看他人回放输入回访码.', 0);

                }.bind(info));
                btn_view.addClickEventListener(function () {

                    MajhongLoading.show('加载中...');
                    var recordId = this['recordId'];
                    hall.net.getHuiFangInfo(recordId,
                        function(data)
                        {
                            JJLog.print("回放数据="+ JSON.stringify(data));
                            if(data['code'] == 200)
                            {
                                hall.enterRecord(GAMETYPES[data['serverType']],data['record']); //GAMETYPES[data['serverType']]
                            }else{
                                var dialog = new JJConfirmDialog();
                                dialog.setDes(data['err']);
                                dialog.showDialog();
                            }

                        });

                }.bind(info));
            }
            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());
            layout.addChild(cell);

            var text_id =  ccui.helper.seekWidgetByName(cell,"text_order");
            text_id.setString(i+1);
            var text_time =  ccui.helper.seekWidgetByName(cell,"text_room_time");
            text_time.setString(result['time']);
            var text_huifang =  ccui.helper.seekWidgetByName(cell,"text_huifangcode");
            text_huifang.setString(result['num']);

            var values = result['result'];
            for(var j = 0;j < values.length;j++)
            {
                var text_players = ccui.helper.seekWidgetByName(cell,"text_player"+j);
                var text_id = ccui.helper.seekWidgetByName(cell,"text_id_"+j);
                text_players.setString(cutStringLenght(values[j]['userName']));
                text_id.setString(values[j]['uid']);
                text_id.setVisible(true);
                if (values[j]['uid'] == hall.user.uid) {
                    text_players.setTextColor(club.colors.history_self)
                }
                text_players.setVisible(true);
                var score = ccui.helper.seekWidgetByName(cell,"text_score"+j);
                if(values[j]['winScore'] > 0)
                {
                    // todo 绿色
                    score.setString("+" + values[j]['winScore']);
                    score.setTextColor(club.colors.history_green)
                }else if(values[j]['winScore'] <= 0)
                {
                    //todo 红色
                    score.setString(values[j]['winScore']);
                    score.setTextColor(club.colors.history_red)
                }
                score.setVisible(true);
                var img_scores =  ccui.helper.seekWidgetByName(cell,"img_scores"+j);
                if(img_scores != null)
                {
                    img_scores.setVisible(true);
                }
            }

            // if(values.length > 6)
            // {
            //     var panel_content = ccui.helper.seekWidgetByName(cell,"panel_content");
            //     panel_content.setScale(0.69);
            // }

            cell.x = 0;
            cell.y = 0;
            cell.setVisible(true);

            this.listview_round.pushBackCustomItem(layout);
        }

    },

    showListSession: function () {
        this.panel_list.setVisible(true);
        this.panel_round.setVisible(false);
        this.listview_round.setVisible(false);
        this.listview_session.setVisible(true);
        var _this = this;
        if(this.loaded) return;
        MajhongLoading.show("加载中");
        club.net.packGameHistory(this.pid,1, 30,function(data) {
            JJLog.print('get record!');
            var recordList = data['record'];
            recordList = _this.onFilter(recordList);
            JJLog.print("回放="+ JSON.stringify(data));
            JJLog.print("!!!!!!!!!!!!!!", data)
            _this.text_gotoplay.setVisible(recordList.length == 0);
            for(var i = 0 ; i < recordList.length;i++)
            {
                var cellData = recordList[i];
                var fanghao = cellData['fangHao'];
                var id = cellData['id'];

                var resultArr = cellData['lastResult'];
                var cell = null;
                if(cellData["serverType"] == "shisanshui" || cellData["serverType"] == "")
                {
                    cell = _this.panel_sss_session_cell.clone();
                }else
                {
                    cell = _this.panel_session_cell.clone();
                }
                cell.setTouchEnabled(true);
                var childData ={};
                childData['data'] = cellData['record'];
                childData['serverType'] = cellData['serverType'];
                cell.addClickEventListener(function () {
                    _this.showListRound(this);
                }.bind(childData));

                var layout = new ccui.Layout();
                layout.setContentSize(cell.getContentSize());
                layout.addChild(cell);
                var text_order = ccui.helper.seekWidgetByName(cell,"text_order");
                text_order.setString(i+1);
                var text_room_id = ccui.helper.seekWidgetByName(cell,"text_room_id");
                text_room_id.setString(fanghao);
                var text_gameName = ccui.helper.seekWidgetByName(cell,"text_gameName");
                text_gameName.setString(GAMENAMES[cellData["serverType"]]);
                var text_room_time = ccui.helper.seekWidgetByName(cell,"text_room_time");
                text_room_time.setString(cellData['recordTime']);

                for(var j = 0; j < resultArr.length;j++)
                {
                    var text_player = ccui.helper.seekWidgetByName(cell,"text_player"+j);
                    var text_score = ccui.helper.seekWidgetByName(cell,"text_score"+j);
                    var text_id = ccui.helper.seekWidgetByName(cell,"text_id_"+j);
                    var img_scores =  ccui.helper.seekWidgetByName(cell,"img_scores"+j);
                    text_id.setVisible(true);
                    text_id.setString(resultArr[j].uid);
                    if(img_scores != null)
                    {
                        img_scores.setVisible(true);
                    }
                    text_player.setString(cutStringLenght(resultArr[j]['nickName']));
                    if (resultArr[j]['uid'] == hall.user.uid) {
                        text_player.setTextColor(club.colors.history_self)
                    }
                    if(resultArr[j]['coinNum'] > 0)
                    {
                        // todo 绿色
                        text_score.setString("+" + resultArr[j]['coinNum']);
                        text_score.setTextColor(club.colors.history_green)
                    }else if(resultArr[j]['coinNum'] <= 0)
                    {
                        //todo 红色
                        text_score.setString(resultArr[j]['coinNum']);
                        text_score.setTextColor(club.colors.history_red)
                    }
                    text_score.setVisible(true);
                    text_player.setVisible(true);
                }
                // if(resultArr.length > 6)
                // {
                //     var panel_content = ccui.helper.seekWidgetByName(cell,"panel_content");
                //     panel_content.setScale(0.75);
                // }

                cell.x = 0;
                cell.y = 0;
                cell.setVisible(true);

                _this.listview_session.pushBackCustomItem(layout);
            }
            _this.loaded = true;
            MajhongLoading.dismiss();
        });
    },


    showSSSresult:function(data)
    {
        var recordList = data['record'];

        if(recordList != null && recordList.length >0)
        {
            this.panel_sss_roundresult.setVisible(true);
            for(var j = 0;j<recordList.length ;j++)
            {
                var record = recordList[j];JJLog.print("@@@@@@@@@@@=" + recordList.length);
                var text_player = ccui.helper.seekWidgetByName(this.panel_sss_roundresult,"text_player"+j);
                var card_player = ccui.helper.seekWidgetByName(this.panel_sss_roundresult,"card_player"+j);
                var panel_cardin = ccui.helper.seekWidgetByName(card_player,"panel_cardIn");
                var text_score = ccui.helper.seekWidgetByName(card_player,"text_score"+j);
                text_player.setString(record['userName']);
                text_player.setVisible(true);
                card_player.setVisible(true);
                text_score.setString(record['winScore']);

                var pais1 = record['pai'][0];
                for(var i=0;i<pais1.length;i++)
                {
                    var card = new SSSPokerShowUp( pais1[i]);
                    var size = card.getContentSize();
                    var x = size.width * i - 40 * i +40;
                    var y = 100;
                    card.setPosition(x, y);
                    panel_cardin.addChild(card);
                }
                var pais2 = record['pai'][1];
                for(var i=0;i<pais2.length;i++)
                {
                    var card = new SSSPokerShowUp(pais2[i]);
                    var size = card.getContentSize();
                    var x = size.width * i - 40 * i ;
                    var y = 50;
                    card.setPosition(x, y);
                    panel_cardin.addChild(card);
                }
                var pais3 = record['pai'][2];
                for(var i=0;i<pais3.length;i++)
                {
                    var card = new SSSPokerShowUp(pais3[i]);
                    var size = card.getContentSize();
                    var x = size.width * i - 40 * i;
                    var y = 0;
                    card.setPosition(x, y);
                    panel_cardin.addChild(card);
                }
            }
        }


    },

    closeSSSresult:function()
    {
        this.panel_sss_roundresult.setVisible(false);
        for(var j = 0;j< 8 ;j++)
        {
            var text_player = ccui.helper.seekWidgetByName(this.panel_sss_roundresult,"text_player"+j);
            var card_player = ccui.helper.seekWidgetByName(this.panel_sss_roundresult,"card_player"+j);
            var panel_cardin = ccui.helper.seekWidgetByName(card_player,"panel_cardIn");
            text_player.setVisible(false);
            card_player.setVisible(false);
            panel_cardin.removeAllChildren();
        }
    },

    showHistory:function()
    {
        cc.director.getRunningScene().addChild(this);
    },

    onClickSeeMe: function (sender) {
        var checkBox = sender._checkBox;
        checkBox.setSelected(!checkBox.isSelected());
        this.isSeeMe = checkBox.isSelected() ? 1 : 2;
    },
    onExit: function () {
        this._super();
        util.setCacheItem("config_history_isOnly", this.isSeeMe == true ? 1 : 2);
    },
    onFilter: function (data) {
        if (this.isSeeMe) {
            JJLog.print("#############筛选数据");
            var temp = new Array();
            for (var i=0; i<data.length; i++) {
                var item = data[i];
                for (var j = 1; j < 9; j++) {
                    if (item["uid" + j] == hall.user.uid) {
                        temp.push(item);
                        break;
                    }
                }
            }
            return temp;
        } else {
            JJLog.print("#############不需要筛选数据");
            return data;
        }
    }
});