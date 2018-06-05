/**
 * 这个组件 仅仅为了处理自动出牌的兼容处理
 * 在老版本中 自动花牌有客户端处理
 * 需要再接收到 onNotifyDelCards 是 导致 outArray 管理 处理
 */
var MJCmpAutoOutCard = {
    onNotifyDelCards: function (data) {
        if (data['uid'] != this.uid) return;

        this.setCardInTouchEnable(true);
        this.outArray.push("true");

        //吃牌的时候有几张牌不能打
        if (data['noDel'] != undefined && data['noDel'] != null && this.gangMode < 1) {
            this.chiGray = true;
            var cardArry = data['noDel'];
            for (var i = 0; i < this.cardInArray.length; i++) {
                var card = this.cardInArray[i];
                var key = card.paiOfCard().keyOfPai();
                for (var j = 0; j < cardArry.length; j++) {
                    if (cardArry[j]['type'] + cardArry[j]['value'] == key) {
                        card.showGray();
                    }
                }
            }
        }
    },
}