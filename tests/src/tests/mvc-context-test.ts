/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="mvc-common" />

TestRunner.defineTest('MVC', function(t: Blend.testing.TestRunner) {
    t.isOk(Blend.mvc.Context, 'mvc context exist');
    t.done();
});