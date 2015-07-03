/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />
/// <reference path="UIView.commons.ts" />

TestRunner.defineTest('UI.View', function(t: Blend.testing.TestRunner) {

    var view1: Blend.ui.View;
    t.not_throws_exception(function() {
        view1 = new Blend.ui.View({
            layout: {
                ctype: 'default'
            }
        });
    }, 'create view happy flow')
    t.isOk(view1, 'happy flow ok');
    /////////////////////////////////////

    var view2: Blend.ui.View;
    t.not_throws_exception(function() {
        view2 = new Blend.ui.View();
    }, 'no layout defined')
    t.isOk(view2, 'no layout defined ok');
    ////////////////////////////////////


    var v = new UITestView();

    t.clearBody();
    t.addToBody(v.getElement());

    t.delay(function() {

        var el = v.getElement();
        t.equal(el.getAttribute('class'), 'b-default-layout', 'default layout added');

        console.log(v.getBounds());

        t.done();
    });

});

TestRunner.defineTest('View Render & Layout', function(t: Blend.testing.TestRunner) {
    var view = new UITestView();

    view.performLayout();
    t.equal(view.layoutCount,0,'no render nor layout');

    t.clearBody();
    t.addToBody(view.getElement());

   t.delay(function(){
       view.performLayout();
       t.equal(view.layoutCount,1,'first layout');
       t.done();
   });
});

TestRunner.defineTest('View Visibility', function(t: Blend.testing.TestRunner) {
    var view = new UITestView();

    t.clearBody();
    t.addToBody(view.getElement());

   t.delay(function(){

       view.performLayout();

       view.setVisible(false);
       t.isFalse(view.isVisible(),'view hidden');

       view.setVisible(true);
       t.isTrue(view.isVisible(),'view visible');

       t.equal(view.layoutCount,1,'layout');

       t.done();

   });
});