/// <reference path="../TestFramework" />
TestRunner.defineTest('spacer', function(t: Blend.testing.TestRunner) {
    var el = new Blend.ui.Spacer().getElement();
    t.equal(el.getAttribute('class'),'b-spacer','spacer created');
    t.done();

});