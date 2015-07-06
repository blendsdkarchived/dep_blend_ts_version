/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />
/// <reference path="UIView.commons.ts" />


TestRunner.defineTest('Container View', function(t: Blend.testing.TestRunner) {
    var cview = new UITestContainerView();
    t.clearBody(cview.getElement());
    t.delay(function() {
        t.isOk(cview);
        var el: HTMLElement = cview.getElement();
        var cls: any = Blend.Dom.cssClass(el);
        t.isOk(cls['b-container-layout'], 'container layout set');
        t.done();
    })
});

TestRunner.defineTest('Container Children', function(t: Blend.testing.TestRunner) {

    var view1 = new UITestContainerView();
    var c: Blend.ui.View;

    ///// STRING
    view1.addChild('ui.rect');
    t.equal(view1.getChildren().length, 1, 'string child added');

    c = view1.getChildren()[0];
    t.isTrue(Blend.isInstanceOf(c, Blend.ui.Rectangle), 'string child is of correct type');

    ///// RECT INST
    view1.addChild(new Blend.ui.Rectangle());
    t.equal(view1.getChildren().length, 2, 'inst child added');

    c = view1.getChildren()[1];
    t.isTrue(Blend.isInstanceOf(c, Blend.ui.Rectangle), 'inst child is of correct type');

    ///// COMPONENT CONFIG
    view1.addChild({
        ctype: 'ui.rect'
    });
    t.equal(view1.getChildren().length, 3, 'cc child added');

    c = view1.getChildren()[2];
    t.isTrue(Blend.isInstanceOf(c, Blend.ui.Rectangle), 'cc child is of correct type');

    t.done();

});

TestRunner.defineTest('Container filter and children by config', function(t: Blend.testing.TestRunner) {

    var visibleChildren = function(view: Blend.ui.View, index: number) {
        return view.isVisible() === true;
    }

    var list: Array<Blend.ui.View> = [];
    var cntr = new UITestContainerView({
        children: [
            'ui.rect',
            new Blend.ui.Rectangle({
                reference: 'ref1'
            }),
            {
                ctype: 'ui.rect',
                visible: false
            }
        ]
    });

    t.equal(cntr.getChildren().length, 3, 'children added by config');
    //////////////////////////////////////////////

    list = cntr.getChildren(visibleChildren);
    t.equal(list.length, 2);
    t.equal(list[1].getReference(), 'ref1', 'correct children filtered');

    t.done();

});

TestRunner.defineTest('Container rendred', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        children: [
            'ui.rect',
            'ui.rect',
            'ui.rect'
        ]
    });

    t.clearBody(cntr.getElement());

    t.delay(function() {
        var el = cntr.getElement();
        t.equal(el.childNodes.length, 1, 'container=>body');
        t.equal(el.childNodes[0].childNodes.length, 1, 'container=>body=>content');
        t.equal(el.childNodes[0].childNodes[0].childNodes.length, 3, 'container=>body=>content=>3x rect');
        t.done();
    });

});


TestRunner.defineTest('Container destroy', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        children: [
            'ui.rect',
            'ui.rect',
            'ui.rect'
        ]
    });

    t.clearBody(cntr.getElement());

    t.delay(function() {

        cntr.destroy();
        t.equal(document.body.children.length, 0, 'container destroyed');
        t.done();

    });

});


TestRunner.defineTest('Container removeChild', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        children: [
            'ui.rect',
            'ui.rect',
            'ui.rect'
        ]
    });

    t.clearBody(cntr.getElement());

    t.delay(function() {
        var el = cntr.getElement();
        cntr.removeChild(1);
        t.equal(cntr.getChildren().length, 2, 'child removed');
        t.equal(el.childNodes[0].childNodes[0].childNodes.length, 2, 'container=>body=>content=>2x rect remained');
        t.done();
    });

});


TestRunner.defineTest('Container addChild', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        children: [
            'ui.rect',
            'ui.rect'
        ]
    });

    t.clearBody(cntr.getElement());
    
    cntr.addChild('ui.rect');

    t.delay(function() {
        var el = cntr.getElement();
        t.equal(el.childNodes[0].childNodes[0].childNodes.length, 3, '1x child added after render');
        t.done();
    });

});
