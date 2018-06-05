
var ClockStat = {
    CS_NONE: 0,
    CS_CUTDOWN: 1,
    CS_STOP: 2,
};

var ClockCtrl = cc.Node.extend({

    ctor: function(root) {
        this._super();
        this.node = root;
        this.labelClock =  ccui.helper.seekWidgetByName(root, "text_time");
        this.stat = ClockStat.CS_NONE;

        this.node.setVisible(false);
    },

    countDown: function(name, timeInSec, timeOutHandler) {
        if (this.stat === ClockStat.CS_CUTDOWN) {
            return;
        }
        this.name = name;
        this.timeOutHandler = timeOutHandler;

        this.stat = ClockStat.CS_CUTDOWN;
        this.currTime = timeInSec;
        this.labelClock.string = timeInSec;
        this.node.stopAllActions();
        this.node.rotation = 0;
        this.schedule(this.onTimer, 1);

        this.node.setVisible(true);
    },

    onTimer: function() {
        this.currTime--;
        this.currTime = Math.max(this.currTime, 0);
        this.labelClock.string = this.currTime;
        
        this.node.stopAllActions();
        this.node.rotation = 0;
        if (this.currTime <= 5) {
            this.node.stopAllActions();
            this.node.runAction(cc.sequence(
                cc.rotateTo(0.1, -10),
                cc.rotateTo(0.1, 10),
                cc.rotateTo(0.1, -10),
                cc.rotateTo(0.1, 10),
                cc.rotateTo(0.1, -10),
                cc.rotateTo(0.1, 10),
                cc.rotateTo(0.1, -10),
                cc.rotateTo(0.1, 10),
                cc.rotateTo(0.1, -10),
                cc.rotateTo(0.1, 0)
            ));
        }

        if (this.currTime === 0) {
            this.timeOutHandler && this.timeOutHandler(this.name, this);
            this.stop();
        }
    },

    stop: function() {
        this.stat = ClockStat.CS_STOP;
        this.timeOutHandler = null;
        this.unschedule(this.onTimer);
        if(this.node) {
            this.node.setVisible(false);
        }
    },
});