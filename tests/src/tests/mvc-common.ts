/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />

class MyController extends Blend.mvc.Controller {
    getReferenceEx<T>(name: string): T {
        return this.getReference.apply(this, arguments);
    }
}

class BadView extends Blend.mvc.View {
}

class BadView2 extends Blend.mvc.View {
    setTitle() {

    }
}

class TestView extends Blend.mvc.View {

    tFireEvent(eventName: string, ...args: any[]) {
        this.fireEvent.apply(this, arguments);
    }
}

class PrivateController extends Blend.mvc.Controller {
    constructor() {
        var me = this;
        super();
        me.on('view.test1', function(sender: Blend.Component, value: any) {
            sender.setAttribute('test1', value);
        });
    }
}