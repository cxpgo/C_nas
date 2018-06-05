var MJGameDeskCfg = function (gameDeskCfg) {
    gameDeskCfg = gameDeskCfg || {};
    var _itemCfg = function (itemC) {
        itemC = itemC || {};
        var cfg = {
            CMP : [
            ],
            PLG : [
            ],
        };
        if(itemC.CMP){
            cfg.CMP = cfg.CMP.concat(itemC.CMP);
        }
        if(itemC.PLG){
            cfg.PLG = cfg.PLG.concat(itemC.PLG);
        }
        return cfg;
    };
    var _SeatCfg = function (seatC) {
        seatC = seatC || {};
        var cfg = {
            V2D :_itemCfg(seatC.V2D),
            V3D :_itemCfg(seatC.V3D),
            VRE :_itemCfg(seatC.VRE),
        };
        return cfg;
    };

    var deskCfg = {
        Self    : _SeatCfg(gameDeskCfg.Self),
        Right   : _SeatCfg(gameDeskCfg.Right),
        Up      : _SeatCfg(gameDeskCfg.Up),
        Left    : _SeatCfg(gameDeskCfg.Left),
    };
    return deskCfg;
};

var MJGameDesk = function () {
    var _GRightSeat = null;
    var _GSelfSeat = null;
    var _GLeftSeat = null;
    var _GUpSeat = null;

    var _GRightSeatRe = null;
    var _GSelfSeatRe = null;
    var _GLeftSeatRe = null;
    var _GUpSeatRe = null;

    var _GRightPlugins = [];
    var _GSelfPlugins = [];
    var _GLeftPlugins = [];
    var _GUpPlugins = [];

    var _GRightRePlugins = [];
    var _GSelfRePlugins = [];
    var _GLeftRePlugins = [];
    var _GUpRePlugins = [];

    var _GameDeskCfg = MJGameDeskCfg();

    //注册配置
    var registCfg = function (gameDeskCfg) {
        _GameDeskCfg = MJGameDeskCfg(gameDeskCfg);
    };

    var GameDesk = cc.Layer.extend({
        panel_up: null,
        panel_left: null,
        panel_player: null,
        panel_right: null,
        upCards: null,
        mDeskSetMap: null,
        delegate: null,
        initialize: function (root) {
            this.addChild(root);
            this.mDeskSetMap = {};
            this.panel_up = ccui.helper.seekWidgetByName(root, "panel_up");
            this.panel_left = ccui.helper.seekWidgetByName(root, "panel_left");

            this.panel_player = ccui.helper.seekWidgetByName(root, "panel_player");
            this.panel_right = ccui.helper.seekWidgetByName(root, "panel_right");
        },

        setDelegate: function (deg) {
            this.delegate = deg;
        },

        onEnter: function () {
            this._super();
            this.update();
        },

        getByUID: function (uid) {
            return this.mDeskSetMap[uid]
        },

        update: function () {
            if (MajhongInfo.GameMode == GameMode.PLAY) {
                if (!!XYGLogic.table.selfSeatInfo()) {
                    var data = XYGLogic.table.selfSeatInfo();
                    if(!this.mDeskSetMap[data['uid']]){
                        var selfseat = new _GSelfSeat(data);
                        for (var i = 0; i < _GSelfPlugins.length; i++) {
                            var _pg = _GSelfPlugins[i];
                            selfseat.loadPlugIn(_pg.PlugIn , _pg.File);
                        }

                        this.panel_player.addChild(selfseat, 100);
                        this.mDeskSetMap[data['uid']] = selfseat;

                        var selfInfo = XYGLogic.table.getCardByPlayer(data.uid)
                    }
                    else{
                        this.mDeskSetMap[data['uid']].reset();
                    }
                }
                if (!!XYGLogic.table.rightSeatInfo()) {
                    var data = XYGLogic.table.rightSeatInfo();
                    if(!this.mDeskSetMap[data['uid']]){
                        var rightSeat = new _GRightSeat(data);
                        for (var i = 0; i < _GRightPlugins.length; i++) {
                            var _pg = _GRightPlugins[si];
                            rightSeat.loadPlugIn(_pg.PlugIn , _pg.File);
                        }
                        this.panel_right.addChild(rightSeat, 99);
                        this.mDeskSetMap[data['uid']] = rightSeat;
                    }
                    else{
                        this.mDeskSetMap[data['uid']].reset();
                    }
                }
                if (!!XYGLogic.table.leftSeatInfo()) {
                    var data = XYGLogic.table.leftSeatInfo();
                    if(!this.mDeskSetMap[data['uid']]){
                        var leftSeat = new _GLeftSeat(data);
                        for (var i = 0; i < _GLeftPlugins.length; i++) {
                            var _pg = _GLeftPlugins[si];
                            leftSeat.loadPlugIn(_pg.PlugIn , _pg.File);
                        }
                        this.panel_left.addChild(leftSeat, 98);
                        this.mDeskSetMap[data['uid']] = leftSeat;
                    }
                    else{
                        this.mDeskSetMap[data['uid']].reset();
                    }
                }
                if (!!XYGLogic.table.upSeatInfo()) {
                    var data = XYGLogic.table.upSeatInfo();
                    if(!this.mDeskSetMap[data['uid']]){
                        var upSeat = new _GUpSeat(data);
                        for (var i = 0; i < _GUpPlugins.length; i++) {
                            var _pg = _GUpPlugins[si];
                            upSeat.loadPlugIn(_pg.PlugIn , _pg.File);
                        }
                        this.panel_up.addChild(upSeat, 97);
                        this.mDeskSetMap[data['uid']] = upSeat;
                    }else{
                        this.mDeskSetMap[data['uid']].reset();
                    }
                }
            } else if (MajhongInfo.GameMode == GameMode.RECORD) {

                var data = XYGLogic.record.selfHandCards;
                if(!this.mDeskSetMap[data['uid']]){
                    var selfseat = new _GSelfSeatRe(data);
                    for (var i = 0; i < _GSelfRePlugins.length; i++) {
                        var _pg = _GSelfRePlugins[i];
                        selfseat.loadPlugIn(_pg.PlugIn , _pg.File);
                    }
                    this.panel_player.addChild(selfseat, 100);
                    this.mDeskSetMap[data['uid']] = selfseat;
                }
                

                if (XYGLogic.record.rightHandCards != null) {
                    var data = XYGLogic.record.rightHandCards;
                    if(!this.mDeskSetMap[data['uid']]){
                        var rightSeat = new _GRightSeatRe(data);
                        for (var i = 0; i < _GRightRePlugins.length; i++) {
                            var _pg = _GRightRePlugins[si];
                            rightSeat.loadPlugIn(_pg.PlugIn , _pg.File);
                        }
                        this.panel_right.addChild(rightSeat, 99);
                        this.mDeskSetMap[data['uid']] = rightSeat;
                    }
                    
                }

                if (XYGLogic.record.leftHandCards != null) {
                    var data = XYGLogic.record.leftHandCards;
                    if(!this.mDeskSetMap[data['uid']]){
                        var leftSeat = new _GLeftSeatRe(data);
                        for (var i = 0; i < _GLeftRePlugins.length; i++) {
                            var _pg = _GLeftRePlugins[si];
                            leftSeat.loadPlugIn(_pg.PlugIn , _pg.File);
                        }
                        this.panel_left.addChild(leftSeat, 98);
                        this.mDeskSetMap[data['uid']] = leftSeat;
                    }
                }

                if (XYGLogic.record.upHandCards != null) {
                    var data = XYGLogic.record.upHandCards;
                    if(!this.mDeskSetMap[data['uid']]){
                        var upSeat = new _GUpSeatRe(data);
                        for (var i = 0; i < _GUpRePlugins.length; i++) {
                            var _pg = _GUpRePlugins[si];
                            upSeat.loadPlugIn(_pg.PlugIn , _pg.File);
                        }
                        this.panel_up.addChild(upSeat, 97);
                        this.mDeskSetMap[data['uid']] = upSeat;
                    }
                    
                }
            }
        }, 

        reset: function () {
            for (var uid in this.mDeskSetMap) {
                var seat = this.mDeskSetMap[uid];
                seat.reset();
            }
        },
    });
    var create3D = function () {
        _GRightSeat     =       MJDeskSeatAddCmp(MJRightSeat,   _GameDeskCfg.Right.V3D.CMP);
        _GSelfSeat      =       MJDeskSeatAddCmp(MJSelfSeat,    _GameDeskCfg.Self.V3D.CMP);
        _GLeftSeat      =       MJDeskSeatAddCmp(MJLeftSeat,    _GameDeskCfg.Left.V3D.CMP);
        _GUpSeat        =       MJDeskSeatAddCmp(MJUpSeat,      _GameDeskCfg.Up.V3D.CMP);

        _GRightSeatRe   =       MJDeskSeatAddCmp(MJRightSeatRe, _GameDeskCfg.Right.VRE.CMP);
        _GSelfSeatRe    =       MJDeskSeatAddCmp(MJSelfSeatRe,  _GameDeskCfg.Self.VRE.CMP);
        _GLeftSeatRe    =       MJDeskSeatAddCmp(MJLeftSeatRe,  _GameDeskCfg.Left.VRE.CMP);
        _GUpSeatRe      =       MJDeskSeatAddCmp(MJUpSeatRe,    _GameDeskCfg.Up.VRE.CMP);

        _GRightPlugins  =       _GameDeskCfg.Right.V3D.PLG;
        _GSelfPlugins   =       _GameDeskCfg.Self.V3D.PLG;
        _GLeftPlugins   =       _GameDeskCfg.Left.V3D.PLG;
        _GUpPlugins     =       _GameDeskCfg.Up.V3D.PLG;

        _GRightRePlugins    =   _GameDeskCfg.Right.VRE.PLG;
        _GSelfRePlugins     =   _GameDeskCfg.Self.VRE.PLG;
        _GLeftRePlugins     =   _GameDeskCfg.Left.VRE.PLG;
        _GUpRePlugins       =   _GameDeskCfg.Up.VRE.PLG;

        
        var root = util.LoadUI(MJBaseResV3D.Desk).node;
        var mDesk = new GameDesk();
        mDesk.initialize(root);
        return mDesk;
    };
    var create2D = function () {
        _GRightSeat     =       MJDeskSeatAddCmp(MJRightSeat2D,       _GameDeskCfg.Right.V2D.CMP);
        _GSelfSeat      =       MJDeskSeatAddCmp(MJSelfSeat2D,        _GameDeskCfg.Self.V2D.CMP);
        _GLeftSeat      =       MJDeskSeatAddCmp(MJLeftSeat2D,        _GameDeskCfg.Left.V2D.CMP);
        _GUpSeat        =       MJDeskSeatAddCmp(MJUpSeat2D,          _GameDeskCfg.Up.V2D.CMP);

        _GRightPlugins  =       _GameDeskCfg.Right.V2D.PLG;
        _GSelfPlugins   =       _GameDeskCfg.Self.V2D.PLG;
        _GLeftPlugins   =       _GameDeskCfg.Left.V2D.PLG;
        _GUpPlugins     =       _GameDeskCfg.Up.V2D.PLG;

        var root = util.LoadUI(MJBaseResV2D.Desk).node;
        var mDesk = new GameDesk();
        mDesk.initialize(root);
        return mDesk;
    };

    var create = function () {
        var mDesk =  GetMJGVCacheV() == MJGVType.V2D ? create2D() : create3D();
        return mDesk;
    };

    var ins = {
        create: create,
        registCfg: registCfg,
    }

    return ins;
}();