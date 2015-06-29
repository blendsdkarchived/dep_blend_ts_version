/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />


class MyController extends Blend.mvc.Controller {
}

TestRunner.defineTest('MVC', function(t: Blend.testing.TestRunner) {
    t.isOk(Blend.mvc.Context, 'mvc context exist');
    t.done();
});

TestRunner.defineTest('Controller', function(t: Blend.testing.TestRunner) {
    var c = new MyController('my.controller');
    t.isOk(c, 'controller is ok');
    t.isOk(Blend.mvc.Context.getController('my.controller'), 'controller is in context');
    t.done();
});