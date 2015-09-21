/// <reference path="../../typings/blend" />
/// <reference path="../TestFramework" />
/// <reference path="ui-view-commons" />

var testSplitters = function(t: Blend.testing.TestRunner, views: Array<Blend.ui.View>, tests: Array<string>) {
    t.equal(views.length, tests.length, 'correct number of views and splitter');
    if (views.length === tests.length) {
        Blend.forEach(tests, function(test: string, index: number) {
            var view = views[index];
            var vtype: string;
            if (Blend.isInstanceOf(view, Blend.ui.splitter.Splitter)) {
                vtype = 's';
            } else if (Blend.isInstanceOf(view, Blend.ui.Rectangle)) {
                vtype = 'r'
            } else {
                vtype = 'u';
                t.equal(vtype, 'r|s', 'not a rect or splitter to test')
            }
            t.equal(vtype, test, `View at index ${index} is correct`);
        });
    }
}

TestRunner.defineTest('mid-splitter-only', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        layout: {
            ctype: 'hbox'
        },
        width: 400,
        height: 400,
        views: [
            {
                ctype: 'ui.rect',
                flex: 1
            },
            {
                ctype: 'ui.rect',
                flex: 1,
                split: true
            },
            {
                ctype: 'ui.rect',
            }
        ]
    });

    t.clearBody(cntr.getElement());
    cntr.performLayout();

    t.delay(function() {
        testSplitters(t, cntr.getViews(), ['r', 's', 'r', 'r']);
        t.done();
    });
});


TestRunner.defineTest('mid-splitter-2', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        layout: {
            ctype: 'hbox'
        },
        width: 400,
        height: 400,
        views: [
            {
                ctype: 'ui.rect',
                flex: 1,
                split: true
            },
            {
                ctype: 'ui.rect',
                flex: 1
            },
            {
                ctype: 'ui.rect',
                split: true,
                flex: 1
            }
        ]
    });

    t.clearBody(cntr.getElement());
    cntr.performLayout();

    t.delay(function() {
        testSplitters(t, cntr.getViews(), ['r', 's', 'r', 's', 'r']);
        t.done();
    });
});


TestRunner.defineTest('mid-splitter', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        layout: {
            ctype: 'hbox'
        },
        width: 400,
        height: 400,
        views: [
            {
                ctype: 'ui.rect',
                flex: 1,
                split: true
            },
            {
                ctype: 'ui.rect',
                split: true,
                flex: 1
            },
            {
                ctype: 'ui.rect',
                flex: 1
            }
        ]
    });

    t.clearBody(cntr.getElement());
    cntr.performLayout();

    t.delay(function() {
        testSplitters(t, cntr.getViews(), ['r', 's', 'r', 's', 'r']);
        t.done();
    });
});

TestRunner.defineTest('mid-splitter', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        layout: {
            ctype: 'hbox'
        },
        width: 400,
        height: 400,
        views: [
            {
                ctype: 'ui.rect',
                flex: 1
            },
            {
                ctype: 'ui.rect',
                split: true,
                flex: 1
            },
            {
                ctype: 'ui.rect',
                flex: 1
            }
        ]
    });

    t.clearBody(cntr.getElement());
    cntr.performLayout();

    t.delay(function() {
        testSplitters(t, cntr.getViews(), ['r', 's', 'r', 'r']);
        t.done();
    });
});

TestRunner.defineTest('last-splitter', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        layout: {
            ctype: 'hbox'
        },
        width: 400,
        height: 400,
        views: [
            {
                ctype: 'ui.rect',
                flex: 1
            },
            {
                ctype: 'ui.rect',
                split: true,
                flex: 1
            }
        ]
    });

    t.clearBody(cntr.getElement());
    cntr.performLayout();

    t.delay(function() {
        testSplitters(t, cntr.getViews(), ['r', 's', 'r']);
        t.done();
    });
});

TestRunner.defineTest('first-splitter', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        layout: {
            ctype: 'hbox'
        },
        width: 400,
        height: 400,
        views: [
            {
                ctype: 'ui.rect',
                split: true,
                flex: 1
            },
            {
                ctype: 'ui.rect',
                flex: 1
            }
        ]
    });

    t.clearBody(cntr.getElement());
    cntr.performLayout();

    t.delay(function() {
        testSplitters(t, cntr.getViews(), ['r', 's', 'r']);
        t.done();
    });
});


TestRunner.defineTest('splitter-single-view', function(t: Blend.testing.TestRunner) {

    var cntr = new UITestContainerView({
        layout: {
            ctype: 'hbox'
        },
        width: 400,
        height: 400,
        views: [
            {
                ctype: 'ui.rect',
                split: true,
                flex: 1
            }
        ]
    });

    t.clearBody(cntr.getElement());
    cntr.performLayout();

    t.delay(function() {

        testSplitters(t, cntr.getViews(), ['r']);
        t.done();
    });
});