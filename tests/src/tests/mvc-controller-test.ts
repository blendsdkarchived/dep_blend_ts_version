/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />
/// <reference path="mvc-common.ts" />

TestRunner.defineTest('Controller', function(t: Blend.testing.TestRunner) {
    var c = new MyController('my.controller');
    t.isOk(c, 'controller is ok');
    t.isOk(Blend.mvc.Context.getController('my.controller'), 'controller is in context');
    t.done();
});

TestRunner.defineTest('Controller gerRef', function(t: Blend.testing.TestRunner) {

    var app = new Blend.web.Application({
        controller: new MyController(),
        mainView: <IContainerViewConfig> {
            ctype: 'ui.container',
            reference: 'mainView',
            views: [
                <IViewConfig>{
                    ctype: 'ui.rect',
                    reference: 'rect'
                },
                <IViewConfig>{
                    ctype: 'ui.rect',
                    reference: 'rect'
                }
            ]
        }
    });

    var controller:MyController = <MyController>app.getAttribute<Array<any>>('controllers')[0];
    t.isTrue(Blend.isInstanceOf(controller.getReferenceEx<Blend.ui.ContainerView>('mainView'),Blend.ui.ContainerView),'mainView ref is correct');

    var ar:Array<any> = controller.getReferenceEx<Array<any>>('rect');
    t.equal(ar.length,2,'rect refs are correct');

    t.done();
});