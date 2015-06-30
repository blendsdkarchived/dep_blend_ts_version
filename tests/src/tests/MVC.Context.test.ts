/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />
/// <reference path="MVC.common.ts" />

TestRunner.defineTest('MVC', function(t: Blend.testing.TestRunner) {
    t.isOk(Blend.mvc.Context, 'mvc context exist');
    t.done();
});