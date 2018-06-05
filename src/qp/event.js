qp.event = {
    bind: function (events) { // 绑定事件源
        qp.event.listeners = qp.event.listeners || [],
            qp.event.events = qp.event.events || [];

        for (var i = 0; i < qp.event.events.length; i++) {
            if (qp.event.events[i] == events)
                return;
        }

        qp.event.events.push(events);

        for (var p in events) {
            window.pomelo.on(p, events[p]);
        }
    },

    listen: function (target, evt, cb) {
        var listener = {evt: evt, target: target, cb: cb.bind(target)};

        for (var i = 0; i < qp.event.listeners.length; i++) {
            if (qp.event.listeners[i].target == target && qp.event.listeners[i].evt == evt) {
                return;
            }
        }
        qp.event.listeners.push(listener);
    },

    stop: function (target, evt) {
        for (var i = 0; i < qp.event.listeners.length; i++) {
            if (qp.event.listeners[i].target == target && qp.event.listeners[i].evt == evt) {
                qp.event.listeners.splice(i, 1);
                return;
            }
        }
    },

    send: function (evt, msg , oth) {
        JJLog.print('event:', evt, msg);
        var str = evt.substring(0,3);
        if(str != 'app')
            DecodeYQGRes(msg);
        for (var i = 0; i < qp.event.listeners.length; i++) {
            if (qp.event.listeners[i].evt == evt)
                qp.event.listeners[i].cb(msg , oth);
        }
    }
}

qp.event.listeners = [];
qp.event.events = [];
