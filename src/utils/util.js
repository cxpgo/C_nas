function getContent(fileName)
{

    if(cc.sys.isNative)
        var text = jsb.fileUtils.getStringFromFile(fileName);
    else
        var text = cc.loader._loadTxtSync(fileName);
    var reg = "(/\\\*([^*]|[\\\r\\\n]|(\\\*+([^*/]|[\\\r\\\n])))*\\\*+/)|(//.*)";
    var exp = new RegExp(reg,"g");
    text = text.replace(exp,"");
    return text;
}
var itemCfg = JSON.parse(getContent("res/Common/itemCfg.json"));
var util = {

    LoadUI: function (path) {
        return ccs.load(path , "res/");
    },

    isFileExist: function (path) {
        var isEt = false;
        if(window.document){
            try {
                var s = cc.loader._loadTxtSync(path);
                if(s) isEt = true
            } catch (error) {
                
            }
            
        }else{
            isEt = jsb.fileUtils.isFileExist(path);
        }
        return isEt;
    },

    verifyIDNum: function (idcard) {
        var Errors = new Array(
            "验证通过!",
            "身份证号码位数不对!",
            "身份证号码出生日期超出范围或含有非法字符!",
            "身份证号码校验错误!",
            "身份证地区非法!");

        var area = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        }

        var idcard, Y, JYM;
        var S, M;
        var idcard_array = new Array();
        idcard_array = idcard.split("");
        //地区检验
        if (area[parseInt(idcard.substr(0, 2))] == null) return Errors[4];
        //身份号码位数及格式检验
        switch (idcard.length) {
            case 15:
                if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 &&
                        (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 )) {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
                } else {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
                }

                if (ereg.test(idcard)) return Errors[0];
                else return Errors[2];

                break;
            case 18:
                //18位身份号码检测
                //出生日期的合法性检查
                //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 &&
                        parseInt(idcard.substr(6, 4)) % 4 == 0 )) {
                    ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
                } else {
                    ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
                }

                if (ereg.test(idcard)) {//测试出生日期的合法性
                    //计算校验位
                    S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                        + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                        + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                        + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                        + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                        + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                        + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                        + parseInt(idcard_array[7]) * 1
                        + parseInt(idcard_array[8]) * 6
                        + parseInt(idcard_array[9]) * 3;
                    Y = S % 11;
                    M = "F";
                    JYM = "10X98765432";
                    M = JYM.substr(Y, 1);//判断校验位
                    if (M == idcard_array[17]) return Errors[0]; //检测ID的校验位
                    else return Errors[3];
                }
                else return Errors[2];
                break;
            default:
                return Errors[1];
                break;
        }

    },

    setCacheItem: function (key, value) {
        JJLog.print(key , value);
//    if (cc.sys.localStorage.getItem(key) == undefined)
        if(key != undefined && value != undefined){
            cc.sys.localStorage.setItem(key, value);
        }
        
    },

    getCacheItem: function (key) {
        return cc.sys.localStorage.getItem(key);
    },

    removeCacheItem: function (key) {
        cc.sys.localStorage.removeItem(key);
    },

    uuid: function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    },

    textureCache: [],

    cacheImage: function (path, image) {
        this.textureCache[path] = image;
    },

    getTextureForKey: function (path) {
        return this.textureCache[path];
    },
    getWXAppInstalled: function () {
        var install = false;
        if (cc.sys.os == cc.sys.OS_IOS) {
            install = jsb.reflection.callStaticMethod("NativeOcClass",
                "getWXAppInstalled");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            install = jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                "getWXAppInstalled", "()Z");
        }
        return install;
    },
    copyLabel: function (content) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("NativeOcClass",
                "copyLabel:", '' + content);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                "copyLabel", "(Ljava/lang/String;)V", content);
        }
    },

    getCopyLabel: function () {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("NativeOcClass",
                "getCopyLabel");
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                "getCopyLabel", "()V");
        }
    },
    getNativeVersion: function () {
        var version = 0x010000;
        JJLog.print('getNativeVersion default:' + version);
        try {
            if (cc.sys.os == cc.sys.OS_IOS) {
                version = jsb.reflection.callStaticMethod("NativeOcClass",
                    "getNativeVersion");
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                version = jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
                    "getNativeVersion", "()I");
            }
        } catch (e) {

        }

        return version;
    },

    getDistance: function (lon1, lat1, lon2, lat2) {
        var DEF_PI180 = 0.01745329252; // PI/180.0
        var radLat1 = lat1 * DEF_PI180;
        var radLat2 = lat2 * DEF_PI180;
        var a = radLat1 - radLat2;
        var b = lon1 * DEF_PI180 - lon2 * DEF_PI180;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378137;
        return s.toFixed(0);
        ;
    },

    btnTouchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN: {
                sender.setScale(0.92);
                break;
            }
            case ccui.Widget.TOUCH_MOVED: {
                // sender.setScale(1);
            }
                break;
            case ccui.Widget.TOUCH_ENDED: {

                sender.setScale(1);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED: {
                sender.setScale(1);
            }
                break;
            default:
                break;
        }
    },

    layerTouchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN: {
                // sender.setScale(0.92);

                var pos = sender.getTouchBeganPosition()
                var ef_dianji = new cc.ParticleSystem("res/Animation/effect/eff_casino_xc_31.plist");
                sender.addChild(ef_dianji, 100);
                ef_dianji.setPosition(pos);

                JJLog.print("layer touch beging ==================");
                break;
            }
            case ccui.Widget.TOUCH_MOVED: {
                // sender.setScale(1);

            }
                break;
            case ccui.Widget.TOUCH_ENDED: {

                //  sender.setScale(1);
            }
                break;
            case ccui.Widget.TOUCH_CANCELED: {
                //   sender.setScale(1);
                JJLog.print("layer touch TOUCH_CANCELED ==================");
            }
                break;
            default:
                break;
        }
    },

    // 返回动画node 节点，
    playTimeLineAnimation: function (path, loop, resPath) {
        if(path.indexOf("res/Animation") == 0){
            resPath = "res/Animation/";
        }
        var anim = ccs.load(path , resPath || "res/");
        var node = anim.node;
        var action = anim.action;
        node.runAction(action);
        action.gotoFrameAndPlay(0, loop);
        var time = action.getDuration();
        // action.setTimeSpeed(0.5);
        node.time = time;
        return node;
    },


    /**
     * name     xxx_00 xx_01  name = xx;
     */
    playSeqFrameAnimation: function (parent , pos , plistPath , name  , size, len , delay , loop ) {
        cc.spriteFrameCache.addSpriteFrames(plistPath);
        
        var frames = [];
        var sprPath = "";
        for (var index = 0; index < len; index++) {
            var framePath = name + "_" + (index < 10 ? "0"+index : index) + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(framePath);; 
            frames.push(frame);
            if(index == 0) sprPath = framePath;

            JJLog.print(framePath);
        }
        delay = delay || 0.05
        var anim = new cc.Animation(frames, delay);
        var sp = new cc.Sprite(frames[0]);
        var action = null;
        if(!loop){
            action = cc.sequence(
                cc.animate(anim),
                cc.removeSelf()
            );
        }else{
            action = cc.repeatForever(
                cc.sequence(
                    cc.animate(anim)
                )
            );
        }
        sp.runAction(action);
        sp.setPosition(pos);
        parent.addChild(sp , 1000);
        return sp;
    },

    createScreenTouchEvent: function () {
        var panel_root = new ccui.Layout();
        panel_root.setContentSize(cc.director.getVisibleSize());
        cc.director.getRunningScene().addChild(panel_root, 9999999);
        var touchListener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation()
                var ef_dianji = new cc.ParticleSystem("res/Animation/effect/eff_casino_xc_31.plist");
                target.addChild(ef_dianji, 100);
                ef_dianji.setPosition(pos);
                return true;
            },
            onTouchEnded: function (touch, event) {
                // JJLog.print("touch end========");
                // var target = event.getCurrentTarget();
                // var pos  = touch.getLocation()
                // var ef_dianji = new cc.ParticleSystem("res/Animation/effect/eff_casino_xc_31.plist");
                // target.addChild(ef_dianji, 100);
                // ef_dianji.setPosition(pos);
            },
        }, panel_root);

        return touchListener;

    },

    getBackpackData:function () {
        var backpack_cfg = {};
        var title = itemCfg[1];
        for(var i=2;i<itemCfg.length;i++)
        {
            var obj = {};
            for(var j=0;j<title.length;j++)
            {
                obj[title[j]] = itemCfg[i][j];
            }
            backpack_cfg[itemCfg[i][0]] = obj;
        }
        return backpack_cfg;
    },

    ChangeloadCard:function (card,data) {
        if(data)
        {
            if(!data.back) return;
            if(!backpackCfg.hasOwnProperty(data.back)) return;
            if(cc.sys.isObjectValid(card))
                card.loadTexture(Backpack_big[backpackCfg[data.back].attrId], ccui.Widget.LOCAL_TEXTURE);
        }
    },
    ChangeloadHead: function (parent,info) {
        if(info)
        {
            var image_frame = ccui.helper.seekWidgetByName(parent, "image_frame");
            var panel_frame = ccui.helper.seekWidgetByName(parent, "panel_frame");
            if(!info.head) return;
            if(!backpackCfg.hasOwnProperty(info.head)) return;
            var url = Backpack_big[backpackCfg[info.head].attrId];
            if(cc.sys.isObjectValid(image_frame))
                image_frame.setVisible(true);
            if (url != undefined && url.length > 0) {
                cc.loader.loadImg(url, { isCrossOrigin: true },
                    function (err, tex) {
                        JJLog.print(err, tex);
                        // if (err == null && this.alreadyClose == false) {
                        if (err == null) {
                            if(cc.sys.isObjectValid(panel_frame))
                                panel_frame.removeAllChildren();
                            var size = panel_frame.getContentSize();
                            var sprite = new cc.Sprite(tex);
                            var size_sp = sprite.getContentSize();
                            sprite.setScaleX(size.width / size_sp.width);
                            sprite.setScaleY(size.height / size_sp.height);
                            sprite.setAnchorPoint(cc.p(0, 0));
                            panel_frame.addChild(sprite);
                            image_frame.setVisible(false);
                        }
                    }.bind(this));
            }
        }
        else
        {
            util.ResetloadHead(parent);
        }
    },
    ResetloadHead:function (parent) {
        var image_frame = ccui.helper.seekWidgetByName(parent, "image_frame");
        var panel_frame = ccui.helper.seekWidgetByName(parent, "panel_frame");
        if(cc.sys.isObjectValid(panel_frame))
            panel_frame.removeAllChildren();
        if(cc.sys.isObjectValid(panel_frame))
            image_frame.setVisible(true);
    },

    LoadHead: function (parent, headUrl) {
        if (!cc.sys.isNative || !headUrl) {
            return;
        }

        if (headUrl.substring(headUrl.length - 1, headUrl.length) == "0") {
            headUrl = headUrl.substring(0, headUrl.length - 1) + "96";
        }

        var savePath = "";
        savePath = "WxHeadCache/" + hex_md5(headUrl) + ".png";

        var createHead = function (tex) {
            parent.removeAllChildren();
            var size = parent.getContentSize();
            var sprite = new cc.Sprite(tex);

            var size_sp = sprite.getContentSize();
            sprite.setScaleX(size.width / size_sp.width);
            sprite.setScaleY(size.height / size_sp.height);
            sprite.setPosition(cc.p(size.width / 2, size.height / 2));
            parent.addChild(sprite, 1000);

            
        };
        var cachePath = jsb.fileUtils.getWritablePath() + savePath;
        if (jsb.fileUtils.isFileExist(cachePath)) {
            createHead(cachePath);
        } else {
            cc.loader.loadImg(
                headUrl,
                {isCrossOrigin: true},
                function (err, tex) {
                    if (err == null && tex != null) {
                        createHead(tex);
                        util.CacheImage(tex, savePath);
                    } else {

                    }
                }
            );
        }
    },
    CacheImage: function (tex, savePath) {
        if (typeof (tex) != "string") {
            var saveSprite = new cc.Sprite(tex);
            //必须要再绘制区域内
            saveSprite.setPosition(cc.p(saveSprite.width / 2, saveSprite.height / 2));
            cc.director.getRunningScene().addChild(saveSprite, 255);

            var tmpurl = jsb.fileUtils.getWritablePath() + savePath;
            var index = tmpurl.lastIndexOf('/');
            var path = tmpurl.substring(0, index);
            if (!jsb.fileUtils.isDirectoryExist(path)) {
                jsb.fileUtils.createDirectory(path);
            }
            var renderTexture = cc.RenderTexture.create(
                saveSprite.width,
                saveSprite.height,
                cc.Texture2D.PIXEL_FORMAT_RGBA8888,
                gl.DEPTH24_STENCIL8_OES
            );

            renderTexture.begin();
            saveSprite.visit();
            renderTexture.end();
            saveSprite.setVisible(false);
            renderTexture.saveToFile(savePath, 1, true, function () {
                saveSprite.removeFromParent();
            });
        }
    },

    //调用此方法 必选要再onEnter里使用
    ChangeTextField2EditBox: function (textField) {
        if (!textField) return;
        var eSize = textField.getContentSize();
        var ePosition = textField.getPosition();
        var eParent = textField.parent;
        var eName = textField.getName();
        var eTag = textField.getTag();
        var eFontSize = textField.getFontSize();
        var eFontColor = textField.getColor();
        var eFontName = textField.getFontName();
        var ePlaceHolderStr = textField.getPlaceHolder();
        var ePlaceHolderColor = eFontColor; //textField.getPlaceHolderColor();
        var eMaxLength = textField.getMaxLength();
        var eIsPassW = textField.isPasswordEnabled();
        var ePassWT = textField.getPasswordStyleText();
        var anchor = textField.getAnchorPoint();


        var editBox = new cc.EditBox(eSize, new cc.Scale9Sprite("res/Default/Tran_1.png"));
        editBox.setPosition(ePosition);
        editBox.setName(eName);
        editBox.setTag(eTag);
        editBox.setFontSize(eFontSize);
        editBox.setFontColor(cc.color(0, 0, 0, 255)); //设置默认颜色
        editBox.setFontName(eFontName);
        editBox.setAnchorPoint(anchor);
        editBox.setPlaceHolder(ePlaceHolderStr);
        editBox.setPlaceholderFontName(eFontName);
        editBox.setPlaceholderFontSize(eFontSize);
        if (eIsPassW) {
            editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        }
        if (textField.isMaxLengthEnabled()) {
            editBox.setMaxLength(eMaxLength);
        }

        eParent.addChild(editBox);

        //重写方法
        editBox.setPlaceHolderColor = editBox.setPlaceholderFontColor;
        editBox.setTextColor = editBox.setFontColor;

        textField.removeFromParent();
        return editBox;
    },

    FormatString: function (formatText) {
        if (!formatText || typeof (formatText) != "string") return;
        var argNum = arguments.length - 1;
        var arg = arguments;
        var index = 0;
        return formatText.replace(/\{\s*p(\d+)\s*\}/g, function (match) {
            return ++index > argNum ? match : arg[index];
        });
    },
    /**
     * @param       num 输入需要格式化的数字
     * @param       count 显示小数点后的几个数字
     */
    ToPrecision : function (num, count)
    {
        if(num == undefined || count == undefined) return;
          
        var numPrec = num >= 1000 ? Math.floor(num).toString() : num.toPrecision(count);
        var dotIndex = numPrec.indexOf(".");
        if (dotIndex != -1) {
            var pos = numPrec.length - 1;
            while(pos >= dotIndex) {
                if (numPrec[pos] != "0" && numPrec[pos] != ".") break;
                numPrec = numPrec.substr(0, pos);
                pos = numPrec.length - 1;
            }
        }
        return numPrec;
    },
    /**
     * @param       amount 输入需要格式化的数字
     * @param       count 显示小数点后的几个数字（默认4）
     */
    MoneyFormat : function (amount, count) {
        var backStr = "";
        var org = amount;
    
        amount = Math.abs(amount);
        if (count == undefined) count = 4;
    
        if (amount < 10000) {
            backStr = amount + "";
        }
        else if (amount >= 10000 && amount < 100000000) {
            backStr = this.ToPrecision(amount / 10000, count) + "万";
        }
        else {
            backStr = this.ToPrecision(amount / 100000000, count) + "亿";
        }
    
        if (org < 0) {
            backStr = "-" + backStr;
        }
    
        return backStr;
    },
    /**
     * 自动裁减名称，裁减成为指定长度，超出的，使用...
     * @param len     中文字符数
     * 加入回车符过滤
     */
    ShortName: function (realName, len) {
        if (!realName) return "";

        len = len || 5;
        //len = Math.min(realName.length, len);

        var cutName = realName.replace(/\r|\n|\r\n/g, "");

        if (this.GetLength(cutName) <= len * 2) {
            return cutName;
        }

        var index = cutName.length;
        while (index > 0) {
            var realLen = this.GetLength(cutName.substr(0, index) + "...");
            if (realLen <= (len * 2)) {
                break;
            }
            --index;
        }

        if (index < cutName.length - 1) {
            return cutName.substr(0, index) + "...";
        }

        return cutName;
    },

    //获得电量
    getBatteryPercent: function () {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity", "getBatteryPercent", "()F");
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod("NativeOcClass", "getBatteryPercent");
            }
        }
        return 0.9;
    },

    showReceiveGold: function (endpos) {
        if (endpos == null) {
            endpos = cc.p(0, 0);
        }
        var goldNum = 30;
        var size = cc.director.getVisibleSize();
        var delayTime = 0
        var goldArray = new Array();
        for (i = 0; i < goldNum; i++) {
            var goldImg = new cc.Sprite("res/GameHall/Resoures/image/img_jifen.png");
            var index = Math.round(Math.random() * 50);
            var flag1 = Math.round(Math.random());
            var flag2 = Math.round(Math.random());
            var lengthX = flag1 == 0 ? -index : index;
            var lengthY = flag2 == 0 ? -index : index;
            goldImg.setPosition(cc.p(size.width / 2.0 + lengthX, size.height / 2.0 + lengthY));
            cc.director.getRunningScene().addChild(goldImg);
            goldArray.push(goldImg);
            goldImg.setVisible(false)
            goldImg.runAction(cc.sequence(cc.delayTime(delayTime), cc.show(), cc.delayTime(0.6), cc.removeSelf(true)));
            delayTime += 0.008;
        }
        sound.playReceiveGoldSound();
        delayTime = 0.25;
        for (i = goldArray.length - 1; i >= 1; i = i - 3) {
            var gold1 = goldArray[i];
            gold1.runAction(cc.sequence(cc.delayTime(delayTime), cc.sequence(cc.moveTo(0.15, cc.p(endpos.x, endpos.y)))));
            var gold2 = goldArray[i - 1];
            gold2.runAction(cc.sequence(cc.delayTime(delayTime), cc.sequence(cc.moveTo(0.15, cc.p(endpos.x, endpos.y)))));
            var gold3 = goldArray[i - 2];
            gold3.runAction(cc.sequence(cc.delayTime(delayTime), cc.sequence(cc.moveTo(0.15, cc.p(endpos.x, endpos.y)))));
            delayTime += 0.03;

        }
    },

    showFallReceiveGold: function () {
        var goldNum = 30;
        var goldArray = new Array();
        var size = cc.director.getVisibleSize();
        var screenWidth = size.width;
        var posInterval = screenWidth / goldNum;
        for (i = 0; i < goldNum; i++) {
            var goldImg = new cc.Sprite("res/GameHall/Resoures/image/img_jifen.png");
            var index = Math.round(Math.random() * 60);
            var posY = size.height - index;
            goldImg.setPosition(cc.p(posInterval * (i), posY));
            cc.director.getRunningScene().addChild(goldImg, 999);
            goldArray.push(goldImg);
        }
        sound.playReceiveGoldSound();
        delayTime = 0.25;
        for (i = 0; i < goldArray.length; i++) {
            var gold1 = goldArray[i];
            var index = Math.round(Math.random() * 60);
            var time = 0.01 * index;
            gold1.runAction(cc.sequence(cc.delayTime(delayTime), cc.moveBy(time, cc.p(0, -size.height - 10)), cc.removeSelf(true)));
        }
    },

    getDayGoldTip: function (rewardNum, times) {
        var dialog = new JJMajhongDecideDialog();
        dialog.setTitle("res/GameHall/Resoures/image/lingqujiujijing.png")
        dialog.setDes("您的金币不足，系统赠送您" + rewardNum + "金币！(今天第" + times + "次领取，每日可领取4次）");
        dialog.showDialog();
        dialog.setCallback(function () {
            hall.net.everyDayGoldReward(function (cbData) {
                if (cbData.code == 200) {
                    util.showFallReceiveGold();
                }
            });
        });
    },

    showLessGoldDialog:function () {
        hall.net.getShopConfig(function (data) {
            if (data.code == 200) {

                var panel = new  GameGoldShop(data["data"]);
                panel.showPanel();
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data['msg']);
                dialog.showDialog();
            }
        });
    },

    convertScore: function (num) {
        var add = num <0?"-":"";
        var score = parseInt(num);
        score = Math.abs(score);
        num = score;
        if (score >= 10000) {
            score = (num / 10000).toFixed(4);
        }

        score = score + "";

        if (num < 10000) {

        } else if (num < 100000) {
            score = score.substr(0, score.indexOf(".") + 3);
        } else if (num < 1000000) {
            score = score.substr(0, score.indexOf(".") + 2);
        } else {
            score = Math.floor(score);
        }

        if (score % 1 == 0) {
            score = parseInt(score);
        }

        if (num >= 10000) {
            score = score + "万";
        }

        return add+score;
    },

    //永远将一个节点的显示状态，进行设置不可更改
    ForeverVisibleNode: function (node, visible) {
        if (!node) return;

        var _visible = visible;
        node.setVisible(visible);
        node.setVisible = function () {

        }
    },

    NodesForeverVibleForParent: function (parent, names, visible) {
        var childNames = names;
        if (typeof (names) === "string") {
            childNames = [names];
        }
        childNames.forEach(function (name) {
            var node = ccui.helper.seekWidgetByName(parent, name);
            this.ForeverVisibleNode(node, visible);
        }, this);
    },

    /**
     * 自动裁减名称，裁减成为指定长度，超出的，使用...
     * @param len     中文字符数
     * 加入回车符过滤
     */
    ShortName: function (realName, len) {
        if (!realName) return "";

        len = len || 5;
        //len = Math.min(realName.length, len);

        var cutName = realName.replace(/\r|\n|\r\n/g, "");

        if (this.GetLength(cutName) <= len * 2) {
            return cutName;
        }

        var index = cutName.length;
        while (index > 0) {
            var realLen = this.GetLength(cutName.substr(0, index) + "...");
            if (realLen <= (len * 2)) {
                break;
            }
            --index;
        }

        if (index < cutName.length - 1) {
            return cutName.substr(0, index) + "...";
        }

        return cutName;
    },

    //<summary>获得字符串实际长度，中文2，英文1</summary>
    //<param name="str">要获得长度的字符串</param>
    GetLength: function (str, gbkLen) {
        if (!str) return 0;
        if (gbkLen == undefined) gbkLen = 2;
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += gbkLen;
        }
        return realLength;
    },
    /**
     * 格式化时间 (fmt[default] = "yyyy-MM-dd hh:mm:ss")
     */
    FormatDate: function (date, fmt) {
        fmt = fmt || "yyyy-MM-dd hh:mm:ss";
        if (typeof (date) === "string") {
            date = this.createDate(date);
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },

    FormatCopyRoom: function (roomID, des) {
        var formatStr = "血战麻将房号[{p0}]  {p1} (复制此消息打开游戏可直接进入该房间);";
        return this.FormatString(formatStr, roomID, des);
    },
    //获得电量
    getBatteryPercent: function () {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity", "getBatteryPercent", "()F");
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod("NativeOcClass", "getBatteryPercent");
            }
        }
        return 0.9;
    },

    /**
     * 格式化时间 (fmt[default] = "yyyy-MM-dd hh:mm:ss")
     */
    FormatDate: function (date, fmt) {
        fmt = fmt || "yyyy-MM-dd hh:mm:ss";
        if (typeof (date) === "string") {
            date = this.createDate(date);
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },


    /**
     * [createDate 字符串格式化成Date ]
     * @param  {[type]} dateTimeStr [2017-1-2 00:00:00 || 2017-1-2 || 2017年1月2日]
     * @return {[type]}             [Date]
     */
    CreateDate: function (dateTimeStr) {
        var date = null;
        dateTimeStr = dateTimeStr.replace(/((\d+)(\D+)(\d+)(\D+)(\d+))(\D*)((\d+)(\D+)(\d+)(\D*)(\d+))?/g,
            function () {
                var year = arguments[2];
                var month = arguments[4];
                var day = arguments[6];

                var hour = arguments[9];
                var minute = arguments[11];
                var second = arguments[13];
                var str = year + "/" + month + "/" + day;
                if (arguments[8]) {
                    str += " " + hour + ":" + minute + ":" + second;
                }
                // cc.log(str)
                return str;
            }
        );
        // cc.log("dateTimeStr:",dateTimeStr);
        date = new Date(dateTimeStr);

        return date;
    },

};

