/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />


TestRunner.defineTest('container sanity', function(t: Blend.testing.TestRunner) {
    t.throws_exception(function() {
        var view1 = new Blend.ui.Container();
    }, 'Invalid or missing layout configuration for this Container!')
    t.done();
});


TestRunner.defineTest('container children', function(t: Blend.testing.TestRunner) {
    var view = new Blend.ui.Container({
        layout: 'flow',
        views: [
            {
                ctype: 'ui.rect'
            },
            {
                ctype: 'ui.rect'
            }
        ]
    });

    var app = new Blend.web.Application({
        mainView: view
    });
    app.run();
    t.delay(function() {
        var viewEl = view.getElement();
        var bodyEl = <HTMLElement>viewEl.children[0];
        t.hasCssClass(viewEl, 'b-container');
        t.equal(bodyEl.children.length, 2, 'has two children');
        t.hasCssClass(<HTMLElement>bodyEl.children[0], 'b-rectangle');
        t.hasCssClass(<HTMLElement>bodyEl.children[0], 'b-flow-layout-item');
        t.done();
    });
});