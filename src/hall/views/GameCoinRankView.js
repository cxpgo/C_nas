var GameCoinRankView = cc.Layer.extend({
    
    ctor: function () {
        this._super();
        var root = util.LoadUI(GameHallJson.GameCoinRankViews).node;
        this.addChild(root);
        this.mPanelRoot = ccui.helper.seekWidgetByName(root, "panel");
        this.mRankCellClone = ccui.helper.seekWidgetByName(root, "rank_cell_clone");
        this.mRankCellClone.setVisible(false);
        this.initView();  
        // this.requestRankData();  
    },
    initView: function () {
        this.mBtnOpen = ccui.helper.seekWidgetByName(this.mPanelRoot, "btn_open");
        this.mBtnClose = ccui.helper.seekWidgetByName(this.mPanelRoot, "btn_close");

        this.mBtnOpen.setVisible(true);
        this.mBtnClose.setVisible(false);
        this.mPanelRoot.x = -(this.mPanelRoot.width);

        this.mBtnOpen.addClickEventListener(this.onOpenEvent.bind(this));
        this.mBtnClose.addClickEventListener(this.onCloseEvent.bind(this));
        
        this.mListRank = ccui.helper.seekWidgetByName(this.mPanelRoot, "listRank"); 
        
    },

    onEnter: function () {
        this._super();
    },

    onOpenEvent: function () {
        this.mPanelRoot.stopAllActions();
        var openAction = cc.sequence(
            cc.moveTo(0.1, cc.p(0 , this.mPanelRoot.y)),
            cc.callFunc(function(){
                this.mBtnOpen.setVisible(false);
                this.mBtnClose.setVisible(true);
            }.bind(this))
        );
        this.mPanelRoot.runAction(openAction);
        this.requestRankData();

    },

    onCloseEvent: function () {
        this.mPanelRoot.stopAllActions();
        var openAction = cc.sequence(
            cc.moveTo(0.1, cc.p(-this.mPanelRoot.width , this.mPanelRoot.y)),
            cc.callFunc(function(){
                this.mBtnOpen.setVisible(true);
                this.mBtnClose.setVisible(false);
            }.bind(this))
        );
        this.mPanelRoot.runAction(openAction);
    },


    requestRankData: function () {
        if(this.mLastReqTime && (Date.now() - this.mLastReqTime) <= 10 * 1000 ) return;
        this.mLastReqTime = Date.now();

        hall.net.getGoldRanking( this.requestRankDataEnd.bind(this) );
        
    },
    requestRankDataEnd:function (rspData) {
        if(rspData.code != 200) return;

        this.mListRank.removeAllItems();
        
        var rankDatas = rspData.data || [];
        var self = this;
        var cellSelfData = {
            uid : hall.user.uid,
            nickName: hall.user.nickName,
            goldNum: hall.user.goldNum || 0,
            headUrl: hall.user.headUrl,
            rank: -1,
        };
        this.mAllRankDatas = [];
        rankDatas.forEach(function(cellData , index) {
            cellData.rank = index + 1; 
            if(cellData.uid == hall.user.uid){
                // self.refreshSelfInfoView(cellData);
                cellSelfData = cellData;
            }
            this.mAllRankDatas.push(cellData);
            // self.appendCellFotRankList(cellData);

        }.bind(this));

        this.schedule(this.updateRankView, 1/30);

        this.refreshSelfInfoView(cellSelfData);
    } ,

    updateRankView: function (dt) {
        if(!this.mAllRankDatas) return;
        var cellData = this.mAllRankDatas[0];
        if(!cellData){
            this.unschedule(this.updateRankView);
            return;
        } 

        this.appendCellFotRankList(cellData);
        this.mAllRankDatas.splice(0 , 1);
    },

    refreshSelfInfoView: function (cellData) {
        var selfCellView = ccui.helper.seekWidgetByName(this.mPanelRoot, "rank_self_cell");

        this.refreshCellInfo(selfCellView , cellData);
        
        var textSelfRank = ccui.helper.seekWidgetByName(selfCellView, "txt_rank");
        var selfRankStr = cellData.rank == -1 ? "未上榜" : cellData.rank;
        textSelfRank.string = selfRankStr;
    },

    appendCellFotRankList: function (cellData) {
        var cellView = this.mRankCellClone.clone();
        cellView.setVisible(true);
        
        var layer = new ccui.Layout();
        layer.setContentSize(cellView.getContentSize());

        this.mListRank.pushBackCustomItem(layer);  
        

        cellView.x = -cellView.width;
        cellView.y = 0;
        
        layer.addChild(cellView);

        var vAction = cc.sequence(
            cc.delayTime((0.1/3)*cellData.rank),
            cc.moveTo(0.1, cc.p(0 , 0))
        );

        cellView.runAction( vAction );

        this.refreshCellInfo(cellView , cellData);
    },

    refreshCellInfo: function (cellView , cellData) {
        var imgHead = ccui.helper.seekWidgetByName(cellView, "sprite_head");
        var img_rankV = ccui.helper.seekWidgetByName(cellView, "img_rankV");
        var fnt_rankV = ccui.helper.seekWidgetByName(cellView, "fnt_rankV");
        var CKBox_cellBg = ccui.helper.seekWidgetByName(cellView, "CKBox_cellBg");
        var txt_name = ccui.helper.seekWidgetByName(cellView, "txt_name");
        var fnt_coinV = ccui.helper.seekWidgetByName(cellView, "fnt_coinV");

        var rankValue = cellData.rank || -1;
        if(img_rankV && fnt_rankV){
            if(rankValue > 3){
                img_rankV.setVisible(false);
                fnt_rankV.setVisible(true);
                fnt_rankV.setString(rankValue);
            }else{
                fnt_rankV.setVisible(false);
                img_rankV.setVisible(true);
                img_rankV.loadTexture("res/GameHall/Resoures/rank/img_no"+rankValue+".png");
            }
        }

        if(CKBox_cellBg){
            if(cellData.uid == hall.user.uid){
                CKBox_cellBg.setSelected(true);
            }else{
                CKBox_cellBg.setSelected(false);
            }
        }

        if(txt_name){
            txt_name.setString(cellData.nickName);
        }

        if(fnt_coinV){
            fnt_coinV.setString( util.convertScore(cellData.goldNum) );
        }

        if(imgHead){
            util.LoadHead(imgHead,cellData.headUrl);
        }

    },

    addToParent: function (parent) {
        parent.addChild(this);
        this.x = 0;
        this.y = parent.height/2;
    },
});

GameCoinRankView.onCreate = function (context) {
    if(!context) return;
    var c = new GameCoinRankView();
    c.addToParent(context);
    return c;
};


