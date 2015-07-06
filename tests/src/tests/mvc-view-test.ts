/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />
/// <reference path="MVC.common.ts" />

TestRunner.defineTest('View', function(t: Blend.testing.TestRunner) {
    var v = new Blend.mvc.View();
    t.isOk(v);

    t.throws_exception(function() {
        var v1 = new Blend.mvc.View({
            bindings: {
                'title': 'modelfield'
            }
        });
    }, 'invalid binding');

    t.throws_exception(function() {
        var v1 = new BadView({
            bindings: {
                'title': 'model.field'
            }
        });
    }, 'has no setter')

    t.throws_exception(function() {
        var v1 = new BadView2({
            bindings: {
                'title': 'model.field'
            }
        });
    }, 'no model')

    t.done();

    //////////////////////////////////////////

});

TestRunner.defineTest('ViewControllerChain', function(t: Blend.testing.TestRunner) {

    var view1 = new TestView({
        reference: 'view1'
    });

    t.not_throws_exception(function() {
        view1.tFireEvent('test');
    }, 'event fired, has reference but no parent');
    //////////////////////////////////////////////

    var view2 = new TestView({
        reference:'view',
        controllers:[
            new PrivateController()
        ]
    });

    view2.tFireEvent('test1','arg1');

    t.delay(function(){
       t.equal(view2.getAttribute('test1'),'arg1','event fired and controller handeled');
       t.done();
    });
});