/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />

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