/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="mvc-common" />

TestRunner.defineTest('Controller', function(t: Blend.testing.TestRunner) {
    var c = new MyController('my.controller');
    t.isOk(c, 'controller is ok');
    t.isOk(Blend.mvc.Context.getController('my.controller'), 'controller is in context');
    t.done();
});

TestRunner.defineTest('Controller gerRef', function(t: Blend.testing.TestRunner) {

    var app = new Blend.web.Application({
        controller: new MyController(),
        mainView: <ContainerViewConfigInterface> {
            ctype: 'ui.container',
            reference: 'mainView',
            views: [
                <ViewConfigInterface>{
                    ctype: 'ui.rect',
                    reference: 'rect'
                },
                <ViewConfigInterface>{
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