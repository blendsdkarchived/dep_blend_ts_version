/// <reference path="../../typings/blend.d.ts" />
/// <reference path="../TestFramework.ts" />
/// <reference path="ui-view-commons.ts" />


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

TestRunner.defineTest('Container Add Views by Config', function(t: Blend.testing.TestRunner) {
    var cntr = new UITestContainerView({
        views: [
            'ui.rect',
            'ui.rect'
        ]
    });
    t.clearBody(cntr.getElement());
    t.delay(function() {
        var el = cntr.getElement();
        t.equal(cntr.getBodyContentElement().children.length, 2, 'views add by config and rendered');
        t.done();
    })
});


TestRunner.defineTest('Container Add Views by API 1', function(t: Blend.testing.TestRunner) {
    var cntr = new UITestContainerView({
        views: [
            'ui.rect',
            'ui.rect'
        ]
    });
    cntr.addView('ui.rect');
    t.clearBody(cntr.getElement());
    t.delay(function() {
        var el = cntr.getElement();
        t.equal(cntr.getBodyContentElement().children.length, 3, 'view add API before render');
        t.done();
    })
});

TestRunner.defineTest('Container Add Views by API 2', function(t: Blend.testing.TestRunner) {
    var cntr = new UITestContainerView({
        views: [
            'ui.rect',
            'ui.rect'
        ]
    });
    t.clearBody(cntr.getElement());
    t.delay(function() {
        cntr.addView('ui.rect');
        var el = cntr.getElement();
        t.equal(cntr.getBodyContentElement().children.length, 3, 'view add API after render');
        t.done();
    })
});


TestRunner.defineTest('Container filter and children by config', function(t: Blend.testing.TestRunner) {

    var visibleChildren = function(view: Blend.ui.View, index: number) {
        return view.isVisible() === true;
    }

    var list: Array<Blend.ui.View> = [];
    var cntr = new UITestContainerView({
        views: [
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

    t.equal(cntr.getViews().length, 3, 'children added by config');
    //////////////////////////////////////////////

    list = cntr.getViews(visibleChildren);
    t.equal(list.length, 2);
    t.equal(list[1].getReference(), 'ref1', 'correct children filtered');

    t.done();

});

TestRunner.defineTest('Container Remove Views', function(t: Blend.testing.TestRunner) {
    var cntr = new UITestContainerView({
        views: [
            {
                ctype: 'ui.rect',
                color: 'red',
                text: 'red'
            },
            {
                ctype: 'ui.rect',
                color: 'green',
                text: 'green'
            },
            {
                ctype: 'ui.rect',
                color: 'blue',
                text: 'blue'
            }
        ]
    });
    t.clearBody(cntr.getElement());
    t.delay(function() {
        cntr.addView(cntr.removeView(1));
        var el = cntr.getElement();
        var testEl: HTMLElement = <HTMLElement>cntr.getBodyContentElement().childNodes[2];
        t.equal(cntr.getBodyContentElement().children.length, 3, 'view count after remove add');
        t.equal(testEl.innerHTML, 'green', 'view removed correctly');
        t.equal(cntr.getViews()[2].getAttribute<number>('childIndex'), 2, 'added view has correct childIndex');
        t.done();
    })
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


TestRunner.defineTest('Container Views', function(t: Blend.testing.TestRunner) {

    var view1 = new UITestContainerView();
    var c: Blend.ui.View;

    ///// STRING
    view1.addView('ui.rect');
    t.equal(view1.getViews().length, 1, 'string child added');

    c = view1.getViews()[0];
    t.isTrue(Blend.isInstanceOf(c, Blend.ui.Rectangle), 'string child is of correct type');

    ///// RECT INST
    view1.addView(new Blend.ui.Rectangle());
    t.equal(view1.getViews().length, 2, 'inst child added');

    c = view1.getViews()[1];
    t.isTrue(Blend.isInstanceOf(c, Blend.ui.Rectangle), 'inst child is of correct type');

    ///// COMPONENT CONFIG
    view1.addView({
        ctype: 'ui.rect'
    });
    t.equal(view1.getViews().length, 3, 'cc child added');

    c = view1.getViews()[2];
    t.isTrue(Blend.isInstanceOf(c, Blend.ui.Rectangle), 'cc child is of correct type');

    t.done();

});


TestRunner.defineTest('Container rendred', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        views: [
            'ui.rect',
            'ui.rect',
            'ui.rect'
        ]
    });

    t.clearBody(cntr.getElement());

    t.delay(function() {
        var el = cntr.getElement();
        t.equal(el.childNodes.length, 1, 'container=>body');
        t.equal(el.childNodes[0].childNodes.length, 3, 'container=>body=>content');
        t.equal(el.childNodes[0].childNodes[0].childNodes.length, 3, 'container=>body=>content=>3x rect');
        t.done();
    });

});