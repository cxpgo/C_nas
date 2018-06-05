// var BaiShanGameDesk = function () {
//     var _GRightSeat = null;
//     var _GSelfSeat = null;
//     var _GLeftSeat = null;
//     var _GUpSeat = null;

//     var _GRightSeatRe = null;
//     var _GSelfSeatRe = null;
//     var _GLeftSeatRe = null;
//     var _GUpSeatRe = null;

//     var GameDesk = cc.Layer.extend({
//         panel_up: null,
//         panel_left: null,
//         panel_player: null,
//         panel_right: null,
//         upCards: null,
//         mDeskSetMap: null,
//         delegate: null,
//         initialize: function (root) {
//             this.addChild(root);
//             this.mDeskSetMap = {};
//             this.panel_up = ccui.helper.seekWidgetByName(root, "panel_up");
//             this.panel_left = ccui.helper.seekWidgetByName(root, "panel_left");

//             this.panel_player = ccui.helper.seekWidgetByName(root, "panel_player");
//             this.panel_right = ccui.helper.seekWidgetByName(root, "panel_right");
//         },

//         setDelegate: function (deg) {
//             this.delegate = deg;
//         },

//         onEnter: function () {
//             this._super();
//             this.update();
//         },

//         getByUID: function (uid) {
//             return this.mDeskSetMap[uid]
//         },

//         update: function () {
//             if (MajhongInfo.GameMode == GameMode.PLAY) {
//                 if (!!hall.getPlayingGame().table.selfSeatInfo()) {
//                     var data = hall.getPlayingGame().table.selfSeatInfo();
//                     if(!this.mDeskSetMap[data['uid']]){
//                         var selfseat = new _GSelfSeat(data);
                        

//                         //selfseat.loadPlugIn(MJPlugInDingQue);
//                         //selfseat.loadPlugIn(MJPlugInHuan3);
//                         selfseat.loadPlugIn(MJPlugInTiongTips);
//                         selfseat.loadPlugIn(MJPlugInControl);

//                         this.panel_player.addChild(selfseat, 100);
//                         this.mDeskSetMap[data['uid']] = selfseat;

//                         var selfInfo = hall.getPlayingGame().table.getCardByPlayer(data.uid)

//                         // if (XYGLogic.table.status == BaiShanGameStatus.HUANSAN && selfInfo["huan3Pai"].length == 0) {
//                         //     qp.event.send('mjHuan3Start', {});
//                         // }
//                         // if (XYGLogic.table.status == BaiShanGameStatus.DINGQUE && selfInfo['dingQue'] == "") {
//                         //     qp.event.send('mjDingQueStart', {});
//                         // }
//                     }
//                     else{
//                         this.mDeskSetMap[data['uid']].reset();
//                     }
//                 }
//                 if (!!hall.getPlayingGame().table.rightSeatInfo()) {
//                     var data = hall.getPlayingGame().table.rightSeatInfo();
//                     if(!this.mDeskSetMap[data['uid']]){
//                         var rightSeat = new _GRightSeat(data);
//                         this.panel_right.addChild(rightSeat, 99);
//                         this.mDeskSetMap[data['uid']] = rightSeat;
//                     }
//                     else{
//                         this.mDeskSetMap[data['uid']].reset();
//                     }
//                 }
//                 if (!!hall.getPlayingGame().table.leftSeatInfo()) {
//                     var data = hall.getPlayingGame().table.leftSeatInfo();
//                     if(!this.mDeskSetMap[data['uid']]){
//                         var leftSeat = new _GLeftSeat(data);
//                         this.panel_left.addChild(leftSeat, 98);
//                         this.mDeskSetMap[data['uid']] = leftSeat;
//                     }
//                     else{
//                         this.mDeskSetMap[data['uid']].reset();
//                     }
//                 }
//                 if (!!hall.getPlayingGame().table.upSeatInfo()) {
//                     var data = hall.getPlayingGame().table.upSeatInfo();
//                     if(!this.mDeskSetMap[data['uid']]){
//                         var upSeat = new _GUpSeat(data);
//                         this.panel_up.addChild(upSeat, 97);
//                         this.mDeskSetMap[data['uid']] = upSeat;
//                     }else{
//                         this.mDeskSetMap[data['uid']].reset();
//                     }
                    
