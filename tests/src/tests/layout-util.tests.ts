/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="ui-view-commons" />


TestRunner.defineTest('LayoutUtil-Fit', function(t: Blend.testing.TestRunner) {

    t.isOk(Blend.LayoutUtil, 'layout util exists');

    var el = Blend.Dom.createElement({
        style: {
            width: 200,
            height: 200,
            top: 0,
            left: 0,
            position: 'absolute',
            'background-color': 'silver'
        }
    });

    t.clearBody(el);

    var view = new UITestView();
    el.appendChild(view.getElement())
    view.performLayout();
    Blend.LayoutUtil.fitElement(view.getElement());

    t.delay(function() {
        var bounds = view.getBounds();
        t.equal(bounds, { width: 200, height: 200, top: 0, left: 0 });
        t.done();
    });

});


TestRunner.defineTest('LayoutUtil-Center', function(t: Blend.testing.TestRunner) {

    t.isOk(Blend.LayoutUtil, 'layout util exists');

    var el = Blend.Dom.createElement({
        style: {
            width: 200,
            height: 200,
            top: 0,
            left: 0,
            position: 'absolute',
            'background-color': 'silver'
        }
    });

    t.clearBody(el);

    var view = new UITestView();
    el.appendChild(view.getElement())
    view.performLayout();
    view.setBounds({
        width: 50,
        height: 50
    });
    Blend.LayoutUtil.centerElement(view.getElement());

    t.delay(function() {
        var bounds = view.getBounds();
        t.equal(bounds, { top: 100, left: 100, width: 50, height: 50 }, 'element centered');
        t.done();
    });

});