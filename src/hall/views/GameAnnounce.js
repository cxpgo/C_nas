var announceList = {
    "code": 200,
    "data": [{
        "id": 74,
        "type": 2,
        "ownerUid": 100000,
        "createUid": 100000,
        "title": "健康游戏",
        "text": "",
        "imgUrl": "res/GameHall/Resoures/announce/img_gonggao_001.png",
        "flag": 0,
        "createTime": "2018-01-30T03:25:22.000Z"
    }],
    "session": "cd35de0a-d6b5-43c6-adb3-256116d7c14b/undefined/1517293152427"
}

var MajhongAnnounce = cc.Layer.extend({
        listview: null,
        panel_cell: null,
        label_content: null,
        image_content: null,
        alreadyClose:false,
        ctor: function (data) {
            this._super();
            var root = util.LoadUI(GameHallJson.Announce).node;
            this.addChild(root);
            var self = this;
            // hall.net.advclient(function (listData) {
            //     JJLog.print("advclient:" + JSON.stringify(listData));
            //     self.announceInfo(listData);
            // });
            this.alreadyClose = false;
            this.listview = ccui.helper.seekWidgetByName(root, "listview_session");
            this.panel_cell = ccui.helper.seekWidgetByName(root, "panel_cell");
            this.panel_cell.setVisible(false);
            this.panel_zhaomu = ccui.helper.seekWidgetByName(root, "panel_zhaomu");
            this.panel_zhaomu.setVisible(true);
            this.panel_denglu = ccui.helper.seekWidgetByName(root, "panel_denglu");
            this.panel_denglu.setVisible(true);
            this.zhaomu_image_content = ccui.helper.seekWidgetByName(this.panel_zhaomu, "image_content");
            this.zhaomu_label_content = ccui.helper.seekWidgetByName(this.panel_zhaomu, "label_content");
            this.denglu_image_content = ccui.helper.seekWidgetByName(this.panel_denglu, "image_content");
            this.text_weixin = ccui.helper.seekWidgetByName(this.panel_zhaomu, "text_weixin");
            this.btn_copy = ccui.helper.seekWidgetByName(this.panel_zhaomu, "btn_copy");
            this.btn_copy.addClickEventListener(this.onCopyLabel.bind(this));

            var btn_back = ccui.helper.seekWidgetByName(root, "btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));

            self.announceInfo(announceList);
        },

        onCopyLabel: function (sender) {
            var weChatId = null;
            switch (sender) {
                case this.btn_copy:
                    weChatId = this.text_weixin.getString();
                    break;
                default:
                    break;
            }
            util.copyLabel(weChatId);
            var bar = new QDTipBar()
            bar.show("复制成功！", 1);
        },

        announceInfo: function (data) {
            // type类型: 1文本 2 图片 3 图文
            // flag暂时没用 后续用于 热卖 新品 之类的标签
            // rootAgent不存在 或者 为空  获取的是官方公告
            if (data["code"] == 200) {
                var btns = new Array();
                this.contents = {};
                var data = data.data;
                for (var i = 0; i < data.length; i++) {
                    var cell = this.panel_cell.clone();
                    cell.setVisible(true);

                    var item = data[i];
                    // var text_name = ccui.helper.seekWidgetByName(cell, "text_name");
                    // text_name.setString(item.title);
                    var image_hot = ccui.helper.seekWidgetByName(cell, "image_hot");
                    image_hot.setVisible(item.flag == 1);
                    var image_limit = ccui.helper.seekWidgetByName(cell, "image_limit");
                    image_limit.setVisible(item.flag == 2);
                    var btn = ccui.helper.seekWidgetByName(cell, "btn_join");
                    var text_name = ccui.helper.seekWidgetByName(cell, "text_name");
                    btn._content = item;
                    btn._btns = btns;
                    btn._texts = text_name;
                    btn.setTag(item.id);
                    this.contents[item.id] = item;
                    text_name.setString(item.title);
                    btn.addClickEventListener(this.BtnPageMenu.bind(this));
                    if (i == 0)
                    {
                        this.CurContent(btn,item);
                    }
                    else {
                        btn._texts.setColor(cc.color(107,60,35));
                        btn._texts.enableOutline({r:0, g:0, b:0, a:0 },0);
                    }
                    btns.push(btn);
                    this.listview.pushBackCustomItem(cell);
                }
            }
            else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data['errmsg']);
                dialog.showDialog();
            }
        },

        CurContent:function (btn,item) {
            btn.setBright(false);
            btn.setTouchEnabled(false);
            btn._texts.setColor(cc.color(255, 255, 255));
            btn._texts.enableOutline(cc.color(151,60,1),2);
            // this.panel_zhaomu.setVisible(true);
            if (item.type == 2) {
                this.loadHead(this.denglu_image_content, item.imgUrl);
                this.panel_denglu.setVisible(true);
                this.panel_zhaomu.setVisible(false);
            } else if (item.type == 1) {
                this.label_content.setString(item.text);
                this.label_content.setVisible(true);
                this.image_content.setVisible(false);
            }
            else if (item.type == 3) {
                var len = this.zhaomu_label_content.getString().length;
                this.loadHead(this.zhaomu_image_content, item.imgUrl);
                this.zhaomu_label_content.setString(item.text);
                if (this.zhaomu_label_content.getString().length > len)
                    this.zhaomu_label_content.height = (this.zhaomu_label_content.getString().length / len + 1) * 20;
                this.panel_denglu.setVisible(false);
                this.panel_zhaomu.setVisible(true);
            }
        },

        BtnPageMenu:function (sender) {
            var btns = sender._btns;
            var content = this.contents[sender.getTag()];
            // this.panel_zhaomu.setVisible(true);
            for (var i = 0; i < btns.length; i++) {
                btns[i].setBright(btns[i] != sender);
                btns[i].setTouchEnabled(btns[i] != sender);
                if (btns[i] != sender) {
                    btns[i]._texts.setColor(cc.color(107,60,35));
                    btns[i]._texts.enableOutline({r:0, g:0, b:0, a:0 },0);
                }
                else {
                    btns[i]._texts.setColor(cc.color(255, 255, 255));
                    btns[i]._texts.enableOutline(cc.color(151,60,1),2);
                }
            }
            if (content.type == 2) {
                this.loadHead(this.denglu_image_content, content.imgUrl);
                this.panel_denglu.setVisible(true);
                this.panel_zhaomu.setVisible(false);
            } else if (content.type == 1) {
                this.label_content.setString(content.text);
                this.label_content.setVisible(true);
                this.image_content.setVisible(false);
            }
            else if (content.type == 3) {
                var len = this.zhaomu_label_content.getString().length;
                this.loadHead(this.zhaomu_image_content, content.imgUrl);
                this.zhaomu_label_content.setString(content.text);
                if (this.zhaomu_label_content.getString().length > len)
                    this.zhaomu_label_content.height = (this.zhaomu_label_content.getString().length / len + 1) * 20;
                this.panel_denglu.setVisible(false);
                this.panel_zhaomu.setVisible(true);
            }
        },

        loadHead: function (sprite_head,url) {
            sprite_head.removeAllChildren();
            if (url != undefined && url.length > 0) {
                cc.loader.loadImg(url, { isCrossOrigin: true },
                    function (err, tex) {
                        JJLog.print(err, tex);
                        if (err == null && this.alreadyClose == false) {
                            var size = sprite_head.getContentSize();
                            var sprite = new cc.Sprite(tex);
                            sprite.setAnchorPoint(cc.p(0.5, 0.5));
                            sprite.setPosition(cc.p(size.width/2,size.height/2));
                            sprite_head.addChild(sprite);
                        }
                    }.bind(this));
            }
        },

        onExit:function () {
            this.alreadyClose =true;
            this._super();
        },

        showPanel: function () {
            cc.director.getRunningScene().addChild(this);
        }

    });