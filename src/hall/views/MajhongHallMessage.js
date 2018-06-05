/**
 * Created by snoy on 2016/11/10.
 */
var MajhongHallMessage = cc.Layer.extend({
    btn_back:null,
    image_list:null,
    msg_view:null,
    msg_text:null,
    checkbox_zuobi :null,
    checkbox_dubo :null,
    panel_zuobi :null,
    panel_dubo :null,
    zuobi :1,
    dubo :0,

    ctor:function()
    {
        JJLog.print('消息界面222');
        this._super();
        var root = util.LoadUI("res/GameHall/MajhongHallMessage.json").node;
        this.addChild(root);
        this.image_list = ccui.helper.seekWidgetByName(root,"image_list");
        this.msg_view = ccui.helper.seekWidgetByName(root,"msg_view");
        this.msg_view.setTouchEnabled(true);
        this.msg_text = ccui.helper.seekWidgetByName(root,"msg_text");
        this.btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
        this.btn_back.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));

        this.checkbox_zuobi = ccui.helper.seekWidgetByName(root,"checkbox_zuobi");
        this.checkbox_zuobi.setSelected(true);
        this.checkbox_zuobi.setTouchEnabled(false);

        this.checkbox_dubo = ccui.helper.seekWidgetByName(root,"checkbox_dubo");
        this.checkbox_dubo.setSelected(false);
        this.checkbox_dubo.setTouchEnabled(false);

        this.panel_zuobi = ccui.helper.seekWidgetByName(root,"panel_zuobi");
        this.panel_zuobi.setTouchEnabled(true);
        var clickData1 = {};
        clickData1['this'] = this;
        clickData1['obj'] = this.panel_zuobi;
        this.panel_zuobi.addClickEventListener(this.onClickEvent.bind(clickData1));

        this.panel_dubo = ccui.helper.seekWidgetByName(root,"panel_dubo");
        this.panel_dubo.setTouchEnabled(true);
        var clickData2 = {};
        clickData2['this'] = this;
        clickData2['obj'] = this.panel_dubo;
        this.panel_dubo.addClickEventListener(this.onClickEvent.bind(clickData2));
    },

    onEnter: function () {
        this._super();

        this.showHallMsg();
    },

    onClickEvent:function()
    {
        var obj = this['obj'];
        var _this = this['this'];
        switch (obj)
        {
            case _this.panel_zuobi:
            {
                _this.zuobi = 1;
                _this.dubo = 0;

                _this.showHallMsg();
            }
                break;
            case _this.panel_dubo:
            {
                _this.zuobi = 0;
                _this.dubo = 1;

                _this.showHallMsg();
            }
                break;
        }
    },

    showHallMsg:function(){
        JJLog.print('消息界面111:');

        var text = "";

        if(this.zuobi == 1)
        {
            JJLog.print('作弊:');
            this.checkbox_zuobi.setSelected(true);
            this.checkbox_dubo.setSelected(false);
            this.panel_zuobi.setTouchEnabled(false);
            this.panel_dubo.setTouchEnabled(true);

            if (!cc.sys.isNative){
                //WEB 进来 真机进不来
                text = cc.loader._loadTxtSync("res/MajhongLocalMessage.json");
            }else{
                if(jsb.fileUtils.getFileSize(jsb.fileUtils.getWritablePath() + "res/MajhongLocalMessage.json") > 0 )
                {
                    text = jsb.fileUtils.getStringFromFile(jsb.fileUtils.getWritablePath() + "/res/MajhongLocalMessage.json");
                }else
                {
                    text = jsb.fileUtils.getStringFromFile("MajhongLocalMessage.json");
                }
            }
        }else if (this.dubo == 1)
        {
            JJLog.print('赌博:');
            this.checkbox_zuobi.setSelected(false);
            this.checkbox_dubo.setSelected(true);
            this.panel_zuobi.setTouchEnabled(true);
            this.panel_dubo.setTouchEnabled(false);
            if (!cc.sys.isNative){
                //WEB 进来 真机进不来
                text = cc.loader._loadTxtSync("res/MajhongLocalMessageTwo.json");
            }else{
                if(jsb.fileUtils.getFileSize(jsb.fileUtils.getWritablePath() + "res/MajhongLocalMessageTwo.json") > 0 )
                {
                    text = jsb.fileUtils.getStringFromFile(jsb.fileUtils.getWritablePath() + "/res/MajhongLocalMessageTwo.json");
                }else
                {
                    text = jsb.fileUtils.getStringFromFile("MajhongLocalMessageTwo.json");
                }
            }

        }


        this.msg_text.setString(text);
    },

    showMsg:function()
    {
        JJLog.print('消息界面000');
        var scene = new cc.Scene();
        scene.addChild(this);
        if(cc.sys.isNative)
        {
            cc.director.replaceScene(scene);
        }else
        {
            cc.director.runScene(scene);
        }
    },



});