//                 }
//             } else if (MajhongInfo.GameMode == GameMode.RECORD) {

//                 var data = XYGLogic.record.selfHandCards;
//                 var selfseat = new _GSelfSeatRe(data);
//                 this.panel_player.addChild(selfseat, 100);
//                 this.mDeskSetMap[data['uid']] = selfseat;

//                 if (hall.getPlayingGame().record.rightHandCards != null) {
//                     var data = XYGLogic.record.rightHandCards;
//                     var rightSeat = new _GRightSeatRe(data);
//                     this.panel_right.addChild(rightSeat, 99);
//                     this.mDeskSetMap[data['uid']] = rightSeat;
//                 }

//                 if (hall.getPlayingGame().record.leftHandCards != null) {
//                     var data = XYGLogic.record.leftHandCards;
//                     var leftSeat = new _GLeftSeatRe(data);
//                     this.panel_left.addChild(leftSeat, 98);
//                     this.mDeskSetMap[data['uid']] = leftSeat;
//                 }

//                 if (hall.getPlayingGame().record.upHandCards != null) {

//                     var data = XYGLogic.record.upHandCards;
//                     var upSeat = new _GUpSeatRe(data);
//                     this.panel_up.addChild(upSeat, 97);
//                     this.mDeskSetMap[data['uid']] = upSeat;
//                 }
//             }
//         }

//     });
//     var create3D = function () {
//         _GRightSeat = MJRightSeat;
//         _GSelfSeat = MJSelfSeat;
//         _GLeftSeat = MJLeftSeat;
//         _GUpSeat = MJUpSeat;

//         _GRightSeatRe = MJRightSeatRe;
//         _GSelfSeatRe = MJSelfSeatRe;
//         _GLeftSeatRe = MJLeftSeatRe;
//         _GUpSeatRe = MJUpSeatRe;
        
//         var root = util.LoadUI(MJBaseResV3D.Desk).node;
//         var mDesk = new GameDesk();
//         mDesk.initialize(root);
//         return mDesk;
//     };
//     var create2D = function () {
//         _GRightSeat = MJRightSeat2D;
//         _GSelfSeat = MJSelfSeat2D;
//         _GLeftSeat = MJLeftSeat2D;
//         _GUpSeat = MJUpSeat2D;

//         _GRightSeatRe = MJRightSeatRe;
//         _GSelfSeatRe = MJSelfSeatRe;
//         _GLeftSeatRe = MJLeftSeatRe;
//         _GUpSeatRe = MJUpSeatRe;

//         var root = util.LoadUI(MJBaseResV2D.Desk).node;
//         var mDesk = new GameDesk();
//         mDesk.initialize(root);
//         return mDesk;
//     };

//     var create = function () {
//         var mDesk =  GetMJGVCacheV() == MJGVType.V2D ? create2D() : create3D();
//         return mDesk;
//     };
//     var ins = {
//         create: create
//     }

//     return ins;
// }();


MJBaiShan.DeskCfg =  {
    Self: {
        V2D :   {
            CMP : [
                MJCmpAutoOutCard,
            ],
            PLG : [
                {
                    PlugIn: MJPlugInTiongTips,
                },
                {
                    PlugIn: MJPlugInControl,
                },
            ],
        },
        V3D :   {
            CMP : [
                MJCmpAutoOutCard,
            ],
            PLG : [
                {
                    PlugIn: MJPlugInTiongTips,
                },
                {
                    PlugIn: MJPlugInControl,
                },
            ],
        },
    },
};
