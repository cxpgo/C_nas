/**
 * Created by snoy on 2016/11/10.
 */
var MajhongXieyi = cc.Layer.extend({
    btn_back:null,
    image_list:null,
    msg_view:null,

    img_content:null,

    ctor:function()
    {

        this._super();
        var JsonRes = GameHallJson.Xieyi;
        var root = util.LoadUI(JsonRes).node;
        this.addChild(root);
        this.image_list = ccui.helper.seekWidgetByName(root,"image_list");
        this.msg_view = ccui.helper.seekWidgetByName(root,"msg_view");
        this.msg_view.setTouchEnabled(true);
        this.img_content = ccui.helper.seekWidgetByName(root,"Image_content");
        this.btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
        this.btn_back.addClickEventListener(function () {
            //var hall2 = new MajhongHall();
            //hall2.showHall();
            this.removeFromParent();
        }.bind(this));
        this.btn_back.addTouchEventListener(util.btnTouchEvent);


        this.showHallMsg();

    },

    onEnter: function () {
        this._super();
    },

    showHallMsg:function(){
        // this.msg_text.setString(text);
        // this.msg_text.setTextAreaSize(this.msg_text.getAutoRenderSize());
        //JJLog.print('消息界面000'+this.msg_text.getAutoRenderSize().width +"--"+this.msg_text.getAutoRenderSize().height);
        // this.msg_view.setInnerContainerSize(cc.size(this.msg_view.getContentSize().width,this.msg_text.getAutoRenderSize().height));
        // this.msg_text.setPosition(cc.p(this.msg_text.getPositionX(),this.msg_text.getAutoRenderSize().height));

        this.msg_view.setInnerContainerSize(cc.size(this.img_content.getContentSize().width,this.img_content.getContentSize().height));
        this.img_content.setPosition(cc.p(this.img_content.getPositionX(),this.img_content.getContentSize().height));
    },

    showHelp:function()
    {

        JJLog.print('消息界面000');
        cc.director.getRunningScene().addChild(this);
        //var scene = new cc.Scene();
        //scene.addChild(this);
        //if(cc.sys.isNative)
        //{
        //    cc.director.replaceScene(scene);
        //}else
        //{
        //    cc.director.runScene(scene);
        //}
    },

});
