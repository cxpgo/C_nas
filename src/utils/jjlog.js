/**
 * Created by atom on 2016/11/26.
 */
JJLog = {
    ON: 'on',
    OFF: 'off',
    mode: 'off',
    cid: Date.now(),
    print: function () {
        this.mode = this.ON;
        if (this.mode == this.ON) {
            var date = new Date();
            var timeStr = "[" + date.toLocaleString() + "]";

            var argu = Array.prototype.slice.call(arguments);
            if (argu.length > 0 && typeof argu[0] == "string") argu[0] = timeStr + " " + argu[0];
            else argu.unshift(timeStr);

            // console.log(argu.toString().replace(',', ''));
            // console.log(argu.toString());
            cc.log.apply(cc, argu);
            // if(window.document){
            //     this._cacheLog(argu);
            // }
        }
    },
    _cacheLog: function (args) {

        var logF = args.join(",");
        var request = window.document.location.origin+"/cacheClientLog";
        request += ('?cid=' + this.cid);
        request += ('&log=' + logF);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", request, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // console.log(args.toString().replace(',', ''));
            }
        };
        xhr.send();
    },
    log2cloud: function () {
        this.mode = this.ON;
        if (this.mode == this.ON) {
            var request = 'http://yigigame-majiang.cn-hangzhou.log.aliyuncs.com/logstores/majiang/track?APIVersion=0.6.0';
            request += ('&server=' + servers.connector);
            if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
                request += ('&client=android');
            else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS)
                request += ('&client=ios');
            else
                request += ('&client=web');

            var args = Array.prototype.slice.call(arguments);
            var i = 0;
            for (var o in args) {
                request += ('&field' + i + '=' + args[o]);
                i++;
            }

            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("GET", request, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log(args.toString().replace(',', ''));
                }
            };
            xhr.send();
        }
    },
    setEnable: function (isEnable) {
        if (isEnable) {
            this.mode = this.ON;
        } else {
            this.mode = this.OFF;
        }
    }
}
