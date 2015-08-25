/// <reference path="../TestFramework.ts" />
TestRunner.defineTest('spacer', function(t: Blend.testing.TestRunner) {
    var el = new Blend.ui.widget.Spacer().getElement();
    t.equal(el.getAttribute('class'),'b-spacer','spacer created');
    t.done();

});