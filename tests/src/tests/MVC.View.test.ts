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
});