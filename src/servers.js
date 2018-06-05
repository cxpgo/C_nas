

//##YQGAMEDEBUG
var WGTestServer = (function () {
    var tests = {
        "Dev1" : {
            'web' : 'http://dev1.lekoy.com:5001',
            'ports' : [5010],
            'connector' : 'dev1.lekoy.com'
        },
        "东北提升服" : {
            'web' : 'http://39.107.236.190:5001',
            'ports' : [5010],
            'connector' : '39.107.236.190',
        },

        "白山测试服" : {
            'web' : 'http://dev3.lekoy.com:6001',
            'ports' : [6010],
            'connector' : 'dev3.lekoy.com',
        },
        "陈总服" : {
            'web' : 'http://172.16.1.219:5001',
            'ports' : [5010],
            'connector' : '172.16.1.219',
        },
        "星宇服" : {
            'web' : 'http://172.16.1.197:7001',
            'ports' : [7010],
            'connector' : '172.16.1.197',
        },
        "东北提审服务" : {
            'web' : 'http://39.107.236.190:5001',
            'ports' : [5010],
            'connector' : '39.107.236.190',
        },
        "阿里" : {
            'web' : 'http://47.96.68.209:5001',
            'ports' : [5010],
            'connector' : '47.96.68.209',
        },
    };

    var view = cc.Layer.extend({
        ctor: function () {
            this._super();
            var root = util.LoadUI(GameHallJson.TestServers).node;
            this.addChild(root);
            this._this = this;

            var panel_server_clone = ccui.helper.seekWidgetByName(root,"panel_server")
            var listview = ccui.helper.seekWidgetByName(root,"listview")

            var pp = new Array();
            var selectD = null;
            var _index = 0
            for (var name in tests) {
                var _serverCfg = tests[name];
                var panel = panel_server_clone.clone();
                var checkbox = ccui.helper.seekWidgetByName(panel, "checkbox");
                var text = ccui.helper.seekWidgetByName(panel, "text");
                text.string = name;
                checkbox.setTouchEnabled(false);
                panel._checkBox = checkbox;

                var cacheName = util.getCacheItem('CacheServerSelect');

                var bl = cacheName == name;

                pp.push(panel);

                var clickData = {};
                clickData['this'] = this;
                clickData['index'] = _index ++ ;
                clickData['array'] = pp;
                clickData['itemKey'] = "CacheServerSelect";
                clickData['itemValue'] = name;
                clickData["serverCfg"] = _serverCfg;
                if(bl || !selectD){
                    selectD = clickData;
                }
                panel.addClickEventListener(this.onToggle.bind(clickData));

                listview.pushBackCustomItem(panel);
            }
            if(selectD){
                this.onToggle.bind(selectD)();
            }
            panel_server_clone.setVisible(false);
        },

        onToggle: function () {
            var index = this['index'];
            var _this = this['this'];
            var array = this['array'];
            var key = this['itemKey'];
            var value = this['itemValue'];
            var _serverCfg = this['serverCfg'];

            for (var i = 0; i < array.length; i++) {
                array[i].setTouchEnabled(i != index);
                array[i]._checkBox.setSelected(i == index);
            }

            util.setCacheItem(key , value);
            for (var key in _serverCfg) {
                servers[key] = _serverCfg[key];
            }
        },

    });

    var addTo = function (parent) {
        parent.addChild(new view());
    };
    var ins = {
        addTo: addTo,
    };

    return ins;
})();

servers = {
    'web' : 'http://172.16.1.219:5001',
    'ports' : [5010],
    'connector' : '172.16.1.219', //prodcs dev2.lekoy.com
    'share' : 'http://a.mlinks.cc/Aa6S?roomId=0',
    'aLishare': 'http://mall.yiqigame.me/download.html?name=sss'
}

//YQGAMEDEBUG##

//##YQGAMEDEBUG]
/*
//YQGAMEDEBUG##
var ServerCfg = {
    HostUrl     : "39.107.236.190",
    OSSUrl      : "www.yiqigame.me",
    OSSPort     : "30311",
    WebPort     : "5001",
    SctPort     : [5010],
    Route       : "yjdbb",
    ReqType     : "http://",
    Share       : 'https://ab94li.mlinks.cc/A01R?roomId=0',
    ALiShare    : 'http://mall.yiqigame.me/download.html?name=sss'
};

servers = function () {
    Object.defineProperties(ServerCfg, {
        "web": {
            get: function () {
                return ServerCfg.ReqType + ServerCfg.HostUrl + ":" + ServerCfg.WebPort;
            }
        },
        "ossWeb": {
            get: function () {
                return ServerCfg.ReqType + ServerCfg.OSSUrl + ":" + ServerCfg.OSSPort;
            }
        },
        "ports": {
            get: function () {
                return ServerCfg.SctPort;
            }
        },
        "connector": {
            get: function () {
                return ServerCfg.HostUrl;
            }
        },
        "share": {
            get: function () {
                return ServerCfg.Share;
            }
        },
        "aLishare": {
            get: function () {
                return ServerCfg.ALiShare;
            }
        },
    });
    return ServerCfg;
}();
//##YQGAMEDEBUG
**/
//YQGAMEDEBUG##