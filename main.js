//##YQGAMEDEBUG
if (window.document) {
    var __M_LOG__ = "";
    __M_LOG__ += ("\n");
    __M_LOG__ += ("                   _ooOoo_\n");
    __M_LOG__ += ("                  o8888888o\n");
    __M_LOG__ += ("                  88\" . \"88\n");
    __M_LOG__ += ("                  (| -_- |)\n");
    __M_LOG__ += ("                  O\\  =  /O\n");
    __M_LOG__ += ("               ____/`---'\\____\n");
    __M_LOG__ += ("             .'  \\\\|     |//  `.\n");
    __M_LOG__ += ("            /  \\\\|||  :  |||//  \\ \n");
    __M_LOG__ += ("           /  _||||| -:- |||||-  \\ \n");
    __M_LOG__ += ("           |   | \\\\\\  -  /// |   |\n");
    __M_LOG__ += ("           | \\_|  ''\\---/''  |   |\n");
    __M_LOG__ += ("           \\  .-\\__  `-`  ___/-. /\n");
    __M_LOG__ += ("         ___`. .'  /--.--\\  `. . __\n");
    __M_LOG__ += ("      .\"\" '<  `.___\\_<|>_/___.'  >'\"\".\n");
    __M_LOG__ += ("     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n");
    __M_LOG__ += ("     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /\n");
    __M_LOG__ += ("======`-.____`-.___\\_____/___.-`____.-'======\n");
    __M_LOG__ += ("                   `=---='\n");
    __M_LOG__ += ("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n");
    console.error(__M_LOG__);
}
//YQGAMEDEBUG##

var XYGameInitCount = 0;
var XYGameInitAppend = function (listOrItem) {
    cc.game.config.jsList = cc.game.config.jsList.concat(listOrItem);
};
var XYGameInitAppendRes = function (listOrItem) {
    cc.game.config.resList = cc.game.config.resList.concat(listOrItem);
};

var XYGameInitLoad = function (listOrItem) {
    var list = [].concat(listOrItem);
    XYGameInitCount++;
    var checkToBoot = function () {
        var cf = function () {
            XYGameInitCount--;
            if (XYGameInitCount <= 0) {
                cc.game.boot()
            }
        };
        // if (window.document) {
        //     setTimeout(cf , 500);
        // }else{
        cf();
        // }
    };

    cc.loader.loadJs(list, checkToBoot);

};
/**
 * Native 加载脚本文件
 * @param {string} fileP 
 */
var XYNativeRequire = function (fileP) {
    if(cc.game.config.jsList){
        var fI = cc.game.config.jsList.indexOf(fileP);
        if(fI >= 0){
            cc.game.config.jsList.splice(fI , 1);
        }
    }
    require(fileP);
};
/**
 * 为一个Object 添加创建访问实例
 * @param {Object} logic 
 */
var XYInstanceClass = function (logic) {
    var insC = function (logic) {
        /**
        * 创建
        * 释放
        * 实例访问
        */
        var instance = null;
        var create = function () {
            if (!instance) {
                instance = new logic();
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
    }

    return new insC(logic);
};
/**
 * 加载Web脚本文件
 * @param {string} path 
 * @param {function} handler 
 */
var addBrowserScriptWithPath = function (path, handler) {
    var _handler = handler;
    var appJS = document.createElement('script');
    appJS.async = true;
    appJS.src = path;
    appJS.crossOrigin = "anonymous";
    var appJSLoaded = function () {
        document.body.removeChild(appJS);
        appJS.removeEventListener('load', appJSLoaded, false);
        if (_handler) _handler();
    };
    appJS.addEventListener('load', appJSLoaded, false);
    document.body.appendChild(appJS);
};

cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("splash"))
        document.body.removeChild(document.getElementById("splash"));

    if (cc.sys.isNative)
        require('pomelo-cocos2d-jsb/index.js');
    else {
        cc.setTimeout = function (code, timeout) {
            setTimeout(code, timeout);
        };

        cc.setInterval = function (code, interval) {
            return setInterval(code, interval);
        };

        cc.clearInterval = function (id) {
            clearInterval(id);
        };
    }

    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(true);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size
    // // cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    var size = cc.director.getVisibleSize();
    if(size.width == 2436 && size.height == 1125)
    {
        cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.EXACT_FIT);
    }else
    {
        cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    }


    // var glView = cc.view;
    // var winSize = cc.winSize;
    // var bsSize = cc.size(1280.0, 720.0);
    // var scaleX = winSize.width / bsSize.width;
    // var scaleY = winSize.height / bsSize.height;

    // var scale = 0.0; // MAX(scaleX, scaleY);
    // if (scaleX < scaleY) {
    //     scale = scaleX / (winSize.height / bsSize.height);
    //     bsSize.width *= scale;
    // } else {
    //     scale = scaleY / (winSize.width / bsSize.width);
    //     bsSize.height *= scale;
    // }
    // cc.view.setDesignResolutionSize(bsSize.width, bsSize.height, cc.ResolutionPolicy.SHOW_ALL);

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);
    //////load resources
    //cc.LoaderScene.preload(hall.uiRes, function () {
    //    cc.director.runScene(new HelloWorldScene());
    //}, this);
};
cc.game.boot = function () {
    if (window.document) {
        var addCtrls = [
            "src/app.js",
            "src/servers.js",
        ];
        var boot = function () {
            if (typeof (AppCtrl) == "undefined") {
                cc.log("reLoad")
                cc.game.boot();
                return;
            }
            AppCtrl.onStart();
        };
        var len = addCtrls.length;
        for (var index = 0; index < len; index++) {
            var path = addCtrls[index];
            addBrowserScriptWithPath(path, index == (len - 1) ? boot : null);
        }
    }
    else if (cc.sys.isNative) {
        XYNativeRequire('src/utils/jjlog.js');
        XYNativeRequire('src/hotUpdate/AssetsMgrScene.js');
        XYNativeRequire('src/app.js');
        XYNativeRequire('src/servers.js');
        XYNativeRequire("src/utils/DeviceUtils.js");
        AppCtrl.onStart();
    }
};
cc.game.run();
