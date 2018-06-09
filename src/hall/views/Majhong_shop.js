var GameShop = cc.Layer.extend({
    btn_array: null,
    listview_array: null,
    text_fangka: null,
    panel_jifen: null,
    text_gold: null,
    panel_fangka: null,
    gemListIcon: null,
    goldListIcon: null,
    type: 0,
    ctor: function (data) {
        this._super();
        //data = {};
        data["gemPrice"] = "60:0.02|318:0.1|728:0.2|1480:0.4|3680:1|7880:2";
        data["goldPrice"] = "60000:0.02|318000:0.1|648000:0.2|1280000:0.4|3280000:1|6480000:2";
        //"60:6|318:30|728:68|1480:128|3680:328|7880:648"
        //"60000:6|300000:30|680000:68|1280000:128|3280000:328|6480000:648"

        console.log("shop_data",data);
        var products = data['gemPrice'].split("|");
        var root = util.LoadUI(GameHallJson.Shop).node;
        this.addChild(root);

        this.panel_fangka = ccui.helper.seekWidgetByName(root, "panel_fangka");
        this.text_fangka = ccui.helper.seekWidgetByName(this.panel_fangka, "text_fangka");
        this.text_fangka.setString(hall.user.gemNum);

        this.panel_jifen = ccui.helper.seekWidgetByName(root, "panel_jifen");
        this.text_gold = ccui.helper.seekWidgetByName(this.panel_jifen, "text_fangka");
        this.text_gold.setString(util.convertScore(hall.user.goldNum));

        this.btn_array = new Array();
        this.listview_array = new Array();
        this.gemListIcon = new Array();
        this.goldListIcon = new Array();
        for (var i = 0; i < 2; i++) {
            var btn = ccui.helper.seekWidgetByName(root, "btn_" + i);
            btn.addClickEventListener(this.onSwitchItem.bind(this));
            var listview = ccui.helper.seekWidgetByName(root, "listview_item_" + i);
            this.btn_array.push(btn);
            this.listview_array.push(listview);
        }
        var panel_cell = ccui.helper.seekWidgetByName(root, "panel_cell");
        panel_cell.setVisible(false);

        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        btn_close.addTouchEventListener(util.btnTouchEvent);

        var _this = this;
        for (var i = 0; i < Math.ceil(products.length / 3); i++) {
            var cell = panel_cell.clone();
            for (var j = 0; j < 3; j++) {
                var ind = i * 3 + j;
                if (ind < products.length) {
                    var product = products[ind].split(":");
                    var imageBg = ccui.helper.seekWidgetByName(cell, "Image_bg" + j);
                    imageBg.setVisible(true);
                    var text_gem = ccui.helper.seekWidgetByName(imageBg, "text_gem");
                    var text_rmb = ccui.helper.seekWidgetByName(imageBg, "text_rmb");
                    var img_icon = ccui.helper.seekWidgetByName(imageBg, "img_icon");
                    this.gemListIcon.push(img_icon);
                    var btn_buy = ccui.helper.seekWidgetByName(imageBg, "btn_buy");
                    text_gem.setString(product[0]);
                    text_gem.setContentSize(text_gem.getVirtualRendererSize());
                    text_rmb.setString(product[1]);
                    text_rmb.setContentSize(text_rmb.getVirtualRendererSize());
                    if (ind > 5)
                        ind = 5;
                    img_icon.loadTexture('res/GameHall/Resoures/shop/img_zuanshi_0' + ind + '.png', ccui.Widget.LOCAL_TEXTURE);
                    btn_buy.addClickEventListener(function () {
                        _this.onclickBuyitem(this,_this,0);
                        //_this.nasBuy(this);
                    }.bind(product));
                    btn_buy.addTouchEventListener(util.btnTouchEvent);
                }
            }
            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());
            cell.x = 0;
            cell.y = 0;
            cell.setVisible(true);
            layout.addChild(cell);
            this.listview_array[0].pushBackCustomItem(layout);
        }



        var panel_cell = ccui.helper.seekWidgetByName(root, "panel_goldcell");
        panel_cell.setVisible(false);

        var products = data['goldPrice'].split("|");

        for (var i = 0; i < Math.ceil(products.length / 3); i++) {
            var cell = panel_cell.clone();
            for (var j = 0; j < 3; j++) {
                var ind = i * 3 + j;
                if (ind < products.length) {
                    var product = products[ind].split(":");
                    var imageBg = ccui.helper.seekWidgetByName(cell, "Image_bg" + j);
                    imageBg.setVisible(true);
                    var text_gem = ccui.helper.seekWidgetByName(imageBg, "text_gem");
                    var text_rmb = ccui.helper.seekWidgetByName(imageBg, "text_rmb");
                    var img_icon = ccui.helper.seekWidgetByName(imageBg, "img_icon");
                    var img_word = ccui.helper.seekWidgetByName(imageBg, "img_word");
                    var img_zsbg = ccui.helper.seekWidgetByName(imageBg, "img_zsbg");
                    var img_zs = ccui.helper.seekWidgetByName(imageBg, "img_zs");
                    this.goldListIcon.push(img_icon);
                    var btn_buy = ccui.helper.seekWidgetByName(imageBg, "btn_buy");
                    img_zsbg.setVisible(ind != 0);

                    text_gem.setString(util.convertScore(product[0]));
                    text_gem.setContentSize(text_gem.getVirtualRendererSize());
                    img_word.setPositionX(text_gem.getContentSize().width)

                    text_rmb.setString(product[1]);
                    text_rmb.setContentSize(text_rmb.getVirtualRendererSize());
                    if (ind > 5)
                        ind = 5;

                    if (ind > 0)
                        img_zs.loadTexture('res/GameHall/Resoures/shop/song' + ind + '.png', ccui.Widget.LOCAL_TEXTURE);
                    img_icon.loadTexture('res/GameHall/Resoures/shop/img_jinbi_0' + ind + '.png', ccui.Widget.LOCAL_TEXTURE);
                    btn_buy.addClickEventListener(function () {
                        _this.onclickBuyitem(this,_this,1);
                    }.bind(product));
                    btn_buy.addTouchEventListener(util.btnTouchEvent);
                }
            }
            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());
            cell.x = 0;
            cell.y = 0;
            cell.setVisible(true);
            layout.addChild(cell);
            this.listview_array[1].pushBackCustomItem(layout);
        }

        this.onSwitchItem.bind(this, this.btn_array[0])();

        this.schedule(this.showEffect, 2);
    },

    onclickBuyitem: function (product,partent,type) {
        console.log("product ",product);
        //console.log("partent ",partent);
        //cc.sys.openURL("http://mall.yiqigame.me/wpay.html?a=1&token=ad34324davdsa&t=shisanshui&s=yjsss&i=" + hall.user.uid + "&p=product&n=" + product[0] + "&g=" + this.type);
        partent.nasBuy(product,type);
    },

    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    },

    onSwitchItem: function (sender) {
        for (var i = 0; i < this.btn_array.length; i++) {
            var btn = this.btn_array[i];
            btn.setBright(btn.name != sender.name);
            btn.setTouchEnabled(btn.name != sender.name);
            this.listview_array[i].setVisible(btn.name == sender.name);
            if (btn.name == sender.name) {
                this.type = i;
                this.panel_fangka.setVisible(i == 0);
                this.panel_jifen.setVisible(i == 1);
            }
        }
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'hallUpdatePlayerAttr');
    },

    onUpdatePlayerAttr: function (data) {
        JJLog.print('hall onUpdatePlayerAttr');
        JJLog.print(data);

        if (data['gemNum'] != null || data['gemNum'] != undefined) {
            this.text_fangka.setString(data['gemNum']);
        }
        if (data['goldNum'] != null || data['goldNum'] != undefined) {
            this.text_gold.setString(util.convertScore(data['goldNum']));
        }
    },

    showEffect: function () {

        var btn = this.btn_array[0];
        var listViewIndex = btn.isTouchEnabled() ? 2 : 1;

        var curListIcon = null;
        if (listViewIndex == 1) {
            curListIcon = this.gemListIcon;
        } else {
            curListIcon = this.goldListIcon;
        }
        var length = curListIcon.length - 1;
        var index = Math.round(Math.random() * length);

        var icon = curListIcon[index];

        var randomPos = Math.round(Math.random() * 15);
        var aniNode = util.playTimeLineAnimation("res/Animation/effect/ef_zuanshishangguang.json", true);
        aniNode.setPosition(cc.p(icon.getContentSize().width / 2.0 + randomPos, icon.getContentSize().height / 2.0 + randomPos));
        aniNode.runAction(cc.sequence(cc.delayTime(1.3), cc.removeSelf()));

        var randomPos1 = Math.round(Math.random() * -15);
        var aniNode1 = util.playTimeLineAnimation("res/Animation/effect/ef_zuanshishangguang.json", true);
        aniNode1.setPosition(cc.p(icon.getContentSize().width / 2.0 + randomPos1, icon.getContentSize().height / 2.0 + randomPos1));
        aniNode1.runAction(cc.sequence(cc.delayTime(1.8), cc.removeSelf()));

        icon.addChild(aniNode, 100);
        icon.addChild(aniNode1, 100);
    },

    onExit: function () {
        this._super();
        this.unschedule(this.showEffect);
    },


    nasBuy:function(product,type){

        var qpSerialNumber = hall.net.nasAndroidBuy(product[1]);
        this.checkTransactionAndroid(qpSerialNumber,type,product);
        //var _this = this;
        //var queryConfig = {},
        //    serialNumber = "";
        //if(!type){
        //    type=0;
        //}
        //
        //queryConfig.successFunc = _this.gameCallback;
        //queryConfig["type"] = type;
        //queryConfig["product"] = product;
        //console.log("====11111======",nebulasConfig.config.defaultOptions);
        //
        //
        //nebulasConfig.defaultOptions.listener = function (value) {
        //    queryConfig.serialNumber = serialNumber
        //    //获取到交易生成后的  txhash，然后通过 txhash 去查询，而不是 queryPayInfo
        //    //console.log("==========");
        //    queryConfig.txhash = value.txhash
        //    _this.checkTransaction(queryConfig);
        //    //addgameCallback(null);
        //};
        //
        //serialNumber = nebPay.call(nebulasConfig.config.contractAddr,product[1],nebulasConfig.config.t_userBet,"",nebulasConfig.defaultOptions);
    },

    gameCallback:function(receipt){
        console.log("receipt ",receipt);

        //var result = {
        //    value:receipt.value/1000000000000000000,
        //    type:receipt.buyType,
        //    from:receipt.from,
        //    execute_error:receipt.execute_error,
        //    execute_result:receipt.execute_result,
        //    product:receipt.product;
        //}
        var data={
            uid:hall.user.uid,
            type:receipt.buyType == 0?'gem':'gold',
            optType:"add",
            num:parseInt(receipt.product[0]),
            token:"xiaoyi_1601"
        }



        hall.net.nasBuy(data,function (data) {
            if (data.code == 200) {
                //var recharge = new GameShop(data["data"]);
                //recharge.showPanel();
                console.log("nas buy successful");
            } else {
                //var dialog = new JJConfirmDialog();
                //dialog.setDes(data['msg']);
                //dialog.showDialog();
            }
        });

    },

    checkTransactionAndroid:function(serialNumber,type,product){
        console.log("===========checkTransactionAndroid=========== numer:%j,type:%j,product%j",serialNumber,type,product);


        var intervalTime = 6;

        var timeOutId = 0
        var timerId = setInterval(function () {
            // 注意：这里使用了 neb.js 的 getTransactionReceipt 方法来查询交易结果
            hall.net.nasAndroidQuery(serialNumber);
            var result = hall.net.nasAndroidResult();

            console.log("===========checkTransactionAndroid222===========serialNumber:%j,result:%j",serialNumber,result);

            var resultObj = JSON.parse(result);
            //var valid = (product[1]*1000000000000000000 == parseInt(resultObj.response.data.value));

            if(resultObj.result=="true" && resultObj.response.msg =="success"){

                clearInterval(timerId)
                if (timeOutId) {
                    //清除超时定时器
                    clearTimeout(timeOutId)
                }

                var data={
                    "uid":hall.user.uid,
                    "type":type == 0?'gem':'gold',
                    "optType":"add",
                    "num":parseInt(product[0]),
                    "token":"xiaoyi_1601"
                }

                hall.net.nasBuy(data,function (data) {
                    if (data.code == 200) {
                        //var recharge = new GameShop(data["data"]);
                        //recharge.showPanel();
                        console.log("nas buy successful");
                    } else {
                        //var dialog = new JJConfirmDialog();
                        //dialog.setDes(data['msg']);
                        //dialog.showDialog();
                    }
                });
            }

        }, intervalTime * 5000);

        //查询超时定时器
        timeOutId = setTimeout(function () {
            //queryConfig.transStateNotify.close()
            if (timerId) {
                //context.$message.error("查询超时！请稍后刷新页面查看最新内容！")
                //mylog("查询超时！请稍后刷新页面查看最新内容！");
                clearInterval(timerId)
            }
        }, 120 * 1000)
    },


    checkTransaction:function (queryConfig) {
        var serialNumber = queryConfig.serialNumber,
        //context = config.context,
            minInterval = 6,
            intervalTime = queryConfig.intervalTime || minInterval,//每多少秒查询一次
            timeOut = queryConfig.timeOut || 60; //60秒后超时
        if (intervalTime < minInterval) {
            intervalTime = minInterval
        }
        var timeOutId = 0
        var timerId = setInterval(function () {
            // 注意：这里使用了 neb.js 的 getTransactionReceipt 方法来查询交易结果
            nebulasApi.getTransactionReceipt({
                hash: queryConfig.txhash
            }).then(function (receipt) {
                // 交易状态结果： 0 failed失败, 1 success成功, 2 pending确认中.
                if (receipt.status === 1) {
                    //清除定时器和关闭弹窗通知
                    clearInterval(timerId)
                    //config.transStateNotify.close()
                    if (timeOutId) {
                        //清除超时定时器
                        clearTimeout(timeOutId)
                    }
                    //如果有配置成功消息，显示成功消息通知
                    if (queryConfig.successMsg) {
                        queryConfig.$notify({
                            title: '操作成功',
                            message: queryConfig.successMsg,
                            type: 'success'
                        });
                    }
                    //如果有配置成功回调，执行成功回调
                    if (queryConfig.successFunc) {
                        setTimeout(function () {
                            receipt.buyType = queryConfig.type;
                            receipt.product = queryConfig.product;
                            queryConfig.successFunc(receipt)
                        }, 500)
                    }
                }
            }).catch(function (err) {
                //context.$message.error("查询交易结果发生了错误！" + err)
                mylog("查询交易结果发生了错误！" + err);
            });
        }, intervalTime * 1000)
        //查询超时定时器
        timeOutId = setTimeout(function () {
            //queryConfig.transStateNotify.close()
            if (timerId) {
                //context.$message.error("查询超时！请稍后刷新页面查看最新内容！")
                mylog("查询超时！请稍后刷新页面查看最新内容！");
                clearInterval(timerId)
            }
        }, timeOut * 1000)
    },
});

