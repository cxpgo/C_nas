var XYGLogic = function () {

    var TableClass = null;
    var RecordeClass = null;

    var logic = {

        initialize : function (tc){
            if(TableClass){
                this.release();
            }
            TableClass = tc;
            this.Table = tc.Instance;
            this.Table.initialize();
        },

        _initialize : function (tc){
            if(RecordeClass){
                this.release();
            }
            RecordeClass = tc;
            this.Record = tc.Instance;
        },
        
        release : function () {
            if(TableClass)
            TableClass.release();
            TableClass = null;
            if(RecordeClass)
                RecordeClass.release();
            RecordeClass = null;
        }
    
    };
    
    Object.defineProperties(logic, {
        "Table": {
            get: function () {
                return hall.getPlayingGame().table;
            },
            set: function (table) {
                hall.getPlayingGame().table = table;
            }
        },
        "Record": {
            get: function () {
                return hall.getPlayingGame().record;
            },
            set: function (record) {
                hall.getPlayingGame().record = record;
            }
        },
        "Net": {
            get: function () {
                return hall.getPlayingGame().net;
            }
        },

        "table": {
            get: function () {
                return hall.getPlayingGame().table;
            }
        },
        "Instance": {
            get: function () {
                return hall.getPlayingGame().table;
            }
        },
        "net": {
            get: function () {
                return hall.getPlayingGame().net;
            }
        },
        "record": {
            get: function () {
                return hall.getPlayingGame().record;
            }
        },
        //当前游戏运行的命名空间
        //如果存在就返回 ， 不存在返回空表
        "Game": {
            get: function () {
                return hall.getPlayingGame();
            }
        }
    });
    
    
    return logic;
}();
