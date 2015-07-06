/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />

TestRunner.defineTest('Environment', function(t: Blend.testing.TestRunner) {
    var kickstarted = false;
    Blend.Environment.ready(function(){
        kickstarted = true;
    });
    Blend.Environment.kickStart();
    t.delay(function(){
        t.isTrue(kickstarted,'ready works');
        t.done();
    });
});