var GameGoldShop = cc.Layer.extend({
    btn_array: null,
    listview_array: null,
    text_fangka: null,
    panel_jifen: null,
    text_gold: null,
    panel_fangka: null,

    gemListIcon: null,
    goldListIcon: null,
    ctor: function (data) {
        this._super();
        var products = data['goldPrice'].split("|");
        var root = util.LoadUI(GameHallJson.Shop).node;
        this.addChild(root);

        this.panel_fangka = ccui.helper.seekWidgetByName(root, "panel_fangka");
        this.text_fangka = ccui.helper.seekWidgetByName(this.panel_fangka, "text_fangka");
        this.text_fangka.setString(hall.user.gemNum);

        this.panel_jifen = ccui.helper.seekWidgetByName(root, "panel_jifen");
        this.text_gold = ccui.helper.seekWidgetByName(this.panel_jifen, "text_fangka");
        this.text_gold.setString(util.convertScore(hall.user.goldNum));

        this.btn_array = new Array();
        this.listview_array = new Array();
        this.gemListIcon = new Array();
        this.goldListIcon = new Array();
        for (var i = 0; i < 2; i++) {
            var btn = ccui.helper.seekWidgetByName(root, "btn_" + i);
            btn.addClickEventListener(this.onSwitchItem.bind(this));
            var listview = ccui.helper.seekWidgetByName(root, "listview_item_" + i);
            this.btn_array.push(btn);
            this.listview_array.push(listview);
        }

        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        btn_close.addTouchEventListener(util.btnTouchEvent);

        var _this = this;
        var panel_cell = ccui.helper.seekWidgetByName(root, "panel_goldcell");
        panel_cell.setVisible(false);

        var products = data['goldPrice'].split("|");


        for (var i = 0; i < Math.ceil(products.length / 3); i++) {
            var cell = panel_cell.clone();
            for (var j = 0; j < 3; j++) {
                var ind = i * 3 + j;
                if (ind < products.length) {
                    var product = products[ind].split(":");
                    var imageBg = ccui.helper.seekWidgetByName(cell, "Image_bg" + j);
                    imageBg.setVisible(true);
                    var text_gem = ccui.helper.seekWidgetByName(imageBg, "text_gem");
                    var text_rmb = ccui.helper.seekWidgetByName(imageBg, "text_rmb");
                    var img_icon = ccui.helper.seekWidgetByName(imageBg, "img_icon");
                    var img_word = ccui.helper.seekWidgetByName(imageBg, "img_word");
                    var img_zsbg = ccui.helper.seekWidgetByName(imageBg, "img_zsbg");
                    var img_zs = ccui.helper.seekWidgetByName(imageBg, "img_zs");
                    this.goldListIcon.push(img_icon);
                    var btn_buy = ccui.helper.seekWidgetByName(imageBg, "btn_buy");
                    img_zsbg.setVisible(ind != 0);


                    text_gem.setString(product[1]);
                    text_gem.setContentSize(text_gem.getVirtualRendererSize());
                    img_word.setPositionX(text_gem.getContentSize().width)

                    text_rmb.setString(product[1]);
                    text_rmb.setContentSize(text_rmb.getVirtualRendererSize());
                    if (ind > 5)
                        ind = 5;

                    if (ind > 0)
                        img_zs.loadTexture('res/GameHall/Resoures/shop/song' + ind + '.png', ccui.Widget.LOCAL_TEXTURE);
                    img_icon.loadTexture('res/GameHall/Resoures/shop/img_jinbi_0' + ind + '.png', ccui.Widget.LOCAL_TEXTURE);
                    btn_buy.addClickEventListener(function () {
                        _this.onclickBuyitem(this);
                    }.bind(product));
                    btn_buy.addTouchEventListener(util.btnTouchEvent);
                }
            }
            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());
            cell.x = 0;
            cell.y = 0;
            cell.setVisible(true);
            layout.addChild(cell);
            this.listview_array[1].pushBackCustomItem(layout);
        }

        this.btn_array[0].removeFromParent();
        this.onSwitchItem.bind(this, this.btn_array[1])();

        this.schedule(this.showEffect, 2);
    },

    onclickBuyitem: function (product) {
        cc.sys.openURL("http://mall.yiqigame.me/wpay.html?a=1&token=ad34324davdsa&t=shisanshui&s=yjsss&i=" + hall.user.uid + "&p=product&n=" + product[0] + "&g=1");
    },

    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    },

    onSwitchItem: function (sender) {
        for (var i = 0; i < this.btn_array.length; i++) {
            var btn = this.btn_array[i];
            btn.setBright(btn.name != sender.name);
            btn.setTouchEnabled(btn.name != sender.name);
            this.listview_array[i].setVisible(btn.name == sender.name);
            if (btn.name == sender.name) {
                this.panel_fangka.setVisible(i == 0);
                this.panel_jifen.setVisible(i == 1);
            }
        }
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'hallUpdatePlayerAttr');
    },

    onUpdatePlayerAttr: function (data) {
        JJLog.print('hall onUpdatePlayerAttr');
        JJLog.print(data);

        if (data['gemNum'] != null || data['gemNum'] != undefined) {
            this.text_fangka.setString(data['gemNum']);
        }
        if (data['goldNum'] != null || data['goldNum'] != undefined) {
            this.text_gold.setString(util.convertScore(data['goldNum']));
        }
    },

    showEffect: function () {

        var btn = this.btn_array[0];
        var listViewIndex = btn.isTouchEnabled() ? 2 : 1;

        var curListIcon = null;
        if (listViewIndex == 1) {
            curListIcon = this.gemListIcon;
        } else {
            curListIcon = this.goldListIcon;
        }
        var length = curListIcon.length - 1;
        var index = Math.round(Math.random() * length);

        var icon = curListIcon[index];

        var randomPos = Math.round(Math.random() * 15);
        var aniNode = util.playTimeLineAnimation("res/Animation/effect/ef_zuanshishangguang.json", true);
        aniNode.setPosition(cc.p(icon.getContentSize().width / 2.0 + randomPos, icon.getContentSize().height / 2.0 + randomPos));
        aniNode.runAction(cc.sequence(cc.delayTime(1.3), cc.removeSelf()));

        var randomPos1 = Math.round(Math.random() * -15);
        var aniNode1 = util.playTimeLineAnimation("res/Animation/effect/ef_zuanshishangguang.json", true);
        aniNode1.setPosition(cc.p(icon.getContentSize().width / 2.0 + randomPos1, icon.getContentSize().height / 2.0 + randomPos1));
        aniNode1.runAction(cc.sequence(cc.delayTime(1.8), cc.removeSelf()));

        icon.addChild(aniNode, 100);
        icon.addChild(aniNode1, 100);
    },

    onExit: function () {
        this._super();
        this.unschedule(this.showEffect);
    },


});


