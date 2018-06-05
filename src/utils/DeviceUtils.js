var DeviceUtils = {
    
};

DeviceUtils._init = function () {
    var cfgData = {
        bundleId : "org.interact.game.alaxzmj",
        version  : "1.0.0",
        deviceModel:"android",
        deviceName: "Sansong",
        deviceId : "xfyhmokmoifghjk",
        systemVersion: "7.0",
        systemName: "android",
    }
    this._readBundleID(cfgData);
    this._readVersion(cfgData);
    this._readDeviceModel(cfgData);
    this._readDeviceName(cfgData);
    this._readSystemVersion(cfgData);
    this._readSystemName(cfgData);
    this._readDeviceId(cfgData);

    Object.defineProperties(this, {
        "BundleId": {
           get: function() {
               return cfgData.bundleId;
           }
       },
       "Version": {
            get: function() {
                return cfgData.version;
            }
        },
        "DeviceModel": {
            get: function() {
                return cfgData.deviceModel;
            }
        },
        "DeviceName": {
            get: function() {
                return cfgData.deviceName;
            }
        },
        "DeviceId": {
            get: function() {
                return cfgData.deviceId;
            }
        },
        "SystemVersion": {
            get: function() {
                return cfgData.systemVersion;
            }
        },
        "SystemName": {
            get: function() {
                return cfgData.systemName;
            }
        },
       
    });

    JJLog.print('[Device_utils] -> : ' + 
        DeviceUtils.BundleId + "->:" +
        DeviceUtils.Version + "->:"+
        DeviceUtils.DeviceModel + "->:"+
        DeviceUtils.DeviceName + "->:"+
        DeviceUtils.DeviceId + "->:"+
        DeviceUtils.SystemVersion + "->:"+
        DeviceUtils.SystemName
    );
};
DeviceUtils._readBundleID = function (data) {
    var value = "org.interact.game.alaxzmj";
    if (cc.sys.os == cc.sys.OS_IOS) {
        
        var BundleId = jsb.reflection.callStaticMethod("NativeOcClass","getBundleId");
        JJLog.print("[DeviceUtils:] BundleId:",BundleId);

        value = BundleId;
    }
    else if (cc.sys.os == cc.sys.OS_ANDROID) {
        var BundleId = jsb.reflection.callStaticMethod("com/yiqigame/utils/YQGJSBridge",
        "getBundleId", "()Ljava/lang/String;");
        JJLog.print("[DeviceUtils:] BundleId:",BundleId);

        value = BundleId;
    }
    data.bundleId = value;
};
DeviceUtils._readVersion = function (data) {
    var value = "1.0.0";
    if (cc.sys.os == cc.sys.OS_IOS) {
        
        var Version = jsb.reflection.callStaticMethod("NativeOcClass","getVersion");
        JJLog.print("[DeviceUtils:] Version:",Version);

        value = Version;
    }
    else if (cc.sys.os == cc.sys.OS_ANDROID) {
        var Version = jsb.reflection.callStaticMethod("com/yiqigame/utils/YQGJSBridge",
        "getVersion", "()Ljava/lang/String;");
        JJLog.print("[DeviceUtils:] Version:",Version);

        value = Version;
    }
    data.version = value;
};
DeviceUtils._readDeviceModel = function (data) {
    var value =  "Sansong";
    if (cc.sys.os == cc.sys.OS_IOS) {
        
        var DeviceModel = jsb.reflection.callStaticMethod("NativeOcClass","getDeviceModel");
        JJLog.print("[DeviceUtils:]  DeviceModel:",DeviceModel);

        value = DeviceModel;
    }
    else if (cc.sys.os == cc.sys.OS_ANDROID) {
        var DeviceModel = jsb.reflection.callStaticMethod("com/yiqigame/utils/YQGJSBridge",
        "getDeviceModel", "()Ljava/lang/String;");
        JJLog.print("[DeviceUtils:]  DeviceModel:",DeviceModel);
        value = DeviceModel;
    }
    data.deviceModel = value;
};
DeviceUtils._readDeviceName = function (data) {
    var value = "9700";
    if (cc.sys.os == cc.sys.OS_IOS) {
        
        var DeviceName = jsb.reflection.callStaticMethod("NativeOcClass","getDeviceName");
        JJLog.print("[DeviceUtils:]  DeviceName:",DeviceName);

        value = DeviceName;
    }
    else if (cc.sys.os == cc.sys.OS_ANDROID) {
        var DeviceName = jsb.reflection.callStaticMethod("com/yiqigame/utils/YQGJSBridge",
        "getDeviceName", "()Ljava/lang/String;");
        JJLog.print("[DeviceUtils:]  DeviceName:",DeviceName);

        value = DeviceName;
    }
    data.deviceName = value;
};
DeviceUtils._readDeviceId = function (data) {
    
    var value = "";

    if (cc.sys.os == cc.sys.OS_IOS) {
        
        var DeviceId = jsb.reflection.callStaticMethod("NativeOcClass","getDeviceId");
        JJLog.print("[DeviceUtils:]  DeviceId:",DeviceId);

        value = DeviceId;
    }
    else if (cc.sys.os == cc.sys.OS_ANDROID) {
        var DeviceId = jsb.reflection.callStaticMethod("com/yiqigame/utils/YQGJSBridge",
        "getDeviceId", "()Ljava/lang/String;");
        JJLog.print("[DeviceUtils:]  DeviceId:",DeviceId);

        value = DeviceId;
    }
    data.deviceId = value;
};
DeviceUtils._readSystemVersion = function (data) {
    var value = cc.sys.os;
    if (cc.sys.os == cc.sys.OS_IOS) {
        
        var SystemVersion = jsb.reflection.callStaticMethod("NativeOcClass","getSystemVersion");
        JJLog.print("[DeviceUtils:]  SystemVersion:",SystemVersion);

        value = SystemVersion;
    }
    else if (cc.sys.os == cc.sys.OS_ANDROID) {
        var SystemVersion = jsb.reflection.callStaticMethod("com/yiqigame/utils/YQGJSBridge",
        "getSystemVersion", "()Ljava/lang/String;");
        JJLog.print("[DeviceUtils:]  SystemVersion:",SystemVersion);

        value = SystemVersion;
    }
    data.systemVersion = value;
};
DeviceUtils._readSystemName = function (data) {
    var value = cc.sys.os;
    if (cc.sys.os == cc.sys.OS_IOS) {
       
        var SystemName = jsb.reflection.callStaticMethod("NativeOcClass","getSystemName");
        JJLog.print("[DeviceUtils:]  SystemName:",SystemName);

        value = SystemName;
    }
    else if (cc.sys.os == cc.sys.OS_ANDROID) {
        var SystemName = jsb.reflection.callStaticMethod("com/yiqigame/utils/YQGJSBridge",
        "getSystemName", "()Ljava/lang/String;");
        JJLog.print("[DeviceUtils:]  SystemName:",SystemName);

        value = SystemName;
    }
    data.systemName = value;
};

