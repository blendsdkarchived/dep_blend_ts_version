/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />
/// <reference path="ui-view-commons.ts" />

TestRunner.defineTest('Container View Scroll None', function(t: Blend.testing.TestRunner) {
    var cview = new UITestContainerView({
        allowScroll: eScroll.None
    });
    t.clearBody(cview.getElement());
    cview.performLayout();
    t.delay(function() {
        var el: HTMLElement = cview.getAttribute<Blend.ui.widget.Widget>('vScrollbar').getElement();
        t.isOk(cview);
        t.isOk(el, 'scrollers added');
        t.equal(el.style.getPropertyValue('display'), 'none', 'eScroll.None is set correctly');
        t.done();
    });
});

TestRunner.defineTest('Container View Scroll Auto', function(t: Blend.testing.TestRunner) {
    var cview = new UITestContainerView({
        allowScroll: eScroll.Auto,
        width: 400,
        height: 400
    });
    t.clearBody(cview.getElement());
    cview.performLayout();
    t.delay(function() {
        var vel: HTMLElement = cview.getAttribute<Blend.ui.widget.Widget>('vScrollbar').getElement();

        var b1 = Blend.Dom.getStyle(vel, ['top', 'left', 'width', 'height']);
        t.equal(b1, { top: 0, left: 388, width: 12, height: 400 }, 'vscroller positioned correctly');


        var hel: HTMLElement = cview.getAttribute<Blend.ui.widget.Widget>('hScrollbar').getElement();
        var b2 = Blend.Dom.getStyle(hel, ['top', 'left', 'width', 'height']);
        t.equal(b2, { top: 388, left: 0, width: 400, height: 12 }, 'hscroller positioned correctly');

        t.done();
    });
});


TestRunner.defineTest('Container View Scroll FixedVertical', function(t: Blend.testing.TestRunner) {
    var cview = new UITestContainerView({
        allowScroll: eScroll.FixedVertical,
        width: 400,
        height: 400
    });
    t.clearBody(cview.getElement());
    cview.performLayout();
    t.delay(function() {
        var el: HTMLElement = cview.getAttribute<HTMLElement>('bodyContentElement');
        var b = Blend.Dom.getStyle(el, ['top', 'left', 'width', 'height']);
        t.equal(b, { top: 0, left: 0, width: 388, height: 400 }, 'fixed vertical scroller is ok');
        t.done();
    });
});


TestRunner.defineTest('Container View Scroll FixedHorizontal', function(t: Blend.testing.TestRunner) {
    var cview = new UITestContainerView({
        allowScroll: eScroll.FixedHorizontal,
        width: 400,
        height: 400
    });
    t.clearBody(cview.getElement());
    cview.performLayout();
    t.delay(function() {
        var el: HTMLElement = cview.getAttribute<HTMLElement>('bodyContentElement');
        var b = Blend.Dom.getStyle(el, ['top', 'left', 'width', 'height']);
        t.equal(b, { top: 0, left: 0, width: 400, height: 388 }, 'fixed horizontal scroller is ok');
        t.done();
    });
});


TestRunner.defineTest('Container View Scroll FixedBoth', function(t: Blend.testing.TestRunner) {
    var cview = new UITestContainerView({
        allowScroll: eScroll.FixedBoth,
        width: 400,
        height: 400
    });
    t.clearBody(cview.getElement());
    cview.performLayout();
    t.delay(function() {
        var el: HTMLElement = cview.getAttribute<HTMLElement>('bodyContentElement');
        var b = Blend.Dom.getStyle(el, ['top', 'left', 'width', 'height']);
        t.equal(b, { top: 0, left: 0, width: 388, height: 388 }, 'fixed both scroller is ok');
        t.done();
    });
});

TestRunner.defineTest('Container View Scroll TrackSize', function(t: Blend.testing.TestRunner) {

    var cview = new UITestContainerView({
        allowScroll: eScroll.FixedBoth,
        width: 400,
        height: 400,
        views: UITestUtils.createRects(20)
    });
    t.clearBody(cview.getElement());

    Blend.Dom.setStyle(cview.getElement(), {
        position: 'absolute',
        top: 50,
        left: 60
    });

    cview.performLayout();
    (<any>window)['xtest'] = function(w:number,h:number) {
        cview.setBounds({
            width:w,
            height:h
        });
    }

    t.delay(function() {
        var el: HTMLElement = cview.getAttribute<HTMLElement>('bodyContentElement');
        var b = Blend.Dom.getStyle(el, ['top', 'left', 'width', 'height']);
        t.equal(b, { top: 0, left: 0, width: 388, height: 388 }, 'fixed both scroller is ok');
        t.done();
    });
});