var GameSongShenRecharge = cc.Layer.extend({
    btn_array:null,
    listview_array:null,
    text_fangka:null,
    panel_jifen:null,
    text_gold:null,
    panel_fangka:null,
    gemListIcon:null,
    goldListIcon:null,
    type:0,
    ctor: function () {
        this._super();
        var root = ccs.load(GameHallJson.Shop).node;
        this.addChild(root);

        this.panel_fangka = ccui.helper.seekWidgetByName(root, "panel_fangka");
        this.text_fangka = ccui.helper.seekWidgetByName(this.panel_fangka, "text_fangka");
        this.text_fangka.setString(hall.user.gemNum);

        this.panel_jifen = ccui.helper.seekWidgetByName(root, "panel_jifen");
        this.text_gold = ccui.helper.seekWidgetByName(this.panel_jifen, "text_fangka");
        this.text_gold.setString(util.convertScore(hall.user.goldNum));

        this.btn_array = new Array();
        this.listview_array = new Array();
        this.gemListIcon = new Array();
        this.goldListIcon = new Array();
        for (var i = 0; i < 2; i++) {
            var btn = ccui.helper.seekWidgetByName(root, "btn_" + i);
            btn.addClickEventListener(this.onSwitchItem.bind(this));
            var listview = ccui.helper.seekWidgetByName(root, "listview_item_" + i);
            this.btn_array.push(btn);
            this.listview_array.push(listview);
        }
        this.panel_cell = ccui.helper.seekWidgetByName(root, "panel_goldcell");
        this.panel_cell.setVisible(false);


        this.gem_cell = ccui.helper.seekWidgetByName(root, "panel_cell");
        this.gem_cell.setVisible(false);

        var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
        btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        btn_close.addTouchEventListener(util.btnTouchEvent);

        this.onSwitchItem.bind(this, this.btn_array[0])();
    },

    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    },

    onSwitchItem: function (sender) {
        for (var i = 0; i < this.btn_array.length; i++) {
            var btn = this.btn_array[i];
            btn.setBright(btn.name != sender.name);
            btn.setTouchEnabled(btn.name != sender.name);
            this.listview_array[i].setVisible(btn.name == sender.name);
            if (btn.name == sender.name){
                this.type = i;
                this.panel_fangka.setVisible(i == 0);
                this.panel_jifen.setVisible(i == 1);
            }
        }
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'hallUpdatePlayerAttr');
    },

    onUpdatePlayerAttr: function (data) {
        JJLog.print('hall onUpdatePlayerAttr');
        JJLog.print(data);

        if (data['gemNum'] != null || data['gemNum'] != undefined) {
            this.text_fangka.setString(data['gemNum']);
        }
        if(data['goldNum'] != null || data['goldNum'] != undefined)
        {
            this.text_gold.setString(util.convertScore(data['goldNum']));
        }
    },

    onEnter: function () {
        this._super();

        if (cc.sys.isNative)         //真机才走
        {
            this.initPlugin();
            this.getproductlist();
        }
    },

    getproductlist: function () {
        MajhongLoading.show('获取商品列表中...');
        var pidList = [
            "win.yiqigame.db.yjdbqp.diamond.01", 
            "win.yiqigame.db.yjdbqp.diamond.02", 
            "win.yiqigame.db.yjdbqp.diamond.03",
            "win.yiqigame.db.yjdbqp.diamond.04",
            "win.yiqigame.db.yjdbqp.diamond.05",
            "win.yiqigame.db.yjdbqp.diamond.06",
            "win.yiqigame.db.yjdbqp.gold.11", 
            "win.yiqigame.db.yjdbqp.gold.12", 
            "win.yiqigame.db.yjdbqp.gold.13",
            "win.yiqigame.db.yjdbqp.gold.14",
            "win.yiqigame.db.yjdbqp.gold.15",
            "win.yiqigame.db.yjdbqp.gold.16",
        ];

        // var pidList = ["sksss01","sksss02","sksss03","sksss04","sksss05","sksss06","sksss11","sksss12","sksss13","sksss14","sksss15","sksss16"];
        this.PluginIAP.callFuncWithParam("requestProducts", plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, pidList.toString()));

    },
    initPlugin: function () {
        var pluginManager = plugin.PluginManager.getInstance();
        this.PluginIAP = pluginManager.loadPlugin("IOSIAP");
        this.PluginIAP.setListener(this);
    },
    //获取商品列表回调
    onRequestProductResult: function (ret, productInfo) {
        MajhongLoading.dismiss();
        var _this = this;
        if (ret == plugin.ProtocolIAP.RequestProductCode.RequestFail) {
            JJLog.print("request error ");
        } else if (ret == plugin.ProtocolIAP.RequestProductCode.RequestSuccess) {
            JJLog.print("request RequestSuccees " + JSON.stringify(productInfo));
            var _this = this;

            var gemCount = [60,318,728,1480,3680,7880];
            for (var i = 0; i < Math.ceil(productInfo.length/6); i++) {
                var cell = this.gem_cell.clone();
                for(var j=0;j<3;j++)
                {
                    var ind = i*3+j;
                    if(ind < productInfo.length)
                    {
                        var product = productInfo[ind];
                        var imageBg = ccui.helper.seekWidgetByName(cell, "Image_bg"+j);
                        imageBg.setVisible(true);
                        var text_gem = ccui.helper.seekWidgetByName(imageBg, "text_gem");
                        var text_rmb = ccui.helper.seekWidgetByName(imageBg, "text_rmb");
                        var img_icon = ccui.helper.seekWidgetByName(imageBg, "img_icon");
                        this.gemListIcon.push(img_icon);
                        var btn_buy = ccui.helper.seekWidgetByName(imageBg, "btn_buy");
                        text_gem.setString(gemCount[ind]);
                        text_gem.setContentSize(text_gem.getVirtualRendererSize());
                        text_rmb.setString(product['productPrice']);
                        text_rmb.setContentSize(text_rmb.getVirtualRendererSize());
                        if(ind>5)
                            ind = 5;
                        img_icon.loadTexture('res/GameHall/Resoures/shop/img_zuanshi_0'+ind+'.png',ccui.Widget.LOCAL_TEXTURE);
                        btn_buy.addClickEventListener(function () {
                            _this.onclickBuyitem(this);
                        }.bind(product));
                        btn_buy.addTouchEventListener(util.btnTouchEvent);
                    }
                }
                var layout = new ccui.Layout();
                layout.setContentSize(cell.getContentSize());
                cell.x = 0;
                cell.y = 0;
                cell.setVisible(true);
                layout.addChild(cell);
                this.listview_array[0].pushBackCustomItem(layout);
            }



            for (var i = 0; i < Math.ceil(productInfo.length/6); i++) {
                var cell = this.panel_cell.clone();
                for(var j=0;j<3;j++)
                {
                    var ind = i*3+j;
                    if(ind + 6 < productInfo.length)
                    {
                        var product = productInfo[ind+6];
                        var imageBg = ccui.helper.seekWidgetByName(cell, "Image_bg"+j);
                        imageBg.setVisible(true);
                        var text_gem = ccui.helper.seekWidgetByName(imageBg, "text_gem");
                        var text_rmb = ccui.helper.seekWidgetByName(imageBg, "text_rmb");
                        var img_icon = ccui.helper.seekWidgetByName(imageBg, "img_icon");
                        var img_word = ccui.helper.seekWidgetByName(imageBg, "img_word");
                        var img_zsbg = ccui.helper.seekWidgetByName(imageBg, "img_zsbg");
                        var img_zs = ccui.helper.seekWidgetByName(imageBg, "img_zs");
                        var btn_buy = ccui.helper.seekWidgetByName(imageBg, "btn_buy");
                        img_zsbg.setVisible(ind != 0);

                        text_gem.setString(product['productPrice']);
                        text_gem.setContentSize(text_gem.getVirtualRendererSize());
                        img_word.setPositionX(text_gem.getContentSize().width)

                        text_rmb.setString(product['productPrice']);
                        text_rmb.setContentSize(text_rmb.getVirtualRendererSize());
                        if(ind>5)
                            ind = 5;

                        if(ind > 0)
                            img_zs.loadTexture('res/GameHall/Resoures/shop/song'+ind+'.png',ccui.Widget.LOCAL_TEXTURE);
                        img_icon.loadTexture('res/GameHall/Resoures/shop/img_jinbi_0'+ind+'.png',ccui.Widget.LOCAL_TEXTURE);
                        btn_buy.addClickEventListener(function () {
                            _this.onclickBuyitem(this);
                        }.bind(product));
                        btn_buy.addTouchEventListener(util.btnTouchEvent);
                    }
                }
                var layout = new ccui.Layout();
                layout.setContentSize(cell.getContentSize());
                cell.x = 0;
                cell.y = 0;
                cell.setVisible(true);
                layout.addChild(cell);
                this.listview_array[1].pushBackCustomItem(layout);
            }

            _this.PluginIAP.callFuncWithParam("setServerMode");
            _this._serverMode = true;

        }
    },
    //支付回调
    onPayResult: function (ret, msg, productInfo) {
        MajhongLoading.dismiss();

        var str = "";
        if (ret == plugin.ProtocolIAP.PayResultCode.PaySuccess) {
            str = "payment Success pid is " + productInfo.productId;
            //if you use server mode get the receive message and post to your server
            if (this._serverMode && msg) {
                str = "payment verify from server";
                cc.log(str);
                this.postServerData(msg);
            }
        } else if (ret == plugin.ProtocolIAP.PayResultCode.PayFail) {
            str = "payment fail";
        }
        cc.log("onPayResult ret is ==" + str)

    },

    onclickBuyitem: function (data) {
        MajhongLoading.show('获取订单中...');
        var product = data;
        hall.net.getOrder(product['productId'],
            function (data) {
                MajhongLoading.dismiss();
                if (data['code'] == 200) {
                    MajhongLoading.show('下单中...');
                    this.orderInfo = data['orderInfo'];


                    this.PluginIAP.payForProduct(product);

                } else {

                }
            }.bind(this));
    },

    postServerData: function (receipt) {
        var _this = this;
        var orderinfo = this.orderInfo;
        hall.net.orderStatus(orderinfo,receipt,
            function (data) {
                JJLog.print("发服务器加钻石回调=" + JSON.stringify(data));
                if (data['code'] == 200) {
                    _this.PluginIAP.callFuncWithParam("finishTransaction", new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, _this.orderInfo['prodId']));
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("充值成功!");
                    dialog.showDialog();
                } else {

                }
            });
    },

    onExit:function () {
        this._super();
    },


//uid
//type:gem,gold
//optType:add
//num:
//token:xiaoyi_1601
});