var CTimeMgr = function () {
    var time = cc.Class.extend({
        m_pStartTimer:null,
        m_pServerTime:0,
        ctor: function () {
            this.m_pServerTime = 0;
            this.m_pStartTimer = Date.parse(new Date())/1000;
            cc.setInterval(this.Update,1000,this);
        },
        init: function () {
            this.inited = true;
        },
        reStart: function (){

        },
        release: function () {
            this.reStart();
        },
        numberToFormat: function (value,scd)
        {
            var newDate = new Date(value * 1000);

            var year =  newDate.getFullYear();
            var month = newDate.getMonth() + 1;
            var day = newDate.getDate();
            month = month<10?("0"+month):(month);
            day = day<10?("0"+day):(day);
            var secondStr = newDate.getSeconds();
            var minuteStr = newDate.getMinutes();
            var hoursStr = newDate.getHours();
            var h = parseInt(hoursStr);
            hoursStr = h<10?("0"+h+":"):(h+":");
            var m = parseInt(minuteStr);
            var s = parseInt(secondStr);
            minuteStr = m<10?("0"+m):(m);
            //minuteStr = m<10?("0"+m+":"):(m+":");
            secondStr = s<10?(":0"+s):(":"+s);
            //return (year + "/" + month + "/" + day + " " + hoursStr+minuteStr+secondStr);
            if(scd)
            {
                return (hoursStr+minuteStr+secondStr);
            }
            else
            {
                return (year + "/" + month + "/" + day + " " + hoursStr+minuteStr+secondStr);
            }
        },
        m_GetserverTime:function () {
            return CTimeMgr.Instance.m_pServerTime;
        },
        m_SetserverTime:function (v) {
            this.ResetTime(v);
        },
        Update:function(){
            var cur  = Date.parse(new Date())/1000;
            var count = cur - this.CTimeMgr.Instance.m_pStartTimer;
            CTimeMgr.Instance.m_pServerTime += count;
            CTimeMgr.Instance.m_pStartTimer = cur;
        },
        ResetTime:function(time){
            CTimeMgr.Instance.m_pServerTime = time;
            CTimeMgr.Instance.m_pStartTimer = Date.parse(new Date())/1000;
        }
    });
    /**
     * 创建
     * 释放
     * 实例访问
     */
    var instance = null;
    var create = function () {
        if (!instance) {
            instance = new time();
        }
        return instance;
    };

    var release = function () {
        if (instance) {
            instance.release();
            instance = null;
        }
    };

    /**
     * 导出接口
     * 每个单例对象都要到处三个接口
     * 一个create、一个release、一个Instance
     */
    var reTime = {
        create: create,
        release: release
    };

    Object.defineProperty(reTime, "Instance", {
        get: function () {
            create();
            return instance;
        }
    });

    return reTime;
}();

