var MJGameLogicBase = GameLogicBase.extend({
    MajhongNumber:14, //手牌数量  14 || 17

    ctor: function (gameStatusCfg) {
        this._super(gameStatusCfg);

        Object.defineProperties(this, {
            "TipRes": {
                get: function () {
                    return this.getMJOptTipRes();
                }
            },
        });
    },
    registerAllEvents: function () {
        qp.event.listen(this, 'mjTableStatus', this.onTableStatus);
        this._super()
    },
    removeAllEvents: function () {
        qp.event.stop(this, 'mjTableStatus');
        this._super();
    },
    initSeatInfo: function (data) {
       
        MajhongInfo.MajhongNumber =data["tableStatus"]["mjNumber"];
        this._super(data);
    },
    uidofPos:function(uid)
    {
        var posArray = [0,1,2,3];

        if (this.person == 2) {
            posArray = [0, 2]
        }

        for(var p in this.seatArray){
            if(uid == this.seatArray[p]['uid']) {
                var position= this.seatArray[p]['position'];
                if(position < this.selfPos)
                {
                    return posArray[posArray.length-this.selfPos + position];
                }else
                {
                    return posArray[position-this.selfPos];
                }
            }
        }
        return null;

    },
    rightSeatInfo: function () {
        var pos =  this.selfPos < 3 ? this.selfPos+1 : 0;
        if(this.person == 2)
        {
            return null;
        }
        // if(this.person == 3)
        // {
        //     pos = this.selfPos < 2 ? this.selfPos+1:0;
        // }

        return this.seatPosInfo(pos);
    },

    upSeatInfo: function () {
        var pos =  this.selfPos < 2 ? this.selfPos+2 : this.selfPos -2;
        if(this.person == 2)
        {
            pos =  this.selfPos == 0 ? 1 : 0;
        }

        if(this.seatPosInfo(pos))
        return this.seatPosInfo(pos);
    },

    leftSeatInfo: function () {
        var pos =  this.selfPos  > 0 ? this.selfPos -1 : 3;
        if(this.person == 2)
        {
            return null;
        }

        return this.seatPosInfo(pos);
    },

    CardsSelectorHelp:function () {
        var UICardsSelector = new MajhongCardsHelp();
        UICardsSelector.showHelp();
    },
    onPlayerExit: function (data) {
        this._super(data);

        if (!this.report && hall.user.uid == data.uid) {

            XYGLogic.net.imRoomId = -1;
            if (cc.sys.isNative) {
                GameLink.onUserLeaveRoom();
            }
			var majHall = new MajhongHall();
            majHall.showHall();
        }
    },

    //Override
    /**
     * 获取MJ操作命令提示资源配置
     * return {}
     */
    getMJOptTipRes: function () {
        return TipRes;
    },
    /**
     * 获取MJ胡类型配置文字
     * return {}
     */
    getMJHuTWorld: function () {
        return XYGLogic.Game.Common.HuWord;
    },
    /**
     * 获取MJ胡类型配置文字
     * return {}
     */
    getMJHuTSound: function () {
        return XYGLogic.Game.Common.HuSound;
    },
    /**
     * 获取MJ先关配置属性
     * @param key {string} 如果可以存在 那么久去Common 下对应的值  否则 返回整个common
     * return {}
     */
    getMJCommon: function (key) {
        if(!XYGLogic.Game.Common){
            JJLog.print("游戏不存在Common 配置！！");
            return;
        }
        if(key){
            return XYGLogic.Game.Common[key];    
        }
        return XYGLogic.Game.Common;
    },
    
});