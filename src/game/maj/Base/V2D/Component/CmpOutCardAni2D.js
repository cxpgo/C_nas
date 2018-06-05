
/**
 * 用于在2D View上 简化 Seat 操作的动画效果
 * 如果在其他的游戏上 动画效果发生改变  就可以同样的方式重写putOutCard
 */
var MJCmpOutCardAni2D = {
    //Override
    putOutCard: function (data) {
        var _this = this;
        var outCard = MJMyCard.create2D(this, data["msg"], true);
        outCard.setScale(1.1);
        outCard.setPosition(this.posCenterCardOut);
        this.panel_cardOut.addChild(outCard, 200);
        sound.playCardDown();
        cc.setTimeout(function () {
            var soundData = {};
            soundData['cardType'] = _this.cardOfString(data["msg"]);
            soundData['userSex'] = _this.sexType;
            sound.playCard(soundData);
        }.bind(this), 100);
        
        var card = this.addCardOut(data["msg"]);
        card.setVisible(false);
        outCard.runAction(cc.sequence(cc.delayTime(CommonParam.ShowDelayTime),
            
            cc.delayTime(0.1),
            cc.callFunc(function () {
                this.removeFromParent();
                card.setVisible(true);
                card.runIndicator();
            }.bind(outCard))));

        return;
    }
}