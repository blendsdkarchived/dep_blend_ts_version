/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />


class LayoutCounterView extends Blend.ui.View {
    public layoutCount = 0;

    protected layoutView() {
        var me = this;
        me.layoutCount++;
    }
}

TestRunner.defineTest('UI.View', function(t: Blend.testing.TestRunner) {

    var view1 = new Blend.ui.View();
    t.isTrue(Blend.isInstanceOf(view1.getElement(), HTMLElement), 'view create HTMLElement');
    t.done();
});

TestRunner.defineTest('View Render & Layout', function(t: Blend.testing.TestRunner) {

    var view = new LayoutCounterView();
    view.performLayout();
    t.equal(view.layoutCount, 0, 'no render not layout');

    t.clearBody();
    t.addToBody(view.getElement());

    t.delay(function() {
        view.performLayout();
        t.equal(view.layoutCount, 1, 'first layout');
        t.done();
    });
});


TestRunner.defineTest('View Visibility', function(t: Blend.testing.TestRunner) {
    var view = new LayoutCounterView();

    t.clearBody();
    t.addToBody(view.getElement());

    t.delay(function() {
        view.performLayout();
        view.setVisible(false);
        t.isFalse(view.isVisible(), 'view hidden');
        view.setVisible(true);
        t.isTrue(view.isVisible(), 'view visible');
        t.equal(view.layoutCount, 2, 'layout count');
        t.done();

    });
});


TestRunner.defineTest('View cssClass', function(t: Blend.testing.TestRunner) {
    var view = new LayoutCounterView();
    t.clearBody(view.getElement());
    t.delay(function() {
        view.setCssClass('test1');
        var c: DictionaryInterface = view.getCssClass();
        t.isOk(c['test1'], 'css class set');
        t.done();
    });
});


TestRunner.defineTest('View initial bounds and property', function(t: Blend.testing.TestRunner) {
    var view = new Blend.ui.Rectangle({
        width: 120,
        height: 120,
        top: 0,
        left: 30,
    });
    t.clearBody(view.getElement());
    t.delay(function() {
        t.equal(view.getBounds().left, 30,'rectangle bounds read');
        t.isFalse(Blend.isNullOrUndef(view.getColor()),'rectangle has color');
        t.done();
    });
});