DeviceUtils.getWxRoomId = function () {
	if (cc.sys.os == cc.sys.OS_IOS) {
		hall.wxEnterRoom = jsb.reflection.callStaticMethod("NativeOcClass",
			"getWxRoomId");
	} else if (cc.sys.os == cc.sys.OS_ANDROID) {
		hall.wxEnterRoom = jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
			"getWxRoomId", "()I");
	}
	JJLog.print('getWxRoomId', hall.wxEnterRoom);
};
DeviceUtils.isLocationEnabled = function () {
	var enabled = 0;
	if (cc.sys.os == cc.sys.OS_IOS) {
		enabled = jsb.reflection.callStaticMethod("NativeOcClass",
			"isLocationEnabled");
	} else if (cc.sys.os == cc.sys.OS_ANDROID) {
		enabled = jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
			"isLocationEnabled", "()I");
	}

	return enabled == 1 ? true : false;
};

DeviceUtils.startLocation = function () {
	if (AppMgr.Audit != 1) {
		if (cc.sys.os == cc.sys.OS_IOS) {
			jsb.reflection.callStaticMethod("NativeOcClass",
				"startLocation");
		} else if (cc.sys.os == cc.sys.OS_ANDROID) {
			jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
				"startLocation", "()V");
		}
	}
};

DeviceUtils.UMengEvent = function (eventName, eventLabel) {
	if (AppMgr.Audit != 1) {
		if (cc.sys.os == cc.sys.OS_IOS) {
			jsb.reflection.callStaticMethod("NativeOcClass",
				"UMengPlayerEvent:label:", eventName, eventLabel);
		} else if (cc.sys.os == cc.sys.OS_ANDROID) {
			jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
				"UMengPlayerEvent", "(Ljava/lang/String;Ljava/lang/String;)V", eventName, eventLabel);
		}
	}
};

DeviceUtils.UMengLogin = function () {
	if (AppMgr.Audit != 1) {
		if (cc.sys.os == cc.sys.OS_IOS) {
			jsb.reflection.callStaticMethod("NativeOcClass",
				"UMengPlayerLogin:", '' + hall.user.uid);
		} else if (cc.sys.os == cc.sys.OS_ANDROID) {
			jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
				"UMengPlayerLogin", "(Ljava/lang/String;)V", '' + hall.user.uid);
		}
	}
};
DeviceUtils.wxShareURL = function (title, desc, flag , shareUrl) {
	if (cc.sys.isNative) {
		if (cc.sys.os == cc.sys.OS_IOS) {
			jsb.reflection.callStaticMethod("NativeOcClass",
				"wxShareURL:withDesc:withURL:useFlag:", title, desc, shareUrl, '' + flag);
		} else if (cc.sys.os == cc.sys.OS_ANDROID) {
			jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
				"wxShareURL", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V", title, desc, shareUrl, flag);
		}
	}
};

DeviceUtils.wxShareScreen = function (flag) {
	if (cc.sys.isNative) {
		if (cc.sys.os == cc.sys.OS_IOS) {
			jsb.reflection.callStaticMethod("NativeOcClass",
				"wxShareScreen:", '' + flag);
		} else if (cc.sys.os == cc.sys.OS_ANDROID) {
			jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
				"wxShareScreen", "(I)V", flag);
		}
	}
};

DeviceUtils.openWxLogin = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("NativeOcClass",
            "wxLogin:", 'qphall');
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
            "wxLogin", "(Ljava/lang/String;)V", 'qphall');
    }
};

DeviceUtils.openLocationSetting = function () {
	if (cc.sys.os == cc.sys.OS_IOS) {
		jsb.reflection.callStaticMethod("NativeOcClass",
			"openLocationSetting");
	} else if (cc.sys.os == cc.sys.OS_ANDROID) {
		jsb.reflection.callStaticMethod("win/yiqigame/majiang/wxapi/AppActivity",
			"openLocationSetting", "()V");
	}
};

DeviceUtils.HideSplash = function () {
    if (cc.sys.os == cc.sys.OS_IOS) {
        
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("com/yiqigame/utils/YQGJSBridge",
        "HideSplash", "()V");
    }
};

DeviceUtils._init();
