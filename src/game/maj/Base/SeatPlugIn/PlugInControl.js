var MJPlugInControl = SeatPlugInBase.extend({
    ctor: function (deskSeat, resFile) {
        this._super();
        this.mDeskSeat = deskSeat;
        this.root = util.LoadUI(resFile || MJBaseRes.WGControl).node;
        this.addChild(this.root);

        //控制面板
        this.panel_control = ccui.helper.seekWidgetByName(this.root, "panel_control");
        this.panel_guo = ccui.helper.seekWidgetByName(this.panel_control, "panel_guo");
        this.btn_guo = ccui.helper.seekWidgetByName(this.panel_control, "btn_guo");
        this.panel_guo.setTag(101);
        this.btn_guo.addClickEventListener(this.onGuo.bind(this));
        this.panel_control.setVisible(false);
        this.panel_controlCell = ccui.helper.seekWidgetByName(this.panel_control, "panel_cell");
        this.panel_controlCell.setVisible(false);
        this.panel_controlCell.setTag(102);
        var panel_sub = ccui.helper.seekWidgetByName(this.panel_controlCell, "panel_sub");
        panel_sub.setVisible(false);

        this.panel_sub_cell = ccui.helper.seekWidgetByName(this.root, "panel_sub_cell");

        var btn_chi = ccui.helper.seekWidgetByName(this.panel_control, "btn_chi");
        btn_chi.setTag(OPERATIONTYPE.CHI);
        btn_chi.setVisible(false);
        var btn_peng = ccui.helper.seekWidgetByName(this.panel_controlCell, "btn_peng");
        btn_peng.setTag(OPERATIONTYPE.PENG);
        btn_peng.setVisible(false);
        var btn_gang = ccui.helper.seekWidgetByName(this.panel_controlCell, "btn_gang");
        btn_gang.setVisible(false);
        btn_gang.setTag(OPERATIONTYPE.GANG);
        var btn_buzhang = ccui.helper.seekWidgetByName(this.panel_controlCell, "btn_buzhang");
        btn_buzhang.setVisible(false);
        btn_buzhang.setTag(OPERATIONTYPE.BUZHANG);
        var btn_ting = ccui.helper.seekWidgetByName(this.panel_controlCell, "btn_ting");
        btn_ting.setVisible(false);
        btn_ting.setTag(OPERATIONTYPE.TING);
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'mjNotifyAutoGuo', this.onNotifyAutoGuo.bind(this));

        qp.event.listen(this, 'appPluginControlShow', this.showControlPanel.bind(this));
        qp.event.listen(this, 'appPluginControlHide', this.dismissControlPanel.bind(this));
    },

    onExit: function () {
        this._super();

        qp.event.stop(this, 'mjNotifyAutoGuo');


        qp.event.stop(this, 'appPluginControlShow');
        qp.event.stop(this, 'appPluginControlHide');

    },
    dismissControlPanel: function () {
        this.qihu_tip = false;
        this.panel_control.setVisible(false);
        for (var i = 0; i < 10; i++) {
            if (this.panel_control.getChildByTag(i) != null) {
                this.panel_control.removeChildByTag(i, true);
            }

        }
        this.mOptBtns = [];
        this.mOptpanel_sub = [];
        delete this.__TingOp__;
    },


    showControlPanel: function (data) {
        var _this = this;
        _this.mOptBtns = [];
        _this.mOptpanel_sub = [];
        var opData = data["opCard"];
        var DTD = {
            panelSize: 0,
        }
        for (var tag in data) {
            switch (tag) {
                case OPERATIONNAME.CHI: {
                    this._drawControlForChi(tag, data, DTD)
                }
                    break;
                case OPERATIONNAME.PENG: {
                    this._drawControlForPeng(tag, data, DTD);
                }
                    break;
                case OPERATIONNAME.BUZHANG:
                case OPERATIONNAME.GANG: {
                    this._drawControlForGang(tag, data, DTD);
                }
                    break;
                case OPERATIONNAME.HU: {
                    this._drawControlForHu(tag, data, DTD)
                }
                    break;
                case OPERATIONNAME.TING: {
                    this._drawControlForTing(tag, data, DTD);
                }
                    break;
            }
        }
        this.panel_guo.setVisible(true);
        this.panel_control.setVisible(true);
    },
    updatePositionCellChildren: function (root , offX) {
        //从右侧 - 左侧
        var children = root.getChildren();
        var len = children.length;
        var startPosx = 0;//root.width;
        offX = offX || 0;
        for (var i =  len - 1; i >= 0 ; i--) {
            var child = children[i];
            
            child.setPositionX(startPosx);

            startPosx += child.width + offX;
        }
        //startPosx 就是root 的中宽度
        root.width = Math.abs(startPosx);
        var pos = cc.p(1280/2 - root.width/2 , 0);
        pos = root.parent.convertToNodeSpace(pos);
        root.x = pos.x;
    },

    _drawControlForGang: function (tag, data, DTD) {
        var opData = data.opCard;

        var _this = this;
        var buzhangData = data[tag];
        var length = buzhangData.length;
        if (length <= 0) {
            return;
        }
        var panel_cell_buzhang = this.panel_controlCell.clone();

        var panel_sub_buzhang = ccui.helper.seekWidgetByName(panel_cell_buzhang, "panel_sub");
        panel_sub_buzhang.setVisible(false);

        var btn_gang = ccui.helper.seekWidgetByName(panel_cell_buzhang, "btn_gang");
        btn_gang.setVisible(true);
        _this.mOptBtns.push(btn_gang);
        _this.mOptpanel_sub.push(panel_sub_buzhang);
        var btn_peng = ccui.helper.seekWidgetByName(panel_cell_buzhang, "btn_peng");
        btn_peng.setVisible(false);
        var btn_chi = ccui.helper.seekWidgetByName(panel_cell_buzhang, "btn_chi");
        btn_chi.setVisible(false);
        var btn_hu = ccui.helper.seekWidgetByName(panel_cell_buzhang, "btn_hu");
        btn_hu.setVisible(false);
        var btn_buzhang = ccui.helper.seekWidgetByName(panel_cell_buzhang, "btn_buzhang");
        btn_buzhang.setVisible(false);
        DTD.panelSize++;
        this.panel_control.addChild(panel_cell_buzhang, OPERATIONTYPE.GANG, OPERATIONTYPE.GANG);
        panel_cell_buzhang.x = 1000 - panel_cell_buzhang.getContentSize().width * DTD.panelSize;
        panel_cell_buzhang.y = 0;
        panel_cell_buzhang.setVisible(true);
        var _showTipsYouJin = function (call) {
            var str = "您已经";
            if (_this.isdahu == 1) str += '游金';
            if (_this.isdahu == 2) str += '双游';
            if (_this.isdahu == 3) str += '三游';
            str += '了，确定杠？'
            var dialog = new JJMajhongDecideDialog();
            dialog.setDes(str);
            dialog.setCallback(call);
            dialog.showDialog();
    
        };
        var _playerOpEvent = function (cellGangData) {
            _this.dismissControlPanel();
            XYGLogic.net.updatePlayerOp(cellGangData, function (data) {
                if (data["code"] == 200) {
                    //_this.dismissControlPanel();
                }
            });
        };

        if (buzhangData.length == 1) {
            var subData = buzhangData[0];
            var paiData = subData['pai'];
            var origin = subData['origin'];
            var cellGangData = {};
            cellGangData["opType"] = OPERATIONNAME.GANG;
            cellGangData["opCard"] = 1 <= paiData.length ? paiData[0] : paiData;
            cellGangData["index"] = origin;

            var card = MJCardTip.create3D(cellGangData["opCard"]);
            card.x = 120;
            card.y = 0;
            panel_cell_buzhang.addChild(card);
            var gangEvent = function (cellGangData) {
                if (_this.isdahu > 0) {
                    _showTipsYouJin(
                        function () {
                            _playerOpEvent(cellGangData);
                        }
                    );
                    return;
                }
                _playerOpEvent(cellGangData);
            };
            btn_gang.addClickEventListener(gangEvent.bind(_this, cellGangData));

        } else {
            var gangEvent = function () {
                if (_this.isdahu > 0) {
                    _showTipsYouJin(
                        function () {
                            panel_sub_buzhang.setVisible(!panel_sub_buzhang.isVisible());
                        }
                    );
                    return;
                }
                panel_sub_buzhang.setVisible(!panel_sub_buzhang.isVisible());
            };

            btn_gang.addClickEventListener(gangEvent.bind(_this, cellGangData));

            var panel_sub_buzhang = ccui.helper.seekWidgetByName(panel_cell_buzhang, "panel_sub");
            panel_sub_buzhang.setVisible(false);
            for (var i = 0; i < buzhangData.length; i++) {
                var subData = buzhangData[i];
                var paiData = subData['pai'];
                var origin = subData['origin'];
                // var cell = ccui.helper.seekWidgetByName(panel_sub_buzhang, "panel_sub_cell");
                var cell2 = _this.panel_sub_cell.clone();
                // cell.setVisible(false);
                cell2.setTouchEnabled(true);

                var cardDatas = [].concat(paiData);
                switch (origin) {
                    case OPER_GANG_TYPE.GANG_AN:
                    case OPER_GANG_TYPE.GANG_OTHER:
                    case OPER_GANG_TYPE.GANG_MING: {
                        while (cardDatas.length < 4) {
                            cardDatas = cardDatas.concat(paiData);
                        }
                    }
                        break;
                    case OPER_GANG_TYPE.GANG_JTF:
                    case OPER_GANG_TYPE.GANG_J1:
                    case OPER_GANG_TYPE.GANG_T1:
                    case OPER_GANG_TYPE.GANG_T9:
                    case OPER_GANG_TYPE.GANG_F1:
                    case OPER_GANG_TYPE.GANG_BU: {

                    }
                        break;
                }


                var cellGangData = {};
                cellGangData["opType"] = OPERATIONNAME.GANG;
                cellGangData["opCard"] = cardDatas[0];
                cellGangData["index"] = origin;
                cell2.addClickEventListener(
                    function () {
                        JJLog.print("buzhang click index = ");
                        _playerOpEvent(this);
                    }.bind(cellGangData)
                );
                var cellSize = cell2.getContentSize();
                cellSize.width = 0;
                for (var j = 0; j < cardDatas.length; j++) {
                    var tmpCard = MJCardShowUp.create3D(cardDatas[j]);
                    cell2.addChild(tmpCard);
                    tmpCard.y = 0;
                    tmpCard.x = 10.5 + 89 * j;
                    cellSize.width = tmpCard.x + tmpCard.width + 10.5;
                }
                cell2.setContentSize(cellSize);
                cell2.setVisible(true);
                panel_sub_buzhang.addChild(cell2);
                // cell2.x = 740 - 376 * (i + 1);
                // cell.y = 0;
            }
            _this.updatePositionCellChildren(panel_sub_buzhang , 5); 
        }
    },

    _drawControlForTing: function (tag, data, DTD) {
        var tingData = data[tag];
        var opData = data["opCard"];
        var _this = this;
        var length = tingData.length;
        if (length <= 0) {
            return;
        }
        var panel_cell_ting = this.panel_controlCell.clone();
        var panel_sub_ting = ccui.helper.seekWidgetByName(panel_cell_ting, "panel_sub");
        panel_sub_ting.setVisible(false);

        var btn_ting = ccui.helper.seekWidgetByName(panel_cell_ting, "btn_ting");
        var cellData = {};
        cellData["opType"] = OPERATIONNAME.TING;
        cellData["opCard"] = {};
        cellData["index"] = -1;
        btn_ting.addClickEventListener(function () {
            for(var i=0;i<_this.mOptBtns.length;i++)
            {
                _this.mOptBtns[i].setVisible(false);
            }
            for(var j=0;j<_this.mOptpanel_sub.length;j++)
            {
                _this.mOptpanel_sub[j].setVisible(false);
            }

            _this.__TingOp__ = true;
            _this.mDeskSeat.readyTing(tingData);
            btn_ting.setVisible(false);
            _this.mDeskSeat.setCardInTouchEnable(true);
            qp.event.send("mjNotifyTingChoice", { tingChoice: tingData })
            qp.event.send("appNotifyShowTing", { tingChoice: tingData })

        }.bind(cellData));
        btn_ting.setVisible(true);
        var btn_peng = ccui.helper.seekWidgetByName(panel_cell_ting, "btn_peng");
        btn_peng.setVisible(false);
        var btn_gang = ccui.helper.seekWidgetByName(panel_cell_ting, "btn_gang");
        btn_gang.setVisible(false);
        var btn_chi = ccui.helper.seekWidgetByName(panel_cell_ting, "btn_chi");
        btn_chi.setVisible(false);
        var btn_hu = ccui.helper.seekWidgetByName(panel_cell_ting, "btn_hu");
        btn_hu.setVisible(false);
        DTD.panelSize++;
        this.panel_control.addChild(panel_cell_ting, OPERATIONTYPE.TING, OPERATIONTYPE.TING);
        panel_cell_ting.x = 1000 - panel_cell_ting.getContentSize().width * DTD.panelSize;
        panel_cell_ting.y = 0;
        panel_cell_ting.setVisible(true);
    },

    _drawControlForHu: function (tag, data, DTD) {
        var huData = data[tag];
        var opData = data["opCard"];
        var _this = this;
        var length = huData.length;
        if (huData == 0) {
            return;
        }
        var huType = 0;//data["huTp"];
        this.qihu_tip = true;
        var panel_cell_hu = this.panel_controlCell.clone();
        var panel_sub_hu = ccui.helper.seekWidgetByName(panel_cell_hu, "panel_sub");
        panel_sub_hu.setVisible(false);

        var btn_gang = ccui.helper.seekWidgetByName(panel_cell_hu, "btn_gang");
        btn_gang.setVisible(false);
        var btn_peng = ccui.helper.seekWidgetByName(panel_cell_hu, "btn_peng");
        btn_peng.setVisible(false);
        var btn_chi = ccui.helper.seekWidgetByName(panel_cell_hu, "btn_chi");
        btn_chi.setVisible(false);
        var btn_buzhang = ccui.helper.seekWidgetByName(panel_cell_hu, "btn_buzhang");
        btn_buzhang.setVisible(false);

        var btn_hu = ccui.helper.seekWidgetByName(panel_cell_hu, "btn_hu");
        if (huType > 0) {
            var huRes = ['btn_zimo.png', 'btn_youjin.png', 'btn_shuangyou.png', 'btn_sanyou.png', 'btn_sanjindao.png', 'btn_zimo.png'];

            if (huRes[huType]) {
                btn_hu.loadTextureNormal(huRes[huType], ccui.Widget.PLIST_TEXTURE);
            } else {
                cc.error("[SelfSeat 3D] huRes[huType] error:" + huType);
            }
            btn_hu.ignoreContentAdaptWithSize(true);
        }
        btn_hu.setVisible(true);
        _this.mOptBtns.push(btn_hu);
        _this.mOptpanel_sub.push(panel_sub_hu);
        DTD.panelSize++;
        if (huType != 4) {
            var card = MJCardTip.create3D(opData);
            card.x = 120;
            card.y = 0;
            panel_cell_hu.addChild(card);
        }

        this.panel_control.addChild(panel_cell_hu, OPERATIONTYPE.HU, OPERATIONTYPE.HU);
        panel_cell_hu.x = 1000 - panel_cell_hu.getContentSize().width * DTD.panelSize;
        panel_cell_hu.y = 0;
        panel_cell_hu.setVisible(true);

        var cellHuData = {};
        cellHuData["opType"] = OPERATIONNAME.HU;
        cellHuData["opCard"] = opData;
        cellHuData["index"] = -1;
        // cellHuData['origin'] = origin;
        cellHuData['pai'] = opData;

        btn_hu.addClickEventListener(function () {
            _this.mDeskSeat.dismissControlPanel();
            XYGLogic.net.updatePlayerOp(this, function (data) {
                if (data["code"] == 200) {
                    //_this.dismissControlPanel();
                }
            });
        }.bind(cellHuData));
    },

    _drawControlForPeng: function (tag, data, DTD) {
        var pengData = data[tag];
        var _this = this;
        var opData = data["opCard"];
        if (pengData == 1) {
            var panel_cell = this.panel_controlCell.clone();
            var panel_sub_peng = ccui.helper.seekWidgetByName(panel_cell, "panel_sub");
            panel_sub_peng.setVisible(false);
            var btn_gang = ccui.helper.seekWidgetByName(panel_cell, "btn_gang");
            btn_gang.setVisible(false);
            var btn_peng = ccui.helper.seekWidgetByName(panel_cell, "btn_peng");
            btn_peng.setVisible(true);
            _this.mOptBtns.push(btn_peng);
            _this.mOptpanel_sub.push(panel_sub_peng);
            var btn_buzhang = ccui.helper.seekWidgetByName(panel_cell, "btn_buzhang");
            btn_buzhang.setVisible(false);
            var btn_chi = ccui.helper.seekWidgetByName(panel_cell, "btn_chi");
            btn_chi.setVisible(false);

            var btn_hu = ccui.helper.seekWidgetByName(panel_cell, "btn_hu");
            btn_hu.setVisible(false);

            var cellPengData = {};
            cellPengData["opType"] = OPERATIONNAME.PENG;
            cellPengData["opCard"] = opData;
            cellPengData["index"] = -1;
            btn_peng.addClickEventListener(function () {
                if (_this.isdahu > 0) {
                    var str = "您已经";
                    if (_this.isdahu == 1) str += '游金';
                    if (_this.isdahu == 2) str += '双游';
                    if (_this.isdahu == 3) str += '三游';
                    str += '了，确定碰？'
                    var dialog = new JJMajhongDecideDialog();
                    dialog.setDes(str);
                    dialog.setCallback(function () {
                        _this.mDeskSeat.dismissControlPanel();
                        XYGLogic.net.updatePlayerOp(this, function (data) {
                            if (data["code"] == 200) {
                                //_this.dismissControlPanel();
                            }
                        });
                    }.bind(this));
                    dialog.showDialog();
                    return;
                }
                _this.mDeskSeat.dismissControlPanel();
                XYGLogic.net.updatePlayerOp(this, function (data) {

                    JJLog.print(JSON.stringify(data));
                    if (data["code"] == 200) {
                        //_this.dismissControlPanel();
                    }
                });

            }.bind(cellPengData));

            var card = MJCardTip.create3D(opData);
            card.x = 120;
            card.y = 0;
            panel_cell.addChild(card);

            DTD.panelSize++;
            this.panel_control.addChild(panel_cell, OPERATIONTYPE.PENG, OPERATIONTYPE.PENG);
            panel_cell.x = 1000 - panel_cell.getContentSize().width * DTD.panelSize;
            panel_cell.y = 0;
            panel_cell.setVisible(true);
        }
    },

    _drawControlForChi: function (tag, data, DTD) {
        var chiData = data[tag];
        var length = chiData.length;
        var opData = data["opCard"];
        var _this = this;
        if (length <= 0) {
            return;
        }
        var panel_cell = this.panel_controlCell.clone();
        var panel_sub = ccui.helper.seekWidgetByName(panel_cell, "panel_sub");
        panel_sub.setVisible(false);

        var btn_gang = ccui.helper.seekWidgetByName(panel_cell, "btn_gang");
        btn_gang.setVisible(false);
        var btn_peng = ccui.helper.seekWidgetByName(panel_cell, "btn_peng");
        btn_peng.setVisible(false);
        var btn_chi = ccui.helper.seekWidgetByName(panel_cell, "btn_chi");
        btn_chi.setVisible(true);
        _this.mOptBtns.push(btn_chi);
        _this.mOptpanel_sub.push(panel_sub);
        var btn_buzhang = ccui.helper.seekWidgetByName(panel_cell, "btn_buzhang");
        btn_buzhang.setVisible(false);

        var btn_hu = ccui.helper.seekWidgetByName(panel_cell, "btn_hu");
        btn_hu.setVisible(false);

        var card = MJCardTip.create3D(opData);
        card.x = 120;
        card.y = 0;
        panel_cell.addChild(card);

        DTD.panelSize++;
        this.panel_control.addChild(panel_cell, OPERATIONTYPE.CHI, OPERATIONTYPE.CHI);
        panel_cell.x = 1000 - panel_cell.getContentSize().width * DTD.panelSize;
        panel_cell.y = 0;
        panel_cell.setVisible(true);

        if (chiData.length == 1) {
            var cellChiData = {};
            cellChiData["opType"] = OPERATIONNAME.CHI;
            cellChiData["opCard"] = opData;
            cellChiData["index"] = 0;
            btn_chi.addClickEventListener(function () {
                if (_this.isdahu > 0) {
                    var str = "您已经";
                    if (_this.isdahu == 1) str += '游金';
                    if (_this.isdahu == 2) str += '双游';
                    if (_this.isdahu == 3) str += '三游';
                    str += '了，确定吃？'
                    var dialog = new JJMajhongDecideDialog();
                    dialog.setDes(str);
                    dialog.setCallback(function () {
                        _this.mDeskSeat.dismissControlPanel();
                        XYGLogic.net.updatePlayerOp(cellChiData, function (data) {
                            if (data["code"] == 200) {
                            }
                        });
                    });
                    dialog.showDialog();
                    return;
                }
                _this.mDeskSeat.dismissControlPanel();
                XYGLogic.net.updatePlayerOp(this, function (data) {
                    if (data["code"] == 200) {
                    }
                });

            }.bind(cellChiData));
        } else {
            btn_chi.addClickEventListener(function () {
                if (_this.isdahu > 0) {
                    var str = "您已经";
                    if (_this.isdahu == 1) str += '游金';
                    if (_this.isdahu == 2) str += '双游';
                    if (_this.isdahu == 3) str += '三游';
                    str += '了，确定吃？'
                    var dialog = new JJMajhongDecideDialog();
                    dialog.setDes(str);
                    dialog.setCallback(function () {
                        panel_sub.setVisible(!panel_sub.isVisible());
                    });
                    dialog.showDialog();
                    return;
                }
                panel_sub.setVisible(!panel_sub.isVisible());
            });
            panel_sub.setVisible(false);

            for (var i = 0; i < chiData.length; i++) {
                var subData = chiData[i];
                var cell2 = _this.panel_sub_cell.clone();
                cell2.setTouchEnabled(true);
                var cellChiData = {};
                cellChiData["opType"] = OPERATIONNAME.CHI;
                cellChiData["opCard"] = opData;
                cellChiData["index"] = i;
                cell2.addClickEventListener(function () {
                    _this.mDeskSeat.dismissControlPanel();
                    XYGLogic.net.updatePlayerOp(this, function (data) {
                        JJLog.print(JSON.stringify(data));
                        if (data["code"] == 200) {
                            //_this.dismissControlPanel();
                        }
                    });

                }.bind(cellChiData));
                var cellSize = cell2.getContentSize();
                cellSize.width = 0;
                for (var j = 0; j < subData.length; j++) {
                    var cardObj = subData[j];
                    var tmpCard = MJCardShowUp.create3D(cardObj);
                    if (cardObj.value == opData.value) tmpCard.showBlue();
                    cell2.addChild(tmpCard);
                    tmpCard.y = 0;
                    tmpCard.x = 10.5 + 89 * j;
                    cellSize.width = tmpCard.x + tmpCard.width + 10.5;
                }
                cell2.setVisible(true);
                panel_sub.addChild(cell2);
                // cell2.x = 540 - 287 * (i + 1);
                // cell2.y = 0;
            }
            _this.updatePositionCellChildren(panel_sub , 5);
        }
    },

    onGuo: function () {
        var _this = this;
        // add by zm begin
        var event = new cc.EventCustom(CommonEvent.ResetCardState);
        event.setUserData(this.pai);
        cc.eventManager.dispatchEvent(event);
        // end
        if (this.qihu_tip) {
            var dialog = new JJMajhongDecideDialog();
            dialog.setDes('确定放弃胡牌？');
            dialog.setCallback(function () {
                _this.qihu_tip = false;
                _this.onGuo();
            });
            dialog.showDialog();
            return;
        }

        if(this.__TingOp__){
            this.__TingOp__ = false;
            this.mDeskSeat.cleanReadyTing();
        }
        this.sendNetGuo();
        qp.event.send('appShowInfoClose', {});
    },

    sendNetGuo: function () {
        var _this = this;
        var data = {};
        data["opType"] = OPERATIONNAME.GUO;
        _this.dismissControlPanel();

        // if (_this.gangMode == 1) {
        //     for (var i = 0; i < this.cardInArray.length; i++) {
        //         var handCard = this.cardInArray[i];
        //         handCard.showWhite();
        //     }
        //
        //     _this.gangMode = 0;
        // }
        XYGLogic.net.updatePlayerOp(data, function (data) {
            JJLog.print(JSON.stringify(data));

        });
    },

    onNotifyAutoGuo: function (data) {
        this._super(data);
        this.sendNetGuo();
    },
});