//==============================================================================
var _NickNameF_ = "nickName";
var _NickNameU_ = "userName";
var _NickNameP_ = "playerName";
var EncodeYQGReq = function (data) {

    if (cc.sys.isNative) {
        _.forEach(data, function (v, k) {
            if (k == _NickNameF_ || k == _NickNameU_ || k == _NickNameP_) {

                data[k] = BASE64.encoder(v);
            }
            if (typeof (v) == "object") EncodeYQGReq(v);
        });
    }

};

var DecodeYQGRes = function (data) {
    if (cc.sys.isNative || true) {
        _.forEach(data, function (v, k) {
            if (k == _NickNameF_ || k == _NickNameU_ || k == _NickNameP_) {
                var nickNameStr = v;

                if (ISBase64(nickNameStr)) {

                    var nickNames = BASE64.decoder(nickNameStr);
                    if (nickNames && nickNames instanceof Array) {
                        var arr2 = [];
                        for (i = 0, l = nickNames.length; i < l; i += 1) {
                            arr2.push(String.fromCharCode(nickNames[i]));
                        }
                        data[k] = arr2.join('');
                    }
                }

            }
            if (typeof (v) == "object") DecodeYQGRes(v);
        });
    }

};


var DecodePlayerName = function (name) {
    if (ISBase64(name)) {

        var nickNames = BASE64.decoder(name);
        if (nickNames && nickNames instanceof Array) {
            var arr2 = [];
            for (i = 0, l = nickNames.length; i < l; i += 1) {
                arr2.push(String.fromCharCode(nickNames[i]));
            }
            name = arr2.join('');
        }
    }
    return name;
}

//判断字符串是否为baseb4加密的
var ISBase64 = function (srcStr) {
    var str1 = null;
    var str1Tmp = BASE64.decoder(srcStr);
    var str2 = null;
    if (str1Tmp && str1Tmp instanceof Array) {
        var arr2 = [];
        for (i = 0, l = str1Tmp.length; i < l; i += 1) {
            arr2.push(String.fromCharCode(str1Tmp[i]));
        }
        str1 = arr2.join('');
    }
    var str2 = BASE64.encoder(str1);
    if (str2 == srcStr) {
        return true;
    } else {
        return false;
    }
};

