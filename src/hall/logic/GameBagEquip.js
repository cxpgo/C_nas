var GameBagEquipMgr = function () {
    var logic = cc.Class.extend({
        BagData: [],
        MyBagDataAy: [],
        MyBagDataObj: {},
        MyUseItemData: {},
        ctor: function () {
            this.BagData = [];
            this.MyBagDataAy = [];
            this.MyBagDataObj = {};
            this.MyUseItemData = {};
        },

        release: function () {
            this.removeAllEvents();
        },

        onhallUpdateBag:function (data) {
            this.MyBagDataAy = data;
            for(var i=0;i<data.length;i++)
            {
                this.MyBagDataObj[data[i].id] = data[i];
            }
        },

        onhallUpdateEquip:function (data) {
            this.MyUseItemData = data;
        },

    });
    return XYInstanceClass(logic);
}();